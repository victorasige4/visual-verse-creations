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
2. Six full-width alternating split service sections, each with original Visual Verse content and portfolio/creative-tool previews.
3. Seven-stage interactive, pinned scroll process with original mini-scenes.
4. Three next-step guide cards.
5. Existing site's final CTA, navigation, footer and WhatsApp contact.

### Creative journey
01 The First Conversation → 02 Discovery & Planning → 03 Creative Direction → 04 Design & Production → 05 Review & Refinement → 06 Delivery & Launch → 07 Beyond the Launch.

The process uses an RAF-throttled scroll observer to update an active step and CSS progress variable. An accessible button for each step scrolls to the corresponding portion of the runway. Stage artwork crossfades with a quick easing; reduced-motion users get a nonanimated transition.

## Verification

- Build check: TypeScript + production build + GitHub Pages build, successful after integration.
- Desktop/tablet/mobile smoke test: 6 services present, 01 → 04 → 07 scrolled timeline numbers verified, no page errors, no missing referenced assets or horizontal overflow.
- Visual polish: mobile process headline adjusted to clear the fixed glass navigation.
- Full final QA re-run after mobile adjustment.

## Further iteration

Compare screenshots at matched viewport dimensions before changing interaction geometry. Preserve existing service copy, hosting, brand tokens and all user-owned imagery. Avoid swapping the pinned process for normal cards.
