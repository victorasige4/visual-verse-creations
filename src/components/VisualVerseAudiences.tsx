import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRight, Camera, Building2, Rocket, CalendarDays,
  Sparkles, Check, LayoutGrid, UsersRound, PenTool,
  Instagram, Linkedin, ChevronRight, BarChart3, MonitorSmartphone,
  ArrowRight, RotateCcw, Pause, Play, Layers3
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import "../audiences-motion.css";

type AudienceKind = "brands" | "business" | "creators" | "events";
type Audience = {
  title:string;
  subtitle:string;
  detail:string;
  kicker:string;
  kind:AudienceKind;
  Icon:LucideIcon;
};

const audiences:Audience[] = [
  {
    title:"Growing brands",subtitle:"From first impression to lasting identity",
    detail:"Visual identities, campaign ideas and compelling content that make your next chapter impossible to miss.",
    kicker:"BUILD YOUR PRESENCE",kind:"brands",Icon:Sparkles
  },
  {
    title:"Businesses & teams",subtitle:"Clarity for the work you do",
    detail:"Thoughtful design, film and digital experiences that help people understand your business at a glance.",
    kicker:"COMMUNICATE WITH CLARITY",kind:"business",Icon:Building2
  },
  {
    title:"Creators & founders",subtitle:"A creative partner for bold beginnings",
    detail:"Whether you are launching a brand or sharing your craft, we give your ideas the visual presence they deserve.",
    kicker:"FROM IDEA TO IDENTITY",kind:"creators",Icon:Rocket
  },
  {
    title:"People & events",subtitle:"Make the moments live on",
    detail:"Portraits, event coverage and films designed to preserve the people, places and celebrations that matter.",
    kicker:"STORIES WORTH KEEPING",kind:"events",Icon:CalendarDays
  }
];


/* The reference film pairs a starting point with a live finished-story preview.
   All illustrated screens below are original concepts, never claimed client projects. */
const journeySteps: Record<AudienceKind, [string,string,string]> = {
  brands: ["Find your voice","Shape the identity","Make an impression"],
  business: ["Get the brief","Connect the pieces","Tell one story"],
  creators: ["Imagine it","Design the experience","Bring it to life"],
  events: ["Feel the moment","Capture the story","Relive it forever"]
};
const outcomeLabels: Record<AudienceKind,string> = {
  brands:"A brand to remember",business:"One story, every channel",
  creators:"Your idea, brought to life",events:"Moments worth keeping"
};
function StartingPoint({kind}:{kind:AudienceKind}){
  const details:Record<AudienceKind,{title:string;note:string;Icon:LucideIcon}>={
    brands:{title:"Who are we, really?",note:"The first brand sketch",Icon:PenTool},
    business:{title:"So many messages...",note:"Slides · posts · websites",Icon:Layers3},
    creators:{title:"What if we built this?",note:"A big idea on paper",Icon:Rocket},
    events:{title:"One unforgettable day",note:"A moment in time",Icon:Camera}
  };
  const {title,note,Icon}=details[kind];
  return <div className={"vv-aud-start-visual is-"+kind} aria-hidden="true">
    <span className="vv-aud-start-note">{note.toUpperCase()}</span>
    <div className="vv-aud-start-sheet"><Icon size={32} strokeWidth={1.25}/><strong>{title}</strong><i/><i/></div>
    <span className="vv-aud-start-floating">the beginning ↗</span>
  </div>;
}

function AudienceArtwork({kind}:{kind:AudienceKind}) {
  if(kind==="brands")return (
    <div className="vv-aud-art vv-aud-art-brands">
      <div className="vv-aud-brand-board">
        <div className="vv-aud-brand-head"><span>IDENTITY / 01</span><LayoutGrid size={15} aria-hidden={true}/></div>
        <div className="vv-aud-brand-paper"><img src="/logo-mark.png" alt="Visual Verse brand-mark illustration"/><span>LET YOUR<br/>STORY<br/><b>STAND OUT.</b></span></div>
        <div className="vv-aud-brand-swatches"><span/><span/><span/><span/></div>
      </div>
      <div className="vv-aud-floating-note"><Check size={15} aria-hidden={true}/> A look that's distinctly yours</div>
    </div>
  );
  if(kind==="business")return (
    <div className="vv-aud-art vv-aud-art-business">
      <div className="vv-aud-dash">
        <div className="vv-aud-dash-head"><BarChart3 size={16} aria-hidden={true}/><span>BUSINESS / BRAND OVERVIEW</span><span>•••</span></div>
        <div className="vv-aud-dash-top">
          <div><small>MESSAGE CLARITY</small><strong>One voice.</strong><span>Across every touchpoint.</span></div>
          <div className="vv-aud-dash-check"><Check size={24} aria-hidden={true}/></div>
        </div>
        <div className="vv-aud-dash-bars" aria-label="Illustrative graph showing an upward visual trend">
          {[26,37,41,58,52,70,75,88].map((h,i)=><span key={i} style={{height:h+"%"}}/>)}
        </div>
        <div className="vv-aud-dash-tags"><span>STRATEGY</span><span>DESIGN</span><span>CONTENT</span></div>
      </div>
      <div className="vv-aud-business-flag"><MonitorSmartphone size={16} aria-hidden={true}/> Digital experiences, simplified</div>
    </div>
  );
  if(kind==="creators")return (
    <div className="vv-aud-art vv-aud-art-creators vv-unique-founder" aria-label="Original illustration of a founder's creative workspace">
      <div className="vv-founder-window"><span>IDEA / LAUNCH / GROW</span><i/><i/></div>
      <div className="vv-founder-portrait">
        <div className="vv-founder-person"><span className="vv-founder-head"/><span className="vv-founder-body"/></div>
        <div className="vv-founder-laptop"><strong>YOUR BIG<br/>NEXT IDEA.</strong><span>VISUAL VERSE / STUDIO</span></div>
      </div>
      <div className="vv-founder-note"><Rocket size={15} aria-hidden="true"/><span>BUILD THE IDEA<br/>MAKE IT REAL.</span></div>
    </div>
  );
  return (
    <div className="vv-aud-art vv-aud-art-events vv-unique-event" aria-label="Original illustration of a celebration and event photography moment">
      <div className="vv-event-scene"><span className="vv-event-lights"/><span className="vv-event-bokeh"/><span className="vv-event-silhouettes"><i/><i/><i/><i/><i/></span></div>
      <div className="vv-event-camera-frame"><Camera size={23} aria-hidden="true"/><strong>THE MOMENTS<br/>THAT MATTER.</strong><span>EVENTS / CELEBRATIONS / PEOPLE</span></div>
      <span className="vv-event-ticket-small">STORIES WORTH KEEPING / 04</span>
    </div>
  );
}

export function VisualVerseAudiences(){
  const [active,setActive]=useState(0);
  const [step,setStep]=useState(0);
  const [replay,setReplay]=useState(0);
  const [manualPaused,setManualPaused]=useState(false);
  const [interacting,setInteracting]=useState(false);
  const [pageVisible,setPageVisible]=useState(true);
  const paused=manualPaused||interacting;
  const [visible,setVisible]=useState(false);
  const rootRef=useRef<HTMLDivElement>(null);
  const [reduced,setReduced]=useState(false);
  useEffect(()=>{
    const media=window.matchMedia("(prefers-reduced-motion: reduce)");
    const update=()=>setReduced(media.matches);
    update();
    media.addEventListener("change",update);
    return ()=>media.removeEventListener("change",update);
  },[]);
  useEffect(()=>{
    const root=rootRef.current;
    if(!root)return;
    const observer=new IntersectionObserver(entries=>setVisible(Boolean(entries[0]?.isIntersecting)),{threshold:.12});
    observer.observe(root);
    return ()=>observer.disconnect();
  },[]);
  useEffect(()=>{
    const update=()=>setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange",update);
    return ()=>document.removeEventListener("visibilitychange",update);
  },[]);
  useEffect(()=>{
    if(!visible||reduced||paused||!pageVisible)return;
    const timer=window.setTimeout(()=>{
      if(step<2)setStep(n=>n+1);
      else{setActive(n=>(n+1)%audiences.length);setStep(0);}
    },step===2?3700:2350);
    return ()=>window.clearTimeout(timer);
  },[active,step,visible,reduced,paused,pageVisible,replay]);
  const choose=(index:number)=>{setActive(index);setStep(0);setReplay(n=>n+1);};
  const current=audiences[active];
  return (
    <div className={"vv-aud-layout vv-aud-v3"+(paused?" is-paused":"")} ref={rootRef}
      onMouseEnter={()=>setInteracting(true)} onMouseLeave={()=>setInteracting(false)}
      onFocusCapture={()=>setInteracting(true)}
      onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node|null))setInteracting(false);}}>
      <div className="vv-aud-selector">
        <span className="vv-label">THE PEOPLE WE CREATE WITH / 003</span>
        <h2 className="vv-section-h">Every story<br/>has its people.</h2>
        <p className="vv-aud-intro">We create with individuals, founders and businesses at every stage. Find where your world meets our creative perspective.</p>
        <div className="vv-aud-choice-list" aria-label="Choose who Visual Verse works with">
          {audiences.map((item,index)=>{
            const Icon=item.Icon, selected=active===index;
            return (
              <button type="button" key={item.title} onClick={()=>choose(index)}
                className={"vv-aud-option"+(selected?" is-selected":"")}
                aria-pressed={selected}
                onKeyDown={event=>{if(["ArrowDown","ArrowUp","ArrowRight","ArrowLeft"].includes(event.key)){event.preventDefault();choose((index+(event.key==="ArrowDown"||event.key==="ArrowRight"?1:-1)+audiences.length)%audiences.length);}}}
              >
                <span className="vv-aud-option-icon"><Icon size={20} strokeWidth={1.7} aria-hidden={true}/></span>
                <span className="vv-aud-option-copy"><strong>{item.title}</strong><small>{item.subtitle}</small></span>
                <span className="vv-aud-option-action">{selected?<span className="vv-aud-active-lines">≋</span>:<ChevronRight size={18} aria-hidden={true}/>}</span>
                {selected&&!reduced&&visible&&<span className="vv-aud-option-progress" key={"progress-"+index+"-"+replay} aria-hidden={true}/>}
              </button>
            );
          })}
        </div>
        <a href="/who-we-serve.html#industries" className="vv-aud-discover">Discover who we create with <span><ArrowUpRight size={18} aria-hidden={true}/></span></a>
      </div>
      <div className="vv-aud-display" onPointerMove={event=>{
        if(event.pointerType!=="mouse")return;
        const b=event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty("--vv-aud-mouse-x",((event.clientX-b.left-b.width/2)/b.width*9)+"px");
        event.currentTarget.style.setProperty("--vv-aud-mouse-y",((event.clientY-b.top-b.height/2)/b.height*9)+"px");
      }} onPointerLeave={event=>{
        event.currentTarget.style.setProperty("--vv-aud-mouse-x","0px");
        event.currentTarget.style.setProperty("--vv-aud-mouse-y","0px");
      }}>
        <AnimatePresence mode="wait">
          <motion.article key={active+"-"+replay}
            className="vv-aud-stage"
            initial={{opacity:0,y:12,scale:0.99}}
            animate={{opacity:1,y:0,scale:1}}
            exit={{opacity:0,y:-10,scale:0.99}}
            transition={{duration:0.35,ease:[0.22,1,0.36,1]}}>
            <div className="vv-aud-stage-head">
              <div><span className="vv-aud-stage-kicker vv-aud-live-pill"><span className="vv-aud-live-dot"/>{current.kicker}</span><h3>{current.title}</h3><p>{current.detail}</p></div>
              <span className="vv-aud-stage-number">{String(active+1).padStart(2,"0")} / 04</span>
            </div>
            <div className="vv-aud-showcase" data-step={step} aria-label={"Creative transformation concept for "+current.title}>
              <div className="vv-aud-showcase-side vv-aud-showcase-before">
                <div className="vv-aud-showcase-label"><span>01</span> THE STARTING POINT</div>
                <StartingPoint kind={current.kind}/>
                <div className="vv-aud-showcase-end">Where the story begins</div>
              </div>
              <span className="vv-aud-showcase-arrow" aria-hidden="true"><ArrowRight size={18}/></span>
              <div className="vv-aud-showcase-side vv-aud-showcase-after">
                <div className="vv-aud-showcase-label"><span>02</span> CREATED TOGETHER <Sparkles size={13}/></div>
                <AudienceArtwork kind={current.kind}/>
                <div className="vv-aud-showcase-end"><Check size={12}/>{outcomeLabels[current.kind]}</div>
              </div>
            </div>
            <div className="vv-aud-journey" aria-label="Explore this creative journey">
              {journeySteps[current.kind].map((label,index)=><button type="button" key={label}
                className={(step===index?"is-active":index<step?"is-done":"")}
                aria-current={step===index?"step":undefined}
                onClick={()=>setStep(index)}>
                <span className="vv-aud-step-num">{index<step?<Check size={12}/>:String(index+1).padStart(2,"0")}</span>
                <span>{label}</span>
              </button>)}
            </div>
            <div className="vv-aud-stage-bottom">
              <span><span className="vv-aud-live-dot"/> ORIGINAL INTERACTIVE CONCEPT / VISUAL VERSE</span>
              <div className="vv-aud-stage-bottom-tools">
                <button type="button" className="vv-aud-restart" onClick={()=>{setStep(0);setReplay(n=>n+1);}} aria-label="Replay audience animation"><RotateCcw size={13}/> Replay</button>
                <a href="/who-we-serve.html#industries" className="vv-aud-stage-collection-link">DISCOVER MORE <ArrowUpRight size={14} aria-hidden={true}/></a>
              </div>
            </div>
          </motion.article>
        </AnimatePresence>
        <button type="button" className="vv-aud-auto" aria-label={manualPaused?"Enable automatic animation":"Disable automatic animation"} onClick={()=>setManualPaused(p=>!p)}>
          {manualPaused?<Play size={13}/>:<Pause size={13}/>} {manualPaused?"Autoplay off":"Autoplay on"}
        </button>
      </div>
    </div>
  );
}
