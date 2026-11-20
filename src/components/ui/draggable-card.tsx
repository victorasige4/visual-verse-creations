import { useRef, type ReactNode, type RefObject } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";

/** Aceternity Draggable Card, adapted for bounded portrait artwork and touch. */
export function DraggableCardBody({children, constraints, x, y, rotation, layer, aspectRatio=0.8, label, selected, onSelect}: {
  children:ReactNode; constraints:RefObject<HTMLDivElement|null>; x:number; y:number; rotation:number;
  layer:number; aspectRatio?:number; label:string; selected:boolean; onSelect:()=>void;
}) {
  const card=useRef<HTMLButtonElement>(null);
  const mouseX=useMotionValue(0), mouseY=useMotionValue(0);
  const reduce=useReducedMotion();
  const rotateX=useSpring(useTransform(mouseY,[-120,120],[9,-9]),{stiffness:150,damping:23});
  const rotateY=useSpring(useTransform(mouseX,[-120,120],[-9,9]),{stiffness:150,damping:23});
  const resetTilt=()=>{mouseX.set(0);mouseY.set(0);};
  return <motion.button type="button" ref={card} className="vv-draggable-card" data-cursor="DRAG" aria-label={label} aria-pressed={selected}
    drag dragConstraints={constraints} dragElastic={.04} dragMomentum={false}
    onDragStart={onSelect} onDragEnd={resetTilt} onClick={onSelect} onFocus={onSelect}
    style={{left:`calc(3% + (94% - var(--campaign-card-width)) * ${x/83})`,top:`${y}%`,aspectRatio,zIndex:layer,rotate:rotation,rotateX:reduce?0:rotateX,rotateY:reduce?0:rotateY}}
    whileHover={reduce?undefined:{scale:1.025}} whileDrag={{scale:1.045}}
    onPointerMove={event=>{if(reduce||event.pointerType!=="mouse"||!card.current)return;const rect=card.current.getBoundingClientRect();mouseX.set(event.clientX-rect.left-rect.width/2);mouseY.set(event.clientY-rect.top-rect.height/2);}}
    onPointerLeave={resetTilt}>{children}</motion.button>;
}
