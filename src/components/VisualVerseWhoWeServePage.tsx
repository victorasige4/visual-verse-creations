import { VisualVerseActionContent } from "./VisualVerseAction";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import {
  ArrowDown, ArrowRight, ArrowUpRight, Aperture, BadgeCheck, Building2,
  Camera, Check, Clapperboard, Compass, ExternalLink, Fingerprint,
  Globe2, Lightbulb, Megaphone, MonitorSmartphone, MousePointer2,
  Palette, Play, Rocket, Sparkles, UsersRound, WandSparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import "../who-we-serve-redesign.css";

const BASE = import.meta.env.BASE_URL;
const asset = (file: string) => BASE + file;
const inquire = (audience?: string) =>
  BASE + "request-quote.html" + (audience ? "?audience=" + encodeURIComponent(audience) : "");

type World = {
  id: string; number: string; name: string; eyebrow: string; headline: string;
  blurb: string; promise: string; offerings: string[]; image: string;
  visualWord: string; tone: string; Icon: LucideIcon;
};
const worlds: World[] = [
  {id:"brands",number:"01",name:"Growing brands",eyebrow:"IDENTITIES WITH A POINT OF VIEW",
    headline:"Be the brand they remember.",blurb:"For ambitious brands that want to stop blending in and start being unmistakable.",
    promise:"Branding that looks, sounds and feels like you.",offerings:["Brand identity","Campaign creative","Art direction"],
    image:"portfolio-social-design.jpg",visualWord:"BE / SEEN.",tone:"mint",Icon:Palette},
  {id:"businesses",number:"02",name:"Businesses & teams",eyebrow:"CLARITY FOR BIG IDEAS",
    headline:"Make the complex feel simple.",blurb:"For organisations with a lot to say, and an audience that deserves a clearer story.",
    promise:"Communications with focus and personality.",offerings:["Corporate film","Web experiences","Campaign assets"],
    image:"portfolio-corporate-moment.jpg",visualWord:"MAKE / SENSE.",tone:"blue",Icon:Building2},
  {id:"founders",number:"03",name:"Founders & startups",eyebrow:"THE NEXT BIG THING STARTS SMALL",
    headline:"Make your first move count.",blurb:"For people building something new before the rest of the world can see it.",
    promise:"Launch-ready ideas made visible.",offerings:["Launch branding","Pitch visuals","Landing pages"],
    image:"portfolio-event-detail.jpg",visualWord:"WHAT / IF?",tone:"amber",Icon:Rocket},
  {id:"creators",number:"04",name:"Creators & talent",eyebrow:"FOR THE PEOPLE MAKING CULTURE",
    headline:"Let your point of view lead.",blurb:"For artists, makers and personal brands whose work deserves its own world.",
    promise:"A creative presence that feels like your signature.",offerings:["Portraits","Video & motion","Digital portfolios"],
    image:"portfolio-social-design.jpg",visualWord:"BE / YOU.",tone:"lilac",Icon:Aperture},
  {id:"events",number:"05",name:"Events & communities",eyebrow:"SOME MOMENTS DESERVE MORE",
    headline:"Keep the feeling alive.",blurb:"For the people, milestones and gatherings you never want to forget.",
    promise:"Images and films that take you right back.",offerings:["Event photography","Highlight films","Event graphics"],
    image:"portfolio-graduations.jpg",visualWord:"FEEL / IT.",tone:"coral",Icon:Camera},
  {id:"digital",number:"06",name:"Digital products",eyebrow:"A BETTER WAY TO EXPERIENCE",
    headline:"Make every click feel right.",blurb:"For products and platforms where beautiful design needs to actually work.",
    promise:"Human-centred interfaces with clarity and craft.",offerings:["UI/UX design","Responsive websites","Prototypes"],
    image:"portfolio-corporate-events.jpg",visualWord:"BUILD / BETTER.",tone:"sea",Icon:MonitorSmartphone},
];

const matches = [
  {id:"launch",icon:Rocket,title:"I'm launching something",label:"STARTING FROM ZERO",
    headline:"Give your big idea a first impression worth keeping.",
    text:"From the first logo to the page that introduces you to the world, build a clear creative foundation.",
    services:["Brand identity","Launch content","Landing pages"]},
  {id:"evolve",icon:Compass,title:"It's time for a refresh",label:"READY FOR WHAT'S NEXT",
    headline:"Look as good as the business you've become.",
    text:"Bring your next chapter into focus with a stronger identity, digital presence and creative direction.",
    services:["Rebranding","Web redesign","Campaign direction"]},
  {id:"content",icon:Megaphone,title:"I need content that hits",label:"LET'S GET ATTENTION",
    headline:"Turn the scroll into a real connection.",
    text:"Create imagery and stories built to stand out, communicate something and stay with people.",
    services:["Photography","Video & motion","Social creative"]},
  {id:"moment",icon:Camera,title:"I have a moment to capture",label:"MAKE IT LAST",
    headline:"Because the best moments deserve a second life.",
    text:"Thoughtful coverage and keepsakes that keep the people and atmosphere at the centre.",
    services:["Event photography","Highlight films","Event design"]},
];

const faqs = [
  {question:"What if I don't fit a category?",answer:"Good. These are starting points, not limits. Tell us what you're working on and we'll help shape a creative approach around it."},
  {question:"Do I need to book a full package?",answer:"No. You can come to us for one design, a photo shoot, a website or a broader project. We'll focus on what your idea needs."},
  {question:"Can we work together outside Nairobi?",answer:"Yes, depending on the project. Design and digital work can often happen remotely. For on-location photography and video, we can discuss logistics and availability."},
];

function Eyebrow({children,dark=false}:{children:React.ReactNode;dark?:boolean}) {
  return <span className={"vvx-eyebrow"+(dark?" vvx-eyebrow-dark":"")}><span className="vvx-eyebrow-pip" aria-hidden="true"/>{children}</span>;
}

function Reveal({children,className="",delay=0}:{children:React.ReactNode;className?:string;delay?:number}) {
  const reduced=useReducedMotion();
  return <motion.div className={className}
    initial={reduced?false:{opacity:0,y:32}}
    whileInView={reduced?undefined:{opacity:1,y:0}}
    viewport={{once:true,amount:.12}}
    transition={{duration:.7,delay,ease:[.2,.9,.2,1]}}>{children}</motion.div>;
}

function Hero() {
  const reduced=useReducedMotion();
  const mouseX=useMotionValue(0),mouseY=useMotionValue(0);
  const smoothX=useSpring(mouseX,{stiffness:120,damping:23});
  const smoothY=useSpring(mouseY,{stiffness:120,damping:23});
  const rotateY=useTransform(smoothX,[-1,1],[-10,10]);
  const rotateX=useTransform(smoothY,[-1,1],[8,-8]);
  const onPointer=(event:PointerEvent<HTMLElement>)=>{
    if(reduced||event.pointerType!=="mouse")return;
    const rect=event.currentTarget.getBoundingClientRect();
    const x=(event.clientX-rect.left)/rect.width;
    const y=(event.clientY-rect.top)/rect.height;
    mouseX.set((x-.5)*2);mouseY.set((y-.5)*2);
    event.currentTarget.style.setProperty("--vvx-pointer-x",(x*100).toFixed(2)+"%");
    event.currentTarget.style.setProperty("--vvx-pointer-y",(y*100).toFixed(2)+"%");
  };
  return <section className="vvx-hero" id="who-we-serve" aria-labelledby="vvx-hero-title"
    onPointerMove={onPointer}
    onPointerLeave={()=>{mouseX.set(0);mouseY.set(0);}}>
    <div className="vvx-hero-grid" aria-hidden="true"/>
    <div className="vvx-hero-spotlight" aria-hidden="true"/>
    <div className="vvx-container vvx-hero-inner">
      <div className="vvx-hero-copy">
        <motion.div initial={reduced?false:{opacity:0,y:20}} animate={{opacity:1,y:0}}
          transition={{duration:.65,delay:.08}} className="vvx-hero-eyebrow">
          <span className="vvx-hero-id">VV — 003</span><span className="vvx-hero-line"/>
          WHO WE CREATE WITH
        </motion.div>
        <h1 id="vvx-hero-title" className="vvx-hero-heading">
          {["No two","stories","alike."].map((text,index)=>
            <span className={"vvx-hero-heading-row vvx-hero-heading-"+index} key={text}>
              <motion.span initial={reduced?false:{y:"115%",opacity:0}} animate={{y:"0%",opacity:1}}
                transition={{duration:.85,delay:.14+index*.13,ease:[.16,1,.3,1]}}>{text}</motion.span>
            </span>)}
        </h1>
        <motion.div initial={reduced?false:{opacity:0,y:20}} animate={{opacity:1,y:0}}
          transition={{delay:.62,duration:.7}} className="vvx-hero-bottom">
          <p>Some people build brands. Others build movements, moments, or the next big thing. We make creative work that feels like <em>yours.</em></p>
          <div className="vvx-hero-buttons">
            <a className="vvx-pill vvx-pill-primary vv-motion-action vv-action-primary" href="#explore"><VisualVerseActionContent Icon={ArrowDown}>Find your people</VisualVerseActionContent></a>
            <a className="vvx-pill vvx-pill-ghost vv-motion-action vv-action-secondary" href={inquire()}><VisualVerseActionContent Icon={ArrowUpRight}>Let's create</VisualVerseActionContent></a>
          </div>
        </motion.div>
      </div>
      <motion.div className="vvx-hero-stage" initial={reduced?false:{opacity:0,scale:.9,x:70}}
        animate={{opacity:1,scale:1,x:0}} transition={{duration:1,delay:.28,ease:[.2,1,.3,1]}}
        aria-label="A collage of original Visual Verse creative work">
        <motion.div className="vvx-hero-stage-perspective" style={reduced?undefined:{rotateX,rotateY}}>
          <div className="vvx-hero-orbit vvx-hero-orbit-one" aria-hidden="true"/>
          <div className="vvx-hero-orbit vvx-hero-orbit-two" aria-hidden="true"/>
          <figure className="vvx-float-photo vvx-float-photo-a">
            <img src={asset("portfolio-event-story.jpg")} alt="Event photography from Visual Verse" decoding="async" fetchPriority="high"/>
            <figcaption>PEOPLE / MOMENTS</figcaption>
          </figure>
          <figure className="vvx-float-photo vvx-float-photo-b">
            <img src={asset("portfolio-social-design.jpg")} alt="Visual Verse design artwork" decoding="async"/>
            <figcaption>BRANDS / IDEAS</figcaption>
          </figure>
          <figure className="vvx-float-photo vvx-float-photo-c">
            <img src={asset("portfolio-corporate-moment.jpg")} alt="Visual Verse corporate event photography" decoding="async"/>
          </figure>
          <span className="vvx-hero-disc" aria-hidden="true"><Sparkles size={26}/> MADE FOR YOU</span>
          <span className="vvx-hero-counter" aria-hidden="true"><strong>06</strong><small>WORLDS.<br/>ENDLESS IDEAS.</small></span>
        </motion.div>
      </motion.div>
    </div>
    <div className="vvx-container vvx-hero-footer"><span>VISUAL VERSE CREATIONS / NAIROBI, KENYA</span><a href="#explore">SCROLL TO EXPLORE <ArrowDown size={15}/></a></div>
  </section>;
}

function Marquee() {
  const words=["BRANDS","FOUNDERS","CREATORS","BUSINESSES","EVENTS","DIGITAL DREAMERS"];
  return <div className="vvx-ribbon" aria-label="Creative work for brands, founders, creators, businesses, events and digital teams">
    <div className="vvx-ribbon-track">{[0,1].map(i=><div className="vvx-ribbon-set" key={i} aria-hidden={i===1}>
      {words.map(word=><span key={word}>{word}<Aperture size={21} strokeWidth={1.4} aria-hidden="true"/></span>)}
    </div>)}</div>
  </div>;
}

function WorldStage({world}:{world:World}) {
  const reduced=useReducedMotion();
  const Icon=world.Icon;
  return <div className={"vvx-world-visual vvx-world-"+world.tone}>
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={world.id} className="vvx-world-poster"
        initial={reduced?false:{opacity:0,y:24,rotateY:-7,filter:"blur(12px)"}}
        animate={{opacity:1,y:0,rotateY:0,filter:"blur(0px)"}}
        exit={reduced?undefined:{opacity:0,y:-16,filter:"blur(7px)"}}
        transition={{duration:.48,ease:[.2,.9,.25,1]}}>
        <img className="vvx-world-photo" src={asset(world.image)} alt="" loading="lazy" decoding="async" />
        <div className="vvx-world-scrim" aria-hidden="true"/>
        <div className="vvx-world-poster-top"><span>VISUAL VERSE / {world.number}</span><Icon size={28} strokeWidth={1.25}/></div>
        <strong className="vvx-world-poster-word">{world.visualWord.split(" / ").map((part,i)=><span key={i}>{part}</span>)}</strong>
        <div className="vvx-world-poster-bottom"><span>{world.eyebrow}</span><span>MADE TO MATTER. <ArrowUpRight size={15}/></span></div>
      </motion.div>
    </AnimatePresence>
    <span className="vvx-world-stamp" aria-hidden="true"><span>VV</span><small>CREATIVE<br/>PARTNERS</small></span>
    <span className="vvx-world-spark" aria-hidden="true"><Sparkles size={40}/></span>
  </div>;
}

function WorldAtlas() {
  const [active,setActive]=useState(0);
  const root=useRef<HTMLElement|null>(null);
  const reduced=useReducedMotion();
  useEffect(()=>{
    const scope=root.current;
    if(!scope||typeof IntersectionObserver==="undefined")return;
    const desktop=window.matchMedia("(min-width: 901px)");
    let observer:IntersectionObserver|null=null;
    const setup=()=>{
      observer?.disconnect();observer=null;
      if(!desktop.matches)return;
      observer=new IntersectionObserver((entries)=>{
        const candidates=entries.filter(x=>x.isIntersecting);
        if(!candidates.length)return;
        const choice=candidates.sort((a,b)=>Math.abs(a.boundingClientRect.top+a.boundingClientRect.height/2-innerHeight*.52)-Math.abs(b.boundingClientRect.top+b.boundingClientRect.height/2-innerHeight*.52))[0];
        const index=Number((choice.target as HTMLElement).dataset.worldIndex);
        if(Number.isInteger(index))setActive(index);
      },{rootMargin:"-35% 0px -35% 0px",threshold:0});
      scope.querySelectorAll<HTMLElement>(".vvx-world-chapter").forEach(el=>observer?.observe(el));
    };
    setup();
    desktop.addEventListener("change",setup);
    return ()=>{observer?.disconnect();desktop.removeEventListener("change",setup);};
  },[]);
  const world=worlds[active];
  const Icon=world.Icon;
  return <section className="vvx-atlas" id="explore" aria-labelledby="vvx-atlas-heading" ref={root}>
    <div className="vvx-container">
      <Reveal className="vvx-section-header">
        <Eyebrow>THE PEOPLE / THE POSSIBILITIES</Eyebrow>
        <div className="vvx-section-header-grid">
          <h2 id="vvx-atlas-heading">Find your<br/><em>frequency.</em></h2>
          <p>Six different worlds. One thing in common: a story worth bringing to life. Scroll through them—or choose your own.</p>
        </div>
      </Reveal>
      <div className="vvx-atlas-layout">
        <div className="vvx-world-chapters" aria-label="Creative audiences">
          {worlds.map((item,i)=>{
            const ChapterIcon=item.Icon;
            return <button type="button" key={item.id}
              className={"vvx-world-chapter"+(active===i?" is-active":"")}
              data-world-index={i}
              onClick={()=>setActive(i)} aria-pressed={active===i}>
              <span className="vvx-world-chapter-number">{item.number} / 06</span>
              <span className="vvx-world-chapter-content"><span className="vvx-world-chapter-eyebrow"><ChapterIcon size={16} aria-hidden="true"/>{item.name}</span><strong>{item.headline}</strong><span className="vvx-world-chapter-blurb">{item.blurb}</span><span className="vvx-world-chapter-hint">EXPLORE THIS WORLD <ArrowRight size={16}/></span></span>
            </button>;
          })}
        </div>
        <div className="vvx-world-mobile-tabs" role="group" aria-label="Choose who we serve">
          {worlds.map((item,i)=><button key={item.id} type="button"
            aria-pressed={active===i} className={active===i?"is-active":""}
            onClick={()=>setActive(i)}>{item.number} <span>{item.name}</span></button>)}
        </div>
        <div className="vvx-world-sticky">
          <div className="vvx-world-stage-top"><span><span className="vvx-signal-pulse"/> NOW EXPLORING / {world.name.toUpperCase()}</span><span>{world.number}—06</span></div>
          <WorldStage world={world}/>
          <div className="vvx-world-stage-bottom" key={world.id}>
            <div className="vvx-world-stage-summary"><span>THE CREATIVE BRIEF</span><h3>{world.headline}</h3><p>{world.blurb}</p><span className="vvx-world-stage-promise">{world.promise}</span></div>
            <div className="vvx-world-stage-tags">{world.offerings.map(x=><span key={x}>{x}</span>)}</div>
            <a href={inquire(world.name)} className="vvx-world-stage-link vv-motion-action vv-action-primary"><VisualVerseActionContent Icon={ArrowUpRight}>Create with us</VisualVerseActionContent></a>
          </div>
        </div>
      </div>
      <Reveal className="vvx-atlas-note"><Sparkles size={20}/><p>Don't see yourself in a category? Even better. We like ideas that don't fit neatly into a box.</p><a href={inquire()}>Tell us yours <ArrowUpRight size={16}/></a></Reveal>
    </div>
  </section>;
}

function Wobble({children,className=""}:{children:React.ReactNode;className?:string}) {
  const reduced=useReducedMotion();
  const mouseX=useMotionValue(0),mouseY=useMotionValue(0);
  const smoothX=useSpring(mouseX,{stiffness:165,damping:24});
  const smoothY=useSpring(mouseY,{stiffness:165,damping:24});
  const rotateY=useTransform(smoothX,[-1,1],[-3.6,3.6]);
  const rotateX=useTransform(smoothY,[-1,1],[3,-3]);
  return <motion.div className={"vvx-wobble "+className} style={reduced?undefined:{rotateX,rotateY}}
    onPointerMove={event=>{
      if(reduced||event.pointerType!=="mouse")return;
      const box=event.currentTarget.getBoundingClientRect();
      mouseX.set(((event.clientX-box.left)/box.width-.5)*2);
      mouseY.set(((event.clientY-box.top)/box.height-.5)*2);
    }}
    onPointerLeave={()=>{mouseX.set(0);mouseY.set(0);}}>{children}</motion.div>;
}

function Collaboration() {
  return <section className="vvx-collab" id="possibilities" aria-labelledby="vvx-collab-heading">
    <div className="vvx-container">
      <Reveal className="vvx-collab-heading">
        <Eyebrow dark>THE GOOD STUFF HAPPENS TOGETHER</Eyebrow>
        <h2 id="vvx-collab-heading">Your world.<br/><em>Our toolbox.</em></h2>
        <p>A little of this. A lot of that. We mix the right creative disciplines for the story, not the other way around.</p>
      </Reveal>
      <div className="vvx-collab-bento">
        <Wobble className="vvx-wobble-photo">
          <img src={asset("portfolio-event-story.jpg")} loading="lazy" alt="Visual Verse event storytelling in action"/>
          <div className="vvx-wobble-photo-shade"/>
          <span className="vvx-bento-kicker">01 / THROUGH THE LENS</span>
          <strong>MAKE IT<br/>FEEL REAL.</strong>
          <div className="vvx-bento-foot"><span>PHOTOGRAPHY + FILM</span><Camera size={28}/></div>
        </Wobble>
        <Wobble className="vvx-wobble-type">
          <span className="vvx-bento-kicker">02 / FROM A BLANK CANVAS</span>
          <div className="vvx-wobble-orbit" aria-hidden="true"><Fingerprint size={170} strokeWidth={.6}/></div>
          <strong>STAND<br/><em>OUT.</em></strong>
          <p>Identity. Campaigns. Design that has something to say.</p>
          <div className="vvx-bento-foot"><span>BRANDING + GRAPHIC DESIGN</span><Palette size={26}/></div>
        </Wobble>
        <Wobble className="vvx-wobble-device">
          <span className="vvx-bento-kicker">03 / THE DIGITAL WORLD</span>
          <div className="vvx-wobble-browser" aria-hidden="true"><div className="vvx-wobble-browser-header"><i/><i/><i/><span>VISUALVERSE / INTERACTIVE</span></div><div className="vvx-wobble-browser-body"><span>YOU ARE HERE</span><strong>GOOD DESIGN<br/>IS FELT.</strong><span className="vvx-wobble-screen-button">LET'S BUILD IT <ArrowUpRight size={12}/></span></div></div>
          <div className="vvx-bento-foot"><span>WEB + UI/UX</span><MonitorSmartphone size={26}/></div>
        </Wobble>
      </div>
      <Reveal className="vvx-collab-bottom"><p>No one-size-fits-all packages. Just work that's made for where you are and where you're headed.</p><a href={BASE+"services.html"}>Explore the toolbox <ArrowUpRight size={17}/></a></Reveal>
    </div>
  </section>;
}

function FitFinder() {
  const [active,setActive]=useState(0);
  const reduced=useReducedMotion();
  const selected=matches[active];
  const SelectedIcon=selected.icon;
  return <section className="vvx-match" id="find-your-fit" aria-labelledby="vvx-match-heading">
    <div className="vvx-container">
      <Reveal className="vvx-match-heading"><Eyebrow>YOUR NEXT MOVE</Eyebrow><h2 id="vvx-match-heading">So, what are<br/>we <em>making?</em></h2><p>Not sure what to ask for? Start with what you're trying to do. We'll help connect the dots.</p></Reveal>
      <div className="vvx-match-shell">
        <div className="vvx-match-options" role="tablist" aria-label="What do you want to create?">
          {matches.map((item,i)=>{
            const Icon=item.icon;
            return <button key={item.id} type="button" role="tab" id={"vvx-option-"+i}
              aria-controls="vvx-match-result" aria-selected={active===i}
              tabIndex={active===i?0:-1}
              onClick={()=>setActive(i)}
              onKeyDown={event=>{
                const index=event.key==="ArrowDown"?(i+1)%matches.length:event.key==="ArrowUp"?(i-1+matches.length)%matches.length:event.key==="Home"?0:event.key==="End"?matches.length-1:-1;
                if(index>=0){event.preventDefault();setActive(index);(event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]'))?.[index]?.focus();}
              }} className={"vvx-match-option"+(active===i?" is-active":"")}>
              <span className="vvx-match-option-icon"><Icon size={22}/></span><span>{item.title}</span><ArrowUpRight size={18} className="vvx-match-option-arrow"/>
            </button>;
          })}
        </div>
        <div className="vvx-match-result" id="vvx-match-result" role="tabpanel" aria-labelledby={"vvx-option-"+active} tabIndex={0}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={selected.id} className="vvx-match-inner"
              initial={reduced?false:{opacity:0,y:17,filter:"blur(6px)"}}
              animate={{opacity:1,y:0,filter:"blur(0px)"}}
              exit={reduced?undefined:{opacity:0,y:-14,filter:"blur(4px)"}}
              transition={{duration:.28,ease:[.2,.8,.2,1]}}>
              <div className="vvx-match-result-top"><span>{selected.label}</span><SelectedIcon size={35} strokeWidth={1.5}/></div>
              <h3>{selected.headline}</h3><p>{selected.text}</p>
              <div className="vvx-match-services">{selected.services.map(service=><span key={service}><Check size={14}/>{service}</span>)}</div>
              <a className="vvx-pill vvx-pill-primary vv-motion-action vv-action-primary" href={inquire(selected.title)}><VisualVerseActionContent Icon={ArrowUpRight}>Talk to us about it</VisualVerseActionContent></a>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  </section>;
}

function FinalStatement() {
  const reduced=useReducedMotion();
  return <section className="vvx-finale" aria-labelledby="vvx-finale-heading">
    <div className="vvx-container vvx-finale-inner">
      <Reveal className="vvx-finale-kicker"><Eyebrow dark>AT THE END OF THE DAY</Eyebrow></Reveal>
      <h2 id="vvx-finale-heading"><span>It's not about</span><span>the <em>industry.</em></span><span>It's about</span><span><em>your story.</em></span></h2>
      <motion.div className="vvx-finale-row" initial={reduced?false:{opacity:0,y:20}}
        whileInView={reduced?undefined:{opacity:1,y:0}} viewport={{once:true}}
        transition={{duration:.6}}>
        <p>Whether you're starting, growing, changing or celebrating—great creative work starts with understanding what matters to you.</p>
        <a href={inquire()} className="vvx-finale-link vv-motion-action vv-action-on-dark"><VisualVerseActionContent Icon={ArrowUpRight}>Let's make something matter</VisualVerseActionContent></a>
      </motion.div>
      <div className="vvx-finale-watermark" aria-hidden="true">VV.</div>
    </div>
  </section>;
}

export function VisualVerseWhoWeServePage() {
  return <div className="vvx-page">
    <Hero/>
    <Marquee/>
    <WorldAtlas/>
    <Collaboration/>
    <FitFinder/>
    <section className="vvx-questions" aria-label="Questions about working with us">
      <div className="vvx-container">
        <Reveal className="vvx-questions-head"><Eyebrow>GOOD TO KNOW</Eyebrow><h2>No pressure.<br/><em>Just possibilities.</em></h2></Reveal>
        <div className="vvx-questions-list">{faqs.map((faq,i)=><details key={faq.question} className="vvx-faq"><summary><span>0{i+1}</span><strong>{faq.question}</strong><span className="vvx-faq-toggle" aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}</div>
      </div>
    </section>
    <FinalStatement/>
  </div>;
}
