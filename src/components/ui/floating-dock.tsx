"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

export type FloatingDockItem = {
  title: string;
  icon: ReactNode;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  danger?: boolean;
  key?: string;
};

export type FloatingDockProps = {
  items: FloatingDockItem[];
  utilities?: FloatingDockItem[];
  desktopClassName?: string;
  mobileClassName?: string;
};

/**
 * An Aceternity-style, macOS-inspired floating dock adapted for Visual Verse.
 * Unlike the upstream demo's mobile collapse button, this stays horizontal on
 * every screen so it replaces the Console's hamburger AND account dropdown.
 * The main navigation scrolls horizontally on smaller devices while account
 * utilities stay visible at the edge.
 */
export function FloatingDock({
  items,
  utilities = [],
  desktopClassName = "",
  mobileClassName = "",
}: FloatingDockProps) {
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY);

  return (
    <div className="vv-dock-positioner">
      <nav
        className={["vv-floating-dock", desktopClassName, mobileClassName].filter(Boolean).join(" ")}
        aria-label="Studio Console navigation"
        onPointerMove={(event) => {
          if (event.pointerType === "mouse") mouseX.set(event.clientX);
        }}
        onPointerLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            mouseX.set(Number.POSITIVE_INFINITY);
          }
        }}
      >
        <div className="vv-dock-scroll" role="group" aria-label="Studio sections">
          {items.map((item) => <DockIcon key={item.key ?? item.title} item={item} mouseX={mouseX} />)}
        </div>
        {utilities.length > 0 && (
          <>
            <span className="vv-dock-divider" aria-hidden="true" />
            <div className="vv-dock-utilities" role="group" aria-label="Account controls">
              {utilities.map((item) => <DockIcon key={item.key ?? item.title} item={item} mouseX={mouseX} />)}
            </div>
          </>
        )}
      </nav>
    </div>
  );
}

function DockIcon({ item, mouseX }: { item: FloatingDockItem; mouseX: MotionValue<number> }) {
  const ref = useRef<HTMLButtonElement>(null);
  const distance = useTransform(mouseX, (value) => {
    if (!Number.isFinite(value) || !ref.current) return Number.POSITIVE_INFINITY;
    const rect = ref.current.getBoundingClientRect();
    return Math.abs(value - rect.left - rect.width / 2);
  });
  const sizeValue = useTransform(distance, (value) => {
    if (!Number.isFinite(value)) return 44;
    return 44 + 20 * Math.max(0, 1 - value / 125);
  });
  const iconScaleValue = useTransform(distance, (value) => {
    if (!Number.isFinite(value)) return 1;
    return 1 + 0.2 * Math.max(0, 1 - value / 120);
  });
  const size = useSpring(sizeValue, { stiffness: 275, damping: 24, mass: 0.18 });
  const iconScale = useSpring(iconScaleValue, { stiffness: 275, damping: 22, mass: 0.16 });

  const activate = () => {
    if (item.onClick) item.onClick();
    else if (item.href) window.location.assign(item.href);
  };

  return (
    <motion.button
      ref={ref}
      className={[
        "vv-dock-item",
        item.active ? "vv-dock-item-active" : "",
        item.danger ? "vv-dock-item-danger" : "",
      ].filter(Boolean).join(" ")}
      type="button"
      style={{ width: size, height: size }}
      title={item.title}
      aria-label={item.title}
      aria-current={item.active ? "page" : undefined}
      onClick={activate}
    >
      <span className="vv-dock-tooltip" aria-hidden="true">{item.title}</span>
      <motion.span className="vv-dock-icon" style={{ scale: iconScale }} aria-hidden="true">
        {item.icon}
      </motion.span>
      <span className="vv-dock-mobile-label" aria-hidden="true">{item.title}</span>
      {item.active && <span className="vv-dock-active-indicator" aria-hidden="true" />}
    </motion.button>
  );
}
