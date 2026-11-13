import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRight, ArrowRight, Sparkles, Building2, Rocket, Camera,
  RefreshCw, Check, Play, MousePointer2, Palette, PenTool, Globe2,
  MonitorSmartphone, Clapperboard, Heart, CircleDot, Instagram, Film,
  Aperture, Zap, ChevronRight, Mic2, Smartphone, MousePointerClick
} from "lucide-react";
import "../audiences-creative.css";

type Kind = "brands" | "business" | "creators" | "events";
const categories = [
  { kind:"brands" as const, title:"Growing brands", line:"Identity with a pulse.", Icon:Sparkles, number:"01" },
  { kind:"business" as const, title:"Businesses & teams", line:"One story. Every channel.", Icon:Building2, number:"02" },
  { kind:"creators" as const, title:"Creators & founders", line:"Big ideas, brought to life.", Icon:Rocket, number:"03" },
  { kind:"events" as const, title:"People & events", line:"The moment, forever.", Icon:Camera, number:"04" }
];

const brandMoods = [
  { label:"BOLD", bg:"#003f5c", fg:"#a3f4d8", accent:"#2ec4b6", word:"UNMISSABLE.", sub:"Built to turn heads." },
  { label:"PLAYFUL", bg:"#e8dafa", fg:"#4e296d", accent:"#e76194", word:"DIFFERENT.", sub:"Made to be remembered." },
  { label:"ELECTRIC", bg:"#f6d56b", fg:"#283e46", accent:"#f36d42", word:"FEARLESS.", sub:"A little louder. A lot more you." }
];

function BrandUniverse({active}:{active:boolean}) {
  const [mood,setMood]=useState(0);
  const [remix,setRemix]=useState(0);
  const m=brandMoods[mood];
  useEffect(()=>{ if(!active)return; const id=window.setInterval(()=>setRemix(v=>v+1),4200);return ()=>clearInterval(id);},[active]);
  return <div className="vvcr-brand vvcr-scene" style={{"--scene-bg":m.bg,"--scene-fg":m.fg,"--scene-accent":m.accent} as React.CSSProperties}>
    <div className="vvcr-brand-grid" aria-hidden="true"/>
    <div className="vvcr-scene-top"><span className="vvcr-live"><i/> IDENTITY EXPERIMENT / LIVE</span><span>CREATIVE LAB NO. 01</span></div>
    <div className="vvcr-brand-orbit" aria-hidden="true"><span/><span/><span/><b>✳</b></div>
    <div className="vvcr-brand-cross vvcr-brand-cross-one" aria-hidden="true">✣</div>
    <div className="vvcr-brand-cross vvcr-brand-cross-two" aria-hidden="true">✳</div>
    <div className="vvcr-brand-content">
      <div className="vvcr-brand-tiny">YOUR BRAND, BUT WITH FEELING. <span>↗</span></div>
      <div className="vvcr-brand-word-wrap"><AnimatePresence mode="wait"><motion.strong key={mood+"-"+remix} className="vvcr-brand-word" initial={{y:75,opacity:0,rotate:-5,filter:"blur(12px)"}} animate={{y:0,opacity:1,rotate:0,filter:"blur(0px)"}} exit={{y:-65,opacity:0,rotate:5,filter:"blur(10px)"}} transition={{duration:.67,ease:[.2,.95,.2,1]}}>{m.word}</motion.strong></AnimatePresence></div>
      <span className="vvcr-brand-underline"/><p>{m.sub}</p>
      <div className="vvcr-brand-stamp" aria-hidden="true">GOOD IDEAS<br/>LOOK GOOD<br/>ON YOU. <Sparkles size={22}/></div>
    </div>
    <div className="vvcr-brand-toolbar">
      <div><small>CHANGE THE VIBE</small><div className="vvcr-brand-swatches" role="group" aria-label="Choose a brand design palette">{brandMoods.map((s,i)=><button type="button" key={s.label} className={"vvcr-brand-swatch"+(mood===i?" active":"")} style={{background:s.bg,color:s.fg}} aria-label={s.label+" colour palette"} aria-pressed={mood===i} onClick={()=>{setMood(i);setRemix(v=>v+1)}}><span>{s.label.slice(0,1)}</span></button>)}</div></div>
      <button type="button" className="vvcr-scene-btn vvcr-brand-remix" onClick={()=>{setMood(v=>(v+1)%brandMoods.length);setRemix(v=>v+1)}}><RefreshCw size={15}/> REMIX IDENTITY</button>
    </div>
  </div>;
}

const signals = [
  {label:"Brand", detail:"A distinctive voice", Icon:Sparkles},
  {label:"Digital", detail:"An experience that connects", Icon:Globe2},
  {label:"Campaigns", detail:"Creative that travels", Icon:Zap},
  {label:"Film", detail:"Stories people feel", Icon:Clapperboard}
];
function BusinessUniverse({active}:{active:boolean}) {
  const [focus,setFocus]=useState(0);
  const [playing,setPlaying]=useState(true);
  useEffect(()=>{if(!active||!playing)return;const id=window.setInterval(()=>setFocus(v=>(v+1)%4),2800);return ()=>clearInterval(id);},[active,playing]);
  return <div className="vvcr-business vvcr-scene">
    <div className="vvcr-business-grid" aria-hidden="true"/>
    <div className="vvcr-scene-top"><span className="vvcr-live"><i/> THE CREATIVE ECOSYSTEM / LIVE</span><span>CONNECTED BY DESIGN</span></div>
    <div className="vvcr-business-head"><span>ONE STRONG STORY.</span><strong>EVERYWHERE<br/><em>IT MATTERS.</em></strong></div>
    <div className="vvcr-business-network" aria-label="Interactive creative network. Select each touchpoint to explore it.">
      <svg viewBox="0 0 640 350" className="vvcr-business-lines" aria-hidden="true" preserveAspectRatio="xMidYMid meet"><path d="M320 175 L100 80 M320 175 L548 86 M320 175 L110 292 M320 175 L535 286"/><path className="vvcr-business-running" d="M320 175 L100 80 M320 175 L548 86 M320 175 L110 292 M320 175 L535 286"/></svg>
      <div className="vvcr-business-core"><span className="vvcr-business-spin"/><span className="vvcr-business-spin second"/><Sparkles size={34} strokeWidth={1.4}/><small>VISUAL<br/>VERSE</small></div>
      {signals.map((s,i)=>{const I=s.Icon;return <button type="button" key={s.label} onClick={()=>{setFocus(i);setPlaying(false)}} className={"vvcr-signal vvcr-signal-"+i+(focus===i?" active":"")} aria-pressed={focus===i}><span className="vvcr-signal-icon"><I size={20}/></span><span>{s.label}</span><i/></button>})}
    </div>
    <div className="vvcr-business-footer"><div><small>NOW EXPLORING</small><AnimatePresence mode="wait"><motion.strong key={focus} initial={{opacity:0,x:18}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-18}} transition={{duration:.22}}>{signals[focus].detail}</motion.strong></AnimatePresence></div><button type="button" onClick={()=>setPlaying(v=>!v)}><CircleDot size={15}/> {playing?"PAUSE THE TOUR":"RESUME THE TOUR"}</button></div>
  </div>;
}

const buildModes = ["IDEA", "PROTOTYPE", "LAUNCH"] as const;
function CreatorsUniverse({active}:{active:boolean}) {
  const [screen,setScreen]=useState(0);
  const [saved,setSaved]=useState(false);
  useEffect(()=>{if(!active)return;const id=window.setInterval(()=>setScreen(v=>(v+1)%3),5000);return ()=>clearInterval(id);},[active]);
  return <div className="vvcr-creators vvcr-scene">
    <div className="vvcr-scene-top"><span className="vvcr-live"><i/> THE IDEA PLAYGROUND / LIVE</span><span>DRAG IDEAS INTO REALITY ↗</span></div>
    <div className="vvcr-creators-grid" aria-hidden="true"/>
    <div className="vvcr-creators-word" aria-hidden="true">WHAT<br/>IF?</div>
    <div className="vvcr-creators-scribble" aria-hidden="true">↝</div>
    <div className="vvcr-creators-sticker vvcr-creators-sticker-one"><Sparkles size={14}/> MAKE SOMETHING NEW</div>
    <div className="vvcr-creators-sticker vvcr-creators-sticker-two">IDEA → INTERNET <Rocket size={15}/></div>
    <div className="vvcr-creators-phone">
      <div className="vvcr-creators-phone-top"><span>● ● ●</span><span>VISUAL VERSE / LAB</span><span>•••</span></div>
      <AnimatePresence mode="wait"><motion.div key={screen} className="vvcr-creators-screen" initial={{opacity:0,y:30,scale:.91}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-23,scale:.95}} transition={{duration:.42,ease:[.16,1,.3,1]}}>
        {screen===0?<><div className="vvcr-phone-tag">✦ YOUR NEXT BIG IDEA</div><h3>Make it<br/><em>happen.</em></h3><div className="vvcr-phone-doodle"><span/><span/><span/><i>✳</i></div><p>Every great thing starts somewhere.</p><button type="button" onClick={()=>setScreen(1)}>START BUILDING <ArrowUpRight size={13}/></button></>:
        screen===1?<><div className="vvcr-phone-tag">◈ WORK IN PROGRESS</div><h3>Watch it<br/><em>come alive.</em></h3><div className="vvcr-phone-wireframe"><div/><section><span/><span/><span/></section><small/><small/></div><p>Shapes, screens and a little magic.</p><button type="button" onClick={()=>setScreen(2)}>PREVIEW THE IDEA <ArrowUpRight size={13}/></button></>:
        <><div className="vvcr-phone-tag">↗ READY FOR THE WORLD</div><h3>It’s<br/><em>alive!</em></h3><div className="vvcr-phone-success"><Rocket size={37}/><div className="vvcr-phone-success-orbit"/></div><p>{saved?"Saved to your inspiration board.":"This is what possible looks like."}</p><button type="button" onClick={()=>setSaved(v=>!v)}><Heart size={13} fill={saved?"currentColor":"none"}/> {saved?"SAVED TO YOUR BOARD":"SAVE THIS IDEA"}</button></>}
      </motion.div></AnimatePresence>
      <div className="vvcr-creators-home-indicator"/>
    </div>
    <div className="vvcr-creators-toolbar" role="group" aria-label="Prototype journey">{buildModes.map((m,i)=><button key={m} type="button" className={i===screen?"active":""} aria-pressed={i===screen} onClick={()=>setScreen(i)}><span>{String(i+1).padStart(2,"0")}</span>{m}</button>)}</div>
  </div>;
}

const memories=[
  { title:"THE BIG DAY.", sub:"The joy you could feel.", tone:"gold" },
  { title:"WE WERE HERE.", sub:"The people who made it.", tone:"peach" },
  { title:"WHAT A NIGHT.", sub:"The moments that stay.", tone:"indigo" },
  { title:"FOREVER YOURS.", sub:"Made to remember.", tone:"mint" }
];
function EventUniverse({active}:{active:boolean}) {
  const [scene,setScene]=useState(0);
  const [captured,setCaptured]=useState<number[]>([]);
  const [flash,setFlash]=useState(false);
  const [play,setPlay]=useState(true);
  useEffect(()=>{if(!active||!play)return;const id=window.setInterval(()=>setScene(v=>(v+1)%memories.length),4100);return ()=>clearInterval(id);},[active,play]);
  const capture=()=>{setFlash(true);setCaptured(list=>[scene,...list].slice(0,3));window.setTimeout(()=>setFlash(false),360);};
  const m=memories[scene];
  return <div className={"vvcr-events vvcr-scene vvcr-events-"+m.tone}>
    <div className="vvcr-scene-top"><span className="vvcr-live"><i/> ROLL CAMERA / LIVE</span><span>REC <span className="vvcr-rec-dot">●</span> 00:0{scene+1}:28</span></div>
    <div className="vvcr-events-lights" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/></div>
    <div className="vvcr-event-film">
      <div className="vvcr-event-film-inner">
        <div className="vvcr-event-curtain" aria-hidden="true"/><div className="vvcr-event-sun" aria-hidden="true"/>
        <div className="vvcr-event-person vvcr-event-person-a" aria-hidden="true"><i/><b/></div><div className="vvcr-event-person vvcr-event-person-b" aria-hidden="true"><i/><b/></div><div className="vvcr-event-person vvcr-event-person-c" aria-hidden="true"><i/><b/></div>
        <div className="vvcr-event-viewfinder"><i/><i/><i/><i/></div>
        <div className="vvcr-event-caption"><AnimatePresence mode="wait"><motion.div key={scene} initial={{opacity:0,y:25}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-15}} transition={{duration:.45}}><small>A VISUAL VERSE MEMORY / 0{scene+1}</small><h3>{m.title}</h3><p>{m.sub}</p></motion.div></AnimatePresence></div>
        {flash&&<div className="vvcr-event-flash" aria-hidden="true"/>}
      </div>
    </div>
    <div className="vvcr-event-filmstrip">{memories.map((v,i)=><button type="button" aria-label={"Show scene "+(i+1)} aria-pressed={scene===i} key={v.title} onClick={()=>{setScene(i);setPlay(false)}} className={"vvcr-event-thumb vvcr-event-thumb-"+v.tone+(scene===i?" active":"")}><span>0{i+1}</span></button>)}</div>
    <div className="vvcr-event-controls"><div className="vvcr-event-control-label"><Film size={17}/><span>{captured.length?captured.length+" MOMENT"+(captured.length>1?"S":"")+" CAPTURED":"EVERY FRAME TELLS A STORY"}</span></div><button type="button" className="vvcr-event-play" onClick={()=>setPlay(v=>!v)} aria-label={play?"Pause scene rotation":"Resume scene rotation"}><Play size={15} fill={play?"currentColor":"none"}/>{play?"AUTO SCENES":"PAUSED"}</button><button type="button" className="vvcr-shutter" onClick={capture} aria-label="Capture this moment"><Aperture size={21}/> CAPTURE MOMENT</button></div>
    {captured.length>0&&<div className="vvcr-event-memories" aria-label="Your captured moments">{captured.map((s,i)=><motion.div key={i+"-"+s} initial={{y:-45,opacity:0,rotate:-25}} animate={{y:0,opacity:1,rotate:i===0?8:i%2?-9:4}} transition={{type:"spring",stiffness:210,damping:16}} className={"vvcr-memory vvcr-memory-"+memories[s].tone}><span>✳</span><small>{memories[s].title}</small></motion.div>)}</div>}
  </div>;
}

export function VisualVerseAudiences(){
  const [selected,setSelected]=useState<Kind>("brands");
  const [visible,setVisible]=useState(true);
  const sectionRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{const el=sectionRef.current;if(!el)return;const observer=new IntersectionObserver(entries=>setVisible(Boolean(entries[0]?.isIntersecting)),{rootMargin:"80px",threshold:.02});observer.observe(el);return ()=>observer.disconnect()},[]);
  const activeIndex=categories.findIndex(v=>v.kind===selected);
  return <div className="vvcr-root" ref={sectionRef}>
    <div className="vvcr-intro"><span className="vv-label"><span className="vvcr-intro-spark">✳</span> THE PEOPLE WE CREATE WITH / 003</span><h2 className="vvcr-title">Every story<br/>has its <em>people.</em></h2><p>Different ambitions. Different worlds. One creative obsession: making your story impossible to ignore.</p><div className="vvcr-small-instruction"><MousePointerClick size={15}/> Pick a world. Then play with it.</div></div>
    <div className="vvcr-experience">
      <div className="vvcr-selector" role="group" aria-label="Choose a creative audience">{categories.map(({kind,title,line,Icon,number})=><button key={kind} type="button" className={"vvcr-category"+(selected===kind?" active":"")} onClick={()=>setSelected(kind)} aria-pressed={selected===kind}><span className="vvcr-category-no">{number}</span><span className="vvcr-category-icon"><Icon size={20} strokeWidth={1.6}/></span><span className="vvcr-category-text"><strong>{title}</strong><small>{line}</small></span><span className="vvcr-category-arrow"><ArrowUpRight size={18}/></span>{selected===kind&&<motion.span layoutId="vvcr-active-line" className="vvcr-category-rail"/>}</button>)}</div>
      <div className="vvcr-stage-wrap"><div className="vvcr-stage-caption"><span>VISUAL VERSE / CREATIVE UNIVERSES</span><span>EXPLORE 0{activeIndex+1} / 04 <span className="vvcr-caption-arrow">↗</span></span></div><AnimatePresence mode="wait">
        <motion.div key={selected} className="vvcr-transition" initial={{opacity:0,y:20,scale:.97,filter:"blur(8px)"}} animate={{opacity:1,y:0,scale:1,filter:"blur(0px)"}} exit={{opacity:0,y:-17,scale:1.015,filter:"blur(8px)"}} transition={{duration:.44,ease:[.22,1,.36,1]}} onPointerMove={e=>{if(e.pointerType!=="mouse")return;const b=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty("--vvcr-x",String((e.clientX-b.left)/b.width-.5));e.currentTarget.style.setProperty("--vvcr-y",String((e.clientY-b.top)/b.height-.5));}}>
          {selected==="brands"?<BrandUniverse active={visible}/>:selected==="business"?<BusinessUniverse active={visible}/>:selected==="creators"?<CreatorsUniverse active={visible}/>:<EventUniverse active={visible}/>}
        </motion.div>
      </AnimatePresence><div className="vvcr-stage-bottom"><span><span className="vvcr-bottom-dot"/> FOUR WORLDS. ENDLESS POSSIBILITIES.</span><a href="/who-we-serve.html#industries">MEET THE PEOPLE WE CREATE WITH <ArrowUpRight size={15}/></a></div></div>
    </div>
  </div>
}
