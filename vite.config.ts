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

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: resolve(process.cwd(), "index.html"),
        projects: resolve(process.cwd(), "projects.html"),
      },
    },
  },
  plugins: [react(), tailwindcss(), copyVisualVerseAssets()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
