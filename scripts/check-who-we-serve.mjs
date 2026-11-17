import assert from "node:assert/strict";
import { readFileSync, existsSync, statSync } from "node:fs";
import postcss from "postcss";

const read = (path) => readFileSync(path, "utf8");
const page = read("src/components/VisualVerseWhoWeServePage.tsx");
const styles = read("src/who-we-serve-redesign.css");
const router = read("src/components/VisualVerseInnerPages.tsx");
const html = read("who-we-serve.html");

assert.doesNotThrow(() => postcss.parse(styles, { from: "who-we-serve-redesign.css" }), "audience CSS must parse");
assert(router.includes('import("./VisualVerseWhoWeServePage")'), "audience page must be lazy loaded");
assert(router.includes('kind==="audiences"&&<VisualVerseWhoWeServePage/>'), "route must render the audience page");
assert(read("src/pages-main.tsx").includes("<Suspense fallback={null}><VisualVerseInnerPage"), "the lazy page and shared chrome must commit together");
assert(!router.includes("function AudiencePage()"), "old duplicate audience page must be removed");
assert(router.includes("<VisualVerseAboutCta/>") && router.includes("<VisualVerseFooter/>"), "shared CTA and footer remain");
assert(html.includes("Who We Serve | Visual Verse Creations"), "page SEO must be intact");
let photoBytes = 0;
for (const id of ["brands", "businesses", "founders", "creators", "events", "digital"]) {
  assert(page.includes('id:"' + id + '"'), "missing audience: " + id);
  assert(page.includes('image:"audience-' + id + '-creative.webp"'), "audience must have its own creative-industry photograph: " + id);
  assert(existsSync("public/audience-" + id + "-creative.webp"), "missing audience image: " + id);
  assert(html.includes(`rel="preload" as="image" href="%BASE_URL%audience-${id}-creative.webp"`), "audience photo must start loading before React: " + id);
  photoBytes += statSync(`public/audience-${id}-creative.webp`).size;
}
assert(photoBytes < 380_000, "six audience images exceed the page image budget");
assert(page.includes("image.decode()") && page.includes("photo.decoded"), "decode photos before switching to a new audience card");
let toolboxBytes = 0;
for (const discipline of ["film", "design", "web"]) {
  const file = `who-we-serve-toolbox-${discipline}.webp`;
  assert(page.includes(`asset("${file}")`), `toolbox card must display ${discipline} photography`);
  toolboxBytes += statSync(`public/${file}`).size;
}
assert(toolboxBytes < 160_000, "three toolbox images must stay lightweight");
assert(page.includes('useAboutScrollWords(".vvx-page", ".vvx-finale-statement")'), "final statement must reuse the About scroll reveal");
assert(page.includes('className="vvx-finale-watermark" src={asset("logo-mark.png")}'), "final statement must use the real logo watermark");
assert(page.includes('No pressure. <br/><em>Just possibilities.</em>'), "FAQ heading should use two explicit lines");
assert(page.includes('alt={world.imageAlt}'), "audience photos must have descriptive alternative text");
assert(page.includes('className="vvx-world-watermark" src={asset("logo-mark.png")}'), "use the actual Visual Verse watermark on every card");
assert(!page.includes("vvx-world-stamp") && !styles.includes("vvx-world-stamp"), "remove the former creative-partners stamp");
assert(styles.includes("font-size:clamp(33px,3.275vw,57px)"), "photo headlines must use the reduced type scale");
for (const name of ["function Hero()", "function WorldAtlas()", "function Collaboration()", "function FitFinder()", "function FinalStatement()"]) {
  assert(page.includes(name), "missing experience section: " + name);
}
assert(page.includes('className="vvx-hero-spotlight"') && page.includes("useMotionValue"),
  "hero must provide spotlight and spring-driven 3D parallax");
assert(page.includes("ImageGenerationLoaderDemo") && page.includes("who-we-serve-creative-service.webp"), "creative serving image loader must render");
assert(!page.includes("vvx-float-photo") && !styles.includes("vvx-float-photo"), "old hero collage must be removed");
assert(page.includes("{rotateX,rotateY}") && page.includes("useSpring"), "left/right spring hover must remain");
assert(existsSync("public/who-we-serve-creative-service.webp"), "creative service-themed photo is missing");
assert(html.includes('href="%BASE_URL%who-we-serve-creative-service.webp" fetchpriority="high"'), "hero photo must download immediately");
assert(read("src/components/image-generation-loader-demo.tsx").includes('effect="scale-wave"'), "Aceternity scan must run");
assert(read("src/components/image-generation-loader-demo.tsx").includes('text="SERVING"') && read("src/components/image-generation-loader-demo.tsx").includes('repeat={true}'), "SERVING scan must loop continuously");
assert(read("src/components/image-generation-loader-demo.tsx").includes('duration={4500}'), "SERVING scan must allow more reading time");
assert(page.includes("<EdgeMarquees/>") && page.includes("vvx-edge-marquee-left") && page.includes("vvx-edge-marquee-right"), "both vertical marquee rails must render");
assert(page.includes("<Hero/>\n    <MobileMarquee/>\n    <WorldAtlas/>"), "horizontal ribbon must sit below the hero only on mobile");
assert(styles.includes('.vvx-ribbon{display:none}') && styles.includes('@media(width < 1000px)') && styles.includes('.vvx-ribbon{display:block;') && styles.includes('animation:vvx-run-horizontal 60s linear infinite'), "horizontal ribbon must only appear below the desktop edge-rail breakpoint");
assert(styles.includes("animation:vvx-run-vertical 55s linear infinite") && styles.includes("min-height:100svh") && styles.includes("animation-direction:reverse"), "vertical marquee sets must cover the viewport and loop seamlessly in both directions");
const navStyles = read("src/resizable-navbar.css");
assert(navStyles.includes("box-shadow:var(--vv-card-inset-light)") && navStyles.includes("box-shadow:var(--vv-card-inset-selected)") && navStyles.includes("box-shadow:var(--vv-card-inset-photo)"), "both navbar dropdowns must reuse the page-card inset shadows");
assert(read("src/components/ui/image-generation-loader.tsx").includes("IntersectionObserver"), "loader must pause offscreen");
for (const title of ["Make it<br/>feel real.", "Stand<br/><em>out.</em>", "Good design<br/>is felt."]) {
  assert(page.includes(title), "toolbox headings must use sentence case: " + title);
}
assert(read("src/components/VisualVerseAboutCta.tsx").includes("<BackgroundRippleEffect/>"), "all closing CTAs must use the shared ripple background");
assert(read("src/components/ui/background-ripple-effect.tsx").includes("Math.hypot") &&
  read("src/components/ui/background-ripple-effect.css").includes("@keyframes vv-cell-ripple"), "CTA cells must ripple outward from the selected cell");
assert(styles.includes("object-fit:contain"), "serving photograph must stay uncropped");
assert(page.includes("IntersectionObserver") && styles.includes("position:sticky"),
  "sticky scroll-reveal chapter experience must remain");
assert(page.includes("role=\"tablist\"") && page.includes("aria-selected={active===i}"),
  "creative matchmaker must have accessible tab navigation");
assert(page.includes("aria-pressed={active===i}"), "audience selector must expose state");
assert(page.includes("event.key===" + '"ArrowDown"') && page.includes("event.key===" + '"ArrowUp"'),
  "matchmaker must support arrow keys");
assert(page.includes("<details") && page.includes("<summary>"), "FAQ must work without JavaScript state");
assert(page.includes("useReducedMotion") && styles.includes("prefers-reduced-motion"),
  "motion preferences must be respected");
assert(styles.includes("@media(max-width:900px)") && styles.includes("@media(max-width:680px)") &&
  styles.includes("@media(max-width:385px)"), "responsive desktop/tablet/small phone treatments must remain");
assert(page.includes('BASE + "request-quote.html"'), "enquiry links must respect GitHub Pages base path");
for (const photo of ["portfolio-event-story.jpg","portfolio-social-design.jpg","portfolio-corporate-moment.jpg",
  "portfolio-graduations.jpg","portfolio-event-detail.jpg","portfolio-corporate-events.jpg"]) {
  assert(existsSync("public/"+photo), "missing own-brand visual: "+photo);
}
assert(!page.includes("studio") && !page.includes("Studio"), "business naming must stay consistent");
assert(!page.includes("Inspired by Potadot"), "no internal inspiration notes in visitor copy");
console.log("Who We Serve v2: storytelling, interaction, media, accessibility and responsiveness verified.");
