import { useEffect, useRef, useState, type PointerEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import "../visual-verse-cta.css";

/**
 * About CTA, based on a desktop/mobile comparison of Potadot's actual CTA:
 *  - 1168px rounded panel and 560px background ring
 *  - dotted dark background
 *  - scroll-triggered scale and staggered word reveal
 *  - two magnetic pill buttons with stacked label motion + rotating arrow orbs
 *  - three monospaced contact lines below the buttons
 *
 * All colors stay on Visual Verse's navy / mint / white palette.
 */
const heading = "Have a story? Let's make it unforgettable.";
const words = heading.split(/\s+/);

export function VisualVerseAboutCta() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [ready, setReady] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      setReady(true);
      setRevealed(true);
      return;
    }
    setReady(true);
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setRevealed(true);
        observer.disconnect();
      }
    }, { threshold: .12, rootMargin: "0px 0px -25px 0px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const magneticMove = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== "mouse" ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const dx = ((event.clientX - rect.left) / rect.width - .5) * 11;
    const dy = ((event.clientY - rect.top) / rect.height - .5) * 9;
    target.style.setProperty("--vv-cta-mx", dx.toFixed(2) + "px");
    target.style.setProperty("--vv-cta-my", dy.toFixed(2) + "px");
  };
  const magneticReset = (event: PointerEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.setProperty("--vv-cta-mx", "0px");
    event.currentTarget.style.setProperty("--vv-cta-my", "0px");
  };

  const button = (
    label: string,
    url: string,
    primary: boolean,
    external = false
  ) => (
    <a
      className={"vv-cta-button " + (primary ? "vv-cta-button--primary" : "vv-cta-button--secondary")}
      href={url}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onPointerMove={magneticMove}
      onPointerLeave={magneticReset}
      data-cursor={label.toUpperCase()}
    >
      <span className="vv-cta-button-mask">
        <span className="vv-cta-button-text">
          <span>{label}</span>
          <span aria-hidden="true">{label}</span>
        </span>
      </span>
      <span className="vv-cta-button-icon" aria-hidden="true"><ArrowUpRight size={18} strokeWidth={2.1}/></span>
    </a>
  );

  return (
    <section
      id="lets-create"
      ref={sectionRef}
      className={"vv-about-final vv-cta-section" +
        (ready ? " is-ready" : "") +
        (revealed ? " is-visible" : "")}
      aria-labelledby="vv-cta-title">
      <div className="vv-cta-panel">
        <div className="vv-cta-ring" aria-hidden="true"/>
        <div className="vv-cta-dots" aria-hidden="true"/>
        <div className="vv-cta-content">
          <div className="vv-cta-leading">
            <span className="vv-cta-eyebrow"><i aria-hidden="true"/><i aria-hidden="true"/> LET'S MAKE SOMETHING MEANINGFUL</span>
            <h2 id="vv-cta-title" className="vv-cta-headline">
              {words.map((word,index)=>(
                <span className="vv-cta-word-wrap" key={index}>
                  <span className="vv-cta-word"
                    style={{"--vv-cta-word-index":index} as React.CSSProperties}>{word}</span>
                </span>
              )).reduce<React.ReactNode[]>((result,element,index)=>{
                if(index>0) result.push(" ");
                result.push(element);
                return result;
              },[])}
            </h2>
            <div className="vv-cta-actions" aria-label="Get in touch with Visual Verse">
              {button("Let's talk", import.meta.env.BASE_URL + "request-quote.html", true)}
              {button("WhatsApp now", "https://wa.me/254794044598", false, true)}
            </div>
          </div>
          <address className="vv-cta-contact">
            <a href="tel:+254794044598">+254 794 044 598</a>
            <a href="mailto:hello@visualverse.com">hello@visualverse.com</a>
            <span>Nairobi, Kenya</span>
          </address>
        </div>
      </div>
    </section>
  );
}
