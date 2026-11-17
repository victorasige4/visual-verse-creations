"use client";

import { ImageGenerationLoader } from "@/components/ui/image-generation-loader";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// Aceternity image-generation-loader-demo styling adapted to Visual Verse.
export default function ImageGenerationLoaderDemo({ src, alt }: { src: string; alt: string }) {
  const reduced = useReducedMotion();
  const imageRef = useRef<HTMLImageElement>(null);
  const [revealed, setRevealed] = useState(() => !document.documentElement.hasAttribute("data-vv-boot"));
  const [decoded, setDecoded] = useState(false);
  useEffect(() => {
    const onReveal = () => setRevealed(true);
    window.addEventListener("vv-page-revealed", onReveal);
    if (!document.documentElement.hasAttribute("data-vv-boot")) onReveal();
    return () => window.removeEventListener("vv-page-revealed", onReveal);
  }, []);
  useEffect(() => {
    let cancelled = false;
    setDecoded(false);
    imageRef.current?.decode().then(() => { if (!cancelled) setDecoded(true); }, () => {});
    return () => { cancelled = true; };
  }, [src]);
  return (
    <figure className="vvx-serve-photo">
      <div className="vvx-serve-photo-frame">
        <img ref={imageRef} src={src} alt={alt} width={933} height={1400} decoding="async" fetchPriority="high" loading="eager" />
        {!reduced && revealed && decoded && (
          <ImageGenerationLoader
            effect="scale-wave"
            easing="ease-in-out"
            text="SERVING"
            cellSize={3}
            gap={1}
            bandHeight={48}
            duration={2300}
            repeat={true}
            overlayOpacity={0.16}
            colors={["#087989", "#8af6d9"]}
          />
        )}
      </div>
    </figure>
  );
}
