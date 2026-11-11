import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRight, Camera, Building2, Rocket, CalendarDays,
  Sparkles, Check, LayoutGrid, UsersRound, PenTool,
  Instagram, Linkedin, ChevronRight, BarChart3, MonitorSmartphone
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

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
    <div className="vv-aud-art vv-aud-art-creators">
      <div className="vv-aud-creator-image"><img src="/about-photographer.webp" alt="Photographer capturing a story through a camera" loading="lazy"/></div>
      <div className="vv-aud-creator-plan">
        <span>YOUR CREATIVE JOURNEY</span>
        <strong>Make the idea real.</strong>
        <div><Check size={14} aria-hidden={true}/> Concept</div>
        <div><Check size={14} aria-hidden={true}/> Create</div>
        <div><Check size={14} aria-hidden={true}/> Launch</div>
      </div>
      <div className="vv-aud-creator-badge"><Rocket size={15} aria-hidden={true}/> BUILT TO BEGIN</div>
    </div>
  );
  return (
    <div className="vv-aud-art vv-aud-art-events">
      <div className="vv-aud-event-main">
        <img src="/about-photographer.webp" alt="Creative photographer holding a camera, illustrating professional event photography" loading="lazy"/>
        <div className="vv-aud-event-image-overlay"><Camera size={16} aria-hidden={true}/> THE MOMENT / 001</div>
      </div>
      <div className="vv-aud-event-ticket">
        <span>WHAT MATTERS</span>
        <strong>Moments.<br/>Remembered.</strong>
        <div><CalendarDays size={20} aria-hidden={true}/><span>YOUR STORY<br/>OUR LENS</span></div>
      </div>
      <div className="vv-aud-event-caption"><UsersRound size={17} aria-hidden={true}/> People, places, stories.</div>
    </div>
  );
}

export function VisualVerseAudiences(){
  const [active,setActive]=useState(0);
  const [interacted,setInteracted]=useState(false);
  const [hovering,setHovering]=useState(false);
  const [reduced,setReduced]=useState(false);
  useEffect(()=>{
    const media=window.matchMedia("(prefers-reduced-motion: reduce)");
    const update=()=>setReduced(media.matches);
    update();
    media.addEventListener("change",update);
    return ()=>media.removeEventListener("change",update);
  },[]);
  useEffect(()=>{
    if(interacted||hovering||reduced)return;
    const timer=window.setInterval(()=>{
      if(!document.hidden)setActive(a=>(a+1)%audiences.length);
    },7300);
    return ()=>window.clearInterval(timer);
  },[interacted,hovering,reduced]);
  const current=audiences[active];
  return (
    <div className="vv-aud-layout" onMouseEnter={()=>setHovering(true)} onMouseLeave={()=>setHovering(false)}>
      <div className="vv-aud-selector">
        <span className="vv-label">THE PEOPLE WE CREATE WITH / 003</span>
        <h2 className="vv-section-h">Every story<br/>has its people.</h2>
        <p className="vv-aud-intro">We create with individuals, founders and businesses at every stage. Find where your world meets our creative perspective.</p>
        <div className="vv-aud-choice-list" aria-label="Choose who Visual Verse works with">
          {audiences.map((item,index)=>{
            const Icon=item.Icon, selected=active===index;
            return (
              <button type="button" key={item.title} onClick={()=>{setActive(index);setInteracted(true)}}
                className={"vv-aud-option"+(selected?" is-selected":"")}
                aria-pressed={selected}
              >
                <span className="vv-aud-option-icon"><Icon size={20} strokeWidth={1.7} aria-hidden={true}/></span>
                <span className="vv-aud-option-copy"><strong>{item.title}</strong><small>{item.subtitle}</small></span>
                <span className="vv-aud-option-action">{selected?<span className="vv-aud-active-lines">≋</span>:<ChevronRight size={18} aria-hidden={true}/>}</span>
                {selected&&!interacted&&!reduced&&!hovering&&<span className="vv-aud-option-progress" key={"progress-"+index} aria-hidden={true}/>}
              </button>
            );
          })}
        </div>
        <a href="#contact" className="vv-aud-discover">Let's create something together <span><ArrowUpRight size={18} aria-hidden={true}/></span></a>
      </div>
      <div className="vv-aud-display">
        <AnimatePresence mode="wait">
          <motion.article key={active}
            className="vv-aud-stage"
            initial={{opacity:0,y:12,scale:0.99}}
            animate={{opacity:1,y:0,scale:1}}
            exit={{opacity:0,y:-10,scale:0.99}}
            transition={{duration:0.35,ease:[0.22,1,0.36,1]}}>
            <div className="vv-aud-stage-head">
              <div><span className="vv-aud-stage-kicker">{current.kicker}</span><h3>{current.title}</h3><p>{current.detail}</p></div>
              <span className="vv-aud-stage-number">{String(active+1).padStart(2,"0")} / 04</span>
            </div>
            <AudienceArtwork kind={current.kind}/>
            <div className="vv-aud-stage-bottom">
              <span>VISUAL VERSE / FOR PEOPLE WITH A STORY</span>
              <span>{current.title.toUpperCase()} <ArrowUpRight size={14} aria-hidden={true}/></span>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
    </div>
  );
}
