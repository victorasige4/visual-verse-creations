import { useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import "../potadot-toolbox.css";

/**
 * Potadot-style Our Toolbox: 18 compact software marks in a loose, balanced
 * constellation, the studio's actual mark at the centre and an interactive
 * "Hover a tool" readout beneath. No oversized icon cards or decorative rings.
 *
 * All tool symbols are sourced brand SVGs. Google Flow uses the original Google
 * Flow mark archived on Wikimedia Commons; all others are local SVG assets.
 */
type Tool = {
  name: string;
  icon: string;
  group: string;
  description: string;
  x: number;
  y: number;
  delay: number;
  external?: string;
};

const tools: Tool[] = [
  {name:"Figma",icon:"figma",group:"Design & identity",description:"Prototyping, interface design and visual collaboration.",x:8,y:21,delay:-1.1},
  {name:"Photoshop",icon:"photoshop",group:"Design & identity",description:"Image composition, retouching and graphic design.",x:24,y:13,delay:-2.3},
  {name:"Illustrator",icon:"illustrator",group:"Design & identity",description:"Distinctive vector graphics and brand identities.",x:42,y:17,delay:-1.7},
  {name:"Lightroom",icon:"lightroom",group:"Photo, film & motion",description:"Light, colour and the final touch on every photograph.",x:60,y:11,delay:-3.1},
  {name:"Premiere Pro",icon:"premiere",group:"Photo, film & motion",description:"Editing stories with pacing, rhythm and purpose.",x:78,y:19,delay:-.4},
  {name:"After Effects",icon:"aftereffects",group:"Photo, film & motion",description:"Movement, motion graphics and animated storytelling.",x:92,y:12,delay:-1.5},
  {name:"CapCut",icon:"capcut",group:"Photo, film & motion",description:"Agile short-form edits for digital-first stories.",x:11,y:45,delay:-2.1},
  {name:"Cursor",icon:"cursor",group:"Digital & strategy",description:"Moving from visual ideas to working websites.",x:27,y:39,delay:-.8},
  {name:"Google Flow",icon:"flow",group:"Digital & strategy",description:"Exploring new ways to develop visual concepts.",x:10,y:68,delay:-2.7,external:"https://upload.wikimedia.org/wikipedia/commons/5/52/Google_Flow_logo.svg"},
  {name:"ChatGPT",icon:"chatgpt",group:"Digital & strategy",description:"Research, brainstorming and refining creative direction.",x:76,y:40,delay:-1.4},
  {name:"Semrush",icon:"semrush",group:"Digital & strategy",description:"Search research and digital audience insights.",x:92,y:38,delay:-3.4},
  {name:"GitHub",icon:"github",group:"Digital & strategy",description:"Collaborating on, reviewing and shipping digital work.",x:89,y:64,delay:-.5},
  {name:"React",icon:"react",group:"Digital & strategy",description:"Building modern, interactive web experiences.",x:10,y:89,delay:-1.9},
  {name:"Tailwind CSS",icon:"tailwind",group:"Digital & strategy",description:"Creating responsive visual design systems.",x:28,y:82,delay:-2.2},
  {name:"TypeScript",icon:"typescript",group:"Digital & strategy",description:"Reliable, maintainable foundations for interfaces.",x:42,y:89,delay:-.9},
  {name:"Vite",icon:"vite",group:"Digital & strategy",description:"Fast, modern frontend production workflows.",x:60,y:85,delay:-2.8},
  {name:"shadcn/ui",icon:"shadcn",group:"Digital & strategy",description:"Thoughtful and accessible interface foundations.",x:77,y:82,delay:-1.2},
  {name:"Motion",icon:"motion",group:"Digital & strategy",description:"Purposeful movement and interaction in the browser.",x:70,y:67,delay:-3.0},
];

const groups = ["Design & identity", "Photo, film & motion", "Digital & strategy"];
const svg = (tool: Tool) => tool.external ?? import.meta.env.BASE_URL + "toolbox/" + tool.icon + ".svg";

export function VisualVersePotadotToolbox() {
  const [focused,setFocused] = useState<number|null>(null);
  const [selected,setSelected] = useState<number|null>(null);
  const current = focused ?? selected;
  const active = current === null ? null : tools[current];
  const reduceMotion = Boolean(useReducedMotion());

  return <section id="our-toolbox" className="vv-about-tools vv-potbx-section vv-about-pad" aria-labelledby="vv-potbx-heading">
    <div className="vv-about-container vv-potbx-container">
      <header className="vv-potbx-intro">
        <div>
          <span className="vv-potbx-eyebrow"><span aria-hidden="true"/> OUR CREATIVE TOOLBOX</span>
          <h2 id="vv-potbx-heading">Modern tools,<br/><em>picked for each job.</em></h2>
        </div>
        <p>From branding and photography to film, digital design and development, we bring the right tools together for the story in front of us.</p>
      </header>

      <div className="vv-potbx-display">
        <div className="vv-potbx-world">
          <div className="vv-potbx-centre" aria-label="Visual Verse Creations">
            <img src={import.meta.env.BASE_URL+"logo-mark.png"} alt="Visual Verse Creations logo"/>
          </div>
          <div className="vv-potbx-tool-cloud" role="group" aria-label="Explore the software in our toolbox">
            {tools.map((tool,index)=>{
              const style = {
                "--potbx-x": tool.x+"%",
                "--potbx-y": tool.y+"%",
                "--potbx-delay": tool.delay+"s",
              } as CSSProperties;
              return <button type="button" key={tool.name}
                className={"vv-potbx-tool"+(current===index?" is-active":"")+(tool.icon==="flow"?" is-wordmark":"")}
                title={tool.name}
                aria-label={"Explore "+tool.name}
                aria-pressed={selected===index}
                style={style}
                data-cursor="EXPLORE"
                onPointerEnter={e=>{if(e.pointerType==="mouse")setFocused(index)}}
                onPointerLeave={e=>{if(e.pointerType==="mouse")setFocused(null)}}
                onFocus={()=>setFocused(index)}
                onBlur={()=>setFocused(null)}
                onClick={()=>setSelected(previous=>previous===index?null:index)}
              >
                <span className="vv-potbx-tool-drift">
                  <img src={svg(tool)} alt="" loading="lazy" aria-hidden="true"/>
                </span>
                <span className="vv-potbx-tool-tooltip" aria-hidden="true">{tool.name}</span>
              </button>;
            })}
          </div>
        </div>
        <div className="vv-potbx-bottom">
          <div className="vv-potbx-readout" aria-live="polite" aria-atomic="true">
            <div className="vv-potbx-prompt"><i aria-hidden="true"/>{active?"IN FOCUS":"HOVER A TOOL"}</div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={active?.icon??"default"} className="vv-potbx-readout-copy"
                initial={reduceMotion?false:{opacity:0,y:8}}
                animate={{opacity:1,y:0}}
                exit={reduceMotion?{opacity:0}:{opacity:0,y:-7}}
                transition={{duration:reduceMotion?0:.22}}>
                <strong>{active?active.name:"One team, every layer."}</strong>
                <p>{active?active.description:"One creative studio. Every discipline working together."}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="vv-potbx-disciplines" aria-label="Our creative disciplines">
            {groups.map(group=><span className={"vv-potbx-discipline"+(active?.group===group?" is-active":"")} key={group}>
              <i aria-hidden="true"/>{group}
            </span>)}
          </div>
        </div>
      </div>
    </div>
  </section>;
}
