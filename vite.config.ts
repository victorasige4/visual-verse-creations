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

/** Run before React and before the browser restores the previous scroll offset.
 * Only a true reload returns to the page's hero. Normal anchors, query-string
 * service routes and history navigation keep their existing behavior. */
function resetScrollOnReload(): Plugin {
  return {
    name: "visual-verse-reload-to-hero",
    transformIndexHtml() {
      return [{
        tag: "script",
        attrs: { id: "vv-reload-to-hero" },
        injectTo: "head-prepend",
        children: `(function () {
  var navigation = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
  var isReload = navigation ? navigation.type === 'reload' : performance.navigation && performance.navigation.type === 1;
  if (!isReload) return;
  var previous = 'scrollRestoration' in history ? history.scrollRestoration : null;
  if (previous !== null) history.scrollRestoration = 'manual';
  if (location.hash) history.replaceState(history.state, '', location.pathname + location.search);
  function goTop() {
    var root = document.documentElement;
    var previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    root.style.scrollBehavior = previousBehavior;
  }
  goTop();
  window.addEventListener('pageshow', function () {
    goTop();
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        goTop();
        if (previous !== null) history.scrollRestoration = previous;
      });
    });
  }, { once: true });
})();`,
      }];
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
  plugins: [react(), tailwindcss(), resetScrollOnReload(), copyVisualVerseAssets()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
