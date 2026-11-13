import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight, Camera, Palette, MonitorSmartphone,
  CheckCircle2, MapPin, MessageCircle,
  Film, Brush, Megaphone
} from "lucide-react";
import { VisualVerseKenyaMap } from "./VisualVerseKenyaMap";
import { VisualVerseFaq } from "./VisualVerseClosingSections";
import { CardStackDemo } from "./ui/card-stack-demo";
import { VisualVersePurposeCompass } from "./VisualVersePurposeCompass";
import { VisualVerseHowWeWork } from "./VisualVerseHowWeWork";
import { useAboutScrollWords } from "../hooks/useAboutScrollWords";
import "../about-scroll-words.css";

/** Motion cues reproduced from the supplied About walkthroughs. Effects are scoped to this page. */
function useAboutReveal() {
  useEffect(() => {
    const root = document.querySelector(".vv-about-editorial");
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>(".vv-about-section-header, .vv-about-lead, .vv-about-stats article, .vv-about-vision-orb, .vv-about-story-image, .vv-about-story-copy, .vv-about-tool-tags button, .vv-about-audience-tile, .vv-about-partner-grid article, .vv-about-facts dl div, .vv-about-final-panel"));
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach(el => el.classList.add("vv-about-revealed"));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("vv-about-revealed");
          observer.unobserve(entry.target);
        }
      }
    }, {threshold: .09, rootMargin: "0px 0px -35px 0px"});
    items.forEach((el, i) => {
      el.classList.add("vv-about-reveal");
      el.style.setProperty("--vv-reveal-delay", Math.min(i % 3, 2) * 95 + "ms");
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
}

function StudioNumber({value}:{value:string}) {
  const ref = useRef<HTMLElement>(null);
  const [visible,setVisible] = useState(false);
  const [display,setDisplay] = useState("00");
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {setVisible(true);return;}
    const ob = new IntersectionObserver(([entry]) => {
      if(entry.isIntersecting){setVisible(true);ob.disconnect();}
    },{threshold:.2});
    ob.observe(el);
    return () => ob.disconnect();
  },[]);
  useEffect(() => {
    if(!visible)return;
    if(value==="∞"){setDisplay("∞");return;}
    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){setDisplay(value);return;}
    const target=Number(value);
    const started=performance.now();
    let frame=0;
    const tick=(now:number)=>{
      const t=Math.min(1,(now-started)/1250);
      const ease=1-Math.pow(1-t,3);
      setDisplay(String(Math.round(target*ease)).padStart(value.length,"0"));
      if(t<1)frame=window.requestAnimationFrame(tick);
    };
    frame=window.requestAnimationFrame(tick);
    return ()=>window.cancelAnimationFrame(frame);
  },[visible,value]);
  return <strong ref={ref} className="vv-about-count">{display}</strong>;
}

const strengths = [
  {value:"06",label:"creative disciplines",detail:"One studio for strategy, design, film and digital experiences"},
  {value:"01",label:"connected creative process",detail:"Your idea moves from discovery to delivery with clarity"},
  {value:"∞",label:"stories worth telling",detail:"From independent creators to brands and organisations"}
];
const toolkit = [
  {name:"Figma",type:"UI & experience"},
  {name:"Photoshop",type:"Image crafting"},
  {name:"Illustrator",type:"Vector & identity"},
  {name:"Lightroom",type:"Photography"},
  {name:"Premiere Pro",type:"Film & editing"},
  {name:"After Effects",type:"Motion"},
  {name:"Cursor",type:"Web development"},
  {name:"Google Flow",type:"Creative AI"},
  {name:"ChatGPT",type:"Ideation"},
  {name:"Semrush",type:"Digital research"}
];
const audiences = [
  {name:"Growing brands",eyebrow:"IDENTITY / PRESENCE",before:"An idea people haven't met",after:"A brand they recognise",icon:Palette},
  {name:"Businesses & organisations",eyebrow:"COMMUNICATION / CONTENT",before:"Information without impact",after:"Stories that connect",icon:Megaphone},
  {name:"Creators & founders",eyebrow:"LAUNCH / EXPRESSION",before:"A vision still taking shape",after:"A distinct creative identity",icon:Brush},
  {name:"Events & communities",eyebrow:"PEOPLE / MOMENTS",before:"A moment that passes",after:"A story that stays",icon:Camera},
  {name:"Digital-first teams",eyebrow:"PRODUCT / EXPERIENCE",before:"An interface that feels complex",after:"An experience that feels natural",icon:MonitorSmartphone},
  {name:"Campaigns & storytellers",eyebrow:"FILM / DIGITAL",before:"A message lost in the noise",after:"Something worth sharing",icon:Film}
];
const partners = [
  {name:"Marketing teams",description:"Creative direction, campaign visuals and production that bring an existing strategy to life.",icon:Megaphone},
  {name:"Creative agencies",description:"A flexible design, photography, filming or digital production collaborator for bigger briefs.",icon:Palette},
  {name:"Event planners",description:"Visual identity, event coverage, social content and keepsakes with a consistent story.",icon:Camera},
  {name:"Founders & product teams",description:"Brand thinking, websites, interface concepts and launch material under one creative roof.",icon:MonitorSmartphone}
];
const detail = [
  ["Studio","Visual Verse Creations"],
  ["Our world","Branding · Graphic design · Photography · Film · UI/UX · Digital marketing"],
  ["Home base","Nairobi, Kenya"],
  ["Working with","Brands, businesses, creators, communities and organisations"],
  ["Our approach","Discover · Imagine · Create · Refine · Deliver"],
  ["Collaboration","Remote-first where practical, with on-location production by arrangement"],
  ["Contact","+254 794 044 598"]
];

function AboutHeading({label,title,description}:{label:string;title:React.ReactNode;description?:string}) {
  return <header className="vv-about-section-header">
    <span className="vv-about-kicker"><span className="vv-about-dot"/> {label}</span>
    <h2>{title}</h2>
    {description&&<p>{description}</p>}
  </header>;
}

export function VisualVerseAboutEditorial() {
  const [activeTool,setActiveTool]=useState(0);
  useAboutReveal();
  useAboutScrollWords();

  return <div className="vv-about-editorial">
    <section className="vv-about-hero" id="about-hero">
      <div className="vv-about-container">
        <div className="vv-about-breadcrumb"><a href="/#top">HOME</a><span>/</span><span>ABOUT VISUAL VERSE</span></div>
        <div className="vv-about-hero-grid">
          <div className="vv-about-hero-copy">
            <span className="vv-about-kicker"><span className="vv-about-dot"/> INDEPENDENT CREATIVE STUDIO · NAIROBI</span>
            <h1><span className="vv-about-hero-title-line">We turn</span><span className="vv-about-hero-title-line">your ideas</span><span className="vv-about-hero-title-line">into <em>experiences.</em></span></h1>
            <p>Visual Verse is a multidisciplinary creative studio bringing branding, photography, filmmaking, graphic design and digital experiences together. We shape every project around the people, purpose and possibility behind it.</p>
          </div>
          <div className="vv-about-hero-visual vv-about-hero-visual--card-stack" aria-label="Visual Verse: Imagine, Create, Connect">
            <CardStackDemo />
          </div>
        </div>
        <div className="vv-about-hero-foot"><span>VISUAL VERSE CREATIONS</span><a href="#our-impact">DISCOVER OUR STORY ↓</a></div>
      </div>
    </section>

    <section className="vv-about-stats" id="our-impact">
      <div className="vv-about-container vv-about-stats-grid">
        {strengths.map((s,i)=><article key={s.label}><StudioNumber value={s.value}/><h2>{s.label}</h2><p>{s.detail}</p></article>)}
      </div>
    </section>

    <section className="vv-about-belief vv-about-pad" id="our-belief">
      <div className="vv-about-container">
        <span className="vv-about-kicker"><span className="vv-about-dot"/> WHAT WE BELIEVE</span>
        <h2 className="vv-about-belief-statement">We believe <strong>creativity</strong> can shape how people <em>see, feel and connect.</em> We turn that belief into reality through <strong>thoughtful stories, purposeful design and meaningful visual experiences.</strong></h2>
      </div>
    </section>
    <VisualVersePurposeCompass/>

    <section className="vv-about-story vv-about-pad" id="our-story">
      <div className="vv-about-container vv-about-story-grid">
        <div className="vv-about-story-image">
          <img src="/about-photographer.webp" alt="Behind the lens at Visual Verse Creations" loading="lazy"/>
          <span className="vv-about-image-label">A STORY WORTH TELLING / VISUAL VERSE</span>
        </div>
        <div className="vv-about-story-copy">
          <AboutHeading label="OUR STORY" title={<>A creative home for <em>big ideas.</em></>}/>
          <p>Visual Verse grew from a simple belief: compelling creative work should do more than fill a space. It should tell the truth of a brand, celebrate a moment or make an experience easier to use.</p>
          <p>We approach each collaboration with curiosity, combining creative direction with practical execution. From the first rough sketch to the finished frame, we give ideas room to become something extraordinary.</p>
          <div className="vv-about-story-points"><span><CheckCircle2 size={18}/> Creative direction with purpose</span><span><CheckCircle2 size={18}/> Personal collaboration</span><span><CheckCircle2 size={18}/> Thoughtful final delivery</span></div>
          <blockquote>“The strongest work happens when imagination and intention meet.”<cite>— VISUAL VERSE CREATIONS</cite></blockquote>
          <a className="vv-about-inline-link" href="/contact.html">Start a conversation <ArrowUpRight size={17}/></a>
        </div>
      </div>
    </section>

    <VisualVerseHowWeWork />

    <section className="vv-about-tools vv-about-pad" id="our-toolbox">
      <div className="vv-about-container vv-about-tools-grid">
        <div>
          <AboutHeading label="OUR CREATIVE TOOLBOX" title={<>The tools change. <em>The vision stays.</em></>}/>
          <p className="vv-about-lead">We combine established creative software, modern workflows and emerging technology to choose what works best for each project—not the other way around.</p>
          <div className="vv-about-tool-readout"><span>IN FOCUS / {String(activeTool+1).padStart(2,"0")}</span><strong>{toolkit[activeTool].name}</strong><small>{toolkit[activeTool].type}</small></div>
        </div>
        <div className="vv-about-tool-tags" role="group" aria-label="Creative software and tools">{toolkit.map((item,i)=><button type="button" key={item.name} className={i===activeTool?"is-active":""} onMouseEnter={()=>setActiveTool(i)} onFocus={()=>setActiveTool(i)} onClick={()=>setActiveTool(i)} aria-pressed={i===activeTool}><span>{item.name}</span><ArrowUpRight size={16}/></button>)}</div>
      </div>
    </section>

    <section className="vv-about-audiences vv-about-pad" id="our-audiences">
      <div className="vv-about-container">
        <AboutHeading label="WHO WE CREATE WITH" title={<>From big brands to <em>first ideas.</em></>} description="Different people and goals. One creative partner for the moments that matter."/>
        <div className="vv-about-audience-tiles">
          {audiences.map((item,i)=><a href="/who-we-serve.html" key={item.name} className="vv-about-audience-tile">
            <span className="vv-about-audience-tile-icon"><item.icon size={23}/></span>
            <span><strong>{item.name}</strong><small>{item.eyebrow}</small></span><ArrowUpRight size={17} className="vv-about-audience-arrow"/>
          </a>)}
        </div>
        <a className="vv-about-inline-link vv-about-audience-more" href="/who-we-serve.html">See how we work with your kind of project <ArrowUpRight size={17}/></a>
      </div>
    </section>

    <section className="vv-about-partners vv-about-pad" id="collaborate">
      <div className="vv-about-container">
        <AboutHeading label="WHO WE COLLABORATE WITH" title={<>The best ideas are <em>made together.</em></>} description="We make room for the right collaborators, expertise and perspectives to bring a good brief to life."/>
        <div className="vv-about-partner-grid">{partners.map((p,i)=><article key={p.name}><p.icon size={29}/><h3>{p.name}</h3><p>{p.description}</p></article>)}</div>
      </div>
    </section>

    <section className="vv-about-locations vv-about-pad" id="where-we-create">
      <div className="vv-about-container">
        <AboutHeading label="WHERE WE CREATE" title={<>Based in Nairobi. <em>Open to Kenya.</em></>} description="Our home is in Nairobi. For projects across Kenya, we collaborate remotely whenever possible and plan on-site production together."/>
        <div className="vv-about-map-motion"><VisualVerseKenyaMap/><div className="vv-about-route-rays" aria-hidden="true"><span/><span/><span/></div></div>
      </div>
    </section>

    <section className="vv-about-faq vv-about-pad" id="about-faq">
      <div className="vv-about-container">
        <VisualVerseFaq/>
      </div>
    </section>

    <section className="vv-about-facts vv-about-pad" id="at-a-glance">
      <div className="vv-about-container vv-about-facts-layout">
        <AboutHeading label="VISUAL VERSE AT A GLANCE" title={<>The short version.</>}/>
        <dl>{detail.map(([term,value])=><div key={term}><dt>{term}</dt><dd>{value}</dd></div>)}</dl>
      </div>
    </section>

    <section className="vv-about-final" id="lets-create">
      <div className="vv-about-container vv-about-final-panel">
        <div className="vv-about-final-head"><span className="vv-about-kicker"><span className="vv-about-dot"/> LET'S MAKE SOMETHING MEANINGFUL</span><img src="/logo-mark.png" alt=""/></div>
        <h2>Have a story? <em>Let's make it unforgettable.</em></h2>
        <p>Tell us what you're dreaming up. We'll shape a creative way forward together.</p>
        <div className="vv-about-final-actions"><a className="vv-about-button vv-about-button-primary" href="/request-quote.html">Start your project <ArrowUpRight size={18}/></a><a href="https://wa.me/254794044598" target="_blank" rel="noreferrer">WhatsApp us <MessageCircle size={19}/></a></div>
        <div className="vv-about-final-bottom"><span>NAIROBI, KENYA · AVAILABLE FOR ENQUIRIES</span><a href="mailto:hello@visualverse.com">hello@visualverse.com</a></div>
      </div>
    </section>
  </div>;
}
