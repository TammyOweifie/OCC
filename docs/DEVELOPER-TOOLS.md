# Developer Tools

This document covers clause 8.3 of the developer's client agreement — a declaration of any pre-existing Developer Tools (reusable code, components, or utilities authored before this engagement) that are included in the project and the terms under which they're licensed to the client.

## Declaration

**No pre-existing Developer Tools are included; all code was written for this project.**

Every file in this repository — React components, page templates, admin UI, serverless functions, Sanity schemas, utility helpers, build config — was authored specifically for the Obudu Conservation Centre website during this engagement. Nothing was carried over from a personal code library, a template repository, or previous client work.

## Scope of this declaration

What this covers:
- Every file under `src/` (components, pages, admin UI, data modules, lib helpers, SEO helpers, hooks)
- Every file under `api/` (serverless functions, session + auth helpers, Sanity write client, Portable Text helpers)
- Every file under `studio/` (Sanity schemas, Studio config)
- Every file under `public/` that is OCC-specific (OG image crop, favicon references, robots.txt, sitemap.xml)
- Build and config files (`vite.config.js`, `vercel.json`, `tailwind.config.js`, `postcss.config.js`)

What this does **not** cover:
- **Third-party open-source dependencies** listed in `package.json`. Those are the work of their respective authors and are governed by their own licences — fully audited in [`LICENSES.md`](./LICENSES.md). All of them use permissive licences (MIT, BSD-3-Clause, Apache-2.0) that allow commercial use and modification.
- **Fonts** loaded from Google Fonts (Playfair Display, Plus Jakarta Sans, Cinzel). Each uses the SIL Open Font Licence 1.1.
- **Third-party trademarks and logos** displayed as partnership identifiers (BirdLife, CERCOPAN, Rufford Foundation, etc.) in `public/assets/logos/partners/`. These are the property of their respective owners.
- **Photographs** uploaded to Sanity's asset store by OCC staff. Ownership and usage rights are OCC's responsibility to track.

## Implication for ownership transfer

Because no Developer Tools are embedded, the project can transfer to OCC's ownership in full — including the right to modify, extend, redistribute or sublicense — without any pre-existing-code carve-outs or usage restrictions from the developer. The licence terms that apply to the client are the licences on the third-party dependencies alone, documented in [`LICENSES.md`](./LICENSES.md).
