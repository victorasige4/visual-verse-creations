import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Aperture, Camera, Clapperboard, Layers3, LayoutGrid, Minus, Pause, Play, Plus } from "lucide-react";
import { orderedServices, serviceLabel, serviceNumber } from "../data/services";
import { VisualVerseActionContent } from "./VisualVerseAction";
import { VisualVerseNavbar } from "./VisualVerseNavbar";
import { WhatsAppFloating } from "./VisualVersePolicies";
import { VisualVerseFooter } from "./VisualVerseClosingSections";
import { VisualVerseAboutCta } from "./VisualVerseAboutCta";
import { FocusCards, FocusCard, FocusCardCaption } from "./ui/focus-cards";
import "../projects-gallery.css";

const BASE = import.meta.env.BASE_URL;
const servicePhoto = (id: string) => BASE + "service-cover-" + id + ".webp";
const servicePhotoHeight = (id: string) => id==="graphic-design"?820:id==="branding"?801:800;

type Collection = {
  id: string; title: string; description: string; deliverables: string[];
  alt: string; medium: string; position: string;
};
const collections = orderedServices<Collection>([
  {id:"graphic-design",title:"Ideas made visible.",description:"A considered composition, a clear message and the confidence to stand out.",deliverables:["Campaign graphics","Editorial & poster design","Print collateral","Illustration"],alt:"Graphic designer creating colourful artwork at a creative workstation",medium:"Graphic design / illustration",position:"62% center"},
  {id:"photography",title:"Time, held still.",description:"The little details and big milestones that deserve to be remembered exactly as they felt.",deliverables:["Portraits & lifestyle","Graduations & celebrations","Corporate events","Image editing"],alt:"Photographer holding a professional camera in a studio",medium:"Photography / image capture",position:"32% center"},
  {id:"web-ui-ux",title:"Digital that feels human.",description:"Intuitive, expressive digital experiences that bring people and ideas together.",deliverables:["Responsive websites","Interface design","User journeys","Interactive prototypes"],alt:"Laptop and phone displaying digital interface designs",medium:"Digital / UI design",position:"58% center"},
  {id:"videography",title:"Stories with movement.",description:"From the first frame to the final cut, a story built to make you feel something.",deliverables:["Event films","Interviews & documentaries","Editing & colour","Promotional storytelling"],alt:"Professional video camera mounted on a production tripod",medium:"Film / production",position:"66% center"},
  {id:"branding",title:"Made to be recognised.",description:"A visual language that feels unmistakably like you, wherever it appears.",deliverables:["Logo design","Visual identity","Brand applications","Guidelines"],alt:"Brand identity mood board with palettes and printed design materials",medium:"Brand / identity",position:"46% center"},
  {id:"social-media",title:"Creative that travels.",description:"Ideas designed for the moments people stop scrolling, start watching and share.",deliverables:["Content strategy","Campaign creative","Social media visuals","Motion content"],alt:"Phone displaying digital content surrounded by social engagement symbols",medium:"Social / digital campaigns",position:"51% center"},
]);

const frames = collections.map(collection=>({...collection,label:collection.title,type:serviceLabel(collection.id)}));
// Keep the original portfolio examples available inside their collections.
const archiveByService: Record<string, {photo:string; alt:string}[]> = {
  "graphic-design":[{photo:"social-design",alt:"Visual Verse minimalist editorial poster featuring a portrait"}],
  photography:[
    {photo:"graduations",alt:"Graduates raising their mortarboards in celebration"},
    {photo:"event-detail",alt:"Family and friends celebrating outdoors"},
    {photo:"corporate-moment",alt:"Speaker addressing an audience on stage"},
    {photo:"corporate-events",alt:"Audience seated in a conference hall"},
  ],
  videography:[{photo:"event-story",alt:"Speaker on a stage from the Visual Verse event coverage archive"}],
};

function ContactSheet({onNavigate}:{onNavigate:(id:string)=>void}){
  const [active,setActive] = useState(0);
  const sheetRef=useRef<HTMLDivElement>(null);
  const [playing,setPlaying]=useState(()=>!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [revealed,setRevealed]=useState(()=>!document.documentElement.hasAttribute("data-vv-boot"));
  const [visible,setVisible]=useState(false);
  const [pageVisible,setPageVisible]=useState(()=>!document.hidden);
  const [hovered,setHovered]=useState(false);
  const [keyboardFocused,setKeyboardFocused]=useState(false);
  useEffect(()=>{
    const reveal=()=>setRevealed(true);
    const visibility=()=>setPageVisible(!document.hidden);
    const motion=window.matchMedia("(prefers-reduced-motion: reduce)");
    const motionChanged=()=>{if(motion.matches)setPlaying(false);};
    window.addEventListener("vv-page-revealed",reveal);
    if(!document.documentElement.hasAttribute("data-vv-boot"))reveal();
    document.addEventListener("visibilitychange",visibility);
    motion.addEventListener("change",motionChanged);
    const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:0});
    if(sheetRef.current)observer.observe(sheetRef.current);
    return ()=>{
      window.removeEventListener("vv-page-revealed",reveal);
      document.removeEventListener("visibilitychange",visibility);
      motion.removeEventListener("change",motionChanged);
      observer.disconnect();
    };
  },[]);
  const running=playing&&revealed&&visible&&pageVisible&&!hovered&&!keyboardFocused;
  useEffect(()=>{
    if(!running)return;
    const timeout=window.setTimeout(()=>setActive(current=>(current+1)%frames.length),3000);
    return ()=>window.clearTimeout(timeout);
  },[active,running]);
  const frame=frames[active];
  const cycle=(step:number)=>setActive(current=>(current+step+frames.length)%frames.length);
  return <div ref={sheetRef} className="vv-pj-sheet" aria-label="Interactive creative service contact sheet" data-autoplay={running?"playing":"paused"}
    onPointerEnter={event=>{if(event.pointerType==="mouse"||event.pointerType==="pen")setHovered(true);}}
    onPointerLeave={()=>setHovered(false)}
    onFocusCapture={event=>setKeyboardFocused(event.target.matches(":focus-visible"))}
    onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget))setKeyboardFocused(false);}}>
    <div className="vv-pj-sheet-top"><span><Aperture size={16} aria-hidden="true"/> Visual Verse / contact sheet</span><span className="vv-pj-sheet-status"><i/> COLLECTIONS <button type="button" className="vv-pj-autoplay" aria-label={playing?"Pause automatic slideshow":"Play automatic slideshow"} title={playing?"Pause slideshow":"Play slideshow"} onClick={()=>setPlaying(value=>!value)}>{playing?<Pause size={14}/>:<Play size={14}/>}</button></span></div>
    <div className="vv-pj-viewfinder">
      <div className="vv-pj-frame-scene" key={frame.id}>
        <img src={servicePhoto(frame.id)} alt={frame.alt} style={{objectPosition:frame.position}} width={1200} height={servicePhotoHeight(frame.id)} fetchPriority={active===0?"high":"auto"} decoding="async"/>
      </div>
      <span className="vv-pj-frame-cross vv-pj-cross-tl" aria-hidden="true"/><span className="vv-pj-frame-cross vv-pj-cross-tr" aria-hidden="true"/><span className="vv-pj-frame-cross vv-pj-cross-bl" aria-hidden="true"/><span className="vv-pj-frame-cross vv-pj-cross-br" aria-hidden="true"/>
      <span className="vv-pj-frame-id">FRAME {String(active+1).padStart(2,"0")} / {String(frames.length).padStart(2,"0")}</span>
    </div>
    <div className="vv-pj-sheet-caption">
      <div aria-live={running?"off":"polite"} aria-atomic="true"><span>{frame.type}</span><strong>{frame.label}</strong></div>
      <a href={"#"+frame.id} onClick={()=>onNavigate(frame.id)} className="vv-pj-frame-link" aria-label={"Explore "+frame.type}><ArrowUpRight size={20}/></a>
    </div>
    <div className="vv-pj-filmstrip">
      <button type="button" onClick={()=>cycle(-1)} aria-label="Previous collection frame" className="vv-pj-frame-step"><ArrowLeft size={18}/></button>
      <div className="vv-pj-thumbs" role="group" aria-label="Choose a collection frame">
        {frames.map((item,i)=><button type="button" key={item.id} aria-pressed={i===active} aria-label={"Show "+item.type} title={item.type} onClick={()=>setActive(i)}><img src={servicePhoto(item.id)} alt="" style={{objectPosition:item.position}} decoding="async"/><span>{String(i+1).padStart(2,"0")}</span></button>)}
      </div>
      <button type="button" onClick={()=>cycle(1)} aria-label="Next collection frame" className="vv-pj-frame-step"><ArrowRight size={18}/></button>
    </div>
  </div>;
}

function CollectionCard({collection,hidden}:{collection:Collection;hidden:boolean}){
  const name=serviceLabel(collection.id);
  const [expanded,setExpanded]=useState(false);
  return <FocusCard className={"vv-projects-category vv-pj-card vv-pj-card-"+collection.id} id={collection.id} hidden={hidden} aria-labelledby={"vv-project-"+collection.id}>
    <div className="vv-pj-card-media">
      <img src={servicePhoto(collection.id)} alt={collection.alt} style={{objectPosition:collection.position}} width={1200} height={servicePhotoHeight(collection.id)} loading="lazy" decoding="async"/>
      <FocusCardCaption className="vv-pj-focus-caption"><span>{name}</span><strong>{collection.title}</strong></FocusCardCaption>
      <span className="vv-pj-media-tag"><span className="vv-pj-media-dot"/>{collection.medium}</span>
      <span className="vv-pj-card-number" aria-hidden="true">{serviceNumber(collection.id)}</span>
      <button className="vv-pj-open" type="button" aria-expanded={expanded} aria-controls={"vv-pj-details-"+collection.id} aria-label={(expanded?"Close ":"Explore ")+name} onClick={()=>setExpanded(!expanded)}>{expanded?<Minus size={24}/>:<ArrowUpRight size={24}/>}</button>
    </div>
    <div className="vv-pj-card-copy">
      <h2 id={"vv-project-"+collection.id}>{name}</h2>
      <h3>{collection.title}</h3>
      <p>{collection.description}</p>
      <div className="vv-pj-card-actions">
        <button type="button" className="vv-pj-detail-button" aria-expanded={expanded} aria-controls={"vv-pj-details-"+collection.id} onClick={()=>setExpanded(!expanded)}>{expanded?"Close collection":"Explore collection"} {expanded?<Minus size={16}/>:<Plus size={16}/>}</button>
        <a href={BASE+"request-quote.html?service="+encodeURIComponent(name)} className="vv-pj-start-link">Start a project <ArrowUpRight size={15}/></a>
      </div>
      <div className="vv-pj-card-details" id={"vv-pj-details-"+collection.id} hidden={!expanded}>
        <p>What we can create for you</p>
        <ul>{collection.deliverables.map(item=><li key={item}>{item}</li>)}</ul>
        {expanded && archiveByService[collection.id] && <div className="vv-pj-archive">
          <p>From our portfolio archive</p>
          <div className="vv-pj-archive-grid">{archiveByService[collection.id].map(item=><img key={item.photo} src={BASE+"project-archive/"+item.photo+".webp"} alt={item.alt} loading="lazy" decoding="async"/>)}</div>
        </div>}
        <a href={BASE+"services.html?service="+collection.id}>Discover this service <ArrowRight size={15}/></a>
      </div>
    </div>
  </FocusCard>;
}

export function VisualVerseProjectsPage(){
  const [filter,setFilter]=useState("all");
  const [hashTarget,setHashTarget]=useState("");
  useEffect(()=>{
    const onHash=()=>{
      let id=window.location.hash.slice(1);
      try{id=decodeURIComponent(id);}catch{/* malformed fragment */}
      id=({digital:"web-ui-ux",campaigns:"social-media"} as Record<string,string>)[id]??id;
      if(collections.some(item=>item.id===id)){setFilter("all");setHashTarget(id);}
    };
    window.addEventListener("hashchange",onHash);
    return ()=>window.removeEventListener("hashchange",onHash);
  },[]);
  useEffect(()=>{
    if(!hashTarget)return;
    const frame=requestAnimationFrame(()=>{document.getElementById(hashTarget)?.scrollIntoView({block:"start"});setHashTarget("");});
    return ()=>cancelAnimationFrame(frame);
  },[filter,hashTarget]);
  const visibleCount=filter==="all"?collections.length:1;
  return <div className="vv-projects-page vv-projects-v3">
    <VisualVerseNavbar/>
    <main id="top">
      <section className="vv-pj-hero">
        <div className="vv-pj-hero-grid">
          <div className="vv-pj-intro">
            <span className="vv-pj-eyebrow"><span className="vv-pj-signal"/> THE VISUAL VERSE PORTFOLIO</span>
            <h1>Every story,<br/><em>a different<br/>canvas.</em></h1>
            <p>Real moments. Bold ideas. Creative possibilities. A closer look at what we make and how we see the world.</p>
            <div className="vv-pj-hero-actions"><a className="vv-motion-action vv-action-primary" href="#vv-projects-gallery"><VisualVerseActionContent Icon={ArrowDown}>Explore our work</VisualVerseActionContent></a><a href={BASE+"request-quote.html"} className="vv-motion-action vv-action-secondary"><VisualVerseActionContent>Start a project</VisualVerseActionContent></a></div>
          </div>
          <ContactSheet onNavigate={id=>{setFilter("all");setHashTarget(id);}}/>
        </div>
        <div className="vv-pj-hero-foot"><span><Layers3 size={16} aria-hidden="true"/> Six creative disciplines</span><span>FROM CONCEPT TO CREATION</span><a href="#vv-projects-gallery">Scroll to explore <ArrowDown size={16}/></a></div>
      </section>

      <section className="vv-pj-gallery" id="vv-projects-gallery" aria-labelledby="vv-pj-gallery-title">
        <div className="vv-pj-section-head">
          <div><span className="vv-pj-eyebrow"><LayoutGrid size={15} aria-hidden="true"/> THE COLLECTIONS</span><h2 id="vv-pj-gallery-title">Work that<br/><em>speaks.</em></h2></div>
          <p>Different mediums, the same attention to detail. Explore the collection that resonates with you, then see what we can create together.</p>
        </div>
        <div className="vv-pj-gallery-nav"><div className="vv-projects-filters" role="group" aria-label="Filter portfolio categories">
          <button type="button" aria-pressed={filter==="all"} onClick={()=>setFilter("all")}>All collections</button>
          {collections.map(item=><button type="button" key={item.id} aria-pressed={filter===item.id} onClick={()=>setFilter(item.id)}>{serviceLabel(item.id)}</button>)}
        </div><span role="status" className="vv-pj-results">{String(visibleCount).padStart(2,"0")} / 06 collections</span></div>
        <FocusCards className={"vv-pj-grid"+(filter==="all"?"":" is-filtered")}>
          {collections.map(collection=><CollectionCard key={collection.id} collection={collection} hidden={filter!=="all"&&filter!==collection.id}/>)}
        </FocusCards>
        <p className="vv-pj-note">The collection photos illustrate our creative services and the types of work we can create for you.</p>
      </section>

      <section className="vv-pj-finale" aria-labelledby="vv-pj-finale-heading">
        <img className="vv-pj-watermark" src={BASE+"logo-mark.png"} alt="" aria-hidden="true"/>
        <div className="vv-pj-finale-inner">
          <span className="vv-pj-eyebrow"><Camera size={16} aria-hidden="true"/> MORE THAN A PRETTY PICTURE</span>
          <h2 id="vv-pj-finale-heading">One idea.<br/> <em>Endless ways</em><br/> to tell it.</h2>
          <p>From the first sketch to the final frame, we bring the right creative disciplines together to turn your ideas into something meaningful.</p>
          <a href={BASE+"services.html"} className="vv-motion-action vv-action-primary"><VisualVerseActionContent>Discover what we do</VisualVerseActionContent></a>
          <div className="vv-pj-finale-corner" aria-hidden="true"><Clapperboard size={20}/> MAKE IT MATTER.</div>
        </div>
      </section>
      <VisualVerseAboutCta/>
    </main>
    <footer className="vv-close-footer-wrap" id="footer"><VisualVerseFooter/></footer>
    <WhatsAppFloating/>
  </div>;
}
