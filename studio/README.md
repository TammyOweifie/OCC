# OCC Studio

Sanity Studio for Publications and Reports.

**Status:** prep only — not yet commissioned. This directory exists on the `cms-prep` branch so schemas and the main-app integration can be reviewed. The deployed site (main) is unaffected.

## First-time setup

1. From this directory, install deps and link to a Sanity project. You'll need a free Sanity.io account:
   ```bash
   cd studio
   npm install
   npx sanity init --env
   ```
   Choose:
   - "Use the default dataset configuration" → `production`
   - "Free" plan when prompted
   - The command writes `.env.development` with the project ID and dataset

2. Copy the projectId + dataset into `../.env.local` (in the repo root) as:
   ```
   VITE_SANITY_PROJECT_ID=xxxxxxx
   VITE_SANITY_DATASET=production
   ```
   so the main app can read them too when the CMS is eventually wired up.

3. Run the Studio locally:
   ```bash
   npm run dev
   ```
   Opens at http://localhost:3333.

## Deploying the Studio

Once schemas are approved and the site is ready to switch over:

```bash
npm run deploy
```

Deploys the Studio to `<projectName>.sanity.studio` (free hosting on Sanity's plan).

## Schemas

- `schemas/publication.js` — corresponds to the Publications page card grid + modal detail
- `schemas/report.js` — corresponds to the Reports page stacked list with optional download

See the comment at the top of each file for the mapping to `src/data/*.js`.
