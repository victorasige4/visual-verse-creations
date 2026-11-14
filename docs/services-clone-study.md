# Visual Verse — Services page clone-study record

## References and constraints

- Original Visual Verse content/site: https://visual-verse-studio.netlify.app/services
- Potadot visual reference: https://potadot.com.my/services
- Target production repository: victorasige4/visual-verse-creations
- Publish target: GitHub Pages, using the existing React/TypeScript/Tailwind v4 project.
- **Brand token lock:** navy #003F5C, deep navy #002A40, mint #2EC4B6, white and neutral tints. TT Travels remains the site-wide font preference. Do not import Potadot brand art, commercial fonts, source bundles or imagery.

## Capture observations

The references were inspected by Playwright at desktop (1440×900) and mobile (390×844), recording scroll positions, screenshots, section DOM and visible animated states.

**Original Visual Verse:** a dark-navy Services page with six photograph/artwork-backed tiles. The studio offerings are photography, videography, graphic design, web/UI/UX, social media/digital marketing and branding.

**Potadot:** an editorial Services hero with numbered jump navigation; four successive large image/copy split panels; a 7-stage sticky process; and three practical guide cards before the CTA.

The primary design feature is **a pinned scroll-driven timeline**, not a static accordion:
- Process section desktop height approximately 4,806px at 1440×900.
- A fixed-height viewport scene remains sticky as the outer section scrolls.
- The left portion measures approximately 592px at x=136 and holds the heading and 414px-tall interactive visual board.
- The right is about 500px at x=804 and holds seven vertically connected, numbered steps.
- Scrolling advances the active number, progress line and artwork simultaneously, with subdued earlier/upcoming steps and an illuminated active circle.
- The scene art changes for each stage: conversation → roadmap → design → implementation → QA → launch → ongoing support.
- On mobile the original uses a compressed vertical timeline and a prominent moving stage.

## Adaptation decision

This is an original implementation of the layout and scroll behaviour, keeping the Visual Verse studio's own service categories and rewriting the process for creative production. It is **not** a copy of Potadot's proprietary software, screenshots, artwork or business-specific content.

### Page architecture
1. Dedicated visual-services hero and 6 numbered navigation pills.
2. Six services in a **3-column × 2-row Aceternity 3D Pin grid**, 2 columns on tablet and 1 on mobile, using Visual Verse photography and creative-software mockups. Legacy service anchor links remain.
3. Seven-stage pinned scroll process with original mini-scenes, a moving beacon, and per-stage visual animations.
4. Three **Before You Decide** guide cards.
5. The reusable About-page CTA across Services and every other page, retaining navigation, footer and WhatsApp contact.

### Creative journey
01 The First Conversation → 02 Discovery & Planning → 03 Creative Direction → 04 Design & Production → 05 Review & Refinement → 06 Delivery & Launch → 07 Beyond the Launch.

The process uses an RAF-throttled scroll observer to update an active step and CSS progress variable. An accessible button for each step scrolls to the corresponding portion of the runway. Stage artwork has a blurred, 3D entrance and exit. Each step animates its own content: conversation bubbles, roadmap bars, moodboard tiles, a moving design cursor, review checks, launch pulses, and the final growth chart. Reduced-motion users see static content.

## Aceternity 3D Pin implementation

- Verified shadcn/ui configuration, Tailwind CSS 4.1, TypeScript 5.9, React 19, Motion, clsx, and tailwind-merge in the current repository.
- Downloaded and inspected the exact official registry entries at https://ui.aceternity.com/registry/3d-pin-demo.json and https://ui.aceternity.com/registry/3d-pin.json.
- The official demo supplies `components/3d-pin-demo.tsx` and `components/ui/3d-pin.tsx`; the base component requires `motion`.
- Rebuilt its `PinContainer` / `PinPerspective` composition in `src/components/ui/3d-pin.tsx`, with tilt, light beam, floating label and pulsing orbits. Used brand navy/mint instead of the upstream cyan/emerald and one accessible anchor instead of nested links.
- The ring animation only runs on hover; coarse-pointer and reduced-motion devices show stable, readable cards.
- The cards use available Visual Verse portfolio photographs or in-project creative-workspace illustrations, not proprietary third-party assets.

## Animation inventory

| Trigger | Target | Behaviour |
| --- | --- | --- |
| Hover/focus | 3D service cards | Tilt, lift, floating label, orbiting mint rings, image zoom |
| Scroll | Pinned process | Active step and connected progress line with moving beacon |
| Stage 01 | Conversation | Staggered speech bubbles |
| Stage 02 | Discovery | Planning bars fill sequentially |
| Stage 03 | Direction | Moodboard tiles and colour chips reveal |
| Stage 04 | Production | Design artboard assembles with a moving cursor |
| Stage 05 | Refinement | Review items check in one after another |
| Stage 06 | Launch | Ring pulses and labels enter |
| Stage 07 | Support | Growth graph draws itself |
| CTA enters viewport | All pages | About-style word-by-word text, magnetic buttons and floating ring |
## Verification

- Build check: TypeScript + production build + GitHub Pages build, successful after integration.
- Browser QA at 1440×900, 820×1024 and 390×844: six pins present; mouse hover produces a 3D tilt; stage 01 → 04 → 07 transitions passed; no browser errors, missing assets or horizontal overflow.
- Visual polish: mobile process headline adjusted to clear the fixed glass navigation.
- Sitewide QA: Home, About, Services, Who We Serve, Contact, Quote, and Projects each render exactly one shared CTA. Headline word animations ran in all tested viewports. Reduced motion passed.

## Further iteration

Compare screenshots at matched viewport dimensions before changing interaction geometry. Preserve existing service copy, hosting, brand tokens and all user-owned imagery. Avoid swapping the pinned process for normal cards.
