import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRight, Camera, Clapperboard, Palette, PenTool, MonitorSmartphone,
  Share2, Play, Instagram, Facebook, Linkedin, Youtube, Check, MousePointer2
} from "lucide-react";
import type { ComponentType } from "react";

type ServiceKind = "photo" | "film" | "branding" | "graphic" | "web" | "social";
type Service = {
  id: string;
  title: string;
  label: string;
  headline: string;
  description: string;
  details: string[];
  kind: ServiceKind;
  Icon: ComponentType<{ size?: number; strokeWidth?: number; "aria-hidden"?: boolean }>;
};

const services: Service[] = [
  {
    id:"photography", title:"Photography", label:"Moments & portraits", headline:"Stories worth remembering.",
    description:"From personal milestones to purposeful brand imagery, we make every frame feel like your story.",
    details:["Portraits & lifestyle","Events & celebrations","Brand & product photography"],
    kind:"photo",Icon:Camera
  },
  {
    id:"videography", title:"Videography",label:"Film & motion",headline:"Make every frame matter.",
    description:"Films, reels and moving stories that capture attention and stay with your audience.",
    details:["Brand films & documentaries","Event highlight films","Social video & editing"],
    kind:"film",Icon:Clapperboard
  },
  {
    id:"branding",title:"Branding",label:"Identity & strategy",headline:"An identity that's unmistakably you.",
    description:"From first idea to final brand system, we give your vision a distinct and consistent voice.",
    details:["Brand strategy & direction","Logo & visual identities","Guidelines & brand systems"],
    kind:"branding",Icon:Palette
  },
  {
    id:"graphic-design",title:"Graphic Design",label:"Visual communication",headline:"Design people feel.",
    description:"Clear, expressive visuals for campaigns, print and every place your brand shows up.",
    details:["Campaigns & social assets","Editorial & marketing design","Print & promotional materials"],
    kind:"graphic",Icon:PenTool
  },
  {
    id:"web-ui-ux",title:"Web & UI/UX",label:"Digital experiences",headline:"Digital, with a human touch.",
    description:"Websites and intuitive interfaces that guide people from curiosity to connection.",
    details:["Responsive websites","UX strategy & prototyping","Product & interface design"],
    kind:"web",Icon:MonitorSmartphone
  },
  {
    id:"social-media",title:"Social Media",label:"Digital marketing",headline:"Good stories travel further.",
    description:"Content, campaigns and social experiences that build communities and spark conversations.",
    details:["Social content strategy","Creative campaigns & reels","Digital storytelling"],
    kind:"social",Icon:Share2
  }
];

function ServiceArtwork({ kind }: { kind: ServiceKind }) {
  if(kind==="photo")return (
    <div className="vv-ui-preview vv-ui-lightroom" aria-label="Lightroom-inspired photo editing workspace illustration">
      <div className="vv-ui-top"><span>● ● ●</span><strong>PHOTO / DEVELOP</strong><small>Lr · EDIT</small></div>
      <div className="vv-ui-editor">
        <div className="vv-ui-filmstrip">{["01","02","03","04"].map(x=><span key={x}>{x}</span>)}</div>
        <div className="vv-ui-photo"><img src="/about-photographer.webp" alt="Professional photographer in portrait editor preview" loading="lazy"/><span>BEFORE / AFTER</span></div>
        <div className="vv-ui-controls"><strong>LIGHT</strong>{["Exposure","Contrast","Highlights","Shadows","Vibrance"].map((label,i)=><div key={label}><small>{label}</small><i style={{width:(35+i*11)+"%"}}/></div>)}</div>
      </div>
      <div className="vv-ui-bottom">ORIGINAL FRAME · EDITED TO TELL A STORY</div>
    </div>
  );
  if(kind==="film")return (
    <div className="vv-ui-preview vv-ui-premiere" aria-label="Premiere Pro-inspired video editing workspace illustration">
      <div className="vv-ui-top"><span>● ● ●</span><strong>VV / VIDEO EDITOR</strong><small>Pr · CUT</small></div>
      <div className="vv-ui-film-workspace"><div className="vv-ui-film-monitor"><div className="vv-ui-film-scene"><div className="vv-ui-film-sun"/><div className="vv-ui-film-hills"/><Play size={34} fill="currentColor" aria-hidden="true"/></div><span>PROGRAM: VISUAL STORY / 01</span></div><div className="vv-ui-film-bin"><small>PROJECT FILES</small>{["Footage","Sound","Graphics"].map(x=><span key={x}>▸ {x}</span>)}</div></div>
      <div className="vv-ui-video-tracks">{[0,1,2].map(i=><div key={i}><small>{["V1","A1","A2"][i]}</small>{Array.from({length:7},(_,j)=><i key={j} style={{width:(j%3+1)*18+"px"}}/>)}</div>)}</div>
      <div className="vv-ui-bottom">00:12:24 / EDIT / SOUND / COLOR</div>
    </div>
  );
  if(kind==="branding")return (
    <div className="vv-ui-preview vv-ui-brand-kit" aria-label="Visual Verse brand identity kit illustration">
      <div className="vv-ui-brand-paper vv-ui-brand-behind"><span>IDENTITY SYSTEM</span><b>VV</b></div>
      <div className="vv-ui-brand-paper vv-ui-brand-front"><span>VISUAL VERSE / CREATIONS</span><img src="/logo-mark.png" alt="Visual Verse favicon logo"/><strong>Ideas with<br/>an identity.</strong></div>
      <div className="vv-ui-brand-swatches"><i/><i/><i/></div>
    </div>
  );
  if(kind==="graphic")return (
    <div className="vv-ui-preview vv-ui-illustrator" aria-label="Illustrator and Photoshop-inspired graphic design canvas illustration">
      <div className="vv-ui-top"><span>● ● ●</span><strong>DESIGN / ARTBOARD 01</strong><small>Ai · Ps</small></div>
      <div className="vv-ui-graphics-workspace">
        <div className="vv-ui-tools">{["▣","◉","✒","T","◇","↗"].map((t,i)=><span key={i}>{t}</span>)}</div>
        <div className="vv-ui-artboard"><small>THE VISUAL VERSE</small><strong>DESIGN<br/>WITHOUT<br/><em>LIMITS.</em></strong><span>EXPLORE MORE ↗</span><i className="vv-ui-artboard-shape"/></div>
        <div className="vv-ui-layers"><small>LAYERS</small>{["Artboard 01","Headline","Shapes","Color"].map(x=><span key={x}>◉ {x}</span>)}</div>
      </div>
      <div className="vv-ui-bottom">CMYK / VECTOR / CONCEPTS MADE VISIBLE</div>
    </div>
  );
  if(kind==="web")return (
    <div className="vv-ui-preview vv-ui-webkit" aria-label="Responsive website displayed on desktop and mobile screen">
      <div className="vv-ui-web-desktop"><div className="vv-ui-web-bar">● ● ● <span>visualverse.com / creative experience</span></div><div className="vv-ui-web-screen"><img src="/logo-mark.png" alt="Visual Verse logo in example website design"/><small>THE NEXT DIGITAL STORY</small><strong>Make an<br/>impression.</strong><span>EXPLORE WORK ↗</span><div className="vv-ui-web-orbit"/></div></div>
      <div className="vv-ui-web-phone"><div className="vv-ui-web-notch"/><span>VV / MOBILE</span><strong>Designed<br/>for every<br/>screen.</strong><div className="vv-ui-mobile-pill">LEARN MORE ↗</div></div>
    </div>
  );
  return (
    <div className="vv-ui-preview vv-ui-campaigns" aria-label="Social media campaign creative and performance dashboard illustration">
      <div className="vv-ui-social-feed"><div className="vv-ui-social-top">VV / CAMPAIGN <span>● LIVE</span></div><div className="vv-ui-social-feature"><span>GREAT STORIES<br/>DESERVE<br/><b>A BIGGER STAGE.</b></span><i/></div><div className="vv-ui-social-channel"><span>Instagram</span><span>LinkedIn</span><span>YouTube</span><span>TikTok</span><span>X</span></div></div>
      <div className="vv-ui-social-float"><span>CAMPAIGN REACH</span><strong>↗ ENGAGEMENT</strong><div className="vv-ui-sparkline">{[30,46,39,60,52,76,94].map((h,i)=><i key={i} style={{height:h+"%"}}/>)}</div><small>STORIES THAT CONNECT</small></div>
    </div>
  );
}

function initialService() {
  if (typeof window==="undefined") return 0;
  const hash=window.location.hash;
  const i=services.findIndex(service=>"#service-"+service.id===hash);
  return i>=0?i:0;
}

export function VisualVerseServices() {
  const [active,setActive]=useState(initialService);
  useEffect(()=>{
    const onHash=()=>{
      const i=services.findIndex(service=>"#service-"+service.id===window.location.hash);
      if(i>=0){
        setActive(i);
        // Display:contents tabs do not have a physical box on mobile.
        // Scroll the parent section into view for direct service links.
        window.requestAnimationFrame(()=>document.getElementById("services")?.scrollIntoView({block:"start"}));
      }
    };
    window.addEventListener("hashchange",onHash);
    return ()=>window.removeEventListener("hashchange",onHash);
  },[]);
  return (
    <div className="vv-svc-layout">
      <div className="vv-svc-heading">
        <div>
          <span className="vv-label">WHAT WE DO / 002</span>
          <h2 className="vv-section-h">Six ways we<br/>bring ideas to life.</h2>
        </div>
        <p>One creative studio, every detail considered. Hover over a service to see how Visual Verse turns your vision into something remarkable.</p>
      </div>
      <div className="vv-svc-stack" aria-label="Visual Verse services">
        {services.map((item,index)=>{
          const selected=index===active;
          const Icon=item.Icon;
          return (
            <article id={"service-"+item.id} key={item.id} className={"vv-svc-slice"+(selected?" is-active":"")} data-service={item.id}
              onPointerEnter={(event)=>{if(event.pointerType==="mouse")setActive(index);}}
              onFocusCapture={()=>setActive(index)}>
              <button
                className="vv-svc-slice-tab"
                type="button"
                aria-expanded={selected}
                aria-controls={selected ? "vv-service-panel-"+item.id : undefined}
                aria-label={"Explore "+item.title}
                onClick={()=>setActive(index)}
              >
                <span className="vv-svc-slice-tab-number">0{index+1}</span>
                <span className="vv-svc-slice-tab-label">{item.title}</span>
                <Icon size={15} aria-hidden={true}/>
              </button>
              {selected && (
                <div className="vv-svc-active-panel" id={"vv-service-panel-"+item.id}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      className="vv-svc-panel-inner" key={item.id}
                      initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}
                      transition={{duration:0.32,ease:[0.22,1,0.36,1]}}
                    >
                      <div className="vv-svc-panel-copy">
                        <div className="vv-svc-overline"><Icon size={16} aria-hidden={true}/> {String(index+1).padStart(2,"0")} / 06 · {item.label}</div>
                        <h3>{item.title}</h3>
                        <p className="vv-svc-panel-headline">{item.headline}</p>
                        <p className="vv-svc-panel-description">{item.description}</p>
                        <ul>{item.details.map(t=><li key={t}><Check size={14} aria-hidden={true}/>{t}</li>)}</ul>
                        <a href={"/services.html#details-"+item.id} className="vv-svc-cta">Explore {item.title}<span><ArrowUpRight size={17} aria-hidden={true}/></span></a>
                      </div>
                      <ServiceArtwork kind={item.kind}/>
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}
            </article>
          );
        })}
      </div>
      <div className="vv-svc-footer">
        <span>01 — 06 / OUR CREATIVE DISCIPLINES</span>
        <p>Different disciplines. One distinct visual language.</p>
      </div>
    </div>
  );
}
