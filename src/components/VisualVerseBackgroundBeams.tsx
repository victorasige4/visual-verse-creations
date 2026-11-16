import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { createRoot } from "react-dom/client";
import { BackgroundBeams } from "./ui/background-beams";

// Explicitly scope the component to light editorial surfaces. Dark sections,
// media, sticky process scenes and the home cube hero keep their own treatment.
const lightSurfaces = [
  ".vv-story-band", ".vv-preview-section:not(#about):not(#process)",
  ".vv-close-marquee-section", ".vv-close-location-section", ".vv-close-faq-section",
  ".vv-close-cta-section",
  ".vv-about-hero", ".vv-about-stats", ".vv-about-vision", ".vv-about-editorial .vv-about-story",
  ".vv-about-principles", ".vv-about-tools", ".vv-about-audiences", ".vv-about-partners",
  ".vv-about-faq", ".vv-about-facts", ".vv-cta-section",
  ".vv-sv-hero--potadot", ".vv-service-overview", ".vv-sv-resources", ".vv-detail-hero",
  ".vv-ds-deliver", ".vv-ds-details", ".vv-ds-faq", ".vv-ds-related",
  ".vvx-atlas", ".vvx-match", ".vvx-questions",
  ".vv-projects-hero", ".vv-projects-gallery-section", ".vv-projects-archive",
  ".vv-projects-collections",
  ".vv-inner-hero", ".vv-inner-contact", ".vv-inner-social-section", ".vv-inner-quote-section",
].join(",");

function SiteBackgroundBeams() {
  const [surfaces, setSurfaces] = useState<HTMLElement[]>([]);
  useEffect(() => {
    let frame = 0;
    let current: HTMLElement[] = [];
    const scan = () => {
      frame = 0;
      const found = Array.from(document.querySelectorAll<HTMLElement>(lightSurfaces));
      // Home sections and React islands can mount asynchronously; avoid a second
      // layer if an opted-in section already contains the same light surface.
      const next = found.filter(node => !found.some(other => other !== node && other.contains(node)));
      if (next.length === current.length && next.every((node, i) => current[i] === node)) return;
      current.filter(node => !next.includes(node)).forEach(node => node.classList.remove("vv-beam-surface"));
      next.forEach(node => node.classList.add("vv-beam-surface"));
      current = next;
      setSurfaces(next);
    };
    scan();
    const observer = new MutationObserver(records => {
      // Ignore decorative SVG animation and ordinary dynamic content updates.
      const changed = records.some(record => [...record.addedNodes, ...record.removedNodes].some(node =>
        node instanceof HTMLElement && (node.matches(lightSurfaces) || node.querySelector(lightSurfaces))
      ));
      if (changed && !frame) frame = requestAnimationFrame(scan);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
      current.forEach(node => node.classList.remove("vv-beam-surface"));
    };
  }, []);
  return <>{surfaces.map((surface, i) => createPortal(<BackgroundBeams />, surface, `surface-${i}`))}</>;
}

// One shared mount for all public entry points, including the legacy home page.
export function mountSiteBackgroundBeams() {
  if (document.getElementById("vv-background-beams-root")) return;
  const host = document.createElement("div");
  host.id = "vv-background-beams-root";
  host.hidden = true;
  document.body.appendChild(host);
  createRoot(host).render(<SiteBackgroundBeams />);
}
