import { EditorialText } from "./EditorialText";
import { orderedServices, serviceLabel, serviceNumber } from "../data/services";
import { VisualVerseActionContent } from "./VisualVerseAction";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, ArrowLeft, ArrowRight, Sparkles, Camera, Clapperboard, Palette, PenTool, MonitorSmartphone, Share2, Check, UsersRound, MessageCircle, FileText, Play, Pause, Smartphone, Monitor, Layers3, MousePointer2, Type, Globe } from "lucide-react";
import { VisualVerseProcessJourney } from "./VisualVerseProcessJourney";
import { Compare } from "./ui/compare";
import { VisualVerseServiceDetailSections } from "./VisualVerseServiceDetailSections";
import "../visual-verse-services-page.css";
import "../visual-verse-service-detail.css";

/**
 * Original Visual Verse service categories + Potadot Services page architecture:
 * editorial overview, dedicated service detail views, seven-stage scroll-pinned
 * process and practical guide cards. The 3D Pin component remains available elsewhere.
 * Illustrations and wording are Visual Verse's, not Potadot assets or copy.
 */
type Kind = "photo"|"film"|"branding"|"graphic"|"web"|"social";
const services = orderedServices([
  {
    id:"graphic-design",number:"01",name: "Graphic Design",kind:"graphic" as Kind,Icon:PenTool,
    highlights:["Logo Design","Print Materials","Social Media Graphics","Packaging Design","Marketing Collateral"],
    description:"Clear ideas, expressed beautifully. We design visual communication that makes people look, understand and remember.",
    bullets:["Digital campaigns and social media creatives","Print, editorial and marketing collateral","Event identities, invitations and presentations","Packaging, signage and promotional material"],
    tags:["Campaigns","Print","Social assets","Editorial"],
    link:"Discuss Graphic Design",
  },
  {
    id:"photography",number:"02",name: "Photography",kind:"photo" as Kind,Icon:Camera,
    highlights:["Weddings","Graduations","Family Shoots","Corporate Events","Church Events"],
    description:"Real moments. Beautifully told. From portraits and brand shoots to once-in-a-lifetime celebrations, every image has a reason to exist.",
    bullets:["Portraits, lifestyle and product photography","Weddings, graduations and live events","Corporate, church and community stories","Thoughtful retouching and colour finishing"],
    tags:["Portraits","Events","Products","Brand campaigns"],
    link:"Discuss Photography",
  },
  {
    id:"web-ui-ux",number:"03",name: "Web & UI/UX Design",kind:"web" as Kind,Icon:MonitorSmartphone,
    highlights:["Website Design","Mobile Interfaces","User Experience","E-commerce","Web Applications"],
    description:"Digital experiences that make sense and feel effortless. From a high-impact website to a carefully considered product flow.",
    bullets:["Responsive websites and landing pages","UI/UX research, user journeys and wireframes","Figma prototypes and interface design","Front-end implementation and refinements"],
    tags:["Websites","Figma","UI/UX","Product design"],
    link:"Discuss Web & UI/UX",
  },
  {
    id:"videography",number:"04",name: "Videography",kind:"film" as Kind,Icon:Clapperboard,
    highlights:["Wedding Films","Corporate Videos","Documentaries","Event Coverage","Commercial Production"],
    description:"Films that make people stop scrolling and start feeling. We shape your story from the first shot to the finishing colour grade.",
    bullets:["Event films and cinematic highlights","Promotional, corporate and documentary video","Interviews, reels and social-first stories","Editing, sound and motion graphics"],
    tags:["Film","Reels","Interviews","Editing"],
    link:"Discuss Videography",
  },
  {
    id:"branding",number:"05",name: "Branding & Identity",kind:"branding" as Kind,Icon:Palette,
    highlights:["Brand Strategy","Visual Identity","Brand Guidelines","Naming & Positioning","Rebranding"],
    description:"More than a logo. We create the visual language, distinctive character and consistent presence that make a brand feel like itself.",
    bullets:["Discovery, positioning and creative direction","Logos, visual identities and design systems","Brand guidelines and real-world applications","Rebrands, launches and campaign identity"],
    tags:["Strategy","Logo","Identity","Brand systems"],
    link:"Discuss Branding",
  },
  {
    id:"social-media",number:"06",name: "Social Media & Digital Marketing",kind:"social" as Kind,Icon:Share2,
    highlights:["Content Strategy","Social Media Management","Campaigns","SEO & Digital Creative","Analytics & Reporting"],
    description:"The right creative, in the right places. We bring strategy and storytelling together to build recognisable, engaging online brands.",
    bullets:["Content strategy, planning and creative direction","Campaign graphics, reels and visual assets","Multi-platform content and brand consistency","Insights-led revisions and digital storytelling"],
    tags:["Strategy","Campaigns","Social","Content"],
    link:"Discuss Digital Marketing",
  }
] as const).map(s=>({...s,name:serviceLabel(s.id),number:serviceNumber(s.id)}));

type Service = typeof services[number];
const base = import.meta.env.BASE_URL;
const serviceUrl = (id: string) => `${base}services.html?service=${id}`;
const quoteUrl = (s:Service) => `${base}request-quote.html?service=${encodeURIComponent(s.name)}`;
const covers: Record<Service["id"], {file:string;position:string}> = {
  photography:{file:"service-cover-photography.webp",position:"32% center"},
  videography:{file:"service-cover-videography.webp",position:"66% center"},
  "graphic-design":{file:"service-cover-graphic-design.webp",position:"62% center"},
  "social-media":{file:"service-cover-social-media.webp",position:"51% center"},
  // Compagnons / Unsplash (FkUTlyPLhJQ); Leeloo The First / Pexels (7598022).
  "web-ui-ux":{file:"service-cover-web-ui-ux.webp",position:"58% center"},
  branding:{file:"service-cover-branding.webp",position:"46% center"},
};
const detailCopy: Record<Service["id"],{headline:string;intro:string;outcome:string;stages:string[];labels:string[]}> = {
  photography:{headline:"Frames that make the moment last.",intro:"From the people you love to the things you build, thoughtful photography makes every moment feel worth remembering.",outcome:"Images that feel like you, long after the moment has passed.",stages:["Plan the shoot","Capture the story","Refine every frame"],labels:["Original","Compare","Edited"]},
  videography:{headline:"Stories that move people.",intro:"From the first idea to the final cut, we craft films that connect with the right audience and make your message impossible to ignore.",outcome:"Purposeful films that carry your story far beyond the screen.",stages:["Shape the concept","Capture the footage","Edit and deliver"],labels:["Footage","Edit","Final cut"]},
  "graphic-design":{headline:"Ideas that deserve to be seen.",intro:"Intelligent design that gives every message a visual voice, from a single print piece to an integrated creative campaign.",outcome:"Design that communicates before a single word is read.",stages:["Understand the brief","Explore visual routes","Build the final assets"],labels:["Sketch","Design","Final artwork"]},
  "web-ui-ux":{headline:"Digital experiences built for real people.",intro:"Responsive websites and thoughtful product interfaces, designed from the first wireframe to the smallest mobile interaction.",outcome:"A digital presence that looks exceptional and works beautifully everywhere.",stages:["Map the experience","Design and prototype","Build and refine"],labels:["Wireframe","Desktop","Mobile"]},
  "social-media":{headline:"Good stories deserve a bigger stage.",intro:"We bring creative direction, content planning and digital campaigns together to help your brand connect consistently with its audience.",outcome:"A recognisable online presence that gives every post a purpose.",stages:["Plan the strategy","Create the content","Review and optimise"],labels:["Content","Campaign","Insights"]},
  branding:{headline:"An identity that feels unmistakably yours.",intro:"We turn the heart of a business into a distinctive visual language that feels consistent from the first impression to every touchpoint.",outcome:"A brand system with the confidence to show up anywhere.",stages:["Discover your direction","Develop the identity","Apply the brand system"],labels:["Logo","Palette","Applications"]},
};

function ServiceNav({active,onPreview}:{active?:string;onPreview?:(id?:string)=>void}) {
  return <nav className="vv-service-switcher" aria-label="Explore our services">
    {services.map(s=><a key={s.id} href={serviceUrl(s.id)} aria-current={active===s.id?"page":undefined} onMouseEnter={()=>onPreview?.(s.id)} onMouseLeave={()=>onPreview?.()} onFocus={()=>onPreview?.(s.id)} onBlur={()=>onPreview?.()}><span>{s.number}</span>{s.name}<ArrowUpRight size={12} aria-hidden="true"/></a>)}
  </nav>;
}

function ServiceDemo({service:s}:{service:Service}) {
  const d=detailCopy[s.id];
  const [mode,setMode]=useState(s.kind==="photo"?1:0);
  const [playing,setPlaying]=useState(()=>s.kind!=="photo"&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [inView,setInView]=useState(false);
  const demoRef=useRef<HTMLDivElement>(null);
  const [split,setSplit]=useState(50);
  const image=covers[s.id];
  const Icon=s.Icon;
  useEffect(()=>{
    if(!demoRef.current || !window.IntersectionObserver){setInView(true);return;}
    const observer=new IntersectionObserver(([entry])=>setInView(entry.isIntersecting),{threshold:.15});
    observer.observe(demoRef.current);
    return ()=>observer.disconnect();
  },[]);
  useEffect(()=>{
    if(!playing || !inView)return;
    const interval=window.setInterval(()=>setMode(m=>(m+1)%3),3200);
    return ()=>window.clearInterval(interval);
  },[playing,inView]);
  return <div ref={demoRef} className={`vv-service-demo vv-demo-${s.kind}`} data-mode={mode} data-playing={playing}>
    <div className="vv-demo-header"><span><i/> STUDIO / {s.number}</span><Icon size={19} strokeWidth={1.6}/></div>
    <div className="vv-demo-controls" aria-label={`${s.name} demonstration views`}>
      {d.labels.map((label,i)=><button key={label} type="button" aria-pressed={mode===i} onClick={()=>{setPlaying(false);setMode(i);if(s.kind==="photo")setSplit([100,50,0][i])}}>{label}</button>)}
    </div>
    <div className="vv-demo-stage">
      {s.kind==="photo" && <div className="vv-demo-photo-frame"><Compare firstImage={base+"photography-wedding-compare.webp"} secondImage={base+"photography-wedding-compare.webp"} firstImageAlt="Original wedding portrait of a couple in a forest" secondImageAlt="Warm colour-graded wedding portrait of the same couple" secondImageClassname="vv-demo-photo-edited" className="vv-demo-photo-image" slideMode="hover" sliderPercentage={split} onSliderChange={value=>{setSplit(value);setMode(value===100?0:value===0?2:1)}}/><p className="vv-demo-photo-hint"><span className="vv-compare-hint-desktop">Hover across the photo to compare</span><span className="vv-compare-hint-touch">Swipe across the photo to compare</span><span aria-hidden="true">↔</span></p></div>}
      {s.kind==="film" && <div className="vv-demo-film-frame"><div className="vv-demo-film-monitor"><img src={base+image.file} alt="Video production camera"/><span className="vv-demo-record"><i/> {mode===2?"EXPORT":"REC"}</span><span className="vv-demo-film-time">00:00:{["04","12","24"][mode]}</span><Play size={36} fill="currentColor"/></div><div className="vv-demo-timeline"><span>V1</span>{[1,2,3,4,5].map(i=><i key={i}/>)}<span>A1</span>{[1,2,3,4,5].map(i=><i key={i}/>)}<b/></div></div>}
      {s.kind==="graphic" && <div className="vv-demo-design-frame"><aside aria-hidden="true"><MousePointer2/><PenTool/><Type/><Layers3/></aside><div className="vv-demo-poster"><small>THE CREATIVE SERIES / 01</small><span className="vv-demo-orb"/><strong>Make<br/>it <em>seen.</em></strong><span>VISUAL VERSE / DESIGN STUDIO</span></div><div className="vv-demo-layers" aria-hidden="true"><small>LAYERS</small><b>Type</b><b>Forms</b><b>Colour</b></div></div>}
      {s.kind==="web" && <div className="vv-demo-web-frame"><div className="vv-demo-browser"><div className="vv-demo-browser-top"><i/><i/><i/><span>visualverse / concept</span></div><div className="vv-demo-web-screen"><small>VISUAL VERSE <Globe size={14}/></small><strong>Design for<br/>the real world.</strong><span>Explore <ArrowUpRight size={13}/></span><div className="vv-demo-web-orbit"/></div><div className="vv-demo-web-lines"><i/><i/><i/></div></div><div className="vv-demo-phone"><div/><small>VV / MOBILE</small><strong>Made<br/>for every<br/>screen.</strong><i/><i/><span>Explore ↗</span></div><span className="vv-demo-device-label">{mode===2?<Smartphone size={14}/>:<Monitor size={14}/>} {d.labels[mode]}</span></div>}
      {s.kind==="social" && <div className="vv-demo-social-frame"><div className="vv-demo-social-post"><small><i/> VISUAL VERSE</small><div><span>GOOD STORIES.</span><strong>Bigger<br/>impact.</strong><em>01 / CAMPAIGN</em></div><span>♡　◌　↗</span></div><div className="vv-demo-social-stats"><small>CAMPAIGN / DEMO</small><strong>Engagement</strong><div>{[28,47,40,62,55,78,95].map((h,i)=><i key={i} style={{height:h+"%",transitionDelay:i*60+"ms"}}/>)}</div><span>Creative → audience</span></div></div>}
      {s.kind==="branding" && <div className="vv-demo-brand-frame"><div className="vv-demo-brand-sheet"><small>IDENTITY / CONCEPT 01</small><img src={base+"logo-mark.png"} alt="Visual Verse identity mark"/><strong>Visual<br/>Verse.</strong><span>IMAGINE. CREATE. CONNECT.</span></div><div className="vv-demo-brand-card"><img src={base+"logo-mark.png"} alt=""/><span>Brand in motion.</span></div><div className="vv-demo-swatches"><i/><i/><i/><i/></div></div>}
    </div>
    <div className="vv-demo-footer"><span><i/> {d.labels[mode]} <small> · {s.kind==="photo"?"Illustrative colour grade":"Illustrative concept"}</small></span>{s.kind!=="photo"&&<button type="button" aria-label={playing?"Pause demonstration":"Play demonstration"} onClick={()=>setPlaying(p=>!p)}>{playing?<Pause size={16}/>:<Play size={16}/>}</button>}</div>
  </div>;
}

function ServiceDetail({service:s}:{service:Service}) {
  const d=detailCopy[s.id];
  const linkFor=(item:Service)=>({id:item.id,name:item.name,image:base+covers[item.id].file,position:covers[item.id].position,href:serviceUrl(item.id),Icon:item.Icon});
  useEffect(()=>{const old=document.title;document.title=s.name+" | Visual Verse Creations";return()=>{document.title=old}},[s]);
  return <div className="vv-services-editorial vv-service-detail">
    <section className="vv-detail-hero" id="services-top"><div className="vv-sv-container">
      <nav className="vv-sv-breadcrumb" aria-label="Breadcrumb"><a href={base}>Home</a><span>·</span><a href={`${base}services.html`}>Services</a><span>·</span><span aria-current="page">{s.name}</span></nav>
      <div className="vv-detail-grid"><div className="vv-detail-copy"><span className="vv-sv-kicker"><i/><i/> {s.number} / 06 &nbsp; · &nbsp; {s.name}</span><h1><EditorialText text={d.headline}/></h1><p>{d.intro}</p><div className="vv-detail-actions"><a className="vv-service-cta vv-motion-action vv-action-primary" href={quoteUrl(s)}><VisualVerseActionContent Icon={ArrowUpRight}>Let's talk</VisualVerseActionContent></a><a className="vv-service-secondary vv-motion-action vv-action-secondary" href={`${base}contact.html`}><VisualVerseActionContent Icon={ArrowUpRight}>Contact us</VisualVerseActionContent></a></div><div className="vv-detail-tags">{s.highlights.map(h=><span key={h}>{h}</span>)}</div></div><ServiceDemo service={s}/></div>
      <a className="vv-service-portfolio-link" href={`${base}projects.html?collection=${s.id}`}>Explore our {s.name} portfolio <ArrowUpRight size={17}/></a>
      <ServiceNav active={s.id}/>
    </div></section>
    <VisualVerseServiceDetailSections key={s.id} service={linkFor(s)} outcome={d.outcome} quoteHref={quoteUrl(s)} allServices={services.map(linkFor)}/>
  </div>;
}

function useRevealSections() {
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const root=rootRef.current;
    if(!root)return;
    const items=Array.from(root.querySelectorAll<HTMLElement>(".vv-sv-reveal"));
    if(!("IntersectionObserver" in window)||window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach(el=>el.classList.add("is-visible"));
      return;
    }
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target);}
      });
    },{threshold:0,rootMargin:"120px 0px 120px 0px"});
    items.forEach(el=>observer.observe(el));
    return ()=>observer.disconnect();
  },[]);
  return rootRef;
}


/* Impractical-inspired landing composition, using Visual Verse's own copy,
   service artwork, navigation and brand tokens. Scoped to overview only. */
const serviceLandingStyles = `
.vv-services-editorial .vv-sv-hero--impractical{display:block;position:relative;isolation:isolate;overflow:hidden;padding:clamp(138px,16svh,186px) 0 clamp(35px,5vw,66px);background:radial-gradient(ellipse at 50% 40%,#d4f5ee 0%,#edf9f6 40%,#f9fcfb 74%);min-height:0}
.vv-sv-hero--impractical::before{content:"";position:absolute;inset:0;z-index:-1;pointer-events:none;background-image:radial-gradient(#168e8724 1px,transparent 1px);background-size:23px 23px;mask-image:radial-gradient(ellipse at 50% 35%,#000 0%,transparent 73%)}
.vv-sv-hero--impractical::after{content:"";position:absolute;z-index:-1;inset:auto -12% -90px;height:190px;pointer-events:none;background:radial-gradient(ellipse,#a9e5d64d,transparent 65%)}
.vv-sv-hero--impractical>.vv-sv-container{display:flex;flex-direction:column;align-items:center}
.vv-sv-hero--impractical .vv-sv-breadcrumb{align-self:flex-start;margin:0 0 clamp(24px,3vw,40px)}
.vv-services-editorial .vv-sv-hero--impractical .vv-sv-hero-main{display:flex;flex-direction:column;align-items:center;text-align:center;gap:0;width:100%;max-width:870px}
.vv-sv-hero--impractical .vv-sv-landing-tag{display:inline-flex;align-items:center;gap:8px;padding:8px 13px;border:1px solid #c8e6df;border-radius:50px;background:#ffffffb5;color:#187c76;font-size:11px;font-weight:750;letter-spacing:.045em;box-shadow:0 3px 14px #003f5c08}
.vv-services-editorial .vv-sv-hero--impractical h1{font-size:clamp(30px,4.1vw,59px);line-height:1.07;max-width:850px;margin:20px 0 0;font-weight:850;letter-spacing:var(--vv-tracking-readable,0em);color:var(--sv-deep)!important;text-wrap:balance}
.vv-sv-hero--impractical h1 em{color:#118f87;font-style:normal}
.vv-services-editorial .vv-sv-hero--impractical .vv-sv-hero-main>p{font-size:clamp(14px,1.35vw,18px);line-height:1.65;margin:16px auto 0;max-width:610px;color:#52737b}
.vv-sv-brief-launcher{display:flex;flex-direction:column;align-items:stretch;gap:15px;width:min(100%,660px);padding:17px;margin:28px auto 0;background:#fff;border:1px solid #cde4de;border-radius:21px;text-decoration:none;color:var(--sv-deep);text-align:left;box-shadow:0 15px 42px #003f5c12;transition:box-shadow .25s,border-color .25s,transform .25s}
.vv-sv-brief-launcher:hover{border-color:#2ec4b6;box-shadow:0 18px 48px #003f5c20;transform:translateY(-2px)}
.vv-sv-brief-launcher>span:first-child{font-size:15px;font-weight:550;color:#59767e;padding:5px 3px}
.vv-sv-brief-launcher-bottom{display:flex;align-items:center;justify-content:space-between;gap:8px}
.vv-sv-brief-launcher-bottom>small{font-size:10px;font-weight:750;color:#267a74;display:flex;gap:6px;align-items:center}
.vv-sv-brief-launcher-bottom>strong{display:flex;align-items:center;gap:9px;border-radius:12px;padding:12px 16px;background:var(--sv-deep);color:#fff;font-size:12px}
.vv-sv-brief-launcher-bottom>strong svg{color:#89efdd}
.vv-sv-hero--impractical .vv-service-hero-nav{width:100%;max-width:920px}
.vv-sv-hero--impractical .vv-service-switcher{margin:17px auto 0;justify-content:center;gap:7px}
.vv-sv-hero--impractical .vv-service-switcher a{font-size:11px;background:#ffffffba}
.vv-sv-hero--impractical .vv-service-switcher a:is(:hover,:focus-visible){background:var(--sv-deep);color:white}
.vv-sv-hero--impractical .vv-sv-browse-link{display:inline-flex;align-items:center;gap:8px;margin-top:23px;color:#127d76;text-decoration:none;font-weight:800;font-size:12px}
.vv-services-editorial .vv-service-overview--rail{background:linear-gradient(180deg,#f9fcfb,#fff);padding:clamp(25px,3vw,45px) 0 clamp(65px,8vw,112px)}
.vv-service-overview--rail>.vv-sv-container{width:min(1168px,calc(100% - 48px))}
.vv-services-editorial .vv-service-overview--rail .vv-service-overview-heading{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;padding:0 0 20px;border:0}
.vv-service-overview--rail .vv-service-overview-heading h2{font-size:clamp(22px,2.8vw,36px);margin:8px 0 0}
.vv-service-rail-controls{display:flex;align-items:center;gap:7px;flex:none}
.vv-service-rail-controls button{display:grid;place-items:center;width:42px;height:42px;border:1px solid #cfe3de;border-radius:50%;background:white;color:var(--sv-deep);cursor:pointer;transition:background .2s,color .2s,border-color .2s}
.vv-service-rail-controls button:hover{background:var(--sv-deep);color:white;border-color:var(--sv-deep)}
.vv-service-rail-controls button:disabled{opacity:.4;cursor:default}
.vv-service-rail-controls button:disabled:hover{background:white;color:var(--sv-deep);border-color:#cfe3de}
.vv-service-rail{display:flex;gap:16px;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;scrollbar-width:thin;scrollbar-color:#8bc9bf #e8f3ef;overscroll-behavior-inline:contain;scroll-padding-inline:4px;padding:5px 4px 18px;align-items:stretch;min-width:0}
.vv-service-rail-card{flex:0 0 clamp(275px,32%,370px);min-width:0;scroll-snap-align:start;border:1px solid #d9e8e4;border-radius:18px;background:#fff;overflow:hidden;transition:box-shadow .3s,border-color .3s}
.vv-service-rail-card:hover,.vv-service-rail-card:focus-within{border-color:#2ec4b6;box-shadow:0 8px 18px #003f5c12}
.vv-service-rail-card>a{display:flex;flex-direction:column;height:100%;text-decoration:none;color:var(--sv-deep)}
.vv-service-rail-card .vv-service-rail-image{position:relative;isolation:isolate;aspect-ratio:16/10;overflow:hidden;background:#d4e9e4}
.vv-service-rail-image img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .6s cubic-bezier(.2,.75,.2,1)}
.vv-service-rail-image::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,#002a4050,transparent 40%,#002a4040);pointer-events:none}
.vv-service-rail-card:is(:hover,:focus-within) img{transform:scale(1.055)}
.vv-service-rail-icon{position:absolute;z-index:1;left:12px;top:12px;display:grid;place-items:center;width:36px;height:36px;border:1px solid #ffffff80;border-radius:10px;background:#002a407a;color:#fff;backdrop-filter:blur(10px)}
.vv-service-rail-cta{position:absolute;z-index:1;right:12px;bottom:12px;display:flex;align-items:center;gap:8px;padding:10px 13px;border-radius:10px;background:#fff;color:#003f5c;font-size:11px;font-weight:800;box-shadow:0 6px 22px #002a4040;transition:background .2s,color .2s,transform .2s}
.vv-service-rail-card:is(:hover,:focus-within) .vv-service-rail-cta{background:#2ec4b6;transform:translateY(-3px)}
.vv-service-rail-card .vv-service-row-copy{display:flex;flex-direction:column;flex:1;padding:15px 17px 18px;min-width:0}
.vv-services-editorial .vv-service-rail-card .vv-service-row-copy h3{font-size:clamp(15px,1.4vw,19px);line-height:1.3;color:var(--sv-deep)!important;margin:0 0 7px;text-wrap:pretty}
.vv-service-rail-card .vv-service-row-copy p{font-size:12px;line-height:1.55;margin:0;color:#58727a}
.vv-service-rail-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:auto;padding-top:14px}
.vv-service-rail-tags>span{padding:5px 9px;border-radius:30px;background:#eaf6f1;color:#246c65;font-size:10px;font-weight:650}
.vv-service-rail-footer{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:12px;color:#55777d;font-size:11px;font-weight:650}
.vv-service-rail-progress{flex:1;max-width:170px;height:4px;background:#dcece6;border-radius:8px;overflow:hidden}
.vv-service-rail-progress>span{height:100%;display:block;border-radius:8px;background:#168f84;transition:width .2s}
.vv-service-overview--rail .vv-service-overview-outro{margin:24px 0 0}
.vv-sv-hero--impractical a:focus-visible,.vv-service-overview--rail :is(a,button,div[tabindex]):focus-visible{outline:3px solid #168f84;outline-offset:3px}
@media(max-width:760px){.vv-services-editorial .vv-sv-hero--impractical{padding-top:clamp(128px,26vw,154px)}.vv-sv-hero--impractical .vv-sv-breadcrumb{margin-bottom:25px}.vv-services-editorial .vv-sv-hero--impractical h1{font-size:clamp(26px,6vw,39px)}.vv-sv-brief-launcher{margin-top:23px;padding:13px;border-radius:17px}.vv-sv-brief-launcher>span:first-child{font-size:13px}.vv-sv-brief-launcher-bottom>strong{padding:11px;font-size:11px}.vv-sv-hero--impractical .vv-service-switcher{gap:6px}.vv-sv-hero--impractical .vv-service-switcher a{font-size:10px;padding:8px 10px}.vv-service-overview--rail>.vv-sv-container{width:calc(100% - 32px)}.vv-service-rail-controls button{width:36px;height:36px}.vv-service-rail-controls{gap:5px}.vv-service-rail{gap:11px}.vv-service-rail-card{flex-basis:min(85%,320px)}}
@media(max-width:390px){.vv-service-overview--rail .vv-service-overview-heading{flex-wrap:wrap;align-items:center;gap:9px}.vv-service-rail-controls button{width:34px;height:34px}.vv-sv-brief-launcher-bottom>small{font-size:9px}}
@media(prefers-reduced-motion:reduce){.vv-sv-brief-launcher,.vv-service-rail-image img,.vv-service-rail-card,.vv-service-rail-cta,.vv-service-rail-progress>span{transition:none!important;transform:none!important}}

/* Editable, local service finder. */
.vv-sv-brief-launcher.vv-sv-finder{transform:none;cursor:auto;gap:12px}
.vv-sv-finder textarea{display:block;width:100%;min-height:82px;resize:vertical;max-height:200px;border:0;background:transparent;padding:7px 5px;color:#003f5c;font:inherit;font-size:15px;line-height:1.55;outline:none}
.vv-sv-finder:focus-within{border-color:#2ec4b6;box-shadow:0 0 0 3px #2ec4b625,0 15px 42px #003f5c12}
.vv-sv-finder textarea::placeholder{color:#59767e;opacity:1}
.vv-sv-finder-submit{display:flex;align-items:center;justify-content:center;gap:8px;border:0;cursor:pointer;border-radius:12px;padding:12px 16px;background:var(--sv-deep);color:white;font:inherit;font-size:12px;font-weight:750}
.vv-sv-finder-submit:disabled{opacity:.45;cursor:not-allowed}
.vv-sv-finder-submit svg{color:#89efdd}
.vv-sv-finder-examples{display:flex;flex-wrap:wrap;justify-content:center;gap:7px;width:100%;margin:12px auto 0}
.vv-sv-finder-examples button{border:1px solid #cde4de;background:#ffffffb5;color:#226d66;border-radius:50px;padding:8px 11px;font:inherit;font-size:11px;font-weight:650;cursor:pointer}
.vv-sv-finder-examples button:hover{border-color:#168f84;background:white}
.vv-sv-finder-live{width:100%}
.vv-sv-finder-response{width:min(100%,660px);margin:12px auto 0;text-align:left;border:1px solid #cde4de;border-radius:16px;background:white;padding:16px;color:#003f5c;box-shadow:0 8px 24px #003f5c0b}
.vv-sv-finder-response>strong{display:flex;align-items:center;gap:7px;font-size:13px;color:#168f84}
.vv-services-editorial .vv-sv-finder-response>p{font-size:13px;line-height:1.6;margin:8px 0 12px;color:#46676d}
.vv-sv-finder-results{display:grid;gap:7px}
.vv-sv-finder-results a{display:flex;align-items:center;gap:10px;min-height:48px;border:1px solid #d4e7df;border-radius:10px;padding:10px;background:#f4fbf7;color:#003f5c;text-decoration:none;font-size:12px;font-weight:750}
.vv-sv-finder-results a:hover{border-color:#2ec4b6;background:#e3f8ef}
.vv-sv-finder-results a>svg:first-child{flex:none;color:#168f84}
.vv-sv-finder-results a>svg:last-child{margin-left:auto;flex:none}
.vv-sv-finder-response .vv-sv-finder-fallback{font-size:12px;color:#168f84;font-weight:750}
.vv-sv-finder :is(textarea,button):focus-visible,.vv-sv-finder-examples button:focus-visible,.vv-sv-finder-response a:focus-visible{outline:2px solid #168f84;outline-offset:3px}
/* Curved, full-bleed moving gallery on the clean section background. */
.vv-services-editorial .vv-service-overview--rail{padding-bottom:clamp(55px,7vw,95px)}
.vv-service-overview--rail .vv-service-overview-heading{padding-bottom:22px}
.vv-service-gallery-stage{position:relative;isolation:isolate;overflow:hidden;width:100%;background:transparent}
.vv-service-gallery-stage .vv-service-rail{padding:clamp(32px,5vw,80px) 0;gap:clamp(9px,1.1vw,19px);scroll-snap-type:none;scrollbar-width:none;scroll-padding:0;overscroll-behavior-x:contain;touch-action:pan-x pan-y;position:relative}
.vv-service-gallery-stage .vv-service-rail::-webkit-scrollbar{display:none}
.vv-service-gallery-stage .vv-service-rail-card{flex:0 0 clamp(270px,25.5vw,470px);border:0;background:transparent;border-radius:0;overflow:visible;position:relative;box-shadow:none;scroll-snap-align:none}
.vv-service-gallery-stage .vv-service-rail-card>a{position:relative;display:block;aspect-ratio:16/9;height:auto;border-radius:clamp(10px,1vw,17px);overflow:hidden;transform:perspective(850px) rotateY(var(--vv-gallery-angle,0deg)) scale(var(--vv-gallery-scale,1));transform-origin:center;box-shadow:0 13px 30px #003f5c32;isolation:isolate}
.vv-service-gallery-stage .vv-service-rail-card:hover,.vv-service-gallery-stage .vv-service-rail-card:focus-within{border:0;box-shadow:none;z-index:2}
.vv-service-gallery-stage .vv-service-rail-image{position:absolute;inset:0;width:100%;height:100%;aspect-ratio:auto}
.vv-service-gallery-stage .vv-service-rail-image::after{background:linear-gradient(180deg,#002a4055,transparent 35%,#002a4030 48%,#001c2de0 100%)}
.vv-service-gallery-stage .vv-service-row-copy{position:absolute;z-index:2;bottom:0;left:0;right:0;padding:clamp(13px,1.5vw,24px);color:#fff;display:flex;flex-direction:column;gap:5px;pointer-events:none}
.vv-services-editorial .vv-service-gallery-stage .vv-service-row-copy h3{color:#fff!important;font-size:clamp(17px,1.55vw,24px);line-height:1.18;margin:0;text-shadow:0 2px 8px #001a2d70}
.vv-service-gallery-stage .vv-service-row-copy p{color:#d9f5ef;font-size:clamp(10px,1vw,13px);line-height:1.4;margin:0}
.vv-service-gallery-stage .vv-service-rail-cta{top:12px;right:12px;bottom:auto;width:37px;height:37px;padding:0;display:grid;place-items:center;border-radius:50%;background:#fff;color:#003f5c}
.vv-service-gallery-stage .vv-service-rail-cta>svg{width:18px;height:18px}
.vv-service-gallery-stage .vv-service-rail-card:is(:hover,:focus-within) .vv-service-rail-cta{transform:rotate(10deg);background:#2ec4b6}
.vv-service-gallery-stage .vv-service-rail-icon{border-radius:50%}
.vv-service-gallery-stage .vv-service-rail-card>a:focus-visible{outline:3px solid #003f5c;outline-offset:4px}
.vv-service-gallery-stage .vv-service-rail:focus-visible{outline-offset:-3px}
.vv-service-gallery-footer{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-top:14px;color:#55777d;font-size:11px;font-weight:650}
.vv-service-gallery-footer .vv-service-switcher{margin:0;gap:7px}
@media(max-width:760px){.vv-service-gallery-stage .vv-service-rail-card{flex-basis:min(76vw,330px)}.vv-service-gallery-stage .vv-service-rail{padding:40px 0}.vv-service-gallery-stage .vv-service-rail-card>a{transform:perspective(850px) rotateY(var(--vv-gallery-angle,0deg)) scale(var(--vv-gallery-scale,1))}.vv-sv-finder textarea{font-size:13px}.vv-sv-finder-submit{font-size:11px;padding:11px}.vv-sv-finder-examples button{font-size:10px}.vv-service-gallery-footer .vv-service-switcher a{font-size:10px}}
@media(prefers-reduced-motion:reduce){.vv-service-gallery-stage .vv-service-rail-card>a{transform:none}.vv-service-gallery-stage .vv-service-rail-card:hover img{transform:none}}


/* Aceternity-style cycling placeholders and submit vanish. */
.vv-sv-vanish-form{width:min(100%,660px);margin:28px auto 0;text-align:left}
.vv-sv-vanish-shell{display:flex;align-items:center;min-height:62px;gap:8px;padding:7px 8px 7px 19px;border:1px solid #cde4de;background:#fff;border-radius:999px;box-shadow:0 15px 42px #003f5c12;transition:border-color .25s,box-shadow .25s}
.vv-sv-vanish-shell:focus-within{border-color:#2ec4b6;box-shadow:0 0 0 3px #2ec4b625,0 15px 42px #003f5c12}
.vv-sv-vanish-field{position:relative;flex:1;min-width:0;height:44px;overflow:hidden;display:flex;align-items:center}
.vv-sv-vanish-input{position:relative;z-index:2;width:100%;min-width:0;border:0;outline:none;background:transparent;color:#003f5c;font:inherit;font-size:14px;line-height:1.5;padding:9px 0}
.vv-sv-vanish-placeholder{position:absolute;inset:0;display:flex;align-items:center;pointer-events:none;overflow:hidden;color:#58767b;font-size:14px;line-height:1.4}
.vv-sv-vanish-placeholder>span{display:block;max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.vv-sv-vanish-canvas{position:absolute;inset:0;pointer-events:none;width:100%;height:100%;z-index:3}
.vv-sv-vanish-submit{display:grid;place-items:center;flex:0 0 46px;width:46px;height:46px;border:0;border-radius:50%;background:#003f5c;color:#fff;cursor:pointer;transition:background .2s,opacity .2s,transform .2s}
.vv-sv-vanish-submit:not(:disabled):hover{background:#168f84;transform:scale(1.04)}
.vv-sv-vanish-submit:disabled{opacity:.35;cursor:default}
.vv-sv-vanish-submit:focus-visible{outline:3px solid #168f84;outline-offset:3px}
.vv-sv-vanish-hint{display:flex;align-items:center;justify-content:center;gap:7px;margin-top:10px;color:#267a74;font-size:10px;font-weight:750;letter-spacing:.06em}
.vv-sv-finder-response .vv-sv-submitted-request{overflow-wrap:anywhere;color:#46676d;font-size:12px;line-height:1.5;border-left:2px solid #2ec4b6;padding-left:10px;margin:9px 0}
@media(max-width:760px){.vv-sv-vanish-form{margin-top:23px}.vv-sv-vanish-shell{min-height:56px;padding:6px 7px 6px 14px}.vv-sv-vanish-input,.vv-sv-vanish-placeholder{font-size:13px}.vv-sv-vanish-submit{width:42px;height:42px;flex-basis:42px}}
@media(prefers-reduced-motion:reduce){.vv-sv-vanish-shell,.vv-sv-vanish-submit{transition:none!important;transform:none!important}}

/* Fractional compositor track; native swipe remains available while paused. */
.vv-service-gallery-stage .vv-service-rail{display:block;gap:0;scroll-behavior:auto}
.vv-service-gallery-track{display:flex;align-items:stretch;gap:clamp(9px,1.1vw,19px);width:100%;position:relative;will-change:transform}
.vv-service-gallery-stage .vv-service-rail-card>a{will-change:transform;backface-visibility:hidden;box-shadow:0 8px 20px #003f5c24}
.vv-service-gallery-stage .vv-service-rail-icon{backdrop-filter:none;background:#002a40bd}
@media(prefers-reduced-motion:reduce){.vv-service-gallery-track{will-change:auto}.vv-service-gallery-stage .vv-service-rail-card>a{will-change:auto}}

`;


/* Local weighted phrase matching; never sends a client's text anywhere. */
const serviceRules:Record<Service["id"],{strong:RegExp;related:RegExp;reason:string}>={
  "graphic-design":{strong:/\b(graphic(s| design)?|poster(s)?|flyer(s)?|brochure(s)?|banner(s)?|business card(s)?|invitation(s)?|packaging|print design|editorial|menu design|social media graphics|social media (post|posts|design|designs)|design (a |an )?(post|posts|flyer|poster|banner)|infographic(s)?|presentation(s)?)\b/g,related:/\b(artwork|visuals|layout|print|signage|collateral|design|cards|stationery)\b/g,reason:"We can create the visuals, artwork and communication materials for your idea."},
  photography:{strong:/\b(photo(s|graphy|grapher|graphs|shoot)?|photo shoot(s)?|photograph(s|er|y)?|portrait(s)?|headshot(s)?|pictures|product shoot(s)?|family shoot(s)?|take pictures|take photos|still images)\b/g,related:/\b(wedding(s)?|graduation(s)?|birthday(s)?|event(s)?|capture|memories|shoot)\b/g,reason:"Our photography service can capture your people, products and important moments."},
  "web-ui-ux":{strong:/\b(web site(s)?|website(s)?|web design|web development|web app(s|lication|lications)?|landing page(s)?|online store(s)?|e commerce|ecommerce|mobile app(s|lication|lications)?|app design|ui|ux|user interface|user experience|figma|interface(s)?|booking site|portfolio site)\b/g,related:/\b(digital platform|online presence|prototype|wireframe(s)?|responsive|booking system)\b/g,reason:"We can design and build a website or user-friendly digital experience."},
  videography:{strong:/\b(video(s|graphy|grapher)?|film(s|maker|making)?|documentar(y|ies)|motion graphics|animation(s)?|cinematic|reel(s)?|video edit(ing)?|commercial(s)?|music video|recording|footage|short film|event coverage video)\b/g,related:/\b(wedding(s)?|event(s)?|shoot|capture|interview(s)?|storytelling|record|edit)\b/g,reason:"Our film and video team can shape your idea into moving visual content."},
  branding:{strong:/\b(brand(ing| identity| strategy| guidelines| design)|rebrand(ing)?|logo(s)?|visual identity|brand identity|brand name|naming|brand colours|brand colors|identity system|corporate identity|new business identity)\b/g,related:/\b(new business|start up|startup|company identity|colour palette|color palette|brand launch|business launch)\b/g,reason:"We can help develop a consistent visual identity and direction for your brand."},
  "social-media":{strong:/\b(social media( management| marketing| strategy| growth)|digital marketing|content strategy|content calendar|content plan(ning)?|manage (my |our )?(instagram|facebook|tiktok|linkedin|accounts|socials)|marketing campaign(s)?|advertising|seo|online marketing|grow (my |our )?(audience|following|followers|business)|grow on social media|social media growth|promote (my |our )?(business|brand)|online ads)\b/g,related:/\b(instagram|facebook|linkedin|tiktok|youtube|followers|engagement|audience|campaign(s)?|marketing|promotion|content|social media)\b/g,reason:"We can help you plan content, communicate consistently and reach your audience online."}
};
function matchCreativeRequest(input:string){
  const normalized=input.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g," ").trim();
  const clean=normalized.replace(/\b(?:no|not|without|don t need|do not need)\s+(?:a |an |any )?(?:website|web design|photography|photos|videos|videography|branding|logo|graphic design|social media)\b/g," ");
  const scored=services.map(service=>{
    const rule=serviceRules[service.id];
    const strong=Array.from(clean.matchAll(rule.strong)).length;
    const related=Array.from(clean.matchAll(rule.related)).length;
    return {service,score:strong*5+related,reason:rule.reason,strong};
  }).sort((a,b)=>b.score-a.score);
  const explicit=scored.filter(item=>item.strong>0);
  if(explicit.length)return {matches:explicit,uncertain:false};
  const best=scored[0]?.score??0;
  return {matches:best>0?scored.filter(item=>item.score>=Math.max(1,best-1)).slice(0,3):[],uncertain:true};
}

const finderExamples=[
  "I need a poster for an upcoming event",
  "I'd love photos of my graduation",
  "I want to build an online store",
  "I need a promotional video for my business",
  "Help me create a logo and brand identity",
  "I want to grow my social media audience"
];

/** Local adaptation of Aceternity's rotating placeholder and vanish input.
 * The canvas is decorative; the real input remains accessible. */
function PlaceholdersAndVanishInput({placeholders,onSubmit,onEdit}:{placeholders:readonly string[];onSubmit:(value:string)=>void;onEdit:()=>void}){
  const [value,setValue]=useState("");
  const [index,setIndex]=useState(0);
  const [vanishing,setVanishing]=useState(false);
  const reducedMotion=useReducedMotion();
  const inputRef=useRef<HTMLInputElement>(null);
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const frameRef=useRef(0);
  const busy=useRef(false);
  useEffect(()=>{
    if(value||vanishing||reducedMotion||placeholders.length<2)return;
    const timer=window.setInterval(()=>{if(!document.hidden)setIndex(i=>(i+1)%placeholders.length)},3000);
    return ()=>window.clearInterval(timer);
  },[value,vanishing,reducedMotion,placeholders.length]);
  useEffect(()=>()=>cancelAnimationFrame(frameRef.current),[]);
  function submit(){
    const text=value.trim();
    if(text.length<3||busy.current)return;
    const input=inputRef.current,canvas=canvasRef.current;
    const context=canvas?.getContext("2d");
    if(reducedMotion||!input||!canvas||!context){onSubmit(text);setValue("");return;}
    const width=Math.max(1,Math.round(input.clientWidth)),height=Math.max(1,Math.round(input.clientHeight));
    canvas.width=width;canvas.height=height;
    const style=getComputedStyle(input);
    context.font=style.fontWeight+" "+style.fontSize+" "+style.fontFamily;
    context.textBaseline="middle";context.fillStyle="#003f5c";
    context.fillText(value,-input.scrollLeft,height/2);
    const pixels=context.getImageData(0,0,width,height).data;
    const particles:{x:number;y:number;dx:number;dy:number;size:number}[]=[];
    for(let y=0;y<height;y+=2)for(let x=0;x<width;x+=2){
      if(pixels[(y*width+x)*4+3]>100&&particles.length<1800)particles.push({x,y,dx:7+Math.random()*29,dy:(Math.random()-.5)*29,size:1+Math.random()*1.25});
    }
    if(!particles.length){context.clearRect(0,0,width,height);onSubmit(text);setValue("");return;}
    busy.current=true;setVanishing(true);onSubmit(text);
    let start=0;
    const animate=(time:number)=>{
      if(!start)start=time;
      const progress=Math.min(1,(time-start)/460);
      context.clearRect(0,0,width,height);
      for(const particle of particles){
        const delay=(1-particle.x/width)*.24;
        const t=Math.max(0,Math.min(1,(progress-delay)/.76));
        context.globalAlpha=1-t;
        context.fillStyle="#003f5c";
        context.fillRect(particle.x+particle.dx*t,particle.y+particle.dy*t,particle.size*(1-t*.65),particle.size*(1-t*.65));
      }
      context.globalAlpha=1;
      if(progress<1){frameRef.current=requestAnimationFrame(animate);return;}
      context.clearRect(0,0,width,height);setValue("");setVanishing(false);busy.current=false;
    };
    frameRef.current=requestAnimationFrame(animate);
  }
  return <form className="vv-sv-vanish-form" onSubmit={e=>{e.preventDefault();submit()}}>
    <div className="vv-sv-vanish-shell">
      <div className="vv-sv-vanish-field">
        <input ref={inputRef} className="vv-sv-vanish-input" aria-label="Describe your creative project" autoComplete="off" type="text" value={value} maxLength={800} readOnly={vanishing} style={{color:vanishing?"transparent":undefined}} onChange={e=>{setValue(e.target.value);onEdit()}}/>
        <div className="vv-sv-vanish-placeholder" aria-hidden="true">
          <AnimatePresence mode="wait" initial={false}>
            {!value&&!vanishing&&<motion.span key={index} initial={reducedMotion?false:{y:12,opacity:0}} animate={{y:0,opacity:1}} exit={reducedMotion?{opacity:0}:{y:-12,opacity:0}} transition={{duration:reducedMotion?0:.22}}>{placeholders[index%placeholders.length]}</motion.span>}
          </AnimatePresence>
        </div>
        <canvas ref={canvasRef} className="vv-sv-vanish-canvas" aria-hidden="true"/>
      </div>
      <button className="vv-sv-vanish-submit" type="submit" aria-label="Find my service" title="Find my service" disabled={value.trim().length<3||vanishing}>
        <ArrowRight size={21} aria-hidden="true"/>
      </button>
    </div>
    <div className="vv-sv-vanish-hint"><Sparkles size={13} aria-hidden="true"/> VISUAL VERSE / CREATIVE GUIDE</div>
  </form>;
}

function CreativeServiceFinder(){
  const [submitted,setSubmitted]=useState("");
  const result=submitted?matchCreativeRequest(submitted):null;
  return <>
    <PlaceholdersAndVanishInput placeholders={finderExamples} onSubmit={setSubmitted} onEdit={()=>setSubmitted("")}/>
    <div className="vv-sv-finder-live" aria-live="polite">
      {result&&<div className="vv-sv-finder-response">
        <strong><Sparkles size={16} aria-hidden="true"/> Your creative guide</strong>
        <div className="vv-sv-submitted-request">{submitted}</div>
        <p>{result.matches.length?(result.uncertain?"Your idea could fit a few of our services. Here are some possibilities — tell us more if you are not sure.":result.matches.length===1?result.matches[0].reason:"Your request sounds like it could benefit from these creative services."):"I need a little more detail to find the right service. Are you looking for visuals, photos, a website, video, a brand identity or social media support?"}</p>
        <div className="vv-sv-finder-results">{result.matches.map(({service})=><a key={service.id} href={serviceUrl(service.id)}><service.Icon size={19} aria-hidden="true"/> Explore {service.name}<ArrowUpRight size={16} aria-hidden="true"/></a>)}</div>
        {result.uncertain&&<p><a className="vv-sv-finder-fallback" href={base+"contact.html"}>Talk to us about your idea <ArrowUpRight size={12} aria-hidden="true"/></a></p>}
      </div>}
    </div>
  </>;
}

function ServicesRail(){
  const rail=useRef<HTMLDivElement>(null);
  const track=useRef<HTMLDivElement>(null);
  const [playing,setPlaying]=useState(()=>!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [visible,setVisible]=useState(false);
  const [hovered,setHovered]=useState(false);
  const [focused,setFocused]=useState(false);
  const metrics=useRef({cycle:0,start:0,width:0,step:0,cards:[] as {node:HTMLElement;center:number;lastAngle:number;lastScale:number}[]});
  const offset=useRef(0);
  const automatic=useRef(false);
  const scrollFrame=useRef(0);
  const reduced=useRef(false);
  function paint(position:number){
    const {width,cards}=metrics.current;
    const half=width/2||1,center=position+half;
    for(const card of cards){
      // Geometry is measured only on resize, not during motion.
      if(Math.abs(card.center-center)>half+metrics.current.step)continue;
      const ratio=Math.max(-1,Math.min(1,(card.center-center)/half));
      const angle=reduced.current?0:Math.round(-ratio*300)/10;
      const scale=reduced.current?1:Math.round((1+Math.abs(ratio)*.12)*1000)/1000;
      if(angle!==card.lastAngle){card.node.style.setProperty("--vv-gallery-angle",angle+"deg");card.lastAngle=angle;}
      if(scale!==card.lastScale){card.node.style.setProperty("--vv-gallery-scale",String(scale));card.lastScale=scale;}
    }
  }
  function settle(){
    const el=rail.current,node=track.current;if(!el||!node||!automatic.current)return;
    automatic.current=false;
    el.scrollLeft+=offset.current;
    offset.current=0;
    node.style.transform="";
    paint(el.scrollLeft);
  }
  function measure(){
    const el=rail.current,node=track.current;if(!el||!node)return;
    settle();
    const cards=Array.from(node.querySelectorAll<HTMLElement>(".vv-service-rail-card"));
    if(cards.length<services.length*3)return;
    const cycle=cards[services.length].offsetLeft-cards[0].offsetLeft;
    if(cycle<=0)return;
    const old=metrics.current;
    const phase=old.cycle?((el.scrollLeft-old.start)%old.cycle+old.cycle)%old.cycle/old.cycle:0;
    metrics.current={cycle,start:cards[services.length].offsetLeft,width:el.clientWidth,step:cards[1].offsetLeft-cards[0].offsetLeft,cards:cards.map(node=>({node,center:node.offsetLeft+node.offsetWidth/2,lastAngle:NaN,lastScale:NaN}))};
    el.scrollLeft=metrics.current.start+phase*cycle;
    paint(el.scrollLeft);
  }
  function onScroll(){
    if(automatic.current||scrollFrame.current)return;
    scrollFrame.current=requestAnimationFrame(()=>{
      scrollFrame.current=0;
      const el=rail.current,{cycle,start}=metrics.current;if(!el||!cycle)return;
      if(!focused){
        if(el.scrollLeft>=start+cycle)el.scrollLeft-=cycle;
        else if(el.scrollLeft<start-cycle*.3)el.scrollLeft+=cycle;
      }
      paint(el.scrollLeft);
    });
  }
  function move(direction:number){
    settle();
    const el=rail.current;if(!el)return;
    el.scrollBy({left:direction*(metrics.current.step||el.clientWidth),behavior:reduced.current?"auto":"smooth"});
  }
  useEffect(()=>{
    const el=rail.current;if(!el)return;
    const preference=window.matchMedia("(prefers-reduced-motion: reduce)");
    reduced.current=preference.matches;
    const preferenceChanged=()=>{reduced.current=preference.matches;if(preference.matches){settle();setPlaying(false);}paint(el.scrollLeft);};
    preference.addEventListener("change",preferenceChanged);
    measure();
    const resize=typeof ResizeObserver!=="undefined"?new ResizeObserver(measure):null;
    if(resize)resize.observe(el);else window.addEventListener("resize",measure);
    const observer=typeof IntersectionObserver!=="undefined"?new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.05}):null;
    if(observer)observer.observe(el);else setVisible(true);
    return ()=>{observer?.disconnect();resize?.disconnect();window.removeEventListener("resize",measure);preference.removeEventListener("change",preferenceChanged);cancelAnimationFrame(scrollFrame.current);settle();};
  },[]);
  useEffect(()=>{
    if(!playing||!visible||hovered||focused||reduced.current)return;
    const el=rail.current,node=track.current;if(!el||!node)return;
    let frame=0,last=0,basePosition=0;
    function start(){
      const {cycle,start}=metrics.current;if(!cycle)return false;
      const phase=((el!.scrollLeft-start)%cycle+cycle)%cycle;
      el!.scrollLeft=start;
      basePosition=start;offset.current=phase;automatic.current=true;
      node!.style.transform="translate3d("+(-phase)+"px,0,0)";
      return true;
    }
    const animate=(now:number)=>{
      if(document.hidden){last=0;frame=requestAnimationFrame(animate);return;}
      if(!automatic.current&&!start()){frame=requestAnimationFrame(animate);return;}
      if(last){
        offset.current=(offset.current+Math.min(now-last,40)*.045)%metrics.current.cycle;
        node!.style.transform="translate3d("+(-offset.current)+"px,0,0)";
        paint(basePosition+offset.current);
      }
      last=now;frame=requestAnimationFrame(animate);
    };
    frame=requestAnimationFrame(animate);
    return ()=>{cancelAnimationFrame(frame);settle();};
  },[playing,visible,hovered,focused]);
  return <section id="services" className="vv-service-overview vv-service-overview--rail" aria-labelledby="vv-sv-services-title">
    <div className="vv-sv-container">
      <header className="vv-service-overview-heading">
        <div><span className="vv-sv-kicker"><i/><i/> THE CREATIVE DISCIPLINES</span><h2 id="vv-sv-services-title">What we <em>bring to life.</em></h2></div>
        <div className="vv-service-rail-controls" aria-label="Service gallery controls">
          <button type="button" aria-label={playing?"Pause automatic service scrolling":"Play automatic service scrolling"} onClick={()=>setPlaying(value=>!value)}>{playing?<Pause size={16}/>:<Play size={16}/>}</button>
          <button type="button" aria-label="Previous services" onClick={()=>{setPlaying(false);move(-1)}}><ArrowLeft size={18}/></button>
          <button type="button" aria-label="Next services" onClick={()=>{setPlaying(false);move(1)}}><ArrowRight size={18}/></button>
        </div>
      </header>
    </div>
    <div className="vv-service-gallery-stage">

      <div className="vv-service-rail" ref={rail} role="region" aria-label="Explore six creative services" tabIndex={0} onScroll={onScroll} onMouseEnter={()=>{settle();setHovered(true)}} onMouseLeave={()=>setHovered(false)} onFocus={()=>{settle();setFocused(true)}} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setFocused(false)}} onPointerDown={()=>{settle();setPlaying(false)}} onWheel={()=>{settle();setPlaying(false)}} onKeyDown={e=>{if(e.target===e.currentTarget&&(e.key==="ArrowLeft"||e.key==="ArrowRight")){e.preventDefault();setPlaying(false);move(e.key==="ArrowLeft"?-1:1)}}}>
        <div className="vv-service-gallery-track" ref={track}>
        {[0,1,2].flatMap(copy=>services.map((s,i)=>{
          const Icon=s.Icon,image=covers[s.id],primary=copy===1;
          return <article className="vv-service-rail-card" key={copy+"-"+s.id} id={primary?"details-"+s.id:undefined} aria-hidden={primary?undefined:true} aria-labelledby={primary?"sv-"+s.id:undefined}>
            {primary&&<span id={"service-"+s.id} className="vv-service-anchor" aria-hidden="true"/>}
            <a href={serviceUrl(s.id)} aria-label={"Explore "+s.name} tabIndex={primary?0:-1}>
              <div className="vv-service-rail-image"><img src={base+image.file} alt="" style={{objectPosition:image.position}} loading={copy===1||i<4?"eager":"lazy"} decoding="async"/><span className="vv-service-rail-icon"><Icon size={18} strokeWidth={1.7}/></span><span className="vv-service-rail-cta"><ArrowUpRight size={18} aria-hidden="true"/></span></div>
              <div className="vv-service-row-copy"><h3 id={primary?"sv-"+s.id:undefined}>{s.name}</h3><p>{detailCopy[s.id].headline}</p></div>
            </a>
          </article>;
        }))}
        </div>
      </div>
    </div>
    <div className="vv-sv-container">
      <div className="vv-service-gallery-footer"><span>Explore the creative universe · Swipe or use the arrows</span><ServiceNav/></div>
      <p className="vv-service-overview-outro">One creative partner. Many disciplines. <a href={base+"request-quote.html"}>Let's shape yours <ArrowUpRight size={14}/></a></p>
    </div>
  </section>;
}

export function VisualVerseServicesEditorial() {
  const ref = useRevealSections();
  const selected=services.find(s=>s.id===new URLSearchParams(window.location.search).get("service"));
  if(selected)return <ServiceDetail service={selected}/>;
  return <div className="vv-services-editorial" ref={ref}>
    <style>{serviceLandingStyles}</style>
    <section className="vv-sv-hero vv-sv-hero--impractical" aria-labelledby="vv-sv-title" id="services-top">
      <div className="vv-sv-container">
        <nav className="vv-sv-breadcrumb" aria-label="Breadcrumb"><a href={base}>Home</a><span aria-hidden="true">·</span><span aria-current="page">Services</span></nav>
        <div className="vv-sv-hero-main">
          <span className="vv-sv-landing-tag"><Sparkles size={15} aria-hidden="true"/> Your creative universe starts here</span>
          <h1 id="vv-sv-title">Six ways we create,<br/><em>all of them yours.</em></h1>
          <p>Every creative solution is shaped around your story, your audience and what you want to achieve. Let's bring your next idea to life.</p>
          <CreativeServiceFinder/>
        </div>
        <a className="vv-sv-browse-link" href="#services">Explore our services <ArrowRight size={15} style={{transform:"rotate(90deg)"}} aria-hidden="true"/></a>
      </div>
    </section>

    <ServicesRail/>

    <VisualVerseProcessJourney/>

    <section className="vv-sv-resources" id="before-you-begin">
      <div className="vv-sv-container">
        <header className="vv-sv-resource-heading vv-sv-reveal">
          <span className="vv-sv-kicker"><i/><i/> BEFORE YOU DECIDE</span>
          <h2>The right <br className="vv-break-narrow"/>creative <br/>partner starts <br className="vv-break-narrow"/><em>with <br className="vv-break-wide"/>the right <br className="vv-break-narrow"/>questions.</em></h2>
          <p>A little clarity goes a long way. Here's where to begin.</p>
        </header>
        <div className="vv-sv-resource-grid">
          <a href={import.meta.env.BASE_URL+"request-quote.html"} className="vv-sv-resource vv-sv-reveal">
            <span><FileText size={21}/><small>01</small></span>
            <h3><EditorialText text="Tell us about your project"/></h3>
            <p>Share your idea, the goals and what you're imagining. We'll shape a clear way forward.</p>
            <b>START A BRIEF <ArrowUpRight size={16}/></b>
          </a>
          <a href={import.meta.env.BASE_URL+"who-we-serve.html"} className="vv-sv-resource vv-sv-reveal">
            <span><UsersRound size={21}/><small>02</small></span>
            <h3>See who we create with</h3>
            <p>From independent creators to growing teams, explore the people behind the briefs.</p>
            <b>EXPLORE WHO WE SERVE <ArrowUpRight size={16}/></b>
          </a>
          <a href={import.meta.env.BASE_URL+"contact.html"} className="vv-sv-resource vv-sv-reveal">
            <span><MessageCircle size={21}/><small>03</small></span>
            <h3>Have a question first?</h3>
            <p>Ask us about scope, timelines, collaboration or how we approach a new idea.</p>
            <b>LET'S TALK <ArrowUpRight size={16}/></b>
          </a>
        </div>
      </div>
    </section>
  </div>;
}
