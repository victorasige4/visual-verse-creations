import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
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
