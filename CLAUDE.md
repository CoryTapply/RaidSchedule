# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

RaidSchedule: a personal, single-user web app showing a rolling 21-day calendar of WoW raid signups, pulled from the raid-helper.xyz API and (phase 2, not yet built) custom events stored locally. See `design/README.md` for the full visual/interaction spec this UI was built against — it's still the source of truth for layout values, class colors, and interaction rules. The implementation plan this app was built from is recorded at `/Users/Cory/.claude/plans/i-want-this-to-dynamic-star.md` if deeper rationale is ever needed.

## Commands

All commands run from the repo root (npm workspaces).

- `npm install` — installs everything. **Requires `--legacy-peer-deps`** on this machine's npm/Node combo (npm 10.9.x hits an arborist bug — `Cannot read properties of null (reading 'edgesOut')` — resolving vitest 4's peer tree without it). `npm ci` (used in Docker) does not need the flag since it installs straight from the lockfile.
- `npm run dev` — runs the Fastify backend (`:3001`, via `tsx watch`) and the Vite dev server (`:5173`, or the next free port if that's taken, proxying `/api` to the backend) concurrently. Requires a `.env` at the repo root (copy `.env.example`) — the root script loads it via `dotenv-cli` (`dotenv -e .env -- concurrently ...`) before spawning both processes, since neither Node nor tsx reads `.env` files on their own. The server fails fast on boot if `APP_PASSWORD`, `SESSION_SECRET`, or `RAID_HELPER_API_KEY` end up missing.
- `npm run dev:coi` — same, but the Vite dev server also sets COOP/COEP headers (for future SharedArrayBuffer/threading use; nothing needs this yet).
- `npm run build` — builds `shared` → `web` → `server` in order (must happen in that order: `web` and `server` both consume `shared`'s compiled `dist/`, not its TS source).
- `npm run test` — runs each workspace's Vitest suite (`shared`: fast-check property tests on the calendar date helpers; `server`: Fastify route tests via `fastify.inject()`; `web`: React Testing Library component tests, jsdom).
- `npm run lint` — flat-config ESLint across all packages.
- `npm run typecheck` — builds `shared`, then type-checks `server` and `web` via `tsc -b`.
- Single test file: `npm run test -w @raidschedule/<shared|server|web> -- <path or -t "name">` (each package's `test` script is a plain `vitest run`).
- `docker build -t raidschedule .` then `docker run -p 8080:8080 -v raidschedule-data:/data --env-file .env raidschedule` (or `docker compose up --build`) — builds the single deployable image (frontend + backend in one container, SQLite on a volume at `/data`).

## Architecture

**npm workspaces monorepo, three packages, one Docker artifact:**

- `packages/shared` — `@raidschedule/shared`. Pure TS: the `RaidEvent`/`CharacterSignup` types, the calendar date-math (`startOfWeekSunday`, `lockoutStart`, `buildWindow`, `groupEventsByDateKey` — ported verbatim from the design prototype, see `design/README.md`), and the 13 hardcoded Blizzard class-color hexes. Has its own `tsc -b` build producing `dist/*.js` + `.d.ts`; both other packages consume it as a normal compiled dependency (not TS project references, not raw source) — **run `npm run build -w @raidschedule/shared` after changing anything here**, or its consumers will silently use a stale `dist/`.
- `packages/server` — Fastify. `src/app.ts` is the app factory (`buildApp()`, used directly by tests via `fastify.inject()` — no bound port needed). Route modules: `routes/auth.ts` (stateless signed-cookie session, no session store — single shared password from `APP_PASSWORD`), `routes/events.ts` (the merge point: currently just calls the raid-helper integration; phase 2's custom-events source gets concatenated in here). `integrations/raidHelper/` is the raid-helper.xyz proxy + normalization boundary — `normalize.ts` is the one file to touch if the live API response ever turns out to carry fields beyond what's documented (see below). `db/` is a SQLite (`better-sqlite3`) scaffold — migration runner + one no-op migration — wired up but not yet used by any route; it exists so the Docker volume/migration pipeline is proven before phase 2 needs it. `plugins/staticFrontend.ts` serves the built `packages/web/dist` and SPA-falls-back to `index.html` for any non-`/api` route.
- `packages/web` — Vite + React 19 SPA. `App.tsx` is a 2-state switch (`LoginPage` / `CalendarPage`, no router library) gated by `auth/AuthProvider.tsx`'s session check. `calendar/useCalendarState.ts` holds the **only** three pieces of state the design specifies (`anchor`, `selectedEvent`, `hoverLockoutKey`) — everything else (the 21 day objects, event grouping, which lockout week is active) is derived via `useMemo` from `@raidschedule/shared`'s date helpers. Don't add state beyond those three; derive instead.

### The raid-helper.xyz integration — verified against a live response

`GET /api/v4/users/{APIKEY}/events` was checked against a real response (602 events / 732 sign-ups), not just the docs. Confirmed: **no status/roster/"comp" field and no difficulty field** anywhere — `RaidEvent` has no `difficulty` field at all (the design's "Difficulty: Heroic" dialog line is intentionally dropped). The documented `closingTime` field is actually named `closeTime` in real responses.

The real surprise: **`className` on a sign-up is not always a WoW class.** A raid leader can configure any label as a sign-up button for their event template, so it's sometimes a role ("Tank"), sometimes an attendance marker ("Absence", "Tentative"), and sometimes an actual class name — all observed live, not hypothetical. `packages/server/src/integrations/raidHelper/normalize.ts` handles this (this is the one file to touch if another such quirk shows up):
- `className === 'Absence'` (case-insensitive) — the sign-up is **filtered out entirely**, not rendered as an event. It means the person isn't attending.
- `className === 'Tentative'` (case-insensitive) — mapped to `status: 'pending'` (hatched card). Every other value (including role labels like "Tank") maps to `status: 'confirmed'` (solid card).
- When `className` isn't a recognized `WowClass`, the class is **best-effort inferred from `specName`** via the `SPEC_TO_CLASS` lookup table. A few spec names are genuinely ambiguous across two classes (Protection: Warrior/Paladin, Holy: Paladin/Priest, Restoration: Shaman/Druid, Frost: Mage/Death Knight) — each has one arbitrary default in that table, called out in a comment. If it guesses the wrong class/color for a real character, that table is where to fix it.
- `fixtures/sample-raid-helper-response.json` (no longer "provisional" — its shape is verified) includes one sign-up of each kind (real class, role+spec, Absence, Tentative) so `normalize.test.ts` exercises all four paths.

### Responsive design

The standard and 4K prototypes (`design/Raid Calendar.dc.html` vs `design/Raid Calendar 4K.dc.html`) are implemented as **one component tree**, not two: `packages/web/src/styles/calendar.module.css`'s `.root` sets `container: calendar / inline-size` and defines every size/spacing value as a `clamp()` interpolating between the two prototypes' documented endpoints, keyed to container width (`cqi`). The two genuinely discrete differences (full vs. abbreviated weekday names, the `reset`/`today` day annotation) are driven by `calendar/useContainerBreakpoint.ts` (a `ResizeObserver` hook, threshold 1900px), not CSS alone — see that file's comment for why. If you need to retune a size, the clamp() coefficients are linear interpolations between the two design files' literal pixel values; recompute both endpoints from the `.dc.html` files rather than eyeballing a new coefficient.

### Styling

CSS Modules, no framework. `packages/web/src/styles/tokens.css` is a **vendored copy** of `design/_ds/nocturne-.../styles.css` — if the design system sheet changes, re-copy it rather than hand-editing the vendored one. The per-class event card colors (`eventCard.module.css`) pin `color-mix(in srgb, …)` as static CSS specifically to prevent the OKLCH regression `design/README.md` warns about (only the raw class hex varies, via the `--class-color` custom property) — don't move that logic into JS-generated inline styles. Note `.badgeColorPending`/`.badgeColorConfirmed` in `eventCard.module.css` are deliberately separate from the sizing-only `.badge` class (and are reused as-is by the dialog) — this split exists because combining sizing and color into one class caused a CSS Modules specificity collision when the same color rule needed to apply to a differently-sized badge; keep that separation if you touch either.

## Deployment

Production runs on Cloud Run (single service, scale-to-zero, live at
`raid.zerpy.dev`), built from the same root `Dockerfile` used locally.
Since Cloud Run's local disk doesn't survive a cold start, SQLite is kept
durable via Litestream (`litestream.yml`, `entrypoint.sh`): it streams the
WAL to a GCS bucket continuously and restores from it on boot. This is
transparent to the app — `better-sqlite3` still just opens a normal local
file — and only activates when `LITESTREAM_BUCKET` is set; unset (e.g.
plain `docker-compose up`), `entrypoint.sh` runs the server directly.
`max-instances=1` on the Cloud Run service is required, not just a cost
choice: both SQLite and Litestream assume a single writer. Full runbook,
including the `gcloud`/`docker buildx` commands to deploy or redeploy, is
in `deploy/cloudrun/README.md`.

## Known environment quirks

- `npm install` needs `--legacy-peer-deps` here (see Commands above).
- If you ever manually delete a package's `dist/` without also deleting its `*.tsbuildinfo`, `tsc -b` will think it's still up to date and skip regenerating output. `*.tsbuildinfo` is gitignored; if a build looks stale, `find . -name '*.tsbuildinfo' -not -path '*/node_modules/*' -delete` before rebuilding.
- Relative `DB_PATH` values resolve against the **workspace package's** cwd when run via `npm run dev -w @raidschedule/server` (npm sets cwd to that package dir), not the repo root — this is why `.env.example`'s `DB_PATH` is fine as a relative path for `npm run dev` (root-level, both processes share the concurrently-invoked cwd) but would land somewhere unexpected if you ever invoke the server workspace script directly. Docker always uses an absolute `DB_PATH=/data/raidschedule.db`, so this doesn't affect deployment.
- The Dockerfile's `deps` stage installs `python3 make g++` before `npm ci` — `better-sqlite3` is a native addon and no prebuilt binary was available for the build environment actually used (Node 22 linux/arm64), so it falls back to compiling from source via node-gyp, which needs those. Verified end-to-end: image builds, container runs, survives a restart with the SQLite volume intact.
- Don't let `.tsbuildinfo` files leak into the Docker build context — they're `.dockerignore`d (mirroring `.gitignore`) specifically because a stale one plus the `.dockerignore`d `dist/` caused `tsc -b` inside the image to think a package was already built and skip emitting output entirely.
