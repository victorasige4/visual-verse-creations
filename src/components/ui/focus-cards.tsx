import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";
import "./focus-cards.css";

/**
 * Adapted from Aceternity UI's Focus Cards registry component.
 * Existing card content and interactive controls stay inside the card.
 * CSS handles shared hover state without pointer-event React re-renders.
 */
export function FocusCards({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div {...props} className={cn("vv-focus-cards", className)} />;
}

export function FocusCard({ className, ...props }: ComponentPropsWithoutRef<"article">) {
  return <article {...props} className={cn("vv-focus-card", className)} />;
}

export function FocusCardCaption({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div {...props} aria-hidden="true" className={cn("vv-focus-caption", className)} />;
}
