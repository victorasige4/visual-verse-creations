import { useEffect, useRef } from "react";
import { ArrowUpRight, ArrowRight, Camera, Clapperboard, Palette, PenTool, MonitorSmartphone, Share2, Check, UsersRound, MessageCircle, FileText } from "lucide-react";
import { ServiceArtwork } from "./VisualVerseServices";
import { PinContainer } from "./ui/3d-pin";
import "../aceternity-3d-pin.css";
import { VisualVerseProcessJourney } from "./VisualVerseProcessJourney";
import "../visual-verse-services-page.css";

/**
 * Original Visual Verse service categories + Potadot Services page architecture:
 * editorial hero, numbered service quick-nav, six alternating split showcase
 * rows, seven-stage scroll-pinned process and practical guide cards.
 * Illustrations and wording are Visual Verse's, not Potadot assets or copy.
 */
type Kind = "photo"|"film"|"branding"|"graphic"|"web"|"social";
const services = [
  {
    id:"photography",number:"01",name:"Photography",kind:"photo" as Kind,Icon:Camera,
    description:"Real moments. Beautifully told. From portraits and brand shoots to once-in-a-lifetime celebrations, every image has a reason to exist.",
    bullets:["Portraits, lifestyle and product photography","Weddings, graduations and live events","Corporate, church and community stories","Thoughtful retouching and colour finishing"],
    tags:["Portraits","Events","Products","Brand campaigns"],
    link:"Discuss Photography",
  },
  {
    id:"videography",number:"02",name:"Videography",kind:"film" as Kind,Icon:Clapperboard,
    description:"Films that make people stop scrolling and start feeling. We shape your story from the first shot to the finishing colour grade.",
    bullets:["Event films and cinematic highlights","Promotional, corporate and documentary video","Interviews, reels and social-first stories","Editing, sound and motion graphics"],
    tags:["Film","Reels","Interviews","Editing"],
    link:"Discuss Videography",
  },
  {
    id:"graphic-design",number:"03",name:"Graphic Design",kind:"graphic" as Kind,Icon:PenTool,
    description:"Clear ideas, expressed beautifully. We design visual communication that makes people look, understand and remember.",
    bullets:["Digital campaigns and social media creatives","Print, editorial and marketing collateral","Event identities, invitations and presentations","Packaging, signage and promotional material"],
    tags:["Campaigns","Print","Social assets","Editorial"],
    link:"Discuss Graphic Design",
  },
  {
    id:"web-ui-ux",number:"04",name:"Web & UI/UX Design",kind:"web" as Kind,Icon:MonitorSmartphone,
    description:"Digital experiences that make sense and feel effortless. From a high-impact website to a carefully considered product flow.",
    bullets:["Responsive websites and landing pages","UI/UX research, user journeys and wireframes","Figma prototypes and interface design","Front-end implementation and refinements"],
    tags:["Websites","Figma","UI/UX","Product design"],
    link:"Discuss Web & UI/UX",
  },
  {
    id:"social-media",number:"05",name:"Social Media & Digital Marketing",kind:"social" as Kind,Icon:Share2,
    description:"The right creative, in the right places. We bring strategy and storytelling together to build recognisable, engaging online brands.",
    bullets:["Content strategy, planning and creative direction","Campaign graphics, reels and visual assets","Multi-platform content and brand consistency","Insights-led revisions and digital storytelling"],
    tags:["Strategy","Campaigns","Social","Content"],
    link:"Discuss Digital Marketing",
  },
  {
    id:"branding",number:"06",name:"Branding & Identity",kind:"branding" as Kind,Icon:Palette,
    description:"More than a logo. We create the visual language, distinctive character and consistent presence that make a brand feel like itself.",
    bullets:["Discovery, positioning and creative direction","Logos, visual identities and design systems","Brand guidelines and real-world applications","Rebrands, launches and campaign identity"],
    tags:["Strategy","Logo","Identity","Brand systems"],
    link:"Discuss Branding",
  },
] as const;

function useRevealSections() {
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const root=rootRef.current;
    if(!root)return;
    const items=Array.from(root.querySelectorAll<HTMLElement>(".vv-sv-reveal"));
    if(!("IntersectionObserver" in window)||window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach(el=>el.classList.add("is-visible"));
      return;
    }
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target);}
      });
    },{threshold:.09,rootMargin:"0px 0px -40px 0px"});
    items.forEach(el=>observer.observe(el));
    return ()=>observer.disconnect();
  },[]);
  return rootRef;
}

export function VisualVerseServicesEditorial() {
  const ref = useRevealSections();
  return <div className="vv-services-editorial" ref={ref}>
    <section className="vv-sv-hero vv-sv-hero--potadot" aria-labelledby="vv-sv-title" id="services-top">
      <div className="vv-sv-container">
        <nav className="vv-sv-breadcrumb" aria-label="Breadcrumb">
          <a href={import.meta.env.BASE_URL}>Home</a><span aria-hidden="true">·</span><span aria-current="page">Services</span>
        </nav>
        <div className="vv-sv-hero-main vv-sv-reveal">
          <h1 id="vv-sv-title">Six ways we create, <em>all of them yours.</em></h1>
          <p>Every creative solution is shaped around your story, your audience and what you want to achieve. No one-size-fits-all ideas. Just thoughtful work made for you.</p>
        </div>
        <nav className="vv-sv-nav vv-sv-hero-services vv-sv-reveal" aria-label="Jump to a creative service">
          {services.map(s=><a key={s.id} href={"#service-"+s.id}>
            <span className="vv-sv-hero-nav-number">{s.number}</span>
            <span className="vv-sv-hero-nav-name">{s.id==="social-media"?"Social Media":s.id==="web-ui-ux"?"Web & UI/UX":s.id==="branding"?"Branding":s.name}</span>
            <ArrowUpRight size={16} strokeWidth={1.8} aria-hidden="true"/>
          </a>)}
        </nav>
      </div>
    </section>

    <section id="services" className="vv-sv-pin-services" aria-labelledby="vv-sv-services-title">
      <div className="vv-sv-container">
        <header className="vv-sv-pin-heading vv-sv-reveal">
          <span className="vv-sv-kicker"><i/><i/> THE CREATIVE DISCIPLINES</span>
          <div className="vv-sv-pin-heading-row">
            <h2 id="vv-sv-services-title">What we <em>bring to life.</em></h2>
            <p>Six ways to tell your story. Hover over a card to see it come alive, or tap to explore your next project.</p>
          </div>
        </header>
        <div className="vv-sv-pin-grid">
          {services.map((s,index)=>{
            const Icon=s.Icon;
            const photo: Record<string,string> = {
              photography:"about-photographer.webp",
              videography:"portfolio-event-story.jpg",
              "graphic-design":"portfolio-social-design.jpg",
            };
            const image=photo[s.id];
            return <article className="vv-sv-pin-cell" id={"details-"+s.id} key={s.id}
              aria-labelledby={"sv-"+s.id}>
              <span id={"service-"+s.id} className="vv-sv-pin-anchor" aria-hidden="true"/>
              <PinContainer
                containerClassName="vv-sv-service-pin"
                title={s.name}
                href={import.meta.env.BASE_URL+"request-quote.html?service="+encodeURIComponent(s.name)}
              >
                <div className={"vv-sv-pin-card vv-sv-pin-"+s.id}>
                  {image?<img className="vv-sv-pin-photo"
                    src={import.meta.env.BASE_URL+image}
                    alt="" loading={index>2?"lazy":"eager"} decoding="async"
                  />:<div className="vv-sv-pin-ui-art" aria-hidden="true"><ServiceArtwork kind={s.kind}/></div>}
                  <div className="vv-sv-pin-wash" aria-hidden="true"/>
                  <div className="vv-sv-pin-top">
                    <span>{s.number}<small> / 06</small></span>
                    <Icon size={23} strokeWidth={1.5} aria-hidden="true"/>
                  </div>
                  <div className="vv-sv-pin-center">
                    <span className="vv-sv-pin-category">{s.tags.slice(0,2).join(" · ")}</span>
                    <h3 id={"sv-"+s.id}>{s.name}</h3>
                    <p>{s.description}</p>
                  </div>
                  <div className="vv-sv-pin-bottom">
                    <span>VISUAL VERSE CREATIONS</span>
                    <span className="vv-sv-pin-explore">Explore service <ArrowUpRight size={17}/></span>
                  </div>
                </div>
              </PinContainer>
            </article>;
          })}
        </div>
        <p className="vv-sv-pin-outro">One studio. Many disciplines. <a href={import.meta.env.BASE_URL+"request-quote.html"}>Let's shape yours <ArrowUpRight size={14}/></a></p>
      </div>
    </section>

    <VisualVerseProcessJourney/>

    <section className="vv-sv-resources" id="before-you-begin">
      <div className="vv-sv-container">
        <header className="vv-sv-resource-heading vv-sv-reveal">
          <span className="vv-sv-kicker"><i/><i/> BEFORE YOU DECIDE</span>
          <h2>The right creative partner starts <em>with the right questions.</em></h2>
          <p>A little clarity goes a long way. Here's where to begin.</p>
        </header>
        <div className="vv-sv-resource-grid">
          <a href={import.meta.env.BASE_URL+"request-quote.html"} className="vv-sv-resource vv-sv-reveal">
            <span><FileText size={21}/><small>01</small></span>
            <h3>Tell us about your project</h3>
            <p>Share your idea, the goals and what you're imagining. We'll shape a clear way forward.</p>
            <b>START A BRIEF <ArrowUpRight size={16}/></b>
          </a>
          <a href={import.meta.env.BASE_URL+"who-we-serve.html"} className="vv-sv-resource vv-sv-reveal">
            <span><UsersRound size={21}/><small>02</small></span>
            <h3>See who we create with</h3>
            <p>From independent creators to growing teams, explore the people behind the briefs.</p>
            <b>EXPLORE WHO WE SERVE <ArrowUpRight size={16}/></b>
          </a>
          <a href={import.meta.env.BASE_URL+"contact.html"} className="vv-sv-resource vv-sv-reveal">
            <span><MessageCircle size={21}/><small>03</small></span>
            <h3>Have a question first?</h3>
            <p>Ask us about scope, timelines, collaboration or how we approach a new idea.</p>
            <b>LET'S TALK <ArrowUpRight size={16}/></b>
          </a>
        </div>
      </div>
    </section>
  </div>;
}
