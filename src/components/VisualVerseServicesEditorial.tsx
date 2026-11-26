import { EditorialText } from "./EditorialText";
import { orderedServices, serviceLabel, serviceNumber } from "../data/services";
import { VisualVerseActionContent } from "./VisualVerseAction";
import { useEffect, useRef, useState } from "react";
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
`;

function ServicesRail(){
  const rail=useRef<HTMLDivElement>(null);
  const [progress,setProgress]=useState(0);
  const [playing,setPlaying]=useState(()=>!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [visible,setVisible]=useState(false);
  const [hovered,setHovered]=useState(false);
  const [focused,setFocused]=useState(false);
  function refresh(){
    const el=rail.current;if(!el)return;
    const max=el.scrollWidth-el.clientWidth;
    setProgress(max>1?Math.min(1,Math.max(0,el.scrollLeft/max)):1);
  }
  function move(direction:number,wrap=false){
    const el=rail.current;if(!el)return;
    const cards=el.querySelectorAll<HTMLElement>(".vv-service-rail-card");
    const step=cards.length>1?cards[1].offsetLeft-cards[0].offsetLeft:el.clientWidth;
    const max=el.scrollWidth-el.clientWidth;
    if(max<=1)return;
    const behavior:ScrollBehavior=window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth";
    if(wrap&&direction>0&&el.scrollLeft>=max-4)el.scrollTo({left:0,behavior});
    else el.scrollBy({left:direction*step,behavior});
  }
  useEffect(()=>{
    const el=rail.current;if(!el)return;
    refresh();
    const resize=()=>refresh();
    window.addEventListener("resize",resize);
    const observer=typeof IntersectionObserver!=="undefined"?new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.15}):null;
    if(observer)observer.observe(el);else setVisible(true);
    return ()=>{observer?.disconnect();window.removeEventListener("resize",resize)};
  },[]);
  useEffect(()=>{
    if(!playing||!visible||hovered||focused)return;
    const timer=window.setInterval(()=>move(1,true),4400);
    return ()=>window.clearInterval(timer);
  },[playing,visible,hovered,focused]);
  return <section id="services" className="vv-service-overview vv-service-overview--rail" aria-labelledby="vv-sv-services-title">
    <div className="vv-sv-container">
      <header className="vv-service-overview-heading">
        <div><span className="vv-sv-kicker"><i/><i/> THE CREATIVE DISCIPLINES</span><h2 id="vv-sv-services-title">What we <em>bring to life.</em></h2></div>
        <div className="vv-service-rail-controls" aria-label="Service carousel controls">
          <button type="button" aria-label={playing?"Pause automatic service scrolling":"Play automatic service scrolling"} onClick={()=>setPlaying(value=>!value)}>{playing?<Pause size={16}/>:<Play size={16}/>}</button>
          <button type="button" aria-label="Previous services" disabled={progress<=.005} onClick={()=>{setPlaying(false);move(-1)}}><ArrowLeft size={18}/></button>
          <button type="button" aria-label="Next services" disabled={progress>=.995} onClick={()=>{setPlaying(false);move(1)}}><ArrowRight size={18}/></button>
        </div>
      </header>
      <div className="vv-service-rail" ref={rail} role="region" aria-label="Explore six creative services" tabIndex={0} onScroll={refresh} onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)} onFocus={()=>setFocused(true)} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setFocused(false)}} onPointerDown={()=>setPlaying(false)} onWheel={()=>setPlaying(false)} onKeyDown={e=>{if(e.target===e.currentTarget&&(e.key==="ArrowLeft"||e.key==="ArrowRight")){e.preventDefault();setPlaying(false);move(e.key==="ArrowLeft"?-1:1)}}}>
        {services.map((s,i)=>{
          const Icon=s.Icon,image=covers[s.id];
          return <article className="vv-service-rail-card" key={s.id} id={"details-"+s.id} aria-labelledby={"sv-"+s.id}>
            <span id={"service-"+s.id} className="vv-service-anchor" aria-hidden="true"/>
            <a href={serviceUrl(s.id)} aria-label={"Explore "+s.name}>
              <div className="vv-service-rail-image"><img src={base+image.file} alt="" style={{objectPosition:image.position}} loading={i<3?"eager":"lazy"} decoding="async"/><span className="vv-service-rail-icon"><Icon size={18} strokeWidth={1.7}/></span><span className="vv-service-rail-cta">Explore service <ArrowUpRight size={15}/></span></div>
              <div className="vv-service-row-copy"><h3 id={"sv-"+s.id}>{s.name}</h3><p>{detailCopy[s.id].headline}</p><div className="vv-service-rail-tags">{s.tags.slice(0,2).map(tag=><span key={tag}>{tag}</span>)}</div></div>
            </a>
          </article>;
        })}
      </div>
      <div className="vv-service-rail-footer"><span>Swipe or scroll to explore all six services</span><div className="vv-service-rail-progress" aria-hidden="true"><span style={{width:Math.max(12,progress*100)+"%"}}/></div></div>
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
          <a href={base+"request-quote.html"} className="vv-sv-brief-launcher" aria-label="Start a project brief">
            <span>Tell us what you're imagining...</span>
            <span className="vv-sv-brief-launcher-bottom"><small><Sparkles size={15} aria-hidden="true"/> YOUR IDEA. OUR CREATIVITY.</small><strong>Start a project <ArrowUpRight size={17} aria-hidden="true"/></strong></span>
          </a>
        </div>
        <div className="vv-service-hero-nav"><ServiceNav/></div>
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
