import { EditorialText } from "./EditorialText";
import { VisualVerseActionContent } from "./VisualVerseAction";
import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { ProcessStoryArt } from "./VisualVerseProcessStories";
import "../visual-verse-services-page.css";
import { Boxes } from "./ui/background-boxes";

/**
 * Visual Verse creative process. Observed and rebuilt from the original
 * Potadot seven-step pinned journey (1440x900 / 390x844 captures).
 *
 * Scroll position drives the step and progress rail. Buttons are keyboard
 * navigable; clicking jumps to the exact step in the scroll runway.
 * The seven mini-scenes are entirely Visual Verse originals.
 */
export const steps = [
  { title: "The First Conversation", line: "We listen to your goals, your audience and the story you want to tell." },
  { title: "Discovery & Planning", line: "We turn the brief into a clear creative plan, scope and realistic milestones." },
  { title: "Creative Direction", line: "We develop moodboards, visual concepts and the creative language of your project." },
  { title: "Design & Production", line: "The concept comes to life through design, photography, film and digital craft." },
  { title: "Review & Refinement", line: "We check every detail, gather your feedback and polish until the work feels right." },
  { title: "Delivery & Launch", line: "Your finished assets are prepared for their channels, platforms and people." },
  { title: "Beyond the Launch", line: "We remain a creative partner as your brand grows and your next ideas take shape." },
] as const;

const stamp = (n:number) => String(n + 1).padStart(2, "0");

type JourneyStep = { title: string; line: string };
export function VisualVerseProcessJourney({items=steps, heading, artwork, quoteHref}:{
  items?:readonly JourneyStep[];
  heading?:ReactNode;
  artwork?:(step:number)=>ReactNode;
  quoteHref?:string;
} = {}) {
  const rootRef = useRef<HTMLElement>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const reducedMotion = useReducedMotion();
  const count = items.length;
  const last = count-1;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let frame = 0;
    let lastProgress = -1;
    let lastCurrent = -1;
    let pinHeight = 0, runway = 1;
    const pin = root.querySelector<HTMLElement>(".vv-sp-pin");
    const measure = () => {
      pinHeight = pin?.offsetHeight ?? window.innerHeight;
      runway = Math.max(1, root.offsetHeight - pinHeight);
    };
    const recalc = () => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -rect.top / runway));
      // Equal scroll intervals, including the first and final chapter.
      const current = Math.min(last, Math.max(0, Math.floor(progress * count)));
      if(current===lastCurrent&&Math.abs(progress-lastProgress)<.0001)return;
      lastProgress=progress;lastCurrent=current;
      root.style.setProperty("--vv-sp-progress", progress.toFixed(4));
      root.style.setProperty("--vv-sp-active", String(current));
      root.style.setProperty("--vv-sp-phase", Math.max(0, Math.min(1, progress * count-current)).toFixed(4));
      if (activeRef.current !== current) {
        activeRef.current = current;
        setActive(current);
      }
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(recalc); };
    const onResize = () => { measure(); if (!frame) frame = requestAnimationFrame(recalc); };
    const resizeObserver = typeof ResizeObserver!=="undefined" ? new ResizeObserver(onResize) : null;
    resizeObserver?.observe(root);if(pin)resizeObserver?.observe(pin);
    measure();recalc();
    window.addEventListener("scroll", onScroll, {passive:true});
    window.addEventListener("resize", onResize, {passive:true});
    return () => { resizeObserver?.disconnect();cancelAnimationFrame(frame);window.removeEventListener("scroll",onScroll);window.removeEventListener("resize",onResize); };
  }, [count,last]);

  const goTo = (index:number) => {
    const section = rootRef.current;
    if (!section) return;
    const sectionStart = window.scrollY + section.getBoundingClientRect().top;
    const pinHeight = section.querySelector(".vv-sp-pin")?.getBoundingClientRect().height ?? window.innerHeight;
    const runway = Math.max(1, section.getBoundingClientRect().height - pinHeight);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({top:sectionStart + runway * ((index + .5) / Math.max(1,count)),behavior:reduce?"instant":"smooth"});
  };

  return <section className="vv-sp-process" id="our-process" aria-labelledby="vv-sp-title" ref={rootRef} style={{"--vv-sp-step-count":count} as CSSProperties}>
    <div className="vv-sp-pin">
      <Boxes/>
      <div className="vv-sp-grid">
        <header className="vv-sp-heading">
          <div className="vv-sp-overline"><i/><i/> OUR PROCESS</div>
          <h2 id="vv-sp-title">{typeof heading === "string" ? <EditorialText text={heading}/> : heading ?? <>Seven steps from <br className="vv-break-narrow"/><em>first hello</em> to <br className="vv-break-wide"/>the final <br className="vv-break-narrow"/>frame—and beyond.</>}</h2>
        </header>
        <div className="vv-sp-left">
          <div className="vv-sp-stage" data-active-step={active+1} aria-live="off">
            <div className="vv-sp-stage-sparks" aria-hidden="true"><span/><span/><span/><span/></div>
            <div className="vv-sp-stage-head">
              <div className="vv-sp-counter"><strong>{stamp(active)}</strong><span>/ {stamp(last)}</span></div>
              <div className="vv-sp-stage-label"><span>IN MOTION</span><i/> <span>{items[active].title}</span></div>
            </div>
            <div className="vv-sp-scene-layer">
                <motion.div key={active} className="vv-sp-scene"
                  initial={reducedMotion ? false : {opacity:.55,y:8}}
                  animate={{opacity:1,y:0}}
                  transition={reducedMotion ? {duration:0} : {duration:.48,ease:[.22,1,.36,1]}}>
                  {artwork ? artwork(active) : <ProcessStoryArt kind="overview" step={active}/>}
                </motion.div>
            </div>
            <div className="vv-sp-stage-track"><span/></div>
          </div>
        </div>
        <div className="vv-sp-right">
          <div className="vv-sp-mobile-copy"><strong>{items[active].title}</strong><p>{items[active].line}</p></div>
          <ol className="vv-sp-steps" aria-label="Stages of the Visual Verse creative process">
            {items.map((item,index)=><li className={"vv-sp-step"+(index===active?" is-active":"")+(index<active?" is-complete":"")} key={item.title}>
              <button type="button"
                className="vv-sp-step-button"
                onClick={()=>goTo(index)}
                aria-current={index===active?"step":undefined}
                aria-label={"Jump to step "+stamp(index)+": "+item.title}>
                <span className="vv-sp-step-number">{stamp(index)}</span>
                <span className="vv-sp-step-content"><strong>{item.title}</strong>
                  <span className="vv-sp-step-description">{item.line}</span>
                </span>
              </button>
            </li>)}
          </ol>
          <a className="vv-sp-after-link vv-motion-action vv-action-on-dark" href={quoteHref ?? import.meta.env.BASE_URL+"request-quote.html"}><VisualVerseActionContent Icon={ArrowUpRight}>Ready to begin your story?</VisualVerseActionContent></a>
        </div>
      </div>
      <div className="vv-sp-section-progress" aria-hidden="true"><span/></div>
      <p className="vv-sp-sr-only" aria-live="polite">Step {stamp(active)} of {stamp(last)}: {items[active].title}</p>
    </div>
  </section>;
}
