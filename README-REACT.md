# Visual Verse Creations — React / Tailwind v4 island navbar migration

This adds **React 19, TypeScript, Vite 7, Tailwind CSS v4, shadcn/ui configuration, Motion, and Lucide icons** to the EXISTING Visual Verse page. The rest of the homepage — particle morphing, interactive cubes, full-height hero, and all sections — remains intact.

## Local development

```bash
npm install
npm run typecheck
npm run dev
npm run build
```

Netlify: **Build command:** `npm run build`; **publish:** `dist`; **Node:** 22 (configured in `netlify.toml`).

The React island navbar renders into `#vv-react-nav-root`. Once mounted, the legacy HTML header is visually hidden. If the React bundle fails, the legacy navbar remains visible as a fallback.

## shadcn and Aceternity

shadcn/ui is configured in `components.json` and `src/lib/utils.ts` using `cn`. The `@aceternity` registry namespace is configured for future additions:

```bash
npx shadcn@latest add @aceternity/navbar-menu
```

The current `src/components/ui/navbar-menu.tsx` is a Motion-powered TypeScript adaptation of the animated navbar patterns rather than a verbatim registry export. This protects our existing navigation labels, logo and mobile interactions.

Tailwind v4 is installed through `@tailwindcss/vite`. Preflight is intentionally disabled so it does not reset the 2026 homepage's existing handcrafted styles while we progressively migrate sections into React.

Typography: TT Travels remains the preferred font, with Manrope/Arial fallback. Licensed TT Travels font files are NOT included.

## No redesign

Future changes should continue improving the exact same site and main branch, instead of replacing it with a different template. Do not move or delete the existing hero or brand assets before the later full component migration.
