import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowRight, ArrowUpRight, Aperture, Compass, HeartHandshake, Lightbulb,
  Pause, PenTool, Play, Send, Sparkles, Target, WandSparkles
} from "lucide-react";
import "../vision-mission.css";

/**
 * Visual Verse | THE PURPOSE ENGINE
 * Vision = our north star, a cinematic living constellation.
 * Mission = the creative relay, an actual four-step interactive sequence.
 *
 * Both scenes are readable without interaction and adapt to reduced motion.
 */
type Direction = "vision" | "mission";
const LOOP_MS = 10500;
const missionSteps = [
  { name: "IMAGINE", label: "Find the spark", detail: "We listen, ask better questions, and uncover the story worth telling.", Icon: Lightbulb },
  { name: "CREATE", label: "Shape the idea", detail: "We turn possibilities into a distinctive identity, image, film, or experience.", Icon: PenTool },
  { name: "CONNECT", label: "Make it resonate", detail: "We create with people in mind, so every detail feels intentional.", Icon: HeartHandshake },
  { name: "DELIVER", label: "Send it out", detail: "We refine, finish, and put thoughtful creative work into the world.", Icon: Send },
] as const;

function VisionWorld({reduced}:{reduced:boolean}) {
  return <div className="vv-purpose-vision-world" aria-label="Animated north star symbolising creative stories that connect">
    <div className="vv-purpose-vision-grain" aria-hidden="true"/>
    <div className="vv-purpose-vision-ring ring-one" aria-hidden="true"/>
    <div className="vv-purpose-vision-ring ring-two" aria-hidden="true"/>
    <div className="vv-purpose-vision-ring ring-three" aria-hidden="true"/>
    <svg className="vv-purpose-stars" viewBox="0 0 600 600" aria-hidden="true">
      <defs>
        <radialGradient id="vv-purpose-star-aura">
          <stop offset="0" stopColor="#7effd8" stopOpacity=".24"/>
          <stop offset="1" stopColor="#2ec4b6" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="300" cy="300" r="256" fill="url(#vv-purpose-star-aura)"/>
      <motion.path d="M95 155 L245 92 L412 138 L515 280 L438 442 L265 512 L87 385 Z"
        fill="none" stroke="#a6efdf" strokeWidth="1" strokeDasharray="4 9"
        initial={{pathLength:reduced?1:0,opacity:.2}}
        animate={{pathLength:1,opacity:.7}}
        transition={{duration:1.8,ease:"easeOut"}}/>
      <motion.path d="M95 155 L300 300 L412 138 M300 300 L515 280 M300 300 L438 442 M300 300 L265 512 M300 300 L87 385"
        fill="none" stroke="#65dccc" strokeWidth="1.3"
        initial={{pathLength:reduced?1:0,opacity:.15}}
        animate={{pathLength:1,opacity:.75}}
        transition={{duration:1.9,ease:"easeInOut",delay:.35}}/>
      {([[95,155],[245,92],[412,138],[515,280],[438,442],[265,512],[87,385]] as const).map(([x,y],i)=>
        <circle key={i} cx={x} cy={y} r={i%2?4:3} fill="#b8ffea" opacity=".9"/>)}
    </svg>
    <div className="vv-purpose-vision-center">
      <div className="vv-purpose-center-rays" aria-hidden="true"/>
      <div className="vv-purpose-center-logo"><img src={import.meta.env.BASE_URL+"logo-mark.png"} alt="Visual Verse Creations"/></div>
      <span>OUR NORTH STAR</span>
    </div>
    <div className="vv-purpose-vision-tag vision-tag-one"><i/> SEE</div>
    <div className="vv-purpose-vision-tag vision-tag-two"><i/> FEEL</div>
    <div className="vv-purpose-vision-tag vision-tag-three"><i/> CONNECT</div>
    <div className="vv-purpose-vision-tag vision-tag-four"><i/> REMEMBER</div>
    <div className="vv-purpose-vision-orbit-label" aria-hidden="true">STORIES THAT MATTER • STORIES THAT MOVE • </div>
    <span className="vv-purpose-vision-spark spark-one" aria-hidden="true">✳</span>
    <span className="vv-purpose-vision-spark spark-two" aria-hidden="true">✦</span>
    <span className="vv-purpose-vision-spark spark-three" aria-hidden="true">✧</span>
  </div>;
}

function MissionWorld({reduced}:{reduced:boolean}) {
  const [active,setActive]=useState(0);
  useEffect(()=>{
    if(reduced)return;
    const id=window.setInterval(()=>setActive(v=>(v+1)%missionSteps.length),2800);
    return ()=>window.clearInterval(id);
  },[reduced]);
  return <div className="vv-purpose-mission-world" aria-label="Interactive mission workflow: Imagine, Create, Connect, Deliver">
    <div className="vv-purpose-mission-grid" aria-hidden="true"/>
    <div className="vv-purpose-mission-topline"><span><Sparkles size={13}/> THE CREATIVE RELAY</span><span>IDEA → IMPACT</span></div>
    <div className="vv-purpose-mission-path" aria-hidden="true"><span/><span/><span/><span/></div>
    <div className="vv-purpose-mission-steps" role="group" aria-label="Explore our creative mission stages">
      {missionSteps.map((step,i)=>{
        const Icon=step.Icon;
        return <button key={step.name} type="button"
          className={"vv-purpose-mission-step"+(i===active?" is-active":"")}
          onClick={()=>setActive(i)}
          aria-pressed={i===active}
          data-cursor="EXPLORE"
          style={{"--mission-index":i} as CSSProperties}>
          <span className="vv-purpose-step-glyph"><Icon size={22} strokeWidth={1.6}/></span>
          <span className="vv-purpose-step-copy"><strong>{step.name}</strong><small>{step.label}</small></span>
          <span className="vv-purpose-step-arrow"><ArrowUpRight size={16}/></span>
          {i===active&&<span className="vv-purpose-step-progress" aria-hidden="true"/>}
        </button>;
      })}
    </div>
    <div className="vv-purpose-mission-readout" aria-live="polite" aria-atomic="true">
      <div className="vv-purpose-readout-mark"><WandSparkles size={19}/></div>
      <div className="vv-purpose-readout-copy">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={active}
            initial={reduced?false:{opacity:0,y:8}}
            animate={{opacity:1,y:0}}
            exit={reduced?{opacity:0}:{opacity:0,y:-8}}
            transition={{duration:reduced?0:.3}}>
            <span>THIS IS HOW WE MOVE</span>
            <p>{missionSteps[active].detail}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
    <div className="vv-purpose-mission-ambient" aria-hidden="true">MAKE<br/>IT<br/>MEAN<br/>MORE.</div>
  </div>;
}

export function VisualVersePurposeCompass(){
  const [direction,setDirection]=useState<Direction>("vision");
  const [auto,setAuto]=useState(true);
  const [cycle,setCycle]=useState(0);
  const [inView,setInView]=useState(false);
  const [pageVisible,setPageVisible]=useState(()=>!document.hidden);
  const sectionRef=useRef<HTMLElement>(null);
  const reduce=useReducedMotion();
  const reduced=Boolean(reduce);

  useEffect(()=>{
    const element=sectionRef.current;
    if(!element)return;
    const observer=new IntersectionObserver(entries=>{
      setInView(Boolean(entries[0]?.isIntersecting));
    },{threshold:.08,rootMargin:"45px"});
    observer.observe(element);
    return ()=>observer.disconnect();
  },[]);
  useEffect(()=>{
    const onVisibility=()=>setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange",onVisibility);
    return ()=>document.removeEventListener("visibilitychange",onVisibility);
  },[]);
  useEffect(()=>{
    if(!auto||!pageVisible||!inView||reduced)return;
    const id=window.setTimeout(()=>{
      setDirection(d=>d==="vision"?"mission":"vision");
      setCycle(c=>c+1);
    },LOOP_MS);
    return ()=>window.clearTimeout(id);
  },[auto,pageVisible,inView,reduced,direction,cycle]);

  const choose=(item:Direction)=>{
    setDirection(item);
    setCycle(c=>c+1);
  };
  const running=auto&&inView&&pageVisible&&!reduced;

  return <section className="vv-about-vision vv-purpose-section" id="vision-mission" ref={sectionRef} aria-labelledby="vv-purpose-heading">
    <div className="vv-about-container vv-purpose-container">
      <div className="vv-purpose-microheader">
        <span className="vv-purpose-eyebrow"><span className="vv-purpose-led"/> THE HEART BEHIND THE WORK</span>
        <span className="vv-purpose-coordinates"><Aperture size={13}/> VISUAL VERSE / WHAT GUIDES US</span>
      </div>
      <div className="vv-purpose-shell">
        <div className="vv-purpose-editorial">
          <div className="vv-purpose-editorial-top">
            <span>OUR NORTH STAR & OUR WAY FORWARD <ArrowUpRight size={15}/></span>
            <h2 id="vv-purpose-heading">Dream with<br/><em>direction.</em><br/>Create with<br/><i>purpose.</i></h2>
            <p className="vv-purpose-lede">A vision tells us where we're going. A mission is how we bring every beautiful idea a little closer.</p>
          </div>

          <div className="vv-purpose-switch" role="group" aria-label="Choose to explore our vision or mission">
            <button type="button" aria-pressed={direction==="vision"} onClick={()=>choose("vision")}
              className={"vv-purpose-switch-btn"+(direction==="vision"?" active":"")} data-cursor="VISION">
              <Target size={18}/><span>OUR VISION</span>
              {direction==="vision"&&<span className="vv-purpose-switch-bar" aria-hidden="true">{running&&<motion.i key={"vision-"+cycle} initial={{scaleX:0}} animate={{scaleX:1}} transition={{duration:LOOP_MS/1000,ease:"linear"}}/>}</span>}
            </button>
            <button type="button" aria-pressed={direction==="mission"} onClick={()=>choose("mission")}
              className={"vv-purpose-switch-btn"+(direction==="mission"?" active":"")} data-cursor="MISSION">
              <Compass size={18}/><span>OUR MISSION</span>
              {direction==="mission"&&<span className="vv-purpose-switch-bar" aria-hidden="true">{running&&<motion.i key={"mission-"+cycle} initial={{scaleX:0}} animate={{scaleX:1}} transition={{duration:LOOP_MS/1000,ease:"linear"}}/>}</span>}
            </button>
          </div>
          <div className="vv-purpose-statement" role="region" aria-label="Selected vision or mission statement" aria-live="polite" aria-atomic="true">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={direction}
                initial={reduced?false:{opacity:0,y:26,filter:"blur(7px)"}}
                animate={{opacity:1,y:0,filter:"blur(0px)"}}
                exit={reduced?{opacity:0}:{opacity:0,y:-15,filter:"blur(7px)"}}
                transition={{duration:reduced?0:.47,ease:[.2,1,.3,1]}}>
                <span className="vv-purpose-statement-kicker">{direction==="vision"?"THE DESTINATION":"THE JOURNEY"}</span>
                <h3>{direction==="vision"?<>Make stories<br/><em>matter.</em></>:<>Make it<br/><em>happen.</em></>}</h3>
                <p>{direction==="vision"
                  ?"To make stories matter through creativity that connects."
                  :"Imagine. Create. Connect. Deliver thoughtful creative work that moves people."}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="vv-purpose-editorial-footer">
            <div className="vv-purpose-status"><span className="vv-purpose-status-dot"/> {auto?"THE STORY KEEPS MOVING":"TAKE YOUR TIME. EXPLORE."}</div>
            <button type="button" className="vv-purpose-autoplay"
              aria-pressed={auto} aria-label={auto?"Pause automatic vision and mission switching":"Resume automatic vision and mission switching"}
              onClick={()=>{setAuto(v=>!v);setCycle(v=>v+1)}}>
              {auto?<Pause size={13}/>:<Play size={13}/>} {auto?"PAUSE":"PLAY"}
            </button>
          </div>
        </div>
        <div className={"vv-purpose-stage"+(direction==="mission"?" is-mission":" is-vision")}>
          <div className="vv-purpose-stage-header"><span><span className="vv-purpose-live-dot"/> LIVE / THE PURPOSE ENGINE</span><span>CREATIVITY IN MOTION <ArrowRight size={14}/></span></div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={direction} className="vv-purpose-stage-world"
              initial={reduced?false:{opacity:0,scale:.94,rotate:direction==="vision"?-4:4,filter:"blur(6px)"}}
              animate={{opacity:1,scale:1,rotate:0,filter:"blur(0px)"}}
              exit={reduced?{opacity:0}:{opacity:0,scale:1.05,filter:"blur(6px)"}}
              transition={{duration:reduced?0:.65,ease:[.22,1,.36,1]}}>
              {direction==="vision"?<VisionWorld reduced={reduced}/>:<MissionWorld reduced={reduced}/>}
            </motion.div>
          </AnimatePresence>
          <div className="vv-purpose-stage-bottom"><span>VISUAL VERSE CREATIONS</span><span>{direction==="vision"?"THE WHY":"THE HOW"} <Sparkles size={14}/></span></div>
        </div>
      </div>
      <div className="vv-purpose-afterline"><span>IMAGINE. CREATE. CONNECT.</span><span>GREAT WORK STARTS WITH GREAT PURPOSE.</span></div>
    </div>
  </section>;
}
