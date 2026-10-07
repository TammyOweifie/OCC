# Environment variables

Every variable the project reads at build time or at runtime. **This document contains no secret values** — only descriptions of what each variable is for and how to generate or find one. The real values live in Vercel's dashboard and (for local development) in `.env.local`.

## Variables at a glance

Eight required (six server + two client) and two optional:

| Name | Where it runs | Type in Vercel | Required scope |
|---|---|---|---|
| `SANITY_PROJECT_ID` | Server (`/api/admin/*`) | Sensitive | Preview + Production |
| `SANITY_DATASET` | Server (`/api/admin/*`) | Sensitive | Preview + Production |
| `SANITY_WRITE_TOKEN` | Server (`/api/admin/*`) | Sensitive | Preview + Production |
| `ADMIN_EMAIL` | Server (`/api/admin/login`) | Sensitive | Preview + Production |
| `ADMIN_PASSWORD_HASH` | Server (`/api/admin/login`) | Sensitive | Preview + Production |
| `SESSION_SECRET` | Server (`/api/admin/*`) | Sensitive | Preview + Production |
| `VITE_SANITY_PROJECT_ID` | Client (browser bundle) | **Config** | Preview + Production |
| `VITE_SANITY_DATASET` | Client (browser bundle) | **Config** | Preview + Production |
| `SANITY_API_VERSION` | Server (`/api/admin/*`) | Sensitive | Optional — has a default |
| `VITE_SANITY_API_VERSION` | Client (browser bundle) | **Config** | Optional — has a default |

Two further variables (`NODE_ENV`, `VERCEL`) are read by the serverless functions but set automatically by the runtime — you never configure them yourself. They're documented at the bottom for completeness.

### Why some are "Sensitive" and some are "Config"

Vercel distinguishes between variables that stay on the server and variables that are bundled into client JavaScript. Vite's convention is that anything prefixed with `VITE_` is baked into the browser bundle at build time, so Vercel asks you to mark those as **Config** — a signal that you've acknowledged they're public. The others never leave the serverless function at runtime; they're **Sensitive**.

The two `VITE_*` variables above are safe to expose because they only identify a Sanity project and dataset. Reading from that project is further gated by CORS rules you configure in Sanity itself.

**Never prefix anything with `VITE_` unless you intend it to be publicly visible in the client bundle.**

---

## Server-side variables (never prefixed with `VITE_`)

### `SANITY_PROJECT_ID`
**What it is**: The alphanumeric identifier of the OCC Sanity project (visible in the Sanity dashboard URL and at the top of the project page).

**Where it's used**: `api/_lib/sanity.js` creates the server-side Sanity client with this value. Every `/api/admin/*` route that reads or writes content uses that client.

**Where to find it**: https://www.sanity.io/manage → OCC project → the ID appears next to the project name, and in the URL (`manage/personal/project/<THIS>`).

**When to change it**: never, unless the project is migrated to a different Sanity account.

---

### `SANITY_DATASET`
**What it is**: The name of the dataset within the Sanity project. For OCC this is `production`.

**Where it's used**: Same client as above.

**Where to find it**: Sanity dashboard → OCC project → Datasets.

**When to change it**: only if OCC later splits content between (e.g.) `staging` and `production` datasets.

---

### `SANITY_WRITE_TOKEN`
**What it is**: A long-lived API token with Editor permissions on the Sanity project. Starts with `sk...`. Used server-side only; **must never** reach the browser.

**Where it's used**: `api/_lib/sanity.js` passes it to `createClient({ token })`. Every admin CRUD endpoint uses that client to read, create, update and delete content, and to upload image/file assets.

**Where to find or regenerate**:
1. https://www.sanity.io/manage → OCC project → **API** → **Tokens**
2. Click **Add API token**
3. Name it something recognisable (e.g. `vercel-prod` or `local-dev`)
4. Permissions: **Editor**
5. Copy the value immediately — Sanity never shows it again

**When to rotate**: whenever a token leaks, or on a cadence OCC prefers. Rotation steps: create the new token first, update Vercel with the new value, redeploy, then delete the old token in Sanity.

---

### `ADMIN_EMAIL`
**What it is**: The one email address accepted by the admin login form.

**Where it's used**: `api/admin/login.js` reads this and compares the submitted email against it (case-insensitive).

**Where to find it**: It's whatever OCC chose at setup (likely a staff email). The value is in Vercel's env vars panel.

**When to change it**: whenever the admin account changes hands. Update the Vercel env var; no code change needed; staff needs to be told the new address.

---

### `ADMIN_PASSWORD_HASH`
**What it is**: A **bcrypt hash** of the admin password — not the password itself. Starts with `$2a$12$` or `$2b$12$` and is about 60 characters long.

**Where it's used**: `api/admin/login.js` calls `bcryptjs.compare(submittedPassword, process.env.ADMIN_PASSWORD_HASH)`.

**Where to generate**: run this in a terminal, with the actual password substituted:
```bash
node -e "console.log(require('bcryptjs').hashSync('REPLACE_WITH_YOUR_PASSWORD', 12))"
```
Copy the output (starts with `$2a$12$...`) and paste it into Vercel as the value.

**When to change it**: when the password is forgotten, suspected to be leaked, or on a scheduled rotation. There is no password-reset UI; the only way to reset is to regenerate the hash and update the env var. After updating, click **Deployments → ⋯ → Redeploy** on the latest production build — env var changes don't trigger a rebuild automatically.

---

### `SESSION_SECRET`
**What it is**: A long random string used to sign the JWT stored in the admin session cookie. Expected to be 32+ characters; the current one is 96 hex characters (48 bytes).

**Where it's used**: `api/_lib/session.js` passes it to the `jose` library's `SignJWT().sign()` and `jwtVerify()`. If this value changes, every currently-signed-in admin session is instantly invalidated.

**Where to generate**:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

**When to change it**:
- Whenever you want to invalidate all live sessions (e.g. after a password change you're paranoid about)
- Never because it "looks compromised" — it only matters if attackers have both this value and the Sanity write token, since forging a session only gets them to the admin UI, which still enforces the write token server-side

---

## Client-side variables (`VITE_*` prefix — bundled into the browser JS)

### `VITE_SANITY_PROJECT_ID`
**What it is**: Same identifier as `SANITY_PROJECT_ID`. Used by the browser's public, read-only Sanity client.

**Where it's used**: `src/lib/sanityClient.js` reads it at build time (`import.meta.env.VITE_SANITY_PROJECT_ID`) and uses it to create the public client. All three public pages (`/news`, `/reports`, `/gallery`) read through this client.

**Where to find it**: same place as `SANITY_PROJECT_ID` — the Sanity dashboard.

**Why it's safe to expose**: a project ID alone grants no access. Content is readable only from origins listed in the Sanity project's CORS Origins settings.

---

### `VITE_SANITY_DATASET`
**What it is**: Same as `SANITY_DATASET`, exposed to the browser.

**Where it's used**: `src/lib/sanityClient.js`.

**Why it's safe to expose**: it's just a name (`production`), not a credential.

---

## Optional variables (both have sensible defaults)

### `SANITY_API_VERSION`
**What it is**: The Sanity API version string the server-side client pins against. Format `YYYY-MM-DD`.

**Where it's used**: `api/_lib/sanity.js` reads it. Falls back to `'2024-10-01'` if unset.

**Why it exists**: Sanity's API is dated — the client sends this to opt into a specific schema snapshot. Pinning means Sanity won't unexpectedly change behaviour on you when they release a new version. Leaving the default is fine for OCC today; bump it only when you want to adopt newer Sanity features and have verified nothing breaks.

**When to change**: rarely. Only when intentionally upgrading. No action needed for day-to-day use.

---

### `VITE_SANITY_API_VERSION`
**What it is**: Same as `SANITY_API_VERSION`, for the public read client in the browser bundle.

**Where it's used**: `src/lib/sanityClient.js` reads it. Falls back to `'2024-10-01'` if unset.

**When to change**: same reasoning as `SANITY_API_VERSION` — bump both together when upgrading, keep in sync.

---

## Platform-set variables (don't configure these yourself)

These are set automatically by the runtime; you never add them in Vercel or `.env.local`. Listed here only so a reader isn't confused when they see them referenced in code.

| Name | Set by | Where it's read | Purpose |
|---|---|---|---|
| `NODE_ENV` | Node / Vite / Vercel | `api/_lib/session.js` | Combined with `VERCEL` to decide whether to mark the session cookie `Secure`. In Production this is `'production'`, locally under `vercel dev` it's `'development'`. |
| `VERCEL` | Vercel | `api/_lib/session.js` | Truthy whenever the function is running on Vercel's infrastructure (any environment — Production or Preview). Combined with `NODE_ENV` as above. |

Together these two make sure the session cookie gets the `Secure` flag whenever it's being served over HTTPS, without needing explicit configuration.

---

## Setting up `.env.local` for local full-stack dev

Create a file called `.env.local` in the project root (it's gitignored). Format is `KEY=VALUE` per line, one line per variable. Include the eight required variables (the two optional `_API_VERSION` ones can be omitted — they'll default to `2024-10-01`). The file will look like:

```
SANITY_PROJECT_ID=…
SANITY_DATASET=production
SANITY_WRITE_TOKEN=sk_…
ADMIN_EMAIL=…
ADMIN_PASSWORD_HASH=$2a$12$…
SESSION_SECRET=…
VITE_SANITY_PROJECT_ID=…
VITE_SANITY_DATASET=production
```

(Replace the ellipses with real values from the Vercel dashboard or by regenerating.)

Then run `vercel dev` from the project root — it reads `.env.local` automatically.

For `npm run dev` (UI-only), only the two `VITE_*` variables are strictly needed because that mode doesn't invoke serverless functions.

## Setting them up in Vercel

Full step-by-step is in `docs/DEPLOYMENT.md`. The short version:

1. **Settings → Environment Variables → Add New**
2. For each variable: paste the key, paste the value
3. Set the **Type**: Sensitive for the six server-side ones, **Config** for the two `VITE_*` ones
4. Tick both **Production** and **Preview** scopes
5. Save
6. After adding or editing any env var, trigger a redeploy: **Deployments → ⋯ (latest build) → Redeploy**

## Confirmation note

**TODO: confirm** — in `docs/DEPLOYMENT.md` and `docs/CMS.md` the suggested rotation cadence for `SANITY_WRITE_TOKEN` and `ADMIN_PASSWORD_HASH` is left to OCC's discretion. If OCC has a security policy, document the cadence here.
