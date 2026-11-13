import { useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import "../potadot-toolbox.css";

/**
 * Potadot-reference toolbox structure:
 * minimal introduction, an open tech-logo constellation around one central
 * brand mark, hover-to-focus interaction, and the small discipline readout.
 * The icons and copy are for Visual Verse, not Potadot.
 */
type Tool = {
  name: string;
  icon: string;
  group: string;
  description: string;
};

const tools: Tool[] = [
  { name: "Figma", icon: "figma", group: "Design & identity", description: "Interfaces, wireframes, prototypes and creative collaboration." },
  { name: "Photoshop", icon: "photoshop", group: "Design & identity", description: "Compositing, retouching and imaginative visual design." },
  { name: "Illustrator", icon: "illustrator", group: "Design & identity", description: "Identity systems, illustrations and vector artwork." },
  { name: "Lightroom", icon: "lightroom", group: "Photography & film", description: "Colour, light, editing and photographic finishing." },
  { name: "Premiere Pro", icon: "premiere", group: "Photography & film", description: "Editing films, reels and stories with a strong sense of rhythm." },
  { name: "After Effects", icon: "aftereffects", group: "Photography & film", description: "Motion graphics, animation and visual storytelling." },
  { name: "CapCut", icon: "capcut", group: "Photography & film", description: "Fast, flexible edits for short-form digital content." },
  { name: "Cursor", icon: "cursor", group: "Digital & strategy", description: "Turning interfaces and designs into responsive digital experiences." },
  { name: "Google Flow", icon: "flow", group: "Digital & strategy", description: "Exploring visual ideas with new creative workflows." },
  { name: "ChatGPT", icon: "chatgpt", group: "Digital & strategy", description: "Brainstorming, research and creative problem solving." },
  { name: "Semrush", icon: "semrush", group: "Digital & strategy", description: "Audience research and search-led digital thinking." },
  { name: "GitHub", icon: "github", group: "Digital & strategy", description: "Versioning, collaboration and shipping digital work." },
  { name: "React", icon: "react", group: "Digital & strategy", description: "Modern components for thoughtful interactive interfaces." },
  { name: "Tailwind CSS", icon: "tailwind", group: "Digital & strategy", description: "Responsive styling and consistent design systems." },
];

const categories = ["Design & identity", "Photography & film", "Digital & strategy"];

const positions = tools.map((_, i) => {
  const angle = (-90 + (360 / tools.length) * i) * Math.PI / 180;
  return {
    "--potbx-x": (50 + 42 * Math.cos(angle)).toFixed(2) + "%",
    "--potbx-y": (50 + 40 * Math.sin(angle)).toFixed(2) + "%",
    "--potbx-delay": -(i % 7) * .41 + "s"
  } as CSSProperties;
});

const toolIcon = (icon: string) => import.meta.env.BASE_URL + "toolbox/" + icon + ".svg";

export function VisualVersePotadotToolbox() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const current = hovered ?? selected;
  const active = current === null ? null : tools[current];
  const reduced = Boolean(useReducedMotion());

  return <section id="our-toolbox" className="vv-about-tools vv-potbx-section vv-about-pad" aria-labelledby="vv-potbx-heading">
    <div className="vv-about-container vv-potbx-container">
      <header className="vv-potbx-intro">
        <div>
          <span className="vv-potbx-eyebrow"><span aria-hidden="true"/> OUR TOOLBOX</span>
          <h2 id="vv-potbx-heading">The tools change.<br/><em>The vision stays.</em></h2>
        </div>
        <p>We bring together design, photography, filmmaking and digital thinking. Every tool has its place, but the idea always leads.</p>
      </header>

      <div className="vv-potbx-display">
        <div className="vv-potbx-world">
          <div className="vv-potbx-thread vv-potbx-thread-first" aria-hidden="true"/>
          <div className="vv-potbx-thread vv-potbx-thread-second" aria-hidden="true"/>
          <div className="vv-potbx-centre" aria-live="polite" aria-atomic="true">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={active?.icon ?? "visual-verse"} className="vv-potbx-centre-inner"
                initial={reduced ? false : {opacity:0,scale:.86}}
                animate={{opacity:1,scale:1}}
                exit={reduced ? {opacity:0} : {opacity:0,scale:1.1}}
                transition={{duration:reduced ? 0 : .27,ease:[.22,1,.36,1]}}>
                {active ? <>
                  <img src={toolIcon(active.icon)} alt="" aria-hidden="true" className="vv-potbx-centre-logo vv-potbx-centre-tool"/>
                  <strong>{active.name}</strong>
                </> : <>
                  <img src={import.meta.env.BASE_URL + "logo-mark.png"} alt="Visual Verse Creations" className="vv-potbx-centre-logo"/>
                  <strong>VISUAL VERSE</strong>
                </>}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="vv-potbx-tool-cloud" role="group" aria-label="Explore Visual Verse's creative tools">
            {tools.map((tool,index) => <button
              key={tool.icon}
              type="button"
              className={"vv-potbx-tool" + (current === index ? " is-active" : "")}
              style={positions[index]}
              title={tool.name}
              aria-label={"Explore " + tool.name}
              aria-pressed={selected === index}
              data-name={tool.name}
              data-cursor="EXPLORE"
              onPointerEnter={event => {if(event.pointerType === "mouse")setHovered(index)}}
              onPointerLeave={event => {if(event.pointerType === "mouse")setHovered(null)}}
              onFocus={() => setHovered(index)}
              onBlur={() => setHovered(null)}
              onClick={() => setSelected(previous => previous === index ? null : index)}>
              <span className="vv-potbx-tool-float"><img src={toolIcon(tool.icon)} alt="" aria-hidden="true"/></span>
            </button>)}
          </div>
        </div>

        <div className="vv-potbx-bottom">
          <div className="vv-potbx-readout">
            <span className="vv-potbx-overline"><i aria-hidden="true"/>{active ? "IN FOCUS" : "HOVER A TOOL"}</span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={active?.icon ?? "default"}
                initial={reduced ? false : {opacity:0,y:8}}
                animate={{opacity:1,y:0}}
                exit={reduced ? {opacity:0} : {opacity:0,y:-8}}
                transition={{duration:reduced ? 0 : .24}}
                className="vv-potbx-readout-copy">
                <strong>{active ? active.name : "One team, every layer."}</strong>
                <p>{active ? active.description : "Different tools. One connected creative process."}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="vv-potbx-disciplines" aria-label="Creative disciplines">
            {categories.map(category => <span key={category}
              className={"vv-potbx-discipline" + (active?.group === category ? " is-active" : "")}>
              <i aria-hidden="true"/>{category}
            </span>)}
          </div>
        </div>
      </div>
      <div className="vv-potbx-foot">
        <span>THE RIGHT TOOLS FOR THE RIGHT STORY.</span>
        <a href="/services.html">Explore our services <ArrowUpRight size={16} aria-hidden="true"/></a>
      </div>
    </div>
  </section>;
}
