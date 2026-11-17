"use client";

import { ImageGenerationLoader } from "@/components/ui/image-generation-loader";
import { useReducedMotion } from "motion/react";

// Aceternity image-generation-loader-demo styling adapted to Visual Verse.
export default function ImageGenerationLoaderDemo({ src, alt }: { src: string; alt: string }) {
  const reduced = useReducedMotion();
  return (
    <figure className="vvx-serve-photo">
      <div className="vvx-serve-photo-frame">
        <img src={src} alt={alt} width={933} height={1400} decoding="async" fetchPriority="high" />
        {!reduced && (
          <ImageGenerationLoader
            effect="scale-wave"
            easing="ease-in-out"
            text="SERVING"
            cellSize={3}
            gap={1}
            bandHeight={48}
            duration={5000}
            overlayOpacity={0.26}
            colors={["#087989", "#8af6d9"]}
          />
        )}
      </div>
    </figure>
  );
}
