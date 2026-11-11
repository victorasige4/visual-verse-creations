import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { VisualVerseNavbar } from "./components/VisualVerseNavbar";
import { VisualVerseWhoWeAre } from "./components/VisualVerseWhoWeAre";
import { VisualVerseServices } from "./components/VisualVerseServices";
import { VisualVerseAudiences } from "./components/VisualVerseAudiences";
import { VisualVersePortfolio } from "./components/VisualVersePortfolio";
import { VisualVerseWhyUs } from "./components/VisualVerseWhyUs";
import "./styles.css";
import "./showcases.css";
import "./portfolio.css";
import "./why-us.css";

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

const servicesMount = document.getElementById("vv-services-root");
if (servicesMount) {
  createRoot(servicesMount).render(
    <StrictMode>
      <VisualVerseServices />
    </StrictMode>,
  );
}

const audiencesMount = document.getElementById("vv-audiences-root");
if (audiencesMount) {
  createRoot(audiencesMount).render(
    <StrictMode>
      <VisualVerseAudiences />
    </StrictMode>,
  );
}

const portfolioMount = document.getElementById("vv-portfolio-root");
if (portfolioMount) {
  createRoot(portfolioMount).render(
    <StrictMode>
      <VisualVersePortfolio />
    </StrictMode>,
  );
}

const whyMount = document.getElementById("vv-why-root");
if (whyMount) {
  createRoot(whyMount).render(
    <StrictMode>
      <VisualVerseWhyUs />
    </StrictMode>,
  );
}
