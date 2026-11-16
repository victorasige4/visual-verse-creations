/** A public route is revealed only after its hero has committed and the
 * transmission has been completely decrypted and painted. */
export function revealPublicPage() {
  const root = document.documentElement;
  if (document.hidden || !root.hasAttribute("data-vv-boot") || root.dataset.vvPageReady !== "true" || root.dataset.vvDecrypted !== "true") return;
  let id = window.location.hash.slice(1);
  try { id = decodeURIComponent(id); } catch { /* malformed fragment */ }
  const aliases: Record<string, string> = { digital: "web-ui-ux", campaigns: "social-media" };
  const target = id ? document.getElementById(id) ?? document.getElementById(aliases[id] ?? "") : null;
  if (target) target.scrollIntoView({ block: "start", behavior: "instant" });
  else window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  root.removeAttribute("data-vv-boot");
  // Tear down the grid and its pointer listener as soon as the page is visible.
  window.dispatchEvent(new Event("vv-page-revealed"));
}
