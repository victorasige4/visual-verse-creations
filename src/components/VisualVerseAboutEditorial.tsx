import { EditorialText } from "./EditorialText";
import { VisualVerseActionContent } from "./VisualVerseAction";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { attachHeroCubes } from "../lib/hero-cubes";
import { Aperture, ArrowUpRight, CheckCircle2, Compass, UsersRound } from "lucide-react";
import { VisualVerseKenyaMap } from "./VisualVerseKenyaMap";
import { VisualVerseFaq } from "./VisualVerseClosingSections";
import { CardStackDemo } from "./ui/card-stack-demo";
import { VisualVersePurposeCompass } from "./VisualVersePurposeCompass";
import { VisualVerseHowWeWork } from "./VisualVerseHowWeWork";
import { VisualVersePotadotToolbox } from "./VisualVersePotadotToolbox";
import { VisualVerseIndustries } from "./VisualVerseIndustries";
import { VisualVerseCollaborators } from "./VisualVerseCollaborators";
import { VisualVerseAboutCta } from "./VisualVerseAboutCta";
import { useAboutScrollWords } from "../hooks/useAboutScrollWords";
import "../about-scroll-words.css";
import "../about-editorial.css";
import "../about-card-stack.css";

/** Motion cues reproduced from the supplied About walkthroughs. Effects are scoped to this page. */
function useAboutReveal() {
  useEffect(() => {
    const root = document.querySelector(".vv-about-editorial");
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>(".vv-about-section-header, .vv-about-lead, .vv-about-stats article, .vv-about-vision-orb, .vv-about-story-image, .vv-about-story-copy, .vv-about-audience-tile, .vv-about-facts dl div"));
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
  {value:"06",label:"creative disciplines",detail:"One creative partner for strategy, design, film and digital experiences"},
  {value:"01",label:"connected creative process",detail:"Your idea moves from discovery to delivery with clarity"},
  {value:"∞",label:"stories worth telling",detail:"From independent creators to brands and organisations"}
];
const detail = [
  ["Company","Visual Verse Creations"],
  ["Our world","Graphic Design · Photography · Web & UI/UX Design · Videography · Branding & Identity · Social Media & Digital Marketing"],
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

const storyChapters = [
  {title:"Creative direction with purpose",label:"IMAGINE",detail:"Find the intention behind the idea.",Icon:Compass},
  {title:"Personal collaboration",label:"CREATE",detail:"Shape the work together, with curiosity.",Icon:UsersRound},
  {title:"Thoughtful final delivery",label:"CONNECT",detail:"Bring the finished work into the world.",Icon:CheckCircle2},
] as const;

function VisualVerseStory(){
  const [active,setActive]=useState(0);
  const chapter=storyChapters[active];
  const Icon=chapter.Icon;
  return <section className="vv-about-story vv-about-pad vv-story-editorial" id="our-story" aria-labelledby="vv-story-title">
    <div className="vv-about-container vv-story-layout">
      <header className="vv-story-heading">
        <div>
          <span className="vv-about-kicker"><span className="vv-about-dot"/> OUR STORY</span>
          <h2 id="vv-story-title">A creative home<br/>for <em>big ideas.</em></h2>
        </div>
        <div className="vv-story-heading-note"><span aria-hidden="true"><Aperture size={22} strokeWidth={1.5}/></span><span>IMAGINATION IN MOTION<br/><small>THE VISUAL VERSE STORY</small></span></div>
      </header>
      <div className="vv-story-main">
        <figure className="vv-story-visual" data-chapter={active}>
          <div className="vv-story-viewfinder" aria-hidden="true"><i/><i/><i/><i/></div>
          <div className="vv-story-image-meta" aria-hidden="true"><span><i/> BEHIND THE IDEAS</span><span>VV / NAIROBI</span></div>
          <div className="vv-story-photo"><img src={import.meta.env.BASE_URL+"audience-founders-creative.webp"} alt="Two creative collaborators reviewing designs on a tablet and comparing colour samples" width={1200} height={800} loading="lazy" decoding="async"/></div>
          <div className="vv-story-reticle" aria-hidden="true"><span/><span/></div>
          <figcaption className="vv-story-photo-caption"><span>A STORY WORTH TELLING</span><span>VISUAL VERSE / 0{active+1}</span></figcaption>
          <div className="vv-story-visual-badge" aria-live="polite" aria-atomic="true"><Icon size={23} strokeWidth={1.5}/><div><small>THE CREATIVE JOURNEY</small><strong key={chapter.label}>{chapter.label}</strong></div></div>
        </figure>
        <div className="vv-story-narrative">
          <div className="vv-story-copy">
            <p>Visual Verse grew from a simple belief: compelling creative work should do more than fill a space. It should tell the truth of a brand, celebrate a moment or make an experience easier to use.</p>
            <p>We approach each collaboration with curiosity, combining creative direction with practical execution. From the first rough sketch to the finished frame, we give ideas room to become something extraordinary.</p>
          </div>
          <blockquote className="vv-story-quote">
            <span aria-hidden="true" className="vv-story-quote-mark">“</span>
            <p>The strongest work happens when imagination and intention meet.</p>
            <cite>VISUAL VERSE CREATIONS</cite>
          </blockquote>
          <a className="vv-motion-action vv-action-primary vv-story-action" href={import.meta.env.BASE_URL+"contact.html"}><VisualVerseActionContent Icon={ArrowUpRight}>Start a conversation</VisualVerseActionContent></a>
        </div>
      </div>
      <div className="vv-story-chapters" role="group" aria-label="The creative journey">
        {storyChapters.map((item,index)=>{
          const ChapterIcon=item.Icon;
          return <button key={item.label} type="button" className="vv-story-chapter" aria-pressed={index===active} onClick={()=>setActive(index)}>
            <span className="vv-story-chapter-top"><ChapterIcon size={22} strokeWidth={1.6}/><span>{item.label}</span><ArrowUpRight className="vv-story-chapter-arrow" size={17} strokeWidth={1.7}/></span>
            <strong>{item.title}</strong>
            <span className="vv-story-chapter-detail">{item.detail}</span>
          </button>;
        })}
      </div>
    </div>
  </section>;
}

export function VisualVerseAboutEditorial() {
  const heroRef=useRef<HTMLDivElement>(null);
  const cubeRef=useRef<HTMLCanvasElement>(null);
  useLayoutEffect(()=>{
    const hero=heroRef.current,canvas=cubeRef.current;
    if(!hero||!canvas)return;
    return attachHeroCubes(hero,canvas);
  },[]);
  useAboutReveal();
  useAboutScrollWords();

  return <div className="vv-about-editorial">
    <div className="vv-about-landing" ref={heroRef}>
      <canvas className="vv-shared-hero-cubes vv-about-cube-canvas" ref={cubeRef} aria-hidden="true"/>
    <section className="vv-about-hero" id="about-hero">
      <div className="vv-about-container">
        <div className="vv-about-breadcrumb"><a href="/#top">HOME</a><span>/</span><span>ABOUT VISUAL VERSE</span></div>
        <div className="vv-about-hero-grid">
          <div className="vv-about-hero-copy">
            <span className="vv-about-kicker"><span className="vv-about-dot"/> INDEPENDENT CREATIVE COMPANY · NAIROBI</span>
            <h1><span className="vv-about-hero-title-line">We turn</span><span className="vv-about-hero-title-line">your ideas</span><span className="vv-about-hero-title-line">into <em>experiences.</em></span></h1>
            <p>Visual Verse is a multidisciplinary creative company bringing graphic design, photography, web and UI/UX design, videography, branding and identity, and social media and digital marketing together. We shape every project around the people, purpose and possibility behind it.</p>
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

    </div>

    <section className="vv-about-belief vv-about-pad" id="our-belief">
      <div className="vv-about-container">
        <span className="vv-about-kicker"><span className="vv-about-dot"/> WHAT WE BELIEVE</span>
        <h2 className="vv-about-belief-statement">We believe <br className="vv-break-narrow"/><strong>creativity</strong> can <br/>shape how people <br className="vv-break-narrow"/><em>see, feel <br className="vv-break-wide"/>and <br className="vv-break-narrow"/>connect.</em> We turn <br className="vv-break-narrow"/>that <br className="vv-break-wide"/>belief into <br className="vv-break-narrow"/>reality through <br/><strong>thoughtful <br className="vv-break-narrow"/>stories, <br/>purposeful design <br className="vv-break-narrow"/>and <br className="vv-break-wide"/>meaningful <br className="vv-break-narrow"/>visual <br/>experiences.</strong></h2>
      </div>
    </section>
    <VisualVersePurposeCompass/>

    <VisualVerseStory />

    <VisualVerseHowWeWork />

    <VisualVersePotadotToolbox/>

    <VisualVerseIndustries />

    <VisualVerseCollaborators />

    <section className="vv-about-locations vv-about-pad" id="where-we-create">
      <div className="vv-about-container">
        <AboutHeading label="WHERE WE CREATE" title={<>Based in <br/>Nairobi. <em>Open <br className="vv-break-narrow"/>to <br className="vv-break-wide"/>Kenya.</em></>} description="Our home is in Nairobi. For projects across Kenya, we collaborate remotely whenever possible and plan on-site production together."/>
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
        <AboutHeading label="VISUAL VERSE AT A GLANCE" title={<EditorialText text="The short version."/>}/>
        <dl>{detail.map(([term,value])=><div key={term}><dt>{term}</dt><dd>{value}</dd></div>)}</dl>
      </div>
    </section>

    <VisualVerseAboutCta />
  </div>;
}
