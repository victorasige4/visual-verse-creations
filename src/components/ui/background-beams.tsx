"use client";

import { memo, useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import "./background-beams.css";

// Aceternity Background Beams (Manu Arora), adapted from the component registry
// for Visual Verse's light page surfaces. The original cubic paths form a
// repeatable tile, so even long sections retain the same beam density.
const paths = Array.from({ length: 58 }, (_, i) => {
  const x = i * 7;
  const y = i * 8;
  return `M${-380 + x} ${-189 - y}C${-380 + x} ${-189 - y} ${-312 + x} ${216 - y} ${152 + x} ${343 - y}C${616 + x} ${470 - y} ${684 + x} ${875 - y} ${684 + x} ${875 - y}`;
});
const animatedPaths = paths.filter((_, i) => i % 5 === 1);
const basePath = paths.join("");

export const BackgroundBeams = memo(function BackgroundBeams({ className }: { className?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(1168);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const measure = () => setWidth(Math.max(1, Math.round(node.clientWidth)));
    measure();
    const resize = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(measure);
    resize?.observe(node);
    if (!resize) window.addEventListener("resize", measure);
    const observer = typeof IntersectionObserver === "undefined" ? undefined :
      new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "80px" });
    if (observer) observer.observe(node);
    else setVisible(true);
    return () => { resize?.disconnect(); observer?.disconnect(); window.removeEventListener("resize", measure); };
  }, []);
  const tileWidth = Math.max(760, width);
  const tileHeight = Math.max(380, Math.round(tileWidth * 316 / 696));
  const moving = visible && !reducedMotion;
  return (
    <div ref={ref} className={cn("vv-background-beams", className)} aria-hidden="true">
      <svg width="100%" height="100%" fill="none" focusable="false" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`${id}-fade`} x1="0" x2="0" y1="0" y2="1">
            <stop stopColor="white" stopOpacity="0"/>
            <stop offset=".16" stopColor="white"/>
            <stop offset=".84" stopColor="white"/>
            <stop offset="1" stopColor="white" stopOpacity="0"/>
          </linearGradient>
          <mask id={`${id}-mask`} maskUnits="userSpaceOnUse" x="0" y="0" width="696" height="316">
            <rect width="696" height="316" fill={`url(#${id}-fade)`}/>
          </mask>
          {moving && animatedPaths.map((_, i) => (
            <motion.linearGradient key={i} id={`${id}-beam-${i}`}
              initial={{ x1: "0%", x2: "0%", y1: "0%", y2: "0%" }}
              animate={{ x1: ["0%", "100%"], x2: ["0%", "95%"], y1: ["0%", "100%"], y2: ["0%", "100%"] }}
              transition={{ duration: 12 + (i % 5) * 2, ease: "easeInOut", repeat: Infinity, delay: i * .7 }}>
              <stop stopColor="#2ec4b6" stopOpacity="0"/>
              <stop offset=".18" stopColor="#2ec4b6"/>
              <stop offset=".48" stopColor="#128b82"/>
              <stop offset="1" stopColor="#003f5c" stopOpacity="0"/>
            </motion.linearGradient>
          ))}
          <pattern id={`${id}-tile`} width={tileWidth} height={tileHeight} patternUnits="userSpaceOnUse"
            viewBox="0 0 696 316" preserveAspectRatio="xMidYMid slice">
            <g mask={`url(#${id}-mask)`}>
              <path d={basePath} stroke="#128b82" strokeOpacity=".16" strokeWidth=".6"/>
              {moving && animatedPaths.map((path, i) => (
                <path key={i} d={path} stroke={`url(#${id}-beam-${i})`} strokeOpacity=".55" strokeWidth=".8"/>
              ))}
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id}-tile)`}/>
      </svg>
    </div>
  );
});
