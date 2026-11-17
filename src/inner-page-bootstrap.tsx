import "./preloader";
import { StrictMode, Suspense, type ComponentType } from "react";
import { PublicPageReady } from "./components/PublicPageReady";
import { createRoot } from "react-dom/client";
import { VisualVerseCursor } from "./components/VisualVerseCursor";
import { VisualVerseInnerPage, pageKind } from "./components/VisualVerseInnerPages";
import "./styles.css";
import "./showcases.css";
import "./closing-sections.css";
import "./nav-cleanup.css";
import "./visual-workspaces.css";
import "./policies.css";
import "./site-cleanup.css";
import "./inner-pages.css";
import "./lib/public-site-ui";
import "./visual-verse-cta.css";
import "./visual-verse-industries.css";

import "./resizable-navbar.css";
import "./tt-travels.css";

export function mountPublicInnerPage(AudiencePage?: ComponentType) {
  const root = document.getElementById("vv-inner-page-root");
  if (root) {
    createRoot(root).render(<StrictMode><Suspense fallback={null}><VisualVerseInnerPage kind={pageKind()} AudiencePage={AudiencePage}/><PublicPageReady /></Suspense></StrictMode>);
  }
  // A single custom cursor island for mouse/trackpad visitors.
  const vvCursorMount = document.createElement("div");
  vvCursorMount.id = "vv-cursor-root";
  document.body.appendChild(vvCursorMount);
  createRoot(vvCursorMount).render(<VisualVerseCursor />);
}
