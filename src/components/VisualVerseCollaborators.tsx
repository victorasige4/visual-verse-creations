import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Box, Paintbrush, PenTool, Sparkles } from "lucide-react";
import "../visual-verse-collaborators.css";

/**
 * Potadot-inspired four-column collaborators: screenshot-matched dimensions,
 * soft inset icon wells and a subtle pointer-positioned spotlight.
 * Visual Verse categories and descriptions stay original.
 */
const collaborators = [
  {
    name: "Marketing teams",
    description: "You bring the strategy. We create the visuals, films and campaigns that bring it to life.",
    Icon: Paintbrush,
  },
  {
    name: "Creative agencies",
    description: "You lead the brief. We extend your team with design, photography and production.",
    Icon: Box,
  },
  {
    name: "Event planners",
    description: "You shape the experience. We capture the energy and creative details that last.",
    Icon: PenTool,
  },
  {
    name: "Founders & product teams",
    description: "You have the vision. We build the identity, visuals and digital experiences around it.",
    Icon: Sparkles,
  },
] as const;

export function VisualVerseCollaborators() {
  const sectionRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (!("IntersectionObserver" in window) ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(true);
      return;
    }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setRevealed(true);
        observer.disconnect();
      }
    }, { rootMargin: "40px 0px", threshold: .1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const updateSpot = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--vv-partner-mx", String(event.clientX - rect.left) + "px");
    event.currentTarget.style.setProperty("--vv-partner-my", String(event.clientY - rect.top) + "px");
  };

  return (
    <section ref={sectionRef}
      className={"vv-about-partners vv-collab-section" + (revealed ? " is-revealed" : "")}
      id="collaborate" aria-labelledby="vv-collab-title">
      <div className="vv-about-container vv-collab-container">
        <header className="vv-collab-header">
          <span className="vv-collab-eyebrow"><i aria-hidden="true"/><i aria-hidden="true"/>WHO WE COLLABORATE WITH</span>
          <div className="vv-collab-header-main">
            <h2 id="vv-collab-title"><span>Better together with </span><span>the right partners.</span></h2>
            <p>Great ideas grow with the right people. We collaborate with teams that need creative expertise, thoughtful production and digital thinking. <a href="/contact.html">Let's create together</a>.</p>
          </div>
        </header>
        <div className="vv-collab-cards" aria-label="Our creative collaborators">
          {collaborators.map(({name,description,Icon},index) => (
            <article key={name} className="vv-collab-card" style={{animationDelay:String(index * 70) + "ms"}}
              onPointerEnter={updateSpot} onPointerMove={updateSpot}>
              <span className="vv-collab-icon" aria-hidden="true"><Icon size={23} strokeWidth={1.8}/></span>
              <h3>{name}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
