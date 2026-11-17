import "../public-motion.css";

/** Only public marketing surfaces; no authenticated dashboard behavior. */
export function mountPublicMotion() {
  if (!("IntersectionObserver" in window)) return;
  const selector = "main section, body > section, .vv-preview-section, .vv-close-marquee-section, .vv-close-footer-wrap, .vvx-ribbon, .vvx-edge-marquees";
  const observed = new Set<HTMLElement>();
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) entry.target.classList.toggle("vv-motion-offscreen", !entry.isIntersecting);
  }, { rootMargin: "140px 0px" });
  const scan = () => {
    for (const node of document.querySelectorAll<HTMLElement>(selector)) {
      if (!observed.has(node)) { observed.add(node); observer.observe(node); }
    }
    for (const node of observed) if (!node.isConnected) { observer.unobserve(node); observed.delete(node); }
  };
  let frame = 0;
  const mutations = new MutationObserver(records => {
    if (!records.some(record => [...record.addedNodes, ...record.removedNodes].some(node =>
      node instanceof HTMLElement && (node.matches(selector) || node.querySelector(selector))))) return;
    if (!frame) frame = requestAnimationFrame(() => { frame = 0; scan(); });
  });
  scan();
  mutations.observe(document.body, { childList: true, subtree: true });
  const visibility = () => document.documentElement.toggleAttribute("data-vv-tab-hidden", document.hidden);
  document.addEventListener("visibilitychange", visibility);
  visibility();
}
