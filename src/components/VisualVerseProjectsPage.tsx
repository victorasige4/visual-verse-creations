import { Boxes } from "./ui/background-boxes";
import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { ArrowDown, ArrowLeft, ArrowUpRight, Aperture, Camera, Clapperboard, Layers3, LayoutGrid, Pause, Play, X } from "lucide-react";
import { orderedServices, serviceLabel, serviceNumber } from "../data/services";
import { projectDeliverables } from "../data/project-deliverables";
import { AppleCardsCarousel } from "./ui/apple-cards-carousel";
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
  id: string; title: string; description: string;
  alt: string; medium: string; position: string;
};
const collections = orderedServices<Collection>([
  {id:"graphic-design",title:"Ideas made visible.",description:"A considered composition, a clear message and the confidence to stand out.",alt:"Graphic designer creating colourful artwork at a creative workstation",medium:"Graphic design / illustration",position:"62% center"},
  {id:"photography",title:"Time, held still.",description:"The little details and big milestones that deserve to be remembered exactly as they felt.",alt:"Photographer holding a professional camera in a studio",medium:"Photography / image capture",position:"32% center"},
  {id:"web-ui-ux",title:"Digital that feels human.",description:"Intuitive, expressive digital experiences that bring people and ideas together.",alt:"Laptop and phone displaying digital interface designs",medium:"Digital / UI design",position:"58% center"},
  {id:"videography",title:"Stories with movement.",description:"From the first frame to the final cut, a story built to make you feel something.",alt:"Professional video camera mounted on a production tripod",medium:"Film / production",position:"66% center"},
  {id:"branding",title:"Made to be recognised.",description:"A visual language that feels unmistakably like you, wherever it appears.",alt:"Brand identity mood board with palettes and printed design materials",medium:"Brand / identity",position:"46% center"},
  {id:"social-media",title:"Creative that travels.",description:"Ideas designed for the moments people stop scrolling, start watching and share.",alt:"Phone displaying digital content surrounded by social engagement symbols",medium:"Social / digital campaigns",position:"51% center"},
]);

const frames = collections.map(collection=>({...collection,label:collection.title,type:serviceLabel(collection.id)}));
const collectionHref=(id:string)=>BASE+"projects.html?collection="+encodeURIComponent(id);
const currentCollection=()=>collections.find(item=>item.id===new URLSearchParams(window.location.search).get("collection"))??null;

function ContactSheet({onNavigate,suspended}:{onNavigate:(id:string)=>void;suspended:boolean}){
  const [active,setActive] = useState(0);
  const sheetRef=useRef<HTMLDivElement>(null);
  const filmstripRef=useRef<HTMLDivElement>(null);
  const filmPeriod=useRef(0);
  const filmSettle=useRef(0);
  const filmRunning=useRef(false);
  const [touching,setTouching]=useState(false);
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
  const running=playing&&revealed&&visible&&pageVisible&&!hovered&&!keyboardFocused&&!touching&&!suspended;
  useEffect(()=>{
    if(!running)return;
    const timeout=window.setTimeout(()=>setActive(current=>(current+1)%frames.length),3000);
    return ()=>window.clearTimeout(timeout);
  },[active,running]);
  // Aceternity's Infinite Moving Cards pattern: repeated identical tracks
  // scroll continuously, while retaining native swipe and direct selection.
  const normalizeFilm=()=>{
    const el=filmstripRef.current,w=filmPeriod.current;
    if(!el||!w)return;
    if(el.scrollLeft<w-1||el.scrollLeft>=2*w)el.scrollLeft=w+((el.scrollLeft%w)+w)%w;
  };
  useLayoutEffect(()=>{
    const el=filmstripRef.current;
    if(!el)return;
    const resize=()=>{
      const first=el.querySelector<HTMLElement>("[data-film-copy='0']"),middle=el.querySelector<HTMLElement>("[data-film-copy='1']");
      if(!first||!middle)return;
      const width=middle.offsetLeft-first.offsetLeft;
      if(width&&width!==filmPeriod.current){const progress=filmPeriod.current?(el.scrollLeft%filmPeriod.current)/filmPeriod.current:0;filmPeriod.current=width;el.scrollLeft=width+progress*width;}
    };
    resize();const observer=new ResizeObserver(resize);observer.observe(el);
    const middle=el.querySelector("[data-film-copy='1']");if(middle)observer.observe(middle);
    return ()=>{observer.disconnect();window.clearTimeout(filmSettle.current);};
  },[]);
  useEffect(()=>{
    const el=filmstripRef.current;if(!el||!running)return;
    filmRunning.current=true;window.clearTimeout(filmSettle.current);normalizeFilm();
    let frame=0,last=0,carry=0;
    const tick=(now:number)=>{
      if(last){carry+=Math.min(now-last,50)*.026;const pixels=Math.floor(carry);if(pixels){carry-=pixels;el.scrollLeft+=pixels;if(el.scrollLeft>=filmPeriod.current*2)normalizeFilm();}}
      last=now;frame=requestAnimationFrame(tick);
    };
    frame=requestAnimationFrame(tick);
    return ()=>{filmRunning.current=false;cancelAnimationFrame(frame);};
  },[running]);
  const frame=frames[active];
  return <div ref={sheetRef} className="vv-pj-sheet" aria-label="Interactive creative service contact sheet" data-autoplay={running?"playing":"paused"}
    onPointerMove={event=>{if((event.pointerType==="mouse"||event.pointerType==="pen")&&(event.movementX!==0||event.movementY!==0))setHovered(true);}}
    onPointerDown={event=>{if(event.pointerType==="mouse"||event.pointerType==="pen")setHovered(true);}}
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
    <div className="vv-pj-filmstrip" ref={filmstripRef} role="group" aria-label="Automatically moving collection frames"
      onTouchStart={()=>setTouching(true)} onTouchEnd={()=>setTouching(false)} onTouchCancel={()=>setTouching(false)}
      onScroll={()=>{if(!filmRunning.current){window.clearTimeout(filmSettle.current);filmSettle.current=window.setTimeout(normalizeFilm,150);}}}>
      <div className="vv-pj-thumbs">
        {[0,1,2].map(copy=><div key={copy} className="vv-pj-thumb-group" data-film-copy={copy} aria-hidden={copy!==1?true:undefined}>
          {frames.map((item,i)=><button type="button" key={item.id} tabIndex={copy===1?0:-1} data-selected={i===active} aria-pressed={copy===1?i===active:undefined} aria-label={"Show "+item.type} title={item.type} onClick={()=>setActive(i)}><img src={servicePhoto(item.id)} alt="" style={{objectPosition:item.position}} decoding="async"/><span>{String(i+1).padStart(2,"0")}</span></button>)}
        </div>)}
      </div>
    </div>
  </div>;
}

function CollectionCard({collection,hidden,onOpen}:{collection:Collection;hidden:boolean;onOpen:(event:MouseEvent<HTMLAnchorElement>,collection:Collection)=>void}){
  const name=serviceLabel(collection.id);
  return <FocusCard className={"vv-projects-category vv-pj-card vv-pj-card-"+collection.id} id={collection.id} hidden={hidden} aria-labelledby={"vv-project-"+collection.id}>
    <div className="vv-pj-card-media">
      <img src={servicePhoto(collection.id)} alt={collection.alt} style={{objectPosition:collection.position}} width={1200} height={servicePhotoHeight(collection.id)} loading="lazy" decoding="async"/>
      <FocusCardCaption className="vv-pj-focus-caption"><span>{name}</span><strong>{collection.title}</strong></FocusCardCaption>
      <span className="vv-pj-media-tag"><span className="vv-pj-media-dot"/>{collection.medium}</span>
      <span className="vv-pj-card-number" aria-hidden="true">{serviceNumber(collection.id)}</span>
      <a className="vv-pj-open" href={collectionHref(collection.id)} aria-label={"Explore "+name} onClick={event=>onOpen(event,collection)}><ArrowUpRight size={24}/></a>
    </div>
    <div className="vv-pj-card-copy">
      <h2 id={"vv-project-"+collection.id}>{name}</h2>
      <h3>{collection.title}</h3>
      <p>{collection.description}</p>
      <div className="vv-pj-card-actions">
        <a className="vv-pj-detail-button" href={collectionHref(collection.id)} onClick={event=>onOpen(event,collection)}>Explore collection <ArrowUpRight size={16}/></a>
        <a href={BASE+"request-quote.html?service="+encodeURIComponent(name)} className="vv-pj-start-link">Start a project <ArrowUpRight size={15}/></a>
      </div>
    </div>
  </FocusCard>;
}

function CollectionPage({collection,onClose}:{collection:Collection;onClose:()=>void}){
  const dialog=useRef<HTMLDialogElement>(null);
  const name=serviceLabel(collection.id);
  const isWeb=collection.id==="web-ui-ux";
  const quoteHref=BASE+"request-quote.html?service="+encodeURIComponent(name);
  useEffect(()=>{
    const el=dialog.current;
    if(!el)return;
    const previous=document.body.style.overflow;
    const open=()=>{if(!el.open){document.body.style.overflow="hidden";el.showModal();}};
    if(document.documentElement.hasAttribute("data-vv-boot"))window.addEventListener("vv-page-revealed",open,{once:true});
    else open();
    return ()=>{window.removeEventListener("vv-page-revealed",open);if(el.open)el.close();document.body.style.overflow=previous;};
  },[]);
  return <dialog ref={dialog} className="vv-pj-collection-page" aria-labelledby="vv-pj-collection-title" onCancel={event=>{event.preventDefault();onClose();}} onClick={event=>{if(event.target===event.currentTarget){const rect=event.currentTarget.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)onClose();}}}>
    <header className="vv-pj-collection-header"><button type="button" onClick={onClose} className="vv-pj-collection-back"><ArrowLeft size={18}/> All collections</button><span>VISUAL VERSE / {serviceNumber(collection.id)} OF 06</span><button type="button" autoFocus className="vv-pj-collection-close" aria-label="Close collection" onClick={onClose}><X size={23}/></button></header>
    <div className="vv-pj-collection-body">
      <div className="vv-pj-collection-intro"><div><span className="vv-pj-eyebrow"><span className="vv-pj-signal"/>{name.toUpperCase()}</span><h2 id="vv-pj-collection-title">{name}</h2><h3>{collection.title}</h3><p>{collection.description}</p></div><img src={servicePhoto(collection.id)} alt={collection.alt} style={{objectPosition:collection.position}} width={1200} height={servicePhotoHeight(collection.id)} decoding="async"/></div>
      <section className={`vv-pj-collection-content${isWeb?" vv-pj-web-collection":""}`} aria-labelledby="vv-pj-possibilities">
        {isWeb?<>
          <div className="vv-pj-collection-heading"><h3 id="vv-pj-possibilities">Selected <em>project.</em></h3><p>Explore our completed website project.</p></div>
          <a className="vv-pj-client-card" href="https://stevenloise.com/" target="_blank" rel="noopener noreferrer" aria-label="Visit Steve & Loise website (opens in a new tab)">
            <div className="vv-pj-client-preview"><img src={BASE+"project-archive/steven-loise-landing.webp"} alt="The Steve & Loise wedding website landing page" width={1280} height={889} decoding="async"/></div>
            <div className="vv-pj-client-copy"><span className="vv-pj-eyebrow">WEBSITE DESIGN</span><h4>Steve &amp; Loise</h4><p>A digital wedding invitation celebrating their love story.</p><span className="vv-pj-client-visit">stevenloise.com <ArrowUpRight size={20} aria-hidden="true"/></span></div>
          </a>
        </>:<><div className="vv-pj-collection-heading"><h3 id="vv-pj-possibilities">What we can <em>create for you.</em></h3><p>Explore each creative direction for a closer look at the possibilities.</p></div><AppleCardsCarousel items={projectDeliverables[collection.id]} category={name} quoteHref={quoteHref}/></>}
      </section>
    </div>
    <div className="vv-pj-collection-end"><p>Have something in mind? Let’s make it happen.</p><a className="vv-motion-action vv-action-primary" href={quoteHref}><VisualVerseActionContent>Start a project</VisualVerseActionContent></a><a className="vv-pj-start-link" href={BASE+"services.html?service="+collection.id}>Discover this service <ArrowUpRight size={16}/></a></div>
  </dialog>;
}

export function VisualVerseProjectsPage(){
  const [filter,setFilter]=useState("all");
  const [hashTarget,setHashTarget]=useState("");
  const [activeCollection,setActiveCollection]=useState(currentCollection);
  const collectionTrigger=useRef<HTMLAnchorElement|null>(null);
  const openCollection=(event:MouseEvent<HTMLAnchorElement>,collection:Collection)=>{
    if(event.button!==0||event.metaKey||event.ctrlKey||event.altKey||event.shiftKey)return;
    event.preventDefault();collectionTrigger.current=event.currentTarget;
    const url=new URL(location.href);url.searchParams.set("collection",collection.id);
    history.pushState({...history.state,vvCollectionOpened:true},"",url);
    setActiveCollection(collection);
  };
  const closeCollection=()=>{
    if(history.state?.vvCollectionOpened)history.back();
    else {const url=new URL(location.href);url.searchParams.delete("collection");history.replaceState(history.state,"",url);setActiveCollection(null);if(activeCollection)setHashTarget(activeCollection.id);}
  };
  useEffect(()=>{
    const onPop=()=>setActiveCollection(currentCollection());
    window.addEventListener("popstate",onPop);
    return ()=>window.removeEventListener("popstate",onPop);
  },[]);
  useEffect(()=>{if(!activeCollection&&collectionTrigger.current){collectionTrigger.current.focus({preventScroll:true});collectionTrigger.current=null;}},[activeCollection]);
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
          <ContactSheet suspended={!!activeCollection} onNavigate={id=>{setFilter("all");setHashTarget(id);}}/>
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
          {collections.map(collection=><CollectionCard key={collection.id} collection={collection} hidden={filter!=="all"&&filter!==collection.id} onOpen={openCollection}/>)}
        </FocusCards>
        <p className="vv-pj-note">The collection photos illustrate our creative services and the types of work we can create for you.</p>
      </section>

      <section className="vv-pj-finale" aria-labelledby="vv-pj-finale-heading">
      <Boxes/>
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
    {activeCollection&&<CollectionPage key={activeCollection.id} collection={activeCollection} onClose={closeCollection}/>}
  </div>;
}
