import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowUpRight, Camera, Check, Clapperboard, ClipboardList, FileCheck2, Globe2, Image, Layers3, LayoutGrid, MapPin, MessageCircle, Minus, MonitorSmartphone, Palette, PenTool, Plus, ScanLine, Share2, Sparkles, Target, Telescope, Type, type LucideIcon } from "lucide-react";
import { serviceDetails, type ServiceId } from "./visual-verse-service-detail-content";
import { VisualVerseProcessJourney, ProcessArtwork } from "./VisualVerseProcessJourney";
import "../visual-verse-service-sections.css";

type ServiceLink = { id: ServiceId; name: string; image: string; position: string; href: string; Icon: LucideIcon; };
const icons: Record<ServiceId, readonly LucideIcon[]> = {
  photography:[ClipboardList,Camera,Image,ScanLine,Sparkles,FileCheck2],
  videography:[PenTool,ClipboardList,Clapperboard,Layers3,Palette,FileCheck2],
  "graphic-design":[PenTool,LayoutGrid,Type,Layers3,Palette,FileCheck2],
  "web-ui-ux":[Telescope,LayoutGrid,PenTool,MonitorSmartphone,Layers3,FileCheck2],
  "social-media":[Target,ClipboardList,Image,Share2,Globe2,ScanLine],
  branding:[Target,PenTool,Palette,Image,LayoutGrid,FileCheck2],
};
const processTitles:Record<ServiceId,string> = {
  photography:"From the first conversation to the final frame.",
  videography:"From the first idea to the final cut.",
  "graphic-design":"From a creative brief to artwork that works.",
  "web-ui-ux":"From the first wireframe to a better experience.",
  "social-media":"From strategy to content that keeps evolving.",
  branding:"From your story to an identity that lasts.",
};

function Kicker({children}:{children:React.ReactNode}) {
  return <span className="vv-sv-kicker"><i/><i/> {children}</span>;
}

function ServiceArtwork({service,step}:{service:ServiceLink;step:number}) {
  const data=serviceDetails[service.id];
  const Icon=step===0?MessageCircle:step===6?Sparkles:icons[service.id][step-1];
  const [title,line]=data.process[step];
  return <div className="vv-ds-process-art" aria-hidden="true">
    <div className="vv-ds-process-top"><span><i/> VISUAL VERSE / {service.name.toUpperCase()}</span><span>0{step+1} / 07</span></div>
    <div className="vv-ds-process-preview">
      <img src={service.image} alt="" style={{objectPosition:service.position}} loading="lazy"/>
      <div className="vv-ds-process-shade"/>
      <div className="vv-ds-process-info"><span><Icon size={20}/></span><strong>{title}</strong><p>{line}</p></div>
      <div className="vv-ds-process-status"><i/> {["DISCOVERY","PLANNING","DIRECTION","IN PRODUCTION","REFINEMENT","HANDOVER","WHAT'S NEXT"][step]}</div>
    </div>
    <div className="vv-ds-process-bottom">{data.process.map(([label],i)=><i key={label} className={i<=step?"is-current":""}/>)}</div>
  </div>;
}

export function VisualVerseServiceDetailSections({service,outcome,quoteHref,allServices}:{service:ServiceLink;outcome:string;quoteHref:string;allServices:readonly ServiceLink[]}) {
  const data=serviceDetails[service.id];
  const [checked,setChecked]=useState<number[]>([]);
  const [open,setOpen]=useState<number|null>(0);
  const root=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    if(!root.current || !("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add("vv-ds-enter");observer.unobserve(entry.target);}
    }),{threshold:.12});
    root.current.querySelectorAll(".vv-ds-reveal").forEach(el=>observer.observe(el));
    return ()=>observer.disconnect();
  },[]);
  const whatsappText="Hi Visual Verse! I'd like to discuss "+service.name+"."+ (checked.length?"\n\nHere is what sounds familiar:\n"+checked.map(i=>"• "+data.checks[i]).join("\n"):"");
  const related=data.related.map(id=>allServices.find(item=>item.id===id)!).filter(Boolean);
  const items=data.process.map(([title,line])=>({title,line}));
  const toggle=(i:number)=>setChecked(prev=>prev.includes(i)?prev.filter(v=>v!==i):[...prev,i].sort((a,b)=>a-b));
  return <div className="vv-ds" ref={root}>
    <section className="vv-ds-section vv-ds-deliver" aria-labelledby="vv-ds-deliver-title">
      <div className="vv-sv-container">
        <header className="vv-ds-heading vv-ds-reveal">
          <Kicker>WHAT YOU GET</Kicker>
          <h2 id="vv-ds-deliver-title">{outcome}</h2>
          <p>Every project is tailored to your goals. Here's what we can bring to yours.</p>
        </header>
        <div className="vv-ds-feature-grid">
          {data.deliverables.map(([title,description],i)=>{const Icon=icons[service.id][i];return <article className="vv-ds-feature vv-ds-reveal" key={title} style={{"--vv-ds-delay":(i%3)*85+"ms"} as CSSProperties}><span className="vv-ds-icon"><Icon size={23} strokeWidth={1.7}/></span><h3>{title}</h3><p>{description}</p></article>})}
        </div>
        <div className="vv-ds-check vv-ds-reveal">
          <div className="vv-ds-check-intro">
            <Kicker>QUICK CHECK</Kicker>
            <h2>Is {service.name.toLowerCase()} what you need?</h2>
            <p>Tick what sounds familiar. Let's find the right starting point together.</p>
            <div className="vv-ds-check-count" aria-live="polite"><strong>{checked.length}</strong> of {data.checks.length} selected</div>
            <div className="vv-ds-check-progress" role="progressbar" aria-label="Selected needs" aria-valuemin={0} aria-valuemax={data.checks.length} aria-valuenow={checked.length}><span style={{width:(checked.length/data.checks.length*100)+"%"}}/></div>
            <a className="vv-service-cta" href={"https://wa.me/254794044598?text="+encodeURIComponent(whatsappText)} target="_blank" rel="noopener noreferrer">Talk it through on WhatsApp <span><ArrowUpRight size={17}/></span></a>
          </div>
          <fieldset className="vv-ds-check-list"><legend className="vv-sp-sr-only">Select what sounds familiar</legend>{data.checks.map((item,i)=><label className={checked.includes(i)?"is-checked":""} key={item}><input type="checkbox" checked={checked.includes(i)} onChange={()=>toggle(i)}/><span className="vv-ds-tick"><Check size={15} strokeWidth={2.5}/></span><span>{item}</span></label>)}</fieldset>
        </div>
      </div>
    </section>
    <VisualVerseProcessJourney items={items} heading={processTitles[service.id]} quoteHref={quoteHref} artwork={step=>step===3?<ServiceArtwork service={service} step={step}/>:<ProcessArtwork step={step} context={{service:service.name,image:service.image,items,deliverables:data.deliverables.map(([title])=>title)}}/>}/>
    <section className="vv-ds-section vv-ds-details" aria-labelledby="vv-ds-details-title">
      <div className="vv-sv-container vv-ds-details-grid">
        <div className="vv-ds-heading vv-ds-reveal"><Kicker>THE DETAILS</Kicker><h2 id="vv-ds-details-title">The craft behind the work.</h2><p>{data.technical}</p><div className="vv-ds-tool-label">TOOLS & CAPABILITIES</div><div className="vv-ds-tools">{data.tools.map(t=><span key={t}>{t}</span>)}</div></div>
        <div className="vv-ds-location vv-ds-reveal"><div className="vv-ds-location-orbits" aria-hidden="true"><i/><i/><i/><i/></div><span className="vv-ds-location-icon"><MapPin size={26} strokeWidth={1.6}/></span><small>NAIROBI, KENYA · BEYOND BORDERS</small><h3>Based in Kenya.<br/>Creating for the world.</h3><p>Let's work wherever your story takes us. On location or remotely, depending on the project.</p><a href={import.meta.env.BASE_URL+"contact.html"}>Let's connect <ArrowUpRight size={17}/></a></div>
      </div>
    </section>
    <section className="vv-ds-section vv-ds-faq" aria-labelledby="vv-ds-faq-title">
      <div className="vv-sv-container">
        <header className="vv-ds-faq-heading vv-ds-reveal"><div className="vv-ds-heading"><Kicker>FREQUENTLY ASKED QUESTIONS</Kicker><h2 id="vv-ds-faq-title">A little more clarity.</h2></div><p>Still have a question? <a href={import.meta.env.BASE_URL+"contact.html"}>Let's talk <ArrowUpRight size={15}/></a></p></header>
        <div className="vv-ds-faq-list">{data.faq.map(([question,answer],i)=><article key={question} className={"vv-ds-faq-item"+(open===i?" is-open":"")}>
          <h3><button type="button" aria-expanded={open===i} aria-controls={"vv-ds-answer-"+i} onClick={()=>setOpen(open===i?null:i)}><span>{question}</span><span className="vv-ds-plus">{open===i?<Minus size={20}/>:<Plus size={20}/>}</span></button></h3>
          <div id={"vv-ds-answer-"+i} className="vv-ds-answer" aria-hidden={open!==i}><div><p>{answer}</p></div></div>
        </article>)}</div>
      </div>
    </section>
    <section className="vv-ds-section vv-ds-related" aria-labelledby="vv-ds-related-title">
      <div className="vv-sv-container"><header className="vv-ds-heading vv-ds-reveal"><Kicker>MORE POSSIBILITIES</Kicker><h2 id="vv-ds-related-title">Often built together.</h2><p>Pair complementary disciplines for a creative experience that feels connected.</p></header>
        <div className="vv-ds-related-grid">{related.map((item,i)=><a key={item.id} href={item.href} className="vv-ds-related-card vv-ds-reveal" style={{"--vv-ds-delay":i*85+"ms"} as CSSProperties}><div className="vv-ds-related-image"><img src={item.image} alt="" style={{objectPosition:item.position}} loading="lazy"/><span><item.Icon size={23}/></span></div><div className="vv-ds-related-name"><h3>{item.name}</h3><span><ArrowUpRight size={22}/></span></div></a>)}</div>
      </div>
    </section>
  </div>;
}
