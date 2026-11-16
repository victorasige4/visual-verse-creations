import { useLayoutEffect } from "react";
import { revealPublicPage } from "@/lib/public-page-startup";

/** Mark only a committed route ready; the transmission is independently gated. */
export function PublicPageReady() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (!root.hasAttribute("data-vv-boot")) return;
    root.dataset.vvPageReady = "true";
    revealPublicPage();
  }, []);
  return null;
}
