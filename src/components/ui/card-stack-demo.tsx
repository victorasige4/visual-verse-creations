import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import {
  Camera, Clapperboard, Film, Layers3, MonitorSmartphone,
  Palette, PenTool, Share2, Sparkles, WandSparkles
} from "lucide-react";
import { CardStack, type CardStackItem } from "./card-stack";

const DURATION = 5200;

function ImagineArtwork() {
  return (
    <div className="vv-about-card-art vv-about-card-imagine" aria-hidden="true">
      <div className="vv-stack-mesh" />
      <div className="vv-stack-soft-orbit" />
      <div className="vv-stack-design-board">
        <div className="vv-stack-window-dots"><i/><i/><i/></div>
        <div className="vv-stack-mood-canvas">
          <svg viewBox="0 0 360 235" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="vv-mood-gradient" x1="0" x2="1"><stop offset="0" stopColor="#2EC4B6"/><stop offset="1" stopColor="#003F5C"/></linearGradient>
            </defs>
            <path className="vv-stack-sketch-line" d="M19 171 C82 89 128 201 185 111 S290 65 337 29" fill="none" stroke="url(#vv-mood-gradient)" strokeWidth="6" strokeLinecap="round" />
            <circle className="vv-stack-art-blob" cx="132" cy="103" r="58" fill="#2EC4B6" opacity=".22"/>
            <rect x="202" y="78" width="92" height="87" rx="12" fill="#003F5C" opacity=".13" transform="rotate(15 250 122)" />
            <rect x="227" y="108" width="84" height="84" rx="12" fill="#2EC4B6" opacity=".64" transform="rotate(15 270 150)" />
            <circle cx="70" cy="65" r="17" fill="#003F5C"/>
            <circle cx="70" cy="65" r="9" fill="#FFFFFF"/>
            <path d="M26 203 L335 203" stroke="#003F5C" opacity=".12" strokeWidth="2" strokeDasharray="5 8"/>
          </svg>
        </div>
        <div className="vv-stack-mood-swatches"><i/><i/><i/><i/></div>
      </div>
      <div className="vv-stack-float vv-stack-float-a"><Palette size={27}/></div>
      <div className="vv-stack-float vv-stack-float-b"><PenTool size={25}/></div>
      <div className="vv-stack-star vv-stack-star-a">✳</div>
      <div className="vv-stack-star vv-stack-star-b">✧</div>
    </div>
  );
}

function CreateArtwork() {
  return (
    <div className="vv-about-card-art vv-about-card-create" aria-hidden="true">
      <div className="vv-stack-mesh"/>
      <div className="vv-stack-film-editor">
        <div className="vv-stack-window-dots"><i/><i/><i/></div>
        <div className="vv-stack-editor-screen">
          <div className="vv-stack-sun"/>
          <div className="vv-stack-editor-hill vv-stack-hill-back"/>
          <div className="vv-stack-editor-hill vv-stack-hill-front"/>
          <span className="vv-stack-viewfinder view-top-left"/><span className="vv-stack-viewfinder view-top-right"/>
          <span className="vv-stack-viewfinder view-bottom-left"/><span className="vv-stack-viewfinder view-bottom-right"/>
          <span className="vv-stack-play-icon"><Clapperboard size={34}/></span>
        </div>
        <div className="vv-stack-timeline">
          <div className="vv-stack-track vv-stack-track-one"><i/><i/><i/></div>
          <div className="vv-stack-track vv-stack-track-two"><i/><i/><i/><i/></div>
          <div className="vv-stack-timeline-playhead"/>
        </div>
      </div>
      <div className="vv-stack-camera-token"><Camera size={33}/><div className="vv-stack-lens"/></div>
      <div className="vv-stack-float vv-stack-float-c"><Film size={22}/></div>
      <div className="vv-stack-float vv-stack-float-d"><WandSparkles size={22}/></div>
    </div>
  );
}

function ConnectArtwork() {
  return (
    <div className="vv-about-card-art vv-about-card-connect" aria-hidden="true">
      <div className="vv-stack-mesh"/>
      <svg className="vv-stack-network" viewBox="0 0 540 330" preserveAspectRatio="none">
        <path d="M85 92 Q180 22 280 162 T472 87" stroke="#2EC4B6" strokeWidth="2.2" fill="none" strokeDasharray="8 9"/>
        <path d="M90 251 Q254 317 410 148" stroke="#2EC4B6" strokeWidth="2.2" fill="none" strokeDasharray="8 9"/>
        <circle cx="85" cy="92" r="7" fill="#2EC4B6"/><circle cx="472" cy="87" r="7" fill="#2EC4B6"/>
        <circle cx="90" cy="251" r="7" fill="#2EC4B6"/><circle cx="410" cy="148" r="7" fill="#2EC4B6"/>
      </svg>
      <div className="vv-stack-web-window">
        <div className="vv-stack-window-dots"><i/><i/><i/></div>
        <div className="vv-stack-web-cover"><div className="vv-stack-web-orb"><Sparkles size={31}/></div><div className="vv-stack-web-shapes"><i/><i/><i/></div></div>
        <div className="vv-stack-web-footer"><span/><span/><span/></div>
      </div>
      <div className="vv-stack-mobile-window"><div className="vv-stack-mobile-camera"/><div className="vv-stack-mobile-art"><MonitorSmartphone size={36}/></div><span/><span/><span/></div>
      <div className="vv-stack-social-token"><Share2 size={28}/></div>
      <div className="vv-stack-connected-bubble vv-stack-connected-a"><Layers3 size={19}/></div>
      <div className="vv-stack-connected-bubble vv-stack-connected-b"><Sparkles size={19}/></div>
    </div>
  );
}

const stages:CardStackItem[] = [
  {id:1,label:"Imagine: a visual moodboard of sketches, shapes and creative direction.",content:<ImagineArtwork/>},
  {id:2,label:"Create: an animated photography and film editing workspace.",content:<CreateArtwork/>},
  {id:3,label:"Connect: coordinated web, mobile and digital storytelling experiences.",content:<ConnectArtwork/>},
];
const stageNames = ["Imagine","Create","Connect"];
const stageCaptions = ["The idea takes shape","Craft in every frame","Your story meets its audience"];

export function CardStackDemo() {
  const [active,setActive] = useState(0);
  const [paused,setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (paused || reduceMotion) return;
    const timer = window.setTimeout(() => setActive((current)=>(current+1)%stages.length),DURATION);
    return () => window.clearTimeout(timer);
  },[active,paused,reduceMotion]);

  return (
    <div
      className={"vv-about-stack-demo" + (paused ? " is-paused" : "")}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={event => {
        if (!event.currentTarget.contains(event.relatedTarget as Node|null)) setPaused(false);
      }}
    >
      <div className="vv-about-stage-viewport">
        <div className="vv-about-stage-halo vv-about-stage-halo-one"/>
        <div className="vv-about-stage-halo vv-about-stage-halo-two"/>
        <CardStack items={stages} activeIndex={active} offset={26} scaleFactor={0.075}/>
      </div>
      <div className="vv-about-card-switches" role="group" aria-label="Explore how Visual Verse brings a story to life">
        {stageNames.map((name,index) => (
          <button key={name} type="button" aria-pressed={active===index}
            className={"vv-about-card-switch" + (active===index?" is-active":"")}
            onClick={()=>setActive(index)}
          >
            <span className="vv-about-card-switch-index">0{index+1}</span>
            <span className="vv-about-card-switch-copy"><strong>{name}</strong><small>{stageCaptions[index]}</small></span>
            <span className="vv-about-card-switch-track"><span key={active===index?"active":"inactive"} className="vv-about-card-switch-fill"/></span>
          </button>
        ))}
      </div>
      <span className="sr-only" role="status" aria-live="polite">{stageNames[active]} stage selected</span>
    </div>
  );
}
