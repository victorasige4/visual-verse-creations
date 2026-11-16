import { useCallback, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Boxes } from "@/components/ui/background-boxes";
import { EncryptedText } from "@/components/ui/encrypted-text";
import { revealPublicPage } from "@/lib/public-page-startup";

function PublicPreloader({ message }: { message: string }) {
  const [progress, setProgress] = useState(0);
  const completed = useRef(false);
  const onComplete = useCallback(() => {
    if (completed.current) return;
    completed.current = true;
    document.documentElement.dataset.vvTextComplete = "true";
    const finish = () => {
      document.documentElement.dataset.vvDecrypted = "true";
      revealPublicPage();
    };
    // A brief final-word beat lets visitors read the decoded message.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) finish();
    else window.setTimeout(finish, 160);
  }, []);
  return <>
    <Boxes className="vv-boot-boxes" />
    <div className="vv-boot-watermark" aria-hidden="true" />
    <div className="vv-boot-inner" role="status" aria-label={message}>
      <div className="vv-boot-label" aria-hidden="true"><span className="vv-boot-dot" />{progress === 1 ? "Signal acquired" : "Incoming transmission"}</div>
      <div className="vv-boot-message" data-message={message}>
        <EncryptedText text={message} revealDelayMs={Math.min(30, 1050 / message.length)} flipDelayMs={45}
          encryptedClassName="vv-boot-scrambled" onComplete={onComplete} onProgress={setProgress} />
      </div>
      <div className="vv-boot-track" aria-hidden="true"><span className="vv-boot-track-fill" style={{ transform: `scaleX(${progress})` }} /></div>
    </div>
    <div className="vv-boot-coordinate" aria-hidden="true">Visual Verse / Creative universe</div>
  </>;
}

const mount = document.getElementById("vv-loader-react-root");
if (mount && document.documentElement.hasAttribute("data-vv-boot")) {
  const loader = createRoot(mount);
  // Schedule unmount outside the page's layout effect and immediately release
  // the background component's event listeners.
  window.addEventListener("vv-page-revealed", () => queueMicrotask(() => loader.unmount()), { once: true });
  loader.render(<PublicPreloader message={document.documentElement.dataset.vvMessage || "Welcome TO Our Universe..."} />);
}
