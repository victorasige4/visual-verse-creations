import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ArrowUpRight, ChevronDown, Globe2, Menu as MenuIcon, X } from "lucide-react";
import { HoveredLink, MenuItem, MenuPanel, type MenuId } from "@/components/ui/navbar-menu";

const services = [
  { title: "Photography", description: "Portraits, moments and experiences", href: "#service-photography", number: "01" },
  { title: "Videography", description: "Films, motion and storytelling", href: "#service-videography", number: "02" },
  { title: "Branding", description: "Identity, strategy and expression", href: "#service-branding", number: "03" },
  { title: "Graphic Design", description: "Visual ideas brought to life", href: "#service-graphic-design", number: "04" },
  { title: "Web & UI/UX", description: "Thoughtful digital experiences", href: "#service-web-ui-ux", number: "05" },
  { title: "Social Media", description: "Campaigns and creative content", href: "#service-social-media", number: "06" },
];

const audiences = [
  { title: "Growing brands", description: "Build an identity people remember", href: "#who-we-serve", number: "01" },
  { title: "Businesses & teams", description: "Communicate with clarity", href: "#who-we-serve", number: "02" },
  { title: "Creators & founders", description: "Give ambitious ideas their presence", href: "#who-we-serve", number: "03" },
  { title: "People & events", description: "Capture moments worth keeping", href: "#who-we-serve", number: "04" },
];

function MegaContent({ active, close }: { active: MenuId; close: () => void }) {
  const isServices = active === "services";
  const links = isServices ? services : audiences;

  return (
    <div className="vv-island-mega-layout">
      <div className="vv-island-mega-intro">
        <span className="vv-island-eyebrow">{isServices ? "WHAT WE DO / 001" : "WHO WE CREATE WITH / 002"}</span>
        <h2>{isServices ? <>Many disciplines.<br /><em>One vision.</em></> : <>Your story.<br /><em>Our perspective.</em></>}</h2>
        <p>{isServices
          ? "Design, film, photography and digital thinking under one creative roof."
          : "From new ideas to important milestones, we make every story feel unmistakably yours."}</p>
        <HoveredLink href={isServices ? "#services" : "#who-we-serve"} onClick={close}>
          {isServices ? "Discover all services" : "Who we work with"}
        </HoveredLink>
        <div className="vv-island-mega-orb" aria-hidden="true" />
      </div>
      <div className="vv-island-mega-cards">
        {links.map((link) => (
          <a key={link.number} href={link.href} className="vv-island-mega-card" onClick={close}>
            <span className="vv-island-card-no">{link.number}</span>
            <span className="vv-island-card-text">
              <strong>{link.title}</strong>
              <small>{link.description}</small>
            </span>
            <ArrowUpRight size={17} strokeWidth={1.8} aria-hidden="true" />
          </a>
        ))}
        {!isServices && <p className="vv-island-mega-caption">FROM YOUR FIRST IDEA TO YOUR BIGGEST NEXT STEP.</p>}
      </div>
    </div>
  );
}

function MobileDetails({ title, items, onFollow }: {
  title: string;
  items: typeof services;
  onFollow: () => void;
}) {
  return (
    <details className="vv-island-mobile-details">
      <summary>{title}<ChevronDown size={17} aria-hidden="true" /></summary>
      <div className="vv-island-mobile-details-list">
        {items.map(item => <a href={item.href} key={item.number} onClick={onFollow}>{item.title}<ArrowUpRight size={14} aria-hidden="true" /></a>)}
      </div>
    </details>
  );
}

export function VisualVerseNavbar() {
  const [active, setActive] = useState<MenuId | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [current, setCurrent] = useState("#top");
  const islandRef = useRef<HTMLElement | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const close = () => {
    setActive(null);
    setLanguageOpen(false);
  };

  useEffect(() => {
    // Keep the original header in the DOM as a zero-JS fallback. When the
    // React island mounts it becomes the only visible navigation bar.
    document.documentElement.classList.add("vv-react-nav-ready");
    return () => document.documentElement.classList.remove("vv-react-nav-ready");
  }, []);

  useEffect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        setMobileOpen(false);
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (islandRef.current && !islandRef.current.contains(event.target as Node)) close();
    };
    const onHash = () => {
      setCurrent(window.location.hash || "#top");
      close();
      setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeydown);
    document.addEventListener("pointerdown", onPointer);
    window.addEventListener("hashchange", onHash);
    return () => {
      window.removeEventListener("keydown", onKeydown);
      document.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const ids = ["top", "about", "services", "who-we-serve", "work", "process", "contact"];
      const threshold = Math.min(220, window.innerHeight * 0.28);
      let located = "top";
      for (const id of ids) {
        const target = document.getElementById(id);
        if (target && target.getBoundingClientRect().top < threshold) located = id;
      }
      setCurrent("#" + located);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const delayedClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setActive(null), 180);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  const onFollow = () => {
    close();
    setMobileOpen(false);
  };

  const standardLinks = [
    { label: "Home", href: "#top" },
    { label: "About Us", href: "#about" },
  ];
  const finalLinks = [
    { label: "Projects", href: "#work" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header
      className="vv-island-header"
      ref={islandRef}
      aria-label="Visual Verse Creations navigation"
      onMouseEnter={cancelClose}
      onMouseLeave={delayedClose}
    >
      <div className="vv-island-bar">
        <a href="#top" onClick={onFollow} className="vv-island-brand" aria-label="Visual Verse Creations — Home">
          <img src="/brand-wordmark.png" alt="Visual Verse Creations" width={208} height={60} />
        </a>
        <nav className="vv-island-nav" aria-label="Main navigation">
          {standardLinks.map(item => (
            <a key={item.href} className={"vv-island-link" + (current === item.href ? " is-current" : "")}
              href={item.href} onMouseEnter={close} onFocus={close} onClick={onFollow}>{item.label}</a>
          ))}
          <MenuItem item="services" label="Services" active={active} setActive={(value) => { setActive(value);setLanguageOpen(false); }} />
          <MenuItem item="audiences" label="Who We Serve" active={active} setActive={(value) => { setActive(value);setLanguageOpen(false); }} />
          {finalLinks.map(item => (
            <a key={item.href} className={"vv-island-link" + (current === item.href ? " is-current" : "")}
              href={item.href} onMouseEnter={close} onFocus={close} onClick={onFollow}>{item.label}</a>
          ))}
        </nav>
        <div className="vv-island-actions">
          <div className="vv-island-language">
            <button aria-label="Choose language" aria-expanded={languageOpen} type="button" className="vv-island-language-btn"
              onClick={() => { setLanguageOpen(!languageOpen);setActive(null); }}>
              <Globe2 size={17} strokeWidth={1.7} aria-hidden="true" /><span>EN</span><ChevronDown size={12} aria-hidden="true" />
            </button>
            <AnimatePresence>
              {languageOpen && (
                <motion.div className="vv-island-language-popover" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <strong>English <span>✓</span></strong><span>Kiswahili <small>Coming soon</small></span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <a className="vv-island-cta" href="#contact" onMouseEnter={close} onClick={onFollow}>
            <span>Let's talk</span><span className="vv-island-cta-icon"><ArrowRight size={17} strokeWidth={1.9} aria-hidden="true" /></span>
          </a>
          <button type="button" className="vv-island-burger" aria-expanded={mobileOpen} aria-controls="vv-island-mobile"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            onClick={() => { setMobileOpen(!mobileOpen);close(); }}>
            {mobileOpen ? <X size={23} /> : <MenuIcon size={23} />}
          </button>
        </div>
      </div>
      <MenuPanel active={active}>
        {active && <MegaContent active={active} close={close} />}
      </MenuPanel>
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            key="mobile"
            id="vv-island-mobile"
            className="vv-island-mobile"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
          >
            <a href="#top" onClick={onFollow}>Home</a>
            <a href="#about" onClick={onFollow}>About Us</a>
            <MobileDetails title="Services" items={services} onFollow={onFollow} />
            <MobileDetails title="Who We Serve" items={audiences} onFollow={onFollow} />
            <a href="#work" onClick={onFollow}>Projects</a>
            <a href="#contact" onClick={onFollow}>Contact</a>
            <a className="vv-island-mobile-cta" href="#contact" onClick={onFollow}>Let's talk <ArrowUpRight size={18} /></a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
