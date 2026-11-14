import { useEffect, useState, type KeyboardEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowDown, ArrowUpRight, Aperture, BadgeCheck, Building2,
  Camera, Check, ChevronDown, Clapperboard, Compass,
  Globe2, HeartHandshake, Lightbulb, MonitorSmartphone,
  MoveUpRight, Palette, Play, Rocket, Sparkles, WandSparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import "../who-we-serve-redesign.css";

const BASE = import.meta.env.BASE_URL;
const image = (name: string) => BASE + name;
const quote = (audience?: string) =>
  BASE + "request-quote.html" + (audience ? "?audience=" + encodeURIComponent(audience) : "");

type Audience = {
  id: string; number: string; group: string; title: string; description: string;
  focus: string; offers: string[]; Icon: LucideIcon; image?: string;
  imageAlt?: string; visual: "photo" | "idea" | "creator" | "digital";
};

const audiences: Audience[] = [
  {
    id: "brands", number: "01", group: "BRANDS & IDENTITY",
    title: "Brands ready to be noticed.",
    description: "For businesses building an identity people can recognise, remember and connect with.",
    focus: "A distinct identity, expressed consistently.",
    offers: ["Brand strategy & visual identity", "Campaign design", "Packaging & brand applications"],
    Icon: Palette, image: "portfolio-social-design.jpg",
    imageAlt: "An example of Visual Verse graphic design work", visual: "photo",
  },
  {
    id: "businesses", number: "02", group: "BUSINESSES & ORGANISATIONS",
    title: "Teams with big things to say.",
    description: "For organisations that need complex ideas to feel clear, human and compelling.",
    focus: "One clear story across every touchpoint.",
    offers: ["Corporate photography & film", "Websites & presentations", "Marketing & communications"],
    Icon: Building2, image: "portfolio-corporate-moment.jpg",
    imageAlt: "Photography documenting a corporate event", visual: "photo",
  },
  {
    id: "founders", number: "03", group: "STARTUPS & FOUNDERS",
    title: "First movers. Bold thinkers.",
    description: "For entrepreneurs turning a promising idea into something the world can experience.",
    focus: "A confident first impression from day one.",
    offers: ["Launch identity & assets", "Landing pages & prototypes", "Pitch visuals & digital content"],
    Icon: Rocket, visual: "idea",
  },
  {
    id: "creators", number: "04", group: "CREATORS & PERSONAL BRANDS",
    title: "People with a point of view.",
    description: "For artists, makers and storytellers ready to make their work unmistakably theirs.",
    focus: "A personal brand with room to grow.",
    offers: ["Photography & personal branding", "Motion & video editing", "Social content & portfolios"],
    Icon: Aperture, visual: "creator",
  },
  {
    id: "events", number: "05", group: "EVENTS & COMMUNITIES",
    title: "Moments worth keeping.",
    description: "For gatherings, milestones and communities with memories that deserve to last.",
    focus: "Images and films that keep the feeling alive.",
    offers: ["Event coverage & portraits", "Highlight films", "Event graphics & print design"],
    Icon: Camera, image: "portfolio-graduations.jpg",
    imageAlt: "Visual Verse graduation photography", visual: "photo",
  },
  {
    id: "digital", number: "06", group: "DIGITAL PRODUCTS & PLATFORMS",
    title: "Ideas made to live on screens.",
    description: "For product teams and digital businesses who believe useful can also feel beautiful.",
    focus: "Digital experiences people enjoy using.",
    offers: ["UI/UX & interaction design", "Responsive websites", "Digital product visuals"],
    Icon: MonitorSmartphone, visual: "digital",
  },
];

const stages = [
  {
    step: "01", title: "Starting something", short: "I have an idea.",
    lead: "Give your next big idea a great first impression.",
    description: "When the vision is clear in your head but hasn't found its visual language yet, we can help you shape the foundations.",
    output: ["Identity & launch direction", "Pitch and campaign assets", "Web presence & prototypes"],
    Icon: Lightbulb,
  },
  {
    step: "02", title: "Finding momentum", short: "I'm growing.",
    lead: "Make every new touchpoint feel unmistakably you.",
    description: "Growth brings new audiences, bigger expectations and more places to show up. We help your creative presence keep pace.",
    output: ["Content & campaign systems", "Photography, film & social", "Website and brand expansion"],
    Icon: Rocket,
  },
  {
    step: "03", title: "Changing direction", short: "Time to evolve.",
    lead: "A fresh chapter deserves a clearer creative direction.",
    description: "New strategy, new market or simply a stronger story: bring what you've learned, and we'll help you express what's next.",
    output: ["Rebrand & art direction", "Digital redesign", "Messaging and campaign refresh"],
    Icon: Compass,
  },
  {
    step: "04", title: "Making a memory", short: "It matters to me.",
    lead: "Some stories deserve to be kept, not just told.",
    description: "Whether it's a celebration, a gathering or a milestone, the right images and film bring you back to how it felt.",
    output: ["Event & portrait photography", "Highlight videos", "Keepsakes and event design"],
    Icon: Camera,
  },
];

const questions = [
  {
    q: "Do you work with small businesses or individual clients?",
    a: "Yes. We create for growing businesses, founders, creators and individuals, as well as larger teams. We shape each project around what you actually need.",
  },
  {
    q: "What if my project doesn't fit one category?",
    a: "It doesn't have to. A project can combine branding, design, photography, video and digital experiences. Tell us your goal and we'll help identify the right mix.",
  },
  {
    q: "Can I request just one service?",
    a: "Absolutely. You can start with a single shoot, graphic design project, brand identity or website. There is no need to bundle services that aren't relevant.",
  },
  {
    q: "Do we need to be based in Nairobi?",
    a: "Visual Verse Creations is based in Nairobi, Kenya. Remote-friendly creative work can be discussed from other locations; location-based shoots depend on timing, logistics and availability.",
  },
];

function Reveal({
  children, className = "", delay = 0, as = "div",
}: { children: ReactNode; className?: string; delay?: number; as?: "div" | "section" }) {
  const reduced = useReducedMotion();
  const Element = as === "section" ? motion.section : motion.div;
  return <Element className={className}
    initial={reduced ? false : { opacity: 0, y: 28 }}
    whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
    viewport={{ once: true, amount: .1 }}
    transition={{ duration: .65, delay, ease: [.18, 1, .3, 1] }}
  >{children}</Element>;
}

function SectionIntro({
  eyebrow, title, highlighted, description,
}: { eyebrow: string; title: string; highlighted: string; description: string }) {
  return <Reveal className="vvws-section-intro">
    <div>
      <span className="vvws-eyebrow"><span className="vvws-indicator" aria-hidden="true" />{eyebrow}</span>
      <h2>{title}<br /><em>{highlighted}</em></h2>
    </div>
    <p>{description}</p>
  </Reveal>;
}

function AudienceArt({ item }: { item: Audience }) {
  const Icon = item.Icon;
  if (item.visual === "photo") return <div className="vvws-card-photo">
    <img src={image(item.image!)} alt={item.imageAlt ?? ""} loading="lazy" decoding="async" />
    <span className="vvws-card-photo-sheen" aria-hidden="true" />
    <span className="vvws-card-art-caption"><Icon size={15} aria-hidden="true" /> VISUAL STORYTELLING</span>
  </div>;
  if (item.visual === "idea") return <div className="vvws-art-idea" aria-hidden="true">
    <div className="vvws-art-grid" />
    <span className="vvws-idea-mini">THE NEXT CHAPTER IS YOURS</span>
    <div className="vvws-idea-orbit"><span /><span /><Rocket size={56} strokeWidth={1.2}/></div>
    <strong>WHAT<br/>IF?</strong>
    <span className="vvws-idea-trail"><Sparkles size={14}/> IDEA TO IMPACT <ArrowUpRight size={14}/></span>
  </div>;
  if (item.visual === "creator") return <div className="vvws-art-creator" aria-hidden="true">
    <div className="vvws-creator-disc"><Aperture size={116} strokeWidth={.9}/></div>
    <div className="vvws-creator-label vvws-creator-label-one"><Play size={13} fill="currentColor"/> MAKE SOMETHING REAL</div>
    <div className="vvws-creator-label vvws-creator-label-two">YOUR POV / YOUR RULES</div>
    <strong>BE<br/><em>YOU.</em></strong>
    <span className="vvws-creator-asterisk"><Sparkles size={38}/></span>
  </div>;
  return <div className="vvws-art-digital" aria-hidden="true">
    <div className="vvws-digital-browser">
      <div className="vvws-digital-browser-bar"><span/><span/><span/><i>visualverse / digital</i></div>
      <div className="vvws-digital-browser-content">
        <span>BUILD FOR PEOPLE</span>
        <strong>Make it<br/><em>click.</em></strong>
        <div className="vvws-digital-pill">DESIGNED TO FEEL RIGHT <ArrowUpRight size={13}/></div>
      </div>
      <div className="vvws-digital-skeleton"><i/><i/><i/></div>
    </div>
    <span className="vvws-digital-cursor"><MoveUpRight size={26}/></span>
  </div>;
}

function AudienceCard({
  item, expanded, toggle, index,
}: { item: Audience; expanded: boolean; toggle: () => void; index: number }) {
  const Icon = item.Icon;
  const reduced = useReducedMotion();
  const panelId = "vvws-card-panel-" + item.id;
  return <motion.article className={"vvws-world vvws-world-" + item.id + (expanded ? " is-expanded" : "")}
    id={"audience-" + item.id}
    initial={reduced ? false : { opacity: 0, y: 28 }}
    whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
    viewport={{ once: true, amount: .12 }}
    transition={{ duration: .55, delay: Math.min(index % 2 * .07, .2), ease: [.2, 1, .3, 1] }}>
    <div className="vvws-world-visual">
      <AudienceArt item={item}/>
      <span className="vvws-world-number">{item.number} / 06</span>
    </div>
    <div className="vvws-world-body">
      <div className="vvws-world-meta"><span><Icon size={15} aria-hidden="true"/>{item.group}</span><ArrowUpRight size={18} aria-hidden="true"/></div>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <button className="vvws-world-toggle" type="button"
        aria-expanded={expanded} aria-controls={panelId} onClick={toggle}>
        <span>{expanded ? "Show less" : "Explore the possibilities"}</span>
        <span className="vvws-world-toggle-icon"><ChevronDown size={17} aria-hidden="true"/></span>
      </button>
      <div id={panelId} className="vvws-world-details">
        <AnimatePresence initial={false}>
          {expanded && <motion.div className="vvws-world-details-inner"
            initial={reduced ? false : {height:0,opacity:0}}
            animate={{height:"auto",opacity:1}}
            exit={reduced ? undefined : {height:0,opacity:0}}
            transition={{duration:.33,ease:[.2,.8,.2,1]}}>
            <span className="vvws-details-label">WHAT WE CAN CREATE TOGETHER</span>
            <strong>{item.focus}</strong>
            <div className="vvws-offer-chips">{item.offers.map(offer=><span key={offer}><Check size={13} aria-hidden="true"/>{offer}</span>)}</div>
            <a className="vvws-card-cta" href={quote(item.title)}>Let's talk about your project <ArrowUpRight size={17} aria-hidden="true"/></a>
          </motion.div>}
        </AnimatePresence>
      </div>
    </div>
  </motion.article>;
}

function JourneySelector() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const current = stages[active];
  const Icon = current.Icon;
  const onKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const moves = ["ArrowRight","ArrowLeft","Home","End"];
    if (!moves.includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? stages.length - 1
      : (index + (event.key === "ArrowRight" ? 1 : -1) + stages.length) % stages.length;
    setActive(next);
    const tabs = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    tabs?.[next]?.focus();
  };
  return <section className="vvws-journey" id="your-journey" aria-labelledby="vvws-journey-heading">
    <div className="vvws-container">
      <Reveal className="vvws-journey-top">
        <span className="vvws-eyebrow"><span className="vvws-indicator"/> THE NEXT CHAPTER</span>
        <h2 id="vvws-journey-heading">Wherever you are,<br/><em>we'll meet you there.</em></h2>
        <p>No two creative journeys begin in the same place. Choose the stage that sounds most like yours.</p>
      </Reveal>
      <div className="vvws-journey-shell">
        <div className="vvws-journey-rail" role="tablist" aria-label="Choose the stage of your project">
          {stages.map((stage,i)=>{const StageIcon=stage.Icon;return <button key={stage.step}
            type="button" role="tab" id={"vvws-stage-tab-"+i}
            aria-controls="vvws-stage-panel" aria-selected={i===active}
            tabIndex={i===active?0:-1} className={"vvws-journey-tab"+(active===i?" is-active":"")}
            onClick={()=>setActive(i)} onKeyDown={event=>onKey(event,i)}>
            <span className="vvws-journey-tab-num">{stage.step}</span>
            <span className="vvws-journey-tab-name"><StageIcon size={20} aria-hidden="true"/><b>{stage.short}</b></span>
            <span className="vvws-journey-tab-dot" aria-hidden="true"/>
          </button>})}
        </div>
        <div className="vvws-journey-stage" role="tabpanel" id="vvws-stage-panel" aria-labelledby={"vvws-stage-tab-"+active} tabIndex={0}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={active} className="vvws-journey-panel"
              initial={reduced?false:{opacity:0,y:14,filter:"blur(5px)"}}
              animate={{opacity:1,y:0,filter:"blur(0px)"}}
              exit={reduced?undefined:{opacity:0,y:-10,filter:"blur(3px)"}}
              transition={{duration:.28,ease:[.2,.85,.2,1]}}>
              <div className="vvws-journey-copy">
                <span className="vvws-journey-kicker"><span/> {current.title.toUpperCase()}</span>
                <h3>{current.lead}</h3>
                <p>{current.description}</p>
                <div className="vvws-journey-checks">
                  {current.output.map(line=><span key={line}><Check size={14} aria-hidden="true"/>{line}</span>)}
                </div>
                <a href={quote(current.title)} className="vvws-journey-link">Let's build your next chapter <ArrowUpRight size={17} aria-hidden="true"/></a>
              </div>
              <div className="vvws-journey-poster" aria-hidden="true">
                <div className="vvws-journey-poster-ring vvws-journey-poster-ring-one"/>
                <div className="vvws-journey-poster-ring vvws-journey-poster-ring-two"/>
                <Icon size={73} strokeWidth={1.05}/>
                <span className="vvws-journey-poster-top">VISUAL VERSE / {current.step}</span>
                <strong>{current.short}</strong>
                <span className="vvws-journey-poster-bottom">POSSIBILITIES / UNLIMITED</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <span className="vvws-journey-caption">A CREATIVE PARTNERSHIP ISN'T ONE-SIZE-FITS-ALL.</span>
    </div>
  </section>;
}

function ProcessSection() {
  const steps = [
    {no:"01",title:"We listen first.",body:"We get to know your world, your audience and what success looks like to you.",Icon:HeartHandshake,label:"DISCOVER"},
    {no:"02",title:"We find the angle.",body:"We connect the right ideas, formats and creative disciplines to your goals.",Icon:WandSparkles,label:"SHAPE"},
    {no:"03",title:"We make it matter.",body:"We design, capture and refine with care, keeping you involved along the way.",Icon:Clapperboard,label:"CREATE"},
  ];
  return <section className="vvws-process" id="how-we-work" aria-labelledby="vvws-process-heading">
    <div className="vvws-container">
      <SectionIntro eyebrow="HOW WE WORK TOGETHER" title="Different needs." highlighted="One thoughtful process."
        description="You bring the perspective. We bring the creative thinking, tools and attention to detail to help make it happen."/>
      <div className="vvws-process-rows">
        {steps.map((step,i)=>{const Icon=step.Icon;return <Reveal key={step.no} className="vvws-process-row" delay={i*.06}>
          <span className="vvws-process-no">{step.no}</span>
          <div className="vvws-process-title"><Icon size={22} strokeWidth={1.6} aria-hidden="true"/><h3>{step.title}</h3></div>
          <p>{step.body}</p>
          <span className="vvws-process-tag">{step.label}<ArrowUpRight size={15} aria-hidden="true"/></span>
        </Reveal>})}
      </div>
      <Reveal className="vvws-process-note">
        <span className="vvws-process-note-icon"><BadgeCheck size={23} aria-hidden="true"/></span>
        <p>One service or a full creative collaboration — we'll shape the approach around your project, not a template.</p>
        <a href={BASE+"services.html"}>See our services <ArrowUpRight size={17} aria-hidden="true"/></a>
      </Reveal>
    </div>
  </section>;
}

function FaqSection() {
  return <section className="vvws-faq" aria-labelledby="vvws-faq-heading">
    <div className="vvws-container vvws-faq-layout">
      <Reveal className="vvws-faq-heading">
        <span className="vvws-eyebrow"><span className="vvws-indicator"/> GOOD QUESTIONS</span>
        <h2 id="vvws-faq-heading">Curious?<br/><em>We get it.</em></h2>
        <p>Every project starts with a conversation. Here are a few things you might be wondering about.</p>
        <a href={BASE+"contact.html"}>Ask us anything <ArrowUpRight size={16} aria-hidden="true"/></a>
      </Reveal>
      <div className="vvws-faq-list">
        {questions.map((item,i)=><Reveal key={item.q} className="vvws-faq-entry" delay={i*.05}>
          <details>
            <summary><span className="vvws-faq-num">0{i+1}</span><span className="vvws-faq-question">{item.q}</span><span className="vvws-faq-plus" aria-hidden="true"><ChevronDown size={19}/></span></summary>
            <div className="vvws-faq-answer"><p>{item.a}</p></div>
          </details>
        </Reveal>)}
      </div>
    </div>
  </section>;
}

export function VisualVerseWhoWeServePage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  useEffect(() => {
    // Restore direct links from the existing homepage, including #industries.
    const target = window.location.hash.slice(1);
    if (!["people", "industries", "who-we-serve", "your-journey", "how-we-work"].includes(target)) return;
    const frame = window.requestAnimationFrame(() => document.getElementById(target)?.scrollIntoView({ block: "start" }));
    return () => window.cancelAnimationFrame(frame);
  }, []);
  const reduced = useReducedMotion();
  return <div className="vvws-page">
    <section className="vvws-hero" id="who-we-serve" aria-labelledby="vvws-hero-title">
      <div className="vvws-hero-grid" aria-hidden="true"/>
      <div className="vvws-hero-glow" aria-hidden="true"/>
      <div className="vvws-container vvws-hero-layout">
        <div className="vvws-hero-copy">
          <motion.div className="vvws-hero-kicker"
            initial={reduced?false:{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.65}}>
            <span className="vvws-hero-kicker-dot"/><span>WHO WE CREATE WITH</span><span className="vvws-hero-kicker-index">03 / THE PEOPLE</span>
          </motion.div>
          <motion.h1 id="vvws-hero-title" initial={reduced?false:{opacity:0,y:35}}
            animate={{opacity:1,y:0}} transition={{duration:.9,delay:.1,ease:[.2,1,.3,1]}}>
            We create for<br/>people going<br/><em>somewhere.</em>
          </motion.h1>
          <motion.p className="vvws-hero-description" initial={reduced?false:{opacity:0,y:23}}
            animate={{opacity:1,y:0}} transition={{duration:.75,delay:.25}}>
            The bold brands. The ambitious teams. The ideas waiting to happen. And the moments you never want to forget. There's a place for your story here.
          </motion.p>
          <motion.div className="vvws-hero-actions" initial={reduced?false:{opacity:0,y:17}}
            animate={{opacity:1,y:0}} transition={{duration:.7,delay:.36}}>
            <a className="vvws-button vvws-button-mint" href="#people">Find your people <ArrowDown size={17} aria-hidden="true"/></a>
            <a className="vvws-button vvws-button-outline" href={quote()}>Start a project <ArrowUpRight size={17} aria-hidden="true"/></a>
          </motion.div>
          <div className="vvws-hero-footnote"><span>NAIROBI, KENYA / CREATIVITY WITHOUT THE BOXES</span><span className="vvws-hero-footnote-line"/></div>
        </div>
        <motion.div className="vvws-hero-collage" initial={reduced?false:{opacity:0,scale:.95,x:22}}
          animate={{opacity:1,scale:1,x:0}} transition={{duration:1,delay:.18,ease:[.2,1,.3,1]}}
          aria-hidden="true">
          <div className="vvws-collage-ring vvws-collage-ring-a"/>
          <div className="vvws-collage-ring vvws-collage-ring-b"/>
          <div className="vvws-collage-photo-main">
            <img src={image("portfolio-event-story.jpg")} alt="" decoding="async" fetchPriority="high"/>
            <span>REAL PEOPLE. REAL STORIES.</span>
          </div>
          <div className="vvws-collage-photo-small">
            <img src={image("portfolio-social-design.jpg")} alt="" decoding="async"/>
          </div>
          <div className="vvws-collage-sticker vvws-collage-sticker-top"><Sparkles size={18}/> YOUR WORLD / OUR PERSPECTIVE</div>
          <div className="vvws-collage-sticker vvws-collage-sticker-bottom"><span>06</span><small>CREATIVE<br/>WORLDS</small></div>
          <div className="vvws-collage-asterisk"><Sparkles size={63} strokeWidth={1.1}/></div>
        </motion.div>
      </div>
      <div className="vvws-hero-bottom"><span>IMAGINE. CREATE. CONNECT.</span><a href="#people">KEEP EXPLORING <ArrowDown size={17} aria-hidden="true"/></a></div>
    </section>

    <div className="vvws-marquee" aria-label="We create for growing brands, businesses, founders, creators, communities and digital teams">
      <div className="vvws-marquee-track">
        {[0,1].map(copy=><div className="vvws-marquee-set" key={copy} aria-hidden={copy===1}>
          {["Growing brands","Ambitious teams","First-time founders","Bold creators","Meaningful moments","Digital thinkers"].map(word=>
            <span key={word}>{word}<Sparkles size={18} strokeWidth={1.4} aria-hidden="true"/></span>)}
        </div>)}
      </div>
    </div>

    <section className="vvws-people" id="people" aria-labelledby="vvws-people-heading">
      <span className="vvws-anchor" id="industries" aria-hidden="true"/>
      <div className="vvws-container">
        <Reveal className="vvws-section-intro vvws-people-intro">
          <div>
            <span className="vvws-eyebrow"><span className="vvws-indicator" aria-hidden="true"/> THE WORLDS WE CREATE FOR</span>
            <h2 id="vvws-people-heading">Different stories.<br/><em>Same creative spark.</em></h2>
          </div>
          <p>No rigid boxes. Just thoughtful creative solutions for the people and projects making their mark. Pick a world to explore what we can make together.</p>
        </Reveal>
        <div className="vvws-world-grid">
          {audiences.map((item,index)=><AudienceCard key={item.id} item={item} index={index}
            expanded={expanded===item.id} toggle={()=>setExpanded(old=>old===item.id?null:item.id)}/>)}
        </div>
        <Reveal className="vvws-people-bottom">
          <span><Sparkles size={18} aria-hidden="true"/> DON'T SEE YOURSELF IN A BOX?</span>
          <p>That's the point. Good ideas don't need a label.</p>
          <a href={quote()}>Tell us what you're imagining <ArrowUpRight size={17} aria-hidden="true"/></a>
        </Reveal>
      </div>
    </section>

    <JourneySelector/>
    <ProcessSection/>
    <FaqSection/>
    <section className="vvws-closing-thought" aria-label="Creative collaboration">
      <div className="vvws-container vvws-closing-thought-layout">
        <span>DIFFERENT PEOPLE. ENDLESS POSSIBILITY.</span>
        <h2>Your story is<br/><em>the interesting part.</em></h2>
        <p>Whoever you are, whatever you're building, there's always a more meaningful way to tell it.</p>
        <span className="vvws-closing-mark"><Globe2 size={63} strokeWidth={.8} aria-hidden="true"/></span>
      </div>
    </section>
  </div>;
}
