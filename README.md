# Sameh Naim Portfolio

A two-part project:

| Part | Where it runs | What's in it |
|------|---------------|--------------|
| **Frontend** | Lovable (or any static host / Node host) | TanStack Start app — public site |
| **Backend** | Your VPS (Docker Compose) | Express + Prisma + PostgreSQL + JWT admin |

The frontend can run in two modes (toggle live with the on-screen "Data Source" switch):
- **Mock mode** — uses bundled seed data in `src/lib/seed-data.ts`. No backend needed.
- **API mode** — calls your self-hosted backend at `VITE_API_BASE_URL`.

---

## Repository layout

```
.
├── backend/              # Express + Prisma API (deployed to your VPS)
│   ├── prisma/           # schema.prisma + seed.ts
│   ├── src/
│   │   ├── lib/          # prisma client, validation, JWT auth
│   │   └── routes/       # profile, skills, services, projects,
│   │                     # testimonials, plugins, contact, auth, admin
│   ├── Dockerfile
│   └── .env.example
├── docker-compose.yml    # Postgres + backend stack (run from repo root)
├── src/                  # TanStack Start frontend (Lovable)
│   ├── routes/           # /, /projects, /plugins, /services, /about, /contact
│   ├── components/site/  # Header, Footer, DataSourceSwitch, motion helpers
│   ├── lib/              # api-client, data-source toggle, seed-data
│   └── types/portfolio.ts
└── README.md             # ← you are here
```

---

## 1. Build & run the frontend (Lovable)

The frontend builds automatically on every Lovable preview. Locally:

```bash
bun install
bun run dev
```

To point it at your live backend, set `VITE_API_BASE_URL` (build-time) **or**
use the on-screen Data Source switch (runtime, stored in `localStorage`):

```bash
echo "VITE_API_BASE_URL=https://api.yourdomain.com" > .env.local
bun run dev
```

---

## 2. Build & run the backend (your VPS)

### Prerequisites on the VPS

- Docker 24+ and Docker Compose v2
- A domain pointing at the server (e.g. `api.yourdomain.com`)
- Caddy or Nginx in front for HTTPS (example Caddy snippet below)

### One-time setup

```bash
# On your VPS
git clone <this-repo> portfolio && cd portfolio

# 1. Configure environment
cp backend/.env.example backend/.env
nano backend/.env
#   - Set strong DB_PASSWORD
#   - Set FRONTEND_ORIGIN to your real frontend URL
#   - Set ADMIN_EMAIL + ADMIN_PASSWORD (admin login)
#   - Set JWT_SECRET to a 64-byte random hex:
#       openssl rand -hex 64
# Make sure DATABASE_URL matches the DB_USER/DB_PASSWORD/DB_NAME above.

# 2. Start the stack (Postgres + API)
docker compose up -d --build

# 3. Apply schema and seed initial content
docker compose exec backend npx prisma migrate deploy
docker compose exec backend npx prisma db seed

# 4. Verify
curl http://localhost:4000/healthz   # → {"ok":true}
curl http://localhost:4000/api/plugins
```

### Day-to-day operations

```bash
# View logs
docker compose logs -f backend

# Restart after editing .env
docker compose restart backend

# Pull new code & rebuild
git pull
docker compose up -d --build
docker compose exec backend npx prisma migrate deploy

# Backup the database
docker compose exec db pg_dump -U portfolio portfolio > backup-$(date +%F).sql

# Restore
cat backup-2026-01-01.sql | docker compose exec -T db psql -U portfolio portfolio
```

### Putting Caddy in front (recommended — auto HTTPS)

`/etc/caddy/Caddyfile`:

```
api.yourdomain.com {
    reverse_proxy localhost:4000
    encode gzip
}
```

Then close port 4000 to the world (`ufw deny 4000`) and only expose 80/443.

### Hardening checklist

- [ ] `FRONTEND_ORIGIN` is set to your real frontend domain (not `*`)
- [ ] `JWT_SECRET` is 64+ random hex characters
- [ ] `ADMIN_PASSWORD` is long (20+ chars) and unique
- [ ] Postgres port 5432 is **not** exposed publicly (remove the `ports:` mapping
      in `docker-compose.yml` for `db` once everything works)
- [ ] Daily `pg_dump` cron job
- [ ] Caddy/Nginx HTTPS in front, port 4000 firewalled
- [ ] `fail2ban` watching SSH

---

## 3. Connecting frontend ↔ backend

Once the backend is live at `https://api.yourdomain.com`:

1. Open the deployed site.
2. Click the **Data Source** switch (bottom-right floating widget).
3. Switch from "Mock" to "API", paste your URL, click "Test connection".
4. The whole site now renders live data.

The choice is stored in `localStorage` per visitor. To bake it in for everyone,
set `VITE_API_BASE_URL=https://api.yourdomain.com` and rebuild the frontend.

---

## 4. How admin access is secured

We use **JWT bearer tokens** with a single admin account whose credentials
live in `backend/.env` (never in the database, never in the frontend bundle).

### Threat model & mitigations

| Threat | Mitigation |
|---|---|
| Brute force on `/api/auth/login` | `express-rate-limit`: 10 attempts / 15 min / IP |
| Stolen JWT replay | Short expiry (`JWT_EXPIRES_IN=12h`), HTTPS-only via Caddy |
| Password leak from DB dump | Password is **not in the DB** — only in `.env` |
| `.env` exfiltration | File is in `.gitignore`, owned by root, mode `600` recommended |
| Username enumeration | Login returns the same `401 Invalid credentials` whether email or password is wrong; bcrypt compare runs even on unknown email (constant-ish timing) |
| CSRF on admin endpoints | Bearer-token auth (not cookies) — not vulnerable to CSRF |
| XSS stealing token | Token lives in `localStorage` of admin browser only; admin UI is served over HTTPS; no untrusted user content is rendered as HTML on the admin pages |
| Server-side injection | All inputs validated with Zod; Prisma uses parameterized queries; `helmet` sets safe headers |
| Privilege escalation | Single role (`admin`); no user-supplied role claims; JWT signed with server-only `JWT_SECRET` |

### Auth flow

```
POST /api/auth/login        body: { email, password }
                            → 200 { token, expiresIn }   on success
                            → 401 { error }              on bad credentials
                            → 429 after 10 failed tries / 15 min

GET  /api/auth/me           Authorization: Bearer <token>
                            → 200 { email, role: "admin" }

# Admin CRUD (all require Authorization: Bearer <token>):
GET    /api/admin/:slug
GET    /api/admin/:slug/:id
POST   /api/admin/:slug
PATCH  /api/admin/:slug/:id
DELETE /api/admin/:slug/:id

# Where :slug ∈ plugins | projects | services | skills |
#                testimonials | profile | messages
```

### Admin login from the command line

```bash
# 1. Get a token (12h validity)
TOKEN=$(curl -s -X POST https://api.yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@samehnaim.dev","password":"YOUR_ADMIN_PASSWORD"}' \
  | jq -r .token)

# 2. List plugins
curl https://api.yourdomain.com/api/admin/plugins \
  -H "Authorization: Bearer $TOKEN"

# 3. Add a new plugin
curl -X POST https://api.yourdomain.com/api/admin/plugins \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My New Plugin",
    "slug": "my-new-plugin",
    "description": "Does cool things in Moodle.",
    "category": "Moodle plugin",
    "url": "https://moodle.org/plugins/local_mynewplugin",
    "featured": true,
    "order": 10
  }'

# 4. Update a plugin
curl -X PATCH https://api.yourdomain.com/api/admin/plugins/<id> \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "featured": false }'

# 5. Delete
curl -X DELETE https://api.yourdomain.com/api/admin/plugins/<id> \
  -H "Authorization: Bearer $TOKEN"
```

> A small admin web UI is **not** included in this MVP. You can either:
> - Use the curl examples above
> - Use Prisma Studio over an SSH tunnel:
>   `ssh -L 5555:localhost:5555 vps "cd portfolio && docker compose exec backend npx prisma studio"`
> - Build a small `/admin` React page in a future iteration that calls these endpoints

### Rotating credentials

```bash
# Change the admin password
nano backend/.env          # update ADMIN_PASSWORD
docker compose restart backend

# Rotate JWT secret (invalidates ALL existing tokens — you'll have to log in again)
JWT_SECRET=$(openssl rand -hex 64) && nano backend/.env  # paste it in
docker compose restart backend
```

---

## 5. Editing site content

You have three editing paths, in order of convenience:

1. **Admin API** (production) — see "Admin login from the command line" above.
2. **Re-seed** (dev / fresh deploys) — edit `backend/prisma/seed.ts`, then:
   ```bash
   docker compose exec backend npx prisma db seed
   ```
   ⚠️ This **wipes** projects/services/skills/testimonials/plugins/profile and
   re-creates them. Contact messages are preserved.
3. **Mock mode in the frontend** (no backend) — edit `src/lib/seed-data.ts`
   and the changes ship with the next frontend build.

When the frontend is in API mode, mock edits are not visible to visitors —
only the database is.

---

## 6. Adding a new content type (recipe)

Say you want to add `Article`:

1. **Backend schema** — add a `model Article {}` to `backend/prisma/schema.prisma`.
2. **Migration** —
   ```bash
   docker compose exec backend npx prisma migrate dev --name add_articles
   ```
3. **Public route** — create `backend/src/routes/articles.ts` (copy `plugins.ts`).
4. **Register** it in `backend/src/index.ts` as `app.use("/api/articles", articlesRouter)`.
5. **Admin slug** — add `articles: "article"` to `slugMap` in
   `backend/src/routes/admin.ts`. CRUD is automatic.
6. **Frontend type** — add `Article` interface to `src/types/portfolio.ts`.
7. **Frontend client** — add `getArticles()` to `src/lib/api-client.ts`.
8. **Frontend page** — create `src/routes/articles.tsx` (copy `plugins.tsx`).
9. **Nav link** — add to `navItems` in `src/components/site/Header.tsx` and the
   sitemap in `src/components/site/Footer.tsx`.

That's it.
