import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Aceternity Resizable Navbar-inspired primitives adapted to the existing
 * Visual Verse navigation: full links remain visible, no hamburger/offcanvas.
 * The external registry JSON was not accessible in this environment.
 */
export function Navbar({ compact, children, className }:{
  compact:boolean; children:ReactNode; className?:string;
}) {
  const reduced=useReducedMotion();
  return <motion.header
    layout={!reduced}
    transition={reduced?{duration:0}:{type:"spring",stiffness:240,damping:29,mass:.9}}
    className={cn("vv-nav2 vv-nav-resizable",compact?"is-compact":"is-expanded",className)}
    aria-label="Visual Verse Creations navigation">
      {children}
    </motion.header>;
}

export function NavBody({children,className}:{children:ReactNode;className?:string}) {
  const reduced=useReducedMotion();
  return <motion.div layout={!reduced}
    transition={reduced?{duration:0}:{type:"spring",stiffness:250,damping:30}}
    className={cn("vv-nav2-island vv-nav-resize-body",className)}>
    {children}
  </motion.div>;
}
