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

/** Install a first-paint gate before parsing public-page content. The React
 * entry releases it only after the route's hero and shared chrome commit. */
function publicPageStartup(): Plugin {
  return {
    name: "visual-verse-page-startup",
    transformIndexHtml() {
      return [
        { tag: "style", attrs: { id: "vv-page-startup-style" }, injectTo: "head-prepend", children: "#vv-page-loading{display:none}\nhtml[data-vv-boot]{scroll-behavior:auto!important;overflow-anchor:none}\nhtml[data-vv-boot] body>:not(#vv-page-loading):not(script):not(style):not(link){visibility:hidden!important;opacity:0!important;pointer-events:none!important}\nhtml[data-vv-boot] #vv-page-loading{display:grid;place-items:center;position:fixed;inset:0;z-index:2147483647;background:#fafcfa;color:#003f5c;font:500 12px/1.5 system-ui,sans-serif}\n#vv-page-loading .vv-boot-inner{text-align:center;width:min(200px,70vw)}\n#vv-page-loading .vv-boot-track{display:block;position:relative;height:3px;margin:14px auto 0;overflow:hidden;border-radius:4px;background:#d7eeea}\n#vv-page-loading .vv-boot-track:after{content:\"\";position:absolute;inset:0 auto 0 0;width:36%;border-radius:inherit;background:#2ec4b6;animation:vv-boot-progress .85s ease-in-out infinite alternate}\n#vv-page-loading .vv-boot-error{display:none}\n#vv-page-loading a{color:#003f5c;text-decoration:underline}\nhtml[data-vv-boot=\"error\"] #vv-page-loading .vv-boot-wait{display:none}\nhtml[data-vv-boot=\"error\"] #vv-page-loading .vv-boot-error{display:block}\n@keyframes vv-boot-progress{from{transform:translateX(-100%)}to{transform:translateX(280%)}}\n@media(prefers-reduced-motion:reduce){#vv-page-loading .vv-boot-track:after{animation:none;width:100%}}" },
        { tag: "script", attrs: { id: "vv-page-startup-script" }, injectTo: "head-prepend", children: "(function () {\n  var root = document.documentElement;\n  root.setAttribute('data-vv-boot', 'pending');\n  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';\n  var navigation = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];\n  var reload = navigation ? navigation.type === 'reload' : performance.navigation && performance.navigation.type === 1;\n  if (reload && location.hash) {\n    try { history.replaceState(history.state, '', location.pathname + location.search); } catch (_) {}\n  }\n  if (!location.hash) window.scrollTo(0, 0);\n  // A failed or very slow script must leave a recoverable page, not a blank screen.\n  window.setTimeout(function () {\n    if (root.getAttribute('data-vv-boot') === 'pending') root.setAttribute('data-vv-boot', 'error');\n  }, 15000);\n  window.addEventListener('pageshow', function (event) {\n    if (event.persisted && !location.hash) {\n      var old = root.style.scrollBehavior;\n      root.style.scrollBehavior = 'auto';\n      window.scrollTo(0, 0);\n      root.style.scrollBehavior = old;\n    }\n  });\n})();" },
        { tag: "div", attrs: { id: "vv-page-loading" }, injectTo: "body-prepend",
          children: '<div class="vv-boot-inner" role="status" aria-live="polite"><div class="vv-boot-wait">Loading Visual Verse<span class="vv-boot-track" aria-hidden="true"></span></div><div class="vv-boot-error">This page is taking longer than expected. <a href="">Try again</a></div></div>' },
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
