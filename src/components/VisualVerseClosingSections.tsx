import { PolicyLinks } from "./VisualVersePolicies";
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

export { VisualVerseKenyaMap as VisualVerseWhereWeServe } from "./VisualVerseKenyaMap";

const CONTACT_EMAIL = "hello@visualverse.com";
const CONTACT_PHONE = "+254794044598";

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
        <span className="vv-close-eyebrow"><span/> FAQs / 007</span>
        <h2>Frequently Asked<br/>Questions.</h2>
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
          <a href={"tel:"+CONTACT_PHONE}><MapPin size={13} aria-hidden="true"/> +254 794 044 598</a>
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
  {label:"About",href:"/about.html"},
  {label:"Services",href:"/services.html"},
  {label:"Who We Serve",href:"/who-we-serve.html"},
  {label:"Portfolio",href:"/projects.html"},
  {label:"Contact",href:"/contact.html"},
  {label:"Request a Quote",href:"/request-quote.html"},
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
          <a className="vv-close-footer-email" href={"tel:"+CONTACT_PHONE}>+254 794 044 598 <ArrowUpRight size={15} aria-hidden="true"/></a>
          <a className="vv-close-footer-mini-cta" href="/#contact">Start a project <ArrowRight size={15} aria-hidden="true"/></a>
          <span className="vv-close-footer-availability"><CheckCircle2 size={14} aria-hidden="true"/> Available for project enquiries</span>
        </div>
      </div>
      <div className="vv-close-footer-bottom">
        <span>© {new Date().getFullYear()} VISUAL VERSE CREATIONS. ALL RIGHTS RESERVED.</span>
        <PolicyLinks />
        <a href="/#top">BACK TO TOP <ArrowUp size={14} aria-hidden="true"/></a>
      </div>
    </div>
  );
}
