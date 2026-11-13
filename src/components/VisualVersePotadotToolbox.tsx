import { useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Aperture, ArrowUpRight, AudioLines, BrainCircuit, Clapperboard,
  Code2, Layers3, MousePointer2, PenTool, Scan, Sparkles, Workflow
} from "lucide-react";
import "../potadot-toolbox.css";

/**
 * Potadot-inspired "Our Toolbox": an interactive constellation of tools
 * orbiting a central studio mark, with a focused hover/tap readout.
 * All product details and brand assets here belong to Visual Verse.
 * Hover is a progressive enhancement: keyboard, pointer, and tap also work.
 */
const tools = [
  {name:"Figma",short:"Fig",about:"Interfaces, prototypes and ideas we can test together.",group:"Design & identity",Icon:Layers3,tint:"#b6f1dc",x:15,y:21,delay:-.4},
  {name:"Photoshop",short:"Ps",about:"Photography, retouching and imaginative image-making.",group:"Design & identity",Icon:Scan,tint:"#a6dffa",x:39,y:12,delay:-2.6},
  {name:"Illustrator",short:"Ai",about:"Identity systems, illustration and memorable graphics.",group:"Design & identity",Icon:PenTool,tint:"#ffcfaa",x:72,y:17,delay:-.8},
  {name:"Lightroom",short:"Lr",about:"Colour, light and the details that make a photograph.",group:"Photography & film",Icon:Aperture,tint:"#b7e3ff",x:87,y:36,delay:-1.8},
  {name:"Premiere Pro",short:"Pr",about:"Video editing that gives every moment a rhythm.",group:"Photography & film",Icon:Clapperboard,tint:"#dec9fc",x:87,y:68,delay:-2.9},
  {name:"After Effects",short:"Ae",about:"Motion graphics and stories brought to life.",group:"Photography & film",Icon:AudioLines,tint:"#c9c7ff",x:66,y:86,delay:-1.4},
  {name:"Cursor",short:">_",about:"Code-driven websites, thoughtful details and development.",group:"Digital & strategy",Icon:MousePointer2,tint:"#d1f0e3",x:36,y:88,delay:-3.3},
  {name:"Google Flow",short:"Fl",about:"Exploration and creative production with AI workflows.",group:"Digital & strategy",Icon:Workflow,tint:"#f1cfe9",x:12,y:71,delay:-.3},
  {name:"ChatGPT",short:"AI",about:"Research, ideation and thinking through fresh possibilities.",group:"Digital & strategy",Icon:BrainCircuit,tint:"#b6f1d8",x:10,y:46,delay:-2.1},
  {name:"Semrush",short:"Se",about:"Digital research that helps the creative work find its audience.",group:"Digital & strategy",Icon:Code2,tint:"#ffdab7",x:89,y:52,delay:-1.2},
] as const;

const categories = [
  {name:"Design & identity",subtitle:"Where ideas take shape."},
  {name:"Photography & film",subtitle:"Where moments become stories."},
  {name:"Digital & strategy",subtitle:"Where ideas meet the world."},
] as const;

export function VisualVersePotadotToolbox(){
  const [selected,setSelected]=useState<number|null>(null);
  const [hovered,setHovered]=useState<number|null>(null);
  const activeIndex=hovered??selected;
  const active=activeIndex===null?null:tools[activeIndex];
  const reduced=Boolean(useReducedMotion());
  return <section id="our-toolbox" className="vv-about-tools vv-potbx-section vv-about-pad" aria-labelledby="vv-potbx-heading">
    <div className="vv-about-container vv-potbx-container">
      <div className="vv-potbx-intro">
        <div className="vv-potbx-intro-main">
          <span className="vv-potbx-eyebrow"><span className="vv-potbx-eyebrow-dot"/> OUR CREATIVE TOOLBOX</span>
          <h2 id="vv-potbx-heading">The tools change.<br/><em>The vision stays.</em></h2>
        </div>
        <p>From the first Figma wireframe to the final photograph, film, brand identity or digital experience, we choose the right creative tools for the story we're telling.</p>
      </div>

      <div className="vv-potbx-display">
        <div className="vv-potbx-world">
          <div className="vv-potbx-world-grain" aria-hidden="true"/>
          <div className="vv-potbx-world-arc arc-outer" aria-hidden="true"/>
          <div className="vv-potbx-world-arc arc-middle" aria-hidden="true"/>
          <div className="vv-potbx-world-arc arc-inner" aria-hidden="true"/>
          <span className="vv-potbx-star star-a" aria-hidden="true">✳</span>
          <span className="vv-potbx-star star-b" aria-hidden="true">✦</span>
          <span className="vv-potbx-star star-c" aria-hidden="true">✶</span>

          <div className="vv-potbx-centre" aria-live="polite" aria-atomic="true">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={active?.name??"studio"} className="vv-potbx-centre-content"
                initial={reduced?false:{opacity:0,scale:.78,rotate:-9,filter:"blur(7px)"}}
                animate={{opacity:1,scale:1,rotate:0,filter:"blur(0px)"}}
                exit={reduced?{opacity:0}:{opacity:0,scale:1.13,rotate:8,filter:"blur(7px)"}}
                transition={{duration:reduced?0:.45,ease:[.2,1,.32,1]}}>
                {active
                  ?<><div className="vv-potbx-selected-icon" style={{"--potbx-selected":active.tint} as CSSProperties}><active.Icon size={46} strokeWidth={1.4}/><span>{active.short}</span></div><strong>{active.name}</strong><small>{active.group}</small></>
                  :<><span className="vv-potbx-mark"><img src={import.meta.env.BASE_URL+"logo-mark.png"} alt="Visual Verse Creations"/></span><strong>VISUAL VERSE</strong><small>ONE STUDIO. EVERY CREATIVE DISCIPLINE.</small></>}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="vv-potbx-tool-cloud" role="group" aria-label="Explore the creative tools used by Visual Verse">
            {tools.map((tool,index)=>{
              const Icon=tool.Icon;
              const isActive=activeIndex===index;
              return <button type="button" key={tool.name}
                className={"vv-potbx-tool"+(isActive?" is-active":"")}
                style={{"--potbx-x":tool.x+"%","--potbx-y":tool.y+"%","--potbx-delay":tool.delay+"s","--potbx-tint":tool.tint} as CSSProperties}
                onMouseEnter={()=>setHovered(index)}
                onMouseLeave={()=>setHovered(null)}
                onFocus={()=>setHovered(index)}
                onBlur={()=>setHovered(null)}
                onClick={()=>setSelected(selected===index?null:index)}
                aria-label={"Explore "+tool.name}
                aria-pressed={isActive}
                data-cursor="EXPLORE">
                <span className="vv-potbx-tool-float"><span className="vv-potbx-tool-glyph"><Icon size={18} strokeWidth={1.8} aria-hidden="true"/></span><span className="vv-potbx-tool-name">{tool.name}</span><ArrowUpRight size={13} className="vv-potbx-tool-arrow" aria-hidden="true"/></span>
              </button>;
            })}
          </div>
          <div className="vv-potbx-world-caption" aria-hidden="true"><span><Sparkles size={13}/> A WORLD OF CREATIVE POSSIBILITIES</span><span>IMAGINE • CREATE • CONNECT</span></div>
        </div>

        <div className="vv-potbx-bottom">
          <div className="vv-potbx-readout">
            <div className="vv-potbx-readout-micro"><span className="vv-potbx-signal"/>{active?"TOOL IN FOCUS":"HOVER OR TAP A TOOL"}</div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={active?.name??"all"} className="vv-potbx-readout-content"
                initial={reduced?false:{opacity:0,y:10}}
                animate={{opacity:1,y:0}}
                exit={reduced?{opacity:0}:{opacity:0,y:-8}}
                transition={{duration:reduced?0:.28}}>
                <strong>{active?active.name:"One studio, every layer."}</strong>
                <p>{active?active.about:"Strategy, design, photography, film and digital experiences — brought together around your idea."}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="vv-potbx-disciplines" aria-label="Our toolbox disciplines">
            {categories.map(category=><div key={category.name} className={"vv-potbx-discipline"+(active?.group===category.name?" is-active":"")}>
              <span className="vv-potbx-discipline-dot"/><div><strong>{category.name}</strong><small>{category.subtitle}</small></div>
            </div>)}
          </div>
        </div>
      </div>

      <div className="vv-potbx-foot"><span>DIFFERENT TOOLS. THE SAME CREATIVE INTENTION.</span><a href="/services.html">Explore what we do <ArrowUpRight size={16}/></a></div>
    </div>
  </section>;
}
