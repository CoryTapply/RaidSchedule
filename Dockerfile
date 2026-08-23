# syntax=docker/dockerfile:1
FROM node:22-bookworm-slim AS deps
WORKDIR /app
# better-sqlite3 is a native addon: a prebuilt binary isn't published for every
# platform/arch/Node combo, so keep a source-build fallback (python3 + a C++
# toolchain) available. Build-only — this stage's node_modules gets pruned to
# production deps and copied into the slim runtime image, not this layer itself.
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/package.json
COPY packages/server/package.json packages/server/package.json
COPY packages/web/package.json packages/web/package.json
RUN npm ci

FROM deps AS build
COPY . .
RUN npm run build

FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
ENV DB_PATH=/data/raidschedule.db

# Litestream: streams the SQLite WAL to object storage and restores from it
# on boot. Needed on Cloud Run (ephemeral local disk between cold starts);
# a no-op on GKE/docker-compose, where a real volume already persists /data
# — entrypoint.sh only invokes it when LITESTREAM_BUCKET is set.
COPY --from=litestream/litestream:latest /usr/local/bin/litestream /usr/local/bin/litestream
COPY litestream.yml /app/litestream.yml
COPY entrypoint.sh /app/entrypoint.sh

COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/packages/shared/package.json packages/shared/package.json
COPY --from=build /app/packages/server/package.json packages/server/package.json
COPY --from=build /app/node_modules ./node_modules
RUN npm prune --omit=dev

COPY --from=build /app/packages/shared/dist packages/shared/dist
COPY --from=build /app/packages/server/dist packages/server/dist
COPY --from=build /app/packages/web/dist packages/web/dist

RUN mkdir -p /data && chown node:node /data && chmod +x /app/entrypoint.sh
VOLUME /data
EXPOSE 8080
USER node
ENTRYPOINT ["/app/entrypoint.sh"]
