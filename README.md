# Real Estate Management System (Habu) — Backend

REST API in **Node + Express + TypeScript** that implements the endpoint contract
consumed by the frontend (Next.js). Data is held **in memory**, seeded from the
frontend mocks, so response shapes match exactly what the UI expects.

> Business/domain values are in Spanish on purpose — Habu models a Colombian real
> estate agency. This README is in English for reviewers.

## Test users

| Role | Email | Password |
|---|---|---|
| Administrator | `admin@habu.com.co` | `admin123` |
| Advisor | `asesor@habu.com.co` | `asesor123` |

## Run locally

```bash
npm install
npm start        # http://localhost:4000
```

Quick check: open `http://localhost:4000/health` → it should return `estado: ok`.

## Architecture

- `src/index.ts` — Express server, CORS, public vs protected routes, error handling.
- `src/lib/` — `auth` (JWT + seeded users), `http` (`{data}`/`{error}` wrapper, pagination), `upload` (multipart).
- `src/store.ts` — **the single in-memory data source.** Isolated on purpose: migrating to Postgres means rewriting only this file.
- `src/routes/` — one file per module (clients, properties, contracts, payments, maintenance, chatbot, administration, account, auth).
- `src/seed/` — types and mocks copied from the frontend; they seed the data.

## Response contract

- Single object → `{ "data": { ... } }`
- List → `{ "data": [ ... ], "total", "pagina", "totalPaginas", ...summary }`
- Error → `{ "error": { "mensaje": "..." } }`
- Login → `{ "token", "usuario" }` (no wrapper)

## Deployment

Deployed on Render (free tier). See [`DEPLOY.md`](./DEPLOY.md) for the full guide.

> On Render's free tier the service sleeps after ~15 min of inactivity; the first
> request after it sleeps takes ~30–50 s. Hit `/health` a minute before a demo to
> wake it up.

## Note on persistence

Data lives in memory: creations/edits persist while the process is alive and reset
when the service restarts. For real persistence, replace `src/store.ts` with a
Postgres-backed layer — nothing else needs to change.
