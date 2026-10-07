# Architecture

A short tour of how the site is put together, aimed at a developer taking over the project.

## The three moving parts

```
┌────────────────────────┐      ┌───────────────────────┐      ┌────────────────┐
│  Visitor's browser     │      │  Vercel               │      │  Sanity.io     │
│  (React SPA)           │      │                       │      │                │
│                        │      │  ┌─────────────────┐  │      │  Document      │
│  Public pages          │─────▶│  │ Static assets   │  │      │  storage       │
│  /, /news, /gallery…   │      │  │ (dist/)         │  │      │  + Asset CDN   │
│                        │      │  └─────────────────┘  │      │                │
│  Admin pages           │      │                       │      │                │
│  /admin/*              │─────▶│  ┌─────────────────┐  │─────▶│                │
│                        │      │  │ Serverless fns  │  │      │                │
│                        │      │  │ /api/admin/*    │  │      │                │
│                        │◀─────│  └─────────────────┘  │◀─────│                │
└────────────────────────┘      └───────────────────────┘      └────────────────┘
       ▲                                                                 │
       │ public pages fetch content directly from Sanity (anonymous read)│
       └─────────────────────────────────────────────────────────────────┘
```

**One React app, three concerns:**

1. **Public pages** (`src/pages/*.jsx`) — rendered client-side. Visitors see them. They read content either from local JS files (`src/data/*`) or from Sanity (via the `src/data/get*FromSanity.js` fetchers).
2. **Admin pages** (`src/admin/*.jsx`) — rendered client-side at `/admin/*`. OCC staff see them. They talk to Vercel serverless functions via `fetch`.
3. **Serverless functions** (`api/admin/*.js`) — run on Vercel, not in the browser. They hold the Sanity write token and perform CRUD on behalf of a signed-in admin.

Sanity sits outside Vercel entirely. It's where every piece of CMS-managed content actually lives.

## Why the admin isn't baked into every visitor's download

`src/App.jsx` detects whether the current URL starts with `/admin`. If it does, it mounts the admin app via `React.lazy()`:

```js
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'))
```

That means the admin bundle (~43 KB gzipped) is only downloaded when someone actually visits an admin URL. Public visitors never pay the cost.

## Folder structure

```
├── public/              Static files served as-is from the root of the deployed site
│   ├── assets/          Logos, hero images, OG image, favicon
│   ├── robots.txt       SEO crawler directives (disallows /admin, /api)
│   └── sitemap.xml      Public URL list for search engines
├── src/
│   ├── pages/           One file per public page (Home, Team, AboutUs, Donate,
│   │                    News, Reports, Gallery, FoundersStory)
│   ├── components/
│   │   ├── layout/        Navbar, Footer
│   │   ├── shared/        HeroCarousel, Modal, Lightbox, ScrollReveal,
│   │   │                  ScrollToTop, Seo, VideoEmbed, PartnerMarquee
│   │   └── ui/            Button, Card, SectionHeading, ReadMore
│   ├── admin/           The /admin React app and its API client
│   │                      AdminApp.jsx          — routes
│   │                      AdminHeader.jsx       — top bar in every admin screen
│   │                      AuthProvider.jsx      — session context
│   │                      ProtectedRoute.jsx    — gates signed-in pages
│   │                      Dashboard.jsx         — admin landing
│   │                      Login.jsx
│   │                      NewsList.jsx + NewsForm.jsx
│   │                      ReportsList.jsx + ReportForm.jsx
│   │                      GalleryList.jsx + GalleryUpload.jsx + GalleryEdit.jsx
│   │                      api.js                — fetch wrappers for /api/admin/*
│   │                      imageResize.js        — browser-side resize + size caps
│   ├── data/            Content modules:
│   │                      Static (edited in code):  team.js, partners.js, founderStory.js
│   │                      Sanity fetchers:          getNewsFromSanity.js,
│   │                                                getReportsFromSanity.js,
│   │                                                getGalleryFromSanity.js
│   ├── lib/
│   │                      sanityClient.js       — public read client
│   │                      useSanityData.js      — shared hook for the three fetchers
│   │                      siteConfig.js         — site URL, OG defaults, socials
│   ├── App.jsx          Route table + lazy-split for /admin/*
│   ├── main.jsx         Entry point; mounts <HelmetProvider>, <BrowserRouter>, <App>
│   └── index.css        Tailwind + custom base styles
├── api/
│   ├── _lib/
│   │                      sanity.js            — server-side Sanity write client
│   │                      session.js           — JWT issue/verify + withAuth wrapper
│   │                      portableText.js      — text ↔ Portable Text helpers
│   └── admin/
│                           login.js            — bcrypt-check email+password, set cookie
│                           logout.js           — clear cookie
│                           me.js               — return the current signed-in user
│                           news.js             — GET list + POST create
│                           news/[id].js        — GET one + PATCH update + DELETE
│                           reports.js, reports/[id].js
│                           gallery.js, gallery/[id].js
├── studio/              Optional Sanity Studio (not deployed by default; see docs/CMS.md)
├── index.html           Minimal entry HTML — per-route meta tags come from <Seo>
├── vite.config.js       Includes a plugin that returns 503 for /api/* under `vite dev`
└── vercel.json          { "rewrites": [{ "source": "/((?!api/).*)", "destination": "/index.html" }] }
                          Sends every non-/api/ URL to index.html so React Router
                          can handle it; keeps /api/* on Vercel's own filesystem routing
                          so the dynamic routes (news/[id] etc.) resolve correctly.
```

## Where each page gets its data

| Page | Source | Files involved |
|---|---|---|
| `/` Home | Static (code) | `src/pages/Home.jsx` + `src/data/partners.js` |
| `/team` | Static (code) | `src/pages/Team.jsx` + `src/data/team.js` |
| `/about` | Static (code) | `src/pages/AboutUs.jsx` (inline copy) |
| `/founders-story` | Static (code) | `src/pages/FoundersStory.jsx` + `src/data/founderStory.js` |
| `/donate` | Static (code) | `src/pages/Donate.jsx` (inline copy) |
| `/news` | **Sanity CMS** | `src/pages/News.jsx` ← `getNewsFromSanity()` |
| `/reports` | **Sanity CMS** | `src/pages/Reports.jsx` ← `getReportsFromSanity()` |
| `/gallery` | **Sanity CMS** | `src/pages/Gallery.jsx` ← `getGalleryFromSanity()` |

Static means "to change it, edit the file and push a commit". CMS means "to change it, log into `/admin` and use the form".

Note on naming: the three fetchers were originally called `getPublicationsFromSanity`, `getReportsFromSanity` and were later renamed. The current names are the three listed above.

### How the Sanity fetchers work

All three live under `src/data/`. Each one is a simple async function:

```js
// src/data/getNewsFromSanity.js (simplified)
export async function getNewsFromSanity() {
  return sanityClient.fetch(`*[_type == "newsPost"] | order(date desc) {…}`)
}
```

They all share one Sanity client (`src/lib/sanityClient.js`), which is configured from the `VITE_SANITY_PROJECT_ID` / `VITE_SANITY_DATASET` environment variables.

Pages don't call these fetchers directly in a `useEffect` — they go through the shared `useSanityData` hook (`src/lib/useSanityData.js`), which:

- Calls the fetcher once on mount
- Returns `{ data, loading, error }`
- Treats any error as "no content yet" so a Sanity outage shows the page's empty state ("Coming Soon") rather than an error UI

### A note on caching

The Sanity client is created with `useCdn: false` on purpose. Sanity's CDN caches reads for about 60 seconds; without that flag, deletes and edits made in the admin don't appear on the public pages for up to a minute. With it off, every page view hits Sanity's live API — ~100-200 ms slower per request, but staff see edits immediately. The trade-off was deliberate given OCC's low public traffic and the "update instantly" expectation from staff.

## How content published in the CMS reaches the live site

Walkthrough of a staff member publishing a news post:

1. Staff goes to `/admin/login`, enters email + password.
2. React form posts `{ email, password }` to the serverless function `api/admin/login.js`.
3. The function reads `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH` from Vercel env vars, uses `bcryptjs.compare()` to verify the password, and on success signs a JWT with `SESSION_SECRET` and returns it as an `httpOnly` cookie called `occ_admin_session`.
4. Browser now holds the cookie. Staff navigates to `/admin/news/new`, fills in the form, picks a thumbnail.
5. Before the image goes anywhere, `src/admin/imageResize.js` resizes it in the browser to 2000 px max and encodes the result as a base64 data URL. If the file is already larger than 3 MB after that, the form shows an error instead of attempting the upload (Vercel's serverless body limit is ~4.5 MB).
6. The form submits a JSON payload (including the base64 image) to `api/admin/news.js` (POST). The browser automatically sends the session cookie.
7. The function calls `withAuth(handler)` (`api/_lib/session.js`), which verifies the JWT. If the session is invalid, 401. If valid, control passes to the handler.
8. The handler uses the server-side Sanity client (`api/_lib/sanity.js` — holds `SANITY_WRITE_TOKEN`) to upload the image as a Sanity asset, then creates a new `newsPost` document that references the asset.
9. Sanity returns the new document's `_id`. The function responds `201 { _id }`.
10. The admin UI redirects back to `/admin/news`, which calls `GET /api/admin/news` and refreshes the list.
11. Public visitor opens `/news` → page component calls `getNewsFromSanity()` → request goes straight to `cdn.sanity.io`'s live API (bypassing cache) → new post is in the response → React renders it.

The important detail is that the write token (`SANITY_WRITE_TOKEN`) never leaves the serverless function. The browser only ever sees the public, read-only `VITE_SANITY_PROJECT_ID` + `VITE_SANITY_DATASET` identifiers. That split is the whole security story.

## Where SEO per-route meta tags come from

Each public page renders a `<Seo>` component at its top. The component (`src/components/shared/Seo.jsx`) uses `react-helmet-async` to set the `<title>`, meta description, canonical URL and Open Graph / Twitter card tags for the current route. Defaults (site name, default OG image) come from `src/lib/siteConfig.js`.

Static tags that apply site-wide (favicon, theme-color, fonts, Organization JSON-LD) live in `index.html`.

**Known limitation**: social crawlers that don't execute JavaScript (Facebook, LinkedIn, WhatsApp) only see what's in `index.html`. They do not see the per-route tags that `<Seo>` injects. For properly branded social cards on sub-pages (`/news`, `/gallery`, etc.) the site needs pre-rendering (e.g. `vite-react-ssg`), tracked as future work.

## Development vs production API behaviour

The admin API only runs on Vercel (preview or production). Under `npm run dev`:

- Vite doesn't understand `/api/*` serverless functions
- A small Vite plugin in `vite.config.js` returns a 503 JSON response with an explanation
- The admin's `fetch` wrapper surfaces that as a readable error — "serverless functions are not active, use `vercel dev`"

To exercise the full stack locally, run `vercel dev` instead (described in `README.md` and `docs/DEPLOYMENT.md`).
