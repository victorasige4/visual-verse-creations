import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { existsSync, copyFileSync, mkdirSync } from "node:fs";
import { resolve, join } from "node:path";
import { fileURLToPath, URL } from "node:url";

/**
 * The first phase of the React migration preserves the original homepage's
 * HTML, CSS and particle canvases. Its brand assets live in the repo root.
 * Copy only those assets when compiling the Vite application for Netlify.
 */
function copyVisualVerseAssets(): Plugin {
  return {
    name: "visual-verse-legacy-assets",
    apply: "build",
    closeBundle() {
      const dist = resolve(process.cwd(), "dist");
      mkdirSync(dist, { recursive: true });
      for (const filename of ["brand-logo.png", "brand-wordmark.png", "logo-mark.png", "favicon.ico"]) {
        const source = resolve(process.cwd(), filename);
        if (existsSync(source)) copyFileSync(source, join(dist, filename));
      }
    },
  };
}

/** First-paint gate: display the transmission before either public bundle or
 * route content can paint. React closes it only after BOTH readiness signals. */
function publicPageStartup(): Plugin {
  return {
    name: "visual-verse-page-startup",
    transformIndexHtml() {
      return [
        { tag: "style", attrs: { id: "vv-page-startup-style" }, injectTo: "head-prepend", children: "#vv-page-loading{display:none}\nhtml[data-vv-boot]{background:#001f2f!important;scroll-behavior:auto!important;overflow-anchor:none}\nhtml[data-vv-boot] body>:not(#vv-page-loading):not(script):not(style):not(link){visibility:hidden!important;opacity:0!important;pointer-events:none!important}\nhtml[data-vv-boot] #vv-page-loading{display:grid;place-items:center;position:fixed;inset:0;z-index:2147483647;isolation:isolate;overflow:hidden;background:var(--vv-deep,#001f2f);color:var(--vv-paper,#fafcfa);font-family:var(--vv-typeface,Arial,sans-serif);cursor:default}\n#vv-page-loading .vv-boot-wait,#vv-loader-react-root{position:absolute;inset:0;display:grid;place-items:center;isolation:isolate}\n#vv-page-loading .vv-boot-watermark{position:absolute;inset:0;z-index:0;pointer-events:none;background:url('./logo-mark.png') center/ min(64vw,640px) auto no-repeat;opacity:.085;filter:brightness(0) invert(1)}\n#vv-page-loading .vv-boot-boxes{opacity:.8;mask-image:radial-gradient(ellipse at center,#000 0%,#000c 65%,transparent 100%)}\n#vv-page-loading .vv-boot-inner{position:relative;z-index:2;text-align:center;width:min(1040px,86vw);margin:auto;display:grid;gap:clamp(18px,3vh,32px);justify-items:center}\n#vv-page-loading .vv-boot-label{display:flex;align-items:center;justify-content:center;gap:10px;color:#a5e3dc;font-size:clamp(10px,1.3vw,13px);letter-spacing:.22em;font-weight:700;text-transform:uppercase}\n#vv-page-loading .vv-boot-dot{width:8px;height:8px;flex:none;border-radius:50%;background:#2ec4b6;box-shadow:0 0 14px #2ec4b6;animation:vv-boot-signal .8s ease-in-out infinite alternate}\n#vv-page-loading .vv-boot-message{min-height:2.16em;display:flex;align-items:center;justify-content:center;margin:0;font-size:clamp(31px,6vw,88px);font-weight:800;line-height:1.08;letter-spacing:-.055em;text-wrap:balance;color:#fafcfa}\n#vv-page-loading .vv-boot-encrypted{display:inline;white-space:normal}\n#vv-page-loading .vv-boot-word{display:inline-block;white-space:nowrap}\n#vv-page-loading .vv-boot-letter{display:inline-grid;grid-template-columns:auto;grid-template-rows:auto;vertical-align:baseline;position:relative}\n#vv-page-loading .vv-boot-letter-base{grid-area:1/1;visibility:hidden}\n#vv-page-loading .vv-boot-letter-display{grid-area:1/1;position:absolute;inset:0;text-align:center;white-space:nowrap;overflow:visible}\n#vv-page-loading .vv-boot-scrambled{color:#79d8ce;opacity:.8}\n#vv-page-loading .vv-boot-track{height:2px;overflow:hidden;width:min(240px,60vw);background:#ffffff22;border-radius:5px}\n#vv-page-loading .vv-boot-track-fill{display:block;height:100%;background:#2ec4b6;transform-origin:left;transition:transform 60ms linear;box-shadow:0 0 12px #2ec4b6}\n#vv-page-loading .vv-boot-coordinate{position:absolute;inset:auto 0 max(28px,env(safe-area-inset-bottom)) 0;text-align:center;z-index:2;font-size:10px;letter-spacing:.19em;font-weight:600;color:#a5e3dc;text-transform:uppercase}\n#vv-page-loading .vv-boot-error{display:none;position:relative;z-index:4;text-align:center;width:min(520px,85vw);font-size:16px;line-height:1.6}\n#vv-page-loading a{color:#a5e3dc;text-decoration:underline}\nhtml[data-vv-boot=\"error\"] #vv-page-loading .vv-boot-wait{display:none}\nhtml[data-vv-boot=\"error\"] #vv-page-loading .vv-boot-error{display:block}\n@keyframes vv-boot-signal{from{opacity:.55}to{opacity:1}}\n@media(max-width:600px){#vv-page-loading .vv-boot-watermark{background-size:88vw auto}#vv-page-loading .vv-boot-message{font-size:clamp(28px,9vw,46px);min-height:3.24em}}\n@media(prefers-reduced-motion:reduce){#vv-page-loading .vv-boot-dot{animation:none}#vv-page-loading .vv-boot-track-fill{transition:none}}" },
        { tag: "script", attrs: { id: "vv-page-startup-script" }, injectTo: "head-prepend", children: "(function () {\n  var root = document.documentElement;\n  var messages = {\"index\":\"Welcome TO Our Universe...\",\"about\":\"Meet the minds behind the orbit...\",\"services\":\"Choose your creative constellation...\",\"who-we-serve\":\"Every orbit has a story...\",\"projects\":\"A galaxy of ideas awaits...\",\"contact\":\"Establishing first contact...\",\"request-quote\":\"Plotting your next mission...\",\"graphic-design\":\"Transmitting a new visual language...\",\"photography\":\"Capturing light-years of memories...\",\"web-ui-ux\":\"Launching your digital universe...\",\"videography\":\"Putting stars in motion...\",\"branding\":\"Finding your own constellation...\",\"social-media\":\"Sending your signal across the galaxy...\"};\n  var key = location.pathname.split('/').pop().replace(/\\.html$/, '') || 'index';\n  if (key === 'services') {\n    var service = new URLSearchParams(location.search).get('service');\n    if (service && Object.prototype.hasOwnProperty.call(messages, service)) key = service;\n  }\n  root.setAttribute('data-vv-message', Object.prototype.hasOwnProperty.call(messages,key) ? messages[key] : messages.index);\n  root.setAttribute('data-vv-boot', 'pending');\n  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';\n  var navigation = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];\n  var reload = navigation ? navigation.type === 'reload' : performance.navigation && performance.navigation.type === 1;\n  if (reload && location.hash) {\n    try { history.replaceState(history.state, '', location.pathname + location.search); } catch (_) {}\n  }\n  if (!location.hash) window.scrollTo(0, 0);\n  window.setTimeout(function checkStartup() {\n    if (root.getAttribute('data-vv-boot') !== 'pending') return;\n    if (document.hidden || (root.getAttribute('data-vv-page-ready') === 'true' && document.querySelector('.vv-boot-encrypted'))) {\n      window.setTimeout(checkStartup, 15000);\n      return;\n    }\n    root.setAttribute('data-vv-boot', 'error');\n  }, 15000);\n  window.addEventListener('pageshow', function (event) {\n    if (event.persisted && !location.hash) {\n      var old = root.style.scrollBehavior;\n      root.style.scrollBehavior = 'auto';\n      window.scrollTo(0, 0);\n      root.style.scrollBehavior = old;\n    }\n  });\n})();" },
        { tag: "div", attrs: { id: "vv-page-loading" }, injectTo: "body-prepend", children: "<div class=\"vv-boot-wait\"><div id=\"vv-loader-react-root\"><div class=\"vv-boot-watermark\" aria-hidden=\"true\"></div><div class=\"vv-boot-inner\" role=\"status\"><div class=\"vv-boot-label\"><span class=\"vv-boot-dot\" aria-hidden=\"true\"></span>Incoming transmission</div><div class=\"vv-boot-message\" id=\"vv-boot-static-text\" aria-hidden=\"true\">Connecting...</div><div class=\"vv-boot-track\" aria-hidden=\"true\"></div></div><div class=\"vv-boot-coordinate\" aria-hidden=\"true\">Visual Verse / Creative universe</div></div></div><div class=\"vv-boot-error\" role=\"alert\">Signal interrupted. This page is taking longer than expected. <a href=\"\">Reconnect</a></div><script>(function(){var el=document.getElementById('vv-boot-static-text');var message=document.documentElement.getAttribute('data-vv-message')||'';if(el)el.textContent=matchMedia('(prefers-reduced-motion: reduce)').matches?message:message.replace(/[A-Za-z0-9]/g,function(){return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random()*36)]})})();</script>" },
      ];
    },
  };
}

export default defineConfig({
  // GitHub Pages projects live under /<repository>/; Netlify keeps its root build.
  base: process.env.GITHUB_PAGES === "true" ? "/visual-verse-creations/" : "/",
  build: {
    rollupOptions: {
      input: {
        home: resolve(process.cwd(), "index.html"),
        projects: resolve(process.cwd(), "projects.html"),
        about: resolve(process.cwd(), "about.html"),
        services: resolve(process.cwd(), "services.html"),
        audiences: resolve(process.cwd(), "who-we-serve.html"),
        contact: resolve(process.cwd(), "contact.html"),
        quote: resolve(process.cwd(), "request-quote.html"),
        "console-uploader": resolve(process.cwd(), "src/console-file-upload.tsx"),
        "console-dock": resolve(process.cwd(), "src/console-floating-dock.tsx"),
      },
      output: {
        entryFileNames: (chunk) => chunk.name === "console-uploader"
          ? "console-assets/console-file-upload.js"
          : chunk.name === "console-dock"
            ? "console-assets/console-floating-dock.js"
            : "assets/[name]-[hash].js",
      },
    },
  },
  plugins: [react(), tailwindcss(), publicPageStartup(), copyVisualVerseAssets()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
