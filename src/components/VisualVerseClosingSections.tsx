import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight, ArrowUpRight, ChevronDown, CheckCircle2, Globe2, Mail,
  MapPin, MoveUpRight, Sparkles, ArrowUp, Compass, BriefcaseBusiness
} from "lucide-react";
import { kenyaCities, mapRegions, type KenyaCity, type LngLat } from "@/data/east-africa";

const creativeWords = [
  "Marketing", "User Experience", "Interaction Design", "Logos", "Brand Identity",
  "Photography", "Videography", "Motion Graphics", "Art Direction", "Graphic Design",
  "Web Design", "UI Design", "UX Research", "Digital Campaigns", "Content Strategy",
  "Social Media", "Visual Storytelling", "Creative Strategy", "Illustration", "Video Editing"
];

export function VisualVerseMarquee() {
  const renderWords = (prefix: string) => creativeWords.map((word, index) => (
    <span className="vv-close-marquee-word" key={prefix + index}>
      {word}
      <span className="vv-close-marquee-separator" aria-hidden="true">✳</span>
    </span>
  ));

  return (
    <div className="vv-close-marquee" aria-label={"Visual Verse creative services: " + creativeWords.join(", ")}>
      <div className="vv-close-marquee-track">
        <div className="vv-close-marquee-set">{renderWords("first-")}</div>
        <div className="vv-close-marquee-set" aria-hidden="true">{renderWords("repeat-")}</div>
      </div>
    </div>
  );
}

const MAP_W = 900;
const MAP_H = 585;
/* Equirectangular diagram suited to the near-equatorial Kenya region. */
function project([lon, lat]: LngLat) {
  return { x: (lon - 29) / 16 * MAP_W, y: (9.5 - lat) / 16.6 * MAP_H };
}
function countryPath(points: LngLat[]) {
  return points.map((point, i) => {
    const xy = project(point);
    return (i ? "L" : "M") + xy.x.toFixed(2) + " " + xy.y.toFixed(2);
  }).join(" ") + "Z";
}
const labels: { name: string; coordinate: LngLat }[] = [
  {name:"SOUTH SUDAN", coordinate:[32.2,7.4]},
  {name:"ETHIOPIA", coordinate:[38.45,7.2]},
  {name:"SOMALIA", coordinate:[43.0,2.7]},
  {name:"UGANDA", coordinate:[31.4,1.8]},
  {name:"TANZANIA", coordinate:[35.7,-5.4]},
];

const cityCoordinates = kenyaCities.map(city => ({
  ...city, point: project([city.lon, city.lat])
}));
const anchor = project([36.8219, -1.2921]);
const CONTACT_EMAIL = "hello@visualverse.com"; // Existing site's contact address; verify before publishing.

function MapConnection({ city, index, active }: {city: typeof cityCoordinates[number]; index: number; active: boolean}) {
  if(city.key === "nairobi")return null;
  const x1=anchor.x,y1=anchor.y,x2=city.point.x,y2=city.point.y;
  const midX=(x1+x2)/2;
  const controlY=Math.min(y1,y2)-Math.min(42,Math.abs(x1-x2)*.23)-6;
  return (
    <motion.path
      d={"M"+x1+","+y1+" Q"+midX+","+controlY+" "+x2+","+y2}
      fill="none"
      stroke={active?"#21af9e":"#62cdbc"}
      strokeWidth={active?2.1:1}
      strokeOpacity={active?.83:.34}
      strokeDasharray={active?"none":"5 7"}
      initial={{pathLength:0,opacity:0}}
      animate={{pathLength:1,opacity:1}}
      transition={{duration:1.25,delay:index*.08,ease:"easeInOut"}}
      className="vv-map-connection"
    />
  );
}

export function VisualVerseWhereWeServe() {
  const [activeKey,setActiveKey]=useState("nairobi");
  const [reduced,setReduced]=useState(false);
  useEffect(()=>{
    const m=window.matchMedia("(prefers-reduced-motion: reduce)");
    const change=()=>setReduced(m.matches);
    change();
    m.addEventListener("change",change);
    return ()=>m.removeEventListener("change",change);
  },[]);
  const selected=kenyaCities.find(city=>city.key===activeKey)??kenyaCities[0];
  const polygons=useMemo(()=>mapRegions.map(region=>({...region,path:countryPath(region.polygon)})),[]);
  return (
    <div className="vv-close-location">
      <div className="vv-close-location-heading">
        <div>
          <span className="vv-close-eyebrow"><span/> WHERE WE SERVE / 006</span>
          <h2>Based in Nairobi.<br/>Creating for <em>Kenya.</em></h2>
        </div>
        <div className="vv-close-location-summary">
          <p>Our creative home is in Nairobi. We collaborate with brands, businesses and people across Kenya through remote projects and on-site work by arrangement.</p>
          <div className="vv-close-location-meta">
            <span><MapPin size={15} aria-hidden="true"/> NAIROBI, KENYA</span>
            <span><Globe2 size={15} aria-hidden="true"/> COUNTRYWIDE COLLABORATION</span>
          </div>
        </div>
      </div>

      <div className="vv-close-map-card">
        <div className="vv-close-map-top">
          <span>KENYA / EAST AFRICA</span>
          <div className="vv-close-map-legend" aria-label="Map legend">
            <span><i className="vv-close-legend-kenya"/> KENYA</span>
            <span><i className="vv-close-legend-neighbor"/> NEIGHBOURING COUNTRIES</span>
          </div>
        </div>
        <div className="vv-close-map-stage">
          <svg viewBox="0 0 900 585" role="img" aria-label="Dotted map of Kenya highlighted in aqua, neighboring Uganda, Tanzania, South Sudan, Ethiopia and Somalia in grey, and markers for eight Kenyan cities.">
            <defs>
              <pattern id="vv-map-neighbor-dots" width="8" height="8" patternUnits="userSpaceOnUse">
                <circle cx="3.2" cy="3.2" r="1.12" fill="#b3c8c3" opacity=".75"/>
              </pattern>
              <pattern id="vv-map-kenya-dots" width="8" height="8" patternUnits="userSpaceOnUse">
                <circle cx="3.2" cy="3.2" r="1.54" fill="#49bf9c"/>
              </pattern>
              <mask id="vv-map-kenya-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="900" height="585">
                <motion.rect x="0" y="0" height="585" fill="white"
                  initial={{width:reduced?900:0}}
                  whileInView={{width:900}}
                  viewport={{once:true,amount:.3}}
                  transition={{duration:reduced?0:2.3,ease:[.22,1,.36,1]}}/>
              </mask>
              <linearGradient id="vv-map-route" x1="0" y1="0" x2="1" y2="0">
                <stop stopColor="#2ec4b6" stopOpacity=".05"/>
                <stop offset="1" stopColor="#1da895" stopOpacity=".85"/>
              </linearGradient>
            </defs>
            <g className="vv-close-map-neighbours" aria-hidden="true">
              {polygons.filter(region=>region.id!=="KEN").map(region=>(
                <path key={region.id} d={region.path} fill="url(#vv-map-neighbor-dots)" stroke="#cadbd5" strokeWidth="1.1"/>
              ))}
              {labels.map(item=>{
                const pos=project(item.coordinate);
                return <text key={item.name} x={pos.x} y={pos.y} textAnchor="middle" className="vv-map-country-label">{item.name}</text>;
              })}
            </g>
            {polygons.filter(region=>region.id==="KEN").map(region=>(
              <g key={region.id}>
                <path d={region.path} fill="url(#vv-map-kenya-dots)" mask="url(#vv-map-kenya-mask)"/>
                <motion.path d={region.path} fill="none" stroke="#2ec4b6" strokeWidth="2.5"
                  initial={{pathLength:reduced?1:0}}
                  whileInView={{pathLength:1}}
                  viewport={{once:true,amount:.3}}
                  transition={{duration:reduced?0:2.4,ease:"easeInOut"}}/>
              </g>
            ))}
            <text x={project([38.4,1.0]).x} y={project([38.4,1.0]).y} textAnchor="middle" className="vv-map-kenya-label">KENYA</text>
            <g className="vv-close-map-connections" aria-hidden="true">
              {cityCoordinates.map((city,index)=><MapConnection key={city.key} city={city} index={index} active={city.key===activeKey}/>)}
            </g>
            {cityCoordinates.map(city=>{
              const chosen=activeKey===city.key;
              return (
                <g key={city.key} className={"vv-close-map-marker"+(chosen?" is-active":"")}
                  transform={"translate("+city.point.x+" "+city.point.y+")"}
                  onClick={()=>setActiveKey(city.key)} tabIndex={0} role="button"
                  aria-label={"Highlight "+city.name} aria-pressed={chosen}
                  onKeyDown={event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();setActiveKey(city.key);}}}>
                  <circle r={chosen?18:12} fill="#2ec4b6" fillOpacity={chosen?.13:.08}/>
                  <circle r={chosen?6.3:4.5} fill={chosen?"#003f5c":"#11998b"} stroke="white" strokeWidth="1.8"/>
                  {chosen && <circle r="13" fill="none" stroke="#2ec4b6" strokeWidth="1.4" className={reduced?"":"vv-map-pulse"}/>}
                  <text y={city.key==="mombasa"?-12:city.key==="nairobi"?-15:-11} x={city.key==="kisumu"?-11:city.key==="nyeri"?13:8}
                    textAnchor={city.key==="kisumu"?"end":"start"} className="vv-map-city-label">{city.name}</text>
                </g>
              );
            })}
            <text x="770" y="546" textAnchor="middle" className="vv-map-ocean-label">INDIAN OCEAN</text>
          </svg>
        </div>
        <div className="vv-close-map-bottom">
          <div>
            <span className="vv-close-map-local-label">EXPLORE A CITY</span>
            <div className="vv-close-map-city-list" role="group" aria-label="Highlight a city in Kenya">
              {kenyaCities.map(city=><button type="button" key={city.key}
                aria-pressed={activeKey===city.key} onClick={()=>setActiveKey(city.key)}
                className={activeKey===city.key?"is-active":""}>{city.name}</button>)}
            </div>
          </div>
          <div className="vv-close-map-city-info" aria-live="polite">
            <MapPin size={17} aria-hidden="true"/>
            <div><strong>{selected.name}</strong><span>{selected.key==="nairobi"?"Visual Verse home base":"Remote collaboration · On-site by arrangement"}</span></div>
          </div>
        </div>
      </div>
      <div className="vv-close-location-facts">
        <div><span>01 /</span><strong>Nairobi at heart</strong><p>Ideas, people and perspectives from our home city.</p></div>
        <div><span>02 /</span><strong>Across Kenya</strong><p>Creative collaboration without unnecessary boundaries.</p></div>
        <div><span>03 /</span><strong>Remote-ready</strong><p>Clear communication and practical project workflows.</p></div>
        <div><span>04 /</span><strong>On location</strong><p>Photography and productions planned around your needs.</p></div>
      </div>
      <p className="vv-close-map-source">Illustrative geographic map based on simplified Natural Earth country outlines. Highlighted cities indicate potential collaboration locations, not physical branch offices.</p>
    </div>
  );
}

const questions = [
  {
    question:"What services does Visual Verse offer?",
    answer:"We bring together photography, videography, branding, graphic design, web and UI/UX design, and social media and digital marketing. We can focus on one service or combine disciplines around a broader creative brief.",
  },
  {
    question:"Do you work with clients outside Nairobi?",
    answer:"Yes. We can collaborate remotely with clients across Kenya. For photography, videography and other work that requires an on-site presence, travel and scheduling are discussed during project planning.",
  },
  {
    question:"How do we start a project?",
    answer:"Share what you are building, the outcome you need, your timeline and any reference material. We can then clarify the scope, creative direction and next steps before confirming the project.",
  },
  {
    question:"How is a project priced?",
    answer:"Every quote depends on the deliverables, scope, complexity, usage needs and turnaround time. We prepare an appropriate quotation after discussing your requirements; there is no universal price for every project.",
  },
  {
    question:"Can you work with an existing logo or brand identity?",
    answer:"Absolutely. We can work within your current guidelines, refresh selected elements or discuss a complete identity project if that is what your brand needs.",
  },
  {
    question:"How long does a project usually take?",
    answer:"Timelines vary depending on the service, complexity, feedback rounds and assets required. We agree on realistic milestones before production begins.",
  },
  {
    question:"Will I be involved in the creative process?",
    answer:"Yes. We begin by understanding your brief and include feedback points throughout the project so the final work reflects your vision and the agreed creative direction.",
  },
];

export function VisualVerseFaq() {
  const [open,setOpen]=useState<number|null>(0);
  return (
    <div className="vv-close-faq">
      <div className="vv-close-faq-intro">
        <span className="vv-close-eyebrow"><span/> QUESTIONS & ANSWERS / 007</span>
        <h2>Straight answers<br/>before you start.</h2>
        <p>Everything you might want to know before we make something together. Have another question? We would love to hear it.</p>
        <a className="vv-close-small-cta" href="#contact">Ask us anything <span><ArrowUpRight size={16} aria-hidden="true"/></span></a>
        <a href={"mailto:"+CONTACT_EMAIL+"?subject=Visual%20Verse%20Question"} className="vv-close-faq-mail"><Mail size={14} aria-hidden="true"/> Email a question</a>
      </div>
      <div className="vv-close-faq-list">
        {questions.map((item,index)=>{
          const opened=open===index;
          return (
            <div className={"vv-close-faq-item"+(opened?" is-open":"")} key={item.question}>
              <h3>
                <button type="button" onClick={()=>setOpen(opened?null:index)} aria-expanded={opened}
                  aria-controls={"vv-faq-answer-"+index}>
                  <span>{item.question}</span>
                  <span className="vv-close-faq-icon"><span aria-hidden="true">{opened?"−":"+"}</span></span>
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {opened&&(
                  <motion.div key="answer" id={"vv-faq-answer-"+index}
                    initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}}
                    exit={{height:0,opacity:0}}
                    transition={{duration:.26,ease:[.22,1,.36,1]}}
                    className="vv-close-faq-answer" role="region">
                    <p>{item.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function VisualVerseCTA(){
  return (
    <div className="vv-close-cta">
      <div className="vv-close-cta-content">
        <span className="vv-close-cta-eyebrow"><i aria-hidden="true"/> LET'S MAKE SOMETHING MATTER / 008</span>
        <h2>Have an idea<br/>worth bringing<br/>to <em>life?</em></h2>
        <p>From your first concept to the final frame, let's create something people remember.</p>
        <div className="vv-close-cta-buttons">
          <a href={"mailto:"+CONTACT_EMAIL+"?subject=Start%20a%20Visual%20Verse%20Project"} className="vv-close-cta-primary">Let's talk <span><ArrowUpRight size={18} aria-hidden="true"/></span></a>
          <a href="/projects.html" className="vv-close-cta-secondary">Explore our work <span><ArrowUpRight size={18} aria-hidden="true"/></span></a>
        </div>
        <div className="vv-close-cta-meta">
          <span><MapPin size={13} aria-hidden="true"/> NAIROBI, KENYA</span>
          <a href={"mailto:"+CONTACT_EMAIL}><Mail size={13} aria-hidden="true"/> {CONTACT_EMAIL}</a>
        </div>
      </div>
      <span className="vv-close-cta-orbit" aria-hidden="true"/>
      <img className="vv-close-cta-mark" src="/logo-mark.png" alt="" aria-hidden="true" loading="lazy"/>
    </div>
  );
}

const serviceLinks=[
  {label:"Photography",href:"/#service-photography"},
  {label:"Videography",href:"/#service-videography"},
  {label:"Branding",href:"/#service-branding"},
  {label:"Graphic Design",href:"/#service-graphic-design"},
  {label:"Web & UI/UX",href:"/#service-web-ui-ux"},
  {label:"Social Media",href:"/#service-social-media"},
];
const navigation=[
  {label:"Home",href:"/#top"},
  {label:"Who we are",href:"/#about"},
  {label:"What we do",href:"/#services"},
  {label:"Who we create with",href:"/#who-we-serve"},
  {label:"Our projects",href:"/projects.html"},
  {label:"Why Visual Verse",href:"/#process"},
  {label:"Where we serve",href:"/#where-we-serve"},
  {label:"FAQs",href:"/#faqs"},
];

export function VisualVerseFooter(){
  return (
    <div className="vv-close-footer">
      <img className="vv-close-footer-watermark" src="/logo-mark.png" alt="" aria-hidden="true" loading="lazy"/>
      <div className="vv-close-footer-grid">
        <div className="vv-close-footer-about">
          <a className="vv-close-footer-brand" href="/#top" aria-label="Visual Verse Creations, back to home">
            <img src="/brand-logo.png" alt="Visual Verse Creations" loading="lazy"/>
          </a>
          <p>Thoughtful design. Lasting stories. A creative studio bringing ideas to life through imagery, identity and digital experiences.</p>
          <span className="vv-close-footer-location"><MapPin size={15} aria-hidden="true"/> Based in Nairobi, Kenya</span>
        </div>
        <nav aria-label="Footer pages" className="vv-close-footer-col">
          <h2>EXPLORE</h2>
          {navigation.map(item=><a href={item.href} key={item.label}>{item.label}</a>)}
        </nav>
        <nav aria-label="Footer services" className="vv-close-footer-col">
          <h2>OUR SERVICES</h2>
          {serviceLinks.map(item=><a href={item.href} key={item.label}>{item.label}</a>)}
        </nav>
        <div className="vv-close-footer-col vv-close-footer-contact">
          <h2>LET'S CONNECT</h2>
          <p>Have a project or a question? Start the conversation.</p>
          <a className="vv-close-footer-email" href={"mailto:"+CONTACT_EMAIL}>{CONTACT_EMAIL} <ArrowUpRight size={15} aria-hidden="true"/></a>
          <a className="vv-close-footer-mini-cta" href="/#contact">Start a project <ArrowRight size={15} aria-hidden="true"/></a>
          <span className="vv-close-footer-availability"><CheckCircle2 size={14} aria-hidden="true"/> Available for project enquiries</span>
        </div>
      </div>
      <div className="vv-close-footer-bottom">
        <span>© {new Date().getFullYear()} VISUAL VERSE CREATIONS. ALL RIGHTS RESERVED.</span>
        <span>DESIGNED WITH PURPOSE · MADE IN KENYA</span>
        <a href="/#top">BACK TO TOP <ArrowUp size={14} aria-hidden="true"/></a>
      </div>
    </div>
  );
}
