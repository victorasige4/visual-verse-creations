import "../visual-verse-actions.css";
import { mountSiteBackgroundBeams } from "../components/VisualVerseBackgroundBeams";

import { mountPublicMotion } from "./public-motion";

mountSiteBackgroundBeams();
mountPublicMotion();

// Match the two home CTA buttons' gentle magnetic response without attaching
// one listener per button or running layout work for ordinary pointer movement.
let magnetic: HTMLElement | null = null;
let frame = 0;
document.addEventListener("pointermove", event => {
  if (event.pointerType !== "mouse") return;
  const next = (event.target as Element | null)?.closest<HTMLElement>(".vv-motion-action") ?? null;
  if (magnetic !== next) {
    magnetic?.style.removeProperty("--vv-action-x");
    magnetic?.style.removeProperty("--vv-action-y");
    magnetic = next;
  }
  cancelAnimationFrame(frame);
  if (!next || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  frame = requestAnimationFrame(() => {
    const rect = next.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    next.style.setProperty("--vv-action-x", `${((event.clientX - rect.left) / rect.width - .5) * 11}px`);
    next.style.setProperty("--vv-action-y", `${((event.clientY - rect.top) / rect.height - .5) * 9}px`);
  });
}, { passive: true });
document.addEventListener("pointerleave", () => {
  cancelAnimationFrame(frame);
  magnetic?.style.removeProperty("--vv-action-x");
  magnetic?.style.removeProperty("--vv-action-y");
  magnetic = null;
});

// The legacy homepage has a few server-rendered anchors outside React islands.
export function enhanceStaticActions() {
  document.querySelectorAll<HTMLAnchorElement>(".vv-hero-actions .vv-pill-button, .vv-about-more, .vv-preview-portfolio-link").forEach(anchor => {
    if (anchor.classList.contains("vv-motion-action")) return;
    const label = anchor.textContent?.trim();
    const icon = anchor.querySelector("svg");
    if (!label || !icon) return;
    const mask = document.createElement("span"); mask.className = "vv-action-mask";
    const roll = document.createElement("span"); roll.className = "vv-action-roll";
    const first = document.createElement("span"); first.textContent = label;
    const duplicate = first.cloneNode(true) as HTMLElement; duplicate.setAttribute("aria-hidden", "true");
    roll.append(first, duplicate); mask.append(roll);
    const disc = document.createElement("span"); disc.className = "vv-action-disc"; disc.setAttribute("aria-hidden", "true");
    disc.append(icon); anchor.replaceChildren(mask, disc);
    anchor.classList.add("vv-motion-action", anchor.classList.contains("vv-pill-dark") ? "vv-action-dark" : anchor.classList.contains("vv-pill-light") ? "vv-action-secondary" : "vv-action-primary");
  });
}
