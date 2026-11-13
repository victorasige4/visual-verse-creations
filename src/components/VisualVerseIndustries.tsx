import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import {
  ArrowUpRight, Building2, Camera, Clapperboard,
  Megaphone, MonitorSmartphone, Palette, Rocket
} from "lucide-react";
import "../visual-verse-industries.css";

/**
 * Visual Verse / WHO WE CREATE WITH
 *
 * The six-card Before -> After interaction recreates the visual layout and
 * behaviour of Potadot About > Industries We Serve. Visual Verse-specific
 * industries, descriptions and branding are used throughout.
 *
 * Default: cards are all "after" once revealed. Hover/focus a card to focus its
 * after state while its siblings show their "before" states; click/tap to hold.
 * All cards remain accessible with keyboard and reduced motion settings.
 */
const audiences = [
  {
    name: "Growing brands",
    before: "An idea people haven't met",
    after: "A brand they recognise",
    Icon: Palette,
  },
  {
    name: "Businesses & organisations",
    before: "Information without impact",
    after: "Stories that connect",
    Icon: Building2,
  },
  {
    name: "Creators & founders",
    before: "A vision still taking shape",
    after: "A distinct creative identity",
    Icon: Rocket,
  },
  {
    name: "Events & communities",
    before: "A moment that passes",
    after: "A story that stays",
    Icon: Camera,
  },
  {
    name: "Digital-first teams",
    before: "An interface that feels complex",
    after: "An experience that feels natural",
    Icon: MonitorSmartphone,
  },
  {
    name: "Campaigns & storytellers",
    before: "A message lost in the noise",
    after: "Something worth sharing",
    Icon: Clapperboard,
  },
] as const;

export function VisualVerseIndustries() {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const focus = hovered ?? pinned;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window) ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, {threshold: .10, rootMargin: "0px 0px -45px 0px"});
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const toggle = (index: number) =>
    setPinned(current => current === index ? null : index);

  const onCardKey = (event: KeyboardEvent<HTMLElement>, index: number) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle(index);
    }
    if (event.key === "Escape") {
      setPinned(null);
      setHovered(null);
    }
  };

  return (
    <section
      className={"vv-about-audiences vv-industry-section" + (isVisible ? " is-revealed" : "")}
      id="our-audiences"
      aria-labelledby="vv-industry-title"
      ref={ref}
    >
      <div className="vv-about-container vv-industry-container">
        <header className="vv-industry-head">
          <span className="vv-industry-eyebrow"><i/><i/> WHO WE CREATE WITH</span>
          <h2 id="vv-industry-title">From big brands to founders' first ideas.</h2>
        </header>

        <div className="vv-industry-grid" role="group" aria-label="Explore the kinds of people and organisations we create for">
          {audiences.map((item,index) => {
            const Icon = item.Icon;
            const isOn = isVisible && (focus === null || focus === index);
            const isSelected = focus === index;
            return (
              <article
                className={"vv-industry-card" + (isOn ? " is-on" : "") +
                  (isSelected ? " is-selected" : "")}
                key={item.name}
                style={{"--vv-industry-index": index} as CSSProperties}
                tabIndex={0}
                role="button"
                aria-pressed={pinned === index}
                aria-label={item.name + ". " + (isOn ? item.after : item.before) + ". Select to highlight."}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(index)}
                onBlur={() => setHovered(null)}
                onKeyDown={event => onCardKey(event, index)}
                onClick={() => toggle(index)}
                data-cursor="EXPLORE"
              >
                <div className="vv-industry-card-top">
                  <span className="vv-industry-icon"><Icon size={23} strokeWidth={2.65} aria-hidden="true"/></span>
                  <span className="vv-industry-number" aria-hidden="true">{String(index + 1).padStart(2,"0")}</span>
                </div>
                <h3>{item.name}</h3>
                <div className="vv-industry-flip">
                  <span className="vv-industry-before"><i/>{item.before}</span>
                  <span className="vv-industry-after"><i/>{item.after}</span>
                </div>
                <div className="vv-industry-watermark" aria-hidden="true"><Icon size={162} strokeWidth={3.6}/></div>
                <span className="vv-industry-bar" aria-hidden="true"/>
              </article>
            );
          })}
        </div>
        <a href="/who-we-serve.html" className="vv-industry-link">
          See how we create for each kind of project <ArrowUpRight size={17} aria-hidden="true"/>
        </a>
      </div>
    </section>
  );
}
