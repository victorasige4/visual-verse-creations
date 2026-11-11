import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

/**
 * One visible navigation row at every scroll position.
 * On small screens, links stay in a horizontally scrollable row:
 * there is no hamburger, drawer, or hidden dropdown.
 */
const links = [
  { label: "Home", hash: "#top" },
  { label: "About", hash: "#about" },
  { label: "Services", hash: "#services" },
  { label: "Who We Serve", hash: "#who-we-serve" },
  { label: "Projects", hash: "#work" },
  { label: "Why Us", hash: "#process" },
  { label: "Locations", hash: "#where-we-serve" },
  { label: "FAQs", hash: "#faqs" },
  { label: "Contact", hash: "#contact" },
];

function isHomePage() {
  return window.location.pathname === "/" || window.location.pathname === "/index.html";
}

function homeHref(hash: string) {
  return isHomePage() ? hash : "/" + hash;
}

export function VisualVerseNavbar() {
  const [expanded, setExpanded] = useState(() =>
    typeof window === "undefined" ||
    (isHomePage() && window.scrollY < Math.max(85, window.innerHeight * 0.13))
  );
  const [active, setActive] = useState("#top");

  useEffect(() => {
    document.documentElement.classList.add("vv-react-nav-ready");
    return () => document.documentElement.classList.remove("vv-react-nav-ready");
  }, []);

  useEffect(() => {
    const isHome = isHomePage();
    let frame = 0;

    function measure() {
      frame = 0;
      setExpanded(isHome && window.scrollY < Math.max(85, window.innerHeight * 0.13));
      if (!isHome) return;
      let current = "#top";
      for (const link of links) {
        const section = document.getElementById(link.hash.slice(1));
        if (section && section.getBoundingClientRect().top < Math.min(210, window.innerHeight * 0.3)) {
          current = link.hash;
        }
      }
      setActive(current);
    }

    function onScroll() {
      if (!frame) frame = window.requestAnimationFrame(measure);
    }

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <header
      className={"vv-nav2" + (expanded ? " is-expanded" : " is-compact")}
      aria-label="Visual Verse Creations navigation"
    >
      <div className="vv-nav2-island">
        <a href={homeHref("#top")} className="vv-nav2-logo" aria-label="Visual Verse Creations — home">
          <img src="/brand-wordmark.png" alt="Visual Verse Creations" width={195} height={55}/>
        </a>

        <nav className="vv-nav2-links" aria-label="Main navigation — swipe horizontally on smaller screens">
          {links.map(link => (
            <a
              href={homeHref(link.hash)}
              className={active === link.hash && isHomePage() ? "is-active" : ""}
              aria-current={active === link.hash && isHomePage() ? "location" : undefined}
              key={link.hash}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="vv-nav2-actions">
          <a href={homeHref("#contact")} className="vv-nav2-cta">
            Let's talk
            <span><ArrowUpRight size={16} aria-hidden="true"/></span>
          </a>
        </div>
      </div>
    </header>
  );
}
