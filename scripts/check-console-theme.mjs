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
const dock = read("src/console-floating-dock.css");
const dockApp = read("src/console-floating-dock.tsx");
const dockComponent = read("src/components/ui/floating-dock.tsx");

// Catch malformed braces and unclosed selectors before publishing an unbundled stylesheet.
for (const [name, css] of [["console.css", base], ["console-modern.css", modern], ["console-theme.css", theme], ["file-upload.css", upload], ["console-floating-dock.css", dock]]) {
  assert.doesNotThrow(() => postcss.parse(css, { from: name }), name + " CSS must parse");
}

assert(html.includes("console-theme.css"), "theme stylesheet must be loaded");
assert(html.indexOf("console-modern.css") < html.indexOf("console-theme.css"), "theme overrides must load last");
assert(html.includes("vv-console-theme"), "early theme initialization prevents a light-mode flash");
assert.equal((html.match(/class="console-theme-toggle"/g) || []).length, 2, "login and signed-in header each require a theme toggle");
assert(html.indexOf('id="auth-theme-toggle"') < html.indexOf('class="auth-pitch"'), "login appearance icon must be beside brand logo, above the form");
assert(!html.includes("APPEARANCE"), "remove appearance label from login");
assert(html.includes('<div class="profile" aria-label="Signed in account">') && html.includes('id="console-theme-toggle"'), "signed-in appearance icon must be next to account indicator");
assert(!dockApp.includes('key: "theme"') && !dockApp.includes("vv:console-toggle-theme"), "floating dock must not duplicate appearance icon");
assert(dockApp.includes('key: "sign-out"'), "keep secure sign out in dock");
assert(html.includes('id="vv-console-dock-root"') && html.includes("console-floating-dock.js"), "horizontal React dock must mount in Console");
assert(!html.includes('id="console-menu-toggle"') && !html.includes('id="profile-menu-toggle"') && !html.includes('class="sidebar"'), "remove duplicate menus and sidebar");
assert(dock.includes("backdrop-filter") && dock.includes(".vv-dock-scroll") && dock.includes('[data-console-theme="dark"]'), "glass dock must support mobile and dark mode");
assert(dockComponent.includes("useMotionValue") && dockComponent.includes("useSpring"), "dock hover magnification must be animated");
assert(dockApp.includes('state.admin') && dockApp.includes('"team"'), "team link must respect membership role");
assert(js.includes("vv:console-navigate") && js.includes('section==="team"&&!isAdmin()'), "dock navigation must preserve authorization checks");
assert(js.includes("IDLE_LIMIT_MS=7*60*1000"), "seven-minute inactivity timeout must remain intact");
assert(js.includes("applyConsoleTheme(") && js.includes("localStorage.setItem(THEME_KEY"), "user theme preference must persist");
assert(theme.includes('[data-console-theme="dark"]'), "dark appearance selectors are required");
assert(theme.includes("color-scheme:dark"), "dark inputs must use dark-native form colors");
assert(theme.includes(".vv-upload-dropzone"), "shared React uploader should respect the theme");
assert(theme.includes("@media(max-width:760px)"), "theme should cover responsive layout");
assert(theme.includes(".table-row:not(.heading)>span:nth-child(2)"), "mobile table columns must remain visible");
assert(!/[↗↘↖↙➜➔⇢➝⟶→←]/u.test(html + js), "no Unicode decorative arrows in console content");
assert(!html.includes('class="diagonal-arrow"') && !js.includes('class="diagonal-arrow"'), "replace decorative CSS arrow markup");
console.log("Studio Console themes, alignment, and glyph checks passed.");
