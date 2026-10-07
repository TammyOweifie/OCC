# CMS (Sanity) technical reference

How the Sanity side of the system is set up, what the schemas look like, how the admin upload flow actually works, and how to export/restore the dataset.

## Project identity

- **Hosted at**: Sanity.io
- **Dashboard**: https://www.sanity.io/manage → OCC project
- **Project ID**: visible in the dashboard and in the Vercel env var `SANITY_PROJECT_ID`. The actual string is not reproduced here (handled as a Sensitive value — see [`ENVIRONMENT.md`](./ENVIRONMENT.md)).
- **Dataset**: `production`
- **Dataset visibility**: Public (readable without a token, from CORS-approved origins)

## Who edits content, how

Two surfaces exist against the same dataset:

| Surface | URL | Who typically uses it |
|---|---|---|
| **Custom admin** | `/admin/login` on the deployed site | OCC staff — the main day-to-day editor |
| **Sanity Studio** | `localhost:3333` after `npm run dev` in `studio/` | Developers, power users |

The two write to the same Sanity documents. Edits made in one appear in the other immediately on refresh.

The Sanity Studio in `studio/` is **not deployed anywhere by default**. If OCC wants a hosted Studio URL as a backup surface, run `npx sanity deploy` inside `studio/` — see `studio/README.md`.

## Schemas

All three schemas live in `studio/schemas/` and are the authoritative definition of each document type. The custom admin references these shapes but doesn't enforce them — Sanity itself does on write.

### `newsPost` (`studio/schemas/newsPost.js`)

A news item on `/news`.

| Field | Type | Notes |
|---|---|---|
| `title` | string | Required |
| `slug` | slug | Auto-generated from title; `maxLength: 96` |
| `date` | datetime | Date published |
| `thumbnail` | image (with `hotspot: true`) | Includes `alt` string sub-field |
| `excerpt` | text (rows: 3) | Short summary shown on the card |
| `body` | array of Portable Text blocks | Full content shown in the detail modal |

The custom admin saves the body as plain text with blank lines separating paragraphs; it's converted to Portable Text blocks on write (`api/_lib/portableText.js: textToPortableText`) and flattened back to a string array on read (`src/data/getNewsFromSanity.js`).

### `report` (`studio/schemas/report.js`)

A report entry on `/reports`.

| Field | Type | Notes |
|---|---|---|
| `title` | string | Required |
| `date` | datetime | Date |
| `image` | image (with `hotspot: true`) | Includes `alt` string sub-field. Shown next to the body on `/reports`. |
| `description` | text (rows: 6) | Body text on `/reports` |
| `file` | file | Optional. Any binary — PDFs are the usual case. |

### `galleryImage` (`studio/schemas/galleryImage.js`)

A photo on `/gallery`.

| Field | Type | Notes |
|---|---|---|
| `slug` | slug | Auto-generated from alt text; `maxLength: 80` |
| `image` | image (with `hotspot: true`), **required** | Includes `alt` string sub-field |
| `caption` | string | Optional. Not currently displayed on the public gallery. |
| `orderRank` | number | Lower numbers appear first. Blank → sorts by `_createdAt` desc. |

Two sort orderings are declared:
- **Manual (orderRank asc)** — the current default used by the public page
- **Newest first** — created-date descending

## The admin upload flow (end-to-end)

What happens when a staff member creates a news post or uploads a gallery photo:

1. **Form in the browser** (`src/admin/NewsForm.jsx`, `GalleryUpload.jsx`, etc.) collects user input, including an image file.
2. **Client-side resize** (`src/admin/imageResize.js`): if the file is a JPEG, PNG, or WebP larger than 2000 px on its longest side, it's drawn to a `<canvas>` at 2000 px max and re-encoded as JPEG at quality 0.85. HEIC, GIF, and SVG are passed through untouched.
3. **Client-side size check**: the (possibly resized) file is compared against `MAX_UPLOAD_BYTES` (3 MB). Oversized files are rejected with an inline error naming the file and the cap. For the gallery, oversized files are added to the queue as "Failed" rows so staff can see which specific file was rejected.
4. **Base64 encode**: valid files are converted to a data URL in the browser (`fileToDataUrl` in `src/admin/api.js`).
5. **POST to the serverless function**: a JSON payload including the base64 string is sent to the relevant endpoint (`/api/admin/news`, `/api/admin/reports`, `/api/admin/gallery`). The browser sends the admin session cookie with the request.
6. **Session verification** (`api/_lib/session.js: withAuth`): the function decodes the JWT in the cookie using `SESSION_SECRET`. Invalid → 401; valid → control passes to the handler.
7. **Server-side image upload**: the handler decodes the base64, calls `sanityWriteClient.assets.upload('image', buffer, { contentType, filename })`. Sanity stores it in its asset CDN and returns an asset `_id`.
8. **Document creation**: the handler calls `sanityWriteClient.create({ _type: 'newsPost', title, …, thumbnail: { _type: 'image', asset: { _ref: assetId }, alt } })`. Sanity returns the new document's `_id`.
9. **Response**: `201 { _id }`. The admin UI redirects back to the list view, which refetches `/api/admin/<type>` and shows the new row.

For a PDF attached to a report, the same flow runs with `sanityWriteClient.assets.upload('file', buffer, …)` instead of `'image'`.

## File validation rules

**Client-side** (`src/admin/imageResize.js` + per-form `handleFileChange`):

| Rule | Where enforced |
|---|---|
| Image types that get auto-resized: JPEG, PNG, WebP | `resizeImageIfLarge()` regex `/^image\/(jpeg\|png\|webp)$/` |
| Resize target: 2000 px max on the longest side | `MAX_DIM = 2000` |
| JPEG quality after resize: 0.85 | `canvas.toBlob(…, 'image/jpeg', 0.85)` |
| Hard max file size: 3 MB (`3 * 1024 * 1024` bytes) | `MAX_UPLOAD_BYTES` + `checkFileSize()` |
| Only `image/*` MIME types accepted into the gallery dropzone | `addFiles` filters `f.type.startsWith('image/')` |
| PDF field on Report form accepts `.pdf`, `.doc`, `.docx` | `<input accept="application/pdf,.pdf,.doc,.docx">` |

**Server-side** (`api/admin/*.js`):

| Rule | Where enforced |
|---|---|
| Required fields: `title` on news + reports; `image.base64` on gallery POST | Handler returns 400 if missing |
| Base64 data URL must match `/^data:([^;]+);base64,(.+)$/` | `uploadImageIfNew` / `uploadImage` |
| Vercel serverless body limit: ~4.5 MB total request size | Vercel platform limit — triggers 413 before the handler runs. The admin API client translates this into a friendly "File too large" error. |

If staff hit the 413 on a PDF (because PDFs aren't auto-resized), they're told to compress it before trying again.

## Caching behaviour on public pages

Public reads use the client in `src/lib/sanityClient.js`, which is deliberately configured with `useCdn: false`. That means every page load hits Sanity's live API, so edits/deletes made in the admin show up on the next page view.

If OCC's traffic grows significantly, flipping to `useCdn: true` adds ~60 seconds of cache per response. Staff see a brief delay between "I just saved it" and "visitors see it".

## Exporting and restoring the dataset (backup / disaster recovery)

Sanity's own CLI is the standard tool. Both commands include **assets by default** (images, PDFs — not just document JSON).

### Export (take a backup)

From the `studio/` folder on your machine, logged into the Sanity account that has access to the project:

```bash
cd studio
npx sanity login           # first time only
npx sanity dataset export production ./backup-$(date +%Y-%m-%d).tar.gz
```

Produces a single `.tar.gz` file containing:
- `data.ndjson` — every document, one per line
- `assets/images/` — every image asset the dataset references
- `assets/files/` — every uploaded file (PDFs etc.)

File sizes typically scale linearly with photo count. For OCC's current content (~15 documents + ~15 images) the backup is a few megabytes.

### Restore (import into a fresh dataset)

If you ever need to roll a dataset back, or seed a new one from a backup:

```bash
cd studio
npx sanity dataset import ./backup-YYYY-MM-DD.tar.gz production --replace
```

The `--replace` flag deletes existing content first and then imports the backup. Without it, the import is additive.

**Important**: `--replace` is destructive and irreversible without another backup. Confirm you have the right file before running it.

### Backup rhythm

**Current policy**: manual monthly export. Once per month, someone with Sanity access runs `npx sanity dataset export` as described above and uploads the resulting `.tar.gz` to OCC-controlled storage (OCC's Google Drive is a sensible default; keep the backups folder access-restricted). Keep at least the last two monthly exports so a bad backup doesn't overwrite your only good copy.

Monthly matches OCC's actual pace of content change (news posts and reports are infrequent; gallery updates likewise). More frequent manual exports are reasonable if content starts changing weekly.

If backup volume or frequency grows, automate it: a GitHub Action running on a weekly cron can call `npx sanity dataset export` with the `SANITY_WRITE_TOKEN` and push the result to cloud storage. About an hour of work to set up — not needed today.

## When to touch schemas vs. when to touch content

- **Changing field options** (e.g. adding a `caption` field to `newsPost`) → edit `studio/schemas/newsPost.js`, redeploy any live Studio (`npx sanity deploy` inside `studio/`), and update the custom admin form if the new field needs to be editable there. Existing documents keep working — new fields just appear as `null` until populated.
- **Fixing a typo in an existing post** → log in to `/admin/login`, edit, save. No code change.
- **Changing how a page displays content** → edit the page component (`src/pages/News.jsx`, etc.) and push. No CMS change needed.

## Sanity CORS origins

Reads from the browser (`VITE_SANITY_PROJECT_ID` client) only work from origins listed in **Sanity → API → CORS Origins**. If you deploy to a new URL and public pages suddenly show "Coming Soon" everywhere, add the URL to the CORS allowlist. Keep the old entries so previous preview URLs still work for debugging.

See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for the step-by-step when attaching a custom domain.
