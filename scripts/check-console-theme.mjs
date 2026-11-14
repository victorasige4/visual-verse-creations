import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import postcss from "postcss";

const read = (path) => readFileSync(path, "utf8");
const html = read("public/console-preview.html");
const js = read("public/console-assets/console.js");
const theme = read("public/console-assets/console-theme.css");
const base = read("public/console-assets/console.css");
const modern = read("public/console-assets/console-modern.css");
const upload = read("src/components/ui/file-upload.css");

// Catch malformed braces and unclosed selectors before publishing an unbundled stylesheet.
for (const [name, css] of [["console.css", base], ["console-modern.css", modern], ["console-theme.css", theme], ["file-upload.css", upload]]) {
  assert.doesNotThrow(() => postcss.parse(css, { from: name }), name + " CSS must parse");
}

assert(html.includes("console-theme.css"), "theme stylesheet must be loaded");
assert(html.indexOf("console-modern.css") < html.indexOf("console-theme.css"), "theme overrides must load last");
assert(html.includes("vv-console-theme"), "early theme initialization prevents a light-mode flash");
assert.equal((html.match(/class="console-theme-toggle"/g) || []).length, 2, "theme toggle needed on login and dashboard");
assert(js.includes("applyConsoleTheme(") && js.includes("localStorage.setItem(THEME_KEY"), "user theme preference must persist");
assert(theme.includes('[data-console-theme="dark"]'), "dark appearance selectors are required");
assert(theme.includes("color-scheme:dark"), "dark inputs must use dark-native form colors");
assert(theme.includes(".vv-upload-dropzone"), "shared React uploader should respect the theme");
assert(theme.includes("@media(max-width:760px)"), "theme should cover responsive layout");
assert(theme.includes(".table-row:not(.heading)>span:nth-child(2)"), "mobile table columns must remain visible");
assert(!/[↗↘↖↙➜➔⇢➝⟶→←]/u.test(html + js), "no Unicode decorative arrows in console content");
assert(!html.includes('class="diagonal-arrow"') && !js.includes('class="diagonal-arrow"'), "replace decorative CSS arrow markup");
console.log("Studio Console themes, alignment, and glyph checks passed.");
