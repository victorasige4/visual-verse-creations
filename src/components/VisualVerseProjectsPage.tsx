import { useEffect, useState } from "react";
import { ArrowUpRight, ArrowRight, Check, FolderOpen, Image as ImageIcon, Camera, Clapperboard, PenTool, MonitorSmartphone, Share2, Palette } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PortfolioArtwork } from "@/components/VisualVersePortfolio";
import type { PortfolioCollection } from "@/components/VisualVersePortfolio";
import { VisualVerseNavbar } from "@/components/VisualVerseNavbar";
import { WhatsAppFloating } from "@/components/VisualVersePolicies";
import { VisualVerseFooter } from "@/components/VisualVerseClosingSections";
import { VisualVerseAboutCta } from "@/components/VisualVerseAboutCta";

type ProjectCategory={
 id:string;name:string;short:string;number:string;headline:string;description:string;
 services:string[];Icon:LucideIcon;photo?:string;art?:PortfolioCollection["id"];
};
const categories:ProjectCategory[]=[
  {id:"photography",name:"Photography",short:"Photography",number:"01",headline:"The moments that matter.",description:"Portraits, graduations, corporate functions, celebrations and stories captured with care.",services:["Portraits & lifestyle","Graduations and celebrations","Corporate and event photography","Creative image editing"],Icon:Camera,photo:"/portfolio-graduations.jpg"},
  {id:"videography",name:"Videography",short:"Videography",number:"02",headline:"Give the story motion.",description:"Cinematic storytelling, productions, coverage and editing that carry the feeling into every frame.",services:["Corporate and event films","Interviews & documentaries","Editing and color","Promotional video storytelling"],Icon:Clapperboard,photo:"/portfolio-event-story.jpg"},
  {id:"graphic-design",name:"Graphic Design",short:"Graphic Design",number:"03",headline:"Design with a voice.",description:"Communication that catches the eye and makes the message impossible to miss.",services:["Campaign graphics","Social media creative","Posters and print collateral","Illustrations and compositions"],Icon:PenTool,photo:"/portfolio-social-design.jpg"},
  {id:"web-ui-ux",name:"Web & UI/UX",short:"Web & UI/UX",number:"04",headline:"Every pixel with a purpose.",description:"Responsive sites, product interfaces and interactions that make digital experiences feel natural.",services:["Website design","UI/UX flows and research","Responsive layouts","Interactive prototypes"],Icon:MonitorSmartphone,art:"digital"},
  {id:"social-media",name:"Social Media & Digital Marketing",short:"Social Media",number:"05",headline:"Ideas built to travel.",description:"Creative campaigns, posts and stories designed for connection across channels.",services:["Content strategy","Campaign creative","Social media design","Video and motion content"],Icon:Share2,art:"campaigns"},
  {id:"branding",name:"Branding & Identity",short:"Branding",number:"06",headline:"An identity worth recognising.",description:"Distinctive marks and thoughtful brand systems built around a clear story.",services:["Brand identity","Logos & typography","Brand applications","Guidelines and campaigns"],Icon:Palette,art:"branding"}
];
const archive=[
  {image:"/portfolio-corporate-events.jpg",alt:"Corporate gathering from the original Visual Verse image archive",tag:"CORPORATE EVENTS"},
  {image:"/portfolio-graduations.jpg",alt:"Graduation photograph from the original Visual Verse image archive",tag:"GRADUATION MOMENTS"},
  {image:"/portfolio-corporate-moment.jpg",alt:"Event photograph from the original Visual Verse image archive",tag:"VISUAL STORIES"},
  {image:"/portfolio-event-detail.jpg",alt:"Documentary event photography from the original Visual Verse image archive",tag:"EVENT DETAILS"}
];

function CategoryVisual({category}:{category:ProjectCategory}){
  if(category.photo)return <img src={category.photo} alt={category.name+" example from the original Visual Verse site"} loading="lazy" decoding="async"/>;
  return <PortfolioArtwork kind={category.art??"digital"}/>;
}

export function VisualVerseProjectsPage(){
  const [filter,setFilter]=useState("all");
  useEffect(()=>{
    function scrollToHash(){
      const id=decodeURIComponent(window.location.hash.slice(1));
      if(id){
        const alias:{[k:string]:string}={digital:"web-ui-ux",campaigns:"social-media"};
        window.requestAnimationFrame(()=>document.getElementById(alias[id]??id)?.scrollIntoView({block:"start"}));
      }
    }
    scrollToHash();
    window.addEventListener("hashchange",scrollToHash);
    return ()=>window.removeEventListener("hashchange",scrollToHash);
  },[]);
  const displayed=filter==="all"?categories:categories.filter(x=>x.id===filter);
  return (
    <div className="vv-projects-page vv-projects-v2">
      <VisualVerseNavbar/>
      <main id="top">
        <section className="vv-projects-hero">
          <div className="vv-projects-hero-top">
            <span className="vv-projects-kicker"><FolderOpen size={16} aria-hidden="true"/> OUR PORTFOLIO / CREATIVE COLLECTIONS</span>
            <span className="vv-projects-index">SIX DISCIPLINES / INFINITE IDEAS</span>
          </div>
          <div className="vv-projects-hero-bottom">
            <div><h1>Every story,<br/><em>a different canvas.</em></h1>
              <p>A gallery of the directions we explore—from moments behind the lens to brands, campaigns and digital experiences.</p>
              <div className="vv-projects-hero-cta"><a href="#vv-projects-gallery">Explore categories <ArrowRight size={16}/></a><a href="/request-quote.html">Start a project <ArrowUpRight size={16}/></a></div>
            </div>
            <span className="vv-projects-hero-mark" aria-hidden="true"><img src="/logo-mark.png" alt=""/></span>
          </div>
        </section>

        <section className="vv-projects-gallery-section" id="vv-projects-gallery">
          <div className="vv-projects-gallery-header">
            <div><span className="vv-projects-kicker">EXPLORE OUR WORK</span><h2>Find the kind of<br/>story you're looking for.</h2></div>
            <p>Choose a creative category to explore a little further. Photographic samples are drawn from the Visual Verse archive; other visuals are illustrative directions.</p>
          </div>
          <div className="vv-projects-filters" role="group" aria-label="Filter portfolio categories">
            <button type="button" aria-pressed={filter==="all"} className={filter==="all"?"is-active":""} onClick={()=>setFilter("all")}>All collections</button>
            {categories.map(item=><button type="button" key={item.id} aria-pressed={filter===item.id} onClick={()=>setFilter(item.id)} className={filter===item.id?"is-active":""}>{item.short}</button>)}
          </div>
          <div className="vv-projects-focus-grid">
            {displayed.map((item)=>(
              <a href={"#"+item.id} key={item.id} className="vv-projects-focus-card">
                <div className="vv-projects-focus-image"><CategoryVisual category={item}/><span className="vv-projects-focus-arrow"><ArrowUpRight size={21}/></span></div>
                <div className="vv-projects-focus-caption"><h3>{item.name}</h3><p>{item.headline}</p></div>
              </a>
            ))}
          </div>
        </section>

        <section className="vv-projects-archive">
          <div className="vv-projects-archive-heading">
            <div><span className="vv-projects-kicker">FROM THE VISUAL VERSE ARCHIVE</span><h2>People. Places.<br/><em>Moments.</em></h2></div>
            <p>Selected photographs previously featured on the original Visual Verse website. Further individual client case studies and project credits will be added when approved for publication.</p>
          </div>
          <div className="vv-projects-archive-strip">
            {archive.map(item=><figure key={item.image}><img src={item.image} alt={item.alt} loading="lazy" decoding="async"/><figcaption>{item.tag}</figcaption></figure>)}
          </div>
        </section>

        <div className="vv-projects-collections">
          {categories.map((category,index)=>(
            <section className="vv-projects-category" id={category.id} key={category.id} aria-labelledby={"vv-project-"+category.id}>
              {category.id==="web-ui-ux"&&<span id="digital" className="vv-projects-alias"/>}
              {category.id==="social-media"&&<span id="campaigns" className="vv-projects-alias"/>}
              <div className="vv-projects-category-visual">
                <div className="vv-projects-category-art"><CategoryVisual category={category}/></div>
                <span className="vv-projects-visual-meta"><ImageIcon size={13} aria-hidden="true"/> CREATIVE CATEGORY</span>
              </div>
              <div className="vv-projects-category-copy">
                <span className="vv-projects-kicker">CREATIVE COLLECTION</span>
                <h2 id={"vv-project-"+category.id}>{category.name}</h2>
                <h3>{category.headline}</h3>
                <p>{category.description}</p>
                <ul>{category.services.map(point=><li key={point}><Check size={15} aria-hidden="true"/>{point}</li>)}</ul>
                <div className="vv-projects-category-links">
                  <a href={"/request-quote.html?service="+encodeURIComponent(category.name)}>Start a {category.short} project <ArrowUpRight size={17} aria-hidden="true"/></a>
                  <a href="#vv-projects-gallery" className="vv-projects-back">Back to all collections <ArrowRight size={16} aria-hidden="true"/></a>
                </div>
              </div>
            </section>
          ))}
        </div>

        <p className="vv-projects-archive-note">The collections above introduce our creative disciplines. Gallery photography comes from the original Visual Verse portfolio; illustrative concepts demonstrate possibilities, not claimed commissions.</p>
        <VisualVerseAboutCta/>
      </main>
      <footer className="vv-close-footer-wrap" id="footer"><VisualVerseFooter/></footer>
      <WhatsAppFloating/>
    </div>
  );
}
