/** Creative directions, not claims of completed commissions. Existing portfolio
 * images are incorporated into their corresponding deliverables. */
export type PortfolioArtwork = { title: string; image: string; width: number; height: number };
export type ProjectDeliverable = { title: string; image: string; description: string; details: string; position?: string; examples?: string[]; artwork?: PortfolioArtwork[]; artworkLabel?: string; photographs?: PortfolioArtwork[] };

const xobriqCampaign: PortfolioArtwork[] = [
  "Identify high-value AI opportunities", "Build your AI roadmap", "Detect synthetic identity", "How long should KYC take?", "Africa’s AI economy", "Verify before lending", "Your fleet moves fast", "KYC is more than an ID", "Seven days to smarter verification", "Verify the business behind the business", "Three days to Xobriq KYC", "KYC is about to get smarter", "For businesses that need to verify", "Score the risk with Xobriq Guard",
].map((title,index)=>({title,image:`project-archive/campaign-graphics/xobriq-${String(index+8).padStart(2,"0")}.webp`,width:1080,height:1350}));

const editorialPosters: PortfolioArtwork[] = [
  {title:"Online Makeup Classes — Lolo Beauty",image:"online-makeup-classes",width:2000,height:2000},
  {title:"Easter Sunday — Hillside Church",image:"easter-sunday",width:1500,height:1500},
  {title:"Isaiah 53:5 — Hillside Church",image:"isaiah-53-5",width:1500,height:1500},
  {title:"Ramadan Kareem — Finsense Africa",image:"ramadan-kareem",width:1200,height:1200},
  {title:"Six Hours of Travail — Hillside Church",image:"six-hours-of-travail",width:1080,height:1080},
  {title:"Father’s Day — Hillside Church",image:"fathers-day",width:1500,height:1500},
  {title:"Men Always Ought to Pray — Hillside Church",image:"men-ought-to-pray",width:1200,height:1500},
  {title:"Next Dimension — Hillside Church",image:"next-dimension",width:1200,height:1200},
].map(item=>({...item,image:`project-archive/editorial-posters/${item.image}.webp`}));

const graduationPortraits: PortfolioArtwork[] = [
  {title:"Full-length portrait in a red outfit and graduation cap",image:"top07106",width:933,height:1400},
  {title:"Red outfit graduation portrait, looking sideways",image:"top07077",width:880,height:1400},
  {title:"Front-facing red outfit graduation portrait",image:"top07072",width:877,height:1400},
  {title:"Graduation gown portrait with hands at waist",image:"top07048",width:933,height:1400},
  {title:"Seated portrait in graduation gown",image:"top07004",width:933,height:1400},
  {title:"Playful portrait holding a mortarboard",image:"top06802",width:950,height:1400},
  {title:"Smiling graduation portrait in academic regalia",image:"top06780",width:1092,height:1400},
  {title:"Full-length portrait in graduation gown",image:"top06766",width:933,height:1400},
  {title:"Wide studio portrait in graduation gown",image:"top06765",width:1400,height:1054},
  {title:"Landscape close-up graduation portrait",image:"top06750",width:1400,height:933},
].map(item=>({...item,image:`project-archive/graduation-portraits/${item.image}.webp`}));

export const projectDeliverables: Record<string, ProjectDeliverable[]> = {
  "graphic-design": [
    {title:"Campaign graphics",image:"service-cover-graphic-design.webp",description:"Visuals that make a campaign impossible to overlook.",details:"Campaign key visuals, promotional banners and adaptable artwork for digital and print touchpoints.",artwork:xobriqCampaign,artworkLabel:"Xobriq"},
    {title:"Editorial & poster design",image:"project-archive/social-design.webp",description:"Bold compositions with a message that lands.",details:"Posters, publication layouts, event announcements and editorial artwork with thoughtfully balanced typography and imagery.",position:"center",artwork:editorialPosters,artworkLabel:"Selected work"},
    {title:"Print collateral",image:"project-archive/print-collateral/xobriq-verify-outside.webp",description:"Thoughtful design you can hold in your hands.",details:"Brochures, flyers, stationery and other print-ready materials, prepared with production requirements in mind. Explore both sides of the Xobriq Verify brochure.",artworkLabel:"Xobriq Verify",artwork:[{title:"Xobriq Verify brochure — outside",image:"project-archive/print-collateral/xobriq-verify-outside.webp",width:1800,height:1272},{title:"Xobriq Verify brochure — inside",image:"project-archive/print-collateral/xobriq-verify-inside.webp",width:1800,height:1272}]},
    {title:"Illustration",image:"selected-directions/graphic-design.webp",description:"Original visual ideas with their own personality.",details:"Custom illustrations, graphic elements and expressive visual concepts that support your story."},
  ],
  photography: [
    {title:"Portraits & lifestyle",image:"selected-directions/photography.webp",description:"Authentic portraits with a sense of character.",details:"Individual, team and lifestyle photography, with considered lighting, composition and direction."},
    {title:"Graduations & celebrations",image:graduationPortraits[3].image,description:"Give milestones the memories they deserve.",details:"Graduations, celebrations and special occasions, from candid interactions to carefully composed portraits.",photographs:graduationPortraits},
    {title:"Corporate events",image:"project-archive/corporate-moment.webp",description:"The energy, people and details of your event.",details:"Conference, seminar and business event photography that captures speakers, audiences, networking and atmosphere.",examples:["project-archive/corporate-events.webp"]},
    {title:"Image editing",image:"photography-wedding-compare.webp",description:"Bring out what makes each photograph special.",details:"Colour correction, tonal adjustments, retouching and consistent finishing for a cohesive image collection."},
  ],
  "web-ui-ux": [
    {title:"Responsive websites",image:"who-we-serve-toolbox-web.webp",description:"A digital home that works on every screen.",details:"Responsive landing pages, portfolio sites and business websites, designed around your audience and brand."},
    {title:"Interface design",image:"selected-directions/digital.webp",description:"Clear, expressive interfaces made for real people.",details:"Web and mobile product interfaces, component systems and accessible visual patterns."},
    {title:"User journeys",image:"audience-digital-creative.webp",description:"Make every step feel natural and intentional.",details:"User flow mapping, information architecture and wireframes that simplify how people find and use what they need."},
    {title:"Interactive prototypes",image:"service-cover-web-ui-ux.webp",description:"Experience the idea before it becomes a product.",details:"Clickable prototypes for testing key interactions, refining journeys and aligning stakeholders before development."},
  ],
  videography: [
    {title:"Event films",image:"project-archive/event-story.webp",description:"Relive the feeling of being there.",details:"Event highlights, recaps and storytelling films that bring together defining moments and atmosphere."},
    {title:"Interviews & documentaries",image:"who-we-serve-toolbox-film.webp",description:"Human stories, told with care.",details:"Interview-led films, documentary-style features and authentic brand stories, with purposeful framing and sound."},
    {title:"Editing & colour",image:"service-cover-videography.webp",description:"Shape the footage into a story worth watching.",details:"Video editing, colour grading, sound finishing and motion elements for a polished final production."},
    {title:"Promotional storytelling",image:"selected-directions/videography.webp",description:"Move your audience with a memorable message.",details:"Promotional films, product videos and campaign content, from creative concept through delivery."},
  ],
  branding: [
    {title:"Logo design",image:"service-cover-branding.webp",description:"A distinctive mark that feels unmistakably yours.",details:"Logo exploration, a refined primary mark and suitable variations for practical brand use."},
    {title:"Visual identity",image:"selected-directions/branding.webp",description:"Create a visual world people recognise.",details:"Colour, typography, graphic language and imagery direction that work as a cohesive system."},
    {title:"Brand applications",image:"audience-brands-creative.webp",description:"See your identity come to life in the real world.",details:"Digital and physical brand touchpoints, including collateral, packaging concepts and campaign applications."},
    {title:"Guidelines",image:"who-we-serve-toolbox-design.webp",description:"Keep your brand consistent wherever it appears.",details:"A practical visual identity guide with logo usage, colours, type and examples for your team and partners."},
  ],
  "social-media": [
    {title:"Content strategy",image:"audience-businesses-creative.webp",description:"Give every piece of content a purpose.",details:"Content pillars, platform direction and a creative plan aligned with your audience and business goals."},
    {title:"Campaign creative",image:"service-cover-social-media.webp",description:"Creative ideas built to reach the right people.",details:"Campaign concepts, digital advertisements and platform-specific assets for coordinated launches and promotions."},
    {title:"Social media visuals",image:"project-archive/social-design.webp",description:"A feed that looks and feels like your brand.",details:"Social graphics, carousels, story templates and recurring visual formats designed for each platform."},
    {title:"Motion content",image:"selected-directions/campaigns.webp",description:"Take your story beyond the static frame.",details:"Short-form video, animated graphics, reels and motion assets designed for social-first storytelling."},
  ],
};
