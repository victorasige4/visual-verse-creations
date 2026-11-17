import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
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
for (const id of ["brands", "businesses", "founders", "creators", "events", "digital"]) {
  assert(page.includes('id:"' + id + '"'), "missing audience: " + id);
}
for (const name of ["function Hero()", "function WorldAtlas()", "function Collaboration()", "function FitFinder()", "function FinalStatement()"]) {
  assert(page.includes(name), "missing experience section: " + name);
}
assert(page.includes('className="vvx-hero-spotlight"') && page.includes("useMotionValue"),
  "hero must provide spotlight and spring-driven 3D parallax");
assert(page.includes("ImageGenerationLoaderDemo") && page.includes("who-we-serve-service.webp"), "new serving image loader must render");
assert(!page.includes("vvx-float-photo") && !styles.includes("vvx-float-photo"), "old hero collage must be removed");
assert(page.includes("{rotateX,rotateY}") && page.includes("useSpring"), "left/right spring hover must remain");
assert(existsSync("public/who-we-serve-service.webp"), "service-themed photo is missing");
assert(read("src/components/image-generation-loader-demo.tsx").includes('effect="scale-wave"'), "Aceternity scan must run");
assert(read("src/components/ui/image-generation-loader.tsx").includes("IntersectionObserver"), "loader must pause offscreen");
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
