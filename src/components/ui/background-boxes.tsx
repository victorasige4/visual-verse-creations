import { memo, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import "./background-boxes.css";

/**
 * Aceternity UI Background Boxes, adapted from the registry's skewed grid.
 * A single CSS grid and one reusable hover tile replace 15,000 motion nodes.
 * Pointer events are observed on the host, so the process controls stay usable.
 */
export const Boxes = memo(function Boxes({className}:{className?:string}) {
  const root=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const layer=root.current, host=layer?.parentElement;
    if(!layer || !host || window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
    let frame=0, release=0;
    const move=(event:PointerEvent)=>{
      if(event.pointerType==="touch" && event.type==="pointermove" && event.buttons===0)return;
      window.clearTimeout(release);
      if(frame)cancelAnimationFrame(frame);
      frame=requestAnimationFrame(()=>{
        const bounds=layer.getBoundingClientRect();
        const x=event.clientX-bounds.left-bounds.width/2;
        const y=event.clientY-bounds.top-bounds.height/2;
        // inverse of skewX(-48deg) skewY(14deg)
        const b=Math.tan(14*Math.PI/180),a=Math.tan(-48*Math.PI/180);
        const gridX=x-a*y;
        const gridY=y-b*gridX;
        layer.style.setProperty("--box-x",Math.floor(gridX/64)*64+"px");
        layer.style.setProperty("--box-y",Math.floor(gridY/32)*32+"px");
        layer.style.setProperty("--box-lit","1");
      });
    };
    const leave=()=>{cancelAnimationFrame(frame);window.clearTimeout(release);layer.style.setProperty("--box-lit","0");};
    const end=(event:PointerEvent)=>{if(event.pointerType==="touch")release=window.setTimeout(leave,240);};
    host.addEventListener("pointermove",move,{passive:true});
    host.addEventListener("pointerdown",move,{passive:true});
    host.addEventListener("pointerup",end,{passive:true});
    host.addEventListener("pointercancel",leave);
    const exit=(event:PointerEvent)=>{if(event.pointerType!=="touch")leave();};
    host.addEventListener("pointerleave",exit);
    return ()=>{leave();host.removeEventListener("pointermove",move);host.removeEventListener("pointerdown",move);host.removeEventListener("pointerup",end);host.removeEventListener("pointercancel",leave);host.removeEventListener("pointerleave",exit);};
  },[]);
  return <div aria-hidden="true" ref={root} className={cn("vv-background-boxes",className)}><div className="vv-box-grid"><div className="vv-box-highlight"/></div></div>;
});
