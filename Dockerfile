# syntax=docker/dockerfile:1

# ---------- deps ----------
FROM node:22-bookworm-slim AS deps
WORKDIR /app
RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# ---------- builder ----------
FROM node:22-bookworm-slim AS builder
WORKDIR /app
RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time public variables (baked into the client bundle)
ARG NEXT_PUBLIC_SITE_URL="http://localhost:3000"
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY=""
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY

# Dummy URL so `next build` can pre-render pages; DB queries degrade gracefully.
ENV DATABASE_URL="postgresql://build:build@127.0.0.1:5432/build?schema=public"
ENV NEXT_TELEMETRY_DISABLED=1

RUN npx prisma generate
RUN npm run build

# ---------- runner ----------
FROM node:22-bookworm-slim AS runner
WORKDIR /app
RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl ca-certificates wget \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY docker-entrypoint.sh ./docker-entrypoint.sh

RUN chmod +x ./docker-entrypoint.sh && mkdir -p /app/public/uploads

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=45s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/ >/dev/null 2>&1 || exit 1

ENTRYPOINT ["./docker-entrypoint.sh"]
