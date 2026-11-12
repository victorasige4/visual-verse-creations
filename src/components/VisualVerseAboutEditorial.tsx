import { useState } from "react";
import {
  ArrowUpRight, ArrowRight, Camera, Clapperboard, Palette, PenTool, MonitorSmartphone,
  Share2, Sparkles, HeartHandshake, Target, Layers3, CheckCircle2, MapPin, MessageCircle,
  Film, Compass, Brush, Megaphone
} from "lucide-react";
import { VisualVerseKenyaMap } from "./VisualVerseKenyaMap";
import { VisualVerseFaq } from "./VisualVerseClosingSections";

const strengths = [
  {value:"06",label:"creative disciplines",detail:"One studio for strategy, design, film and digital experiences"},
  {value:"01",label:"connected creative process",detail:"Your idea moves from discovery to delivery with clarity"},
  {value:"∞",label:"stories worth telling",detail:"From independent creators to brands and organisations"}
];
const principles = [
  {title:"Built around your story",description:"No two clients have the same vision. We begin by understanding your people, goals and the experience you want to create.",detail:"The brief shapes the work",icon:Target},
  {title:"Creativity with direction",description:"Beautiful is a starting point, not the finish line. We bring clarity, strategy and a reason to every decision.",detail:"Intentional, not just attractive",icon:Sparkles},
  {title:"One connected creative team",description:"Branding, design, photography, film and digital thinking work better when the experience feels like one story.",detail:"Many disciplines, one vision",icon:Layers3},
  {title:"Craft in every frame",description:"Details matter: light, composition, typography, transitions, accessibility and the final handover.",detail:"Care from concept to delivery",icon:CheckCircle2},
  {title:"A partnership, not a handoff",description:"We listen, share progress, invite feedback and aim for a process that feels as good as the finished work.",detail:"Built through collaboration",icon:HeartHandshake}
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
  const [activeAudience,setActiveAudience]=useState(0);
  const audience=audiences[activeAudience];

  return <div className="vv-about-editorial">
    <section className="vv-about-hero" id="about-hero">
      <div className="vv-about-container">
        <div className="vv-about-breadcrumb"><a href="/#top">HOME</a><span>/</span><span>ABOUT VISUAL VERSE</span></div>
        <div className="vv-about-hero-grid">
          <div className="vv-about-hero-copy">
            <span className="vv-about-kicker"><span className="vv-about-dot"/> INDEPENDENT CREATIVE STUDIO · NAIROBI</span>
            <h1>We turn <em>ideas</em> into stories people <em>feel.</em></h1>
            <p>Visual Verse is a multidisciplinary creative studio bringing branding, photography, filmmaking, graphic design and digital experiences together. We shape every project around the people, purpose and possibility behind it.</p>
            <div className="vv-about-hero-links">
              <a className="vv-about-button vv-about-button-primary" href="/request-quote.html">Let's create together <ArrowUpRight size={18}/></a>
              <a className="vv-about-inline-link" href="/projects.html">Explore our work <ArrowRight size={17}/></a>
            </div>
          </div>
          <div className="vv-about-hero-visual" aria-label="Visual Verse studio creative composition">
            <div className="vv-about-hero-photo"><img src="/about-photographer.webp" alt="Creative photographer working with a camera"/></div>
            <div className="vv-about-hero-sticker"><img src="/logo-mark.png" alt=""/><span>IMAGINE.<br/>CREATE.<br/>CONNECT.</span></div>
            <div className="vv-about-hero-note"><span className="vv-about-pulse"/> CURRENTLY CREATING<br/><strong>Thoughtful work, made together.</strong></div>
            <div className="vv-about-hero-gridlines" aria-hidden="true"/>
          </div>
        </div>
        <div className="vv-about-hero-foot"><span>VISUAL VERSE CREATIONS / 001</span><a href="#our-impact">DISCOVER OUR STORY ↓</a></div>
      </div>
    </section>

    <section className="vv-about-stats" id="our-impact">
      <div className="vv-about-container vv-about-stats-grid">
        {strengths.map((s,i)=><article key={s.label}><span className="vv-about-index">0{i+1} / 03</span><strong>{s.value}</strong><h2>{s.label}</h2><p>{s.detail}</p></article>)}
      </div>
    </section>

    <section className="vv-about-belief vv-about-pad" id="our-belief">
      <div className="vv-about-container vv-about-belief-grid">
        <div><AboutHeading label="WHAT WE BELIEVE / 002" title={<>Good creativity is <em>felt,</em> not just seen.</>}/><p className="vv-about-lead">We believe every good story begins with listening. When creativity meets purpose, design can build trust, images can hold emotion and digital experiences can feel effortless.</p></div>
        <div className="vv-about-belief-cards">
          <article><span className="vv-about-index">OUR VISION</span><Compass size={32}/><h3>Make stories matter.</h3><p>To help people and brands express who they are through memorable creative experiences.</p></article>
          <article><span className="vv-about-index">OUR MISSION</span><Target size={32}/><h3>Imagine. Create. Connect.</h3><p>To bring thoughtful design, visual storytelling and digital craft together in work that moves people.</p></article>
        </div>
      </div>
    </section>

    <section className="vv-about-story vv-about-pad" id="our-story">
      <div className="vv-about-container vv-about-story-grid">
        <div className="vv-about-story-image">
          <img src="/about-photographer.webp" alt="Behind the lens at Visual Verse Creations" loading="lazy"/>
          <span className="vv-about-image-label">A STORY WORTH TELLING / VISUAL VERSE</span>
        </div>
        <div className="vv-about-story-copy">
          <AboutHeading label="OUR STORY / 003" title={<>A creative home for <em>big ideas.</em></>}/>
          <p>Visual Verse grew from a simple belief: compelling creative work should do more than fill a space. It should tell the truth of a brand, celebrate a moment or make an experience easier to use.</p>
          <p>We approach each collaboration with curiosity, combining creative direction with practical execution. From the first rough sketch to the finished frame, we give ideas room to become something extraordinary.</p>
          <div className="vv-about-story-points"><span><CheckCircle2 size={18}/> Creative direction with purpose</span><span><CheckCircle2 size={18}/> Personal collaboration</span><span><CheckCircle2 size={18}/> Thoughtful final delivery</span></div>
          <blockquote>“The strongest work happens when imagination and intention meet.”<cite>— VISUAL VERSE CREATIONS</cite></blockquote>
          <a className="vv-about-inline-link" href="/contact.html">Start a conversation <ArrowUpRight size={17}/></a>
        </div>
      </div>
    </section>

    <section className="vv-about-principles vv-about-pad" id="our-approach">
      <div className="vv-about-container">
        <AboutHeading label="HOW WE WORK / 004" title={<>Five principles behind <em>everything we create.</em></>} description="Our process stays human, intentional and flexible—whether we're developing an identity, building a website or telling a story through film."/>
        <div className="vv-about-principle-grid">{principles.map((item,i)=><article key={item.title}>
          <div className="vv-about-principle-top"><span>0{i+1} / 05</span><item.icon size={29} strokeWidth={1.7}/></div>
          <h3>{item.title}</h3><p>{item.description}</p><div className="vv-about-principle-tag"><CheckCircle2 size={15}/>{item.detail}</div>
        </article>)}</div>
      </div>
    </section>

    <section className="vv-about-tools vv-about-pad" id="our-toolbox">
      <div className="vv-about-container vv-about-tools-grid">
        <div>
          <AboutHeading label="OUR CREATIVE TOOLBOX / 005" title={<>The tools change. <em>The vision stays.</em></>}/>
          <p className="vv-about-lead">We combine established creative software, modern workflows and emerging technology to choose what works best for each project—not the other way around.</p>
          <div className="vv-about-tool-readout"><span>IN FOCUS / {String(activeTool+1).padStart(2,"0")}</span><strong>{toolkit[activeTool].name}</strong><small>{toolkit[activeTool].type}</small></div>
        </div>
        <div className="vv-about-tool-tags" role="group" aria-label="Creative software and tools">{toolkit.map((item,i)=><button type="button" key={item.name} className={i===activeTool?"is-active":""} onMouseEnter={()=>setActiveTool(i)} onFocus={()=>setActiveTool(i)} onClick={()=>setActiveTool(i)} aria-pressed={i===activeTool}><span>{item.name}</span><ArrowUpRight size={16}/></button>)}</div>
      </div>
    </section>

    <section className="vv-about-audiences vv-about-pad" id="our-audiences">
      <div className="vv-about-container">
        <AboutHeading label="WHO WE CREATE WITH / 006" title={<>From the first idea to the <em>next big chapter.</em></>} description="Different people, different ambitions. The same dedication to making the story count."/>
        <div className="vv-about-audience-layout">
          <div className="vv-about-audience-list" role="tablist" aria-label="Choose an audience">{audiences.map((item,i)=><button type="button" role="tab" id={"vv-about-aud-tab-"+i} aria-controls="vv-about-audience-panel" aria-selected={i===activeAudience} onClick={()=>setActiveAudience(i)} className={i===activeAudience?"is-active":""} key={item.name}><span>0{i+1}</span>{item.name}<ArrowUpRight size={17}/></button>)}</div>
          <div className="vv-about-audience-card" role="tabpanel" id="vv-about-audience-panel" aria-labelledby={"vv-about-aud-tab-"+activeAudience} key={audience.name}>
            <div className="vv-about-audience-card-top"><audience.icon size={45} strokeWidth={1.25}/><span>{audience.eyebrow}</span></div><h3>{audience.name}</h3>
            <div className="vv-about-transformation"><div><small>FROM</small><p>{audience.before}</p></div><ArrowRight size={24}/><div><small>TO</small><p>{audience.after}</p></div></div>
            <a href="/who-we-serve.html">Find your creative fit <ArrowUpRight size={18}/></a>
          </div>
        </div>
      </div>
    </section>

    <section className="vv-about-partners vv-about-pad" id="collaborate">
      <div className="vv-about-container">
        <AboutHeading label="WHO WE COLLABORATE WITH / 007" title={<>The best ideas are <em>made together.</em></>} description="We make room for the right collaborators, expertise and perspectives to bring a good brief to life."/>
        <div className="vv-about-partner-grid">{partners.map((p,i)=><article key={p.name}><span className="vv-about-index">0{i+1} / 04</span><p.icon size={29}/><h3>{p.name}</h3><p>{p.description}</p></article>)}</div>
      </div>
    </section>

    <section className="vv-about-locations vv-about-pad" id="where-we-create">
      <div className="vv-about-container">
        <AboutHeading label="WHERE WE CREATE / 008" title={<>Based in Nairobi. <em>Open to Kenya.</em></>} description="Our home is in Nairobi. For projects across Kenya, we collaborate remotely whenever possible and plan on-site production together."/>
        <VisualVerseKenyaMap/>
      </div>
    </section>

    <section className="vv-about-faq vv-about-pad" id="about-faq">
      <div className="vv-about-container">
        <VisualVerseFaq/>
      </div>
    </section>

    <section className="vv-about-facts vv-about-pad" id="at-a-glance">
      <div className="vv-about-container vv-about-facts-layout">
        <AboutHeading label="VISUAL VERSE AT A GLANCE / 009" title={<>The short <em>version.</em></>}/>
        <dl>{detail.map(([term,value])=><div key={term}><dt>{term}</dt><dd>{value}</dd></div>)}</dl>
      </div>
    </section>

    <section className="vv-about-final" id="lets-create">
      <div className="vv-about-container">
        <div className="vv-about-final-head"><span className="vv-about-kicker"><span className="vv-about-dot"/> LET'S MAKE SOMETHING MEANINGFUL / 010</span><img src="/logo-mark.png" alt=""/></div>
        <h2>Have a story? <em>Let's make it unforgettable.</em></h2>
        <p>Tell us what you're dreaming up. We'll shape a creative way forward together.</p>
        <div className="vv-about-final-actions"><a className="vv-about-button vv-about-button-primary" href="/request-quote.html">Start your project <ArrowUpRight size={18}/></a><a href="https://wa.me/254794044598" target="_blank" rel="noreferrer">WhatsApp us <MessageCircle size={19}/></a></div>
        <div className="vv-about-final-bottom"><span>NAIROBI, KENYA · AVAILABLE FOR ENQUIRIES</span><a href="mailto:hello@visualverse.com">hello@visualverse.com</a></div>
      </div>
    </section>
  </div>;
}
