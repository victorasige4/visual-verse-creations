import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Plus, X } from "lucide-react";
import type { ProjectDeliverable } from "../../data/project-deliverables";
import "./apple-cards-carousel.css";

/** Adapted from Aceternity UI's Apple Cards Carousel registry. Native images,
 * Lucide icons and dialogs replace Next.js/Tabler dependencies. Three identical
 * tracks allow natural touch scrolling in both directions without an end stop. */
export function AppleCardsCarousel({ items, category, quoteHref }: {items:ProjectDeliverable[];category:string;quoteHref:string}) {
  const scroller = useRef<HTMLDivElement>(null);
  const middle = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLDivElement>(null);
  const settle = useRef<number>(0);
  const trigger = useRef<HTMLElement|null>(null);
  const detail = useRef<HTMLDialogElement>(null);
  const [active,setActive] = useState<ProjectDeliverable|null>(null);
  const asset=(path:string)=>import.meta.env.BASE_URL+path;

  const period=()=>middle.current&&first.current?middle.current.offsetLeft-first.current.offsetLeft:0;
  const normalize=()=>{
    const el=scroller.current, width=period();
    if(!el||!width)return;
    // Jump to the equivalent point in the central copy after a gesture ends.
    const current=el.scrollLeft;
    if(current<width-1||current>=2*width){
      const next=width+((current%width)+width)%width;
      if(Math.abs(next-current)>2)el.scrollTo({left:next,behavior:"instant"});
    }
  };
  useLayoutEffect(()=>{
    const el=scroller.current;
    if(!el)return;
    let previousPeriod=0;
    const resize=()=>{
      const width=period();
      if(!width)return;
      const progress=previousPeriod?((el.scrollLeft%previousPeriod)/previousPeriod):0;
      if(width!==previousPeriod){el.scrollTo({left:width+progress*width,behavior:"instant"});previousPeriod=width;}
    };
    resize();
    const observer=new ResizeObserver(resize);
    if(middle.current)observer.observe(middle.current);
    return ()=>{observer.disconnect();window.clearTimeout(settle.current);};
  },[items]);
  const onScroll=()=>{
    window.clearTimeout(settle.current);
    settle.current=window.setTimeout(normalize,150);
  };
  const advance=(direction:number)=>{
    const el=scroller.current;
    if(!el)return;
    window.clearTimeout(settle.current);
    normalize();
    const width=period()/items.length;
    el.scrollBy({left:direction*width,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"});
  };
  useEffect(()=>{
    const dialog=detail.current;
    if(!active||!dialog)return;
    dialog.showModal();
    return ()=>{if(dialog.open)dialog.close();trigger.current?.focus({preventScroll:true});};
  },[active]);

  return <div className="vv-apple-carousel" aria-label={`${category} creative possibilities`}>
    <div ref={scroller} className="vv-apple-scroller" onScroll={onScroll} role="region" aria-label="Scrollable creative cards">
      <div className="vv-apple-track">
        {[0,1,2].map(copy=><div className="vv-apple-group" key={copy} ref={copy===0?first:copy===1?middle:undefined} data-copy={copy} aria-hidden={copy!==1?true:undefined}>
          {items.map((item,index)=><button key={item.title} className="vv-apple-card" type="button" tabIndex={copy===1?0:-1} aria-label={`Explore ${item.title}`} onClick={event=>{trigger.current=event.currentTarget;setActive(item);}}>
            <img src={asset(item.image)} alt="" loading="lazy" decoding="async" style={{objectPosition:item.position??"center"}}/>
            <span className="vv-apple-card-shade" aria-hidden="true"/>
            <span className="vv-apple-card-copy"><span>{category}</span><strong>{item.title}</strong><span className="vv-apple-card-description">{item.description}</span></span>
            <span className="vv-apple-card-index" aria-hidden="true">{String(index+1).padStart(2,"0")}</span>
            <span className="vv-apple-plus" aria-hidden="true"><Plus size={22}/></span>
          </button>)}
        </div>)}
      </div>
    </div>
    <div className="vv-apple-controls"><span>Swipe or use the arrows to explore</span><div><button type="button" onClick={()=>advance(-1)} aria-label="Previous creative card"><ArrowLeft size={23}/></button><button type="button" onClick={()=>advance(1)} aria-label="Next creative card"><ArrowRight size={23}/></button></div></div>
    {active&&<dialog ref={detail} className="vv-apple-detail" aria-labelledby="vv-apple-detail-title" onCancel={event=>{event.preventDefault();event.stopPropagation();setActive(null);}} onClick={event=>{if(event.target===event.currentTarget){const rect=event.currentTarget.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)setActive(null);}}}>
      <div className="vv-apple-detail-top"><span>{category}</span><button autoFocus type="button" aria-label="Close creative detail" onClick={()=>setActive(null)}><X size={22}/></button></div>
      <h3 id="vv-apple-detail-title">{active.title}</h3>
      <p className="vv-apple-detail-lead">{active.description}</p>
      <img className="vv-apple-detail-photo" src={asset(active.image)} alt={`Visual reference for ${active.title.toLowerCase()}`} decoding="async"/>
      <p>{active.details}</p>
      {active.examples&&<div className="vv-apple-detail-examples">{active.examples.map(image=><img key={image} src={asset(image)} alt={`Additional visual reference for ${active.title.toLowerCase()}`} loading="lazy" decoding="async"/>)}</div>}
      <a href={quoteHref} className="vv-apple-detail-link">Start a project <ArrowUpRight size={17}/></a>
    </dialog>}
  </div>;
}
