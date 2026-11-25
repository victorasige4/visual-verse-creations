import { EditorialText } from "./EditorialText";
import { orderedServices, serviceLabel } from "../data/services";
import { SOCIAL_PROFILES } from "../data/socials";
import { VisualVerseActionContent } from "./VisualVerseAction";
import { lazy, useState, type ComponentType, type FormEvent } from "react";
import {
  ArrowUpRight, ArrowRight, Camera, Clapperboard, Palette, PenTool,
  MonitorSmartphone, Share2, Phone, Mail, MapPin, MessageCircle,
  Film, FileText, Send, Radio, Sparkles, Check, ChevronDown
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { VisualVerseNavbar } from "./VisualVerseNavbar";
import { VisualVerseFooter } from "./VisualVerseClosingSections";
import { WhatsAppFloating } from "./VisualVersePolicies";
import { VisualVerseAboutCta } from "./VisualVerseAboutCta";

/* Load the heavier About and Services experiences only on the
   matching page. This also lets Vite split their page-specific CSS. */
const VisualVerseAboutEditorial = lazy(async () => ({
  default: (await import("./VisualVerseAboutEditorial")).VisualVerseAboutEditorial
}));
const VisualVerseServicesEditorial = lazy(async () => ({
  default: (await import("./VisualVerseServicesEditorial")).VisualVerseServicesEditorial
}));


type Kind = "about" | "services" | "audiences" | "contact" | "quote";
const EMAIL = "hello@visualverse.com";
const PHONE = "+254794044598";
const WHATSAPP = "https://wa.me/254794044598?text=Hello%20Visual%20Verse%2C%20I'd%20like%20to%20discuss%20a%20project.";

const pages: Record<Kind, {eyebrow:string;first:string;accent:string;description:string;count:string}> = {
  about: {eyebrow:"WHO WE ARE",first:"We're a collective of",accent:"creative storytellers.",description:"Designers, filmmakers, photographers and visual thinkers creating experiences that move people.",count:"01 / 06"},
  services: {eyebrow:"WHAT WE DO",first:"Your vision, brought",accent:"to life.",description:"Full-service creative solutions tailored to make your ideas, brands and stories stand out.",count:"02 / 06"},
  audiences: {eyebrow:"WHO WE CREATE WITH",first:"Your world. Our",accent:"creative perspective.",description:"For new brands, growing businesses, ambitious founders and moments worth remembering.",count:"03 / 06"},
  contact: {eyebrow:"GET IN TOUCH",first:"Let's start a",accent:"conversation.",description:"Questions, collaborations, or a project in mind? Reach us in the way that works best for you.",count:"05 / 06"},
  quote: {eyebrow:"REQUEST A QUOTE",first:"Tell us about",accent:"your big idea.",description:"Every good project starts with a clear brief. Share what you have in mind and we'll shape the next steps together.",count:"06 / 06"}
};

type Service = {id:string;title:string;label:string;summary:string;deliverables:string[];Icon:LucideIcon};
const services:Service[]=orderedServices<Service>([
  {id:"graphic-design",title: "Graphic Design",label:"Digital & print",summary:"Design that communicates clearly, catches attention and connects with the right people.",deliverables:["Campaign and marketing graphics","Social media and digital assets","Print, editorial and event materials","Packaging and promotional collateral"],Icon:PenTool},
  {id:"photography",title: "Photography",label:"Visual storytelling",summary:"Preserving people, places and moments with intention—from portraits to milestone events.",deliverables:["Weddings, graduations & celebrations","Corporate, church & community events","Portraits and lifestyle photography","Product and brand imagery"],Icon:Camera},
  {id:"web-ui-ux",title: "Web & UI/UX Design",label:"Digital experiences",summary:"Responsive websites and product interfaces created for useful, effortless experiences.",deliverables:["Website and landing page design","Mobile app screens and user flows","UI/UX research and wireframes","Interactive Figma prototypes"],Icon:MonitorSmartphone},
  {id:"videography",title: "Videography",label:"Film & motion",summary:"Stories that move. From capturing the moment to editing the final frame.",deliverables:["Event films and highlight reels","Corporate and promotional videos","Documentary and interview production","Editing, color grading and motion graphics"],Icon:Clapperboard},
  {id:"branding",title: "Branding & Identity",label:"Identity & direction",summary:"A consistent brand world built from the logo all the way to how it speaks and shows up.",deliverables:["Brand discovery and positioning","Logo and visual identity systems","Guidelines and brand applications","Rebrands and campaign direction"],Icon:Palette},
  {id:"social-media",title: "Social Media & Digital Marketing",label:"Campaigns & strategy",summary:"Creative content and joined-up campaigns designed to engage audiences and grow recognition.",deliverables:["Content planning and strategy","Social media creatives and campaigns","Digital marketing assets and copywriting","Performance-oriented creative iterations"],Icon:Share2}
]).map(s=>({...s,title:serviceLabel(s.id)}));

function PageHero({kind}:{kind:Kind}){
  const page=pages[kind];
  return (
    <section className="vv-inner-hero vv-inner-hero-v2">
      <div className="vv-inner-hero-inner">
        <div className="vv-inner-hero-copy">
          <span className="vv-inner-eyebrow"><i aria-hidden="true"/> {page.eyebrow}</span>
          <h1>{page.first}<br/><em>{page.accent}</em></h1>
          <p>{page.description}</p>
          <div className="vv-inner-hero-actions">
            <a className="vv-motion-action vv-action-primary" href={kind==="contact"?"#send-a-message":"/request-quote.html"}><VisualVerseActionContent>{kind==="contact"?"Send a message":"Start a project"}</VisualVerseActionContent></a>
            <a className="vv-motion-action vv-action-secondary" href={kind==="contact"?WHATSAPP:"/projects.html"} target={kind==="contact"?"_blank":undefined} rel={kind==="contact"?"noopener noreferrer":undefined}><VisualVerseActionContent Icon={kind==="contact"?MessageCircle:ArrowRight}>{kind==="contact"?"Chat on WhatsApp":"Explore our work"}</VisualVerseActionContent></a>
          </div>
        </div>
        <div className="vv-inner-hero-art">
          <>{kind==="contact"?<div className="vv-contact-orbits" aria-hidden="true"><div className="vv-contact-orbit"><i/></div><div className="vv-contact-orbit"><i/></div><div className="vv-contact-orbit"><i/></div></div>:<div className="vv-inner-hero-circles" aria-hidden="true"><i/><i/></div>}</>
          <img src="/logo-mark.png" alt="Visual Verse logo mark"/>
          <span>{kind==="contact"?"FIRST CONTACT / IMAGINE. CREATE. CONNECT.":"VISUAL VERSE / IMAGINE. CREATE. CONNECT."}</span>
        </div>
      </div>
      <div className="vv-inner-hero-bottom"><span>NAIROBI, KENYA · CREATIVE MEDIA COMPANY</span><span>SCROLL TO EXPLORE <ArrowRight size={14} style={{transform:"rotate(90deg)"}} aria-hidden="true"/></span></div>
    </section>
  );
}


function ContactSignalHero({topic,onTopicChange}:{topic:string;onTopicChange:(topic:string)=>void}){
  const active=services.find(s=>s.title===topic);
  const ActiveIcon=active?.Icon??Radio;
  return <section className="vv-inner-hero vv-inner-hero-v2 vv-contact-signal-hero">
    <div className="vv-inner-hero-inner">
      <div className="vv-inner-hero-copy">
        <span className="vv-inner-eyebrow"><i aria-hidden="true"/> FIRST CONTACT / VISUAL VERSE</span>
        <h1>Let's start a<br/><em>conversation.</em></h1>
        <p>Somewhere between your imagination and our creativity, something extraordinary is waiting to happen. Let's find your frequency.</p>
        <div className="vv-inner-hero-actions">
          <a className="vv-motion-action vv-action-primary" href="#send-a-message"><VisualVerseActionContent Icon={ArrowRight}>Send a signal</VisualVerseActionContent></a>
          <a className="vv-motion-action vv-action-secondary" href={WHATSAPP} target="_blank" rel="noopener noreferrer"><VisualVerseActionContent Icon={MessageCircle}>Chat on WhatsApp</VisualVerseActionContent></a>
        </div>
        <div className="vv-signal-caption"><span aria-hidden="true"/><small>IMAGINE</small><span aria-hidden="true"/><small>CREATE</small><span aria-hidden="true"/><small>CONNECT</small></div>
      </div>
      <div className="vv-signal-console">
        <div className="vv-signal-console-head"><span><Radio size={15} aria-hidden="true"/> CREATIVE FREQUENCY</span><span>NAIROBI / KE</span></div>
        <div className="vv-signal-dial">
          <div className="vv-contact-orbits" aria-hidden="true"><div className="vv-contact-orbit"><i/></div><div className="vv-contact-orbit"><i/></div><div className="vv-contact-orbit"><i/></div></div>
          <div className="vv-signal-core"><img src="/logo-mark.png" alt="" decoding="async"/><span><ActiveIcon size={20} aria-hidden="true"/></span></div>
          {services.map((service,i)=>{
            const angle=-Math.PI/2+i*Math.PI/3;
            const Icon=service.Icon;
            return <button key={service.id} type="button" className="vv-signal-node" style={{left:(50+38*Math.cos(angle))+"%",top:(50+38*Math.sin(angle))+"%"}} aria-label={service.title} aria-pressed={topic===service.title} onClick={()=>onTopicChange(topic===service.title?"":service.title)} title={service.title}><Icon size={20} aria-hidden="true"/></button>;
          })}
        </div>
        <div className="vv-signal-readout" aria-live="polite">
          <div><small>{active?"FREQUENCY SELECTED":"TUNE INTO YOUR IDEA"}</small><strong>{active?.title??"Six creative directions"}</strong><p>{active?.summary??"Choose a service on the dial or explore your options below."}</p></div>
          <a href="#send-a-message" aria-label={active?"Continue with "+active.title:"Continue to the contact form"}><ArrowUpRight size={22}/></a>
        </div>
        <div className="vv-signal-console-foot"><span>{active?active.label.toUpperCase():"SELECT AN ICON TO EXPLORE"}</span><span aria-hidden="true">● ━━━ ○</span></div>
      </div>
    </div>
    <div className="vv-inner-hero-bottom"><span>NAIROBI, KENYA · CREATIVE MEDIA COMPANY</span><a href="#send-a-message">SCROLL TO CONNECT <ChevronDown size={14} aria-hidden="true"/></a></div>
  </section>;
}

function SectionTitle({eyebrow,children,description}:{eyebrow:string;children:React.ReactNode;description?:string}){
  return <header className="vv-inner-section-head"><span className="vv-inner-eyebrow">{eyebrow}</span><h2>{children}</h2>{description&&<p>{description}</p>}</header>;
}

function ServicesPage(){
  return <VisualVerseServicesEditorial/>;
}

function openMailDraft(subject:string,body:string){
  window.location.href="mailto:"+EMAIL+"?subject="+encodeURIComponent(subject)+"&body="+encodeURIComponent(body);
}

/* Scoped to the contact experience; shared page styles remain unchanged. */
const contactStyles = `
.vv-contact-experience .vv-inner-hero-v2{background:radial-gradient(ellipse at 80% 40%,#0b6572 0%,transparent 55%),#003f5c;color:white;border-color:transparent}
.vv-contact-experience .vv-inner-hero-v2 h1{color:#fff}
.vv-contact-experience .vv-inner-hero-v2 h1 em,.vv-contact-experience .vv-inner-hero-v2 .vv-inner-eyebrow{color:#86eadd}
.vv-contact-experience .vv-inner-hero-v2 p{color:#d2e9e9}
.vv-contact-experience .vv-inner-hero-actions .vv-action-secondary{color:white;border-color:#85b9bd}
.vv-contact-experience .vv-inner-hero-bottom{color:#b0d6d7;border-color:#ffffff26}
.vv-contact-experience .vv-inner-hero-art{min-height:330px;isolation:isolate;overflow:hidden;background:radial-gradient(circle,#2ec4b62b,transparent 66%)}
.vv-contact-experience .vv-inner-hero-art::before{content:"";position:absolute;inset:0;z-index:-1;background-image:radial-gradient(#c2f8ef75 1px,transparent 1px);background-size:25px 25px;mask-image:radial-gradient(ellipse,#000,transparent 75%)}
.vv-contact-experience .vv-inner-hero-art img{width:clamp(100px,14vw,180px);filter:grayscale(1) brightness(0) invert(1) drop-shadow(0 0 22px #2ec4b67d)}
.vv-contact-experience .vv-inner-hero-art>span{color:#b6e7df;text-align:center;letter-spacing:.11em}
.vv-contact-orbits{position:absolute;inset:0;display:grid;place-items:center;pointer-events:none;z-index:1}
.vv-contact-orbit{position:absolute;width:min(78%,330px);aspect-ratio:1;border:1px solid #85eadd75;border-radius:50%;animation:vv-contact-spin 22s linear infinite}
.vv-contact-orbit:nth-child(2){width:min(57%,240px);border-style:dashed;animation-duration:16s;animation-direction:reverse}
.vv-contact-orbit:nth-child(3){width:min(93%,390px);border-color:#a7eae82f;animation-duration:32s}
.vv-contact-orbit i{position:absolute;left:50%;top:0;transform:translate(-50%,-50%);width:9px;height:9px;background:#a6ffef;border-radius:50%;box-shadow:0 0 16px #2ec4b6}
.vv-contact-orbit:nth-child(2) i{width:6px;height:6px}
.vv-contact-orbit:nth-child(3) i{width:5px;height:5px}
@keyframes vv-contact-spin{to{transform:rotate(360deg)}}
.vv-contact-experience .vv-inner-contact{background:#f5fbf7;scroll-margin-top:100px}
.vv-contact-experience .vv-inner-contact-main{gap:clamp(26px,4vw,65px);grid-template-columns:minmax(0,.95fr) minmax(0,1.05fr)}
.vv-contact-experience .vv-inner-contact-copy .vv-inner-section-head{margin-bottom:22px}
.vv-contact-experience .vv-inner-contact-links{grid-template-columns:1fr 1fr;gap:12px;margin-top:24px}
.vv-contact-experience .vv-inner-contact-links>a,.vv-contact-experience .vv-inner-contact-links>div{position:relative;min-width:0;min-height:124px;display:flex;flex-direction:column;align-items:flex-start;justify-content:space-between;gap:12px;padding:17px;border:1px solid #d2e8e0;border-radius:16px;background:#fff;transition:transform .2s,background .2s,border-color .2s,box-shadow .2s}
.vv-contact-experience .vv-inner-contact-links>a:hover{transform:translateY(-3px);border-color:#159b90;background:#e6faf3;box-shadow:0 12px 24px #003f5c0d}
.vv-contact-experience .vv-inner-contact-links>a>svg:last-child{position:absolute;top:18px;right:15px}
.vv-contact-experience .vv-inner-contact-links>*>span{flex:none;align-items:flex-start;width:100%;gap:5px}
.vv-contact-experience .vv-inner-contact-links small{color:#397773}
.vv-contact-experience .vv-inner-contact-links strong{font-size:clamp(11px,1vw,14px)}
.vv-contact-experience .vv-inner-contact-links>*>svg:first-child{width:24px;height:24px}
.vv-contact-experience .vv-inner-contact-form{position:relative;overflow:hidden;border-top:4px solid #2ec4b6}
.vv-contact-experience .vv-inner-contact-form h3{font-size:clamp(20px,2vw,29px);line-height:1.18}
.vv-contact-topics{border:0;padding:0;margin:0;min-width:0}
.vv-contact-topics legend{font-size:12px;font-weight:850;color:#285b61;margin-bottom:10px;padding:0}
.vv-contact-topic-list{display:flex;flex-wrap:wrap;gap:7px}
.vv-contact-experience .vv-contact-topic-list button{font:inherit;font-size:11px;font-weight:700;line-height:1.3;min-height:36px;max-width:100%;width:auto;padding:8px 12px;border:1px solid #ccdfd9;border-radius:50px;background:#f5fbf7;color:#285b61;transition:background .2s,border-color .2s}
.vv-contact-experience .vv-contact-topic-list button[aria-pressed=true]{background:#003f5c;color:white;border-color:#003f5c}
.vv-contact-experience .vv-contact-topic-list button:hover{transform:none;border-color:#159b90}
.vv-contact-experience .vv-contact-topic-list button[aria-pressed=true]:hover{background:#005675;color:white}
.vv-contact-experience .vv-inner-contact-form>p{color:#4b7475}
.vv-contact-count{display:flex;justify-content:flex-end;font-size:10px;color:#4b7475;font-weight:600}
.vv-contact-location{margin-top:15px;min-height:136px;border-radius:16px;overflow:hidden;padding:20px;color:white;display:flex;align-items:center;gap:15px;background:radial-gradient(circle at 90% 20%,#168b89,#003f5c 72%);position:relative;isolation:isolate}
.vv-contact-location::after{content:"";position:absolute;inset:0;z-index:-1;background-image:radial-gradient(#b2f5e46b 1px,transparent 1px);background-size:13px 13px;mask-image:linear-gradient(90deg,transparent 25%,#000)}
.vv-contact-location>svg{flex:0 0 auto;color:#91f4e1}
.vv-contact-location strong{display:block;font-size:16px;margin-bottom:5px}
.vv-contact-location p{color:#d4efeb;font-size:12px;margin:0;line-height:1.6}
.vv-contact-experience .vv-inner-social-section{background:#fff}
.vv-contact-experience .vv-inner-social-links{grid-template-columns:repeat(5,minmax(0,1fr));max-width:none;gap:12px}
.vv-contact-experience .vv-inner-social-links a{min-height:125px;position:relative;align-items:flex-start;justify-content:space-between;flex-direction:column;gap:15px;padding:19px;font-size:13px;transition:background .2s,color .2s,transform .2s}
.vv-contact-experience .vv-inner-social-links a>svg:last-child{position:absolute;right:16px;top:18px}
.vv-contact-experience .vv-inner-social-links a:hover{background:#003f5c;color:white;transform:translateY(-4px)}
.vv-contact-experience .vv-inner-social-links a:hover svg{color:#a5f5e7}
.vv-contact-experience :is(a,button):focus-visible{outline:3px solid #159b90;outline-offset:4px}
@media(max-width:780px){.vv-contact-experience .vv-inner-contact-main{grid-template-columns:1fr}.vv-contact-experience .vv-inner-hero-art{min-height:280px}.vv-contact-experience .vv-inner-social-links{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:540px){.vv-contact-experience .vv-inner-hero-art{min-height:245px}.vv-contact-experience .vv-inner-contact-links>a,.vv-contact-experience .vv-inner-contact-links>div{padding:13px;min-height:120px}.vv-contact-experience .vv-inner-social-links{grid-template-columns:repeat(2,minmax(0,1fr))}.vv-contact-experience .vv-inner-social-links a{min-height:100px;padding:15px}.vv-contact-experience .vv-inner-hero-art img{width:105px}.vv-contact-orbit{max-width:205px}.vv-contact-orbit:nth-child(2){max-width:150px}.vv-contact-orbit:nth-child(3){max-width:240px}}
@media(prefers-reduced-motion:reduce){.vv-contact-orbit{animation:none}.vv-contact-experience .vv-inner-contact-links>a,.vv-contact-experience .vv-inner-social-links a,.vv-contact-experience .vv-contact-topic-list button{transition:none;transform:none!important}}

/* Interactive creative-frequency console, scoped to Contact. */
.vv-contact-experience .vv-contact-signal-hero{position:relative;isolation:isolate;overflow:hidden;background:radial-gradient(ellipse at 76% 35%,#136d73 0%,transparent 54%),linear-gradient(125deg,#002c44,#003f5c 65%,#064c60);min-height:min(810px,94svh)}
.vv-contact-signal-hero::before{content:"";position:absolute;inset:0;z-index:-1;pointer-events:none;background-image:radial-gradient(#a9ede75c 1px,transparent 1px);background-size:28px 28px;mask-image:linear-gradient(110deg,transparent 15%,#000 70%,transparent)}
.vv-contact-signal-hero .vv-inner-hero-inner{grid-template-columns:minmax(0,1fr) minmax(0,.86fr);gap:clamp(24px,6vw,95px)}
.vv-contact-signal-hero .vv-inner-hero-copy{position:relative}
.vv-contact-signal-hero .vv-inner-hero-bottom a{color:inherit;text-decoration:none;display:flex;align-items:center;gap:8px}
.vv-signal-caption{display:flex;flex-wrap:wrap;align-items:center;gap:9px;margin-top:32px;color:#b0dbd9;font-size:10px;letter-spacing:.13em;font-weight:700}
.vv-signal-caption>span{height:1px;width:19px;background:#2ec4b6}
.vv-signal-console{position:relative;min-width:0;border:1px solid #a5e8e345;border-radius:24px;background:linear-gradient(155deg,#ffffff10,#00253d55);padding:clamp(15px,2vw,26px);box-shadow:0 28px 64px #001c2c45;overflow:hidden}
.vv-signal-console-head,.vv-signal-console-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;color:#b7e6df;font-size:9px;font-weight:750;letter-spacing:.12em}
.vv-signal-console-head>span:first-child{display:flex;align-items:center;gap:7px}
.vv-signal-console-head svg{color:#8cf0dc}
.vv-signal-dial{position:relative;width:min(100%,350px);aspect-ratio:1;margin:8px auto;isolation:isolate;background:radial-gradient(circle,#2ec4b630,transparent 69%)}
.vv-signal-dial .vv-contact-orbit{width:76%;border-color:#a9f9ed70}
.vv-signal-dial .vv-contact-orbit:nth-child(2){width:52%}
.vv-signal-dial .vv-contact-orbit:nth-child(3){width:94%}
.vv-signal-core{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:grid;place-items:center;width:33%;aspect-ratio:1;border-radius:50%;border:1px solid #98f5e755;background:#003f5c;box-shadow:0 0 40px #2ec4b640;z-index:2}
.vv-signal-core img{width:63%;height:63%;object-fit:contain;filter:grayscale(1) brightness(0) invert(1)}
.vv-signal-core>span{position:absolute;right:-5px;bottom:-3px;display:grid;place-items:center;background:#9df6e8;color:#003f5c;border:3px solid #003f5c;border-radius:50%;width:36px;height:36px}
.vv-signal-node{position:absolute;z-index:3;transform:translate(-50%,-50%);width:clamp(42px,5vw,55px);height:clamp(42px,5vw,55px);display:grid;place-items:center;border:1px solid #a5e8e388;border-radius:50%;background:#06485f;color:#c5f7ee;cursor:pointer;transition:background .2s,box-shadow .2s,color .2s}
.vv-signal-node:hover,.vv-signal-node[aria-pressed=true]{background:#2ec4b6;color:#003f5c;box-shadow:0 0 0 5px #2ec4b628,0 0 22px #2ec4b65e}
.vv-contact-experience .vv-signal-node:focus-visible{outline-color:#fff}
.vv-signal-readout{display:flex;justify-content:space-between;gap:12px;align-items:center;border:1px solid #9ce8dc45;background:#002c44a6;border-radius:14px;padding:15px;min-height:123px}
.vv-signal-readout>div{min-width:0}
.vv-signal-readout small{display:block;color:#8ef1dd;font-size:9px;font-weight:800;letter-spacing:.12em;margin-bottom:6px}
.vv-signal-readout strong{display:block;color:white;font-size:clamp(14px,1.6vw,20px);line-height:1.2}
.vv-contact-experience .vv-signal-readout p{color:#c2e5e3;font-size:11px;line-height:1.55;margin:7px 0 0}
.vv-signal-readout>a{flex:0 0 auto;display:grid;place-items:center;width:43px;height:43px;border-radius:50%;color:#003f5c;background:#2ec4b6}
.vv-signal-console-foot{margin-top:13px;font-size:8px}
.vv-contact-experience .vv-contact-topic-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}
.vv-contact-experience .vv-contact-topic-list button{border-radius:11px;text-align:left;justify-content:flex-start;gap:8px;padding:11px;min-height:48px;width:100%;overflow-wrap:anywhere}
.vv-contact-topic-list button svg{flex:0 0 auto}
.vv-contact-meter{display:grid;gap:7px;padding:13px 15px;border-radius:12px;background:#eff8f3;border:1px solid #d9e9e1}
.vv-contact-meter>div:first-child{display:flex;justify-content:space-between;gap:8px;color:#285b61;font-size:10px;font-weight:750}
.vv-contact-meter-track{height:5px;border-radius:6px;background:#d4e7df;overflow:hidden}
.vv-contact-meter-track>span{display:block;height:100%;border-radius:6px;background:#168f84;transition:width .25s}
.vv-contact-meter>small{color:#4b7475;font-size:10px}
.vv-contact-experience .vv-contact-send-actions{display:flex;flex-wrap:wrap;gap:9px}
.vv-contact-experience .vv-contact-send-actions button{max-width:100%;font-size:11px}
.vv-contact-experience .vv-contact-send-actions .vv-contact-whatsapp{background:#fff;border:1px solid #a3d8cb;color:#003f5c}
.vv-contact-experience .vv-contact-send-actions .vv-contact-whatsapp:hover{background:#e2f7ee}
.vv-contact-experience .vv-contact-preview{border:1px solid #d4e7df;border-radius:12px;background:#f9fcfa;padding:13px}
.vv-contact-preview summary{cursor:pointer;font-size:12px;font-weight:750;color:#285b61}
.vv-contact-preview pre{white-space:pre-wrap;overflow-wrap:anywhere;margin:12px 0 0;font:inherit;font-size:12px;line-height:1.65;color:#285b61}
.vv-contact-path{margin-top:20px;border:1px solid #d4e8e0;border-radius:16px;padding:19px;background:white}
.vv-contact-path>strong{font-size:13px;color:#003f5c}
.vv-contact-path ol{list-style:none;padding:0;margin:14px 0 0;display:grid;gap:14px}
.vv-contact-path li{display:flex;gap:11px;align-items:flex-start}
.vv-contact-path li>span{flex:0 0 auto;width:29px;height:29px;display:grid;place-items:center;border-radius:50%;background:#e4f6ee;color:#167a71}
.vv-contact-path li strong{display:block;font-size:12px;color:#003f5c}
.vv-contact-path li p{font-size:11px;line-height:1.55;margin:3px 0 0}
@media(max-width:780px){.vv-contact-experience .vv-contact-signal-hero{min-height:auto}.vv-contact-signal-hero .vv-inner-hero-inner{grid-template-columns:1fr}.vv-signal-console{width:100%;max-width:520px;margin:auto}.vv-signal-caption{margin-top:22px}}
@media(max-width:540px){.vv-signal-console{padding:14px}.vv-signal-dial{max-width:280px}.vv-signal-dial .vv-contact-orbit{max-width:none}.vv-signal-readout{min-height:112px}.vv-contact-experience .vv-contact-topic-list button{font-size:10px;padding:8px;min-height:48px}.vv-contact-experience .vv-contact-send-actions button{width:100%}}
@media(prefers-reduced-motion:reduce){.vv-signal-node,.vv-contact-meter-track>span{transition:none}}

`;

function ContactPage({topic,onTopicChange}:{topic:string;onTopicChange:(topic:string)=>void}){
  const [name,setName]=useState(""),[email,setEmail]=useState(""),[subjectOverride,setSubjectOverride]=useState<string|null>(null),[message,setMessage]=useState("");
  const subject=subjectOverride??topic;
  const topics=[...services.map(s=>({title:s.title,Icon:s.Icon})),{title:"Collaboration",Icon:Sparkles},{title:"General enquiry",Icon:MessageCircle}];
  const validEmail=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const completed=[name.trim().length>=2,validEmail,subject.trim().length>=3,message.trim().length>=10].filter(Boolean).length;
  const draft=["Hello Visual Verse,","",...(topic?["Interested in: "+topic,""]:[]),message.trim()||"[Your message]","","Name: "+(name.trim()||"[Your name]"),"Reply to: "+(email.trim()||"[Your email]")].join("\n");
  function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    if(message.trim().length<10||subject.trim().length<3||name.trim().length<2)return;
    const submitter=(event.nativeEvent as SubmitEvent).submitter;
    if(submitter instanceof HTMLButtonElement&&submitter.value==="whatsapp"){
      window.location.href="https://wa.me/"+PHONE.replace(/\D/g,"")+"?text="+encodeURIComponent("Subject: "+subject.trim()+"\n\n"+draft);
    }else openMailDraft(subject.trim(),draft);
  }
  function selectTopic(value:string){
    const next=topic===value?"":value;
    if(subjectOverride===topic||subjectOverride==="")setSubjectOverride(null);
    onTopicChange(next);
  }
  return <>
    <style>{contactStyles}</style>
    <section className="vv-inner-section vv-inner-contact" id="send-a-message">
      <div className="vv-inner-contact-main">
        <div className="vv-inner-contact-copy">
          <SectionTitle eyebrow="LET'S CONNECT / FROM NAIROBI" description="A new idea, a big question or something still taking shape? Choose the channel that feels right for you.">Good things begin<br/><em>with a hello.</em></SectionTitle>
          <div className="vv-inner-contact-links">
            <a href={"mailto:"+EMAIL}><Mail size={24} aria-hidden="true"/><span><small>EMAIL US</small><strong>{EMAIL}</strong></span><ArrowUpRight size={16} aria-hidden="true"/></a>
            <a href={"tel:"+PHONE}><Phone size={24} aria-hidden="true"/><span><small>CALL US</small><strong>+254 794 044 598</strong></span><ArrowUpRight size={16} aria-hidden="true"/></a>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"><MessageCircle size={24} aria-hidden="true"/><span><small>WHATSAPP</small><strong>Start a chat</strong></span><ArrowUpRight size={16} aria-hidden="true"/></a>
            <a href="/request-quote.html"><FileText size={24} aria-hidden="true"/><span><small>PROJECT BRIEF</small><strong>Request a quote</strong></span><ArrowUpRight size={16} aria-hidden="true"/></a>
          </div>
          <div className="vv-contact-location"><MapPin size={30} aria-hidden="true"/><div><strong>Nairobi, Kenya</strong><p>Rooted in Kenya. Open to creative collaborations wherever your story takes us.</p></div></div>
          <div className="vv-contact-path"><strong>What happens after hello?</strong><ol><li><span><MessageCircle size={15}/></span><div><strong>We connect.</strong><p>Tell us your idea in your own words.</p></div></li><li><span><Sparkles size={15}/></span><div><strong>We explore.</strong><p>We discuss the possibilities, scope and direction.</p></div></li><li><span><Check size={15}/></span><div><strong>We align.</strong><p>Agree on a plan before the creative work begins.</p></div></li></ol></div>
        </div>
        <form className="vv-inner-form vv-inner-contact-form" onSubmit={submit}>
          <span className="vv-inner-eyebrow">SEND A SIGNAL / YOUR INQUIRY</span>
          <h3><EditorialText text="What can we create together?"/></h3>
          <fieldset className="vv-contact-topics">
            <legend>What are you interested in? (optional)</legend>
            <div className="vv-contact-topic-list">{topics.map(({title,Icon})=><button key={title} type="button" aria-pressed={topic===title} onClick={()=>selectTopic(title)}><Icon size={17} aria-hidden="true"/>{title}</button>)}</div>
          </fieldset>
          <div className="vv-inner-form-row">
            <label>Your name <input required minLength={2} value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" autoComplete="name"/></label>
            <label>Email address <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email"/></label>
          </div>
          <label>Subject <input required minLength={3} value={subject} onChange={e=>setSubjectOverride(e.target.value)} placeholder="What is this about?"/></label>
          <label>Message <textarea required minLength={10} maxLength={2000} rows={5} value={message} onChange={e=>setMessage(e.target.value)} placeholder="Tell us a little about your idea…"/><span className="vv-contact-count">{message.length} / 2000</span></label>
          <div className="vv-contact-meter"><div><span>SIGNAL READINESS</span><span>{completed} / 4 fields</span></div><div className="vv-contact-meter-track" role="progressbar" aria-label="Inquiry fields completed" aria-valuemin={0} aria-valuemax={4} aria-valuenow={completed}><span style={{width:completed*25+"%"}}/></div><small>{completed===4?"Ready to prepare your message.":"Complete your details to prepare your signal."}</small></div>
          <details className="vv-contact-preview"><summary>Preview your message</summary><pre>{"Subject: "+(subject||"[Your subject]")+"\n\n"+draft}</pre></details>
          <p>Choose email or WhatsApp to open a prepared message. Nothing is sent automatically.</p>
          <div className="vv-contact-send-actions"><button type="submit" name="channel" value="email" className="vv-motion-action vv-action-primary"><VisualVerseActionContent Icon={Send}>Prepare my email</VisualVerseActionContent></button><button type="submit" name="channel" value="whatsapp" className="vv-contact-whatsapp"><MessageCircle size={17} aria-hidden="true"/> Prepare WhatsApp</button></div>
        </form>
      </div>
    </section>
    <section className="vv-inner-section vv-inner-social-section">
      <SectionTitle eyebrow="FIND US OUT THERE" description="Follow the things we make, the stories we tell and the ideas we're exploring.">Stay in our <em>orbit.</em></SectionTitle>
      <div className="vv-inner-social-links">{SOCIAL_PROFILES.map(({name,url,Icon})=><a key={name} href={url} target="_blank" rel="noopener noreferrer" aria-label={name+" (opens in a new tab)"}><Icon size={26} aria-hidden="true"/>{name}<ArrowUpRight size={16} aria-hidden="true"/></a>)}</div>
      <p>For meetings, shoots and production sessions, let's agree on the time and location in advance.</p>
    </section>
  </>;
}

const budgets=["Not decided yet","Below KSh 15,000","KSh 15,000–50,000","KSh 50,000–100,000","KSh 100,000–250,000","Above KSh 250,000"];

function QuotePage(){
  const quoteParams=typeof window!=="undefined"?new URLSearchParams(window.location.search):new URLSearchParams();
  const requestedService=quoteParams.get("service")??"";
  const requestedAudience=quoteParams.get("audience")??"";
  // Card headings can be more descriptive than the canonical quote options.
  const serviceAliases:Record<string,string>={
    "Branding":"Branding & Identity",
    "Web & UI/UX":"Web & UI/UX Design",
    "Social Media":"Social Media & Digital Marketing"
  };
  const normalizedService=serviceAliases[requestedService]??requestedService;
  const initialService=services.some(item=>item.title===normalizedService)
    ? normalizedService
    : requestedService||requestedAudience ? "Several services / Other" : services[0].title;
  const [name,setName]=useState(""),[email,setEmail]=useState(""),[company,setCompany]=useState(""),[phone,setPhone]=useState(""),[service,setService]=useState(initialService),[budget,setBudget]=useState("Not decided yet"),[timeline,setTimeline]=useState(""),[description,setDescription]=useState("");
  function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    const body=["Hello Visual Verse,","I'd like to discuss a project quotation.","","YOUR INFORMATION","Name: "+name,"Email: "+email,"Phone: "+(phone||"Not provided"),"Company: "+(company||"Individual"),"","PROJECT DETAILS","Service: "+service,"Audience: "+(requestedAudience||"Not specified"),"Budget range: "+budget,"Timeline: "+(timeline||"To be discussed"),"","Brief: "+description,"","I can attach any relevant reference files to this email."].join("\n");
    openMailDraft("Visual Verse quote request — "+service,body);
  }
  return <>
    <section className="vv-inner-section vv-inner-quote-section" id="brief">
      <div className="vv-inner-contact-main vv-inner-quote-main">
        <div className="vv-inner-quote-copy">
          <SectionTitle eyebrow="LET'S PLAN IT / YOUR CREATIVE BRIEF" description="Every project has its own scope. Tell us enough to understand your idea, and we'll discuss a tailored proposal.">Good ideas <br/>begin<br/><em>with a <br className="vv-break-wide"/>brief.</em></SectionTitle>
          <div className="vv-inner-quote-guide">
            <div><span>01</span><strong>Tell us who you are</strong><p>A name and a way to reach you.</p></div>
            <div><span>02</span><strong>Describe the project</strong><p>What you need, why and by when.</p></div>
            <div><span>03</span><strong>Let's take it further</strong><p>We'll discuss the scope and next steps.</p></div>
          </div>
          <a className="vv-inner-text-link" href={"tel:"+PHONE}>Prefer to talk first? +254 794 044 598 <ArrowUpRight size={16}/></a>
        </div>
        <form className="vv-inner-form vv-inner-quote-form" onSubmit={submit}>
          <div className="vv-inner-form-section-title"><span>YOUR INFORMATION</span><h3>Who are we creating with?</h3></div>
          <div className="vv-inner-form-row">
            <label>Full name * <input required minLength={2} value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" autoComplete="name"/></label>
            <label>Email * <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email"/></label>
          </div>
          <div className="vv-inner-form-row">
            <label>Company / organisation <input value={company} onChange={e=>setCompany(e.target.value)} placeholder="Optional"/></label>
            <label>Phone / WhatsApp <input value={phone} onChange={e=>setPhone(e.target.value)} type="tel" placeholder="+254..." autoComplete="tel"/></label>
          </div>
          <div className="vv-inner-form-section-title"><span>PROJECT DETAILS</span><h3>What are you imagining?</h3></div>
          <label>Service needed * <select required value={service} onChange={e=>setService(e.target.value)}>{services.map(s=><option key={s.id} value={s.title}>{s.title}</option>)}<option>Several services / Other</option></select></label>
          <div className="vv-inner-form-row">
            <label>Budget range <select value={budget} onChange={e=>setBudget(e.target.value)}>{budgets.map(b=><option key={b}>{b}</option>)}</select></label>
            <label>Preferred timeline <input value={timeline} onChange={e=>setTimeline(e.target.value)} placeholder="e.g. next month"/></label>
          </div>
          {requestedAudience&&<p className="vv-inner-audience-context">Enquiring as: <strong>{requestedAudience}</strong></p>}
          <label>Tell us about the project * <textarea required minLength={15} rows={6} value={description} onChange={e=>setDescription(e.target.value)} placeholder="What are you working on, who is it for, and what would success look like?"/></label>
          <div className="vv-inner-file-note"><FileText size={20}/><span><strong>Need to share references?</strong> You can attach logos, moodboards or briefs to the email draft after opening it. Files can't be attached automatically from this form.</span></div>
          <p>Submitting opens your email application with the project brief filled in. No form submission is claimed until you send the email yourself.</p>
          <button type="submit" className="vv-motion-action vv-action-primary"><VisualVerseActionContent>Prepare my quote request</VisualVerseActionContent></button>
        </form>
      </div>
    </section>
  </>;
}

export function VisualVerseInnerPage({kind, AudiencePage}:{kind:Kind;AudiencePage?:ComponentType}){
  const [contactTopic,setContactTopic]=useState("");
  return <div className={kind==="contact"?"vv-inner-page vv-contact-experience":"vv-inner-page"}>
    <VisualVerseNavbar/>
    <main id="top">
      {kind==="contact"?<ContactSignalHero topic={contactTopic} onTopicChange={setContactTopic}/>:kind!=="about"&&kind!=="services"&&kind!=="audiences"&&<PageHero kind={kind}/>}
      {kind==="about"&&<VisualVerseAboutEditorial/>}
      {kind==="services"&&<ServicesPage/>}
      {kind==="audiences"&&AudiencePage&&<AudiencePage/>}
      {kind==="contact"&&<ContactPage topic={contactTopic} onTopicChange={setContactTopic}/>}
      {kind==="quote"&&<QuotePage/>}
      {kind!=="about"&&kind!=="audiences"&&<VisualVerseAboutCta/>}
    </main>
    <footer className="vv-close-footer-wrap"><VisualVerseFooter/></footer>
    <WhatsAppFloating/>
  </div>;
}

export function pageKind():Kind{
  const p=window.location.pathname;
  if(p.includes("about"))return "about";
  if(p.includes("who-we-serve"))return "audiences";
  if(p.includes("request-quote") || p === "/quote" || p === "/lets-talk")return "quote";
  if(p.includes("contact"))return "contact";
  return "services";
}
