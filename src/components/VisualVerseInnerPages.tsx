import { lazy, Suspense, useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRight, ArrowRight, Camera, Clapperboard, Palette, PenTool,
  MonitorSmartphone, Share2, Phone, Mail, MapPin, MessageCircle,
  Instagram, Linkedin, Facebook, CalendarDays, Rocket, Building2,
  Sparkles, UsersRound, Target, Film, FileText, Send
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { VisualVerseNavbar } from "./VisualVerseNavbar";
import { VisualVerseFooter } from "./VisualVerseClosingSections";
import { WhatsAppFloating } from "./VisualVersePolicies";
import { VisualVerseAboutCta } from "./VisualVerseAboutCta";

/* Load the heavier About, Services, and audience experiences only on the
   matching page. This also lets Vite split their page-specific CSS. */
const VisualVerseAboutEditorial = lazy(async () => ({
  default: (await import("./VisualVerseAboutEditorial")).VisualVerseAboutEditorial
}));
const VisualVerseServicesEditorial = lazy(async () => ({
  default: (await import("./VisualVerseServicesEditorial")).VisualVerseServicesEditorial
}));
const VisualVerseAudiences = lazy(async () => ({
  default: (await import("./VisualVerseAudiences")).VisualVerseAudiences
}));
const PageLoading = () => (
  <div role="status" aria-label="Loading page content"
    style={{minHeight:"60svh",background:"#f7fcfb"}} />
);


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
const services:Service[]=[
  {id:"photography",title:"Photography",label:"Visual storytelling",summary:"Preserving people, places and moments with intention—from portraits to milestone events.",deliverables:["Weddings, graduations & celebrations","Corporate, church & community events","Portraits and lifestyle photography","Product and brand imagery"],Icon:Camera},
  {id:"videography",title:"Videography",label:"Film & motion",summary:"Stories that move. From capturing the moment to editing the final frame.",deliverables:["Event films and highlight reels","Corporate and promotional videos","Documentary and interview production","Editing, color grading and motion graphics"],Icon:Clapperboard},
  {id:"graphic-design",title:"Graphic Design",label:"Digital & print",summary:"Design that communicates clearly, catches attention and connects with the right people.",deliverables:["Campaign and marketing graphics","Social media and digital assets","Print, editorial and event materials","Packaging and promotional collateral"],Icon:PenTool},
  {id:"web-ui-ux",title:"Web & UI/UX",label:"Digital experiences",summary:"Responsive websites and product interfaces created for useful, effortless experiences.",deliverables:["Website and landing page design","Mobile app screens and user flows","UI/UX research and wireframes","Interactive Figma prototypes"],Icon:MonitorSmartphone},
  {id:"social-media",title:"Social Media & Digital Marketing",label:"Campaigns & strategy",summary:"Creative content and joined-up campaigns designed to engage audiences and grow recognition.",deliverables:["Content planning and strategy","Social media creatives and campaigns","Digital marketing assets and copywriting","Performance-oriented creative iterations"],Icon:Share2},
  {id:"branding",title:"Branding",label:"Identity & direction",summary:"A consistent brand world built from the logo all the way to how it speaks and shows up.",deliverables:["Brand discovery and positioning","Logo and visual identity systems","Guidelines and brand applications","Rebrands and campaign direction"],Icon:Palette},
];

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
            <a href="/request-quote.html">Start a project <ArrowUpRight size={16} aria-hidden="true"/></a>
            <a href="/projects.html">Explore our work <ArrowRight size={16} aria-hidden="true"/></a>
          </div>
        </div>
        <div className="vv-inner-hero-art">
          <div className="vv-inner-hero-circles" aria-hidden="true"><i/><i/></div>
          <img src="/logo-mark.png" alt="Visual Verse logo mark"/>
          <span>VISUAL VERSE / IMAGINE. CREATE. CONNECT.</span>
        </div>
      </div>
      <div className="vv-inner-hero-bottom"><span>NAIROBI, KENYA · CREATIVE MEDIA STUDIO</span><span>SCROLL TO EXPLORE <ArrowRight size={14} style={{transform:"rotate(90deg)"}} aria-hidden="true"/></span></div>
    </section>
  );
}

function SectionTitle({eyebrow,children,description}:{eyebrow:string;children:React.ReactNode;description?:string}){
  return <header className="vv-inner-section-head"><span className="vv-inner-eyebrow">{eyebrow}</span><h2>{children}</h2>{description&&<p>{description}</p>}</header>;
}

function ServicesPage(){
  return <VisualVerseServicesEditorial/>;
}

type AudienceInfo={id:string;title:string;subtitle:string;challenge:string;outcome:string;deliverables:string[];Icon:LucideIcon;stat:string};
const industries:AudienceInfo[]=[
  {id:"brands",title:"Growing brands",subtitle:"From first impression to unmistakable identity",challenge:"A promising business needs a visual identity that feels coherent across every touchpoint.",outcome:"A recognizable look and voice that makes the brand easier to understand and remember.",deliverables:["Brand discovery","Visual identities","Brand applications","Campaign creative"],Icon:Sparkles,stat:"IDENTITY / CONTENT"},
  {id:"businesses",title:"Businesses & teams",subtitle:"Clear stories for established organisations",challenge:"Different departments, products and campaigns compete for attention without one creative direction.",outcome:"Joined-up design, video and digital communication that make complex offerings easier to see.",deliverables:["Corporate films","Marketing materials","Web experiences","Presentation systems"],Icon:Building2,stat:"STRATEGY / COMMUNICATION"},
  {id:"creators",title:"Creators & founders",subtitle:"Big thinking at the beginning of the journey",challenge:"The idea is exciting but the pitch, launch assets and online presence don't yet show its potential.",outcome:"A clear creative launch kit that gives the next chapter shape and personality.",deliverables:["Launch visuals","Personal branding","Portfolio websites","Content direction"],Icon:Rocket,stat:"IDEA / LAUNCH"},
  {id:"events",title:"People & events",subtitle:"The moments and people worth remembering",challenge:"A special day goes by quickly, and ordinary documentation can miss what made it meaningful.",outcome:"Photographs, films and printed keepsakes that help people revisit the feeling.",deliverables:["Event photography","Highlight films","Portrait sessions","Event design"],Icon:CalendarDays,stat:"PEOPLE / STORIES"},
];

function AudiencePage(){
  const [active,setActive]=useState(0);
  const selected=industries[active];
  return <>
    <section className="vv-inner-section vv-inner-audience-overview" id="who-we-serve"><VisualVerseAudiences/></section>
    <section className="vv-inner-section vv-industry-section" id="industries">
      <SectionTitle eyebrow="THE INDUSTRIES & PEOPLE WE CREATE WITH" description="Inspired by Potadot's interactive business-type approach, shaped around the stories Visual Verse helps tell.">See where your<br/><em>story fits.</em></SectionTitle>
      <div className="vv-industry-tabs" role="tablist" aria-label="Who Visual Verse serves">
        {industries.map(({title,Icon},i)=><button role="tab" key={title} type="button" id={"vv-industry-tab-"+i} aria-controls={"vv-industry-panel-"+i} aria-selected={i===active} onClick={()=>setActive(i)}><Icon size={17}/>{title}<span>{String(i+1).padStart(2,"0")}</span></button>)}
      </div>
      <div className="vv-industry-stage">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={selected.id} id={"vv-industry-panel-"+active} role="tabpanel" aria-labelledby={"vv-industry-tab-"+active} className="vv-industry-panel"
            initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-14}} transition={{duration:.26}}>
            <div className={"vv-industry-visual vv-industry-"+selected.id}>
              <div className="vv-industry-board">
                <div className="vv-industry-board-top"><span>VISUAL VERSE / {selected.stat}</span><selected.Icon size={22}/></div>
                <span className="vv-industry-board-kicker">CREATIVE POSSIBILITIES</span>
                <strong>{selected.subtitle}</strong>
                <div className="vv-industry-board-art">
                  {selected.id==="events"?<img src="/portfolio-graduations.jpg" loading="lazy" alt="Graduation photography from Visual Verse's original website"/>:selected.id==="businesses"?<img src="/portfolio-corporate-events.jpg" loading="lazy" alt="Corporate event photograph from the original Visual Verse website"/>:selected.id==="creators"?<img src="/portfolio-social-design.jpg" loading="lazy" alt="Graphic design work from the original Visual Verse website"/>:<img src="/logo-mark.png" loading="lazy" alt="Visual Verse identity mark"/>}
                </div>
                <span>MAKE SOMETHING MATTER <ArrowUpRight size={15} aria-hidden="true"/></span>
              </div>
            </div>
            <div className="vv-industry-copy">
              <span className="vv-inner-eyebrow">CREATIVE PARTNERSHIPS</span>
              <h3>{selected.title}</h3><p>{selected.subtitle}</p>
              <div className="vv-industry-before-after"><div><small>THE CHALLENGE</small><p>{selected.challenge}</p></div><div><small>WHAT WE CAN CREATE</small><p>{selected.outcome}</p></div></div>
              <span className="vv-industry-deliverable-label">RELEVANT SERVICES</span>
              <div className="vv-industry-tags">{selected.deliverables.map(d=><span key={d}>{d}</span>)}</div>
              <a className="vv-inner-text-link" href={"/request-quote.html?audience="+encodeURIComponent(selected.title)}>Let's tell your story <ArrowUpRight size={17}/></a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="vv-industry-note">Examples above show possible creative solutions, not claimed client results or completed commissions.</p>
    </section>
    <section className="vv-inner-section vv-inner-reasons">
      <SectionTitle eyebrow="HOW WE WORK TOGETHER">A flexible creative process,<br/><em>whatever your industry.</em></SectionTitle>
      <div className="vv-inner-reasons-grid">{[
        {title:"Listen to your world",text:"Understand your goals, audience and what makes this story different.",Icon:UsersRound},
        {title:"Shape the direction",text:"Define the right disciplines, deliverables and creative approach.",Icon:Target},
        {title:"Make it real",text:"Design, capture and refine work with you through each stage.",Icon:Sparkles}
      ].map((x,i)=><article key={x.title}><x.Icon size={22}/><small>0{i+1}</small><h3>{x.title}</h3><p>{x.text}</p></article>)}</div>
    </section>
  </>;
}

const socials=[
  {name:"Instagram",url:"https://www.instagram.com/visualverse.creations/",Icon:Instagram},
  {name:"LinkedIn",url:"https://www.linkedin.com/company/visualverse-creations",Icon:Linkedin},
  {name:"Facebook",url:"https://www.facebook.com/profile.php?id=61584634318128",Icon:Facebook}
];

function openMailDraft(subject:string,body:string){
  window.location.href="mailto:"+EMAIL+"?subject="+encodeURIComponent(subject)+"&body="+encodeURIComponent(body);
}

function ContactPage(){
  const [name,setName]=useState(""),[email,setEmail]=useState(""),[subject,setSubject]=useState(""),[message,setMessage]=useState("");
  function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    if(message.trim().length<10)return;
    openMailDraft(subject,["Hello Visual Verse,","",message,"","Name: "+name,"Reply to: "+email].join("\n"));
  }
  return <>
    <section className="vv-inner-section vv-inner-contact" id="send-a-message">
      <div className="vv-inner-contact-main">
        <div className="vv-inner-contact-copy">
          <SectionTitle eyebrow="LET'S CONNECT / FROM NAIROBI" description="Whether you're planning a campaign, an event or an entirely new brand, let's talk through it.">The first hello is<br/><em>the exciting part.</em></SectionTitle>
          <div className="vv-inner-contact-links">
            <a href={"mailto:"+EMAIL}><Mail size={20}/><span><small>EMAIL US</small><strong>{EMAIL}</strong></span><ArrowUpRight size={16}/></a>
            <a href={"tel:"+PHONE}><Phone size={20}/><span><small>CALL US</small><strong>+254 794 044 598</strong></span><ArrowUpRight size={16}/></a>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"><MessageCircle size={20}/><span><small>WHATSAPP</small><strong>Start a chat</strong></span><ArrowUpRight size={16}/></a>
            <div><MapPin size={20}/><span><small>BASED IN</small><strong>Nairobi, Kenya</strong></span></div>
          </div>
        </div>
        <form className="vv-inner-form vv-inner-contact-form" onSubmit={submit}>
          <span className="vv-inner-eyebrow">SEND US A MESSAGE</span>
          <h3>What can we create together?</h3>
          <label>Your name <input required minLength={2} value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" autoComplete="name"/></label>
          <label>Email address <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email"/></label>
          <label>Subject <input required minLength={3} value={subject} onChange={e=>setSubject(e.target.value)} placeholder="What is this about?"/></label>
          <label>Message <textarea required minLength={10} rows={5} value={message} onChange={e=>setMessage(e.target.value)} placeholder="Tell us a little about your idea…"/></label>
          <p>Submitting opens a prepared draft in your email application. Your message is not sent automatically.</p>
          <button type="submit">Prepare my email <Send size={17}/></button>
        </form>
      </div>
    </section>
    <section className="vv-inner-section vv-inner-social-section">
      <SectionTitle eyebrow="FIND US OUT THERE">Let's stay<br/><em>in the loop.</em></SectionTitle>
      <div className="vv-inner-social-links">{socials.map(({name,url,Icon})=><a key={name} href={url} target="_blank" rel="noopener noreferrer"><Icon size={23}/>{name}<ArrowUpRight size={16}/></a>)}</div>
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
    "Branding & Identity":"Branding",
    "Web & UI/UX Design":"Web & UI/UX"
  };
  const normalizedService=serviceAliases[requestedService]??requestedService;
  const initialService=services.some(item=>item.title===normalizedService)
    ? normalizedService
    : requestedService||requestedAudience ? "Several services / Other" : "Photography";
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
          <SectionTitle eyebrow="LET'S PLAN IT / YOUR CREATIVE BRIEF" description="Every project has its own scope. Tell us enough to understand your idea, and we'll discuss a tailored proposal.">Good ideas begin<br/><em>with a brief.</em></SectionTitle>
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
          <button type="submit">Prepare my quote request <ArrowUpRight size={18}/></button>
        </form>
      </div>
    </section>
  </>;
}

export function VisualVerseInnerPage({kind}:{kind:Kind}){
  useEffect(()=>{
    const p=window.location.hash.slice(1);
    if(!p)return;
    const t=window.requestAnimationFrame(()=>document.getElementById(p)?.scrollIntoView({block:"start"}));
    return ()=>window.cancelAnimationFrame(t);
  },[kind]);
  return <div className="vv-inner-page">
    <VisualVerseNavbar/>
    <main id="top">
      {kind!=="about"&&kind!=="services"&&<PageHero kind={kind}/>}
      {kind==="about"&&<Suspense fallback={<PageLoading/>}><VisualVerseAboutEditorial/></Suspense>}
      {kind==="services"&&<Suspense fallback={<PageLoading/>}><ServicesPage/></Suspense>}
      {kind==="audiences"&&<Suspense fallback={<PageLoading/>}><AudiencePage/></Suspense>}
      {kind==="contact"&&<ContactPage/>}
      {kind==="quote"&&<QuotePage/>}
      {kind!=="about"&&<VisualVerseAboutCta/>}
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
