# Visual Verse — Permanent Animated Homepage Preview

This repository contains the **existing** Visual Verse animated homepage, continued from the November 10, 2026 prototype and updated with the official logos, favicon, and TT Travels typography specification. This is NOT a new redesign or replacement for the original React site.

## Contents
- `index.html` — current responsive homepage, six-service particle transitions, About, Services, Portfolio, Approach, and Contact
- `brand-wordmark.png` — logo used in navigation
- `brand-logo.png` — full logo used in footer
- `logo-mark.png`, `favicon.ico` — brand icon and favicon
- `netlify.toml` — publish this static site from the repository root with **no build command**

## One-time GitHub setup
1. Create a new empty repository on your GitHub account, e.g. `visualverse-animated-preview`. Set visibility as desired.
2. Extract the **contents** of the ZIP (do not upload the ZIP as one file).
3. In GitHub, choose **Add file > Upload files** and upload all the extracted files to the root of `main` (GitHub may require dragging the extracted folder contents). Then **Commit changes**.
4. Confirm the repository root contains `index.html`, `netlify.toml`, `brand-wordmark.png`, `brand-logo.png`, `logo-mark.png`, `favicon.ico`, and `README.md`.

## One-time Netlify setup
1. Log in to https://app.netlify.com/. Go to **Add new project > Import an existing project**.
2. Choose GitHub, authorize Netlify for this **new** repository, and select it.
3. Use `main` as the production/deploy branch **of the preview site**.
4. Build command: **leave blank**; publish directory: `.` (repository root). The `netlify.toml` also sets the publish directory.
5. Publish the project. Netlify assigns a persistent `*.netlify.app` URL, which can be bookmarked.
6. Subsequent pushes to this repository's `main` trigger automatic redeployments at that same URL. Refresh the browser to see updates.

**Note:** This Netlify project is separate from the existing Visual Verse public website. No changes are pushed to `victorasige4/visual-verse-studio`.

## GitHub permissions / Codex
Your ChatGPT GitHub integration may support reading but not writing. To enable a supported code-editing workflow, connect this new repository to **Codex** and grant the required repository access through its GitHub app authorization screen. Review access under https://github.com/settings/installations. The user, not the assistant, must approve access.

## Typography
TT Travels is configured as the base font with variable weights across the interface. Licensed TT Travels webfont files are **not included** in this package; until added, compatible fallback fonts display. Add valid licensed webfont files to `assets/fonts/` per the HTML's declared `@font-face` paths when available.

## Workflow
All future revisions should modify this same `index.html` and its existing assets on this same repository. Do not create another visual concept or replace the particle service animation unless explicitly requested.
