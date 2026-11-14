import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

/** Regression guard: public-facing wording must describe Visual Verse as a
 * creative business, not a studio. The existing Supabase identifiers, CSS
 * class names, URLs, storage keys and database names MUST remain unchanged.
 */
const read = (file) => readFileSync(file, "utf8");
const htmlPaths = [
  "index.html", "about.html", "services.html", "projects.html",
  "contact.html", "who-we-serve.html", "request-quote.html",
  "public/console-preview.html", "public/console/index.html",
];
const uiPaths = [
  "public/console-assets/console.js",
  "src/components/VisualVerseAboutEditorial.tsx",
  "src/components/VisualVerseClosingSections.tsx",
  "src/components/VisualVerseFaqLab.tsx",
  "src/components/VisualVerseHowWeWork.tsx",
  "src/components/VisualVerseServices.tsx",
  "src/components/VisualVerseServicesEditorial.tsx",
  "src/components/VisualVerseInnerPages.tsx",
  "src/components/VisualVerseKenyaMap.tsx",
  "src/components/VisualVersePortfolio.tsx",
  "src/components/VisualVerseProcessJourney.tsx",
  "src/components/ui/resizable-navbar-demo.tsx",
  "src/components/ui/floating-dock.tsx",
];

const forbidden = [
  /studio console/i,
  /\bcreative studio\b/i,
  /\bone studio\b/i,
  /\bstudio access\b/i,
  /\bstudio account\b/i,
  /\bstudio workspace\b/i,
  /\bstudio administrator\b/i,
  /\bstudio members\b/i,
  /\bstudio team\b/i,
  /\bstudio base\b/i,
  /\bstudio output\b/i,
  /\bstudio snapshot\b/i,
  /\bstudio momentum\b/i,
  /\bstudio behind\b/i,
  /\banswer studio\b/i,
];

// Look at actual HTML text nodes and user-facing attributes, not internal
// class names, inline JS, CSS selectors or implementation comments.
for (const path of htmlPaths) {
  const source = read(path)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");
  const text = source.replace(/<[^>]*>/g, " ");
  const attributes = [...source.matchAll(/\b(?:aria-label|title|alt|placeholder)=(["'])(.*?)\1/gi)]
    .map((match) => match[2]).join(" ");
  for (const pattern of forbidden) {
    assert(!pattern.test(text + " " + attributes), path + ": forbidden public copy " + pattern);
  }
}
// Source JSX and client-generated content also carry visible copy; checking
// phrases on complete sources catches headings rendered later by React.
for (const path of uiPaths) {
  const source = read(path);
  for (const pattern of forbidden) {
    assert(!pattern.test(source), path + ": outdated public-facing phrase " + pattern);
  }
}
const consoleHtml = read("public/console-preview.html");
const gateway = read("public/console/index.html");
const footer = read("src/components/VisualVerseClosingSections.tsx");
const js = read("public/console-assets/console.js");
assert(consoleHtml.includes("<title>Visual Verse Console | Visual Verse Creations</title>"));
assert(gateway.includes("<h1>Visual Verse Console</h1>"));
assert(footer.includes(">Visual Verse Console <"));
assert(js.includes('supabase.functions.invoke("studio-team"'), "do not rename the deployed team function");
assert(js.includes('supabase.storage.from("studio-documents")'), "do not rename the private storage bucket");
assert(js.includes("IDLE_LIMIT_MS=7*60*1000"), "preserve 7-minute idle logout");
console.log("Visual Verse public website and Console naming checks passed.");
