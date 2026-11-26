import { useLayoutEffect } from "react";
import { revealPublicPage } from "@/lib/public-page-startup";
import { mountHeroCubes } from "@/lib/hero-cubes";

/** Mark only a committed route ready; the transmission is independently gated. */
export function PublicPageReady() {
  useLayoutEffect(() => {
    // Draw the landing background synchronously after the committed route,
    // before the preloader allows the first public page paint.
    mountHeroCubes();
    const root = document.documentElement;
    if (!root.hasAttribute("data-vv-boot")) return;
    root.dataset.vvPageReady = "true";
    revealPublicPage();
  }, []);
  return null;
}
