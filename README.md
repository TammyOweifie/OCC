# Obudu Conservation Centre — Website

Public site + content admin for the Obudu Conservation Centre (OCC). The public pages (`/news`, `/reports`, `/gallery`, etc.) read from a Sanity-hosted CMS; a custom admin at `/admin` lets OCC staff create and edit content without touching code.

Live site: https://obuduconservationc.org *(update when the custom domain is attached)*

---

## Tech stack

- **Frontend**: React 19 + Vite + React Router 7 + Tailwind CSS 3 + Framer Motion
- **CMS**: Sanity.io (dataset `production`, project ID `aib1nnox`)
- **Admin API**: Vercel serverless functions in `/api/admin/*` (session cookies via `jose`, password hashing via `bcryptjs`)
- **Hosting**: Vercel (Production serves `main` branch)

## Project structure

```
├── public/            Static assets served as-is (logos, OG image, robots.txt, sitemap.xml)
├── src/
│   ├── pages/         The 8 public pages
│   ├── components/    Shared UI, layout and page-building components
│   ├── admin/         The /admin React app (lazy-loaded; invisible to public visitors)
│   ├── data/          Static data (team, partners, founder story) + Sanity fetchers
│   └── lib/           Sanity client, SEO helpers, site config
├── api/
│   ├── _lib/          Shared helpers (Sanity write client, session, portable text)
│   └── admin/         Serverless CRUD endpoints for News, Reports, Gallery + auth
├── studio/            Optional Sanity Studio for power-user editing (not deployed by default)
├── index.html         Entry HTML (minimal — SEO tags set per-route via react-helmet-async)
├── vite.config.js
└── vercel.json        SPA rewrites (keeps /api/* on filesystem routing)
```

## Running locally

```bash
npm install
```

You can run the site in two modes depending on what you're testing:

### Mode 1: UI only (fast, no CMS writes)

```bash
npm run dev
```

Opens http://localhost:5173. Public pages read from Sanity. The admin UI is reachable at `/admin/login` but any attempt to actually log in or write fails because `/api/admin/*` serverless functions don't run under Vite — a Vite plugin returns a clear 503 explaining this.

### Mode 2: Full stack (admin + CMS writes work locally)

Requires Vercel CLI:

```bash
npm install -g vercel
vercel login
vercel link        # one-time: link this folder to the Vercel project
vercel dev         # runs Vite + serverless functions together on http://localhost:3000
```

Needs a `.env.local` file in the project root with the env vars listed below.

## Environment variables

`.env.local` on your machine, and matching values in **Vercel → Settings → Environment Variables** for Preview and Production scopes. See `.env.example` for the full list with inline comments.

| Var | Type | Scope | Purpose |
|---|---|---|---|
| `SANITY_PROJECT_ID` | Sensitive | Prod + Preview | Server-side Sanity client |
| `SANITY_DATASET` | Sensitive | Prod + Preview | Server-side Sanity client (`production`) |
| `SANITY_WRITE_TOKEN` | Sensitive | Prod + Preview | Lets `/api/admin/*` write to Sanity. Never expose to the client. |
| `ADMIN_EMAIL` | Sensitive | Prod + Preview | The one admin account's email |
| `ADMIN_PASSWORD_HASH` | Sensitive | Prod + Preview | bcrypt hash of the admin password (never the password itself) |
| `SESSION_SECRET` | Sensitive | Prod + Preview | Signs the JWT in the admin session cookie (96 hex chars) |
| `VITE_SANITY_PROJECT_ID` | **Config** | Prod + Preview | Public read client. Baked into client bundle — safe because it's a public identifier. |
| `VITE_SANITY_DATASET` | **Config** | Prod + Preview | Public read client. Same reasoning. |

### Regenerating admin credentials

```bash
# Password hash (replace YOUR_NEW_PASSWORD):
node -e "console.log(require('bcryptjs').hashSync('YOUR_NEW_PASSWORD', 12))"

# Session secret (96 hex chars):
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

After changing either in Vercel, click **Deployments → ⋯ → Redeploy** on the latest Production build — env var changes don't auto-redeploy.

## The admin

- URL: `https://obuduconservationc.org/admin/login`
- Single admin account (email + password in env vars above)
- Can create / edit / delete News posts, Reports, Gallery photos
- Image uploads are resized to 2000px wide in the browser before upload (keeps request bodies under Vercel's 4.5 MB serverless limit)
- Session lasts 8 hours (JWT in an httpOnly cookie)

Known limitations:
- One admin account. Multi-user auth is planned ("Option 1" from the handover discussion) but not built. If the password is forgotten today, regenerate the hash per the instructions above.
- PDFs larger than ~3 MB will be rejected with a friendly size-cap message. For bigger PDFs, compress first (Smallpdf etc.) or implement direct-upload-to-Sanity.
- No password reset UI — ask the person who set up the deployment to regenerate.

## Content model

Three types live in Sanity (schemas in `studio/schemas/`):

- **`newsPost`** — Field notes, community stories, updates
- **`report`** — Progress reports; optional PDF attachment
- **`galleryImage`** — Photos with alt text, optional caption, manual `orderRank`

Public pages render whatever's in Sanity on page load (no cache — `useCdn: false` so edits appear immediately). If Sanity is unreachable, each page shows its "Coming Soon" empty state rather than an error.

Non-CMS content (`src/data/`) is still code-managed:
- `team.js` — Core team + board member names, roles, bios
- `partners.js` — Partner logos for the home-page marquee
- `founderStory.js` — The Founder's Story page content

To edit any of these, change the file and push to `main`.

## Deployment

Every push to `main` → auto-build and deploy to Production on Vercel.
Every push to any other branch → auto-build to a Preview URL.

Vercel's Production Branch is set to `main` under **Settings → Git**.

## Sanity

- Project ID: `aib1nnox`
- Dataset: `production` (Public visibility; readable without a token)
- CORS origins allow the production domain + Vercel preview URLs
- Dashboard: https://www.sanity.io/manage/personal/project/aib1nnox

## SEO + social

- Per-route `<title>`, meta description, canonical, Open Graph and Twitter cards via `react-helmet-async` (see `src/components/shared/Seo.jsx`)
- `robots.txt` disallows `/admin` and `/api`
- `sitemap.xml` lists all public URLs
- NGO Organization structured data (JSON-LD) is in `index.html`
- Known limitation: social crawlers that don't execute JS (Facebook, LinkedIn, WhatsApp) see no OG tags on sub-pages. Pre-rendering is the proper fix — tracked as a follow-up.

Submit the sitemap to Google Search Console after any domain change.

## Scripts

```bash
npm run dev        # Vite dev server (UI only, no admin API)
npm run build      # Production build → dist/
npm run preview    # Preview the production build locally
npm run lint       # oxlint
```

## When something breaks

- **Public pages show "Coming Soon" for all content**: Sanity is probably unreachable. Check status.sanity.io and verify CORS origins include the current domain.
- **Admin login returns 500**: usually a missing or malformed env var in Vercel. Check `/api/admin/login`'s stack trace in **Vercel → Observability → Logs**.
- **Image upload returns 413**: file is larger than the ~3 MB cap. The admin surfaces a friendly error — shrink the file first.
- **Dynamic admin routes return HTML instead of JSON**: `vercel.json`'s rewrite rule must exclude `/api/*` — see the current config.

## Credits

Built by Tammy for Obudu Conservation Centre, 2026.
