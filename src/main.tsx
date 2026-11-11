import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { VisualVerseNavbar } from "./components/VisualVerseNavbar";
import { VisualVerseWhoWeAre } from "./components/VisualVerseWhoWeAre";
import "./styles.css";

const mount = document.getElementById("vv-react-nav-root");
if (mount) {
  createRoot(mount).render(
    <StrictMode>
      <VisualVerseNavbar />
    </StrictMode>,
  );
}

const aboutMount = document.getElementById("vv-about-pixel-root");
if (aboutMount) {
  createRoot(aboutMount).render(
    <StrictMode>
      <VisualVerseWhoWeAre />
    </StrictMode>,
  );
}
