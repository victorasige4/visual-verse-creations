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

function ServiceArtwork({ kind }: {kind:ServiceKind}) {
  if (kind==="photo") return (
    <div className="vv-svc-art vv-svc-art-photo">
      <div className="vv-svc-photo-frame">
        <img src="/about-photographer.webp" alt="Photographer looking through a professional camera lens" loading="lazy" />
        <span className="vv-svc-viewfinder" aria-hidden="true" />
        <span className="vv-svc-photo-label"><Camera size={15} aria-hidden="true"/> FRAME / 001</span>
      </div>
      <div className="vv-svc-floating vv-svc-photo-floating"><span className="vv-svc-mini-dot"/> VISUAL STORYTELLING <strong>01 / 06</strong></div>
    </div>
  );
  if (kind==="film") return (
    <div className="vv-svc-art vv-svc-art-film">
      <div className="vv-svc-film-editor">
        <div className="vv-svc-film-editor-head"><span>VV / MOTION STUDIO</span><Clapperboard size={17} aria-hidden="true"/></div>
        <div className="vv-svc-film-preview">
          <img src="/about-photographer.webp" alt="Cinematography concept showing a creative with a camera" loading="lazy" />
          <div className="vv-svc-film-play"><Play size={25} fill="currentColor" aria-hidden="true"/></div>
          <div className="vv-svc-film-time">00:24:18 / 01:00</div>
        </div>
        <div className="vv-svc-film-timeline" aria-hidden="true">
          <div className="vv-svc-film-track">{Array.from({length:8},(_,i)=><i key={i}/>)}</div>
          <div className="vv-svc-audio-track">{Array.from({length:24},(_,i)=><i key={i} style={{height:6+(i*7)%19}}/>)}</div>
        </div>
      </div>
      <div className="vv-svc-video-tag">STORY / MOTION / SOUND <span>↗</span></div>
    </div>
  );
  if (kind==="branding") return (
    <div className="vv-svc-art vv-svc-art-branding">
      <div className="vv-svc-brand-card vv-svc-brand-card-back"><span>BRAND SYSTEM / 001</span><img src="/logo-mark.png" alt="" aria-hidden="true"/></div>
      <div className="vv-svc-brand-card vv-svc-brand-card-front">
        <span className="vv-svc-brand-caption">VISUAL VERSE / CREATIONS</span>
        <img src="/logo-mark.png" alt="Visual Verse logo mark"/>
        <strong>Creativity,<br/>with intention.</strong>
      </div>
      <div className="vv-svc-brand-palette">
        <span style={{background:"#003f5c"}}/><span style={{background:"#2ec4b6"}}/><span style={{background:"#ddf6f1"}}/>
        <small>COLOR / IDENTITY</small>
      </div>
    </div>
  );
  if (kind==="graphic") return (
    <div className="vv-svc-art vv-svc-art-graphic">
      <div className="vv-svc-poster vv-svc-poster-back"><span>VISUAL VOICE</span><i/><b>V</b></div>
      <div className="vv-svc-poster vv-svc-poster-front">
        <div className="vv-svc-poster-top"><PenTool size={18} aria-hidden="true"/> DESIGN / STUDIO</div>
        <strong>MAKE<br/>IT<br/><em>MATTER.</em></strong>
        <div className="vv-svc-poster-bottom"><span>IDEAS, IN COLOR.</span><span>↗</span></div>
      </div>
      <div className="vv-svc-design-grid" aria-hidden="true"><span/><span/><span/><span/></div>
    </div>
  );
  if (kind==="web") return (
    <div className="vv-svc-art vv-svc-art-web">
      <div className="vv-svc-browser">
        <div className="vv-svc-browser-top"><span>● ● ●</span><div>visualverse / studio</div><MonitorSmartphone size={16} aria-hidden="true"/></div>
        <div className="vv-svc-browser-body">
          <div className="vv-svc-browser-mini"><img src="/logo-mark.png" alt="Visual Verse logo"/></div>
          <div className="vv-svc-browser-type"><small>CREATIVE EXPERIENCES</small><strong>Beautifully<br/>thought through.</strong><span>EXPLORE <ArrowUpRight size={12} aria-hidden="true"/></span></div>
          <div className="vv-svc-browser-art" aria-hidden="true"><i/><i/><i/></div>
        </div>
      </div>
      <div className="vv-svc-phone"><span>VV</span><div><i/><i/><i/></div><small>DESIGN THAT CONNECTS</small></div>
    </div>
  );
  return (
    <div className="vv-svc-art vv-svc-art-social">
      <div className="vv-svc-social-orbit" aria-hidden="true"/>
      <div className="vv-svc-social-center"><Share2 size={34} strokeWidth={1.6} aria-hidden="true"/><span>CREATE.<br/>CONNECT.</span></div>
      <span className="vv-svc-social-icon vv-svc-social-ig"><Instagram size={29} aria-label="Instagram"/></span>
      <span className="vv-svc-social-icon vv-svc-social-fb"><Facebook size={29} aria-label="Facebook"/></span>
      <span className="vv-svc-social-icon vv-svc-social-in"><Linkedin size={28} aria-label="LinkedIn"/></span>
      <span className="vv-svc-social-icon vv-svc-social-yt"><Youtube size={30} aria-label="YouTube"/></span>
      <span className="vv-svc-social-icon vv-svc-social-x"><b>X</b></span>
      <span className="vv-svc-social-icon vv-svc-social-tt"><b>♪</b></span>
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
      if(i>=0)setActive(i);
    };
    window.addEventListener("hashchange",onHash);
    return ()=>window.removeEventListener("hashchange",onHash);
  },[]);
  const service=services[active];
  return (
    <div className="vv-svc-layout">
      <div className="vv-svc-heading">
        <div>
          <span className="vv-label">WHAT WE DO / 002</span>
          <h2 className="vv-section-h">Six ways we<br/>bring ideas to life.</h2>
        </div>
        <p>One creative studio, every detail considered. Select a service to explore how Visual Verse turns your vision into something remarkable.</p>
      </div>
      <div className="vv-svc-stack" aria-label="Visual Verse services">
        {services.map((item,index)=>{
          const selected=index===active;
          const Icon=item.Icon;
          return (
            <article id={"service-"+item.id} key={item.id} className={"vv-svc-slice"+(selected?" is-active":"")} data-service={item.id}>
              <button
                className="vv-svc-slice-tab"
                type="button"
                aria-expanded={selected}
                aria-controls={"vv-service-panel-"+item.id}
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
                        <a href="#contact" className="vv-svc-cta">Explore {item.title}<span><ArrowUpRight size={17} aria-hidden={true}/></span></a>
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
