import { ArrowUpRight, Camera, Palette, MonitorSmartphone, Clapperboard, Sparkles, Play, MousePointer2, Layers, Check } from "lucide-react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

export type PortfolioCollection = {
  id: "photography" | "branding" | "digital" | "campaigns";
  number: string;
  category: string;
  headline: string;
  description: string;
  tags: string[];
  href: string;
};

export const portfolioCollections: PortfolioCollection[] = [
  {
    id: "photography",
    number: "01",
    category: "PHOTOGRAPHY & VISUAL STORIES",
    headline: "Moments, beautifully remembered.",
    description: "Portraits, celebrations and imagery that tell the story behind the moment.",
    tags: ["Portraits", "Events", "Photography"],
    href: "/projects.html#photography",
  },
  {
    id: "branding",
    number: "02",
    category: "BRANDING & IDENTITY",
    headline: "Identities with a point of view.",
    description: "Memorable marks, considered design systems and expressive brand worlds.",
    tags: ["Identity", "Brand Systems", "Strategy"],
    href: "/projects.html#branding",
  },
  {
    id: "digital",
    number: "03",
    category: "WEB & DIGITAL EXPERIENCES",
    headline: "Digital that feels human.",
    description: "Websites and interfaces shaped to make every interaction count.",
    tags: ["Web Design", "UI/UX", "Prototyping"],
    href: "/projects.html#web-ui-ux",
  },
  {
    id: "campaigns",
    number: "04",
    category: "CAMPAIGNS & MOTION",
    headline: "Creative that travels further.",
    description: "Campaign visuals, moving stories and content made for connection.",
    tags: ["Graphic Design", "Video", "Social Media"],
    href: "/projects.html#social-media",
  },
];

/**
 * Concept visuals demonstrate Visual Verse's capabilities.
 * They are not claims of commissioned client projects.
 */
export function PortfolioArtwork({ kind }: { kind: PortfolioCollection["id"] }) {
  if (kind === "photography") return (
    <div className="vv-pf-art vv-pf-art-photo">
      <div className="vv-pf-photo-main">
        <img src="/about-photographer.webp" alt="Photographer holding a camera — sample photography visual" loading="lazy" decoding="async" />
        <span className="vv-pf-photo-focus" aria-hidden="true" />
      </div>
      <div className="vv-pf-photo-chip"><Camera size={14} aria-hidden="true" /><span>EVERY FRAME / A STORY</span></div>
      
    </div>
  );

  if (kind === "branding") return (
    <div className="vv-pf-art vv-pf-art-brand">
      <div className="vv-pf-brand-sheet vv-pf-brand-back"><span>IDENTITY STUDIES</span><strong>V / V</strong></div>
      <div className="vv-pf-brand-sheet vv-pf-brand-front">
        <span className="vv-pf-brand-caption"><Palette size={14} aria-hidden="true"/> VISUAL VERSE / BRAND WORLD</span>
        <img src="/logo-mark.png" alt="Visual Verse favicon displayed in a branding concept" />
        <span className="vv-pf-brand-footer">CREATIVITY IN EVERY DETAIL.</span>
      </div>
      <div className="vv-pf-brand-colors" aria-label="Visual Verse color swatches">
        <span style={{background:"#003f5c"}}/>
        <span style={{background:"#2ec4b6"}}/>
        <span style={{background:"#d8f4ef"}}/>
      </div>
    </div>
  );

  if (kind === "digital") return (
    <div className="vv-pf-art vv-pf-art-web">
      <div className="vv-pf-browser">
        <div className="vv-pf-browser-top"><span className="vv-pf-browser-dots">● ● ●</span><span className="vv-pf-browser-url">visualverse / studio</span><MonitorSmartphone size={13} aria-hidden="true"/></div>
        <div className="vv-pf-browser-body">
          <img src="/logo-mark.png" alt="Visual Verse mark in a website concept" />
          <span>DESIGN FOR PEOPLE</span>
          <strong>Made to<br/>connect.</strong>
          <div className="vv-pf-browser-cta">EXPLORE <ArrowUpRight size={12} aria-hidden="true"/></div>
          <i className="vv-pf-browser-orbit" aria-hidden="true"/>
        </div>
      </div>
      <div className="vv-pf-phone">
        <span>VV / MOBILE</span><MousePointer2 size={20} aria-hidden="true"/>
        <div className="vv-pf-phone-lines"><i/><i/><i/></div>
        <small>THOUGHTFUL BY DESIGN</small>
      </div>
    </div>
  );

  return (
    <div className="vv-pf-art vv-pf-art-campaign">
      <div className="vv-pf-campaign-poster vv-pf-campaign-back"><span><Layers size={15} aria-hidden="true"/> VV / CREATIVE</span><b>MAKE<br/>IT<br/>MOVE.</b></div>
      <div className="vv-pf-campaign-poster vv-pf-campaign-front">
        <span><Clapperboard size={14} aria-hidden="true"/> STORIES / IN MOTION</span>
        <div className="vv-pf-campaign-play"><Play size={26} fill="currentColor" aria-hidden="true"/></div>
        <strong>CREATE.<br/>CONNECT.<br/><em>REPEAT.</em></strong>
        <div className="vv-pf-campaign-timeline" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/></div>
      </div>
      <div className="vv-pf-campaign-note"><Sparkles size={14} aria-hidden="true"/> CREATIVE IMPACT</div>
    </div>
  );
}

export function PortfolioPreviewCard({ collection }: { collection: PortfolioCollection }) {
  return (
    <CardContainer containerClassName="vv-pf-card-outer" className="vv-pf-card">
      <CardBody className="vv-pf-card-content">
        <CardItem translateZ={24} className="vv-pf-card-eyebrow">
          
          <span>PORTFOLIO COLLECTION</span>
        </CardItem>
        <CardItem translateZ={52} className="vv-pf-card-media">
          <PortfolioArtwork kind={collection.id}/>
          <span className="vv-pf-media-corner" aria-hidden="true"><ArrowUpRight size={16}/></span>
        </CardItem>
        <CardItem translateZ={32} className="vv-pf-card-details">
          <span className="vv-pf-card-category">{collection.category}</span>
          <h3>{collection.headline}</h3>
          <p>{collection.description}</p>
        </CardItem>
        <CardItem translateZ={22} className="vv-pf-card-bottom">
          <div className="vv-pf-card-tags">{collection.tags.map(tag=><span key={tag}>{tag}</span>)}</div>
          <a className="vv-pf-card-action" href={collection.href} aria-label={"Explore "+collection.category.toLowerCase()+" in our projects collection"}>
            VIEW COLLECTION <ArrowUpRight size={16} aria-hidden="true"/>
          </a>
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}

export function VisualVersePortfolio() {
  return (
    <div className="vv-pf-layout">
      <div className="vv-pf-header">
        <div>
          <span className="vv-label">SELECTED DIRECTIONS</span>
          <h2 className="vv-section-h">A glimpse of<br/>what we create<span className="vv-pf-period">.</span></h2>
        </div>
        <div className="vv-pf-intro">
          <p>Every creative journey has its own story. Explore four ways we bring ideas to life—from the first frame to the final experience.</p>
          <a className="vv-pf-all" href="/projects.html">Explore the portfolio <span><ArrowUpRight size={18} aria-hidden="true"/></span></a>
        </div>
      </div>
      <div className="vv-pf-grid">
        {portfolioCollections.map(collection=><PortfolioPreviewCard key={collection.id} collection={collection}/>)}
      </div>
      <div className="vv-pf-footnote">
        <span><Check size={14} aria-hidden="true"/> SAMPLE CREATIVE DIRECTIONS</span>
        <p>Illustrative previews of our services. Individual client case studies will be added as projects are approved for publication.</p>
      </div>
    </div>
  );
}
