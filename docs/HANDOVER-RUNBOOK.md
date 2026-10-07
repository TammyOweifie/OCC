# Handover runbook

How to move the OCC website from the developer's personal accounts to OCC's own accounts without downtime, and verify OCC can run the site independently after the move.

**Author**: Tammy (yapsgenius@gmail.com)
**Target handover date**: Thursday 8 October 2026
**Audience**: Tammy (performing the migration) and OCC (receiving the project)
**Status at time of writing**: project runs on a Vercel preview URL; nothing is on the custom domain yet (DNS cutover is scheduled separately before 00:00 Lagos time, 16 October 2026 and is **not** covered here).

## What this runbook does and does not do

**Does**:
- Transfer the GitHub repository to OCC
- Create a parallel Vercel project owned by OCC with every env var re-entered and secrets rotated
- Transfer the Sanity project to OCC and update CORS to the new Vercel URL
- Rotate every secret so nothing from the old setup grants access to the new one
- Verify end-to-end that OCC can log in, build and deploy without the developer
- Keep every previous state recoverable at every step

**Does not**:
- Change DNS or touch `obuduconservationc.org` (separate project, see note above)
- Change the admin login UI, add new users, or add a password-reset flow (scheduled post-handover)
- Rewrite git history to replace the developer's email on past commits (accepted trade-off — commits remain attributed to `yapsgenius@gmail.com`)

## Investigation findings (what's in the repo vs what's in accounts)

Confirmed via grep before writing this runbook:

**Repo is clean of personal identifiers.** No `yapsgenius@gmail.com`, no personal GitHub username, no Sanity project ID appears in `README.md`, `docs/`, `src/`, `api/`, `index.html` or `public/`. `package.json` has no `author`, `repository`, `homepage` or `bugs` fields pointing at anyone.

**No deployment pipelines to migrate.** No `.github/` directory exists; no GitHub Actions; no Actions secrets.

**Only account-side artefacts carry personal identity.** All 8 required env vars (plus 2 optional) live in Vercel's dashboard. The Sanity project itself, its write token, CORS allowlist and dataset all live in Sanity's dashboard.

**Immutable.** Every commit in git history is authored as `yapsgenius@gmail.com`. Changing this requires rewriting all commits and invalidating every SHA. Left as-is by agreement.

**Env vars (name-only inventory, values live only in Vercel):**
- Required: `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_WRITE_TOKEN`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`, `VITE_SANITY_PROJECT_ID`, `VITE_SANITY_DATASET`
- Optional (sensible defaults): `SANITY_API_VERSION`, `VITE_SANITY_API_VERSION`
- Platform-set (never configured by hand): `NODE_ENV`, `VERCEL`
- Studio (developer-local only): `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`

## Prerequisites — what Tammy needs from OCC before starting

Collect these from OCC **before Phase 1**:

1. **GitHub organisation name**. OCC does not yet have a GitHub account. Create a free GitHub **organisation** (not a personal account) at https://github.com/organizations/plan so the repo isn't tied to any one person's login. OCC picks the org slug.
2. **Vercel team name**. OCC creates a Vercel team at vercel.com — recommended plan: Hobby (free) is fine for this traffic level. OCC picks the team slug.
3. **Email for `ADMIN_EMAIL`**. The email OCC wants on the admin login going forward (likely an OCC staff mailbox).
4. **New admin password**. Whoever at OCC will be the primary admin picks a password. Transmitted on the handover call or via a password manager — never over email.
5. **Sanity account email**. The email OCC will use on Sanity (can be the same as 3 or different).
6. **(Resolved)** Edit-traffic window: not needed. Nothing is live yet; nobody is editing admin content during the move.
7. **(Resolved)** Live content: none. Everything is still in preview mode. No interruption risk.

## Order of operations and action-owner legend

Legend: **(a)** Tammy does in code/terminal · **(b)** Tammy does in a dashboard · **(c)** OCC does on their side

The sequence is deliberate: GitHub transfer first (reversible, no runtime impact), then a parallel Vercel project on OCC's account (old project keeps serving the current preview URL), then Sanity transfer (adds OCC to the ACL before changing ownership), then secret rotation (replaces every credential), then verification, then independence test, then decommission the old Vercel project after a 48–72h cooldown.

---

## Phase 0 — Pre-flight (nothing changes yet)

0.1 **(b)** Vercel → old project → **Settings → Git → Deploy Hooks**. Screenshot. If any hook exists, note its name, branch and URL — they'll be recreated on OCC's project in step 2.7.

0.2 **(b)** Sanity → old project → **API → Webhooks**. Screenshot. If any webhook exists (e.g. Sanity → Vercel deploy hook), note its URL. Under **API → Tokens**, list every token name.

0.3 **(b)** Vercel → old project → **Settings → Environment Variables**. Confirm all 8 required variables are present on Preview + Production. Export the values to a password manager or temporary encrypted note under Tammy's control for the next 24 hours — they'll be re-entered into OCC's Vercel project in step 2.4.

0.4 **(a)** No code change here. This file (`docs/HANDOVER-RUNBOOK.md`) is the walk-through for the handover call.

## Phase 1 — GitHub transfer

Safe to do first because transferring a repo doesn't affect Vercel or Sanity. GitHub preserves full history and silently redirects the old URL for a transition period.

1.1 **(c)** OCC creates a free GitHub **organisation** at https://github.com/organizations/plan (not a personal account). OCC picks the slug (e.g. `obudu-conservation-centre`).

1.2 **(b)** GitHub → `TammyOweifie/occ-website` → **Settings → scroll to Danger Zone → Transfer**. Enter OCC's organisation slug. Confirm by retyping the repo name.

1.3 **(c)** OCC accepts the transfer in their GitHub notifications (one click).

1.4 **(c)** OCC → transferred repo → **Settings → Collaborators and teams** → invite Tammy's personal GitHub (`TammyOweifie`) with **Admin** access for the 3-month warranty window. Tammy accepts the invite.

1.5 **(a)** Update the local git remote:
```bash
git remote set-url origin https://github.com/<OCC-ORG>/occ-website.git
git fetch
```

1.6 **(a)** Verify `git push` still works against the new remote (push a no-op branch or a trivial commit — delete afterwards). Expected: success.

**State at end of Phase 1:** repo lives on OCC's GitHub org, full history intact, Tammy still has admin on it, Vercel is still deploying from the old URL (GitHub's redirect keeps the old integration working).

## Phase 2 — Vercel project (parallel, not replacement)

Create OCC's Vercel project **alongside** the old one so the current preview URL stays serving the site until the new one is verified.

2.1 **(c)** OCC signs up at vercel.com using the Sanity-account email from prereq 5 (or a shared OCC inbox — their call).

2.2 **(c)** OCC creates a **Team** on Vercel (not just a personal account) and invites Tammy's personal Vercel account as a **Team Member** so Tammy can help operate for the 3-month warranty.

2.3 **(c)** OCC → vercel.com/new → **Import Git Repository** → authorise Vercel to see the OCC GitHub org → pick `occ-website`. Vercel auto-detects Vite. Confirm: Framework **Vite**, Build command `npm run build`, Output directory `dist`.

2.4 **(b/c, with Tammy walking OCC through this)** Before clicking Deploy, add all 10 env vars (both scopes: Production + Preview). Values pulled from Tammy's export in step 0.3:

| Name | Type | Where its value comes from |
|---|---|---|
| `SANITY_PROJECT_ID` | Sensitive | Same value as old project (same Sanity project — only ownership changes in Phase 3) |
| `SANITY_DATASET` | Sensitive | `production` |
| `SANITY_WRITE_TOKEN` | Sensitive | **Leave blank for now** — rotated in Phase 4 |
| `ADMIN_EMAIL` | Sensitive | OCC's email (prereq 3) |
| `ADMIN_PASSWORD_HASH` | Sensitive | Generate fresh with OCC's chosen password (prereq 4): `node -e "console.log(require('bcryptjs').hashSync('<OCC-CHOSEN-PASSWORD>', 12))"` |
| `SESSION_SECRET` | Sensitive | Generate fresh: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `VITE_SANITY_PROJECT_ID` | Config | Same value as `SANITY_PROJECT_ID` |
| `VITE_SANITY_DATASET` | Config | `production` |
| `SANITY_API_VERSION` | Sensitive | Optional — omit to accept default `2024-10-01` |
| `VITE_SANITY_API_VERSION` | Config | Optional — omit to accept default `2024-10-01` |

2.5 **(c)** OCC clicks **Deploy**. First build takes about 2 minutes.

2.6 **(b)** OCC's Vercel → **Settings → Git**: confirm Production Branch is `main`.

2.7 **(b)** If Phase 0.1 revealed any deploy hooks, recreate the equivalents in OCC's project at **Settings → Git → Deploy Hooks**. Note the new URLs — Phase 3.7 will update any Sanity webhooks that referenced the old ones.

2.8 Expected state after this phase: the build goes green, but admin login fails (no Sanity write token yet) and public pages fail to load content (new Vercel origin not yet in Sanity CORS). Both are fixed in Phase 3/4.

**State at end of Phase 2:** two Vercel projects exist. Old one on Tammy's account still serves the current preview URL. New one on OCC's team builds green on its own `.vercel.app` URL. No overlap, no interference.

## Phase 3 — Sanity ownership transfer

3.1 **(b)** sanity.io/manage → OCC project → **Members → Invite member** → enter OCC's Sanity email (prereq 5) → role **Administrator**.

3.2 **(c)** OCC accepts the invite and creates a Sanity account if they don't already have one.

3.3 **(b)** Tammy → OCC project → **Settings → Transfer project** (sometimes labelled under Danger Zone) → transfer to OCC's organisation on Sanity. Confirm.

3.4 **(c)** OCC accepts the transfer.

3.5 **(c)** OCC → transferred Sanity project → **Members** → invite Tammy's personal Sanity account back as a **Member** (not Administrator) for the 3-month warranty period.

3.6 **(b/c)** On the transferred project → **API → CORS Origins → Add**: add OCC's new Vercel preview URL from Phase 2 (something like `https://occ-website-<occ-hash>.vercel.app`). **Keep the old `.vercel.app` origin for now** — it's removed in Phase 7 after decommissioning the old Vercel project. Allow Credentials: **off** (public pages read anonymously).

3.7 **(b)** If Phase 0.2 revealed any Sanity webhooks pointing at the old Vercel's deploy hooks, update them to point at the new ones created in step 2.7.

**State at end of Phase 3:** Sanity project is OCC-owned, OCC's new Vercel URL is CORS-allowed, Tammy remains a Member, no dataset content moved (dataset `production` stays where it is — ownership of the containing project changes, not the data).

## Phase 4 — Secret rotation

The goal is that nothing from Tammy's old setup grants access to the new one.

4.1 **(c)** OCC → Sanity → **API → Tokens → Add API token**: name `vercel-prod`, role **Editor**. OCC copies the `sk...` value (shown only once).

4.2 **(b/c)** OCC pastes the new token into their Vercel project → **Settings → Environment Variables** → edit `SANITY_WRITE_TOKEN` → paste → save.

4.3 **(b)** Vercel → OCC project → **Deployments → ⋯ (latest build) → Redeploy** (env-var edits don't auto-rebuild). Takes ~90 seconds.

4.4 Verify admin login + a write operation on the new URL (see Phase 5 verification checklist).

4.5 **(c)** OCC → Sanity → **API → Tokens**: delete every token that pre-dates the transfer. From this point, nothing from Tammy's personal account can write to Sanity.

### Full secret-rotation inventory

| Secret | Rotated when | Old value disposition |
|---|---|---|
| `SANITY_WRITE_TOKEN` | Phase 4.1–4.5 | Deleted from Sanity after new one works |
| `SESSION_SECRET` | Already fresh in Phase 2.4 | N/A — new project generated its own |
| `ADMIN_PASSWORD_HASH` | Fresh hash in Phase 2.4 using OCC's chosen password | N/A — old hash never leaves old project |
| `ADMIN_EMAIL` | Set to OCC's address in Phase 2.4 | N/A |
| Sanity Studio local token (if Tammy had one on dev machine) | After step 4.5 | Create a fresh `local-dev` Editor token under OCC's project and use that; delete any pre-transfer local tokens |
| GitHub personal access tokens (if any used for the project) | After Phase 1.6 | Revoke on github.com → Settings → Developer settings |
| Vercel API tokens (if any used by the project) | After Phase 7 | Revoke on vercel.com → Account Settings → Tokens |

## Phase 5 — Verification checklist

Walk this top-to-bottom on **OCC's new Vercel preview URL**. Any failure → pause and fix before moving on.

### Public site
- [ ] Home `/` loads: hero carousel visible, partner-logos marquee visible
- [ ] `/news` loads with migrated posts
- [ ] Click a news card → modal opens with full body
- [ ] `/reports` loads with migrated reports; PDF download link works on the one with a PDF
- [ ] `/gallery` loads with all 12 photos; click a tile → lightbox opens; prev/next work; Escape closes
- [ ] `/founders-story` loads; portrait + full copy visible
- [ ] `/team`, `/about`, `/donate` all load
- [ ] Navbar About Us dropdown works on desktop (hover + keyboard)
- [ ] Mobile view at 375px: hamburger opens; About Us chevron expands

### Admin
- [ ] `/admin/login` renders
- [ ] Sign in with OCC's new `ADMIN_EMAIL` + new password → Dashboard appears with three cards (News, Reports, Gallery) showing non-zero counts
- [ ] Create a **test** news post → appears on `/news` → delete it → confirms gone from `/news`
- [ ] Upload a **test** gallery photo → appears on `/gallery` → delete it → confirms gone
- [ ] Attach a small test PDF to a test report → download link on `/reports` serves the PDF → delete it

### Logs and network
- [ ] Browser DevTools → Console on each public page: no CORS or 404 errors
- [ ] Vercel → Observability → Logs on OCC's new project: `/api/admin/*` requests return 200/201

### Deploy pipeline
- [ ] Push a trivial commit from Tammy's machine to the transferred repo on OCC's GitHub → Vercel on OCC's team auto-builds → ✓ Ready

## Phase 6 — Independence test (OCC performs, Tammy observes only)

The point of this phase is proving OCC can run the site without Tammy. These steps must all be performed by someone at OCC with Tammy only answering questions, not clicking anything.

- [ ] OCC member logs into GitHub, opens the repo, confirms they can see Settings → Collaborators and teams
- [ ] OCC member logs into Vercel, opens the project, confirms they can see Deployments and Settings → Environment Variables
- [ ] OCC member logs into Sanity, opens the project, confirms they can see content under Studio and Members under Settings
- [ ] OCC member logs into `/admin` on the new Vercel URL, creates a real news post, saves, confirms it appears on the public `/news` page
- [ ] OCC member deletes that same post from admin, confirms it disappears from `/news`
- [ ] OCC member locates `docs/DEPLOYMENT.md` in the repo and reads the "Rolling back a bad deploy" section aloud (confirms they can find the written instructions when needed)

If any step requires Tammy to intervene, flag the gap and fix it before signing off.

## Phase 7 — Decommission the old Vercel project

Only after Phase 5 and Phase 6 pass, **and** after 48–72 hours of successful operation on OCC's new Vercel URL.

7.1 **(b)** Vercel → Tammy's personal account → old `occ-website` project → **Settings → Advanced → Delete Project**. Confirm.

7.2 **(b)** Sanity → OCC project → **API → CORS Origins**: remove the old Vercel preview URL added before the migration (kept in step 3.6 as a safety net; no longer needed).

7.3 **(a)** Keep the `cms-prep` branch — explicitly retained for future development (scheduled posts, multi-user auth, analytics).

## Rollback plans per phase

| Phase | Failure mode | Rollback |
|---|---|---|
| 1 (GitHub) | Transfer rejected or wrong account | Have OCC transfer the repo back to `TammyOweifie`. GitHub supports this. Local remote changes revert with another `git remote set-url`. |
| 2 (Vercel) | New project build fails | Nothing to roll back — old project is still live. Investigate the build log, fix, retry. |
| 3 (Sanity) | Transfer rejected or OCC can't access | Have OCC transfer the project back; Tammy remains Member. Try again after resolving the blocker. |
| 4 (Rotation) | Admin login or Sanity writes break after rotation | In Vercel → Settings → Environment Variables, revert the changed values to the pre-rotation versions (Tammy's export from step 0.3) and redeploy. Investigate what went wrong before re-attempting. |
| 7 (Decommission) | Something breaks after old project is deleted | Create a new Vercel project from the same GitHub repo on OCC's account (not Tammy's); same env vars; builds green. The deleted project cannot be undeleted but the setup is reproducible. |

At every phase before Phase 7, the previous state remains intact. Nothing is destroyed until Phase 7 and only after the cooldown window.

## After the handover (Tammy's warranty-period posture)

- Stays as **Admin** on OCC's GitHub repo for 3 months, then OCC can downgrade to Read or remove
- Stays as **Team Member** on OCC's Vercel team for 3 months, then OCC removes
- Stays as **Member** (not Administrator) on OCC's Sanity project for 3 months, then OCC removes
- Keeps `.env.local` on local dev machine only for the warranty window; rotates its Sanity token at the end of the warranty if it's still an Editor token on OCC's project

## Open questions resolved before writing this runbook

- Tammy stays on OCC's Vercel as a **Team Member** (not single-project invite)
- OCC does not yet have a GitHub account; a free **organisation** is being created rather than a personal account
- No admin-edit window needed — nothing is live yet
- No live content; everything is still in preview mode
- `cms-prep` branch is kept post-handover for planned future work: scheduled news posts, additional user accounts, analytics
