import { useEffect, useRef, useState, type PointerEvent, type CSSProperties, type ReactNode } from "react";
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
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const [ready, setReady] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const headingElement = headingRef.current;
    if (!section || !headingElement) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const words = Array.from(headingElement.querySelectorAll<HTMLElement>(".vv-cta-word"));
    if (reduceMotion.matches || !("IntersectionObserver" in window) ||
        !("animate" in headingElement)) {
      setReady(true);
      setRevealed(true);
      return;
    }

    setReady(true);
    let started = false;
    let panelVisible = false;
    let panelObserver: IntersectionObserver | null = null;
    let wordObserver: IntersectionObserver | null = null;
    const animations: Animation[] = [];

    // A section-level observer animates the background panel independently.
    // Text animation must wait for the ACTUAL headline to appear, otherwise
    // the long CTA can trigger it before the user can see the words.
    panelObserver = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting) && !panelVisible) {
        panelVisible = true;
        setRevealed(true);
      }
    }, { threshold: .045 });
    panelObserver.observe(section);

    // WAAPI guarantees a visible entrance even when React batches state
    // updates or a visitor jumps straight to #lets-create.
    const animateWords = () => {
      if (started) return;
      started = true;
      setRevealed(true);
      animations.forEach(a => a.cancel());
      animations.length = 0;
      words.forEach((word, index) => {
        const animation = word.animate(
          [
            { opacity: 0, transform: "translate3d(0, 112%, 0) rotate(2deg)", filter: "blur(7px)" },
            { opacity: 1, transform: "translate3d(0, 0, 0) rotate(0deg)", filter: "blur(0px)" },
          ],
          {
            duration: 1050,
            delay: 130 + index * 112,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            fill: "both",
          }
        );
        animation.addEventListener("finish", () => animation.cancel(), { once: true });
        animations.push(animation);
      });
    };

    wordObserver = new IntersectionObserver(entries => {
      const entry = entries[0];
      if (!entry) return;
      if (entry.isIntersecting && entry.intersectionRatio >= .24) {
        animateWords();
      } else if (!entry.isIntersecting) {
        // Replay only after the headline has left the viewport completely,
        // not on minor scroll changes while people are reading it.
        started = false;
      }
    }, { threshold: [0, .24, .4], rootMargin: "0px 0px -8% 0px" });
    wordObserver.observe(headingElement);

    return () => {
      panelObserver?.disconnect();
      wordObserver?.disconnect();
      animations.forEach(a => a.cancel());
    };
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
            <h2 id="vv-cta-title" ref={headingRef} className="vv-cta-headline">
              {words.map((word,index)=>(
                <span className="vv-cta-word-wrap" key={index}>
                  <span className="vv-cta-word"
                    style={{"--vv-cta-word-index":index} as CSSProperties}>{word}</span>
                </span>
              )).reduce<ReactNode[]>((result,element,index)=>{
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
