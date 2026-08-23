#!/bin/sh
set -e

# LITESTREAM_BUCKET is only set on Cloud Run, where local disk doesn't
# survive a cold start. With docker-compose (a real volume at DB_PATH's
# directory) it's unset and the app runs directly, unchanged.
if [ -n "$LITESTREAM_BUCKET" ]; then
  litestream restore -if-replica-exists -config /app/litestream.yml "$DB_PATH"
  exec litestream replicate -config /app/litestream.yml -exec "node packages/server/dist/index.js"
else
  exec node packages/server/dist/index.js
fi
