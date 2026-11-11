import { useEffect } from "react";
import { ArrowLeft, ArrowUpRight, FolderOpen, Image as ImageIcon, Check, MoveUpRight } from "lucide-react";
import { portfolioCollections, PortfolioArtwork } from "@/components/VisualVersePortfolio";
import { VisualVerseFooter } from "@/components/VisualVerseClosingSections";

const detailPoints: Record<string, string[]> = {
  photography: ["Portraits & lifestyle stories", "Graduations, events & celebrations", "Brand and product imagery"],
  branding: ["Brand strategy & visual identity", "Logos, identity systems & guidelines", "Print and digital brand applications"],
  digital: ["Responsive website experiences", "Product interfaces & UX flows", "Figma prototypes and design systems"],
  campaigns: ["Campaign concept and graphic design", "Film and social video content", "Content for digital storytelling"],
};

export function VisualVerseProjectsPage() {
  useEffect(() => {
    function focusHash() {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: "start" }));
    }
    focusHash();
    window.addEventListener("hashchange", focusHash);
    return () => window.removeEventListener("hashchange", focusHash);
  }, []);

  return (
    <div className="vv-projects-page">
      <header className="vv-projects-topbar">
        <a href="/#top" aria-label="Visual Verse Creations — Home" className="vv-projects-logo">
          <img src="/brand-wordmark.png" alt="Visual Verse Creations" width="208" height="60" />
        </a>
        <nav aria-label="Projects page navigation">
          <a href="/#services">What we do</a>
          <a href="/projects.html" aria-current="page">Projects</a>
          <a href="/#contact" className="vv-projects-talk">Let's talk <ArrowUpRight size={16} aria-hidden="true" /></a>
        </nav>
      </header>
      <main>
        <section className="vv-projects-hero">
          <div className="vv-projects-hero-top">
            <span className="vv-projects-kicker"><FolderOpen size={16} aria-hidden="true" /> THE VISUAL VERSE PORTFOLIO</span>
            <span className="vv-projects-index">COLLECTIONS / 01—04</span>
          </div>
          <div className="vv-projects-hero-bottom">
            <div>
              <h1>Every story,<br/><em>a different canvas.</em></h1>
              <p>Explore the creative directions we bring together—from portraits and distinctive identities to websites, campaigns and moving images.</p>
            </div>
            <span className="vv-projects-hero-mark" aria-hidden="true"><img src="/logo-mark.png" alt="" /></span>
          </div>
          <div className="vv-projects-hero-links">
            {portfolioCollections.map(collection => (
              <a key={collection.id} href={"#"+collection.id}>
                {collection.number} / {collection.category} <ArrowUpRight size={13} aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>
        <div className="vv-projects-collections">
          {portfolioCollections.map((collection,index)=>(
            <section className="vv-projects-category" id={collection.id} key={collection.id} aria-labelledby={"vv-project-"+collection.id}>
              <div className="vv-projects-category-visual">
                <div className="vv-projects-category-art"><PortfolioArtwork kind={collection.id}/></div>
                <span className="vv-projects-visual-meta"><ImageIcon size={13} aria-hidden="true"/> CREATIVE DIRECTION / {collection.number}</span>
              </div>
              <div className="vv-projects-category-copy">
                <span className="vv-projects-kicker">{collection.number} / COLLECTION 0{index+1}</span>
                <h2 id={"vv-project-"+collection.id}>{collection.category}</h2>
                <h3>{collection.headline}</h3>
                <p>{collection.description}</p>
                <ul>{detailPoints[collection.id]?.map(point=><li key={point}><Check size={15} aria-hidden="true"/>{point}</li>)}</ul>
                <div className="vv-projects-category-links">
                  <a href="/#contact">Discuss a project <ArrowUpRight size={17} aria-hidden="true"/></a>
                  <a href="/#work" className="vv-projects-back">Back to the overview <ArrowLeft size={16} aria-hidden="true"/></a>
                </div>
              </div>
            </section>
          ))}
        </div>
        <section className="vv-projects-notice">
          <span className="vv-projects-kicker">WORK IN PROGRESS / REAL STORIES NEXT</span>
          <h2>Great work starts<br/>with a conversation.</h2>
          <p>These visuals are concept previews of our creative services, not published client case studies. Individual projects and credits will be added as our portfolio is prepared for publication.</p>
          <a href="/#contact">Let's create together <MoveUpRight size={18} aria-hidden="true"/></a>
        </section>
      </main>
      <footer className="vv-close-footer-wrap" id="footer">
        <VisualVerseFooter />
      </footer>
    </div>
  );
}
