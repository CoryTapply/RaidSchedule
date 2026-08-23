# Deploying RaidSchedule to Cloud Run

Single service, scale-to-zero, fronted by Cloud Run's built-in domain
mapping (free managed HTTPS, no separate load balancer). SQLite persists
across cold starts via Litestream, which streams the WAL to a GCS bucket and
restores from it on boot (see `entrypoint.sh` and `litestream.yml` at the
repo root, and the comment in `Dockerfile`).

At "a handful of requests/day" this runs close to $0/month — Cloud Run bills
per-request/CPU-time with `min-instances=0`, so there's no charge while idle
and no other fixed infrastructure cost.

`max-instances=1` is required, not just a cost optimization: SQLite is
single-writer, and Litestream itself isn't safe with more than one instance
replicating the same database concurrently.

Fill in `<PROJECT>`, `<REGION>`, `<TAG>`, and the domain before running.

## 1. Enable APIs

```sh
gcloud services enable run.googleapis.com secretmanager.googleapis.com --project=<PROJECT>
```

## 2. Create the Litestream bucket

```sh
gcloud storage buckets create gs://<PROJECT>-litestream --project=<PROJECT> --location=<REGION> --uniform-bucket-level-access
```

## 3. Build and push the image

Must target `linux/amd64` if building on Apple Silicon — Cloud Run runs
amd64, and a plain `docker build` on an M-series Mac produces an arm64
image that fails at container start with `exec format error`:

```sh
docker buildx build --platform linux/amd64 \
  -t <REGION>-docker.pkg.dev/<PROJECT>/raidschedule/raidschedule:<TAG> \
  --push .
```

## 4. Create a dedicated service account

```sh
gcloud iam service-accounts create raidschedule-run \
  --display-name="RaidSchedule Cloud Run service account" --project=<PROJECT>

gcloud storage buckets add-iam-policy-binding gs://<PROJECT>-litestream \
  --member="serviceAccount:raidschedule-run@<PROJECT>.iam.gserviceaccount.com" \
  --role="roles/storage.objectAdmin" --project=<PROJECT>
```

## 5. Create secrets

```sh
gcloud secrets create app-password --replication-policy=automatic --project=<PROJECT>
gcloud secrets create session-secret --replication-policy=automatic --project=<PROJECT>
gcloud secrets create raid-helper-api-key --replication-policy=automatic --project=<PROJECT>

printf '%s' 'your-app-password' | gcloud secrets versions add app-password --data-file=- --project=<PROJECT>
node -e 'console.log(require("crypto").randomBytes(32).toString("hex"))' | tr -d '\n' | gcloud secrets versions add session-secret --data-file=- --project=<PROJECT>
printf '%s' 'your-raid-helper-api-key' | gcloud secrets versions add raid-helper-api-key --data-file=- --project=<PROJECT>

for secret in app-password session-secret raid-helper-api-key; do
  gcloud secrets add-iam-policy-binding "$secret" \
    --member="serviceAccount:raidschedule-run@<PROJECT>.iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor" --project=<PROJECT>
done
```

## 6. Deploy

```sh
gcloud run deploy raidschedule \
  --image=<REGION>-docker.pkg.dev/<PROJECT>/raidschedule/raidschedule:<TAG> \
  --region=<REGION> \
  --project=<PROJECT> \
  --service-account=raidschedule-run@<PROJECT>.iam.gserviceaccount.com \
  --set-env-vars="DB_PATH=/data/raidschedule.db,LITESTREAM_BUCKET=<PROJECT>-litestream" \
  --set-secrets="APP_PASSWORD=app-password:latest,SESSION_SECRET=session-secret:latest,RAID_HELPER_API_KEY=raid-helper-api-key:latest" \
  --min-instances=0 --max-instances=1 \
  --port=8080 \
  --allow-unauthenticated
```

Check the boot log for confirmation Litestream is replicating (not just the
app starting):

```sh
gcloud run services logs read raidschedule --region=<REGION> --project=<PROJECT> --limit=30
```

Look for `"replicating to" type=gs ...` and, on a cold start after data
already exists, `"detected database behind replica"` / `"fetched latest L0
file from replica"` — that second pair is the actual restore-on-boot
working, not just replication being configured.

## 7. Domain mapping

Requires the `beta` component (`gcloud components install beta`) — fully
managed Cloud Run domain mappings aren't under the GA `run` command group:

```sh
gcloud beta run domain-mappings create --service=raidschedule --domain=<your-domain> --region=<REGION> --project=<PROJECT>
```

This prints the DNS record to add — typically a `CNAME` to
`ghs.googlehosted.com.`. If the domain previously pointed elsewhere (e.g. an
old `A` record from some other host), **replace** that record rather than
adding the CNAME alongside it; a name can't have both.

**Expect a real delay here if you're switching DNS from an existing record**,
not just normal cert-issuance time: Google's cert validation checks DNS from
many vantage points, and any of them still holding the *old* record in cache
(for up to its full previous TTL) will report the challenge as not visible
and retry later. This is not a misconfiguration — check
`dig <your-domain> CNAME @<one of the authoritative nameservers, from
NS <domain>>` directly to confirm the authoritative answer is already
correct; if so, it's just waiting out old caches elsewhere, which resolves
on its own:

```sh
gcloud beta run domain-mappings describe --domain=<your-domain> --region=<REGION> --project=<PROJECT> --format="yaml(status.conditions)"
```

Watch for `type: Ready` / `type: CertificateProvisioned` to both report
`status: 'True'`. The direct `*.run.app` URL from the `deploy` step works
the whole time regardless — there's no actual downtime, only the custom
domain is delayed.

## Redeploying after a code change

Always push under a new tag — Cloud Run won't re-pull a tag it's already
resolved, so reusing one after pushing new content under it will silently
keep running the old image:

```sh
docker buildx build --platform linux/amd64 \
  -t <REGION>-docker.pkg.dev/<PROJECT>/raidschedule/raidschedule:<NEW_TAG> \
  --push .
gcloud run deploy raidschedule --image=<REGION>-docker.pkg.dev/<PROJECT>/raidschedule/raidschedule:<NEW_TAG> --region=<REGION> --project=<PROJECT>
```

Cloud Run's revision model makes this a clean rollout on its own — no manual
stop/start ordering needed — but `max-instances=1` still matters here for
the same underlying reason it's set at all: Litestream and SQLite both
assume a single writer.
