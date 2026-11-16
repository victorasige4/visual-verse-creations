import { useLayoutEffect } from "react";

/** Reveal only a committed route. Resolve intentional fragment links before
 * the first visible frame; all ordinary page loads begin at the hero. */
export function PublicPageReady() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (!root.hasAttribute("data-vv-boot")) return;
    let id = window.location.hash.slice(1);
    try { id = decodeURIComponent(id); } catch { /* malformed fragment */ }
    const aliases: Record<string, string> = { digital: "web-ui-ux", campaigns: "social-media" };
    const target = id ? document.getElementById(id) ?? document.getElementById(aliases[id] ?? "") : null;
    if (target) target.scrollIntoView({ block: "start", behavior: "instant" });
    else window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    root.removeAttribute("data-vv-boot");
  }, []);
  return null;
}
