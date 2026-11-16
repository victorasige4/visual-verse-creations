import { orderedServices, serviceLabel, serviceNumber } from "../data/services";
import { VisualVerseActionContent } from "./VisualVerseAction";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Camera, Clapperboard, Palette, PenTool, MonitorSmartphone, Share2, Check, UsersRound, MessageCircle, FileText, Play, Pause, Smartphone, Monitor, Layers3, MousePointer2, Type, Globe } from "lucide-react";
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
      <div className="vv-detail-grid"><div className="vv-detail-copy"><span className="vv-sv-kicker"><i/><i/> {s.number} / 06 &nbsp; · &nbsp; {s.name}</span><h1>{d.headline}</h1><p>{d.intro}</p><div className="vv-detail-actions"><a className="vv-service-cta vv-motion-action vv-action-primary" href={quoteUrl(s)}><VisualVerseActionContent Icon={ArrowUpRight}>Let's talk</VisualVerseActionContent></a><a className="vv-service-secondary vv-motion-action vv-action-secondary" href={`${base}contact.html`}><VisualVerseActionContent Icon={ArrowUpRight}>Contact us</VisualVerseActionContent></a></div><div className="vv-detail-tags">{s.highlights.map(h=><span key={h}>{h}</span>)}</div></div><ServiceDemo service={s}/></div>
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

export function VisualVerseServicesEditorial() {
  const ref = useRevealSections();
  const selected=services.find(s=>s.id===new URLSearchParams(window.location.search).get("service"));
  const [highlight,setHighlight]=useState<string>();
  if(selected)return <ServiceDetail service={selected}/>;
  return <div className="vv-services-editorial" ref={ref}>
    <section className="vv-sv-hero vv-sv-hero--potadot" aria-labelledby="vv-sv-title" id="services-top">
      <div className="vv-sv-container">
        <nav className="vv-sv-breadcrumb" aria-label="Breadcrumb">
          <a href={import.meta.env.BASE_URL}>Home</a><span aria-hidden="true">·</span><span aria-current="page">Services</span>
        </nav>
        <div className="vv-sv-hero-main">
          <h1 id="vv-sv-title">Six ways we create, <em>all of them yours.</em></h1>
          <p>Every creative solution is shaped around your story, your audience and what you want to achieve. No one-size-fits-all ideas. Just thoughtful work made for you.</p>
        </div>
        <div className="vv-service-hero-nav"><ServiceNav onPreview={setHighlight}/></div>
      </div>
    </section>

    <section id="services" className="vv-service-overview" aria-labelledby="vv-sv-services-title">
      <div className="vv-sv-container">
        <header className="vv-service-overview-heading vv-sv-reveal">
          <span className="vv-sv-kicker"><i/><i/> THE CREATIVE DISCIPLINES</span>
          <h2 id="vv-sv-services-title">What we <em>bring to life.</em></h2>
        </header>
        <div className="vv-service-list">
          {services.map((s)=>{
            const Icon=s.Icon;
            const image=covers[s.id];
            return <article className={`vv-service-row vv-sv-reveal ${highlight===s.id?"is-highlighted":""}`} id={"details-"+s.id} key={s.id} aria-labelledby={"sv-"+s.id}>
              <span id={"service-"+s.id} className="vv-service-anchor" aria-hidden="true"/>
              <div className="vv-service-row-copy"><span className="vv-service-index"><Icon size={20} strokeWidth={1.6}/> {s.number} / 06</span><h3 id={"sv-"+s.id}>{s.name}</h3><h4>{detailCopy[s.id].headline}</h4><p>{s.description}</p><ul>{s.bullets.slice(0,3).map(b=><li key={b}><Check size={15}/>{b}</li>)}</ul><a className="vv-service-cta vv-motion-action vv-action-primary" href={serviceUrl(s.id)}><VisualVerseActionContent Icon={ArrowUpRight}>Explore {s.name}</VisualVerseActionContent></a></div>
              <a className="vv-service-row-art" href={serviceUrl(s.id)} aria-label={`Explore ${s.name}`}><img src={base+image.file} alt="" style={{objectPosition:image.position}} loading="lazy" decoding="async"/><span className="vv-service-row-top"><Icon size={20} strokeWidth={1.6}/><span>STUDIO / {s.number}</span></span><span className="vv-service-row-badge"><span>{s.tags[0]} · {s.tags[1]}</span><ArrowUpRight size={19}/></span></a>
            </article>;
          })}
        </div>
        <p className="vv-service-overview-outro">One creative partner. Many disciplines. <a href={base+"request-quote.html"}>Let's shape yours <ArrowUpRight size={14}/></a></p>
      </div>
    </section>

    <VisualVerseProcessJourney/>

    <section className="vv-sv-resources" id="before-you-begin">
      <div className="vv-sv-container">
        <header className="vv-sv-resource-heading vv-sv-reveal">
          <span className="vv-sv-kicker"><i/><i/> BEFORE YOU DECIDE</span>
          <h2>The right creative partner starts <em>with the right questions.</em></h2>
          <p>A little clarity goes a long way. Here's where to begin.</p>
        </header>
        <div className="vv-sv-resource-grid">
          <a href={import.meta.env.BASE_URL+"request-quote.html"} className="vv-sv-resource vv-sv-reveal">
            <span><FileText size={21}/><small>01</small></span>
            <h3>Tell us about your project</h3>
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
