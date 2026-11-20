import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowUpRight, Pause, Play, Plus, X } from "lucide-react";
import type { ProjectDeliverable } from "../../data/project-deliverables";
import { CampaignArtworkGallery } from "./campaign-artwork-gallery";
import { InfinitePhotoCards } from "./infinite-photo-cards";
import "./apple-cards-carousel.css";

/** Apple Cards + Aceternity Infinite Moving Cards: repeated tracks, continuous
 * linear movement and pause on hover. Native scrolling also allows touch,
 * keyboard and trackpad navigation without competing transforms. */
export function AppleCardsCarousel({ items, category, quoteHref }: {items:ProjectDeliverable[];category:string;quoteHref:string}) {
  const scroller = useRef<HTMLDivElement>(null);
  const middle = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLDivElement>(null);
  const settle = useRef<number>(0);
  const periodRef = useRef(0);
  const running = useRef(false);
  const trigger = useRef<HTMLElement|null>(null);
  const detail = useRef<HTMLDialogElement>(null);
  const [active,setActive] = useState<ProjectDeliverable|null>(null);
  const [hovered,setHovered] = useState(false);
  const [keyboardFocus,setKeyboardFocus] = useState(false);
  const [touching,setTouching] = useState(false);
  const [paused,setPaused] = useState(false);
  const [visible,setVisible] = useState(false);
  const [foreground,setForeground] = useState(!document.hidden);
  const [reduced,setReduced] = useState(()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const playing = visible && foreground && !reduced && !paused && !hovered && !keyboardFocus && !touching && !active;
  const asset=(path:string)=>import.meta.env.BASE_URL+path;

  const period=()=>middle.current&&first.current?middle.current.offsetLeft-first.current.offsetLeft:0;
  const normalize=()=>{
    const el=scroller.current, width=periodRef.current;
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
      if(width!==previousPeriod){periodRef.current=width;el.scrollTo({left:width+progress*width,behavior:"instant"});previousPeriod=width;}
    };
    resize();
    const observer=new ResizeObserver(resize);
    if(middle.current)observer.observe(middle.current);
    return ()=>{observer.disconnect();window.clearTimeout(settle.current);};
  },[items]);
  useEffect(()=>{
    const el=scroller.current;
    if(!el)return;
    const media=window.matchMedia("(prefers-reduced-motion: reduce)");
    const motionChange=()=>setReduced(media.matches);
    const visibilityChange=()=>setForeground(!document.hidden);
    const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.1});
    observer.observe(el);
    media.addEventListener("change",motionChange);
    document.addEventListener("visibilitychange",visibilityChange);
    return ()=>{observer.disconnect();media.removeEventListener("change",motionChange);document.removeEventListener("visibilitychange",visibilityChange);};
  },[]);
  useEffect(()=>{
    const el=scroller.current;
    if(!el||!playing)return;
    running.current=true;
    window.clearTimeout(settle.current);
    normalize();
    let frame=0,last=0,carry=0;
    const move=(now:number)=>{
      if(last){
        // Constant 38px/s across display refresh rates, retaining subpixels.
        carry+=Math.min(now-last,50)*.038;
        const pixels=Math.floor(carry);
        if(pixels){
          carry-=pixels;
          el.scrollLeft+=pixels;
          if(periodRef.current&&el.scrollLeft>=periodRef.current*2)normalize();
        }
      }
      last=now;
      frame=requestAnimationFrame(move);
    };
    frame=requestAnimationFrame(move);
    return ()=>{running.current=false;cancelAnimationFrame(frame);};
  },[playing]);
  const onScroll=()=>{
    if(running.current)return;
    window.clearTimeout(settle.current);
    settle.current=window.setTimeout(normalize,150);
  };
  useEffect(()=>{
    const dialog=detail.current;
    if(!active||!dialog)return;
    dialog.showModal();
    return ()=>{if(dialog.open)dialog.close();trigger.current?.focus({preventScroll:true});};
  },[active]);

  return <div className="vv-apple-carousel" aria-label={`${category} creative possibilities`} data-autoplay={playing?"playing":"paused"}>
    <div ref={scroller} className="vv-apple-scroller" onScroll={onScroll} role="region" aria-label="Scrollable creative cards"
      // Opening a modal underneath a stationary pointer causes pointerenter
      // without deliberate interaction. Autoplay must still start on opening.
      onPointerMove={event=>{if((event.pointerType==="mouse"||event.pointerType==="pen")&&(event.movementX!==0||event.movementY!==0))setHovered(true);}}
      onPointerDown={event=>{if(event.pointerType==="mouse"||event.pointerType==="pen")setHovered(true);}}
      onPointerLeave={()=>setHovered(false)}
      onTouchStart={()=>setTouching(true)} onTouchEnd={()=>setTouching(false)} onTouchCancel={()=>setTouching(false)}
      onFocusCapture={event=>{if(event.target.matches(":focus-visible"))setKeyboardFocus(true);}}
      onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget))setKeyboardFocus(false);}}>
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
    <div className="vv-apple-controls"><span>{reduced?"Swipe or scroll to explore":"Moving gallery · hover or swipe to explore"}</span>{!reduced&&<button type="button" onClick={()=>setPaused(value=>!value)} aria-label={paused?"Play automatic cards":"Pause automatic cards"}>{paused?<Play size={15}/>:<Pause size={15}/>}<span>{paused?"Play":"Pause"}</span></button>}</div>
    {active&&<dialog ref={detail} className={`vv-apple-detail${active.artwork||active.photographs?" vv-apple-detail--campaign":""}`} aria-labelledby="vv-apple-detail-title" onCancel={event=>{event.preventDefault();event.stopPropagation();setActive(null);}} onClick={event=>{if(event.target===event.currentTarget){const rect=event.currentTarget.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)setActive(null);}}}>
      <div className="vv-apple-detail-top"><span>{category}</span><button autoFocus type="button" aria-label="Close creative detail" onClick={()=>setActive(null)}><X size={22}/></button></div>
      <h3 id="vv-apple-detail-title">{active.title}</h3>
      <p className="vv-apple-detail-lead">{active.description}</p>
      {active.artwork?<CampaignArtworkGallery items={active.artwork} title={active.title} collectionLabel={active.artworkLabel??"Selected work"}/>:active.photographs?<InfinitePhotoCards items={active.photographs} label={active.photographsLabel??active.title} credit={active.photographsCredit}/>:<img className="vv-apple-detail-photo" src={asset(active.image)} alt={`Visual reference for ${active.title.toLowerCase()}`} decoding="async"/>}
      <p>{active.details}</p>
      {active.examples&&<div className="vv-apple-detail-examples">{active.examples.map(image=><img key={image} src={asset(image)} alt={`Additional visual reference for ${active.title.toLowerCase()}`} loading="lazy" decoding="async"/>)}</div>}
      <a href={quoteHref} className="vv-apple-detail-link">Start a project <ArrowUpRight size={17}/></a>
    </dialog>}
  </div>;
}
