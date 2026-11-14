"use client";

/**
 * The original Visual Verse 3D Pin interaction, ported from
 * victorasige4/visual-verse-studio/src/components/ui/3d-pin.tsx.
 * Based on Aceternity's official 3d-pin-demo / 3d-pin registry.
 *
 * This version retains the original 40-degree lift, 0.8 hover scale,
 * three staggered pulse rings, cyan light beam, label and service highlights.
 * A single anchor keeps the full card keyboard accessible without nested links.
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
  highlights?: readonly string[];
}

export function PinContainer({
  children, title, href, className, containerClassName, highlights
}: PinContainerProps) {
  const [active, setActive] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <a
      href={href ?? "#"}
      className={cn("vv-pin-container", containerClassName)}
      aria-label={title ? "Explore " + title : "Explore service"}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse" || event.pointerType === "pen") setActive(true);
      }}
      onPointerLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      data-pin-active={active}
      data-pin-highlights={!!highlights?.length}
    >
      <motion.div
        className="vv-pin-platform"
        initial={false}
        animate={reduceMotion
          ? { rotateX: 0, scale: 1, y: 0 }
          : { rotateX: active ? 40 : 0, scale: active ? 0.8 : 1, y: 0 }
        }
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={cn("vv-pin-face", className)}>{children}</div>
      </motion.div>
      <PinPerspective
        title={title}
        highlights={highlights}
        active={active}
        reduced={!!reduceMotion}
      />
    </a>
  );
}

export function PinPerspective({
  title,
  highlights,
  active = false,
  reduced = false
}: {
  title?: string;
  href?: string;
  highlights?: readonly string[];
  active?: boolean;
  reduced?: boolean;
}) {
  return (
    <div
      className={cn("vv-pin-perspective", active && !reduced && "is-active")}
      aria-hidden="true"
    >
      <div className="vv-pin-tooltip">
        {title && <span className="vv-pin-floating-label">{title}</span>}
        {!!highlights?.length && (
          <ul className="vv-pin-highlights">
            {highlights.slice(0, 5).map((highlight) => (
              <li key={highlight}>
                <span className="vv-pin-highlight-dot"/>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="vv-pin-halo-plane">
        {[0, 2, 4].map((delay) => (
          <motion.span
            key={delay}
            className="vv-pin-halo-ring"
            initial={false}
            animate={reduced || !active
              ? { opacity: 0, scale: 0, x: "-50%", y: "-50%" }
              : {
                  opacity: [0, 1, 0.5, 0],
                  scale: [0, 1, 1.14, 1.32],
                  x: "-50%",
                  y: "-50%"
                }
            }
            transition={reduced || !active
              ? { duration: 0.15 }
              : { duration: 6, repeat: Infinity, delay, ease: "easeOut" }
            }
          />
        ))}
      </div>
      <span className="vv-pin-beam vv-pin-beam--glow"/>
      <span className="vv-pin-beam vv-pin-beam--core"/>
      <span className="vv-pin-beam-point vv-pin-beam-point--glow"/>
      <span className="vv-pin-beam-point vv-pin-beam-point--core"/>
    </div>
  );
}
