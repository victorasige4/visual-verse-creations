import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { GripVertical } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/** Aceternity UI Compare, adapted for Visual Verse's photography demo.
 * https://ui.aceternity.com/registry/compare-demo.json
 * Retains the clipped image, illuminated divider and drag interaction;
 * uses the existing icon library and CSS glow instead of a particle canvas.
 */
interface CompareProps {
  firstImage: string;
  secondImage: string;
  firstImageClassName?: string;
  secondImageClassname?: string;
  className?: string;
  initialSliderPercentage?: number;
  sliderPercentage?: number;
  onSliderChange?: (percentage: number) => void;
  slideMode?: "hover" | "drag";
  firstImageAlt: string;
  secondImageAlt: string;
}

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

export function Compare({
  firstImage, secondImage, firstImageClassName, secondImageClassname,
  className, initialSliderPercentage = 50, sliderPercentage,
  onSliderChange, slideMode = "drag", firstImageAlt, secondImageAlt,
}: CompareProps) {
  const [position, setPosition] = useState(initialSliderPercentage);
  const activePointer = useRef<number | null>(null);
  const value = clamp(sliderPercentage ?? position);

  function update(next: number) {
    const percentage = clamp(next);
    setPosition(percentage);
    onSliderChange?.(percentage);
  }

  function updateFromPointer(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width) update((event.clientX - rect.left) / rect.width * 100);
  }

  function handleKey(event: KeyboardEvent<HTMLDivElement>) {
    let next: number;
    switch (event.key) {
      case "ArrowLeft": case "ArrowDown": next = value - 5; break;
      case "ArrowRight": case "ArrowUp": next = value + 5; break;
      case "PageDown": next = value - 10; break;
      case "PageUp": next = value + 10; break;
      case "Home": next = 0; break;
      case "End": next = 100; break;
      default: return;
    }
    event.preventDefault();
    update(next);
  }

  return (
    <div
      className={cn("vv-compare relative isolate overflow-hidden select-none", className)}
      role="slider"
      tabIndex={0}
      aria-label="Compare original and edited photography"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      aria-valuetext={`${value}% original, ${100 - value}% edited`}
      onKeyDown={handleKey}
      onPointerDown={event => {
        if (!event.isPrimary || event.button !== 0) return;
        activePointer.current = event.pointerId;
        event.currentTarget.setPointerCapture(event.pointerId);
        updateFromPointer(event);
      }}
      onPointerMove={event => {
        if (activePointer.current === event.pointerId || (slideMode === "hover" && event.pointerType === "mouse")) {
          updateFromPointer(event);
        }
      }}
      onPointerUp={() => { activePointer.current = null; }}
      onPointerCancel={() => { activePointer.current = null; }}
      onLostPointerCapture={() => { activePointer.current = null; }}
    >
      <img src={secondImage} alt={secondImageAlt} draggable={false}
        className={cn("absolute inset-0 h-full w-full object-cover pointer-events-none", secondImageClassname)} />
      <motion.div className="absolute inset-0 pointer-events-none" style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
        <img src={firstImage} alt={firstImageAlt} draggable={false}
          className={cn("absolute inset-0 h-full w-full object-cover", firstImageClassName)} />
      </motion.div>
      <span aria-hidden="true" className="vv-compare-label vv-compare-label-original">Original</span>
      <span aria-hidden="true" className="vv-compare-label vv-compare-label-edited">Edited</span>
      <motion.div aria-hidden="true" className="vv-compare-divider absolute inset-y-0 pointer-events-none" style={{ left: `${value}%` }}>
        <span className="vv-compare-glow" />
        <span className="vv-compare-handle"><GripVertical size={19} strokeWidth={2} /></span>
      </motion.div>
    </div>
  );
}
