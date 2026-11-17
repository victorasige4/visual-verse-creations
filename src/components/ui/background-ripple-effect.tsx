import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import "./background-ripple-effect.css";

// Aceternity Background Ripple Effect: distance-based, staggered cell ripples.
// Adapted to fill the actual panel and keep decorative cells out of the tab order.
export function BackgroundRippleEffect({
  cellSize = 56,
  className,
}: { cellSize?: number; className?: string }) {
  const container = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ rows: 0, cols: 0 });
  const [ripple, setRipple] = useState<{ row: number; col: number; key: number } | null>(null);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const resize = () => {
      const rows = Math.ceil(element.clientHeight / cellSize);
      const cols = Math.ceil(element.clientWidth / cellSize);
      setSize(previous => previous.rows === rows && previous.cols === cols ? previous : { rows, cols });
    };
    resize();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", resize);
      return () => window.removeEventListener("resize", resize);
    }
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    return () => observer.disconnect();
  }, [cellSize]);

  return (
    <div ref={container} className={cn("vv-ripple-background", className)} aria-hidden="true">
      <div key={ripple?.key ?? 0} className="vv-ripple-grid" style={{
        gridTemplateColumns: `repeat(${size.cols}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${size.rows}, ${cellSize}px)`,
      }}>
        {Array.from({ length: size.rows * size.cols }, (_, index) => {
          const row = Math.floor(index / size.cols);
          const col = index % size.cols;
          const distance = ripple ? Math.hypot(ripple.row - row, ripple.col - col) : 0;
          return <div key={index} className={cn("vv-ripple-cell", ripple && "vv-ripple-cell--active")}
            style={ripple ? { "--vv-ripple-delay": `${distance * 55}ms`, "--vv-ripple-duration": `${200 + distance * 80}ms` } as CSSProperties : undefined}
            onClick={() => setRipple(previous => ({ row, col, key: (previous?.key ?? 0) + 1 }))}/>;
        })}
      </div>
    </div>
  );
}
