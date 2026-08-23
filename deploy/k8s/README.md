# Deploying RaidSchedule to GKE Autopilot

> **Historical reference only.** This was deployed and verified live at
> `raid.zerpy.dev`, then decommissioned in favor of `deploy/cloudrun/` —
> for one user with a handful of requests/day, GKE's ~$0.10/hr cluster
> management fee (waived only for zonal, not the regional cluster created
> here) plus the GCE Ingress's flat forwarding-rule cost put this around
> ~$100/month, versus near-$0 on Cloud Run's scale-to-zero pricing. Kept
> here in case GKE is ever worth revisiting (e.g. multiple concurrent
> services, or workloads that don't fit Cloud Run's request/response model).

Single-replica deployment on GKE Autopilot, fronted by a GCE Ingress with a
Google-managed HTTPS certificate. The app is single-user with a SQLite file
on a `ReadWriteOnce` PersistentVolumeClaim, so this intentionally never runs
more than one pod at a time (see the comment in `deployment.yaml`).

Fill in `<PROJECT>`, `<REGION>`, `<TAG>`, and the domain before applying.

## 1. Prerequisites

- A GCP project with billing enabled.
- `gcloud` installed and authenticated: `gcloud init`.
- A domain you control, to point at the app once it has a static IP.

## 2. Enable APIs

```sh
gcloud services enable container.googleapis.com artifactregistry.googleapis.com compute.googleapis.com --project=<PROJECT>
```

## 3. Create the Artifact Registry repo

```sh
gcloud artifacts repositories create raidschedule \
  --repository-format=docker --location=<REGION> --project=<PROJECT>
```

## 4. Build and push the image

Reuses the repo root `Dockerfile` unmodified:

```sh
gcloud builds submit --tag <REGION>-docker.pkg.dev/<PROJECT>/raidschedule/raidschedule:<TAG> \
  --project=<PROJECT> .
```

(Or, if you'd rather not use Cloud Build, build locally with `docker buildx`
— **must** target `linux/amd64` explicitly if you're building on Apple
Silicon, since GKE Autopilot nodes are amd64 and a plain `docker build` on an
M-series Mac produces an arm64 image that fails at container start with
`exec format error`:

```sh
docker buildx build --platform linux/amd64 \
  -t <REGION>-docker.pkg.dev/<PROJECT>/raidschedule/raidschedule:<TAG> \
  --push .
```
)

## 5. Create the Autopilot cluster

```sh
gcloud container clusters create-auto raidschedule --region=<REGION> --project=<PROJECT>
gcloud container clusters get-credentials raidschedule --region=<REGION> --project=<PROJECT>
```

## 6. Reserve a static IP

```sh
gcloud compute addresses create raidschedule-ip --global --project=<PROJECT>
gcloud compute addresses describe raidschedule-ip --global --project=<PROJECT> --format='value(address)'
```

Point your domain's `A` record at the printed address.

## 7. Create the namespace and secret

```sh
kubectl apply -f deploy/k8s/namespace.yaml

kubectl create secret generic raidschedule-secrets -n raidschedule \
  --from-literal=APP_PASSWORD='<your password>' \
  --from-literal=SESSION_SECRET="$(node -e 'console.log(require("crypto").randomBytes(32).toString("hex"))')" \
  --from-literal=RAID_HELPER_API_KEY='<your raid-helper.xyz API key>'
```

## 8. Fill in placeholders

- `deployment.yaml`: set the container `image` to the tag pushed in step 4.
- `managed-cert.yaml`: set `spec.domains` to your real domain.

## 9. Apply everything else

```sh
kubectl apply -f deploy/k8s/pvc.yaml
kubectl apply -f deploy/k8s/deployment.yaml
kubectl apply -f deploy/k8s/service.yaml
kubectl apply -f deploy/k8s/frontendconfig.yaml
kubectl apply -f deploy/k8s/managed-cert.yaml
kubectl apply -f deploy/k8s/ingress.yaml
```

## 10. Verify

```sh
kubectl get pods -n raidschedule                     # 1/1 Running
kubectl get managedcertificate -n raidschedule        # Status: Active (can take 30-60 min)
kubectl get ingress -n raidschedule                   # ADDRESS matches the reserved static IP
```

Then load `https://<your-domain>` — should serve the login page over valid
HTTPS with no cert warning, and logging in with `APP_PASSWORD` should reach
the calendar view.

To confirm the PVC actually persists data, delete the pod and check nothing
was lost:

```sh
kubectl delete pod -n raidschedule -l app=raidschedule
# wait for the replacement pod to become Ready, then reload the app —
# any events/sessions created earlier should still be there.
```

## Redeploying after a code change

Always push under a **new tag**, not a reused one — the default
`imagePullPolicy` is `IfNotPresent`, so if a node already has e.g. `:v1`
cached locally, reapplying a manifest that still says `:v1` after pushing a
new image under that same tag will *not* trigger a re-pull; the node just
keeps running what it already has cached.

```sh
docker buildx build --platform linux/amd64 \
  -t <REGION>-docker.pkg.dev/<PROJECT>/raidschedule/raidschedule:<NEW_TAG> \
  --push .
# update the image tag in deployment.yaml, then:
kubectl apply -f deploy/k8s/deployment.yaml
```

The `Recreate` rollout strategy stops the old pod before starting the new
one, which is required since both would otherwise contend for the same
`ReadWriteOnce` volume and the same SQLite file.
