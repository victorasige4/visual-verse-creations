import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import type { PointerEvent as ReactPointerEvent, FocusEvent as ReactFocusEvent } from "react";

const reasons = [
  {
    number: "01",
    title: "Made Around You",
    description: "We start with your story, your goals and your people. The creative direction is shaped around what matters to you.",
  },
  {
    number: "02",
    title: "Creative With Purpose",
    description: "Every design decision has a reason. We bring strategy, creativity and craft together to make ideas connect.",
  },
  {
    number: "03",
    title: "With You From Idea to Delivery",
    description: "From the first conversation to the finishing touches, we collaborate closely and keep the process clear.",
  },
] as const;

/**
 * A Visual Verse-specific implementation of the three-step "Why Us" interaction
 * shown in the supplied video: ink-dark atmosphere, animated ambient lights,
 * pointer-following glow, numbered connected orbs and responsive hover focus.
 */
export function VisualVerseWhyUs() {
  const shellRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [hoveringSteps, setHoveringSteps] = useState(false);
  const [focusedSteps, setFocusedSteps] = useState(false);
  const [spotlight, setSpotlight] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  // The connecting line follows scroll in BOTH directions: no autoplay clock.
  const { scrollYProgress } = useScroll({ target: shellRef, offset: ["start 85%", "end 15%"] });
  useMotionValueEvent(scrollYProgress, "change", value => {
    if (!hoveringSteps && !focusedSteps) setActive(Math.min(2, Math.floor(value * 3)));
  });

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => setInView(Boolean(entries[0]?.isIntersecting)),
      { threshold: 0.2 },
    );
    observer.observe(shell);
    return () => observer.disconnect();
  }, []);


  function trackPointer(event: ReactPointerEvent<HTMLDivElement>) {
    if (reducedMotion || event.pointerType !== "mouse") return;
    const shell = shellRef.current;
    if (!shell) return;
    const rect = shell.getBoundingClientRect();
    shell.style.setProperty("--vv-why-x", event.clientX - rect.left + "px");
    shell.style.setProperty("--vv-why-y", event.clientY - rect.top + "px");
    if (!spotlight) setSpotlight(true);
  }

  function handleBlur(event: ReactFocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) setFocusedSteps(false);
  }

  return (
    <div
      ref={shellRef}
      className={"vv-why-shell" + (spotlight && !reducedMotion ? " is-spotlit" : "")}
      onPointerMove={trackPointer}
      onPointerLeave={() => setSpotlight(false)}
    >
      <div className="vv-why-ambient vv-why-ambient-one" aria-hidden="true" />
      <div className="vv-why-ambient vv-why-ambient-two" aria-hidden="true" />

      <div className="vv-why-inner">
        <motion.div
          className="vv-why-intro"
          initial={false}
          animate={inView || reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 20 }}
          transition={{ duration: 0.65, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className="vv-why-intro-left">
            <span className="vv-why-kicker"><i aria-hidden="true" /> WHY VISUAL VERSE / 005</span>
            <h2>Creative sparks.<br /><span>Real impact.</span></h2>
          </div>
          <div className="vv-why-intro-right">
            <p>More than good-looking design. We listen first, create with intention, and bring together the right ideas to tell your story beautifully.</p>
          </div>
        </motion.div>

        <motion.div
          className="vv-why-timeline"
          role="group"
          aria-label="Three reasons to create with Visual Verse"
          onPointerEnter={(event) => { if (event.pointerType === "mouse") setHoveringSteps(true); }}
          onPointerLeave={() => setHoveringSteps(false)}
          onFocusCapture={() => setFocusedSteps(true)}
          onBlurCapture={handleBlur}
          initial={false}
          animate={inView || reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0.55, y: 24 }}
          transition={{ duration: 0.75, delay: reducedMotion ? 0 : 0.13, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className="vv-why-rail" aria-hidden="true">
            <motion.span
              className="vv-why-rail-progress"
              initial={false}
              style={{ scaleX: scrollYProgress }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.span
              className="vv-why-rail-progress-mobile"
              initial={false}
              style={{ scaleY: scrollYProgress }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          {reasons.map((reason, index) => {
            const selected = index === active;
            return (
              <button
                type="button"
                key={reason.number}
                className={"vv-why-step" + (selected ? " is-active" : "")}
                aria-pressed={selected}
                aria-label={reason.number + ". " + reason.title + ". " + reason.description}
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") {
                    setHoveringSteps(true);
                    setActive(index);
                  }
                }}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
              >
                <span className="vv-why-node-container">
                  <motion.span
                    className="vv-why-node"
                    initial={false}
                    animate={{
                      scale: selected && !reducedMotion ? 1.08 : 1,
                      backgroundColor: selected ? "#2EC4B6" : "rgba(0, 63, 92, 0.84)",
                      boxShadow: selected
                        ? "0 0 0 8px rgba(46,196,182,0.10), 0 0 35px rgba(46,196,182,0.37)"
                        : "0 0 0 6px rgba(46,196,182,0.05), 0 0 18px rgba(46,196,182,0.06)",
                    }}
                    transition={reducedMotion ? { duration: 0 } : { duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {reason.number}
                  </motion.span>
                </span>
                <strong className="vv-why-step-heading">{reason.title}</strong>
                <span className="vv-why-step-description">{reason.description}</span>
              </button>
            );
          })}
        </motion.div>
        <div className="vv-why-signoff" aria-hidden="true">
          <span>THOUGHTFUL DESIGN. LASTING STORIES.</span>
          <span>VISUAL VERSE CREATIONS · 01—03</span>
        </div>
      </div>
    </div>
  );
}
