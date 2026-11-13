import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
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
