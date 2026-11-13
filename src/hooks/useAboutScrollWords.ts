import { useEffect } from "react";

/**
 * Match the scroll-scrubbed word reveal from the homepage Who We Are headline:
 * muted words resolve progressively, left to right, into the brand's navy and
 * aqua as the text crosses the viewport. Dark areas use white and aqua.
 *
 * This effect is exclusive to the "What We Believe" statement on
 * the About page. All other headings and paragraphs keep their normal styling.
 */
const SELECTOR = ".vv-about-belief-statement";

type RGB = readonly [number, number, number];
const NAVY: RGB = [0, 63, 92];
const AQUA: RGB = [46, 196, 182];
const WHITE: RGB = [245, 255, 251];
const MUTED: RGB = [169, 185, 193];
const DARK_MUTED: RGB = [112, 154, 164];
const clamp = (value: number) => Math.max(0, Math.min(1, value));
type ScrollBlock = {
  element: HTMLElement;
  words: HTMLElement[];
  dark: boolean;
  markup: string;
  ariaLabel: string | null;
};

export function useAboutScrollWords() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".vv-about-editorial");
    if (!root) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Native colour and layout remain intact without JavaScript or with
    // reduced motion enabled from the start.
    if (media.matches) return;

    const blocks: ScrollBlock[] = [];
    const candidates = root.querySelectorAll<HTMLElement>(SELECTOR);
    candidates.forEach((element) => {
      const text = element.textContent?.replace(/\s+/g, " ").trim();
      if (!text) return;
      const markup = element.innerHTML;
      const ariaLabel = element.getAttribute("aria-label");
      const dark = Boolean(element.closest(".vv-about-belief, .vv-about-locations, .vv-about-final-panel"));

      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      const textNodes: Text[] = [];
      let node: Node | null;
      while ((node = walker.nextNode())) textNodes.push(node as Text);

      const words: HTMLElement[] = [];
      for (const textNode of textNodes) {
        const fragments = textNode.textContent?.match(/\s+|[^\s]+/g) || [];
        const fragment = document.createDocumentFragment();
        const accent = Boolean(textNode.parentElement?.closest("em, .vv-about-highlight"));
        const emphasized = Boolean(textNode.parentElement?.closest("strong"));
        for (const part of fragments) {
          if (/^\s+$/.test(part)) {
            fragment.appendChild(document.createTextNode(part));
            continue;
          }
          const word = document.createElement("span");
          word.className = "vv-about-scroll-word" + (accent ? " is-accent" : "") + (emphasized ? " is-emphasis" : "");
          word.textContent = part;
          fragment.appendChild(word);
          words.push(word);
        }
        textNode.parentNode?.replaceChild(fragment, textNode);
      }
      if (!words.length) return;

      element.setAttribute("data-vv-about-scroll-words", "true");
      // Match the accessible heading treatment used by the homepage version.
      if (/^H[1-6]$/.test(element.tagName)) element.setAttribute("aria-label", text);
      blocks.push({ element, words, dark, markup, ariaLabel });
    });

    if (!blocks.length) return;

    let frame = 0;
    const blend = (from: RGB, to: RGB, t: number) => {
      const values = from.map((channel, i) => Math.round(channel + (to[i] - channel) * t));
      return "rgb(" + values[0] + " " + values[1] + " " + values[2] + ")";
    };
    const render = () => {
      frame = 0;
      if (media.matches) return;
      const viewport = window.innerHeight;
      const start = viewport * .84;
      const finish = viewport * .23;
      for (const { element, words, dark } of blocks) {
        const rect = element.getBoundingClientRect();
        // Don't repaint offscreen copy on every scroll tick.
        if (rect.top > viewport + 120 || rect.bottom < -120) continue;
        const progress = clamp((start - rect.top) / Math.max(1, start - finish));
        const beginning = dark ? DARK_MUTED : MUTED;
        words.forEach((word, i) => {
          const position = i / Math.max(1, words.length - 1);
          // Deliberately the same 1.2 / .95 / .25 scrub curve as Who We Are.
          const amount = clamp((progress * 1.2 - position * .95) / .25);
          const eased = amount * amount * (3 - 2 * amount);
          const destination = word.classList.contains("is-accent") ? AQUA : dark ? WHITE : NAVY;
          word.style.color = blend(beginning, destination, eased);
          word.style.opacity = String(.76 + .24 * eased);
        });
      }
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(render);
    };
    const updateReduced = () => {
      if (media.matches) {
        for (const { words } of blocks) {
          words.forEach((word) => {
            word.style.removeProperty("color");
            word.style.removeProperty("opacity");
          });
        }
      } else schedule();
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    media.addEventListener("change", updateReduced);
    schedule();

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      media.removeEventListener("change", updateReduced);
      for (const { element, markup, ariaLabel } of blocks) {
        element.innerHTML = markup;
        element.removeAttribute("data-vv-about-scroll-words");
        if (ariaLabel === null) element.removeAttribute("aria-label");
        else element.setAttribute("aria-label", ariaLabel);
      }
    };
  }, []);
}
