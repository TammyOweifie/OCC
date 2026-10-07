# Dependency licences

Every direct dependency declared in `package.json`, its installed version at the time of writing, and its licence.

All current direct dependencies use **permissive** licences (MIT, BSD-3-Clause, or Apache-2.0). All of them permit commercial use, modification, redistribution and private use. None are copyleft (GPL/AGPL/LGPL), and none restrict the kinds of projects OCC can build on top.

If you install new dependencies, re-check their licences before shipping. The quick way:

```bash
cat node_modules/<package-name>/package.json | grep '"license"'
```

Or, for a full tree audit of every transitive dependency (not just direct ones):

```bash
npx license-checker --summary
```

---

## Runtime dependencies (`dependencies` in `package.json`)

| Package | Version | Licence | Commercial use / modification allowed? |
|---|---|---|---|
| `@sanity/client` | 8.7.0 | MIT | ✅ |
| `@sanity/image-url` | 2.1.1 | MIT | ✅ |
| `bcryptjs` | 3.0.3 | BSD-3-Clause | ✅ |
| `framer-motion` | 13.4.0 | MIT | ✅ |
| `jose` | 6.2.12 | MIT | ✅ |
| `react` | 19.3.0 | MIT | ✅ |
| `react-dom` | 19.3.0 | MIT | ✅ |
| `react-helmet-async` | 3.0.0 | Apache-2.0 | ✅ |
| `react-router-dom` | 7.18.4 | MIT | ✅ |

## Dev dependencies (`devDependencies` in `package.json`)

Only used at build/dev time; not bundled into the deployed site.

| Package | Version | Licence | Commercial use / modification allowed? |
|---|---|---|---|
| `@types/react` | 19.3.0 | MIT | ✅ |
| `@types/react-dom` | 19.3.0 | MIT | ✅ |
| `@vitejs/plugin-react` | 6.1.1 | MIT | ✅ |
| `autoprefixer` | 10.6.1 | MIT | ✅ |
| `oxlint` | 1.83.0 | MIT | ✅ |
| `postcss` | 8.5.28 | MIT | ✅ |
| `tailwindcss` | 3.4.19 | MIT | ✅ |
| `vite` | 8.3.0 | MIT | ✅ |

---

## Licence summary

Three licence families are represented:

### MIT (most common)
Permits anything as long as the original copyright notice and licence text are preserved somewhere. No warranty. No obligation to open-source your own code.

### BSD-3-Clause (`bcryptjs`)
Very similar to MIT, with one extra clause: you can't use the names of the project or its contributors to endorse derivative products without written permission. Doesn't affect how OCC uses the library.

### Apache-2.0 (`react-helmet-async`)
Permits commercial use, modification and distribution. Adds explicit patent-grant protection (contributors grant patent rights to users). The main compliance obligation is retaining the licence and NOTICE file in redistributions — not relevant for a web app that doesn't ship source to end users.

**No copyleft or restrictive licences detected.** OCC can continue to use, modify, host and extend this project commercially without licensing concerns from the current dependency set.

---

## What's NOT audited here

- **Transitive dependencies** (packages depended on by the packages above). These sometimes include different licences. Run `npx license-checker --summary` for a complete picture; the top-level breakdown is almost always permissive but worth confirming before any legally sensitive distribution.
- **Fonts loaded from Google Fonts** (Playfair Display, Plus Jakarta Sans, Cinzel) — all three are Open Font Licence 1.1, which allows free use including commercially, with the only restriction being that the font itself can't be sold on its own.
- **Partner logos** in `public/assets/logos/partners/` — these are third-party trademarks (BirdLife, CERCOPAN, Rufford Foundation, etc.) displayed with OCC's permission as partnership identifiers. They are not licensed to OCC as general assets.
- **Photos** in Sanity's asset store — ownership and licensing of individual photographs is OCC's responsibility to track.

**TODO: confirm** — if OCC has written agreements with photographers or partner organisations about image/logo usage, keep them with this documentation.
