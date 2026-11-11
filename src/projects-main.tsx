import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { VisualVerseProjectsPage } from "./components/VisualVerseProjectsPage";
import "./styles.css";
import "./portfolio.css";

const root = document.getElementById("vv-projects-page-root");
if (root) {
  createRoot(root).render(
    <StrictMode>
      <VisualVerseProjectsPage />
    </StrictMode>,
  );
}
