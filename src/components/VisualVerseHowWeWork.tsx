import { useMemo, useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowRight, ArrowUpRight, AudioLines, BookOpenText, Check, Focus,
  Handshake, Layers3, MoveUpRight, RefreshCw, SlidersVertical, Sparkles
} from "lucide-react";
import "../how-we-work-studio.css";

/**
 * The Creative Mixing Desk
 *
 * Instead of a series of stacked text cards, visitors actively tune five
 * creative principles and watch a live artboard react. The five faders act
 * as a playful illustration of the work, not measurable project ratings.
 *
 * The original five principles and their full descriptions are preserved.
 * No audio, autoplaying tab changes or number-only section labels.
 */
const channels = [
  {
    id: "story",
    short: "Your story",
    label: "Built around your story",
    description: "No two clients have the same vision. We begin by understanding your people, goals and the experience you want to create.",
    detail: "The brief shapes the work",
    micro: "THE STARTING POINT",
    Icon: BookOpenText,
  },
  {
    id: "direction",
    short: "Direction",
    label: "Creativity with direction",
    description: "Beautiful is a starting point, not the finish line. We bring clarity, strategy and a reason to every decision.",
    detail: "Intentional, not just attractive",
    micro: "THE NORTH STAR",
    Icon: Focus,
  },
  {
    id: "team",
    short: "The team",
    label: "One connected creative team",
    description: "Branding, design, photography, film and digital thinking work better when the experience feels like one story.",
    detail: "Many disciplines, one vision",
    micro: "ONE CONNECTED WORLD",
    Icon: Layers3,
  },
  {
    id: "craft",
    short: "The craft",
    label: "Craft in every frame",
    description: "Details matter: light, composition, typography, transitions, accessibility and the final handover.",
    detail: "Care from concept to delivery",
    micro: "THE FINISHING TOUCHES",
    Icon: Sparkles,
  },
  {
    id: "together",
    short: "Together",
    label: "A partnership, not a handoff",
    description: "We listen, share progress, invite feedback and aim for a process that feels as good as the finished work.",
    detail: "Built through collaboration",
    micro: "THE HUMAN CONNECTION",
    Icon: Handshake,
  },
] as const;

const defaults = [82, 77, 88, 91, 84] as const;
type Levels = [number, number, number, number, number];

export function VisualVerseHowWeWork() {
  const [levels, setLevels] = useState<Levels>([...defaults]);
  const [selected, setSelected] = useState(0);
  const [remix, setRemix] = useState(0);
  const reduced = Boolean(useReducedMotion());
  const active = channels[selected];

  const visual = useMemo(() => ({
    "--vvhw-word-scale": String(.88 + levels[0] / 700),
    "--vvhw-direction-rotate": (levels[1] - 80) * .77 + "deg",
    "--vvhw-glow-opacity": String(.18 + levels[0] / 180),
    "--vvhw-craft-grid": String(.08 + levels[3] / 170),
    "--vvhw-frame-width": 1 + levels[3] / 30 + "px",
    "--vvhw-bridge-width": 6 + levels[4] / 5 + "px",
    "--vvhw-team-opacity": String(.2 + levels[2] / 125),
    "--vvhw-shape-scale": String(.65 + levels[1] / 260),
  }) as CSSProperties, [levels]);

  const adjust = (index: number, level: number) => {
    setLevels(old => old.map((value, at) => at === index ? level : value) as Levels);
    setSelected(index);
  };
  const surprise = () => {
    setLevels(channels.map(() => Math.round(38 + Math.random() * 62)) as Levels);
    setSelected(Math.floor(Math.random() * channels.length));
    setRemix(n => n + 1);
  };
  const reset = () => {
    setLevels([...defaults]);
    setSelected(0);
    setRemix(n => n + 1);
  };

  return <section id="our-approach" className="vv-about-principles vv-hww-section" aria-labelledby="vvhww-title">
    <div className="vv-about-container vv-hww-container">
      <div className="vv-hww-heading">
        <div className="vv-hww-heading-main">
          <span className="vv-hww-eyebrow"><span className="vv-hww-led"/> HOW WE WORK / THE CREATIVE MIX</span>
          <h2 id="vvhww-title">Good work<br/>isn't an accident.<br/><em>It's a mix.</em></h2>
        </div>
        <div className="vv-hww-heading-aside">
          <p>Every great piece of creative work is shaped by more than a single idea. Explore the five ingredients we bring to every collaboration — and play with the mix.</p>
          <span><SlidersVertical size={15} aria-hidden="true"/> MOVE THE FADERS. WATCH THE CANVAS.</span>
        </div>
      </div>

      <div className="vv-hww-console">
        <div className="vv-hww-console-bar">
          <div><span className="vv-hww-console-led"/><strong>VISUAL VERSE / CREATIVE STUDIO</strong></div>
          <div className="vv-hww-console-bar-right"><AudioLines size={17} aria-hidden="true"/> LIVE CREATIVE EXPERIMENT</div>
        </div>

        <div className="vv-hww-workspace">
          <div className="vv-hww-mixer" aria-label="Explore the five principles of our creative process">
            <div className="vv-hww-mixer-header">
              <div><span>THE CREATIVE MIXER</span><strong>Turn up what matters.</strong></div>
              <div className="vv-hww-mixer-signal" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/></div>
            </div>
            <div className="vv-hww-faders">
              {channels.map((channel, index) => {
                const Icon = channel.Icon;
                const isSelected = index === selected;
                return <div className={"vv-hww-fader" + (isSelected ? " is-active" : "")} key={channel.id}
                  onPointerEnter={event => { if (event.pointerType === "mouse") setSelected(index); }}>
                  <button type="button" className="vv-hww-fader-select" aria-pressed={isSelected}
                    aria-label={"Explore: " + channel.label}
                    onClick={() => setSelected(index)} data-cursor="EXPLORE">
                    <Icon size={21} strokeWidth={1.65} aria-hidden="true"/>
                    <span>{channel.short}</span>
                  </button>
                  <div className="vv-hww-fader-rail">
                    <div className="vv-hww-fader-track" aria-hidden="true">
                      <span className="vv-hww-fader-fill" style={{height:(levels[index]-20)/.8+"%"}}/>
                      <span className="vv-hww-fader-graduations"/>
                    </div>
                    <input type="range" min={20} max={100} step={1} value={levels[index]}
                      className="vv-hww-range"
                      aria-label={channel.label + " creative mixing level"}
                      aria-valuetext={levels[index] + " percent. " + channel.detail}
                      onChange={e => adjust(index, Number(e.target.value))}
                      data-cursor="TUNE"
                    />
                  </div>
                  <span className="vv-hww-fader-foot">{isSelected ? "IN FOCUS" : "ADJUST"}</span>
                </div>;
              })}
            </div>
            <div className="vv-hww-console-actions">
              <button className="vv-hww-remix" type="button" onClick={surprise} data-cursor="REMIX">
                <motion.span key={remix} initial={false} animate={reduced ? {} : {rotate:remix * 180}} transition={{duration:.5}}>
                  <RefreshCw size={16} aria-hidden="true"/>
                </motion.span> REMIX THE IDEA <ArrowUpRight size={15} aria-hidden="true"/>
              </button>
              <button className="vv-hww-reset" type="button" onClick={reset}><span>RESET</span> <ArrowRight size={14}/></button>
            </div>
          </div>

          <div className="vv-hww-output" style={visual}>
            <div className="vv-hww-output-top"><span><span className="vv-hww-output-blink"/> LIVE CANVAS / ALWAYS EVOLVING</span><span>THE VISUAL VERSE WAY <MoveUpRight size={14}/></span></div>
            <div className="vv-hww-artboard">
              <div className="vv-hww-grid-overlay" aria-hidden="true"/>
              <div className="vv-hww-aura" aria-hidden="true"/>
              <div className="vv-hww-art-crop crop-tl" aria-hidden="true"/>
              <div className="vv-hww-art-crop crop-tr" aria-hidden="true"/>
              <div className="vv-hww-art-crop crop-bl" aria-hidden="true"/>
              <div className="vv-hww-art-crop crop-br" aria-hidden="true"/>
              <div className="vv-hww-orbit orbit-outer" aria-hidden="true"/>
              <div className="vv-hww-orbit orbit-inner" aria-hidden="true"/>
              <div className="vv-hww-direction-ray" aria-hidden="true"><i/><i/><i/></div>
              <div className="vv-hww-team-stars" aria-hidden="true">
                {["✳", "✦", "✳", "✧", "✴"].map((star, i) =>
                  <span key={i} style={{opacity:Math.min(1,Math.max(.1,(levels[2]-i*14)/46))}}>{star}</span>
                )}
              </div>
              <div className="vv-hww-artboard-lockup">
                <div className="vv-hww-lockup-top"><span>EVERY STORY STARTS SOMEWHERE</span><span>✴</span></div>
                <strong>IDEAS<br/>MADE<br/><em>TO MATTER.</em></strong>
                <div className="vv-hww-lockup-bottom"><span>THOUGHTFUL BY DESIGN.</span><img src={import.meta.env.BASE_URL+"logo-mark.png"} alt="Visual Verse Creations logo"/></div>
              </div>
              <div className="vv-hww-bridge" aria-hidden="true"><span/><span/><i/></div>
              <div className="vv-hww-art-stamp" aria-hidden="true">MADE<br/>TOGETHER ✳</div>
            </div>
            <div className="vv-hww-output-bottom"><span><Check size={13}/> NO TWO STORIES ARE THE SAME</span><span>STUDIO OUTPUT / LIVE</span></div>
          </div>
        </div>

        <div className="vv-hww-readout" aria-live="polite" aria-atomic="true">
          <div className="vv-hww-readout-label">
            <span className="vv-hww-readout-indicator"/><span>THE THINKING BEHIND THE MIX</span>
            <strong>{active.micro}</strong>
          </div>
          <div className="vv-hww-readout-story">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={active.id}
                initial={reduced?false:{opacity:0,y:16,filter:"blur(5px)"}}
                animate={{opacity:1,y:0,filter:"blur(0px)"}}
                exit={reduced?{opacity:0}:{opacity:0,y:-11,filter:"blur(5px)"}}
                transition={{duration:reduced?0:.32,ease:[.22,1,.36,1]}}>
                <h3>{active.label}</h3>
                <p>{active.description}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="vv-hww-readout-signature"><span>✳</span>{active.detail}<ArrowUpRight size={16} aria-hidden="true"/></div>
        </div>

        <div className="vv-hww-console-foot"><span>DESIGN. FILM. DIGITAL. ALL CONNECTED.</span><span>THE MAGIC IS IN THE MIX.</span></div>
      </div>
      <div className="vv-hww-after"><span>OUR PRINCIPLES AREN'T A FORMULA. THEY'RE HOW WE SHOW UP.</span><a href="/contact.html">LET'S CREATE SOMETHING TOGETHER <ArrowUpRight size={16}/></a></div>
    </div>
  </section>;
}
