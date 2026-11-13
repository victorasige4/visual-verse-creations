import { useEffect, useRef, useState, type CSSProperties } from "react";
import "../potadot-toolbox.css";

/**
 * Three elliptical tool orbits — composed to match the actual layout and
 * interaction of Potadot's About-page "Our toolbox".
 *
 * The artwork, names, descriptions and labels are Visual Verse's own.
 * Three six-item rings use depth-driven scale/blur/opacity (rather than
 * static scattered logo tiles). Animation pauses on hover, keyboard focus
 * or touch selection. Reduced motion displays the same composition still.
 */

type Ring = 0 | 1 | 2;
type Tool = { name: string; ring: Ring; detail: string };
type Dimensions = { width: number; mobile: boolean };
type Position = { x: number; y: number; scale: number; opacity: number; blur: number; z: number };

const tools: Tool[] = [
  { name: "Figma", ring: 0, detail: "Design and collaborative prototyping." },
  { name: "Photoshop", ring: 0, detail: "Image compositing, creative artwork and retouching." },
  { name: "Illustrator", ring: 0, detail: "Brand systems, illustrations and vector design." },
  { name: "Lightroom", ring: 0, detail: "Photographic colour, light and finishing." },
  { name: "Premiere Pro", ring: 0, detail: "Video stories shaped through editing." },
  { name: "After Effects", ring: 0, detail: "Motion graphics and animated experiences." },
  { name: "CapCut", ring: 1, detail: "Short-form video editing for digital storytelling." },
  { name: "Google Flow", ring: 1, detail: "AI-assisted creative exploration and production." },
  { name: "ChatGPT", ring: 1, detail: "Creative research, ideation and problem-solving." },
  { name: "Semrush", ring: 1, detail: "Search, audience research and digital strategy." },
  { name: "Cursor", ring: 1, detail: "Building interfaces and code-driven experiences." },
  { name: "GitHub", ring: 1, detail: "Team collaboration, versioning and delivery." },
  { name: "React", ring: 2, detail: "Interactive, responsive web interfaces." },
  { name: "Tailwind CSS", ring: 2, detail: "Flexible and consistent design systems." },
  { name: "TypeScript", ring: 2, detail: "Reliable digital development." },
  { name: "Vite", ring: 2, detail: "Fast, modern frontend workflows." },
  { name: "shadcn/ui", ring: 2, detail: "Accessible, reusable interface components." },
  { name: "Motion", ring: 2, detail: "Expressive and purposeful digital animation." },
];

const categories = [
  { name: "Design & visual", color: "#35be74" },
  { name: "Creative workflow", color: "#b97747" },
  { name: "Digital & web", color: "#0d3e48" },
] as const;

const TAU = Math.PI * 2;
const START = [0, .6, 1.2] as const; // Matches the reference's staggered rings.
const SPEED = [.075, -.048, .033] as const; // Radians per second.
const clamp = (value: number, low: number, high: number) =>
  Math.min(high, Math.max(low, value));

function radii(dimensions: Dimensions, ring: Ring) {
  const outer = dimensions.width;
  const rxFactor = dimensions.mobile ? [.156, .2496, .358] : [.20, .32, .46];
  const rx = outer * rxFactor[ring];
  return { rx, ry: rx * (dimensions.mobile ? .85 : .52) };
}

function getPosition(dimensions: Dimensions, ring: Ring, slot: number, time: number): Position {
  const { rx, ry } = radii(dimensions, ring);
  const angle = START[ring] + slot * TAU / 6 + time * SPEED[ring];
  const depth = Math.sin(angle);
  const x = Math.cos(angle) * rx;
  const y = depth * ry;
  return {
    x, y,
    scale: clamp(.9 + depth * .16, .72, 1.07),
    opacity: clamp(.71 + depth * .29, .4, 1),
    blur: depth < -.1 ? (-depth - .1) * 1.45 : 0,
    z: Math.round(25 + depth * 23),
  };
}

function positionTool(element: HTMLButtonElement, position: Position, selected: boolean) {
  const scale = selected ? position.scale * 1.115 : position.scale;
  element.style.transform =
    "translate(-50%, -50%) translate3d(" +
    position.x.toFixed(2) + "px," + position.y.toFixed(2) +
    "px,0) scale(" + scale.toFixed(3) + ")";
  element.style.opacity = String(selected ? 1 : position.opacity);
  element.style.filter = position.blur > 0 && !selected
    ? "blur(" + position.blur.toFixed(2) + "px)" : "none";
  element.style.zIndex = String(selected ? 65 : position.z);
}

export function VisualVersePotadotToolbox() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 659, mobile: false });
  const selectedIndex = hovered ?? selected;
  const selectedTool = selectedIndex === null ? null : tools[selectedIndex];
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const ringRefs = useRef<(SVGEllipseElement | null)[]>([]);
  const cometRefs = useRef<(SVGCircleElement | null)[]>([]);
  const beamRef = useRef<SVGLineElement | null>(null);
  const activeRef = useRef<number | null>(null);
  const visibleRef = useRef(true);
  activeRef.current = selectedIndex;

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const update = () => {
      const width = scene.getBoundingClientRect().width;
      const mobile = window.matchMedia("(max-width: 760px)").matches;
      const next = mobile ? Math.min(358, Math.max(250, width - 32)) : Math.min(659, width);
      setDimensions(previous => previous.mobile === mobile && Math.abs(previous.width - next) < 1
        ? previous : { width: next, mobile });
    };
    const observer = new ResizeObserver(update);
    observer.observe(scene);
    update();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const onVisibility = () => { visibleRef.current = !document.hidden; };
    document.addEventListener("visibilitychange", onVisibility);
    const intersection = new IntersectionObserver(([entry]) => {
      visibleRef.current = Boolean(entry?.isIntersecting) && !document.hidden;
    }, { rootMargin: "80px 0px", threshold: 0 });
    intersection.observe(scene);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let elapsed = 0;
    let previous = performance.now();
    let frame = 0;

    const paint = (now: number) => {
      const delta = Math.min(45, now - previous);
      previous = now;
      const active = activeRef.current;
      if (visibleRef.current && !reduce.matches && active === null) elapsed += delta / 1000;

      for (let ring = 0; ring < 3; ring++) {
        const { rx, ry } = radii(dimensions, ring as Ring);
        ringRefs.current[ring]?.setAttribute("rx", rx.toFixed(2));
        ringRefs.current[ring]?.setAttribute("ry", ry.toFixed(2));
        ringRefs.current[ring]?.setAttribute(
          "stroke-dasharray", dimensions.mobile ? "2 5" : "2 7"
        );
        ringRefs.current[ring]?.setAttribute("opacity", active === null ? "0.78" : "0.34");

        const angle = START[ring] + elapsed * SPEED[ring];
        const comet = cometRefs.current[ring];
        comet?.setAttribute("cx", (Math.cos(angle) * rx).toFixed(2));
        comet?.setAttribute("cy", (Math.sin(angle) * ry).toFixed(2));
        comet?.setAttribute("opacity", active === null ? "0.65" : "0.24");
      }

      tools.forEach((tool, index) => {
        const element = chipRefs.current[index];
        if (!element) return;
        const slot = index % 6;
        const position = getPosition(dimensions, tool.ring, slot, elapsed);
        positionTool(element, position, active === index);
      });

      const beam = beamRef.current;
      if (beam) {
        if (active !== null) {
          const tool = tools[active];
          const position = getPosition(dimensions, tool.ring, active % 6, elapsed);
          beam.setAttribute("x2", position.x.toFixed(2));
          beam.setAttribute("y2", position.y.toFixed(2));
          beam.style.opacity = "0.55";
        } else beam.style.opacity = "0";
      }
      if (!reduce.matches) frame = window.requestAnimationFrame(paint);
    };

    frame = window.requestAnimationFrame(paint);
    const onMotionChange = () => {
      if (!reduce.matches && !frame) {
        previous = performance.now();
        frame = window.requestAnimationFrame(paint);
      }
    };
    reduce.addEventListener("change", onMotionChange);
    return () => {
      window.cancelAnimationFrame(frame);
      intersection.disconnect();
      reduce.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [dimensions]);

  return (
    <section className="vv-about-tools vv-potbx-section" id="our-toolbox" aria-labelledby="vv-potbx-heading">
      <div className="vv-about-container vv-potbx-grid">
        <div className="vv-potbx-editorial">
          <span className="vv-potbx-eyebrow">
            <i aria-hidden="true"/><i aria-hidden="true"/> OUR TOOLBOX
          </span>
          <h2 id="vv-potbx-heading"><span className="vv-potbx-title-line">Modern tools,</span><span className="vv-potbx-title-line">picked for<span className="vv-potbx-last-word"> each job.</span></span></h2>
          <p>
            We work across design, photography, film, AI and digital, bringing the right
            tools together to take your idea from first concept to its final form.
          </p>
        </div>

        <div className="vv-potbx-stage">
          <div className="vv-potbx-scene" ref={sceneRef}>
            <div className="vv-potbx-orbit" aria-label="Creative tools moving in three interactive rings" role="group">
              <svg className="vv-potbx-svg"
                viewBox={dimensions.mobile ? "-179 -193.5 358 387" : "-329.5 -263.5 659 527"}
                width={dimensions.mobile ? 358 : 659} height={dimensions.mobile ? 387 : 527}
                aria-hidden="true">
                {categories.map((category, ring) => {
                  const geometry = radii(dimensions, ring as Ring);
                  return (
                    <g key={category.name}>
                      <ellipse ref={node => { ringRefs.current[ring] = node; }}
                        rx={geometry.rx} ry={geometry.ry}
                        stroke="#aab3bd" strokeWidth="1"
                        strokeDasharray="2 7" fill="none" opacity=".78"/>
                      <circle ref={node => { cometRefs.current[ring] = node; }}
                        cx={geometry.rx} cy="0" r={dimensions.mobile ? 3 : 4}
                        fill={category.color} opacity=".65"/>
                    </g>
                  );
                })}
                <line ref={beamRef} x1="0" y1="0" x2="0" y2="0"
                  stroke="#35be74" strokeWidth="1.5"
                  strokeDasharray="3 6" opacity="0"/>
              </svg>

              <div className={"vv-potbx-core" + (selectedIndex !== null ? " is-focused" : "")}>
                <span className="vv-potbx-pulse" aria-hidden="true"/>
                <span className="vv-potbx-pulse" aria-hidden="true"/>
                <img src={import.meta.env.BASE_URL + "logo-mark.png"} alt="Visual Verse Creations logo"/>
              </div>

              {tools.map((tool, index) => {
                const still = getPosition(dimensions, tool.ring, index % 6, 0);
                const initial: CSSProperties = {
                  transform: "translate(-50%, -50%) translate3d(" +
                    still.x.toFixed(1) + "px," + still.y.toFixed(1) +
                    "px,0) scale(" + still.scale.toFixed(3) + ")",
                  opacity: still.opacity,
                  zIndex: still.z,
                };
                return (
                  <button key={tool.name} type="button"
                    ref={node => { chipRefs.current[index] = node; }}
                    className={"vv-potbx-chip" + (selectedIndex === index ? " is-active" : "")}
                    style={initial}
                    title={tool.detail}
                    aria-pressed={selected === index}
                    aria-label={"Explore " + tool.name}
                    data-cursor="EXPLORE"
                    onMouseEnter={() => setHovered(index)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(index)}
                    onBlur={() => setHovered(null)}
                    onClick={() => setSelected(current => current === index ? null : index)}>
                    <i className={"vv-potbx-chip-dot ring-" + tool.ring} aria-hidden="true"/>
                    {tool.name}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="vv-potbx-caption" aria-live="polite" aria-atomic="true">
            <small>{selectedTool ? "IN FOCUS" : "HOVER A TOOL"}</small>
            <strong>{selectedTool ? selectedTool.name : "One team, every layer"}</strong>
            {selectedTool && <span>{selectedTool.detail}</span>}
          </div>
          <div className="vv-potbx-legend" aria-label="The three disciplines in our toolbox">
            {categories.map((category, ring) => (
              <span key={category.name} className={selectedTool?.ring === ring ? "is-active" : ""}>
                <i className={"ring-" + ring} aria-hidden="true"/>{category.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
