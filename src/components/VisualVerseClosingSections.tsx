import { SERVICE_CATALOG } from "../data/services";
import { SOCIAL_PROFILES } from "../data/socials";
import { VisualVerseActionContent } from "./VisualVerseAction";
import { PolicyLinks } from "./VisualVersePolicies";
import { VisualVerseAboutCta } from "./VisualVerseAboutCta";
import { Boxes } from "./ui/background-boxes";
import {
  ArrowRight, ArrowUpRight, CheckCircle2, Mail,
  MapPin, ArrowUp
} from "lucide-react";

const creativeWords = [
  ...SERVICE_CATALOG.map(service=>service.name), "Marketing", "User Experience", "Interaction Design", "Logos",
  "Motion Graphics", "Art Direction", "UX Research", "Content Strategy", "Digital Campaigns",
  "Visual Storytelling", "Creative Strategy", "Illustration", "Video Editing"
];

export function VisualVerseMarquee() {
  const renderWords = (prefix: string) => creativeWords.map((word, index) => (
    <span className="vv-close-marquee-word" key={prefix + index}>
      {word}
      <svg className="vv-close-marquee-separator" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none">
        <path d="M12 2.75v18.5M2.75 12h18.5M5.46 5.46l13.08 13.08M18.54 5.46 5.46 18.54" stroke="currentColor" strokeWidth="3.25" strokeLinecap="round"/>
      </svg>
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

function FooterSocials(){
  return <div className="vv-footer-socials">
    <span className="vv-footer-socials-label">FOLLOW US</span>
    <nav className="vv-footer-socials-row" aria-label="Visual Verse social media">
      {SOCIAL_PROFILES.map(({name,url,Icon})=>
        <a key={name} href={url} target="_blank" rel="noopener noreferrer" aria-label={name+" (opens in a new tab)"} title={name}><Icon aria-hidden="true"/></a>
      )}
    </nav>
  </div>;
}

/** Shared FAQ experience used on Home and About. */
export { VisualVerseFaqLab as VisualVerseFaq } from "./VisualVerseFaqLab";

export function VisualVerseCTA(){
  return <VisualVerseAboutCta/>;
}

const serviceLinks=SERVICE_CATALOG.map(({id,name})=>({label:name,href:"/services.html?service="+id}));
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
      <Boxes className="vv-footer-boxes" />
      <img className="vv-close-footer-watermark" src="/logo-mark.png" alt="" aria-hidden="true" loading="lazy"/>
      <div className="vv-close-footer-grid">
        <div className="vv-close-footer-about">
          <a className="vv-close-footer-brand" href="/#top" aria-label="Visual Verse Creations, back to home">
            <img src="/brand-logo.png" alt="Visual Verse Creations" loading="lazy"/>
          </a>
          <p>Thoughtful design. Lasting stories. A creative company bringing ideas to life through imagery, identity and digital experiences.</p>
          <span className="vv-close-footer-location"><MapPin size={15} aria-hidden="true"/> Based in Nairobi, Kenya</span>
          <FooterSocials/>
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
          <a className="vv-close-footer-mini-cta vv-motion-action vv-action-on-dark" href="/request-quote.html"><VisualVerseActionContent Icon={ArrowRight}>Start a project</VisualVerseActionContent></a>
          <span className="vv-close-footer-availability"><CheckCircle2 size={14} aria-hidden="true"/> Available for project enquiries</span>
        </div>
      </div>
      <div className="vv-close-footer-bottom">
        <span>© {new Date().getFullYear()} VISUAL VERSE CREATIONS. ALL RIGHTS RESERVED.</span>
        <PolicyLinks />
        <a className="vv-studio-console-link" href="/console/" aria-label="Open the private Visual Verse Console">Visual Verse Console <ArrowUpRight size={13} aria-hidden="true"/></a>
        <a href="/#top">BACK TO TOP <ArrowUp size={14} aria-hidden="true"/></a>
      </div>
    </div>
  );
}
