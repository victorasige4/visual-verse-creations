import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * Aceternity Navbar Menu-inspired Motion primitives.
 * These TypeScript components can be replaced with the official registry
 * component through "npx shadcn@latest add @aceternity/navbar-menu".
 * The explicit API preserves Visual Verse's existing link structure.
 */
export type MenuId = "services" | "audiences";

type MenuItemProps = {
  item: MenuId;
  label: string;
  active: MenuId | null;
  setActive: (value: MenuId | null) => void;
};

export function MenuItem({ item, label, active, setActive }: MenuItemProps) {
  const expanded = active === item;
  return (
    <button
      type="button"
      className={cn("vv-island-link vv-island-menu-trigger", expanded && "is-active")}
      aria-expanded={expanded}
      aria-haspopup="true"
      aria-controls="vv-island-mega"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setActive(item);
      }}
      onFocus={() => setActive(item)}
      onClick={() => setActive(expanded ? null : item)}
    >
      <span>{label}</span>
      <ChevronDown size={13} strokeWidth={2} aria-hidden="true" className="vv-island-chevron" />
    </button>
  );
}

type MenuPanelProps = {
  active: MenuId | null;
  children: ReactNode;
};

export function MenuPanel({ active, children }: MenuPanelProps) {
  return (
    <AnimatePresence mode="wait">
      {active && (
        <motion.div
          id="vv-island-mega"
          className="vv-island-mega"
          role="group"
          aria-label={active === "services" ? "Services menu" : "Who we serve menu"}
          key={active}
          initial={{ opacity: 0, y: -10, scale: 0.975, rotateX: -5 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
          exit={{ opacity: 0, y: -8, scale: 0.985 }}
          transition={{ duration: 0.23, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type HoveredLinkProps = {
  href: string;
  children: ReactNode;
  onClick?: () => void;
};

export function HoveredLink({ href, children, onClick }: HoveredLinkProps) {
  return (
    <a href={href} className="vv-island-dropdown-link" onClick={onClick}>
      {children}
      <span className="vv-island-link-arrow" aria-hidden="true">↗</span>
    </a>
  );
}
