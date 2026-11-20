import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import type { PortfolioArtwork } from "../../data/project-deliverables";
import "./infinite-photo-cards.css";

/** A continuous contact sheet: fixed-height cards retain each photo's ratio. */
export function InfinitePhotoCards({items,label,credit}:{items:PortfolioArtwork[];label:string;credit?:{label:string;url:string}}) {
  const rail=useRef<HTMLDivElement>(null), first=useRef<HTMLDivElement>(null), middle=useRef<HTMLDivElement>(null);
  const width=useRef(0), settle=useRef(0), running=useRef(false);
  const [paused,setPaused]=useState(false), [hovered,setHovered]=useState(false), [focused,setFocused]=useState(false), [touching,setTouching]=useState(false);
  const [visible,setVisible]=useState(false),[foreground,setForeground]=useState(!document.hidden);
  const [reduced,setReduced]=useState(()=>matchMedia("(prefers-reduced-motion: reduce)").matches);
  const playing=visible&&foreground&&!reduced&&!paused&&!hovered&&!focused&&!touching;
  const normalize=()=>{const el=rail.current,w=width.current;if(el&&w&&(el.scrollLeft<w-1||el.scrollLeft>=2*w))el.scrollLeft=w+((el.scrollLeft%w)+w)%w;};
  useLayoutEffect(()=>{
    const el=rail.current;if(!el||!first.current||!middle.current)return;
    const resize=()=>{const next=middle.current!.offsetLeft-first.current!.offsetLeft;if(next&&next!==width.current){const progress=width.current?(el.scrollLeft%width.current)/width.current:0;width.current=next;el.scrollLeft=next+progress*next;}};
    resize();const observer=new ResizeObserver(resize);observer.observe(middle.current);return()=>{observer.disconnect();clearTimeout(settle.current);};
  },[items]);
  useEffect(()=>{
    const el=rail.current;if(!el)return;
    const media=matchMedia("(prefers-reduced-motion: reduce)"), onMotion=()=>setReduced(media.matches), onVisibility=()=>setForeground(!document.hidden);
    const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.1});observer.observe(el);
    media.addEventListener("change",onMotion);document.addEventListener("visibilitychange",onVisibility);
    return()=>{observer.disconnect();media.removeEventListener("change",onMotion);document.removeEventListener("visibilitychange",onVisibility);};
  },[]);
  useEffect(()=>{
    const el=rail.current;if(!el||!playing)return;
    running.current=true;clearTimeout(settle.current);normalize();
    let frame=0,last=0,carry=0;
    const move=(now:number)=>{if(last){carry+=Math.min(now-last,50)*.032;const pixels=Math.floor(carry);if(pixels){carry-=pixels;el.scrollLeft+=pixels;if(el.scrollLeft>=2*width.current)normalize();}}last=now;frame=requestAnimationFrame(move);};
    frame=requestAnimationFrame(move);return()=>{running.current=false;cancelAnimationFrame(frame);};
  },[playing]);
  return <section className="vv-photo-gallery" aria-label={`${label} photography gallery`} data-autoplay={playing?"playing":"paused"}>
    <div className="vv-photo-gallery-heading"><span>{label}</span><span>{items.length} photographs</span></div>
    <div className="vv-photo-rail" ref={rail} tabIndex={0} role="region" aria-label={`Scrollable ${label.toLowerCase()} photographs`}
      onScroll={()=>{if(!running.current){clearTimeout(settle.current);settle.current=window.setTimeout(normalize,150);}}}
      onPointerMove={e=>{if(e.pointerType!=="touch"&&(e.movementX||e.movementY))setHovered(true);}} onPointerLeave={()=>setHovered(false)}
      onTouchStart={()=>setTouching(true)} onTouchEnd={()=>setTouching(false)} onTouchCancel={()=>setTouching(false)}
      onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}>
      <div className="vv-photo-track">
        {[0,1,2].map(copy=><div className="vv-photo-group" data-copy={copy} key={copy} ref={copy===0?first:copy===1?middle:undefined} aria-hidden={copy!==1?true:undefined}>
          {items.map(item=><figure className="vv-photo-card" key={item.image} style={{aspectRatio:item.width/item.height}}><img src={import.meta.env.BASE_URL+item.image} alt={copy===1?item.title:""} width={item.width} height={item.height} decoding="async" loading="lazy" draggable={false}/></figure>)}
        </div>)}
      </div>
    </div>
    <div className="vv-apple-controls vv-photo-controls"><span>{reduced?"Swipe or scroll to explore":"Moving gallery · hover or swipe to explore"}</span>{!reduced&&<button type="button" onClick={()=>setPaused(value=>!value)}>{paused?<Play size={15}/>:<Pause size={15}/>} {paused?"Play":"Pause"}</button>}</div>
    {credit&&<div className="vv-photo-credit"><a href={credit.url} target="_blank" rel="noreferrer">{credit.label}</a></div>}
  </section>;
}
