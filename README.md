# Sameh Naim — Portfolio

Two-part project:

## 1. Frontend (this repo, runs on Lovable)

TanStack Start + React 19 + TypeScript + Tailwind CSS. Six pages:

- `/` — Home (hero, services, featured projects, tech stack, testimonials)
- `/projects` — Projects listing with type filter
- `/projects/$slug` — Project case study
- `/services` — Services & skills
- `/about` — About + milestones
- `/contact` — Contact form

Content lives in `src/lib/seed-data.ts` and is used directly when no backend API is configured. To switch to the live backend, set:

```
VITE_API_BASE_URL=https://api.yourdomain.com
```

## 2. Backend (in `backend/`, you self-host on your VPS)

Express + TypeScript + Prisma + PostgreSQL + Docker. Provides the REST API the frontend can talk to. **This is not run by Lovable** — it lives in this repo so you can clone it to your VPS and deploy it.

See [`backend/README.md`](./backend/README.md) for full setup instructions.

Quick version (from repo root):

```bash
cp backend/.env.example backend/.env
# edit backend/.env

docker compose up -d --build
docker compose exec backend npx prisma migrate deploy
docker compose exec backend npx prisma db seed
```

Backend will be live at `http://localhost:4000`. Put Nginx/Caddy in front for HTTPS in production.
