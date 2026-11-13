import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Check, CheckCircle2, Heart, Rocket, Sparkles } from "lucide-react";
import "../visual-verse-services-page.css";

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

function ProcessArtwork({step}:{step:number}) {
  switch(step){
    case 0: return <div className="vv-sp-art vv-sp-art-chat">
      <div className="vv-sp-speech is-question"><span className="vv-sp-avatar" aria-hidden="true"/>What story are we telling?</div>
      <div className="vv-sp-speech is-answer">Something people will remember.<i aria-hidden="true"/></div>
      <div className="vv-sp-flow"><span>Listen</span><b/> <span>Understand</span><b/> <span className="is-accent">Discover</span></div>
      <div className="vv-sp-art-notes"><span>THE AUDIENCE</span><span>THE IDEA</span><span>THE GOAL</span></div>
    </div>;
    case 1: return <div className="vv-sp-art vv-sp-art-roadmap">
      <div className="vv-sp-window-head"><span>CREATIVE ROADMAP</span><b>BRIEF APPROVED <Check size={13}/></b></div>
      <div className="vv-sp-roadmap-grid">
        {["Research","Concepts","Production","Feedback","Delivery"].map((x,i)=>
          <div key={x}><span>{x}</span><i style={{"--bar-width":(i===0?87:i===1?69:i===2?94:i===3?52:39)+"%","--bar-delay":i*90+"ms"} as CSSProperties}/></div>)}
      </div>
      <div className="vv-sp-roadmap-foot"><span>WEEK 01</span><span>WEEK 02</span><span>WEEK 03</span><span>WEEK 04</span></div>
    </div>;
    case 2: return <div className="vv-sp-art vv-sp-art-mood">
      <div className="vv-sp-mood-top"><span>MOODBOARD / DIRECTION 01</span><Sparkles size={17}/></div>
      <div className="vv-sp-mood-grid">
        <div className="vv-sp-mood-type">MAKE<br/><em>IT MEAN</em><br/>SOMETHING.</div>
        <div className="vv-sp-mood-img"><img src={import.meta.env.BASE_URL+"portfolio-event-detail.jpg"} alt="Visual Verse photography for concept direction" loading="lazy"/></div>
        <div className="vv-sp-mood-color"><i/><i/><i/></div>
      </div>
      <div className="vv-sp-mood-bottom"><span>FEELING / PURPOSE / STORY</span><span>VV · 03</span></div>
    </div>;
    case 3: return <div className="vv-sp-art vv-sp-art-production">
      <div className="vv-sp-window-head"><span><i/><i/><i/> VISUAL VERSE / STUDIO</span><b>IN PRODUCTION</b></div>
      <div className="vv-sp-workspace">
        <div className="vv-sp-tools"><span>✳</span><span>◯</span><span>↗</span><span>T</span></div>
        <div className="vv-sp-artboard"><small>VISUAL VERSE / STORY 01</small><strong>GREAT<br/>IDEAS<br/><em>LIVE HERE.</em></strong><div className="vv-sp-artboard-orbit"/></div>
        <div className="vv-sp-layers"><small>LAYERS</small><span><i/> TYPE</span><span><i/> SHAPE</span><span><i/> IMAGE</span></div>
      </div>
      <div className="vv-sp-art-status">DESIGN · FILM · PHOTO · DIGITAL</div>
    </div>;
    case 4: return <div className="vv-sp-art vv-sp-art-review">
      <div className="vv-sp-window-head"><span>CREATIVE QUALITY CHECK</span><b>05 / 07</b></div>
      <div className="vv-sp-review-head"><CheckCircle2 size={24}/> READY FOR FINAL REVIEW <small>4 / 4 APPROVED</small></div>
      <div className="vv-sp-checks">{[
        "Visual identity is consistent","Every frame tells the right story","All platforms and formats checked","Feedback applied and approved"
      ].map((x,i)=><div key={x}><span><Check size={13}/></span><p>{x}</p><small>DONE</small></div>)}</div>
      <span className="vv-sp-review-progress"/>
    </div>;
    case 5: return <div className="vv-sp-art vv-sp-art-launch">
      <div className="vv-sp-launch-circle"><span className="vv-sp-launch-circle-ring"/><Rocket size={35}/><strong>LIVE</strong></div>
      <div className="vv-sp-launch-status">YOUR STORY. READY FOR THE WORLD.</div>
      <div className="vv-sp-launch-chips"><span>DELIVERED</span><span>PUBLISHED</span><span>SHARED</span></div>
    </div>;
    default:return <div className="vv-sp-art vv-sp-art-growth">
      <div className="vv-sp-window-head"><span>CREATIVE PARTNERSHIP</span><b>ALWAYS GROWING</b></div>
      <div className="vv-sp-health"><span>PROJECT STATUS</span><strong>Going places. <i/></strong></div>
      <svg viewBox="0 0 420 122" aria-hidden="true" className="vv-sp-chart"><defs><linearGradient id="vv-process-chart" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#2ec4b6" stopOpacity=".2"/><stop offset="1" stopColor="#2ec4b6" stopOpacity="0"/></linearGradient></defs><path d="M0 103 L58 98 L110 90 L159 96 L205 67 L266 73 L315 50 L363 55 L420 17 L420 122 L0 122Z" fill="url(#vv-process-chart)"/><path d="M0 103 L58 98 L110 90 L159 96 L205 67 L266 73 L315 50 L363 55 L420 17" fill="none" stroke="#2ec4b6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
      <div className="vv-sp-growth-foot"><span><Heart size={12}/> ROOM TO GROW</span><span>VISUAL VERSE / ALWAYS HERE</span></div>
    </div>;
  }
}

export function VisualVerseProcessJourney() {
  const rootRef = useRef<HTMLElement>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let frame = 0;
    const recalc = () => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      const runway = Math.max(1, rect.height - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / runway));
      const current = Math.min(6, Math.max(0, Math.round(progress * 6)));
      root.style.setProperty("--vv-sp-progress", progress.toFixed(4));
      root.style.setProperty("--vv-sp-active", String(current));
      root.style.setProperty("--vv-sp-phase", Math.max(0, Math.min(1, (progress * 6 + .5) % 1)).toFixed(4));
      if (activeRef.current !== current) {
        activeRef.current = current;
        setActive(current);
      }
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(recalc); };
    const onResize = () => { if (!frame) frame = requestAnimationFrame(recalc); };
    recalc();
    window.addEventListener("scroll", onScroll, {passive:true});
    window.addEventListener("resize", onResize, {passive:true});
    return () => { cancelAnimationFrame(frame);window.removeEventListener("scroll",onScroll);window.removeEventListener("resize",onResize); };
  }, []);

  const goTo = (index:number) => {
    const section = rootRef.current;
    if (!section) return;
    const sectionStart = window.scrollY + section.getBoundingClientRect().top;
    const runway = Math.max(1, section.getBoundingClientRect().height - window.innerHeight);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({top:sectionStart + runway * (index / 6),behavior:reduce?"instant":"smooth"});
  };

  return <section className="vv-sp-process" id="our-process" aria-labelledby="vv-sp-title" ref={rootRef}>
    <div className="vv-sp-pin">
      <div className="vv-sp-dots" aria-hidden="true"/>
      <div className="vv-sp-grid">
        <div className="vv-sp-left">
          <div className="vv-sp-overline"><i/><i/> OUR PROCESS</div>
          <h2 id="vv-sp-title">Seven steps from <em>first hello</em> to the final frame—and beyond.</h2>
          <div className="vv-sp-stage" aria-live="off">
            <div className="vv-sp-stage-sparks" aria-hidden="true"><span/><span/><span/><span/></div>
            <div className="vv-sp-counter"><strong>{stamp(active)}</strong><span>/ 07</span></div>
            <div className="vv-sp-stage-label"><span>IN MOTION</span><i/> <span>{steps[active].title}</span></div>
            <div className="vv-sp-scene-layer">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={active} className="vv-sp-scene"
                  initial={reducedMotion ? false : {opacity:0,y:62,scale:.87,rotateX:14,filter:"blur(14px)"}}
                  animate={{opacity:1,y:0,scale:1,rotateX:0,filter:"blur(0px)"}}
                  exit={reducedMotion ? {opacity:1} : {opacity:0,y:-32,scale:1.035,rotateX:-6,filter:"blur(10px)"}}
                  transition={reducedMotion ? {duration:0} : {duration:.67,ease:[.16,1,.3,1]}}>
                  <ProcessArtwork step={active}/>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="vv-sp-stage-track"><span/></div>
          </div>
        </div>
        <div className="vv-sp-right">
          <ol className="vv-sp-steps" aria-label="Seven stages of the Visual Verse creative process">
            {steps.map((item,index)=><li className={"vv-sp-step"+(index===active?" is-active":"")+(index<active?" is-complete":"")} key={item.title}>
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
          <a className="vv-sp-after-link" href={import.meta.env.BASE_URL+"request-quote.html"}>Ready to begin your story? <ArrowUpRight size={16}/></a>
        </div>
      </div>
      <div className="vv-sp-section-progress" aria-hidden="true"><span/></div>
      <p className="vv-sp-sr-only" aria-live="polite">Step {stamp(active)} of 07: {steps[active].title}</p>
    </div>
  </section>;
}
