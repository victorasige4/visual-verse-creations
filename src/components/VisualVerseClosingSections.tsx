import { PolicyLinks } from "./VisualVersePolicies";
import {
  ArrowRight, ArrowUpRight, CheckCircle2, Mail,
  MapPin, ArrowUp
} from "lucide-react";

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

/** Shared FAQ experience used on Home and About. */
export { VisualVerseFaqLab as VisualVerseFaq } from "./VisualVerseFaqLab";

export function VisualVerseCTA(){
  return (
    <div className="vv-close-cta">
      <div className="vv-close-cta-content">
        <span className="vv-close-cta-eyebrow"><i aria-hidden="true"/> LET'S MAKE SOMETHING MATTER</span>
        <h2>Have an idea<br/>worth bringing<br/>to <em>life?</em></h2>
        <p>From your first concept to the final frame, let's create something people remember.</p>
        <div className="vv-close-cta-buttons">
          <a href="/request-quote.html" className="vv-close-cta-primary">Let's talk <span><ArrowUpRight size={18} aria-hidden="true"/></span></a>
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
  {label:"Photography",href:"/services.html#details-photography"},
  {label:"Videography",href:"/services.html#details-videography"},
  {label:"Branding",href:"/services.html#details-branding"},
  {label:"Graphic Design",href:"/services.html#details-graphic-design"},
  {label:"Web & UI/UX",href:"/services.html#details-web-ui-ux"},
  {label:"Social Media",href:"/services.html#details-social-media"},
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
          <a className="vv-close-footer-mini-cta" href="/request-quote.html">Start a project <ArrowRight size={15} aria-hidden="true"/></a>
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
