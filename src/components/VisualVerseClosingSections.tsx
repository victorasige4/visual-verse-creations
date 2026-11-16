import { VisualVerseActionContent } from "./VisualVerseAction";
import { PolicyLinks } from "./VisualVersePolicies";
import { VisualVerseAboutCta } from "./VisualVerseAboutCta";
import { Boxes } from "./ui/background-boxes";
import {
  ArrowRight, ArrowUpRight, CheckCircle2, Mail,
  MapPin, ArrowUp, Linkedin, Instagram, Facebook, Youtube
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

function TikTokIcon(){
  return <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M14.5 2h3c.25 2.16 1.6 4.02 4.5 4.35v3.02a8.1 8.1 0 0 1-4.5-1.58v8.34a6.25 6.25 0 1 1-6.25-6.25c.4 0 .79.04 1.17.11v3.09a3.25 3.25 0 1 0 2.08 3.05V2Z"/></svg>;
}

const footerSocials=[
  {name:"LinkedIn",url:"https://www.linkedin.com/company/visualverse-creations",Icon:Linkedin},
  {name:"Instagram",url:null,Icon:Instagram},
  {name:"Facebook",url:"https://www.facebook.com/profile.php?id=61596655380659",Icon:Facebook},
  {name:"TikTok",url:null,Icon:TikTokIcon},
  {name:"YouTube",url:null,Icon:Youtube},
];

function FooterSocials(){
  return <div className="vv-footer-socials">
    <span className="vv-footer-socials-label">FOLLOW US</span>
    <nav className="vv-footer-socials-row" aria-label="Visual Verse social media">
      {footerSocials.map(({name,url,Icon})=>url
        ? <a key={name} href={url} target="_blank" rel="noopener noreferrer" aria-label={name+" (opens in a new tab)"} title={name}><Icon aria-hidden="true"/></a>
        : <span key={name} className="vv-social-pending" role="img" aria-label={name+" — link coming soon"} title={name+" — link coming soon"}><Icon aria-hidden="true"/></span>
      )}
    </nav>
  </div>;
}

/** Shared FAQ experience used on Home and About. */
export { VisualVerseFaqLab as VisualVerseFaq } from "./VisualVerseFaqLab";

export function VisualVerseCTA(){
  return <VisualVerseAboutCta/>;
}

const serviceLinks=[
  {label:"Photography",href:"/services.html?service=photography"},
  {label:"Videography",href:"/services.html?service=videography"},
  {label:"Branding",href:"/services.html?service=branding"},
  {label:"Graphic Design",href:"/services.html?service=graphic-design"},
  {label:"Web & UI/UX",href:"/services.html?service=web-ui-ux"},
  {label:"Social Media",href:"/services.html?service=social-media"},
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
