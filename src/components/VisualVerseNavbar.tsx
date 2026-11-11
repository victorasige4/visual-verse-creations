import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

/** Always-visible floating navigation. No dropdown or hamburger.
 * Homepage links now open their respective dedicated pages; the remaining
 * editorial sections remain anchored on the homepage. */
const links = [
  { label: "Home", href: "/#top" },
  { label: "About", href: "/about.html" },
  { label: "Services", href: "/services.html" },
  { label: "Who We Serve", href: "/who-we-serve.html" },
  { label: "Projects", href: "/projects.html" },
  { label: "Why Us", href: "/#process" },
  { label: "Locations", href: "/#where-we-serve" },
  { label: "FAQs", href: "/#faqs" },
  { label: "Contact", href: "/contact.html" },
];

function isHomePage() {
  return window.location.pathname === "/" || window.location.pathname === "/index.html";
}

export function VisualVerseNavbar() {
  const [expanded, setExpanded] = useState(() =>
    typeof window === "undefined" || (isHomePage() && window.scrollY < Math.max(85, window.innerHeight * .13))
  );
  const [active, setActive] = useState<string>(() =>
    typeof window === "undefined" ? "/#top" : window.location.pathname === "/" ? "/#top" : window.location.pathname
  );

  useEffect(() => {
    document.documentElement.classList.add("vv-react-nav-ready");
    return () => document.documentElement.classList.remove("vv-react-nav-ready");
  }, []);

  useEffect(() => {
    const home = isHomePage();
    let frame = 0;
    function measure() {
      frame = 0;
      setExpanded(home && window.scrollY < Math.max(85, window.innerHeight * .13));
      if (!home) {
        setActive(window.location.pathname);
        return;
      }
      let current = "/#top";
      const anchors = [{hash:"process",link:"/#process"},{hash:"where-we-serve",link:"/#where-we-serve"},{hash:"faqs",link:"/#faqs"}];
      for (const item of anchors) {
        const el = document.getElementById(item.hash);
        if (el && el.getBoundingClientRect().top < Math.min(200,window.innerHeight*.3)) current = item.link;
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
    <header className={"vv-nav2" + (expanded ? " is-expanded" : " is-compact")} aria-label="Visual Verse Creations navigation">
      <div className="vv-nav2-island">
        <a href="/#top" className="vv-nav2-logo" aria-label="Visual Verse Creations — home">
          <img src="/brand-wordmark.png" alt="Visual Verse Creations" width={195} height={55}/>
        </a>
        <nav className="vv-nav2-links" aria-label="Main navigation — swipe horizontally on smaller screens">
          {links.map(link => (
            <a href={link.href} className={active===link.href ? "is-active" : ""}
              aria-current={active===link.href ? (link.href.includes("#") ? "location" : "page") : undefined}
              key={link.href}>{link.label}</a>
          ))}
        </nav>
        <div className="vv-nav2-actions">
          <a href="/request-quote.html" className="vv-nav2-cta">
            Let's talk <span><ArrowUpRight size={16} aria-hidden="true"/></span>
          </a>
        </div>
      </div>
    </header>
  );
}
