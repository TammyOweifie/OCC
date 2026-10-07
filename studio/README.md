# OCC Studio

Optional Sanity Studio for direct editing of the CMS content.

**Status:** The CMS is live. Day-to-day editing happens in the custom admin UI at `/admin` on the deployed site. The Sanity Studio in this directory is an alternative/power-user interface against the same dataset — useful for schema inspection, bulk operations, or editing fields the custom admin doesn't surface (e.g. per-image hotspots on gallery photos).

The Studio is **not deployed anywhere by default**. Run it locally when needed, or deploy it to `<projectName>.sanity.studio` (free Sanity hosting) if OCC staff want a second editing surface.

## Running the Studio locally

```bash
cd studio
npm install
npm run dev
```

Opens at http://localhost:3333. Signs you in through your Sanity account; your account must have at least Viewer access on the OCC Sanity project to see data (Editor or above to make changes).

The Studio reads its connection from `sanity.cli.js` + `sanity.config.js` in this folder, which point at the same `projectId` / `dataset` as the main app's env vars (`SANITY_PROJECT_ID=aib1nnox`, `SANITY_DATASET=production`).

## Deploying the Studio (optional)

If OCC decides they want a hosted Studio URL in addition to the custom admin:

```bash
cd studio
npx sanity login
npx sanity deploy
```

You'll be prompted to pick a subdomain. The Studio becomes available at `<yourchoice>.sanity.studio` and anyone with Sanity access to the OCC project can log in.

## Schemas

The three content types edited through either admin surface:

- `schemas/newsPost.js` — News posts (title, slug, date, excerpt, body, thumbnail)
- `schemas/report.js` — Reports (title, date, cover image, description, optional PDF file)
- `schemas/galleryImage.js` — Gallery photos (image + alt, caption, orderRank)

The schemas live here (not on Sanity's servers) and are picked up on `npm run dev`. If you edit a schema, redeploy a new Studio build (`npx sanity deploy`) and the hosted Studio updates — the custom admin at `/admin` doesn't need any change because it writes documents by `_type`.
