import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { VisualVerseNavbar } from "./components/VisualVerseNavbar";
import "./styles.css";

const mount = document.getElementById("vv-react-nav-root");
if (mount) {
  createRoot(mount).render(
    <StrictMode>
      <VisualVerseNavbar />
    </StrictMode>,
  );
}
