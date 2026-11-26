import "../visual-verse-actions.css";
import { mountSiteBackgroundBeams } from "../components/VisualVerseBackgroundBeams";

import { mountPublicMotion } from "./public-motion";

mountSiteBackgroundBeams();
mountPublicMotion();

// Match the two home CTA buttons' gentle magnetic response without attaching
// one listener per button or running layout work for ordinary pointer movement.
let magnetic: HTMLElement | null = null;
let frame = 0;
let hit: Element | null = null;
let bounds: DOMRect | null = null;
let pointerX = 0, pointerY = 0;
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
function resetMagnetic() {
  magnetic?.style.removeProperty("--vv-action-x");
  magnetic?.style.removeProperty("--vv-action-y");
  magnetic=null;bounds=null;hit=null;
}
function updateMagnetic() {
  frame=0;
  if(!magnetic||reduced.matches)return;
  // Read only on target changes or viewport movement, not each pointer event.
  const rect=bounds??(bounds=magnetic.getBoundingClientRect());
  if(!rect.width||!rect.height)return;
  magnetic.style.setProperty("--vv-action-x",((pointerX-rect.left)/rect.width-.5)*11+"px");
  magnetic.style.setProperty("--vv-action-y",((pointerY-rect.top)/rect.height-.5)*9+"px");
}
document.addEventListener("pointermove",event=>{
  if(event.pointerType!=="mouse"||reduced.matches)return;
  pointerX=event.clientX;pointerY=event.clientY;
  const target=event.target instanceof Element?event.target:null;
  if(target!==hit){
    hit=target;
    const next=target?.closest<HTMLElement>(".vv-motion-action")??null;
    if(next!==magnetic){
      magnetic?.style.removeProperty("--vv-action-x");
      magnetic?.style.removeProperty("--vv-action-y");
      magnetic=next;bounds=null;
    }
  }
  if(magnetic&&!frame)frame=requestAnimationFrame(updateMagnetic);
},{passive:true});
const invalidate=()=>{bounds=null;if(magnetic&&!frame)frame=requestAnimationFrame(updateMagnetic);};
window.addEventListener("scroll",invalidate,{passive:true});
window.addEventListener("resize",invalidate,{passive:true});
document.addEventListener("pointerleave",()=>{cancelAnimationFrame(frame);frame=0;resetMagnetic();});
window.addEventListener("blur",()=>{cancelAnimationFrame(frame);frame=0;resetMagnetic();});
reduced.addEventListener("change",()=>{if(reduced.matches){cancelAnimationFrame(frame);frame=0;resetMagnetic();}});

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
