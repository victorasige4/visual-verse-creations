import { useEffect } from "react";
import { PixelatedCanvas } from "@/components/ui/pixelated-canvas";

/** The image only: the existing Who We Are copy and section layout stay in HTML. */
export function VisualVerseWhoWeAre() {
  useEffect(() => {
    const title=document.getElementById("vv-about-title");
    if(!title || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const savedMarkup=title.innerHTML;
    const savedLabel=title.getAttribute("aria-label");
    const originalText=title.textContent?.replace(/\\s+/g," ").trim() || "About Visual Verse Creations";
    title.setAttribute("aria-label",originalText);
    title.setAttribute("data-vv-scroll-words","true");

    const walker=document.createTreeWalker(title,NodeFilter.SHOW_TEXT);
    const textNodes:Text[]=[];
    let node:Node|null;
    while((node=walker.nextNode()))textNodes.push(node as Text);
    const words:HTMLElement[]=[];
    for(const textNode of textNodes){
      const fragment=document.createDocumentFragment();
      const accent=Boolean(textNode.parentElement?.closest(".vv-about-highlight"));
      const segments=textNode.textContent?.match(/\\s+|[^\\s]+/g) || [];
      for(const segment of segments){
        if(/^\\s+$/.test(segment)){fragment.appendChild(document.createTextNode(segment));continue;}
        const word=document.createElement("span");
        word.className="vv-scroll-word"+(accent?" is-accent":"");
        word.textContent=segment;
        fragment.appendChild(word);
        words.push(word);
      }
      textNode.parentNode?.replaceChild(fragment,textNode);
    }
    if(!words.length)return;
    let raf=0;
    const startRGB=[169,185,193];
    const mainRGB=[0,63,92];
    const aquaRGB=[46,196,182];
    const clamp=(v:number)=>Math.max(0,Math.min(1,v));
    const render=()=>{
      raf=0;
      const rect=title.getBoundingClientRect();
      const topTrigger=window.innerHeight*.84;
      const finish=window.innerHeight*.23;
      const progress=clamp((topTrigger-rect.top)/(topTrigger-finish));
      words.forEach((word,index)=>{
        const i=index/Math.max(1,words.length-1);
        const amount=clamp((progress*1.2-i*.95)/.25);
        const eased=amount*amount*(3-2*amount);
        const end=word.classList.contains("is-accent")?aquaRGB:mainRGB;
        const value=startRGB.map((channel,n)=>Math.round(channel+(end[n]-channel)*eased));
        word.style.color=`rgb(${value[0]} ${value[1]} ${value[2]})`;
        word.style.opacity=String(.76+.24*eased);
      });
    };
    const schedule=()=>{if(!raf)raf=requestAnimationFrame(render)};
    window.addEventListener("scroll",schedule,{passive:true});
    window.addEventListener("resize",schedule,{passive:true});
    schedule();
    return ()=>{
      if(raf)cancelAnimationFrame(raf);
      window.removeEventListener("scroll",schedule);
      window.removeEventListener("resize",schedule);
      title.innerHTML=savedMarkup;
      if(savedLabel===null)title.removeAttribute("aria-label");
      else title.setAttribute("aria-label",savedLabel);
      title.removeAttribute("data-vv-scroll-words");
    };
  },[]);
  return (
    <PixelatedCanvas
      src="/about-photographer.webp"
      alt="Photographer holding a camera and looking through its lens"
      className="vv-about-pixel-image"
      responsive
      cellSize={8}
      dotScale={0.9}
      shape="square"
      backgroundColor="#eaf5f0"
      grayscale={false}
      dropoutStrength={0.025}
      interactive
      distortionMode="swirl"
      distortionStrength={19}
      distortionRadius={116}
      followSpeed={0.20}
      jitterStrength={0.6}
      jitterSpeed={3.2}
      tintStrength={0.02}
      tintColor="#2ec4b6"
      objectFit="cover"
      maxFps={22}
    />
  );
}
