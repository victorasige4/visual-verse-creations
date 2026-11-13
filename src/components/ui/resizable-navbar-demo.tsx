import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowUpRight, ChevronDown, Camera, Clapperboard, Palette,
  PenTool, MonitorSmartphone, Share2, Rocket, UsersRound,
  Building2, CalendarDays, Sparkles
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Navbar, NavBody } from "./resizable-navbar";

type MenuName = "services" | "audiences";
type MenuEntry = {name:string;details:string;href:string;Icon:LucideIcon};

const services:MenuEntry[] = [
  {name:"Photography",details:"Portraits · Events · Product",href:"/services.html#details-photography",Icon:Camera},
  {name:"Videography",details:"Brand films · Motion · Stories",href:"/services.html#details-videography",Icon:Clapperboard},
  {name:"Branding",details:"Identity · Direction · Strategy",href:"/services.html#details-branding",Icon:Palette},
  {name:"Graphic Design",details:"Campaigns · Digital · Print",href:"/services.html#details-graphic-design",Icon:PenTool},
  {name:"Web & UI/UX",details:"Websites · Apps · Interfaces",href:"/services.html#details-web-ui-ux",Icon:MonitorSmartphone},
  {name:"Social Media",details:"Content · Campaigns · Growth",href:"/services.html#details-social-media",Icon:Share2},
];
const audiences:MenuEntry[] = [
  {name:"Growing brands",details:"From a first impression to a clear identity",href:"/who-we-serve.html#industries",Icon:Rocket},
  {name:"Businesses & teams",details:"Communication that feels joined up",href:"/who-we-serve.html#industries",Icon:Building2},
  {name:"Creators & founders",details:"From your big idea to a confident launch",href:"/who-we-serve.html#industries",Icon:UsersRound},
  {name:"People & events",details:"The moments and stories worth keeping",href:"/who-we-serve.html#industries",Icon:CalendarDays},
];
const primary = [
  {name:"Home",href:"/#top",key:"home"},
  {name:"About",href:"/about.html",key:"about"},
  {name:"Projects",href:"/projects.html",key:"projects"},
  {name:"Contact",href:"/contact.html",key:"contact"},
];

function currentPage():string {
  if(typeof window==="undefined")return "home";
  const p=window.location.pathname;
  if(p.includes("about"))return "about";
  if(p.includes("services"))return "services";
  if(p.includes("who-we-serve"))return "audiences";
  if(p.includes("projects")||p.includes("portfolio"))return "projects";
  if(p.includes("contact"))return "contact";
  if(p.includes("request-quote"))return "quote";
  return "home";
}

export function ResizableNavbarDemo() {
  const [compact,setCompact]=useState(()=>typeof window!=="undefined" && window.scrollY>70);
  const [page,setPage]=useState(currentPage);
  const [open,setOpen]=useState<MenuName|null>(null);
  const [preview,setPreview]=useState(0);
  const headerRef=useRef<HTMLDivElement>(null);
  const reduced=useReducedMotion();

  useEffect(()=>{
    document.documentElement.classList.add("vv-react-nav-ready");
    setPage(currentPage());
    let frame=0;
    const measure=()=>{
      frame=0;
      // Hysteresis prevents oscillation when hovering around the threshold.
      setCompact(old=>window.scrollY>(old?49:90));
    };
    const onScroll=()=>{if(!frame)frame=requestAnimationFrame(measure)};
    measure();
    window.addEventListener("scroll",onScroll,{passive:true});
    window.addEventListener("resize",onScroll,{passive:true});
    return()=>{
      document.documentElement.classList.remove("vv-react-nav-ready");
      if(frame)cancelAnimationFrame(frame);
      window.removeEventListener("scroll",onScroll);
      window.removeEventListener("resize",onScroll);
    };
  },[]);

  useEffect(()=>{
    const dismiss=(event:PointerEvent)=>{
      if(headerRef.current && !headerRef.current.contains(event.target as Node))setOpen(null);
    };
    const esc=(event:KeyboardEvent)=>{if(event.key==="Escape")setOpen(null)};
    document.addEventListener("pointerdown",dismiss);
    document.addEventListener("keydown",esc);
    return()=>{document.removeEventListener("pointerdown",dismiss);document.removeEventListener("keydown",esc)};
  },[]);

  const chooseMenu=(menu:MenuName)=>{
    setPreview(0);
    setOpen(old=>old===menu?null:menu);
  };
  const options=open==="audiences"?audiences:services;
  const picked=options[Math.min(preview,options.length-1)];
  const PickedIcon=picked.Icon;

  const group=(name:MenuName,label:string,href:string)=>(
    <div className={"vv-nav-resize-group"+(open===name?" is-open":"")}
      onMouseEnter={()=>{setPreview(0);setOpen(name)}}>
      <a href={href} className={"vv-nav-resize-link"+(page===name?" is-active":"")}>
        {label}
      </a>
      <button type="button"
        className="vv-nav-resize-chevron"
        aria-label={open===name?"Close "+label+" menu":"Open "+label+" menu"}
        aria-expanded={open===name}
        aria-controls="vv-nav-mega"
        onClick={()=>chooseMenu(name)}
        onFocus={()=>{if(window.matchMedia("(hover:hover)").matches){setPreview(0);setOpen(name)}}}>
        <ChevronDown size={14} strokeWidth={2.3} aria-hidden="true"/>
      </button>
    </div>
  );

  return <div ref={headerRef} className="vv-resize-nav-anchor"
    onMouseLeave={()=>setOpen(null)}>
    <Navbar compact={compact}>
      <NavBody>
        <a className="vv-nav2-logo vv-nav-resize-logo" href="/#top" aria-label="Visual Verse Creations — Home">
          <img src="/brand-wordmark.png" alt="Visual Verse Creations" width={197} height={52}/>
        </a>
        <nav className="vv-nav2-links vv-nav-resize-links" aria-label="Main navigation — all links remain accessible">
          <a className={"vv-nav-resize-link"+(page==="home"?" is-active":"")} href="/#top">Home</a>
          <a className={"vv-nav-resize-link"+(page==="about"?" is-active":"")} href="/about.html">About</a>
          {group("services","Services","/services.html")}
          {group("audiences","Who We Serve","/who-we-serve.html")}
          <a className={"vv-nav-resize-link"+(page==="projects"?" is-active":"")} href="/projects.html">Projects</a>
          <a className={"vv-nav-resize-link"+(page==="contact"?" is-active":"")} href="/contact.html">Contact</a>
        </nav>
        <div className="vv-nav2-actions vv-nav-resize-actions">
          <a href="/request-quote.html" className="vv-nav2-cta vv-nav-resize-cta">
            Let's talk <span><ArrowUpRight size={15} aria-hidden="true"/></span>
          </a>
        </div>
      </NavBody>
      <AnimatePresence>
        {open && <motion.div id="vv-nav-mega" key={open}
          className="vv-nav-resize-mega"
          role="group" aria-label={open==="services"?"Visual Verse services":"Who Visual Verse serves"}
          initial={reduced?false:{opacity:0,y:-14,scale:.98}}
          animate={{opacity:1,y:0,scale:1}}
          exit={{opacity:0,y:-10,scale:.985}}
          transition={{duration:reduced?0:.24,ease:[.22,1,.36,1]}}>
          <div className="vv-nav-resize-mega-heading">
            <div><span>{open==="services"?"WHAT WE DO / 06 CREATIVE DISCIPLINES":"WHO WE CREATE WITH / 04 AUDIENCES"}</span>
              <h2>{open==="services"?"One studio. Many ways to create.":"Creative work, made around you."}</h2></div>
            <a href={open==="services"?"/services.html":"/who-we-serve.html"} onClick={()=>setOpen(null)}>
              Explore all <ArrowUpRight size={15} aria-hidden="true"/>
            </a>
          </div>
          <div className="vv-nav-resize-mega-grid">
            <div className="vv-nav-resize-mega-list">
              {options.map((item,i)=>{
                const Icon=item.Icon;
                return <a key={item.name} className={"vv-nav-resize-mega-item"+(preview===i?" is-preview":"")}
                  href={item.href}
                  onMouseEnter={()=>setPreview(i)}
                  onFocus={()=>setPreview(i)}
                  onClick={()=>setOpen(null)}>
                  <span className="vv-nav-resize-mega-number">{String(i+1).padStart(2,"0")}</span>
                  <span className="vv-nav-resize-mega-item-copy"><strong>{item.name}</strong><small>{item.details}</small></span>
                  <Icon size={18} strokeWidth={1.8}/>
                </a>
              })}
            </div>
            <div className="vv-nav-resize-preview" aria-live="polite">
              <div className="vv-nav-resize-preview-top"><span>VISUAL VERSE / CREATIVE WORKSPACE</span><Sparkles size={17}/></div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div className="vv-nav-resize-preview-content" key={picked.name}
                  initial={reduced?false:{opacity:0,y:12,rotate:-2}}
                  animate={{opacity:1,y:0,rotate:0}}
                  exit={{opacity:0,y:-9}}
                  transition={{duration:reduced?0:.23}}>
                  <div className="vv-nav-resize-preview-canvas">
                    <div className="vv-nav-resize-preview-orbit"><PickedIcon size={60} strokeWidth={1.1}/></div>
                    <span className="vv-nav-resize-preview-chip vv-chip-one"/><span className="vv-nav-resize-preview-chip vv-chip-two"/>
                    <span className="vv-nav-resize-preview-gridlines"/>
                  </div>
                  <span className="vv-nav-resize-preview-tag">SELECTED / {String(preview+1).padStart(2,"0")}</span>
                  <h3>{picked.name}</h3><p>{picked.details}</p>
                </motion.div>
              </AnimatePresence>
              <span className="vv-nav-resize-preview-bottom">IMAGINE. CREATE. CONNECT. <ArrowUpRight size={14}/></span>
            </div>
          </div>
        </motion.div>}
      </AnimatePresence>
    </Navbar>
  </div>;
}
