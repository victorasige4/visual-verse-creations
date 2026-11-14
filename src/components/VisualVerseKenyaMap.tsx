import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import countyOutlines from "@/data/kenya-counties.json";
import { ArrowUpRight, Compass, Globe2, MapPin, Pause, Play, Radio, Sparkles } from "lucide-react";
import "../kenya-creative-atlas.css";

/**
 * A living creative atlas, not a portfolio-coverage claim.
 * Nairobi is our sole confirmed home base. Other pins are cities from which
 * projects may be enquired about; routes are illustrative possibilities.
 * County geometry: OCHA-derived kenya-regions simplified outlines.
 */
const cities = [
  {name:"Nairobi", county:"Nairobi", lat:-1.2921, lon:36.8219, phrase:"Where it all begins.", role:"OUR HOME BASE"},
  {name:"Mombasa", county:"Mombasa", lat:-4.0435, lon:39.6682, phrase:"Coastal colour. Bigger stories.", role:"CREATIVE ENQUIRIES WELCOME"},
  {name:"Kisumu", county:"Kisumu", lat:-0.1022, lon:34.7617, phrase:"Ideas flowing by the lake.", role:"CREATIVE ENQUIRIES WELCOME"},
  {name:"Nakuru", county:"Nakuru", lat:-.3031, lon:36.08, phrase:"Fresh perspectives in the Rift.", role:"CREATIVE ENQUIRIES WELCOME"},
  {name:"Eldoret", county:"Uasin Gishu", lat:.5143, lon:35.2698, phrase:"Where ambitious stories grow.", role:"CREATIVE ENQUIRIES WELCOME"},
  {name:"Nyeri", county:"Nyeri", lat:-.4201, lon:36.9476, phrase:"Creative work with a view.", role:"CREATIVE ENQUIRIES WELCOME"},
  {name:"Thika", county:"Kiambu", lat:-1.0333, lon:37.0693, phrase:"Ideas close to home.", role:"CREATIVE ENQUIRIES WELCOME"},
  {name:"Malindi", county:"Kilifi", lat:-3.2192, lon:40.1169, phrase:"A little more sunshine in the story.", role:"CREATIVE ENQUIRIES WELCOME"}
] as const;

const WIDTH=750, HEIGHT=690, ROTATE_MS=6200;
function project(p:readonly number[]):[number,number]{
  return [(p[0]-33.75)/8.35*WIDTH,(5.7-p[1])/10.6*HEIGHT];
}
function pathOf(coordinates:number[][][]|number[][][][],type:string){
  const polygons=type==="Polygon"?[coordinates as number[][][]]:coordinates as number[][][][];
  return polygons.map(polygon=>polygon.map(ring=>ring.map((pt,i)=>{
    const [x,y]=project(pt);
    return (i?"L":"M")+x.toFixed(1)+" "+y.toFixed(1);
  }).join(" ")+"Z").join(" ")).join(" ");
}
const outlines=countyOutlines.features.map(c=>({
  id:c.properties.code,name:c.properties.name,path:pathOf(c.geometry.coordinates,c.geometry.type)
}));
const cityPoints=cities.map(c=>project([c.lon,c.lat]));
const nairobi=cityPoints[0];

function routeTo(index:number){
  const [sx,sy]=nairobi,[x,y]=cityPoints[index];
  const dx=x-sx,dy=y-sy;
  const bend=Math.min(95,Math.hypot(dx,dy)*.28+22);
  const side=index%2===0?1:-1;
  const mx=(sx+x)/2+(-dy/(Math.hypot(dx,dy)||1))*bend*side;
  const my=(sy+y)/2+(dx/(Math.hypot(dx,dy)||1))*bend*side;
  return "M"+sx.toFixed(1)+" "+sy.toFixed(1)+" Q"+mx.toFixed(1)+" "+my.toFixed(1)+" "+x.toFixed(1)+" "+y.toFixed(1);
}
export function VisualVerseKenyaMap(){
  const [selected,setSelected]=useState(0);
  // Keep the desktop tour animated, but leave mobile in a low-power, tap-to-explore mode.
  const [compact,setCompact]=useState(()=>window.matchMedia("(max-width: 800px)").matches);
  const [playing,setPlaying]=useState(()=>!window.matchMedia("(max-width: 800px)").matches);
  const [visible,setVisible]=useState(false);
  const [tabVisible,setTabVisible]=useState(()=>!document.hidden);
  const [reduced,setReduced]=useState(false);
  const mapRef=useRef<HTMLDivElement>(null);

  useEffect(()=>{
    const node=mapRef.current;
    if(!node)return;
    const observer=new IntersectionObserver(entries=>setVisible(!!entries[0]?.isIntersecting),{rootMargin:"100px",threshold:.05});
    observer.observe(node);
    return ()=>observer.disconnect();
  },[]);
  useEffect(()=>{
    const media=window.matchMedia("(max-width: 800px)");
    const update=()=>{
      setCompact(media.matches);
      if(media.matches)setPlaying(false);
    };
    media.addEventListener("change",update);
    return ()=>media.removeEventListener("change",update);
  },[]);
  useEffect(()=>{
    const media=window.matchMedia("(prefers-reduced-motion: reduce)");
    const update=()=>setReduced(media.matches);
    const page=()=>setTabVisible(!document.hidden);
    update();
    media.addEventListener("change",update);
    document.addEventListener("visibilitychange",page);
    return ()=>{media.removeEventListener("change",update);document.removeEventListener("visibilitychange",page)};
  },[]);
  useEffect(()=>{
    if(!playing||!visible||!tabVisible||reduced)return;
    const timeout=window.setTimeout(()=>setSelected(n=>(n+1)%cities.length),ROTATE_MS);
    return ()=>window.clearTimeout(timeout);
  },[playing,visible,tabVisible,reduced,selected]);

  const city=cities[selected];
  const route=useMemo(()=>selected===0?"":routeTo(selected),[selected]);
  const running=playing&&visible&&tabVisible&&!reduced;
  const choose=(i:number)=>{setSelected(i);setPlaying(false)};
  const placeDetails=<>
    <h3>Hello,<br/><em>{city.name}.</em></h3><p>{city.phrase}</p>
    <span className="vv-atlas-county">{city.county.toUpperCase()} COUNTY · KENYA</span>
  </>;
  return <div className="vv-close-location vv-map-v3" ref={mapRef}>
    <div className="vv-close-location-heading">
      <div><span className="vv-close-eyebrow"><span/> WHERE WE CREATE</span><h2>From Nairobi.<br/><em>To anywhere</em> the<br/>story takes us.</h2></div>
      <div className="vv-close-location-summary"><p>One creative home, many possible directions. Explore Kenya with us — select a city, follow the signal, and imagine what we could make together.</p><div className="vv-close-location-meta"><span><MapPin size={15}/> NAIROBI BASED</span><span><Globe2 size={15}/> KENYA-WIDE ENQUIRIES</span></div></div>
    </div>
    <div className="vv-atlas-shell">
      <div className="vv-atlas-topbar">
        <div className="vv-atlas-brand"><span className="vv-atlas-led"/><strong>THE CREATIVE ATLAS</strong><span>VISUAL VERSE / KENYA</span></div>
        <div className="vv-atlas-broadcast"><Radio size={15}/><span>CREATIVITY HAS NO POSTCODE</span></div>
      </div>
      <div className="vv-atlas-body">
        <div className="vv-atlas-map" data-cursor="EXPLORE">
          <div className="vv-atlas-coordinate vv-atlas-coordinate-a">01°17′S / 36°49′E</div>
          <div className="vv-atlas-compass" aria-hidden="true"><Compass size={18}/><span>N</span></div>
          <div className="vv-atlas-satellite" aria-hidden="true"><i/><i/><i/></div>
          <svg viewBox="0 0 750 690" role="group" aria-label="Interactive map of Kenya showing Nairobi as the confirmed Visual Verse home base and seven other cities open to creative enquiries">
            <defs>
              <radialGradient id="vv-atlas-region-fill"><stop offset="0" stopColor="#1b6471"/><stop offset="1" stopColor="#0f394a"/></radialGradient>
              <linearGradient id="vv-atlas-route-gradient" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#2ec4b6"/><stop offset=".6" stopColor="#b2ffe9"/><stop offset="1" stopColor="#8dded8"/></linearGradient>
              <filter id="vv-atlas-glow"><feGaussianBlur stdDeviation="6"/></filter>
              <pattern id="vv-atlas-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="1.3" fill="#77c6bc" opacity=".48"/></pattern>
              <radialGradient id="vv-atlas-spotlight"><stop offset="0" stopColor="#2ec4b6" stopOpacity=".3"/><stop offset="1" stopColor="#2ec4b6" stopOpacity="0"/></radialGradient>
            </defs>
            <g className="vv-atlas-counties">
              {outlines.map(c=>{
                const base=c.name.toLowerCase().includes("nairobi");
                const chosen=c.name.toLowerCase()===city.county.toLowerCase();
                return <path key={c.id} d={c.path}
                  fill={base?"#35ab9e":chosen?"#2a6d74":"url(#vv-atlas-region-fill)"}
                  stroke={base?"#9affe4":chosen?"#6bd8ce":"#3f7680"}
                  strokeWidth={base?2.5:chosen?2.3:.9} vectorEffect="non-scaling-stroke"
                  fillRule="evenodd" className={chosen?"vv-atlas-selected-county":""}/>;
              })}
            </g>
            {!compact&&<g className="vv-atlas-dot-overlay" pointerEvents="none">
              {outlines.map(c=><path key={"dots-"+c.id} d={c.path} fill="url(#vv-atlas-dots)" fillRule="evenodd" opacity=".25"/>)}
            </g>}
            {!compact&&cityPoints.slice(1).map((_,i)=><path key={"possible-"+i} className="vv-atlas-ghost-route" d={routeTo(i+1)} fill="none"/>)}
            <circle cx={cityPoints[selected][0]} cy={cityPoints[selected][1]} r="75" fill="url(#vv-atlas-spotlight)" pointerEvents="none"/>
            {route&&<g key={"live-"+selected} pointerEvents="none">
              {!compact&&<path d={route} className="vv-atlas-route-glow" filter="url(#vv-atlas-glow)"/>}
              {compact
                ? <path d={route} className="vv-atlas-active-route"/>
                : <motion.path d={route} className="vv-atlas-active-route" initial={{pathLength:0,opacity:0}} animate={{pathLength:1,opacity:1}} transition={{duration:1.25,ease:[.25,1,.35,1]}}/>}
              {!compact&&!reduced&&<circle r="5" fill="#e9fff5" stroke="#2ec4b6" strokeWidth="2">
                <animateMotion dur="3.8s" repeatCount="indefinite" path={route}/>
              </circle>}
            </g>}
            {cities.map((c,i)=>{
              const active=i===selected;
              const [x,y]=cityPoints[i];
              return <g key={c.name} transform={"translate("+x+","+y+")"} role="button" tabIndex={0}
                className={"vv-atlas-pin"+(active?" is-active":"")+(i===0?" is-home":"")}
                aria-label={"Explore "+c.name+", "+c.county+" County"} aria-pressed={active}
                onClick={()=>choose(i)} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();choose(i)}}}>
                {active&&<circle className="vv-atlas-pin-pulse" r="22"/>}
                <circle className="vv-atlas-pin-halo" r={active?15:11}/>
                <circle className="vv-atlas-pin-core" r={active?6.3:4.7}/>
                {(active||i===0)&&<text className="vv-atlas-pin-label" x="15" y="-15">{c.name.toUpperCase()}</text>}
              </g>;
            })}
          </svg>
          <div className="vv-atlas-map-caption"><Sparkles size={14}/> EVERY DOT IS A POSSIBLE BEGINNING.</div>
        </div>
        <aside className="vv-atlas-panel">
          <div className="vv-atlas-panel-head"><span>THE NEXT CREATIVE STOP</span><span className="vv-atlas-status"><i/> EXPLORE LIVE</span></div>
          <div className="vv-atlas-place">
            <span className="vv-atlas-place-brow">{city.role}</span>
            {compact
              ? <div key={city.name}>{placeDetails}</div>
              : <AnimatePresence mode="wait"><motion.div key={city.name} initial={{opacity:0,y:20,filter:"blur(5px)"}} animate={{opacity:1,y:0,filter:"blur(0px)"}} exit={{opacity:0,y:-13,filter:"blur(5px)"}} transition={{duration:.34}}>{placeDetails}</motion.div></AnimatePresence>}
          </div>
          <div className="vv-atlas-city-controls">
            <div className="vv-atlas-city-controls-title"><span>PICK A DESTINATION</span><button type="button" onClick={()=>setPlaying(v=>!v)} aria-label={playing?"Pause automatic map tour":"Resume automatic map tour"} data-cursor="PLAY">{playing?<Pause size={13}/>:<Play size={13}/>} {playing?"PAUSE":"PLAY"}</button></div>
            <div className="vv-atlas-city-grid" role="group" aria-label="Explore cities accepting creative project enquiries">
              {cities.map((c,i)=><button type="button" key={c.name} onClick={()=>choose(i)}
                className={"vv-atlas-city"+(selected===i?" is-selected":"")} aria-pressed={selected===i} data-cursor="EXPLORE">
                <span className="vv-atlas-city-dot"/>{c.name}
                {selected===i&&<span className="vv-atlas-city-progress" aria-hidden="true">{running&&<motion.i key={c.name} initial={{scaleX:0}} animate={{scaleX:1}} transition={{duration:ROTATE_MS/1000,ease:"linear"}}/>}</span>}
              </button>)}
            </div>
          </div>
          <a href="/contact.html" className="vv-atlas-cta" data-cursor="LET'S TALK">LET'S CREATE SOMETHING <span><ArrowUpRight size={18}/></span></a>
          <p className="vv-atlas-disclaimer">Routes are illustrative. Nairobi is our studio base; other cities are enquiry locations, not claims of existing offices or clients.</p>
        </aside>
      </div>
      <div className="vv-atlas-bottom-bar"><span><i/> NAIROBI / OUR BASE</span><span>DESIGN · FILM · DIGITAL</span><span>ALL OF KENYA / OPEN TO IDEAS</span></div>
    </div>
    <p className="vv-close-map-source">Map outlines: OCHA data via kenya-regions (MIT). All routes and city connections are creative illustrations of potential collaboration.</p>
  </div>;
}
