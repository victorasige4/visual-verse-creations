import { EditorialText } from "./EditorialText";
import { ArrowUpRight, Camera, Palette, MonitorSmartphone, Clapperboard, Sparkles, Play, MousePointer2, Layers, Check } from "lucide-react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

export type PortfolioCollection = {
  id: "graphic-design" | "photography" | "branding" | "digital" | "videography" | "campaigns";
  number: string;
  category: string;
  headline: string;
  description: string;
  tags: string[];
  href: string;
};

export const portfolioCollections: PortfolioCollection[] = [
  {
    id: "graphic-design", number: "01", category: "GRAPHIC DESIGN",
    headline: "Ideas made visible.",
    description: "Campaigns, print and expressive visual communication crafted to make a message clear.",
    tags: ["Campaigns", "Print", "Visual Design"], href: "/projects.html#graphic-design",
  },
  {
    id: "photography",
    number: "02",
    category: "PHOTOGRAPHY",
    headline: "Moments, beautifully remembered.",
    description: "Portraits, celebrations and imagery that tell the story behind the moment.",
    tags: ["Portraits", "Events", "Photography"],
    href: "/projects.html#photography",
  },
  {
    id: "digital",
    number: "03",
    category: "WEB & UI/UX DESIGN",
    headline: "Digital that feels human.",
    description: "Websites and interfaces shaped to make every interaction count.",
    tags: ["Web Design", "UI/UX", "Prototyping"],
    href: "/projects.html#web-ui-ux",
  },
  {
    id: "videography", number: "04", category: "VIDEOGRAPHY",
    headline: "Every frame has a story.",
    description: "Film, event highlights and thoughtful editing that make the moment move.",
    tags: ["Film", "Editing", "Motion"], href: "/projects.html#videography",
  },
  {
    id: "branding",
    number: "05",
    category: "BRANDING & IDENTITY",
    headline: "Identities with a point of view.",
    description: "Memorable marks, considered design systems and expressive brand worlds.",
    tags: ["Identity", "Brand Systems", "Strategy"],
    href: "/projects.html#branding",
  },
  {
    id: "campaigns",
    number: "06",
    category: "SOCIAL MEDIA & DIGITAL MARKETING",
    headline: "Creative that travels further.",
    description: "Campaign visuals, moving stories and content made for connection.",
    tags: ["Graphic Design", "Video", "Social Media"],
    href: "/projects.html#social-media",
  }
];

/**
 * Concept visuals demonstrate Visual Verse's capabilities.
 * They are not claims of commissioned client projects.
 */
export function PortfolioArtwork({ kind }: { kind: PortfolioCollection["id"] }) {
  if (kind === "graphic-design" || kind === "videography") return (
    <div className="vv-pf-art vv-pf-art-photo">
      <div className="vv-pf-photo-main"><img src={kind==="graphic-design"?"/portfolio-social-design.jpg":"/portfolio-event-story.jpg"} alt={kind==="graphic-design"?"Visual Verse graphic design portfolio example":"Visual Verse event coverage portfolio example"} loading="lazy" decoding="async"/><span className="vv-pf-photo-focus" aria-hidden="true"/></div>
      <div className="vv-pf-photo-chip">{kind==="graphic-design"?<Layers size={14} aria-hidden="true"/>:<Clapperboard size={14} aria-hidden="true"/>}<span>{kind==="graphic-design"?"IDEAS / MADE VISIBLE":"STORIES / IN MOTION"}</span></div>
    </div>
  );
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
        <div className="vv-pf-browser-top"><span className="vv-pf-browser-dots">● ● ●</span><span className="vv-pf-browser-url">visualverse / creative</span><MonitorSmartphone size={13} aria-hidden="true"/></div>
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

export const selectedDirectionPhotos: Record<PortfolioCollection["id"], { src: string; alt: string }> = {
  "graphic-design": { src: "selected-directions/graphic-design.webp", alt: "Graphic designer working on visual artwork in a creative studio" },
  "photography": { src: "selected-directions/photography.webp", alt: "An editorial portrait of a woman in Nairobi" },
  "digital": { src: "selected-directions/digital.webp", alt: "Close-up of a mobile digital interface" },
  "videography": { src: "selected-directions/videography.webp", alt: "A filmmaker operating a cinema camera outdoors" },
  "branding": { src: "selected-directions/branding.webp", alt: "A brand strategy moodboard with colour palettes and editorial visuals" },
  "campaigns": { src: "selected-directions/campaigns.webp", alt: "A creator filming social content with a smartphone and gimbal" },
};

function PortfolioPreviewCard({ collection }: { collection: PortfolioCollection }) {
  return (
    <CardContainer containerClassName="vv-pf-card-outer" className="vv-pf-card">
      <CardBody className="vv-pf-card-content">
        <CardItem translateZ={24} className="vv-pf-card-eyebrow">
          
          <span>PORTFOLIO COLLECTION</span>
        </CardItem>
        <CardItem translateZ={52} className="vv-pf-card-media">
          <img className="vv-pf-selected-photo" src={import.meta.env.BASE_URL + selectedDirectionPhotos[collection.id].src} alt={selectedDirectionPhotos[collection.id].alt} width={720} height={1280} loading="lazy" decoding="async"/>
          <span className="vv-pf-media-corner" aria-hidden="true"><ArrowUpRight size={16}/></span>
        </CardItem>
        <CardItem translateZ={32} className="vv-pf-card-details">
          <span className="vv-pf-card-category">{collection.category}</span>
          <h3><EditorialText text={collection.headline}/></h3>
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
          <h2 className="vv-section-h">A glimpse of<br/>what we <br className="vv-break-narrow"/>create<span className="vv-pf-period">.</span></h2>
        </div>
        <div className="vv-pf-intro">
          <p>Every creative journey has its own story. Explore six ways we bring ideas to life—from the first frame to the final experience.</p>
          <a className="vv-pf-all" href="/projects.html">Explore the portfolio <span><ArrowUpRight size={18} aria-hidden="true"/></span></a>
        </div>
      </div>
      <div className="vv-pf-grid">
        {portfolioCollections.map(collection=><PortfolioPreviewCard key={collection.id} collection={collection}/>)}
      </div>
      <div className="vv-pf-footnote">
        <span><Check size={14} aria-hidden="true"/> SAMPLE CREATIVE DIRECTIONS</span>
        <p>Stock imagery illustrating our services, not commissioned client projects. Individual client case studies will be added as projects are approved for publication.</p>
      </div>
    </div>
  );
}
