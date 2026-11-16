import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowUpRight, Camera, Check, Clapperboard, ClipboardList, FileCheck2, Globe2, Image, Layers3, LayoutGrid, MapPin, MessageCircle, Minus, MonitorSmartphone, Palette, PenTool, Plus, ScanLine, Share2, Sparkles, Target, Telescope, Type, type LucideIcon } from "lucide-react";
import { serviceDetails, type ServiceId } from "./visual-verse-service-detail-content";
import { VisualVerseProcessJourney } from "./VisualVerseProcessJourney";
import { ProcessStoryArt } from "./VisualVerseProcessStories";
import "../visual-verse-service-sections.css";
import { VisualVerseActionContent } from "./VisualVerseAction";

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
  const related=allServices.filter(item=>data.related.includes(item.id));
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
          {data.deliverables.map(([title,description],i)=>{const Icon=icons[service.id][i];return <article className="vv-ds-feature vv-ds-reveal" key={title} style={{"--vv-ds-delay":(i%3)*85+"ms"} as CSSProperties}><Icon className="vv-ds-watermark" aria-hidden="true" strokeWidth={.8}/><span className="vv-ds-icon"><Icon size={23} strokeWidth={1.7}/></span><h3>{title}</h3><p>{description}</p></article>})}
        </div>
        <div className="vv-ds-check vv-ds-reveal" data-complete={checked.length===data.checks.length}>
          <div className="vv-ds-check-intro">
            <Kicker>QUICK CHECK</Kicker>
            <h2>Is {service.name.toLowerCase()} what you need?</h2>
            <p>Tick what sounds familiar. Let's find the right starting point together.</p>
            <div className="vv-ds-check-meter"><div className="vv-ds-check-ring" aria-hidden="true"><svg viewBox="0 0 88 88"><circle cx="44" cy="44" r="37"/><circle cx="44" cy="44" r="37" className="vv-ds-ring-fill" pathLength="100" strokeDasharray={checked.length/data.checks.length*100+" 100"}/></svg><span key={checked.length}>{checked.length===data.checks.length?<Sparkles size={24}/>:checked.length+"/"+data.checks.length}</span></div><div><div className="vv-ds-check-count" aria-live="polite"><strong>{checked.length}</strong> of {data.checks.length} selected</div><span className="vv-ds-check-message" key={checked.length}>{checked.length===0?"Your creative brief starts here.":checked.length===data.checks.length?"You're all set — let's create!":checked.length<3?"Great start! Keep exploring.":"Your brief is coming to life."}</span></div></div>
            <div className="vv-ds-check-progress" role="progressbar" aria-label="Selected needs" aria-valuemin={0} aria-valuemax={data.checks.length} aria-valuenow={checked.length}>{data.checks.map((_,i)=><span className={i<checked.length?"is-lit":""} key={i}/>)}</div>
            <a className="vv-motion-action vv-action-primary" href={"https://wa.me/254794044598?text="+encodeURIComponent(whatsappText)} target="_blank" rel="noopener noreferrer"><VisualVerseActionContent>Talk it through on WhatsApp</VisualVerseActionContent></a>
          </div>
          <fieldset className="vv-ds-check-list"><legend className="vv-sp-sr-only">Select what sounds familiar</legend>{data.checks.map((item,i)=><label className={checked.includes(i)?"is-checked":""} key={item}><input type="checkbox" checked={checked.includes(i)} onChange={()=>toggle(i)}/><span className="vv-ds-tick"><Check size={15} strokeWidth={2.5}/></span><span>{item}</span><span className="vv-ds-check-index" aria-hidden="true">0{i+1}</span></label>)}</fieldset>
        </div>
      </div>
    </section>
    <VisualVerseProcessJourney items={items} heading={processTitles[service.id]} quoteHref={quoteHref} artwork={step=><ProcessStoryArt kind={service.id} step={step}/> }/>
    <section className="vv-ds-section vv-ds-details" aria-labelledby="vv-ds-details-title">
      <div className="vv-sv-container vv-ds-details-grid">
        <div className="vv-ds-heading vv-ds-reveal"><Kicker>THE DETAILS</Kicker><h2 id="vv-ds-details-title">The craft behind the work.</h2><p>{data.technical}</p><div className="vv-ds-tool-label">TOOLS & CAPABILITIES</div><div className="vv-ds-tools">{data.tools.map((t,i)=>{const Icon=icons[service.id][i%6];return <span key={t}><Icon size={20}/><span>{t}</span><i aria-hidden="true"/></span>})}</div></div>
        <div className="vv-ds-location vv-ds-reveal"><div className="vv-ds-location-orbits" aria-hidden="true"><i/><i/><i/><i/><b/><b/></div><Globe2 className="vv-ds-location-globe" aria-hidden="true" strokeWidth={.6}/><span className="vv-ds-location-icon"><MapPin size={26} strokeWidth={1.6}/></span><small>NAIROBI, KENYA · BEYOND BORDERS</small><h3>Based in Kenya.<br/>Creating for the world.</h3><p>Let's work wherever your story takes us. On location or remotely, depending on the project.</p><a className="vv-motion-action vv-action-on-dark" href={import.meta.env.BASE_URL+"contact.html"}><VisualVerseActionContent>Let's connect</VisualVerseActionContent></a></div>
      </div>
    </section>
    <section className="vv-ds-section vv-ds-faq" aria-labelledby="vv-ds-faq-title">
      <div className="vv-sv-container">
        <header className="vv-ds-faq-heading vv-ds-reveal"><div className="vv-ds-heading"><Kicker>FREQUENTLY ASKED QUESTIONS</Kicker><h2 id="vv-ds-faq-title">A little more clarity.</h2></div><p>Still have a question? <a href={import.meta.env.BASE_URL+"contact.html"}>Let's talk <ArrowUpRight size={15}/></a></p></header>
        <div className="vv-ds-faq-list">{data.faq.map(([question,answer],i)=><article key={question} className={"vv-ds-faq-item"+(open===i?" is-open":"")}>
          <h3><button type="button" aria-expanded={open===i} aria-controls={"vv-ds-answer-"+i} onClick={()=>setOpen(open===i?null:i)}><span className="vv-ds-faq-index" aria-hidden="true">0{i+1}</span><span>{question}</span><span className="vv-ds-plus">{open===i?<Minus size={20}/>:<Plus size={20}/>}</span></button></h3>
          <div id={"vv-ds-answer-"+i} className="vv-ds-answer" aria-hidden={open!==i}><div><p>{answer}</p></div></div>
        </article>)}</div>
      </div>
    </section>
    <section className="vv-ds-section vv-ds-related" aria-labelledby="vv-ds-related-title">
      <div className="vv-sv-container"><header className="vv-ds-heading vv-ds-reveal"><Kicker>MORE POSSIBILITIES</Kicker><h2 id="vv-ds-related-title">Often built together.</h2><p>Pair complementary disciplines for a creative experience that feels connected.</p></header>
        <div className="vv-ds-related-grid">{related.map((item,i)=><a key={item.id} href={item.href} className="vv-ds-related-card vv-ds-reveal" style={{"--vv-ds-delay":i*85+"ms"} as CSSProperties}><div className="vv-ds-related-image"><img src={item.image} alt="" style={{objectPosition:item.position}} loading="lazy"/><span><item.Icon size={23}/></span></div><div className="vv-ds-related-name"><h3>{item.name}</h3><span><ArrowUpRight size={22}/></span></div></a>)}</div>
        <div className="vv-ds-more"><a className="vv-motion-action vv-action-primary" href={import.meta.env.BASE_URL+"services.html#services"}><VisualVerseActionContent>Explore all services</VisualVerseActionContent></a></div>
      </div>
    </section>
  </div>;
}
