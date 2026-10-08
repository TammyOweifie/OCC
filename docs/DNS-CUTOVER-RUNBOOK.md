# DNS cutover runbook

How to point `obuduconservationc.org` from WordPress.com → Vercel without disrupting OCC's email, and how to decommission the WordPress.com subscription afterwards.

**Author**: Tammy (yapsgenius@gmail.com)
**Target DNS cutover**: Tue 13 Oct 2026, ~09:00 Lagos time
**Public launch moment**: Fri 16 Oct 2026, 00:00 Lagos time (= 2026-10-15T23:00:00Z)
**Executor**: Tammy, using OCC's GoDaddy + WordPress.com logins

## What this runbook does and does not do

**Does**:
- Snapshot the current DNS state before touching anything
- Flip the website A record from WordPress's shared hosting IPs to Vercel's anycast IP, with the custom domain live in **countdown mode** for ~63 hours before the launch moment
- Update the SPF TXT so WordPress.com is no longer listed as an authorised mail sender once OCC's mail traffic is Google-only
- Migrate DNS management from WordPress.com's panel to GoDaddy's own panel after the website is proven stable, so the WordPress.com subscription can be cancelled without taking DNS down
- Cancel the WordPress.com subscription

**Does not**:
- Touch MX records (Google Workspace mail delivery stays intact throughout)
- Touch DMARC
- Deploy any code (the countdown and launch gate already ship via the Vercel build)
- Perform the OCC-account handover — that's [`HANDOVER-RUNBOOK.md`](./HANDOVER-RUNBOOK.md); Phase 1 here depends on handover Phase 2 (OCC's Vercel project existing)

## Investigation snapshot (captured 2026-10-08)

The authoritative starting state. Keep for rollback reference.

| Facet | Value |
|---|---|
| Registrar | GoDaddy |
| Nameservers | `ns1.wordpress.com`, `ns2.wordpress.com`, `ns3.wordpress.com` |
| A `@` | `192.0.78.215`, `192.0.78.140` (WordPress.com shared hosting) |
| CNAME `www` | → `obuduconservationc.org` (apex alias) |
| MX `@` | `aspmx.l.google.com` (prio 1), `alt1.aspmx.l.google.com` (5), `alt2.aspmx.l.google.com` (5), `alt3.aspmx.l.google.com` (10), `alt4.aspmx.l.google.com` (10) — Google Workspace |
| TXT `@` (SPF) | `v=spf1 include:_spf.wpcloud.com ~all` (WordPress.com — needs updating) |
| TXT `_dmarc` | `v=DMARC1;p=none;` (monitor-only, keep) |
| DKIM at `google._domainkey` | Not set (pre-existing gap — see Phase 3.3) |
| A record TTL | ~300 s (5 min) |
| MX record TTL | ~3600 s (1 hour) |
| Domain expiry | 2027-04-07 |

Legend for action types: **(a)** terminal/code · **(b)** dashboard (Tammy)

---

## Phase 0 — Pre-flight (do by Mon 12 Oct)

0.1 **Logins in hand** ✓
    - GoDaddy admin access — confirmed
    - WordPress.com admin access — confirmed

0.2 **(b)** WordPress.com → My Site → Upgrades → Domains → `obuduconservationc.org` → **DNS Records**: edit the MX records' TTL (if the UI exposes TTL) from 3600 → 300. If TTL isn't editable in WP's panel, skip — just note that Phase 3's SPF revert will take up to 1 hour to propagate if rolled back.

0.3 **(a)** Snapshot DNS to a file for diffing after the change:
```bash
for t in NS A AAAA MX TXT; do
  echo "=== $t ==="; dig +short $t obuduconservationc.org
done > /tmp/dns-pre-cutover.txt
```

## Phase 1 — Prerequisites

Depends on handover runbook Phase 2 (OCC's Vercel project exists with env vars populated).

1.1 **(b)** OCC's Vercel → the project → **Settings → Domains → Add Domain**
    - Enter `obuduconservationc.org` → Vercel asks whether to also add `www.obuduconservationc.org` → yes. Pick apex as canonical; `www` auto-redirects.
    - Vercel shows the DNS records it needs:
      - Apex: A record → `76.76.21.21`
      - `www`: CNAME → `cname.vercel-dns.com`
    - Both show **"Invalid Configuration"**. Expected — DNS hasn't flipped yet.

1.2 **(b)** On the same screen, confirm the **Production Branch** is `main`.

## Phase 2 — DNS cutover (website only, email untouched)

**Window: Tue 13 Oct 2026, ~09:00 Lagos time** — 63 hours before the public launch moment. Enough buffer for SSL provisioning, DNS propagation, and a full day of monitoring; early enough to catch problems before the launch window.

Site lands on the custom domain in **countdown mode** (the launch gate's `VITE_LAUNCH_AT` default is 2026-10-15T23:00:00Z, still ~2.5 days away). This is intentional — proves SSL + domain + Vercel work; the countdown then auto-switches to the full site at midnight Lagos on launch night.

2.1 **(b)** WordPress.com → My Site → Upgrades → Domains → `obuduconservationc.org` → **DNS Records**.

2.2 **(b)** Edit the two A records:
    - `192.0.78.215` → **`76.76.21.21`**
    - `192.0.78.140` → **delete** (Vercel wants a single A record)

2.3 **(b)** Keep CNAME `www` → root (unchanged — Vercel honours this and the apex A record carries both)

2.4 **(b)** **Do not touch** any MX, DMARC TXT, DKIM, or the SPF record in this step. Email continues flowing throughout.

2.5 Wait ~10 minutes for the short-TTL A record to propagate.

2.6 **(a)** Verify from terminal:
```bash
dig +short A obuduconservationc.org
# expect: 76.76.21.21

curl -sI https://obuduconservationc.org/ | head -3
# expect: HTTP/2 200 + a valid cert, served from Vercel
```

2.7 **(b)** Vercel → Settings → Domains: the "Invalid Configuration" badge flips to a green checkmark within ~2 min once Let's Encrypt provisions the SSL cert.

## Phase 3 — SPF cleanup (same session)

Now that WordPress.com no longer sends mail as `obuduconservationc.org`, remove it from the SPF authorised list.

3.1 **(b)** WP DNS panel → edit the apex TXT record:
    - Was: `v=spf1 include:_spf.wpcloud.com ~all`
    - To: **`v=spf1 include:_spf.google.com ~all`**

3.2 **(b)** DMARC TXT at `_dmarc` → leave `v=DMARC1;p=none;` as is.

3.3 **(b)** **Optional, deferred**: set up Google DKIM. Google Workspace Admin → **Apps → Google Workspace → Gmail → Authenticate email** → select `obuduconservationc.org` → **Generate new record** (2048-bit) → copy the TXT record value → add in WP DNS at name `google._domainkey` → wait 1 h → come back to Google Admin and click **Start authentication**. Improves email deliverability (prevents spoofing); non-blocking for launch.

## Phase 4 — Verify (immediately after Phase 3)

4.1 **(a)** DNS checks:
```bash
dig +short A obuduconservationc.org          # 76.76.21.21
dig +short MX obuduconservationc.org          # 5 Google records intact
dig +short TXT obuduconservationc.org         # new SPF: _spf.google.com
dig +short TXT _dmarc.obuduconservationc.org  # unchanged
```

4.2 **(b)** Email round-trip test:
    - Send a test message from Gmail (`info@obuduconservationc.org` or any OCC user) to a personal address → receive it, headers show SPF=pass
    - Reply from the personal address → OCC's Gmail receives it

4.3 **(b)** Sanity → OCC project → **API → CORS Origins → Add**:
    - `https://obuduconservationc.org`
    - `https://www.obuduconservationc.org`
    - Allow Credentials: off
    - Keep the existing `.vercel.app` origin

4.4 **(b)** Vercel → Project → Settings → Domains:
    - Set `obuduconservationc.org` as **Production Domain**
    - `www.obuduconservationc.org` → **Redirect to apex**

4.5 **(a)** Visit `https://www.obuduconservationc.org/` → redirects to apex. Visit the apex → see the countdown with ~62 h remaining. Browser DevTools → Console: no CORS errors; `/api/time` returns `{now: …}` with status 200.

4.6 **(b)** Share the URL with OCC for their final walk-through before launch.

**State at end of Phase 4**: website on custom domain in countdown mode; email flows through Google unchanged; WP.com still "serves" DNS but the website A record points away from it. The site then auto-swaps to the full version at 00:00 Lagos on Friday night without any further action required.

## Phase 5 — Migrate DNS off WordPress → GoDaddy (post-launch, Mon 19 Oct onwards)

Don't start this before the website is 72 h stable on the new infrastructure.

5.1 **(b)** GoDaddy → `obuduconservationc.org` → **DNS Management**.

5.2 **(b)** Pre-populate every record BEFORE flipping nameservers, so nothing is lost on the handover:

    | Type | Name | Value | Priority |
    |---|---|---|---|
    | A | `@` | `76.76.21.21` | — |
    | CNAME | `www` | `cname.vercel-dns.com` | — |
    | MX | `@` | `aspmx.l.google.com` | 1 |
    | MX | `@` | `alt1.aspmx.l.google.com` | 5 |
    | MX | `@` | `alt2.aspmx.l.google.com` | 5 |
    | MX | `@` | `alt3.aspmx.l.google.com` | 10 |
    | MX | `@` | `alt4.aspmx.l.google.com` | 10 |
    | TXT | `@` | `v=spf1 include:_spf.google.com ~all` | — |
    | TXT | `_dmarc` | `v=DMARC1;p=none;` | — |
    | TXT | `google._domainkey` | (DKIM value from Phase 3.3, if generated) | — |

5.3 **(b)** GoDaddy → `obuduconservationc.org` → **Nameservers → Change Nameservers** → switch from `ns1/2/3.wordpress.com` back to GoDaddy's default nameservers (the dialog auto-populates them).

5.4 Wait 24–48 h for nameserver propagation. During the window, some resolvers hit WordPress's DNS (which still points A → `76.76.21.21`, so visitors still land on Vercel) and some hit GoDaddy's DNS (same destination). **No downtime.**

5.5 **(a)** After ~48 h, verify:
```bash
dig +short NS obuduconservationc.org   # GoDaddy's nameservers (ns*.domaincontrol.com)
dig +short A obuduconservationc.org    # still 76.76.21.21
dig +short MX obuduconservationc.org   # still Google's 5
dig +short TXT obuduconservationc.org  # still SPF via _spf.google.com
```

## Phase 6 — Cancel WordPress.com

Only after Phase 5 is verified stable (expect ~Wed 21 Oct onwards).

6.1 **(b)** WordPress.com → **Tools → Export → Download Export** — grabs any pages, posts, media, and settings as a .zip. Save to OCC-controlled storage (Google Drive is a sensible default).

6.2 **(b)** WordPress.com → **Settings → Subscriptions / Plan → Cancel plan**. Follow the cancellation flow. Confirm the domain is listed as "connected via nameservers at GoDaddy" — this means cancellation won't take DNS with it.

6.3 **(b)** WordPress.com → **Settings → Delete site**. Confirm.

6.4 Monthly billing on WP.com stops. OCC's monthly cost for the site is now Vercel (free tier for OCC's traffic) + Sanity (free tier) + the GoDaddy domain renewal.

---

# Rollback plans

| Phase | If it breaks | Rollback |
|---|---|---|
| 2 (A record flip) | Site unreachable, SSL fails, custom domain shows an error | WP DNS panel → revert the A record to `192.0.78.215` and re-add `192.0.78.140`. Both propagate within ~5 min (short TTL). |
| 3 (SPF change) | Outbound email starts bouncing or being marked as spam | WP DNS panel → revert SPF TXT to `v=spf1 include:_spf.wpcloud.com ~all`. Resolves in ~1 h (MX TTL), or ~5 min if 0.2 pre-lowered it. |
| 5 (nameserver change) | Any resolution anomaly after 48 h | GoDaddy → flip nameservers back to `ns1/2/3.wordpress.com`. 24–48 h to fully revert. During revert window, GoDaddy's records remain correct and resolve where cached, so the practical downtime is close to zero. |
| 6 (cancellation) | — | **Phase 6 is irreversible.** Export the site first (6.1), verify at least a week of stability before pulling the trigger. |

Phase 2 is reversible, Phase 3 is reversible, Phase 5 is reversible, Phase 6 is not.

---

# Dated schedule

| Date | Phase | Action |
|---|---|---|
| Thu 9 Oct | — | Handover Phase 1–2: OCC accounts; OCC's Vercel project exists |
| Fri 10 Oct | 1 | Add `obuduconservationc.org` to OCC's Vercel (Phase 1); lower MX TTL at WP (Phase 0.2) |
| Mon 12 Oct | 0 | Final pre-flight; confirm Vercel's "Invalid Configuration" badge is visible (expected) and the DNS targets Vercel shows are `76.76.21.21` / `cname.vercel-dns.com` |
| **Tue 13 Oct 09:00 Lagos** | 2 + 3 + 4 | DNS flip + SPF cleanup + verify (~30 min hands-on) |
| Tue 13 Oct afternoon → Thu 15 Oct | — | Monitor; retest email; retest site; retest Sanity CMS writes from admin |
| Thu 15 Oct 23:00 Z (= Fri 00:00 Lagos) | — | Public launch: countdown gate flips to the full site on the custom domain |
| Mon 19 Oct onwards | 5 | Move DNS from WP → GoDaddy; wait 48 h |
| Wed 21 Oct onwards | 6 | Export WP content; cancel subscription; delete site |

---

# What to tell OCC

A short note to Nela, after Phase 4 completes on Tue 13 Oct:

> The site is now live on obuduconservationc.org. It's showing the "launching soon" countdown page until 00:00 Fri 16 Oct, when it switches automatically to the full site. Email is unchanged. Let me know if you spot anything strange before launch.

A follow-up note after Phase 6:

> WordPress.com has been cancelled. OCC's monthly website cost is now zero (Vercel + Sanity are both on their free tiers for your traffic level); you'll continue paying GoDaddy annually for the domain.
