import { useCallback, useEffect, useRef, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { Boxes } from "@/components/ui/background-boxes";
import { EncryptedText } from "@/components/ui/encrypted-text";
import { revealPublicPage } from "@/lib/public-page-startup";

// Count only time in a visible, painted document. A warm cache, background
// tab or busy mobile main thread must not finish the intro before it is seen.
function afterVisiblePaint(duration: number, complete: () => void) {
  let frame = 0, painted = 0, elapsed = 0, previous = 0;
  const tick = (now: number) => {
    if (document.hidden) { previous = 0; frame = requestAnimationFrame(tick); return; }
    if (painted < 2) { painted++; previous = now; frame = requestAnimationFrame(tick); return; }
    elapsed += previous ? Math.min(64, now - previous) : 0;
    previous = now;
    if (elapsed >= duration) complete();
    else frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(frame);
}

function PublicPreloader({ message }: { message: string }) {
  const [progress, setProgress] = useState(0);
  const completed = useRef(false);
  const cancelHold = useRef<(() => void) | null>(null);
  useEffect(() => () => cancelHold.current?.(), []);
  const onComplete = useCallback(() => {
    if (completed.current) return;
    completed.current = true;
    document.documentElement.dataset.vvTextComplete = "true";
    const finish = () => {
      document.documentElement.dataset.vvDecrypted = "true";
      revealPublicPage();
    };
    // Hold the complete transmission for 2.5 visible seconds so visitors
    // can actually read it, including visitors using reduced motion.
    cancelHold.current = afterVisiblePaint(2500, finish);
  }, []);
  return <>
    <Boxes className="vv-boot-boxes" />
    <div className="vv-boot-watermark" aria-hidden="true" />
    <div className="vv-boot-inner" role="status" aria-label={message}>
      <div className="vv-boot-label" aria-hidden="true"><span className="vv-boot-dot" />{progress === 1 ? "Signal acquired" : "Incoming transmission"}</div>
      <div className="vv-boot-message" data-message={message}>
        <EncryptedText text={message} revealDelayMs={1250 / message.length} flipDelayMs={45}
          encryptedClassName="vv-boot-scrambled" onComplete={onComplete} onProgress={setProgress} />
      </div>
      <div className="vv-boot-track" aria-hidden="true"><span className="vv-boot-track-fill" style={{ transform: `scaleX(${progress})` }} /></div>
    </div>
    <div className="vv-boot-coordinate" aria-hidden="true">Visual Verse / Creative universe</div>
  </>;
}

let loader: Root | null = null;
function mountPublicPreloader(restored = false) {
  const mount = document.getElementById("vv-loader-react-root");
  const root = document.documentElement;
  if (!mount || loader) return;
  if (restored) {
    // BFCache restores the entire DOM without executing the entry module again.
    // Re-arm only the loader; the route itself has already committed.
    root.dataset.vvBoot = "pending";
    root.dataset.vvPageReady = "true";
    delete root.dataset.vvDecrypted;
    delete root.dataset.vvTextComplete;
  }
  if (!root.hasAttribute("data-vv-boot")) return;
  loader = createRoot(mount);
  loader.render(<PublicPreloader message={root.dataset.vvMessage || "Welcome TO Our Universe..."} />);
}

window.addEventListener("vv-page-revealed", () => {
  const finished = loader;
  loader = null;
  if (finished) queueMicrotask(() => finished.unmount());
});
window.addEventListener("pageshow", event => {
  if (event.persisted && !document.documentElement.hasAttribute("data-vv-boot")) mountPublicPreloader(true);
});
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) revealPublicPage();
});
mountPublicPreloader();
