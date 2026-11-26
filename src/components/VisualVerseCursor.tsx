import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "../visual-verse-cursor.css";

/**
 * Potadot-style precision cursor adapted to Visual Verse's navy/aqua palette.
 * A tiny precise core follows the pointer; a soft elastic orbit catches up.
 * Enlarges contextually for clickable elements. Never captures pointer events.
 * Native cursor, touch behaviour and text selection remain intact when needed.
 */
export function VisualVerseCursor() {
  const coreRef=useRef<HTMLSpanElement>(null);
  const orbitRef=useRef<HTMLSpanElement>(null);
  const labelRef=useRef<HTMLSpanElement>(null);
  const [modalHost,setModalHost]=useState<HTMLDialogElement|null>(null);

  // Native modal dialogs live in the browser's top layer, above even the
  // highest document z-index. Mount the same cursor inside the foremost
  // dialog so it remains visible (including nested creative-card details).
  useEffect(()=>{
    const sync=()=>{
      const open=Array.from(document.querySelectorAll<HTMLDialogElement>("dialog:modal"));
      setModalHost(open[open.length-1]??null);
    };
    const observer=new MutationObserver(records=>{
      if(records.some(record=>record.type==="attributes"&&record.target instanceof HTMLDialogElement||record.type==="childList"&&[...record.addedNodes,...record.removedNodes].some(node=>node instanceof Element&&(node.matches("dialog")||node.querySelector("dialog")))))sync();
    });
    observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:["open"]});
    sync();
    return ()=>observer.disconnect();
  },[]);

  useEffect(()=>{
    const core=coreRef.current,orbit=orbitRef.current,label=labelRef.current;
    if(!core||!orbit||!label)return;
    const fine=window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
    if(!fine.matches||reduced.matches)return;

    const html=document.documentElement;
    let px=-100,py=-100,ox=-100,oy=-100,lastTime=0;
    let frame=0,enabled=false,shown=false,lastTarget:Element|null=null,lastHit:Element|null=null;
    const interactiveSelector="a,button,[role='button'],summary,[data-cursor],input[type='submit'],input[type='button']";
    const textSelector="input:not([type='submit']):not([type='button']),textarea,select,[contenteditable='true'],[role='textbox']";
    const setVisible=(show:boolean)=>{
      if(shown===show)return;
      shown=show;core.classList.toggle("is-visible",show);orbit.classList.toggle("is-visible",show);
    };
    const tick=(time:number)=>{
      frame=0;if(!shown||document.hidden){lastTime=0;return;}
      const dt=lastTime?Math.min(40,time-lastTime):16.67;lastTime=time;
      const blend=1-Math.exp(-dt/48);
      ox+=(px-ox)*blend;oy+=(py-oy)*blend;
      if(Math.abs(px-ox)+Math.abs(py-oy)<.3){ox=px;oy=py;}
      core.style.transform="translate3d("+px+"px,"+py+"px,0) translate(-50%,-50%)";
      orbit.style.transform="translate3d("+ox+"px,"+oy+"px,0) translate(-50%,-50%)";
      if(ox!==px||oy!==py)frame=requestAnimationFrame(tick);else lastTime=0;
    };
    const onMove=(event:PointerEvent)=>{
      if(event.pointerType!=="mouse")return;
      px=event.clientX;py=event.clientY;
      if(!enabled){enabled=true;html.classList.add("vv-custom-cursor-enabled")}
      const target=event.target instanceof Element?event.target:null;
      if(target!==lastHit){
        lastHit=target;
        if(target?.closest(textSelector)){
          setVisible(false);orbit.classList.remove("is-interactive");lastTarget=null;cancelAnimationFrame(frame);frame=0;lastTime=0;return;
        }
        const interactive=target?.closest(interactiveSelector)||null;
        if(interactive!==lastTarget){
          lastTarget=interactive;orbit.classList.toggle("is-interactive",!!interactive);
          label.textContent=interactive?.getAttribute("data-cursor")||((interactive?.tagName==="A")?"OPEN":"VIEW");
        }
      }else if(!shown&&target?.closest(textSelector))return;
      if(!shown){ox=px;oy=py;lastTime=0;setVisible(true);}
      if(!frame)frame=requestAnimationFrame(tick);
    };
    const onDown=()=>{if(shown)orbit.classList.add("is-pressed")};
    const onUp=()=>{orbit.classList.remove("is-pressed")};
    const onLeave=()=>{setVisible(false);cancelAnimationFrame(frame);frame=0;lastTime=0;lastHit=null;orbit.classList.remove("is-pressed");};
    const onEnter=()=>{lastHit=null;};
    window.addEventListener("pointermove",onMove,{passive:true});
    window.addEventListener("pointerdown",onDown,{passive:true});
    window.addEventListener("pointerup",onUp,{passive:true});
    document.addEventListener("mouseleave",onLeave);
    document.addEventListener("mouseenter",onEnter);
    const onBlur=onLeave;
    window.addEventListener("blur",onBlur);
    return ()=>{
      window.cancelAnimationFrame(frame);
      html.classList.remove("vv-custom-cursor-enabled");
      window.removeEventListener("pointermove",onMove);
      window.removeEventListener("pointerdown",onDown);
      window.removeEventListener("pointerup",onUp);
      window.removeEventListener("blur",onBlur);
      document.removeEventListener("mouseleave",onLeave);
      document.removeEventListener("mouseenter",onEnter);
    };
  },[modalHost]);

  const layer=<div className="vv-cursor-layer" aria-hidden="true">
    <span className="vv-cursor-core" ref={coreRef}><i/></span>
    <span className="vv-cursor-orbit" ref={orbitRef}>
      <span className="vv-cursor-orbit-tick"/><span className="vv-cursor-orbit-label" ref={labelRef}/>
    </span>
  </div>;
  return modalHost?createPortal(layer,modalHost):layer;
}
