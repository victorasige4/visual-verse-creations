# Site maintenance — 14 November 2026

## Preserve the current design
This pass is **code cleanup, not a redesign**. The pre-sweep working state is preserved at `backup/pre-sweep-2026-11-14` (commit `3e0423cb9373d6e0dfbb091f7d81e27b89cf22ea`).

## Verified cleanup
- Removed 54 root-level hashed stylesheets, scripts, and saved browser-capture resources (about **7.65 MiB** from the working tree). None are Vite entrypoints or referenced in the active homepage.
- Split About, Services, and Who We Serve into dynamic page-specific React bundles. About-only styles are no longer loaded by unrelated inner pages.
- Changed the three initially eager service-gallery photos to browser-managed lazy loading.
- Removed the obsolete legacy About implementation from `VisualVerseInnerPages.tsx`; the current `VisualVerseAboutEditorial` remains intact.
- Removed unused older audience styles and unused UI button/navbar-menu modules; the active resizable navbar is untouched.
- Normalized Web/UI/UX and Branding card query parameters to the quote form's canonical options; audience referrals now retain their context.
- Updated repository documentation to reflect GitHub Pages rather than the former Netlify instructions.

## Do not remove
- `index.html` legacy homepage art/animations and `src/main.tsx` React islands
- `src/components/ui/3d-pin.tsx` and the six service pin cards
- `src/components/VisualVerseProcessJourney.tsx`, CTA, About, Projects, audience content
- Source photography, logos, favicon, Kenya counties data and its licence
- TT Travels typographic declarations and all currently used CSS

## Quality checks
The existing CI checks TypeScript, the Vite production build, required HTML entrypoints, brand assets and GitHub Pages base paths. Interactive animation, responsive screenshots, visual differences and third-party form delivery are **not** automatically covered. Do a targeted browser QA before any substantial new redesign.

## Follow-up
Pin dependencies with a lockfile once a verified install is available. Continue visual work from the latest `main` build, using the backup branch only for rollback if necessary.
