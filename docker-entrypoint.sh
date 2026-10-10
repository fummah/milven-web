#!/bin/sh
set -e

echo "==> Applying database migrations (prisma migrate deploy)..."
npx prisma migrate deploy

# If a command was passed (e.g. a one-off seed), run it instead of the server.
if [ "$#" -gt 0 ]; then
  exec "$@"
fi

echo "==> Starting Milven web (port ${PORT:-3000})..."
exec npx next start -p "${PORT:-3000}" -H 0.0.0.0
