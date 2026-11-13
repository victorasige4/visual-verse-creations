"use client";

/**
 * Visual Verse adaptation of Aceternity UI's official "3d-pin-demo":
 * https://ui.aceternity.com/registry/3d-pin-demo.json
 *
 * Uses the registry's PinContainer / PinPerspective composition, Motion
 * pulse rings and floating light-beam language, with accessible single-link
 * markup and Visual Verse navy + mint instead of upstream cyan/emerald.
 * Dependencies already installed: motion, React, clsx, tailwind-merge.
 */
import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "../../lib/utils";

export interface PinContainerProps {
  children: ReactNode;
  title?: string;
  href?: string;
  className?: string;
  containerClassName?: string;
}

export function PinContainer({
  children, title, href, className, containerClassName
}: PinContainerProps) {
  const [active, setActive] = useState(false);
  const reduceMotion = useReducedMotion();
  return (
    <a
      href={href ?? "#"}
      className={cn("vv-pin-container", containerClassName)}
      aria-label={title ? "Explore "+title : "Explore service"}
      onPointerEnter={event => { if(event.pointerType==="mouse")setActive(true); }}
      onPointerLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      data-pin-active={active}
    >
      <motion.div
        className="vv-pin-platform"
        animate={reduceMotion ? undefined : {
          rotateX: active ? 16 : 0,
          rotateY: active ? -7 : 0,
          y: active ? -18 : 0,
          scale: active ? .95 : 1
        }}
        transition={{type:"spring",stiffness:170,damping:22,mass:1.1}}
      >
        <div className={cn("vv-pin-face",className)}>{children}</div>
      </motion.div>
      <PinPerspective title={title} active={active} reduced={!!reduceMotion}/>
    </a>
  );
}

export function PinPerspective({
  title, active=false, reduced=false
}: {
  title?: string;
  href?: string;
  active?: boolean;
  reduced?: boolean;
}) {
  return (
    <div className={"vv-pin-perspective"+(active?" is-active":"")} aria-hidden="true">
      <motion.span
        className="vv-pin-floating-label"
        initial={false}
        animate={reduced ? undefined : {opacity:active?1:0,y:active?0:9}}
        transition={{duration:.38,ease:[.22,1,.36,1]}}
      >{title}</motion.span>
      <div className="vv-pin-halo-plane">
        {[0,2,4].map((delay,index)=>(
          <motion.span
            key={index}
            className="vv-pin-halo-ring"
            initial={{opacity:0,scale:0,x:"-50%",y:"-50%"}}
            animate={reduced?{opacity:0,scale:0}:{opacity:[0,.85,.55,0],scale:[0,1,1.18,1.32]}}
            transition={reduced?{duration:0}:{duration:6,repeat:Infinity,delay,ease:"easeOut"}}
          />
        ))}
      </div>
      <div className="vv-pin-beam"/>
      <div className="vv-pin-beam-core"/>
      <div className="vv-pin-beam-point"/>
    </div>
  );
}
