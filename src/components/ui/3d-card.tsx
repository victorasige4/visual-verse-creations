import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/**
 * Aceternity 3D Card-style primitives for Visual Verse.
 * Public API: CardContainer, CardBody, CardItem.
 * Implemented locally because the user-provided demo registry could not be fetched.
 * No additional runtime dependencies are necessary.
 */
type CardState = { hovered: boolean; reducedMotion: boolean };
const CardContext = createContext<CardState>({ hovered: false, reducedMotion: true });

export function CardContainer({
  children,
  className,
  containerClassName,
}: {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const [hovered, setHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => {
      media.removeEventListener("change", update);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  function resetTilt() {
    cancelAnimationFrame(raf.current);
    if (bodyRef.current) bodyRef.current.style.transform = "rotateX(0deg) rotateY(0deg)";
    setHovered(false);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || reducedMotion || !bodyRef.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (event.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    const rotateY = Math.max(-9, Math.min(9, x * 8));
    const rotateX = Math.max(-8, Math.min(8, -y * 7));
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      if (bodyRef.current)
        bodyRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
  }

  return (
    <CardContext.Provider value={{ hovered, reducedMotion }}>
      <div
        className={cn("vv-3d-outer", containerClassName)}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse" && !reducedMotion) setHovered(true);
        }}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) resetTilt();
        }}
      >
        <div className={cn("vv-3d-body", className)} ref={bodyRef}>
          {children}
        </div>
      </div>
    </CardContext.Provider>
  );
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("vv-3d-content", className)}>{children}</div>;
}

type CardItemProps = HTMLAttributes<HTMLElement> & {
  as?: React.ElementType;
  href?: string;
  children: ReactNode;
  translateX?: number | string;
  translateY?: number | string;
  translateZ?: number | string;
  rotateX?: number | string;
  rotateY?: number | string;
  rotateZ?: number | string;
};

function withUnit(value: number | string, unit: "px" | "deg") {
  return typeof value === "number" ? `${value}${unit}` : value;
}

export function CardItem({
  as: Tag = "div",
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  style,
  ...rest
}: CardItemProps) {
  const { hovered, reducedMotion } = useContext(CardContext);
  const enabled = hovered && !reducedMotion;
  const layerStyle: CSSProperties = {
    ...style,
    transform: enabled
      ? `translate3d(${withUnit(translateX, "px")}, ${withUnit(translateY, "px")}, ${withUnit(translateZ, "px")}) rotateX(${withUnit(rotateX, "deg")}) rotateY(${withUnit(rotateY, "deg")}) rotateZ(${withUnit(rotateZ, "deg")})`
      : "translate3d(0, 0, 0)",
  };
  return React.createElement(
    Tag,
    { ...rest, className: cn("vv-3d-item", className), style: layerStyle },
    children,
  );
}
