import { useEffect, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Aperture, Camera, Clapperboard, Layers3, LayoutGrid, Minus, Plus } from "lucide-react";
import { orderedServices, serviceLabel, serviceNumber } from "../data/services";
import { VisualVerseActionContent } from "./VisualVerseAction";
import { PortfolioArtwork, type PortfolioCollection } from "./VisualVersePortfolio";
import { VisualVerseNavbar } from "./VisualVerseNavbar";
import { WhatsAppFloating } from "./VisualVersePolicies";
import { VisualVerseFooter } from "./VisualVerseClosingSections";
import { VisualVerseAboutCta } from "./VisualVerseAboutCta";
import { FocusCards, FocusCard, FocusCardCaption } from "./ui/focus-cards";
import "../projects-gallery.css";

const BASE = import.meta.env.BASE_URL;
const asset = (name: string) => BASE + "project-archive/" + name + ".webp";

type Collection = {
  id: string; title: string; description: string; deliverables: string[];
  photo?: string; alt?: string; art?: PortfolioCollection["id"]; medium: string;
};
const collections = orderedServices<Collection>([
  {id:"graphic-design",title:"Ideas made visible.",description:"A considered composition, a clear message and the confidence to stand out.",deliverables:["Campaign graphics","Editorial & poster design","Print collateral","Illustration"],photo:"social-design",alt:"Visual Verse minimalist editorial poster featuring a portrait",medium:"Poster / archive"},
  {id:"photography",title:"Time, held still.",description:"The little details and big milestones that deserve to be remembered exactly as they felt.",deliverables:["Portraits & lifestyle","Graduations & celebrations","Corporate events","Image editing"],photo:"graduations",alt:"Graduates raising their mortarboards in celebration",medium:"Photography / archive"},
  {id:"web-ui-ux",title:"Digital that feels human.",description:"Intuitive, expressive digital experiences that bring people and ideas together.",deliverables:["Responsive websites","Interface design","User journeys","Interactive prototypes"],art:"digital",medium:"Interface / concept"},
  {id:"videography",title:"Stories with movement.",description:"From the first frame to the final cut, a story built to make you feel something.",deliverables:["Event films","Interviews & documentaries","Editing & colour","Promotional storytelling"],photo:"event-story",alt:"Speaker on a stage from the Visual Verse event coverage archive",medium:"Production still / archive"},
  {id:"branding",title:"Made to be recognised.",description:"A visual language that feels unmistakably like you, wherever it appears.",deliverables:["Logo design","Visual identity","Brand applications","Guidelines"],art:"branding",medium:"Identity / concept"},
  {id:"social-media",title:"Creative that travels.",description:"Ideas designed for the moments people stop scrolling, start watching and share.",deliverables:["Content strategy","Campaign creative","Social media visuals","Motion content"],art:"campaigns",medium:"Campaign / concept"},
]);

const frames = [
  {photo:"social-design",label:"The art of a message",type:"Graphic design",alt:"An editorial poster with an expressive portrait",id:"graphic-design"},
  {photo:"event-detail",label:"The moments between",type:"Event photography",alt:"A candid celebration with a family and friends outdoors",id:"photography"},
  {photo:"corporate-moment",label:"A story in every gesture",type:"Event coverage",alt:"A speaker addressing an audience on a stage",id:"photography"},
  {photo:"corporate-events",label:"In the room",type:"Corporate photography",alt:"An audience seated in a conference hall",id:"photography"},
  {photo:"graduations",label:"A milestone, forever",type:"Graduation photography",alt:"Graduates lifting their hats into the air",id:"photography"},
];

function ContactSheet({onNavigate}:{onNavigate:(id:string)=>void}){
  const [active,setActive] = useState(0);
  const frame=frames[active];
  const cycle=(step:number)=>setActive(current=>(current+step+frames.length)%frames.length);
  return <div className="vv-pj-sheet" aria-label="Interactive archive contact sheet">
    <div className="vv-pj-sheet-top"><span><Aperture size={16} aria-hidden="true"/> Visual Verse / contact sheet</span><span className="vv-pj-sheet-status"><i/> ARCHIVE</span></div>
    <div className="vv-pj-viewfinder">
      <div className="vv-pj-frame-scene" key={frame.photo}>
        <img src={asset(frame.photo)} alt={frame.alt} fetchPriority={active===0?"high":"auto"} decoding="async"/>
      </div>
      <span className="vv-pj-frame-cross vv-pj-cross-tl" aria-hidden="true"/><span className="vv-pj-frame-cross vv-pj-cross-tr" aria-hidden="true"/><span className="vv-pj-frame-cross vv-pj-cross-bl" aria-hidden="true"/><span className="vv-pj-frame-cross vv-pj-cross-br" aria-hidden="true"/>
      <span className="vv-pj-frame-id">FRAME {String(active+1).padStart(2,"0")} / {String(frames.length).padStart(2,"0")}</span>
    </div>
    <div className="vv-pj-sheet-caption">
      <div aria-live="polite" aria-atomic="true"><span>{frame.type}</span><strong>{frame.label}</strong></div>
      <a href={"#"+frame.id} onClick={()=>onNavigate(frame.id)} className="vv-pj-frame-link" aria-label={"Explore "+frame.type}><ArrowUpRight size={20}/></a>
    </div>
    <div className="vv-pj-filmstrip">
      <button type="button" onClick={()=>cycle(-1)} aria-label="Previous archive frame" className="vv-pj-frame-step"><ArrowLeft size={18}/></button>
      <div className="vv-pj-thumbs" role="group" aria-label="Choose an archive frame">
        {frames.map((item,i)=><button type="button" key={item.photo} aria-pressed={i===active} aria-label={"Show frame "+(i+1)+": "+item.label} onClick={()=>setActive(i)}><img src={asset(item.photo)} alt="" decoding="async"/><span>{String(i+1).padStart(2,"0")}</span></button>)}
      </div>
      <button type="button" onClick={()=>cycle(1)} aria-label="Next archive frame" className="vv-pj-frame-step"><ArrowRight size={18}/></button>
    </div>
  </div>;
}

function CollectionCard({collection,hidden}:{collection:Collection;hidden:boolean}){
  const name=serviceLabel(collection.id);
  const [expanded,setExpanded]=useState(false);
  return <FocusCard className={"vv-projects-category vv-pj-card vv-pj-card-"+collection.id} id={collection.id} hidden={hidden} aria-labelledby={"vv-project-"+collection.id}>
    <div className="vv-pj-card-media">
      {collection.photo?<img src={asset(collection.photo)} alt={collection.alt} loading="lazy" decoding="async"/>:<PortfolioArtwork kind={collection.art??"digital"}/>}
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
        <p className="vv-pj-note">Archive photography and design are examples from the original Visual Verse portfolio. Concept studies demonstrate creative directions, not commissioned client projects.</p>
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
