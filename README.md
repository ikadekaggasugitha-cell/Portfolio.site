# Portfolio.site

Personal portfolio application: a Laravel JSON API backend with a Next.js frontend, containerized for local development and deployed as two independent Vercel projects in production.

**Status: runnable.** Local stack starts via Docker Compose, and both production deployments are live and responding (frontend `200`, backend API `200`, database reachable over SSL).

## Architecture

```
Browser
  │
  ▼
Frontend — Next.js (Vercel project: site-portfolio)
  │  server-side rewrite: /api/v1/* → API_BACKEND_URL
  ▼
Backend — Laravel API (Vercel project: portfolio-backend-api, vercel-php runtime)
  │  JWT auth (tymon/jwt-auth), bcrypt password hashing
  ▼
Database — MySQL, managed by Aiven, TLS/SSL required
```

- **Frontend**: `frontend/` — Next.js (App Router). Public site + `/admin` panel that consumes the API.
- **Backend**: `backend/` — Laravel 11 JSON API under `/api/v1`, deployed on Vercel via the `vercel-php` runtime (see `backend/vercel.json`).
- **Database**: managed MySQL provisioned on [Aiven](https://aiven.io). Connections require TLS; the CA certificate is bundled at `backend/storage/certs/aiven-ca.pem` and referenced via `MYSQL_ATTR_SSL_CA` (see `backend/config/database.php`).

### Production

| Layer    | Where it runs | Notes |
|----------|---------------|-------|
| Frontend | Vercel project `site-portfolio` | Next.js `standalone` build |
| Backend  | Vercel project `portfolio-backend-api` | PHP on `vercel-php@0.7.2`, routed through `backend/api/index.php` |
| Database | Aiven-managed MySQL | Reached over SSL using the CA cert in `backend/storage/certs/`; connection details come from `DB_*` / `MYSQL_ATTR_SSL_CA` env vars, never committed |

The frontend never calls the backend directly from the browser — it rewrites `/api/v1/*` server-side to `API_BACKEND_URL` (see `frontend/next.config.ts`), so the two Vercel projects communicate server-to-server and the browser only ever talks to the frontend's own origin.

## Local development

Requires Docker and Docker Compose.

```bash
cp .env.example .env      # fill in DB/mail/JWT values for local use
./setup.sh                # generates backend/.env and frontend/.env.local from the root .env
make up                   # docker compose up -d
make migrate              # php artisan migrate
make seed                 # php artisan db:seed
```

Services (see `docker-compose.yml`):

- `portfolio-nginx` — reverse proxy, `http://localhost:8080`
- `portfolio-next` — Next.js dev server, `http://localhost:3000`
- `portfolio-api` — Laravel (PHP-FPM)
- `portfolio-mysql` / `portfolio-redis` / `portfolio-mailpit` — local DB, cache, mail
- `portfolio-worker` / `portfolio-scheduler` — queue worker + scheduler

Other useful `make` targets: `down`, `restart`, `logs`, `ps`, `shell-api`, `shell-next`, `test`.

## Accounts & authentication

Auth is JWT-based (`tymon/jwt-auth`). There is **no public self-registration route** — accounts are provisioned via `database/seeders/DatabaseSeeder.php` or `php artisan tinker`, and only an admin (`is_admin = true`) can reach the protected `/api/v1/...` management endpoints.

Passwords are never stored in plain text:

- `App\Models\User` casts `password` as `'hashed'`, so any mass-assignment through the model hashes automatically.
- `AuthService::register()` additionally calls `Hash::make()` explicitly.
- Hashing is bcrypt with `BCRYPT_ROUNDS=12` (see `backend/.env.example` / `setup.sh`).

The seeder creates two **local-only** accounts for development:

| Email | Password | Role |
|-------|----------|------|
| `admin@example.com` | `password` | admin |
| `test@example.com` | `password` | regular user |

⚠️ These are dev fixtures, not production credentials — rotate/replace them (`php artisan tinker` → update the seeded user's password, or add a fresh admin and delete the fixture one) before treating any environment as production. Production credentials are set directly in Vercel's environment variables and are never committed to the repo.

Log in to the admin panel at `/admin/login` on the frontend once an admin account exists.

## Environment variables

Root `.env` is the single source of truth for local dev; `setup.sh` splits it into `backend/.env` and `frontend/.env.local`. Key variables:

- `DB_*`, `MYSQL_ATTR_SSL_CA` — database connection (Aiven in production, local MySQL container in dev)
- `JWT_SECRET` — JWT signing key (backend)
- `API_BACKEND_URL` — used server-side by the frontend to reach the backend (rewrite target)
- `NEXT_PUBLIC_API_URL` — path the browser calls (`/api/v1`, proxied by the rewrite above)
- `FRONTEND_URL` — used by the backend's `/` route to redirect to the frontend

In production these are configured per-project in the Vercel dashboard (`vercel env`), not via committed `.env` files.
