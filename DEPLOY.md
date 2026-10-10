# Deploying Milven (Docker + GitHub Actions)

This guide deploys the site to your own server using **Docker** and a **GitHub
Actions CI/CD pipeline**. On every push to `main`, GitHub builds the Docker
image, pushes it to **GitHub Container Registry (GHCR)**, then connects to your
server over SSH and rolls out the new container.

```
push to main ─► GitHub Actions ─► build image ─► push to ghcr.io
                                      │
                                      ▼
                             SSH deploy ─► docker compose pull + up -d
```

Files involved:

| File | Purpose |
| --- | --- |
| `Dockerfile` | Multi-stage production image (runs migrations on start) |
| `docker-entrypoint.sh` | Applies `prisma migrate deploy`, then starts Next |
| `docker-compose.prod.yml` | Postgres + web stack for the server |
| `.github/workflows/deploy.yml` | The CI/CD pipeline |
| `.env.production.example` | Server environment template |

---

## 1. Server prerequisites

On your server (Ubuntu/Debian recommended):

```bash
# Docker Engine + Compose plugin
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER   # log out/in afterwards
docker --version && docker compose version
```

Create the deploy directory:

```bash
sudo mkdir -p /opt/milven && sudo chown $USER /opt/milven
```

## 2. Server environment file

Copy the template and fill it in:

```bash
cd /opt/milven
nano .env
```

Base it on `.env.production.example`:

```env
POSTGRES_DB=milven
POSTGRES_USER=milven
POSTGRES_PASSWORD=<a-long-random-password>

NEXT_PUBLIC_SITE_URL=https://your-domain.com
AUTH_SECRET=<a-long-random-secret>          # openssl rand -hex 32

ADMIN_EMAIL=advisory@milven.co.zw
ADMIN_PASSWORD=<strong-password>
ADMIN_NAME=Milven Administrator

RESEND_API_KEY=<resend-key-or-blank>
CONTACT_TO_EMAIL=advisory@milven.co.zw
CONTACT_FROM_EMAIL=Milven Website <website@your-domain.com>

APP_PORT=3000
```

> `.env` lives only on the server and is never committed.

## 3. Configure GitHub

In your GitHub repo → **Settings**:

### 3a. Actions → General
- Enable **Read and write permissions** (the build job needs to push to GHCR).
- Workflow permissions: **Read and write**.

### 3b. Secrets and variables → Actions

**Secrets** (Repository secrets):

| Secret | Example | Notes |
| --- | --- | --- |
| `SSH_HOST` | `203.0.113.10` | Server IP / hostname |
| `SSH_USER` | `ubuntu` | SSH user |
| `SSH_KEY` | `-----BEGIN OPENSSH PRIVATE KEY-----…` | Private key **contents** |
| `SSH_PORT` | `22` | SSH port |
| `DEPLOY_PATH` | `/opt/milven` | Directory from step 1 |
| `GHCR_TOKEN` | `ghp_…` | A PAT (classic) with **`read:packages`** so the server can pull the image |

**Variables** (Repository variables):

| Variable | Example |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.com` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | *(optional)* |

> Generate the deploy key with `ssh-keygen -t ed25519`, put the **public** key in
> the server's `~/.ssh/authorized_keys`, and paste the **private** key into `SSH_KEY`.
>
> `GHCR_TOKEN`: create at GitHub → Settings → Developer settings → Personal access
> tokens (classic) with the `read:packages` scope. (Alternatively, set the GHCR
> package visibility to *Public* and you can skip the server login.)

## 4. Push the code

If this folder is not yet a git repository:

```bash
git init -b main
git add .
git commit -m "Milven website: premium UI, CMS, Docker + CI/CD"
git remote add origin git@github.com:<your-org>/<repo>.git
git push -u origin main
```

Pushing to `main` triggers the pipeline. Watch it under the repo's **Actions** tab.

## 5. First deploy + seed

The pipeline deploys the stack, but an empty database needs seeding **once**
(creates the admin user, pages, and insights):

```bash
cd /opt/milven
docker compose -f docker-compose.prod.yml run --rm web npx tsx prisma/seed.ts
```

Afterwards open `https://your-domain.com/admin/login` and sign in with
`ADMIN_EMAIL` / `ADMIN_PASSWORD`.

> Migrations run automatically on every container start (`prisma migrate deploy`),
> so they stay in sync on each deploy. Seeding is safe to re-run but will reset
> page content to the seed values, so do it only on a fresh database.

## 6. HTTPS reverse proxy

Run the app behind a reverse proxy for TLS. The app listens on `127.0.0.1:3000`.

**Caddy (automatic TLS):**

```caddy
your-domain.com {
    reverse_proxy 127.0.0.1:3000
}
```

**nginx + certbot:**

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo certbot --nginx -d your-domain.com
```

## 7. Subsequent deploys

Just push:

```bash
git add .
git commit -m "Update content"
git push
```

Or deploy manually on the server:

```bash
cd /opt/milven
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

## 8. Useful commands

```bash
# Logs
docker compose -f docker-compose.prod.yml logs -f web

# Restart web only
docker compose -f docker-compose.prod.yml restart web

# Open a shell in the app container
docker compose -f docker-compose.prod.yml exec web sh

# Run migrations manually
docker compose -f docker-compose.prod.yml exec web npx prisma migrate deploy

# Database backup
docker compose -f docker-compose.prod.yml exec db \
  pg_dump -U milven milven > backup-$(date +%F).sql
```

## Troubleshooting

- **`denied` when pulling the image** → the server isn't authenticated to GHCR.
  Check the `GHCR_TOKEN` secret has `read:packages`, or make the package public.
- **Migrations fail on start** → verify `DATABASE_URL`/`POSTGRES_PASSWORD` in
  `/opt/milven/.env` and that the `db` container is healthy (`docker compose ps`).
- **Uploaded images disappear after deploy** → they are stored in the `uploads`
  Docker volume (persisted). For multi-server setups, switch to S3/R2 (see README).
- **`next build` runs at image build time** with a dummy database URL; pages
  degrade gracefully, so no DB connection is required during CI.

> Docker is not installed in this local environment, so the image build was not
> executed here. The first GitHub Actions run will build it — check the Actions
> logs if anything needs adjusting.
