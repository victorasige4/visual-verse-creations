import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Menu, X, Phone, Instagram, Globe2 } from "lucide-react";

/** Compact floating island: fully expanded only in the homepage hero.
 * No hover mega menus or dropdown navigation. */
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
const homeHref = (hash: string) => window.location.pathname === "/" || window.location.pathname === "/index.html" ? hash : "/" + hash;

export function VisualVerseNavbar() {
  const [expanded, setExpanded] = useState(() => typeof window === "undefined" || ((window.location.pathname === "/" || window.location.pathname === "/index.html") && window.scrollY < 80));
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("#top");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    document.documentElement.classList.add("vv-react-nav-ready");
    return () => document.documentElement.classList.remove("vv-react-nav-ready");
  }, []);

  useEffect(() => {
    const isHome = window.location.pathname === "/" || window.location.pathname === "/index.html";
    let frame = 0;
    function measure() {
      frame = 0;
      setExpanded(isHome && window.scrollY < Math.max(85, window.innerHeight * 0.13));
      if (!isHome) return;
      const ids = links.map(x => x.hash.slice(1));
      let current = "#top";
      for (const id of ids) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top < Math.min(210, window.innerHeight * 0.3)) current = "#" + id;
      }
      setActive(current);
    }
    function onScroll() { if (!frame) frame = window.requestAnimationFrame(measure); }
    const onVisibility = () => setVisible(!document.hidden);
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useEffect(() => {
    function onKeydown(event: KeyboardEvent) { if (event.key === "Escape") setMenuOpen(false); }
    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("vv-nav2-lock", menuOpen);
    return () => document.body.classList.remove("vv-nav2-lock");
  }, [menuOpen]);

  const topLinks = links.filter(x => ["#top", "#about", "#services", "#who-we-serve", "#work", "#contact"].includes(x.hash));
  const compactLinks = links.filter(x => ["#services", "#work"].includes(x.hash));
  return (
    <header className={"vv-nav2" + (expanded ? " is-expanded" : " is-compact")} style={{ pointerEvents: visible ? undefined : "none" }} aria-label="Visual Verse Creations navigation">
      <div className="vv-nav2-island">
        <a href={homeHref("#top")} className="vv-nav2-logo" aria-label="Visual Verse Creations — home">
          <img src="/brand-wordmark.png" alt="Visual Verse Creations" width={195} height={55}/>
        </a>
        <nav className="vv-nav2-links vv-nav2-full" aria-label="Main navigation">
          {topLinks.map(link => <a href={homeHref(link.hash)} className={active === link.hash ? "is-active" : ""} key={link.hash}>{link.label}</a>)}
        </nav>
        <nav className="vv-nav2-links vv-nav2-short" aria-label="Quick navigation">
          {compactLinks.map(link => <a href={homeHref(link.hash)} key={link.hash}>{link.label}</a>)}
        </nav>
        <div className="vv-nav2-actions">
          <a href={homeHref("#contact")} className="vv-nav2-cta">Let's talk <span><ArrowUpRight size={16} aria-hidden="true"/></span></a>
          <button type="button" className="vv-nav2-menu-button" onClick={() => setMenuOpen(true)} aria-label="Open all navigation links" aria-expanded={menuOpen} aria-controls="vv-nav2-panel"><Menu size={22}/></button>
        </div>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button key="backdrop" type="button" className="vv-nav2-backdrop" aria-label="Close navigation" onClick={() => setMenuOpen(false)}
              initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.2}}/>
            <motion.nav id="vv-nav2-panel" key="panel" className="vv-nav2-panel" aria-label="All pages and sections"
              initial={{x:"104%"}} animate={{x:0}} exit={{x:"104%"}} transition={{type:"tween",duration:.3,ease:[.22,1,.36,1]}}>
              <div className="vv-nav2-panel-head"><img src="/logo-mark.png" alt="" aria-hidden="true" /><button type="button" onClick={() => setMenuOpen(false)} aria-label="Close navigation"><X size={22}/></button></div>
              <span className="vv-nav2-panel-kicker">EXPLORE VISUAL VERSE</span>
              {links.map((link,index) => <a href={homeHref(link.hash)} onClick={() => setMenuOpen(false)} key={link.hash}><span>{String(index+1).padStart(2,"0")}</span>{link.label}<ArrowUpRight size={18} aria-hidden="true"/></a>)}
              <div className="vv-nav2-panel-end"><a href="/projects.html" onClick={() => setMenuOpen(false)}>Browse our portfolio <ArrowUpRight size={15}/></a><a href="tel:+254794044598"><Phone size={14}/> +254 794 044 598</a></div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
