import { useState, type FormEvent } from "react";
import { ArrowUpRight, ArrowRight, Phone, Mail, MapPin, MessageCircle, CheckCircle2 } from "lucide-react";
import { VisualVerseNavbar } from "./VisualVerseNavbar";
import { VisualVerseFooter } from "./VisualVerseClosingSections";
import { VisualVerseServices } from "./VisualVerseServices";
import { VisualVerseAudiences } from "./VisualVerseAudiences";
import { WhatsAppFloating } from "./VisualVersePolicies";

type Kind="about"|"services"|"audiences"|"contact"|"quote";
const pages:Record<Kind,{eyebrow:string;first:string;accent:string;description:string}>={
  about:{eyebrow:"THE STORY BEHIND THE STUDIO",first:"Good ideas deserve",accent:"great stories.",description:"We bring design, photography, film and digital thinking together to turn bold ideas into work people feel and remember."},
  services:{eyebrow:"WHAT WE DO",first:"Big vision.",accent:"Many ways to create.",description:"Six connected creative disciplines, one purpose: make your story stand out across every screen, space and moment."},
  audiences:{eyebrow:"WHO WE CREATE WITH",first:"For every next",accent:"big thing.",description:"From ambitious brands to founders, teams and meaningful personal milestones: creativity designed around real people."},
  contact:{eyebrow:"LET'S TALK",first:"Have something",accent:"in mind?",description:"A simple hello can start something brilliant. Share your idea, ask a question, or tell us what you're building."},
  quote:{eyebrow:"START A PROJECT",first:"Tell us what you're",accent:"dreaming up.",description:"Give us a few details about your project. We'll take it from there together."}
};
function PageIntro({kind}:{kind:Kind}){
 const page=pages[kind];
 return <section className="vv-inner-hero"><div className="vv-inner-hero-inner"><div>
  <span className="vv-inner-eyebrow">{page.eyebrow} / VISUAL VERSE</span>
  <h1>{page.first}<br/><em>{page.accent}</em></h1><p>{page.description}</p>
  <div className="vv-inner-hero-actions"><a href="/request-quote.html">Start a project <ArrowUpRight size={17}/></a><a href="/projects.html">See our work <ArrowRight size={17}/></a></div>
 </div><div className="vv-inner-hero-art"><img src="/logo-mark.png" alt="Visual Verse favicon"/><span>IDEAS · DESIGN · STORIES · IMPACT</span></div></div></section>;
}
function About(){
 return <section className="vv-inner-section"><span className="vv-inner-eyebrow">OUR CREATIVE POINT OF VIEW</span><h2>One studio. An entire world of creative possibilities.</h2>
  <div className="vv-inner-split"><div><p>Visual Verse is where photography, film, design and digital experiences meet. We work with you to bring shape, personality and purpose to the ideas you want to put into the world.</p><p>We listen first, create with intention and care about the details. We believe every story can be told beautifully when the right people and ideas come together.</p></div><div className="vv-inner-about-img"><img src="/about-photographer.webp" loading="lazy" alt="Photographer holding a camera and looking through the lens"/></div></div>
  <div className="vv-inner-values">{[["01","Listen first","Your goals shape the brief."],["02","Think creatively","Clear ideas, bold execution."],["03","Build together","You stay part of the process."]].map(x=><article key={x[0]}><small>{x[0]}</small><h3>{x[1]}</h3><p>{x[2]}</p></article>)}</div>
 </section>;
}
function Contact(){
 return <section className="vv-inner-section vv-inner-split"><div><span className="vv-inner-eyebrow">LET'S CONNECT</span><h2>Every story starts somewhere.</h2><p>Tell us what you're working on and we'll talk through the best approach.</p>
 <div className="vv-inner-contact-links"><a href="tel:+254794044598"><Phone/> +254 794 044 598</a><a href="mailto:hello@visualverse.com"><Mail/> hello@visualverse.com</a><a href="https://wa.me/254794044598" target="_blank" rel="noopener noreferrer"><MessageCircle/> WhatsApp us</a><span><MapPin/> Nairobi, Kenya</span></div></div>
 <div className="vv-inner-contact-panel"><span>PROJECTS / COLLABORATIONS / ENQUIRIES</span><h3>Good things begin with hello.</h3><p>Start a conversation or send us the essentials for your next project.</p><a href="/request-quote.html">Request a project quote <ArrowUpRight size={19}/></a></div></section>;
}
function Quote(){
 const [name,setName]=useState(""),[email,setEmail]=useState(""),[service,setService]=useState("Branding"),[timeline,setTimeline]=useState(""),[budget,setBudget]=useState(""),[message,setMessage]=useState("");
 function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();
  const lines=["Hello Visual Verse,","", "Name: "+name,"Email: "+email,"Service: "+service,"Timeline: "+(timeline||"To discuss"),"Budget: "+(budget||"To discuss"),"",message,"","Please advise on the next steps."];
  window.location.href="mailto:hello@visualverse.com?subject="+encodeURIComponent("Visual Verse project enquiry: "+service)+"&body="+encodeURIComponent(lines.join("\n"));
 }
 return <section className="vv-inner-section vv-inner-split"><div><span className="vv-inner-eyebrow">CREATIVE BRIEF / A STARTING POINT</span><h2>Let's make the idea real.</h2><p>Tell us a little about your goals, preferred service, budget and timeline. This form prepares an email draft rather than sending your data to a server.</p><div className="vv-inner-checks"><span><CheckCircle2/> Collaborative project planning</span><span><CheckCircle2/> Clear scope and milestones</span><span><CheckCircle2/> Thoughtful creative direction</span></div></div>
  <form className="vv-inner-form" onSubmit={submit}>
   <label>Your name<input required value={name} onChange={e=>setName(e.target.value)} placeholder="Full name"/></label>
   <label>Email<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label>
   <label>Service<select value={service} onChange={e=>setService(e.target.value)}>{["Branding","Graphic Design","Photography","Videography","Web & UI/UX","Social Media & Digital Marketing","Multiple services","Other"].map(x=><option key={x}>{x}</option>)}</select></label>
   <label>Timeline<input value={timeline} onChange={e=>setTimeline(e.target.value)} placeholder="e.g. next month"/></label>
   <label>Indicative budget (optional)<input value={budget} onChange={e=>setBudget(e.target.value)} placeholder="e.g. KSh 50,000"/></label>
   <label>Project brief<textarea rows={4} value={message} onChange={e=>setMessage(e.target.value)} placeholder="What are you imagining?"/></label>
   <button type="submit">Open my email draft <ArrowUpRight size={18}/></button>
  </form></section>;
}
export function VisualVerseInnerPage({kind}:{kind:Kind}){
 return <div className="vv-inner-page"><VisualVerseNavbar/><main id="top"><PageIntro kind={kind}/>
 {kind==="about"&&<About/>}
 {kind==="services"&&<section className="vv-inner-section" id="services"><VisualVerseServices/></section>}
 {kind==="audiences"&&<section className="vv-inner-section" id="who-we-serve"><VisualVerseAudiences/></section>}
 {kind==="contact"&&<Contact/>}
 {kind==="quote"&&<Quote/>}
 <section className="vv-inner-bottom"><span>VISUAL VERSE / READY WHEN YOU ARE</span><h2>Let's make something<br/>worth remembering.</h2><a href="/contact.html">Let's talk <ArrowUpRight size={18}/></a></section></main>
 <footer className="vv-close-footer-wrap"><VisualVerseFooter/></footer><WhatsAppFloating/></div>;
}
export function pageKind():Kind{
 const p=window.location.pathname;
 if(p.includes("about"))return "about";
 if(p.includes("who-we-serve"))return "audiences";
 if(p.includes("request-quote"))return "quote";
 if(p.includes("contact"))return "contact";
 return "services";
}
