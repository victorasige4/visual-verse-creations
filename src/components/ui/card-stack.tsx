import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Aceternity UI Card Stack, adapted for an externally controlled active card.
 * Pattern: https://ui.aceternity.com/components/card-stack
 * Unlike the default testimonial demo, any React artwork may be supplied.
 */
export type CardStackItem = {
  id: number;
  label: string;
  content: ReactNode;
};

type CardStackProps = {
  items: CardStackItem[];
  activeIndex: number;
  offset?: number;
  scaleFactor?: number;
  className?: string;
};

export function CardStack({
  items,
  activeIndex,
  offset = 22,
  scaleFactor = 0.065,
  className,
}: CardStackProps) {
  const reduceMotion = useReducedMotion();
  if (!items.length) return null;
  const current = ((activeIndex % items.length) + items.length) % items.length;

  return (
    <div className={cn("vv-about-acet-stack", className)} role="img" aria-label={items[current].label}>
      {items.map((item, index) => {
        const depth = (index - current + items.length) % items.length;
        return (
          <motion.div
            className={"vv-about-acet-card" + (depth === 0 ? " is-front" : "")}
            key={item.id}
            initial={false}
            animate={{
              y: depth * offset,
              x: depth * -10,
              scale: 1 - depth * scaleFactor,
              rotate: depth === 0 ? -5 : depth === 1 ? -1 : 4,
              opacity: 1 - depth * 0.13,
            }}
            transition={reduceMotion ? { duration: 0 } : {
              type: "spring",
              stiffness: 225,
              damping: 27,
              mass: 1.05,
            }}
            style={{ zIndex: items.length - depth, pointerEvents: depth === 0 ? "auto" : "none" }}
            aria-hidden={depth !== 0}
          >
            {item.content}
          </motion.div>
        );
      })}
    </div>
  );
}
