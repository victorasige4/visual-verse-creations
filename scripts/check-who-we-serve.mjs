import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import postcss from "postcss";

const read = (path) => readFileSync(path, "utf8");
const page = read("src/components/VisualVerseWhoWeServePage.tsx");
const styles = read("src/who-we-serve-redesign.css");
const router = read("src/components/VisualVerseInnerPages.tsx");
const html = read("who-we-serve.html");

assert.doesNotThrow(() => postcss.parse(styles, { from: "who-we-serve-redesign.css" }), "page CSS must parse");
assert(router.includes('import("./VisualVerseWhoWeServePage")'), "new page must be lazy-loaded");
assert(router.includes('kind==="audiences"&&<Suspense'), "Who We Serve must be rendered by the site route");
assert(!router.includes("function AudiencePage()"), "old duplicate audience page must not remain");
assert(router.includes("<VisualVerseAboutCta/>") && router.includes("<VisualVerseFooter/>"), "shared CTA and footer must remain");
assert(html.includes("Who We Serve | Visual Verse Creations"), "page title must match route");
for (const id of ["brands","businesses","founders","creators","events","digital"]) {
  assert(page.includes('id: "'+id+'"'), "missing audience: "+id);
}
assert(page.includes("role=\"tablist\"") && page.includes("aria-selected={i===active}"),
  "journey selector must be accessible");
assert(page.includes("aria-expanded={expanded}") && page.includes("aria-controls={panelId}"),
  "audience cards must expose expansion state");
assert(page.includes("<details>") && page.includes("<summary>"), "native accessible FAQ controls required");
assert(page.includes("useReducedMotion") && styles.includes("prefers-reduced-motion"),
  "respect reduced motion settings");
assert(styles.includes("@media(max-width:690px)") && styles.includes("@media(max-width:390px)"),
  "layout must support phones");
assert(page.includes("BASE + \"request-quote.html\""), "project CTA links must be base-path safe");
for (const photo of ["portfolio-event-story.jpg","portfolio-social-design.jpg","portfolio-corporate-moment.jpg","portfolio-graduations.jpg"]) {
  assert(existsSync("public/"+photo), "missing first-party visual: "+photo);
}
assert(!page.includes("studio") && !page.includes("Studio"), "use Visual Verse Creations language");
console.log("Who We Serve page structure, SEO, media and accessibility checks passed.");
