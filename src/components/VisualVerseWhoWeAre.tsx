import { PixelatedCanvas } from "@/components/ui/pixelated-canvas";

/** The image only: the existing Who We Are copy and section layout stay in HTML. */
export function VisualVerseWhoWeAre() {
  return (
    <PixelatedCanvas
      src="/about-photographer.webp"
      alt="Photographer holding a camera and looking through its lens"
      className="vv-about-pixel-image"
      responsive
      cellSize={8}
      dotScale={0.9}
      shape="square"
      backgroundColor="#eaf5f0"
      grayscale={false}
      dropoutStrength={0.025}
      interactive
      distortionMode="swirl"
      distortionStrength={19}
      distortionRadius={116}
      followSpeed={0.20}
      jitterStrength={0.6}
      jitterSpeed={3.2}
      tintStrength={0.02}
      tintColor="#2ec4b6"
      objectFit="cover"
      maxFps={22}
    />
  );
}
