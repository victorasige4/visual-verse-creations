import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { VisualVerseCursor } from "./components/VisualVerseCursor";
import { VisualVerseProjectsPage } from "./components/VisualVerseProjectsPage";
import "./styles.css";
import "./portfolio.css";
import "./nav-cleanup.css";
import "./policies.css";
import "./site-cleanup.css";
import "./closing-sections.css";

const root = document.getElementById("vv-projects-page-root");
if (root) {
  createRoot(root).render(
    <StrictMode>
      <VisualVerseProjectsPage />
    </StrictMode>,
  );
}

import "./resizable-navbar.css";
import "./tt-travels.css";

// A single accessible custom cursor island for mouse/trackpad visitors.
const vvCursorMount = document.createElement("div");
vvCursorMount.id = "vv-cursor-root";
document.body.appendChild(vvCursorMount);
createRoot(vvCursorMount).render(<VisualVerseCursor />);
