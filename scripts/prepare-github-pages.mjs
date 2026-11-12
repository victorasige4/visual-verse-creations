/**
 * Adapt the generated static site to GitHub Pages project URLs.
 * Runs on dist/ only, after Vite's build, leaving Netlify and source files intact.
 * Vite itself prefixes JS/CSS entrypoints using GITHUB_PAGES=true.
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, extname } from "node:path";

const base = "/visual-verse-creations/";
const dist = "dist";
const textual = new Set([".html", ".js", ".css"]);
const knownPaths = /^(?:#|(?:about|services|projects|portfolio|contact|request-quote|quote|lets-talk|who-we-serve)(?:[.#/?]|$)|(?:brand-|logo-|favicon|portfolio-|about-|visual-|vv-)[\w./-]*|assets\/|images\/|fonts\/|src\/)/i;
let touched = 0;

function patch(contents) {
  // Rebase application-owned root URLs (React props, links, CSS and metadata).
  // Leave protocol-relative URLs, third-party content and Vite chunk URLs intact.
  return contents
    .replace(/(["'`])\/(?!\/|visual-verse-creations\/)([^"'`\s<>]*)/g,
      (match, quote, path) => knownPaths.test(path) ? quote + base + path : match)
    .replace(/(url\(\s*["']?)\/(?!\/|visual-verse-creations\/)([^)"'\s]+)/g,
      (match, prefix, path) => knownPaths.test(path) ? prefix + base + path : match);
}

function walk(folder) {
  for (const entry of readdirSync(folder, { withFileTypes: true })) {
    const file = join(folder, entry.name);
    if (entry.isDirectory()) { walk(file); continue; }
    if (!textual.has(extname(file))) continue;
    const before = readFileSync(file, "utf8");
    const after = patch(before);
    if (before !== after) {
      writeFileSync(file, after);
      touched++;
    }
  }
}

walk(dist);
const homepage = readFileSync(join(dist, "index.html"), "utf8");
if (!homepage.includes(base)) {
  throw new Error("GitHub Pages base path not found in the compiled homepage.");
}
console.log(`GitHub Pages static URLs prepared in ${touched} files.`);
