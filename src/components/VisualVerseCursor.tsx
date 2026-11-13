import { useEffect, useRef } from "react";
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

  useEffect(()=>{
    const core=coreRef.current,orbit=orbitRef.current,label=labelRef.current;
    if(!core||!orbit||!label)return;
    const fine=window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
    if(!fine.matches||reduced.matches)return;

    const html=document.documentElement;
    let px=-100,py=-100,ox=-100,oy=-100;
    let frame=0,enabled=false,lastTarget:Element|null=null;
    const interactiveSelector="a,button,[role='button'],summary,[data-cursor],input[type='submit'],input[type='button']";
    const textSelector="input:not([type='submit']):not([type='button']),textarea,select,[contenteditable='true'],[role='textbox']";
    const setVisible=(show:boolean)=>{
      core.classList.toggle("is-visible",show);
      orbit.classList.toggle("is-visible",show);
    };
    const onMove=(event:PointerEvent)=>{
      if(event.pointerType!=="mouse")return;
      px=event.clientX;py=event.clientY;
      if(!enabled){enabled=true;html.classList.add("vv-custom-cursor-enabled")}
      const target=event.target instanceof Element?event.target:null;
      if(target&&target.closest(textSelector)){
        setVisible(false);
        orbit.classList.remove("is-interactive");
        return;
      }
      setVisible(true);
      core.style.transform="translate3d("+px+"px,"+py+"px,0) translate(-50%,-50%)";
      const interactive=target?.closest(interactiveSelector)||null;
      if(interactive!==lastTarget){
        lastTarget=interactive;
        orbit.classList.toggle("is-interactive",!!interactive);
        const custom=interactive?.getAttribute("data-cursor");
        label.textContent=custom||((interactive?.tagName==="A")?"OPEN":"VIEW");
      }
    };
    const onDown=()=>{orbit.classList.add("is-pressed")};
    const onUp=()=>{orbit.classList.remove("is-pressed")};
    const onLeave=()=>setVisible(false);
    const onEnter=()=>{if(enabled)setVisible(true)};
    const tick=()=>{
      ox+=(px-ox)*.19;
      oy+=(py-oy)*.19;
      orbit.style.transform="translate3d("+ox+"px,"+oy+"px,0) translate(-50%,-50%)";
      frame=window.requestAnimationFrame(tick);
    };
    frame=window.requestAnimationFrame(tick);
    window.addEventListener("pointermove",onMove,{passive:true});
    window.addEventListener("pointerdown",onDown,{passive:true});
    window.addEventListener("pointerup",onUp,{passive:true});
    document.addEventListener("mouseleave",onLeave);
    document.addEventListener("mouseenter",onEnter);
    const onBlur=()=>setVisible(false);
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
  },[]);

  return <div className="vv-cursor-layer" aria-hidden="true">
    <span className="vv-cursor-core" ref={coreRef}><i/></span>
    <span className="vv-cursor-orbit" ref={orbitRef}>
      <span className="vv-cursor-orbit-tick"/><span className="vv-cursor-orbit-label" ref={labelRef}/>
    </span>
  </div>;
}
