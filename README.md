# Obudu Conservation Centre — Website

Public site + custom content admin for the Obudu Conservation Centre (OCC).

- Public pages are a React single-page app, hosted on Vercel.
- Content for News, Reports and the Gallery lives in Sanity.io and is edited through a custom admin at `/admin/login`.
- The admin writes to Sanity through small serverless functions in `/api/admin/*`.

Live site: https://obuduconservationc.org *(update once the custom domain is attached)*

---

## Full documentation

Everything a new developer needs is in [`docs/`](./docs/):

- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — how the pieces fit together
- [`docs/ENVIRONMENT.md`](./docs/ENVIRONMENT.md) — every environment variable, where it's used, how to regenerate it
- [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) — deploying on Vercel, env vars, custom domain, rollbacks
- [`docs/CMS.md`](./docs/CMS.md) — Sanity schemas, upload flow, dataset export/restore
- [`docs/LICENSES.md`](./docs/LICENSES.md) — every dependency and its licence
- [`docs/DEVELOPER-TOOLS.md`](./docs/DEVELOPER-TOOLS.md) — declaration of any pre-existing developer code included in the project

Read **ARCHITECTURE.md** first — it gives you the mental model that makes the rest easier.

---

## Tech stack

- **Frontend**: React 19 + Vite 8 + React Router 7 + Tailwind CSS 3 + Framer Motion
- **CMS**: Sanity.io
- **Admin API**: Vercel serverless functions, session cookies via `jose`, password hashing via `bcryptjs`
- **Hosting**: Vercel (Production serves the `main` branch)

## Prerequisites

- **Node.js**: v20 or newer. `TODO: confirm` — no `engines` field is set in `package.json`, so this is a recommendation based on what's known to work. Node 20 LTS is a safe target; the admin uses `node --env-file=…` style features that require Node 20+.
- **npm**: ships with Node (v10+)
- Optional for full-stack local dev: the **Vercel CLI** (`npm install -g vercel`)

## Local setup

```bash
git clone <this-repo>
cd occ-website
npm install
```

### Run in UI-only mode (fast, no CMS writes)

```bash
npm run dev
```

Opens http://localhost:5173. Public pages work fully (they read from Sanity). The admin UI is reachable at `/admin/login` but any attempt to log in or write fails cleanly — the serverless functions in `/api/admin/*` don't run under Vite.

### Run full-stack locally (admin + CMS writes work)

```bash
npm install -g vercel     # one-time
vercel login
vercel link               # one-time: link this folder to the Vercel project
vercel dev                # starts Vite + serverless functions together on http://localhost:3000
```

This needs an `.env.local` file in the project root. See [`docs/ENVIRONMENT.md`](./docs/ENVIRONMENT.md) for the full list of variables and how to populate them.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server, UI only |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Serve the production build locally for inspection |
| `npm run lint` | Lint with oxlint |

## Deployment

Pushing to the `main` branch on GitHub triggers an automatic Production build on Vercel. Pushing to any other branch triggers a Preview build at a `.vercel.app` URL.

Full deployment details — Vercel setup, env var scopes, custom domain, rollbacks — are in [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md).
