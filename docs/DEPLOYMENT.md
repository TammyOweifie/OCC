# Deployment

How to deploy, update, roll back and attach a custom domain for the OCC site on Vercel. Assumes the project is already connected to GitHub and Vercel — if you're setting that up from scratch, there's a one-time section at the end.

## How deployment is wired right now

- The GitHub repository is linked to a Vercel project.
- The Vercel project's **Production Branch** is set to `main`.
- Every push to `main` triggers an automatic Production build. When it succeeds, the Production URL serves the new code.
- Every push to any other branch triggers an automatic Preview build at a unique `.vercel.app` URL (plus a stable per-branch URL for easy sharing).

In practice, deploying a change is simply:

```bash
git push origin main
```

…and waiting about a minute for Vercel to build.

## Watching a build

1. Vercel dashboard → OCC project → **Deployments** tab
2. The in-progress build appears at the top with a yellow dot
3. Click into it to see the live build log
4. ✓ Ready = live
5. ✗ Failed = click to see the error; nothing changes on the public URL

If a build fails, the previous successful deployment remains live. There is no downtime from a failed build.

## Environment variables

Full list and purpose in [`ENVIRONMENT.md`](./ENVIRONMENT.md). The deployment-specific points:

### Adding a new variable

1. Vercel → **Settings → Environment Variables → Add New**
2. Paste the key, paste the value
3. **Type**: pick **Sensitive** for anything that must stay server-side. Pick **Config** for anything prefixed with `VITE_` (these end up in the client bundle; marking them Config acknowledges that).
4. **Environment**: tick both **Production** and **Preview**. Tick **Development** too only if you'll be using `vercel dev` with Vercel's own hosted env (most people use a local `.env.local` instead).
5. Click **Save**.

### Updating an existing variable

1. **Settings → Environment Variables → ⋯ next to the row → Edit**
2. Change the value, save.
3. **Env var changes do not automatically redeploy.** You must trigger a redeploy manually (next section) for the change to take effect.

### Triggering a redeploy (without a code change)

Use this after editing env vars, changing Vercel settings, or when a build was cancelled.

1. **Deployments** tab
2. Find the deployment at the top of the list (most recent successful one)
3. Click **⋯ → Redeploy**
4. On the modal, leave **Use existing Build Cache** ticked unless you specifically want a clean rebuild
5. **Deploy**

Takes ~90 seconds. The URL doesn't change.

## Rolling back a bad deploy

If a push to `main` deploys something broken, you have two paths. Vercel's own promotion is faster and reversible; `git revert` is cleaner history-wise.

### Fast path — promote an older build in Vercel

1. **Deployments** tab
2. Find the last-known-good build (an older Production entry)
3. Click **⋯ → Promote to Production**
4. Confirm

Within a few seconds the Production URL serves that older build. The broken code is still in `main`, so your next push will re-trigger the broken build — fix the code first.

### Clean path — revert the commit in Git

1. On your machine:
   ```bash
   git log --oneline     # find the SHA of the bad commit
   git revert <sha>      # creates a new commit that undoes it
   git push origin main
   ```
2. Vercel auto-builds and deploys the revert.
3. History shows what happened; nothing is lost.

Use the fast path when the site is actively broken and you need it fixed right now. Use the clean path when you have a few minutes and want proper history.

## Connecting a custom domain

The site currently runs at `.vercel.app`. To put it on the custom domain:

### 1. Add the domain in Vercel
1. Vercel → **Settings → Domains → Add Domain**
2. Enter the apex domain (e.g. `obuduconservationc.org`)
3. When Vercel asks whether to also add `www.obuduconservationc.org`, say yes. Pick the apex as the canonical; `www` auto-redirects to it.
4. Vercel will display DNS records to configure:
   - Apex (`obuduconservationc.org`): an **A record** pointing to `76.76.21.21`
   - `www`: a **CNAME record** pointing to `cname.vercel-dns.com`

Both will show **"Invalid Configuration"** until DNS actually resolves to Vercel.

### 2. Update DNS at the domain registrar

Where DNS is managed depends on OCC's current setup — it could be at GoDaddy (the registrar), inside a WordPress.com DNS panel, or somewhere else. Find out which is authoritative before changing anything.

- Change the apex **A** record so it points at `76.76.21.21`
- Change the `www` **CNAME** so it points at `cname.vercel-dns.com`
- **Do not touch** MX records (email), TXT records (SPF/DKIM/DMARC/verification), or any subdomain records you don't recognise.
- Lower the TTL on the records you change to 600 seconds while cutting over so a rollback is fast.

### 3. Wait for DNS propagation

- A record changes typically take 5-30 minutes
- Nameserver changes take 1-24 hours
- Verify from a terminal:
  ```bash
  dig +short obuduconservationc.org
  ```
  When it returns `76.76.21.21`, DNS is live.

### 4. Vercel issues SSL automatically

Once DNS resolves to Vercel, Vercel provisions a Let's Encrypt certificate within a minute. The red "Invalid Configuration" badge in Vercel → Settings → Domains flips to a green ✓.

### 5. Add the new origin to Sanity's CORS allowlist

Before the public site can read content on the new domain:

1. https://www.sanity.io/manage → OCC project → **API → CORS Origins → Add**
2. Add `https://obuduconservationc.org`
3. Add `https://www.obuduconservationc.org` as a second entry
4. Allow Credentials: **off** (public pages read anonymously; see `docs/ARCHITECTURE.md`)
5. **Keep the existing `.vercel.app` origin** — don't remove it. Useful for debugging on preview URLs.

### Rollback plan

If anything breaks after the DNS switch:
- Change the registrar's A and CNAME records back to their previous values
- Within the TTL window (10 min if you lowered to 600), traffic flows back to the previous host
- Vercel's domain setup stays attached — just not receiving traffic. Nothing to undo there.

## Deploying from scratch (one-time setup)

For a clean start — e.g. OCC's new developer sets up a fresh Vercel project from the same GitHub repo:

1. Push the repo to a GitHub account that Vercel can see.
2. https://vercel.com/new → **Import Git Repository** → pick the OCC repo.
3. Vercel auto-detects Vite. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
4. **Environment Variables**: paste all 8 variables documented in [`ENVIRONMENT.md`](./ENVIRONMENT.md) before clicking Deploy. (Easier than doing it after.)
5. Click **Deploy**. First build takes ~2 min.
6. **Settings → Git → Production Branch**: confirm it's `main`.
7. Add CORS origins in Sanity for whatever Vercel URL the project landed on (visible in Settings → Domains).

## Common failure modes

- **Admin login returns 500** → missing or malformed env var. Open **Observability → Logs**, look for the stack trace from the login endpoint, usually names the var.
- **Public pages show "Coming Soon" for all content** → Sanity reads are being blocked by CORS. Confirm the current URL is in Sanity's CORS origins.
- **Deploy succeeded but a page is blank** → check **Observability → Logs** for client-side errors reported by the Vercel runtime, or open the deployed page's DevTools Console directly.
- **Env var changed but behaviour didn't update** → forgot to redeploy. Env var edits require a manual redeploy.

## TODO

- **TODO: confirm** — if OCC wants to be paged on build failures, enable **Settings → Notifications → Deployment Failed** and pick an email address or Slack channel.
