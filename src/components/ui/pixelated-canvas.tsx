import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Aceternity Pixelated Canvas-inspired React component.
 * API follows the documented Aceternity props.
 * Uses the browser's 2D Canvas API, requiring no new runtime dependencies.
 */
export type PixelatedCanvasProps = {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  cellSize?: number;
  dotScale?: number;
  shape?: "circle" | "square";
  backgroundColor?: string;
  grayscale?: boolean;
  className?: string;
  responsive?: boolean;
  dropoutStrength?: number;
  interactive?: boolean;
  distortionStrength?: number;
  distortionRadius?: number;
  distortionMode?: "repel" | "attract" | "swirl";
  followSpeed?: number;
  sampleAverage?: boolean;
  tintColor?: string;
  tintStrength?: number;
  maxFps?: number;
  objectFit?: "cover" | "contain" | "fill" | "none";
  jitterStrength?: number;
  jitterSpeed?: number;
  fadeOnLeave?: boolean;
  fadeSpeed?: number;
};

type Sample = {
  x: number;
  y: number;
  r: number;
  g: number;
  b: number;
  a: number;
  seed: number;
};

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

function parseHex(value: string): [number, number, number] {
  const h = value.replace("#", "");
  if (/^[\da-f]{3}$/i.test(h)) {
    return [parseInt(h[0] + h[0], 16), parseInt(h[1] + h[1], 16), parseInt(h[2] + h[2], 16)];
  }
  if (/^[\da-f]{6}$/i.test(h)) {
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  return [255, 255, 255];
}

export function PixelatedCanvas({
  src,
  alt = "Pixelated photographic portrait",
  width = 400,
  height = 500,
  cellSize = 5,
  dotScale = 0.92,
  shape = "square",
  backgroundColor = "#edf7f4",
  grayscale = false,
  className,
  responsive = true,
  dropoutStrength = 0,
  interactive = true,
  distortionStrength = 12,
  distortionRadius = 100,
  distortionMode = "swirl",
  followSpeed = 0.16,
  sampleAverage = true,
  tintColor = "#ffffff",
  tintStrength = 0,
  maxFps = 40,
  objectFit = "cover",
  jitterStrength = 1,
  jitterSpeed = 3,
  fadeOnLeave = true,
  fadeSpeed = 0.12,
}: PixelatedCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !context) return;
    let cancelled = false;
    let visible = true;
    let frame = 0;
    let lastFrame = 0;
    let samples: Sample[] = [];
    let w = 0;
    let h = 0;
    let ratio = 1;
    let intensity = 0;
    let targetX = -1000;
    let targetY = -1000;
    let currentX = -1000;
    let currentY = -1000;
    let hovering = false;
    let still = false;
    const input = new Image();
    input.decoding = "async";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");
    const canInteract = () => interactive && !reduceMotion.matches && finePointer.matches;
    const step = Math.max(3, cellSize);
    const tint = parseHex(tintColor);
    const tintAmount = clamp(tintStrength, 0, 1);

    function draw(now: number) {
      if (!context) return;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, w, h);
      const size = step * clamp(dotScale, 0.1, 1);
      const radius = Math.max(1, distortionRadius);
      for (const sample of samples) {
        let dx = 0;
        let dy = 0;
        if (intensity > 0.002) {
          const vx = sample.x - currentX;
          const vy = sample.y - currentY;
          const distance = Math.hypot(vx, vy);
          if (distance < radius) {
            const effect = (1 - distance / radius) ** 2 * intensity;
            const angle = Math.atan2(vy, vx);
            const direction = distortionMode === "attract" ? -1 : 1;
            if (distortionMode === "swirl") {
              dx = -Math.sin(angle) * distortionStrength * effect;
              dy = Math.cos(angle) * distortionStrength * effect;
            } else {
              dx = Math.cos(angle) * distortionStrength * effect * direction;
              dy = Math.sin(angle) * distortionStrength * effect * direction;
            }
            const jitter = jitterStrength * effect;
            dx += Math.sin(sample.seed + now * 0.001 * jitterSpeed) * jitter;
            dy += Math.cos(sample.seed * 1.7 + now * 0.001 * jitterSpeed) * jitter;
          }
        }
        const r = Math.round(sample.r * (1 - tintAmount) + tint[0] * tintAmount);
        const g = Math.round(sample.g * (1 - tintAmount) + tint[1] * tintAmount);
        const b = Math.round(sample.b * (1 - tintAmount) + tint[2] * tintAmount);
        context.fillStyle = `rgba(${r},${g},${b},${sample.a / 255})`;
        if (shape === "circle") {
          context.beginPath();
          context.arc(sample.x + dx, sample.y + dy, size * 0.5, 0, Math.PI * 2);
          context.fill();
        } else {
          context.fillRect(sample.x + dx - size / 2, sample.y + dy - size / 2, size, size);
        }
      }
    }

    function tick(now: number) {
      if (cancelled || !visible || document.hidden) {
        frame = 0;
        return;
      }
      frame = requestAnimationFrame(tick);
      if (now - lastFrame < 1000 / clamp(maxFps, 1, 60)) return;
      lastFrame = now;
      if (canInteract()) {
        currentX += (targetX - currentX) * clamp(followSpeed, 0.01, 1);
        currentY += (targetY - currentY) * clamp(followSpeed, 0.01, 1);
        intensity += ((hovering ? 1 : 0) - intensity) * (hovering ? 0.18 : clamp(fadeSpeed, 0.01, 1));
      } else {
        intensity = 0;
      }
      draw(now);
      if (!hovering && intensity < 0.003 && (still || !canInteract())) {
        cancelAnimationFrame(frame);
        frame = 0;
        still = true;
      }
    }

    function wake() {
      if (cancelled || !visible || document.hidden || frame === 0 && !samples.length) return;
      if (!frame) {
        still = false;
        frame = requestAnimationFrame(tick);
      }
    }

    function resizeAndSample() {
      if (cancelled || !input.complete || !input.naturalWidth) return;
      const rect = canvas!.getBoundingClientRect();
      w = Math.max(1, Math.round(responsive ? rect.width : width));
      h = Math.max(1, Math.round(responsive ? rect.height : height));
      ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(w * ratio);
      canvas!.height = Math.round(h * ratio);
      const buffer = document.createElement("canvas");
      buffer.width = w;
      buffer.height = h;
      const bufferContext = buffer.getContext("2d", { willReadFrequently: true });
      if (!bufferContext) return;
      const iw = input.naturalWidth;
      const ih = input.naturalHeight;
      let sw = iw, sh = ih, sx = 0, sy = 0;
      if (objectFit === "cover") {
        const targetAspect = w / h;
        if (iw / ih > targetAspect) {
          sw = ih * targetAspect;
          sx = (iw - sw) / 2;
        } else {
          sh = iw / targetAspect;
          sy = (ih - sh) / 2;
        }
        bufferContext.drawImage(input, sx, sy, sw, sh, 0, 0, w, h);
      } else if (objectFit === "contain") {
        const scale = Math.min(w / iw, h / ih);
        const dw = iw * scale, dh = ih * scale;
        bufferContext.drawImage(input, (w - dw) / 2, (h - dh) / 2, dw, dh);
      } else if (objectFit === "none") {
        bufferContext.drawImage(input, 0, 0, iw, ih);
      } else {
        bufferContext.drawImage(input, 0, 0, w, h);
      }
      const imageData = bufferContext.getImageData(0, 0, w, h).data;
      const next: Sample[] = [];
      for (let y = step / 2; y < h; y += step) {
        for (let x = step / 2; x < w; x += step) {
          const xi = Math.min(w - 1, Math.round(x));
          const yi = Math.min(h - 1, Math.round(y));
          const locations = sampleAverage
            ? [[xi, yi], [Math.min(w - 1, xi + 2), yi], [xi, Math.min(h - 1, yi + 2)]]
            : [[xi, yi]];
          let red = 0, green = 0, blue = 0, alpha = 0;
          for (const [px, py] of locations) {
            const i = (py * w + px) * 4;
            red += imageData[i];
            green += imageData[i + 1];
            blue += imageData[i + 2];
            alpha += imageData[i + 3];
          }
          red /= locations.length;
          green /= locations.length;
          blue /= locations.length;
          alpha /= locations.length;
          if (alpha < 20) continue;
          const deterministic = (Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;
          if (Math.abs(deterministic) < dropoutStrength * 0.35) continue;
          if (grayscale) {
            const lum = red * 0.299 + green * 0.587 + blue * 0.114;
            red = green = blue = lum;
          }
          next.push({ x, y, r: red, g: green, b: blue, a: alpha, seed: x * 0.17 + y * 0.29 });
        }
      }
      samples = next;
      draw(performance.now());
      setReady(true);
      still = true;
    }

    const onMove = (event: PointerEvent) => {
      if (!canInteract()) return;
      const rect = canvas!.getBoundingClientRect();
      targetX = event.clientX - rect.left;
      targetY = event.clientY - rect.top;
      if (!hovering) {
        currentX = targetX;
        currentY = targetY;
      }
      hovering = true;
      wake();
    };
    const onLeave = () => {
      hovering = false;
      if (!fadeOnLeave) intensity = 0;
      wake();
    };
    const onVisibility = () => {
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
      else wake();
    };
    const observer = new IntersectionObserver(entries => {
      visible = !!entries[0]?.isIntersecting;
      if (visible) wake();
      else { cancelAnimationFrame(frame); frame = 0; }
    }, { threshold: 0.01 });
    const resizeObserver = new ResizeObserver(() => resizeAndSample());
    canvas.addEventListener("pointermove", onMove, { passive: true });
    canvas.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    observer.observe(canvas);
    resizeObserver.observe(canvas);
    input.onload = resizeAndSample;
    input.src = src;
    if (input.complete && input.naturalWidth) resizeAndSample();
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      input.onload = null;
    };
  }, [
    src, width, height, cellSize, dotScale, shape, backgroundColor, grayscale,
    responsive, dropoutStrength, interactive, distortionStrength,
    distortionRadius, distortionMode, followSpeed, sampleAverage, tintColor,
    tintStrength, maxFps, objectFit, jitterStrength, jitterSpeed, fadeOnLeave, fadeSpeed,
  ]);

  return (
    <div className={cn("vv-pixel-canvas", className)} style={{ width: responsive ? "100%" : width, height: responsive ? "100%" : height }}>
      <img className={cn("vv-pixel-fallback", ready && "is-ready")} src={src} alt={alt} loading="lazy" decoding="async" />
      <canvas ref={canvasRef} className="vv-pixel-surface" role="img" aria-label={alt} />
    </div>
  );
}
