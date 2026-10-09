# Handover runbook

How OCC's accounts have been set up to own everything that matters for the website's long-term continuity, while hosting continues to run on the developer's personal Vercel for the duration of the engagement.

**Author**: Tammy (yapsgenius@gmail.com)
**Handover window**: 8–10 October 2026
**Engagement term**: 5 years (per NDA); 3-month warranty included
**Status at time of writing**: as of 2026-10-09, GitHub transfer complete, Sanity Administrator access granted to OCC, DNS cutover scheduled for Tue 13 Oct 2026, public launch on Fri 16 Oct 2026 at 00:00 Lagos (= 2026-10-15T23:00:00Z)

## The ownership model (read first)

Not every account moves to OCC. Costs and Vercel's Hobby-tier restrictions make a full migration either expensive or lossy; the pragmatic shape agreed with Nela is:

| Layer | Owner | Rationale |
|---|---|---|
| GitHub repository | **OCC** (`Obudu-Conservation-Educational-Centre/occ-website`) | OCC owns the code; developer kept as Admin collaborator for the warranty window |
| Sanity project | **Tammy's personal Sanity account** (project `aib1nnox`); Nela is **Administrator on the project** | Full ownership transfer requires Sanity Growth ($99/mo); Admin membership gives Nela identical practical control at zero cost |
| Content (news, reports, gallery, images) | **OCC**, lives in the Sanity dataset Nela administers | Dataset content is OCC's regardless of which account owns the containing project |
| Vercel hosting | **Tammy's personal Vercel** (Hobby, free) | Vercel Hobby doesn't allow deploying from GitHub organisations; moving to OCC would require Pro ($20/mo). The developer committed to free hosting under the engagement, and OCC's content/repo/domain are all portable to another host if ever needed. |
| Domain | **OCC** (GoDaddy registrar, DNS at WordPress.com → migrating to GoDaddy post-launch) | Documented separately in [`DNS-CUTOVER-RUNBOOK.md`](./DNS-CUTOVER-RUNBOOK.md) |
| Email | **OCC** (Google Workspace, unchanged) | Independent of website hosting |

**What this means in plain English**: everything OCC's lawyers or next developer would need to re-host the site elsewhere — the code, the content, the domain, the email, the brand identity — is under OCC's control. The developer provides hosting as part of the service, not as a transferable asset.

The ["Disaster recovery"](#disaster-recovery--if-the-developer-becomes-unavailable) section at the end spells out exactly what OCC does if the developer ever becomes unavailable.

## What this runbook does and does not do

**Does**:
- Transfer the GitHub repository to OCC's organisation
- Grant OCC Administrator-level access on Sanity so staff can edit all content, manage members, and rotate API tokens independently
- Rotate every credential that was created under the developer's personal accounts
- Verify the site works end-to-end from OCC's perspective
- Document the disaster-recovery procedure so OCC can leave at any time without losing content, repo, or domain

**Does not**:
- Change DNS or the custom domain — that's [`DNS-CUTOVER-RUNBOOK.md`](./DNS-CUTOVER-RUNBOOK.md)
- Migrate the Vercel project to OCC's Vercel team (Hobby-tier restrictions make this impractical; Phase 2 is intentionally skipped)
- Rewrite git history to replace the developer's email on past commits (commits remain attributed to `yapsgenius@gmail.com`)
- Add multi-admin login or self-service password reset (planned post-launch, not blocking)

## Investigation snapshot (captured 2026-10-08, verified 2026-10-09)

Preserved for audit and rollback reference.

**Repo cleanliness**: `README.md`, `docs/`, `src/`, `api/`, `index.html`, `public/` contain no personal identifiers. `package.json` has no `author`, `repository`, `homepage` or `bugs` fields pointing at anyone.

**No deployment pipelines to migrate**: no `.github/` directory; no GitHub Actions; no Actions secrets; no Vercel deploy hooks (confirmed in Phase 0.1); no Sanity webhooks (confirmed in Phase 0.2).

**Sanity API tokens before handover**: one token named "OCC Admin" existed under Tammy's project membership; replaced in Phase 4.

**Env vars (name-only inventory, values live only in Vercel)**:
- Required: `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_WRITE_TOKEN`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`, `VITE_SANITY_PROJECT_ID`, `VITE_SANITY_DATASET`
- Optional (sensible defaults in code): `SANITY_API_VERSION`, `VITE_SANITY_API_VERSION`
- Launch gate (added for this project): `VITE_LAUNCH_AT`, `VITE_LAUNCH_MODE`
- Platform-set (never configured by hand): `NODE_ENV`, `VERCEL`
- Studio (developer-local only, `studio/.env.development`): `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`

**Immutable**: every commit in git history is authored as `yapsgenius@gmail.com`. Rewriting invalidates every SHA; accepted as-is.

## Prerequisites — what was collected from OCC

1. **GitHub organisation**: `Obudu-Conservation-Educational-Centre` (created by Nela at github.com/organizations/plan, free plan)
2. **Sanity account email**: `nela@obuduconservationc.org`
3. **Vercel team**: `obudu-conservation-centre` (Hobby, free — ultimately not used; see Phase 2)
4. **`ADMIN_EMAIL`**: `admin@obuduconservationc.org`
5. **Admin password**: chosen by Nela, held in password manager, hashed in Phase 4

---

## Order of operations and action-owner legend

Legend: **(a)** terminal / code · **(b)** dashboard (Tammy) · **(c)** OCC does on their side

---

## Phase 0 — Pre-flight (completed 2026-10-08) ✓

- **(b)** Vercel → old project → Settings → Git → Deploy Hooks: **no hooks existed** → Phase 2.7 skipped.
- **(b)** Sanity → old project → API → Webhooks: **no webhooks existed** → Phase 3.7 skipped. Under API → Tokens: one token "OCC Admin" present.
- **(b)** Vercel → Settings → Environment Variables: confirmed all 10 variables present on Preview + Production; values exported to Tammy's password manager.
- **(a)** This runbook captures the walk-through.

## Phase 1 — GitHub transfer (completed 2026-10-09) ✓

1.1 ✓ Nela created OCC's GitHub organisation `Obudu-Conservation-Educational-Centre` (free plan).
1.2 ✓ `TammyOweifie/occ-website` → Settings → Danger Zone → Transfer → confirmed, repo moved.
1.3 ✓ Nela accepted the transfer notification.
1.4 ✓ Nela added `TammyOweifie` as Admin collaborator (plus org membership).
1.5 ✓ Local git remote updated:
```bash
git remote set-url origin https://github.com/Obudu-Conservation-Educational-Centre/occ-website.git
```
1.6 ✓ `git fetch` and `git push` both verified working against new remote.

**State**: repo lives on OCC's GitHub org with full history. Tammy keeps Admin for the engagement.

## Phase 2 — Vercel (deliberately skipped) ⏸

Vercel's Hobby tier does not allow deployments from GitHub organisations. Moving the project to OCC's Vercel account would have required one of:

- **Vercel Pro** ($20/mo = $240/yr) — ruled out: the developer promised OCC free infrastructure under the engagement, and OCC's traffic doesn't need Pro-tier features.
- **Migration to Cloudflare Pages** (free, allows org repos) — ruled out: adds ~1–2 hours of rewrite work on the serverless functions, no immediate benefit, and OCC's content is already portable via GitHub + Sanity if a host migration is ever needed.
- **Downgrading OCC's Vercel to deploy from Tammy's personal GitHub** — defeats the handover purpose.

**Decision**: the Vercel project stays on Tammy's personal Vercel account for the duration of the engagement. OCC does not pay for hosting. If OCC later needs features that require Pro, or wants fully OCC-owned hosting, the migration path is in the ["Disaster recovery"](#disaster-recovery--if-the-developer-becomes-unavailable) section below.

**What this means in practice**:
- Vercel preview + production URLs stay on `21st-century-dev.vercel.app` subdomains until the custom domain is attached in the DNS cutover
- Env vars continue to live on Tammy's Vercel; Phase 4 updates `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, and `SANITY_WRITE_TOKEN`
- No OCC-side Vercel action is needed for day-to-day operation

## Phase 3 — Sanity project access (completed 2026-10-09) ✓

Full project transfer requires Sanity Growth plan ($99/mo). Admin membership on the project achieves the same practical outcome at zero cost: Nela can edit everything, invite members, mint API tokens, change CORS origins, and manage webhooks — all without "owning" the project formally.

3.1 ✓ **(b)** sanity.io/manage → `occ-website` project (`aib1nnox`) → Members → Invite member → `nela@obuduconservationc.org` → role **Administrator**.
3.2 ⏳ **(c)** Nela accepts the invite (pending at time of writing — the earlier invite she accepted went to a different Sanity project she created in error; see note below).
3.3 ⏭ **Not applicable** — formal project transfer deferred (requires Sanity Growth). Project ownership remains with Tammy's personal account; Nela has full practical control via Admin membership.
3.4 ⏭ Not applicable (no transfer to accept).
3.5 ⏭ Not applicable — Tammy's existing membership persists.
3.6 **(b)** Add CORS origins for the DNS-cutover URL once ready: `https://obuduconservationc.org` and `https://www.obuduconservationc.org` (see [`DNS-CUTOVER-RUNBOOK.md`](./DNS-CUTOVER-RUNBOOK.md) Phase 4.3).

**Note on Nela's earlier action**: when first invited, Nela created a brand-new empty Sanity organisation and project rather than joining the existing OCC project. The invite above redirects her to the correct one. The empty project she created can safely be deleted from her Sanity dashboard (sanity.io/manage → the empty project → Settings → bottom → Delete project).

**State at end of Phase 3**: Nela has Administrator-level control over the real OCC Sanity project (`aib1nnox`) with its full content history. Tammy remains a Member for the engagement period.

## Phase 4 — Secret rotation

All on Tammy's personal Vercel (the deployment target) and OCC's Sanity Admin (for issuing the new token).

4.1 **(c)** Nela → Sanity → OCC project → **API → Tokens → Add API token**: name `vercel-prod`, role **Editor**. Copy the `sk...` value (shown only once).
4.2 **(b)** Tammy → personal Vercel → `occ-website` project → **Settings → Environment Variables**:
    - `SANITY_WRITE_TOKEN` → paste the new value from 4.1
    - `ADMIN_EMAIL` → set to `admin@obuduconservationc.org`
    - `ADMIN_PASSWORD_HASH` → generate with OCC's chosen password:
      ```bash
      node -e "console.log(require('bcryptjs').hashSync('<OCC-CHOSEN-PASSWORD>', 12))"
      ```
      Paste the resulting `$2a$12$…` value.
    - `SESSION_SECRET` → regenerate (optional but recommended; invalidates all live sessions):
      ```bash
      node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
      ```
4.3 **(b)** Vercel → Deployments → ⋯ (latest build) → **Redeploy**. ~90 seconds.
4.4 Verify admin login + a write operation on the deployed URL (Phase 5 checklist).
4.5 **(c)** Nela → Sanity → **API → Tokens** → delete every token that pre-dates `vercel-prod` (particularly "OCC Admin" and any Studio local tokens).

### Secret rotation summary

| Secret | Rotated when | Old value disposition |
|---|---|---|
| `SANITY_WRITE_TOKEN` | Phase 4.1–4.5 | Old tokens deleted from Sanity after new one is verified |
| `ADMIN_EMAIL` | Phase 4.2 | Updated to OCC's address |
| `ADMIN_PASSWORD_HASH` | Phase 4.2 | Replaced with hash of OCC's chosen password |
| `SESSION_SECRET` | Phase 4.2 (optional) | Replaced; all live sessions invalidated |
| GitHub personal access tokens (if any) | After Phase 1.6 | Revoke on github.com → Settings → Developer settings |

## Phase 5 — Verification checklist

Walk this top-to-bottom on the current Vercel preview URL (and later on `obuduconservationc.org` once DNS cuts over). Any failure → pause and fix.

### Public site
- [ ] Home `/` loads: hero carousel visible, partner-logos marquee visible
- [ ] `/news` loads with migrated posts
- [ ] Click a news card → modal opens with full body
- [ ] `/reports` loads with migrated reports; PDF download works
- [ ] `/gallery` loads with photos; lightbox opens; prev/next/Escape work
- [ ] `/founders-story` loads; portrait + full copy visible
- [ ] `/team`, `/about`, `/donate` all load
- [ ] Navbar About Us dropdown works (desktop hover + keyboard)
- [ ] Mobile view at 375px: hamburger opens; About Us chevron expands
- [ ] Countdown page shows the correct remaining time (until Fri 16 Oct 00:00 Lagos)

### Admin
- [ ] `/admin/login` renders
- [ ] Sign in with `admin@obuduconservationc.org` + new password → Dashboard with News / Reports / Gallery cards
- [ ] Create a **test** news post → appears on `/news` → delete → gone from `/news`
- [ ] Upload a **test** gallery photo → appears on `/gallery` → delete → gone
- [ ] Attach a small test PDF to a test report → download link serves PDF → delete

### Logs and network
- [ ] Browser DevTools → Console on each public page: no CORS or 404 errors
- [ ] Vercel → Observability → Logs: `/api/admin/*` requests return 200/201

### Deploy pipeline
- [ ] Push a trivial commit from Tammy's machine to `Obudu-Conservation-Educational-Centre/occ-website` → Vercel auto-builds → ✓ Ready

## Phase 6 — Independence test (OCC performs, Tammy observes only)

Prove OCC can continue operating the site without the developer. These are performed by Nela (or an OCC staff designee) with Tammy only answering questions, not clicking.

- [ ] OCC member logs into GitHub, opens `Obudu-Conservation-Educational-Centre/occ-website`, confirms they can see Settings → Collaborators and teams
- [ ] OCC member logs into Sanity, opens the OCC project, confirms they can see content under Studio and Members under Settings
- [ ] OCC member logs into `/admin` on the deployed URL, creates a real news post, saves, confirms it appears on the public `/news` page
- [ ] OCC member deletes that same post from admin, confirms it disappears from `/news`
- [ ] OCC member locates [`docs/DEPLOYMENT.md`](./DEPLOYMENT.md) in the repo and reads the "Rolling back a bad deploy" section (confirms they can find the written instructions when needed)
- [ ] OCC member reads the "Disaster recovery" section below and confirms they understand what to do if the developer becomes unavailable

**Not tested** (OCC does not have Vercel access by design): Vercel dashboard operation. If OCC needs to touch Vercel, they go through the developer; if the developer is unreachable, they follow Disaster Recovery.

---

## Disaster recovery — if the developer becomes unavailable

The arrangement where hosting runs on the developer's personal Vercel introduces a single point of failure: the developer. This section exists so OCC can continue operating the site without any dependency on the developer being reachable.

**OCC owns independently**:
- The GitHub repository with all code and history (`Obudu-Conservation-Educational-Centre/occ-website`)
- All Sanity content (news, reports, gallery, uploaded images) under the OCC-administered project
- The domain `obuduconservationc.org` at GoDaddy
- Email via Google Workspace

**OCC does not directly own**:
- The Vercel project running the site (lives on Tammy's personal account)
- The `SANITY_WRITE_TOKEN`, `SESSION_SECRET`, `ADMIN_PASSWORD_HASH` env var values (lives in Tammy's Vercel; copies also held by Nela in password manager after Phase 4)

### Scenarios and remedies

**Scenario 1: developer temporarily unreachable, nothing is broken.**
- Site continues to serve from Vercel without intervention
- Admin continues to work
- No action needed

**Scenario 2: developer unreachable, something breaks (bad deploy, env var compromised, Vercel outage).**
- A new developer with access to OCC's GitHub repo can clone it and set up a parallel deployment on any provider (Vercel on OCC's own Pro account, Cloudflare Pages, Netlify, Render)
- Env var values: Nela retrieves from her password manager (the full set was saved during Phase 4) and enters them in the new host
- DNS: update the A record at GoDaddy (DNS panel) to point at the new host's IP; Vercel's IP is `76.76.21.21`, Cloudflare Pages uses CNAME, Netlify provides a hostname
- Estimated time from "pick a new host" to "site live on new infrastructure": 2–4 hours for a familiar developer

**Scenario 3: developer unreachable permanently, OCC wants full ownership of hosting.**
- Export dataset backup from Sanity (one command: `cd studio && npx sanity dataset export production ./backup.tar.gz` — see [`CMS.md`](./CMS.md))
- Create a new Vercel project (any plan) or Cloudflare Pages project under OCC's accounts, importing from the OCC-owned GitHub repo
- Re-enter all 10 env vars (Nela's password-manager copy is the authoritative source)
- Switch DNS A record to the new host's IP at GoDaddy
- Decommission the old project (Tammy's Vercel can be deleted or left alone; it stops serving traffic once DNS flips)

### What Nela should keep readily accessible

In a password manager (recommended: 1Password, Bitwarden, or similar) under an entry titled "OCC website — recovery credentials":
- GitHub organisation owner login
- Sanity organisation + project login
- GoDaddy registrar login
- Google Workspace admin login
- The 10 env var values from Vercel (captured during Phase 4)
- A copy of this runbook (bookmark the GitHub file link)
- Latest Sanity dataset export (updated monthly per [`CMS.md`](./CMS.md) backup rhythm)

With all of that, OCC can rebuild the site on any host in under half a day without any involvement from the original developer.

---

## Rollback plans per phase

| Phase | Failure mode | Rollback |
|---|---|---|
| 1 (GitHub) | Transfer rejected or wrong account | Nela transfers the repo back to `TammyOweifie`. Local remote reverts with another `git remote set-url`. |
| 3 (Sanity Admin) | Nela can't access or wrong project | Delete the invite in Sanity → send a fresh one with the correct email. No data lost. |
| 4 (Rotation) | Admin login or Sanity writes break | Revert env vars to the pre-rotation values held in the password-manager snapshot → redeploy. |

Nothing in this runbook is destructive before Phase 4.5 (deleting old Sanity tokens), and that step is reversible by creating replacement tokens.

## Tammy's long-term posture

Over the 5-year engagement:
- Admin on `Obudu-Conservation-Educational-Centre/occ-website` GitHub repo
- Member on OCC's Sanity project (Admin not required for most ops; downgrade on request)
- Owner of the Vercel project hosting the site (Hobby plan, free)
- Holds the active `.env.local` locally for dev work; `SANITY_WRITE_TOKEN` in that file is a long-lived Editor token issued by Nela
- Available to OCC for maintenance, new features, and host migration if OCC's requirements grow

If OCC later wants fully OCC-owned hosting (because requirements outgrow the free tier, or for compliance reasons), the migration path in Disaster Recovery → Scenario 3 applies.

## Open questions resolved during handover

- GitHub: OCC organisation `Obudu-Conservation-Educational-Centre` created, repo transferred ✓
- Sanity ownership transfer: declined due to $99/mo Sanity Growth requirement; Admin membership used instead ✓
- Vercel ownership transfer: declined due to $20/mo Vercel Pro requirement + developer's free-hosting commitment; project stays on developer's personal account ✓
- Admin credentials: email `admin@obuduconservationc.org`; password chosen by Nela, held in her password manager ✓
- DNS cutover: separate runbook, Tue 13 Oct 2026 at 09:00 Lagos (see [`DNS-CUTOVER-RUNBOOK.md`](./DNS-CUTOVER-RUNBOOK.md)) ✓
- `cms-prep` branch: deleted post-launch-prep merge; `main` is the only working branch
