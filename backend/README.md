# Sameh Naim Portfolio — Backend (self-hosted)

This is the backend API for the portfolio site. It is **not** run by Lovable — it lives in this repo so you can clone it to your VPS, run it with Docker, and point the frontend at it.

## Stack

- Node.js 20 + TypeScript
- Express 4
- Prisma ORM
- PostgreSQL 16
- Zod for validation
- Helmet + CORS + rate limiting

## Quick start (Docker)

From the **repository root** (one level above this folder):

```bash
# 1. Configure environment
cp backend/.env.example backend/.env
# edit backend/.env to set strong DB credentials and your frontend origin

# 2. Start Postgres + backend
docker compose up -d --build

# 3. Run migrations and seed
docker compose exec backend npx prisma migrate deploy
docker compose exec backend npx prisma db seed
```

The API will be available at `http://localhost:4000`.

## Running locally (without Docker)

You'll need PostgreSQL 14+ running somewhere reachable.

```bash
cd backend
cp .env.example .env
# edit .env with your local DB connection

npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

## Environment variables

| Var | Description |
|---|---|
| `DB_HOST` | Postgres host |
| `DB_PORT` | Postgres port (5432) |
| `DB_USER` | Postgres user |
| `DB_PASSWORD` | Postgres password |
| `DB_NAME` | Database name |
| `DATABASE_URL` | Full Postgres URL (auto-built from the above in `prisma.ts` if not set) |
| `FRONTEND_ORIGIN` | Allowed CORS origin (e.g. `https://samehnaim.dev`) |
| `PORT` | API port (default 4000) |

## API endpoints

### Public

| Method | Path | Notes |
|---|---|---|
| GET | `/api/profile` | Returns `UserProfile` |
| GET | `/api/skills?category=` | List skills, optionally filtered |
| GET | `/api/services` | List services |
| GET | `/api/projects?type=&featured=` | List projects with optional filters |
| GET | `/api/projects/:slug` | One project |
| GET | `/api/testimonials` | List testimonials, ordered |
| GET | `/api/plugins` | List plugins (Moodle/WordPress/etc), ordered |
| POST | `/api/contact` | Create contact message (rate-limited, Zod-validated) |
| GET | `/healthz` | Health check |

### Admin (JWT-protected — see top-level `README.md` for full details)

| Method | Path | Notes |
|---|---|---|
| POST | `/api/auth/login` | Body `{email,password}` → `{token,expiresIn}`. Rate-limited 10/15min. |
| GET | `/api/auth/me` | Returns current admin (requires `Authorization: Bearer <token>`) |
| GET\|POST\|PATCH\|DELETE | `/api/admin/:slug[/:id]` | Generic CRUD. `slug` ∈ `plugins,projects,services,skills,testimonials,profile,messages` |

## Connecting the frontend

In your Lovable frontend (or wherever it's deployed), set:

```
VITE_API_BASE_URL=https://api.yourdomain.com
```

The frontend's `src/lib/api-client.ts` will automatically switch from seed data to live API calls.

## Production checklist

- Put Nginx or Caddy in front of the API for HTTPS.
- Lock `FRONTEND_ORIGIN` to your real frontend domain (not `*`).
- Use a managed Postgres or back up the Docker volume.
- Set up `pg_dump` cron backups.
- Monitor with whatever you already use (Uptime Kuma, etc.).

## Updating content

The seed file at `prisma/seed.ts` mirrors `src/lib/seed-data.ts` in the frontend. To change content, you can either:

1. Edit the seed file and re-run `npx prisma db seed`, or
2. Connect to the DB directly and update rows.

A future iteration could add a small admin UI — not included in this MVP.
