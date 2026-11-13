import { useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight, ArrowUpRight, BarChart3, Building2, CalendarDays, Camera,
  Check, ChevronLeft, ChevronRight, CirclePause, CirclePlay, Clapperboard,
  Heart, LayoutGrid, MonitorSmartphone, MousePointer2, Palette, Play,
  RotateCcw, Rocket, Sparkles, WandSparkles
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import "../audiences-live.css";

type AudienceKind = "brands" | "business" | "creators" | "events";
type Audience = {
  title: string;
  subtitle: string;
  description: string;
  kicker: string;
  Icon: LucideIcon;
  kind: AudienceKind;
  steps: [string, string, string];
};
const audiences: Audience[] = [
  { title:"Growing brands", subtitle:"Make your story impossible to miss", description:"From the first rough sketch to a memorable identity, we create the visual language that makes you unmistakable.", kicker:"IDENTITY / BRAND CAMPAIGNS", kind:"brands", Icon:Sparkles, steps:["The first spark", "Find the look", "Make it unforgettable"] },
  { title:"Businesses & teams", subtitle:"Make every touchpoint work together", description:"Campaigns, presentations, social content and digital experiences — designed as one clear, confident story.", kicker:"CAMPAIGNS / BUSINESS DESIGN", kind:"business", Icon:Building2, steps:["The messy brief", "Connect the channels", "See the full picture"] },
  { title:"Creators & founders", subtitle:"See the idea become a real experience", description:"We turn bold ideas into intuitive digital products, memorable launches and creative platforms made for people.", kicker:"UI/UX / WEB / LAUNCH", kind:"creators", Icon:Rocket, steps:["A big idea", "A working prototype", "Ready to launch"] },
  { title:"People & events", subtitle:"Life happens. We make it live on.", description:"Portraits, celebrations and events come to life through intentional photography, moving images and film.", kicker:"PHOTOGRAPHY / FILM", kind:"events", Icon:CalendarDays, steps:["Set the scene", "Capture the moment", "Relive the story"] },
];
const accentColors = ["#2ec4b6", "#f4ac70", "#b0a1eb"] as const;

function StepCounter({ step }: {step:number}) {
  return <span className="vv-live-progress-counter" aria-hidden="true"><b>{String(step+1).padStart(2,"0")}</b> / 03</span>;
}

/** Each scene has its own animation vocabulary, graphics, and interactive controls. */
function BrandScene({step, reduced}:{step:number; reduced:boolean}) {
  const [color,setColor] = useState(0);
  const style = {"--vv-live-accent":accentColors[color]} as CSSProperties;
  return <div className={`vv-live-scene vv-live-brand is-step-${step}`} style={style}>
    <div className="vv-live-scene-bar"><span className="vv-live-scene-dots"><i/><i/><i/></span><span>identity-lab.fig / <b>LIVE CANVAS</b></span><LayoutGrid size={13}/></div>
    <div className="vv-live-brand-board">
      <div className="vv-live-brand-rulers" aria-hidden="true"/>
      <div className="vv-live-brand-editor">
        <span className="vv-live-brand-faint">VISUAL DIRECTION / CONCEPT 01</span>
        <div className="vv-live-brand-lockup">
          <motion.div className="vv-live-brand-emblem" animate={reduced?{}:{rotate:[-10,0,0,8,-10],scale:[.93,1.04,1,.98,.93]}} transition={{duration:6.5,repeat:Infinity,ease:"easeInOut"}}>
            <svg viewBox="0 0 100 100" role="img" aria-label="Animated abstract brand symbol"><path className="vv-live-brand-ink" d="M50 10 88 30 88 70 50 90 12 70 12 30Z"/><path className="vv-live-brand-ink vv-live-brand-ink-inner" d="M30 29 50 66 70 29M31 68 50 80 69 68"/></svg>
          </motion.div>
          <div className="vv-live-brand-typography"><span>THE NEXT CHAPTER</span><strong>MAKE<br/><em>IT</em> MATTER.</strong><small>BRAND STORIES / CREATED WITH PURPOSE</small></div>
        </div>
        <div className="vv-live-brand-guides" aria-hidden="true"><span/><span/><span/></div>
        <div className="vv-live-brand-cursor" aria-hidden="true"><MousePointer2 size={16} fill="var(--vv-live-accent)"/><span>DESIGNING...</span></div>
        <div className="vv-live-brand-sticker">GOOD IDEAS<br/>LOOK BETTER<br/><b>TOGETHER ✳</b></div>
      </div>
      <div className="vv-live-brand-swatches"><span>TRY A PALETTE</span><div>{accentColors.map((c,i)=><button key={c} type="button" aria-label={`Try brand palette ${i+1}`} aria-pressed={color===i} onClick={()=>setColor(i)} className={color===i?"is-active":""} style={{background:c}}/>)}</div></div>
    </div>
    <div className="vv-live-scene-status"><span className="vv-live-blink"/> {step===0?"Sketching directions":step===1?"Identity coming together":"Campaign visual in motion"}<StepCounter step={step}/></div>
  </div>;
}

const channels = ["Social","Web","Print"] as const;
function BusinessScene({step,reduced}:{step:number;reduced:boolean}) {
  const [channel,setChannel] = useState(0);
  const values = [[32,48,40,63,54,73,67],[40,53,45,62,57,77,82],[24,42,35,56,70,66,85]][channel];
  return <div className={`vv-live-scene vv-live-business is-step-${step}`}>
    <div className="vv-live-scene-bar"><span className="vv-live-scene-dots"><i/><i/><i/></span><span>campaign-studio / <b>SYNCED</b></span><BarChart3 size={13}/></div>
    <div className="vv-live-biz-app">
      <div className="vv-live-biz-sidebar"><span className="vv-live-biz-logo">V<span>V</span></span><LayoutGrid size={15}/><Palette size={15}/><BarChart3 size={15}/><span className="vv-live-biz-sidebar-bottom">●</span></div>
      <div className="vv-live-biz-body">
        <header><div><small>VISUAL VERSE / CAMPAIGN WORKSPACE</small><h4>Everything, in sync<span>.</span></h4></div><span className="vv-live-biz-sync"><i/> LIVE PREVIEW</span></header>
        <div className="vv-live-biz-tabs" aria-label="Switch campaign channel">{channels.map((v,i)=><button key={v} type="button" className={i===channel?"is-active":""} aria-pressed={i===channel} onClick={()=>setChannel(i)}>{v}</button>)}</div>
        {step===0?<div className="vv-live-biz-brief" aria-label="Animated incoming business brief">
            <div className="vv-live-biz-brief-note"><span>01 / INBOX</span><strong>One business.<br/>Too many messages.</strong><small>Slides, posts, campaigns and web pages — not yet connected.</small></div>
            <div className="vv-live-biz-brief-postit">SOCIAL POSTS <i/><i/></div>
            <div className="vv-live-biz-brief-postit">PRESENTATION <i/><i/></div>
            <div className="vv-live-biz-brief-postit">WEBSITE <i/><i/></div>
            <div className="vv-live-biz-brief-mouse"><MousePointer2 size={16}/><span>LET'S CONNECT THIS</span></div>
          </div>:<div className="vv-live-biz-grid">
          <motion.div className="vv-live-biz-preview" key={channel} initial={{opacity:.3,y:9}} animate={{opacity:1,y:0}} transition={{duration:.4}}>
            <span className="vv-live-biz-card-top">{channels[channel].toUpperCase()} / ART DIRECTION <Sparkles size={12}/></span>
            <div className="vv-live-biz-post"><span>GOOD IDEAS<br/><b>GO PLACES.</b></span><i/><i/><i/></div>
            <div className="vv-live-biz-post-bottom"><span/><span/><span/></div>
          </motion.div>
          <div className="vv-live-biz-insights"><span>CREATIVE MOMENTUM <i>↗</i></span><div className="vv-live-biz-graph" aria-label="Animated illustrative campaign chart">{values.map((n,i)=><motion.i key={`${channel}-${i}`} initial={{height:"7%"}} animate={reduced?{height:`${n}%`}:{height:[`${n}%`,`${Math.min(n+13,94)}%`,`${n}%`]}} transition={{duration:2.4,delay:i*.11,repeat:reduced?0:Infinity,ease:"easeInOut"}}/>)}</div><div className="vv-live-biz-insight-footer"><span>ILLUSTRATIVE / NO LIVE METRICS</span><b>DESIGN IN MOTION</b></div></div>
        </div>}
        <div className="vv-live-biz-flow"><span>BRIEF</span><i/><span>DESIGN</span><i/><span>DELIVERY</span><b className="vv-live-biz-flow-dot"/></div>
      </div>
    </div>
    <div className="vv-live-scene-status"><span className="vv-live-blink"/>{step===0?"Untangling the brief":step===1?"Creative channels syncing":"Every touchpoint connected"}<StepCounter step={step}/></div>
  </div>;
}

const appTabs = ["Discover","Saved","Profile"] as const;
function FounderScene({step,reduced}:{step:number;reduced:boolean}) {
  const [tab,setTab] = useState(0);
  const [saved,setSaved] = useState(false);
  return <div className={`vv-live-scene vv-live-founder is-step-${step}`}>
    <div className="vv-live-scene-bar"><span className="vv-live-scene-dots"><i/><i/><i/></span><span>prototype / <b>INTERACTIVE</b></span><MonitorSmartphone size={13}/></div>
    <div className="vv-live-founder-stage">
      <div className="vv-live-founder-orbit" aria-hidden="true"/><span className="vv-live-founder-float vv-live-founder-float-a"><WandSparkles size={14}/> IDEA → EXPERIENCE</span><span className="vv-live-founder-float vv-live-founder-float-b">DESIGN SYSTEM / 01 <i/></span>
      <motion.div className="vv-live-founder-phone" animate={reduced?{}:{y:[-3,4,-3],rotate:[-2,0,-2]}} transition={{duration:5,repeat:Infinity,ease:"easeInOut"}}>
        <div className="vv-live-founder-notch"/>
        <div className="vv-live-founder-screen">
          <div className="vv-live-founder-app-head"><span>YOUR NEXT IDEA<span>.</span></span><b>◉</b></div>
          {step===0?<div className="vv-live-founder-wire" aria-label="Animated prototype wireframes"><div className="vv-live-wire-large"/><div/><div/><span/><span/><i>WIREFRAME →</i></div>:
          tab===2?<div className="vv-live-founder-profile"><div className="vv-live-founder-avatar">V</div><strong>Creative energy.</strong><small>A place for the ideas you love.</small><span>Designed to be yours.</span></div>:
          tab===1?<div className="vv-live-founder-saved"><Heart size={26} fill={saved?"#2ec4b6":"none"}/><strong>{saved?"Added to your collection":"Nothing saved yet"}</strong><small>Tap the heart on Discover to try the prototype.</small></div>:
          <div className="vv-live-founder-discover"><div className="vv-live-founder-hero-card"><span>DISCOVER SOMETHING NEW</span><strong>Built for<br/>the curious.</strong><div className="vv-live-founder-hero-orbit"/><button type="button" aria-label={saved?"Remove demo item from saved":"Save demo item"} onClick={()=>setSaved(v=>!v)}><Heart size={15} fill={saved?"currentColor":"none"}/></button></div><small>YOUR CREATIVE WORLD</small><div className="vv-live-founder-mini-cards"><i/><i/><i/></div></div>}
          <nav className="vv-live-founder-tabs" aria-label="Try the mobile prototype">{appTabs.map((t,i)=><button key={t} type="button" aria-pressed={i===tab} onClick={()=>setTab(i)} className={i===tab?"is-active":""}>{t}</button>)}</nav>
        </div>
      </motion.div>
      <div className="vv-live-founder-outline"><span>PROTOTYPE STATUS</span><b>{step===0?"Mapping the idea":step===1?"Ready to explore":"Launch-ready design"}</b><div><i/><i/><i/></div><small>{step===0?"Wireframes in progress":step===1?"Tap tabs and save an idea":"A real, clickable experience"}</small></div>
      <div className="vv-live-founder-rocket" aria-hidden="true"><Rocket size={20}/></div>
    </div>
    <div className="vv-live-scene-status"><span className="vv-live-blink"/>{step===0?"Wireframes are taking shape":step===1?"Try the working app controls":"Experience ready for launch"}<StepCounter step={step}/></div>
  </div>;
}

const scenes = ["OPENING MOMENT","THE CELEBRATION","THE FINALE"] as const;
function EventScene({step,reduced}:{step:number;reduced:boolean}) {
  const [frame,setFrame] = useState(0);
  const [flash,setFlash] = useState(0);
  useEffect(()=>{if(reduced)return;const id=window.setInterval(()=>setFrame(v=>(v+1)%3),1900);return ()=>window.clearInterval(id)},[reduced]);
  return <div className={`vv-live-scene vv-live-event is-step-${step}`}>
    <div className="vv-live-scene-bar"><span className="vv-live-scene-dots"><i/><i/><i/></span><span>film-studio / <b>RECORDING</b></span><Clapperboard size={13}/></div>
    <div className="vv-live-event-editor">
      <div className="vv-live-event-monitor">
        <div className="vv-live-event-monitor-head"><span><i/> LIVE VIEW / SCENE {String(frame+1).padStart(2,"0")}</span><span>REC ●</span></div>
        {step===2?<div className="vv-live-event-final-cut" aria-label="Continuously animated edited film montage">
          <div className="vv-live-event-final-title"><span>VISUAL VERSE / ORIGINAL FILM</span><b>THE MOMENTS<br/>THAT MATTER.</b><small>STORIES WORTH KEEPING / PLAYING NOW</small></div>
          <div className="vv-live-event-final-frames"><i/><i/><i/></div>
          <div className="vv-live-event-final-sheen"/>
        </div>:<div className={`vv-live-event-picture vv-live-event-picture-${frame}`}>
          <div className="vv-live-event-lights"><i/><i/><i/><i/><i/></div>
          <div className="vv-live-event-figures"><i/><i/><i/><i/><i/></div>
          <div className="vv-live-event-viewfinder"><i/><i/><i/><i/></div>
          <div className="vv-live-event-focus"/><div key={flash} className={flash?"vv-live-event-flash":""}/>
          <div className="vv-live-event-scene-name">{scenes[frame]}</div>
        </div>}
        <div className="vv-live-event-camera-tools"><span>4K / 24 FPS</span><button type="button" aria-label="Take a demo photo" onClick={()=>setFlash(n=>n+1)}><Camera size={14}/> SNAP A FRAME</button><span>COLOR / VV</span></div>
      </div>
      <div className="vv-live-event-timeline"><div className="vv-live-event-track-title"><span>YOUR STORY, IN MOTION</span><span>FILM / EDIT / KEEP</span></div><div className="vv-live-event-clips">{[0,1,2,0,1,2].map((n,i)=><div key={i} className={`vv-live-event-clip vv-live-event-clip-${n}`}><span>{String(i+1).padStart(2,"0")}</span></div>)}<i className="vv-live-event-playhead"/></div><div className="vv-live-event-audio">{Array.from({length:28},(_,i)=><i key={i} style={{height:`${7+((i*37)%21)}px`}}/> )}</div></div>
    </div>
    <div className="vv-live-scene-status"><span className="vv-live-blink"/>{step===0?"Finding the perfect frame":step===1?"Moments captured in motion":"Your story, beautifully edited"}<StepCounter step={step}/></div>
  </div>;
}

function ActiveScene({kind,step,reduced}:{kind:AudienceKind;step:number;reduced:boolean}) {
  switch(kind){
    case "brands":return <BrandScene step={step} reduced={reduced}/>;
    case "business":return <BusinessScene step={step} reduced={reduced}/>;
    case "creators":return <FounderScene step={step} reduced={reduced}/>;
    case "events":return <EventScene step={step} reduced={reduced}/>;
  }
}

export function VisualVerseAudiences() {
  const [active,setActive]=useState(0);
  const [step,setStep]=useState(0);
  const [cycle,setCycle]=useState(0);
  const [paused,setPaused]=useState(false);
  const [visible,setVisible]=useState(false);
  const [pageVisible,setPageVisible]=useState(true);
  const [reduced,setReduced]=useState(false);
  const rootRef=useRef<HTMLDivElement>(null);
  const optionRefs=useRef<(HTMLButtonElement|null)[]>([]);
  useEffect(()=>{
    const media=window.matchMedia("(prefers-reduced-motion: reduce)");
    const update=()=>setReduced(media.matches);
    update();media.addEventListener("change",update);return ()=>media.removeEventListener("change",update);
  },[]);
  useEffect(()=>{
    const el=rootRef.current;if(!el)return;
    const observer=new IntersectionObserver(e=>setVisible(Boolean(e[0]?.isIntersecting)),{threshold:.16});
    observer.observe(el);return ()=>observer.disconnect();
  },[]);
  useEffect(()=>{
    const update=()=>setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange",update);return ()=>document.removeEventListener("visibilitychange",update);
  },[]);
  useEffect(()=>{
    if(paused||reduced||!visible||!pageVisible)return;
    const id=window.setTimeout(()=>{
      if(step<2){setStep(v=>v+1);}else{setStep(0);setActive(v=>(v+1)%audiences.length);}
    },step===2?3800:2900);
    return ()=>window.clearTimeout(id);
  },[active,step,cycle,paused,reduced,visible,pageVisible]);
  const choose=(n:number)=>{setActive(n);setStep(0);setCycle(v=>v+1);};
  const onArrow=(event:KeyboardEvent<HTMLButtonElement>,i:number)=>{
    if(!["ArrowDown","ArrowRight","ArrowUp","ArrowLeft"].includes(event.key))return;
    event.preventDefault();const direction=event.key==="ArrowDown"||event.key==="ArrowRight"?1:-1;
    const next=(i+direction+audiences.length)%audiences.length;choose(next);optionRefs.current[next]?.focus();
  };
  const current=audiences[active];
  return <div className="vv-aud-layout vv-aud-live" ref={rootRef}>
    <div className="vv-aud-selector">
      <span className="vv-label">THE PEOPLE WE CREATE WITH / 003</span>
      <h2 className="vv-section-h">Every story<br/>has its people.</h2>
      <p className="vv-aud-intro">Different people. Different ambitions. A different creative journey each time. Explore who we create with.</p>
      <div className="vv-aud-choice-list" aria-label="Choose your audience">
        {audiences.map((a,i)=>{
          const Icon=a.Icon;return <button type="button" key={a.kind} ref={node=>{optionRefs.current[i]=node}} aria-pressed={active===i} onClick={()=>choose(i)} onKeyDown={e=>onArrow(e,i)} className={`vv-aud-option${active===i?" is-selected":""}`}>
            <span className="vv-aud-option-icon"><Icon size={20} strokeWidth={1.8} aria-hidden="true"/></span>
            <span className="vv-aud-option-copy"><strong>{a.title}</strong><small>{a.subtitle}</small></span>
            <span className="vv-aud-option-action">{active===i?<span className="vv-live-eq" aria-hidden="true"><i/><i/><i/><i/></span>:<ChevronRight size={18} aria-hidden="true"/>}</span>
            {active===i&&!paused&&!reduced&&visible&&<span key={`line-${i}-${cycle}`} className="vv-live-option-timer" aria-hidden="true"/>}
          </button>
        })}
      </div>
      <a className="vv-aud-discover" href="/who-we-serve.html#industries">Discover who we create with <span><ArrowUpRight size={18} aria-hidden="true"/></span></a>
    </div>
    <div className="vv-aud-display vv-live-display">
      <div className="vv-live-topline"><span><span className="vv-live-blink"/> LIVE CREATIVE EXPERIENCE</span><span>SELECT AN AUDIENCE TO EXPLORE <MousePointer2 size={12}/></span></div>
      <div className="vv-aud-stage vv-live-stage">
        <div className="vv-aud-stage-head"><div><span className="vv-aud-stage-kicker">{current.kicker}</span><AnimatePresence mode="wait"><motion.h3 key={current.kind} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-7}} transition={{duration:.26}}>{current.title}</motion.h3></AnimatePresence><p>{current.description}</p></div><span className="vv-aud-stage-number">{String(active+1).padStart(2,"0")} / 04</span></div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={current.kind} className="vv-live-scene-host" onClickCapture={event=>{if((event.target as HTMLElement).closest("button"))setPaused(true);}} initial={{opacity:0,x:38,filter:"blur(7px)"}} animate={{opacity:1,x:0,filter:"blur(0px)"}} exit={{opacity:0,x:-30,filter:"blur(6px)"}} transition={{duration:reduced?0:.44,ease:[.22,1,.36,1]}}>
            <ActiveScene kind={current.kind} step={step} reduced={reduced}/>
          </motion.div>
        </AnimatePresence>
        <div className="vv-live-steps" role="group" aria-label={`Creative journey for ${current.title}`}>
          {current.steps.map((label,i)=><button type="button" key={`${current.kind}-${label}`} onClick={()=>{setStep(i);setCycle(v=>v+1);}} aria-current={step===i?"step":undefined} className={step===i?"is-active":step>i?"is-done":""}><span>{step>i?<Check size={12}/>:String(i+1).padStart(2,"0")}</span><small>{label}</small></button>)}
        </div>
        <div className="vv-aud-stage-bottom vv-live-bottom"><span>ORIGINAL ANIMATED CONCEPTS / VISUAL VERSE</span><div><button type="button" onClick={()=>{setStep(0);setCycle(v=>v+1);}}><RotateCcw size={13}/> Replay</button><button type="button" onClick={()=>setPaused(v=>!v)} aria-pressed={paused}>{paused?<CirclePlay size={14}/>:<CirclePause size={14}/>} {paused?"Resume autoplay":"Pause autoplay"}</button><a href="/who-we-serve.html#industries" aria-label="Discover more about who we serve"><ArrowUpRight size={17}/></a></div></div>
      </div>
    </div>
  </div>;
}