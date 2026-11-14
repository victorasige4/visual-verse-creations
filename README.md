# Visual Verse Creations

The active Visual Verse Creations website. **Always continue from the latest existing build rather than starting a separate design.**

## Current stack
React 19, TypeScript 5.9, Vite 7, Tailwind CSS v4, shadcn/ui configuration, Aceternity-inspired components, Motion and Lucide icons.

## Pages and entrypoints
- Home — `index.html` / `src/main.tsx` (preserves the established animated homepage)
- About, Services, Who We Serve, Contact, Let's Talk — their own HTML entrypoints with `src/pages-main.tsx`
- Projects — `projects.html` / `src/projects-main.tsx`

About, Services and Who We Serve feature code is loaded only for the relevant inner page. The About-page CTA is reused sitewide. Shared components and brand assets must be preserved.

## Development
```bash
npm install
npm run typecheck
npm run dev
npm run build
```

## Deployment
**GitHub Pages is the production target** (not Netlify).

- `.github/workflows/ci.yml` validates the TypeScript build and page assets on push.
- `.github/workflows/pages.yml` builds and deploys the `main` branch.
- Vite uses `/visual-verse-creations/` as the base with `GITHUB_PAGES=true`.
- `scripts/prepare-github-pages.mjs` adjusts root links in the generated `dist` output.

Production: https://victorasige4.github.io/visual-verse-creations/

To replicate the Pages build locally:
```bash
GITHUB_PAGES=true npm run build
node scripts/prepare-github-pages.mjs
```

## Safeguards
- Preserve navy `#003F5C`, deep navy `#002A40`, mint `#2EC4B6`, and the existing branding/assets.
- TT Travels is specified through `src/tt-travels.css`. The available trial font is **not licensed for public embedding**; no font binaries are committed. A licensed webfont is needed for identical typography on every device.
- Do not add scraped reference-site bundles or saved browser resources to the project root. The Vite pipeline builds the actual source.
- Don't remove working homepage islands, process animations, 3D pins, or the shared CTA without an explicit design decision.
- For the November 14 maintenance checkpoint, the untouched pre-sweep state is on `backup/pre-sweep-2026-11-14`. See `docs/site-maintenance-2026-11-14.md`.

## Known limitations
No lockfile is currently committed; `npm install` resolves the declared dependency ranges. Form submissions open an email draft rather than sending mail automatically. A full interactive browser regression sweep should accompany future major UI changes.
