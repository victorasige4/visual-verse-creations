import { StrictMode } from "react";
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
const root = document.getElementById("vv-inner-page-root");
if (root) {
  createRoot(root).render(<StrictMode><VisualVerseInnerPage kind={pageKind()} /></StrictMode>);
}
import "./about-editorial.css";
import "./about-card-stack.css";
import "./vision-mission.css";
import "./how-we-work-studio.css";
import "./potadot-toolbox.css";
import "./visual-verse-industries.css";

import "./resizable-navbar.css";
import "./tt-travels.css";

// A single accessible custom cursor island for mouse/trackpad visitors.
const vvCursorMount = document.createElement("div");
vvCursorMount.id = "vv-cursor-root";
document.body.appendChild(vvCursorMount);
createRoot(vvCursorMount).render(<VisualVerseCursor />);
