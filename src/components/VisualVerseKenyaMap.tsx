import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { countyOutlines } from "kenya-regions/outlines";
import { MapPin, Compass, Globe2 } from "lucide-react";

/** True county polygons (OCHA-derived, approximately 1-km simplification).
 * Nairobi is the confirmed base. Other counties are shown as neutral
 * service-enquiry locations, not claimed completed-project impact. */
const cities=[
  {name:"Nairobi",county:"Nairobi",lat:-1.2921,lon:36.8219},
  {name:"Mombasa",county:"Mombasa",lat:-4.0435,lon:39.6682},
  {name:"Kisumu",county:"Kisumu",lat:-.1022,lon:34.7617},
  {name:"Nakuru",county:"Nakuru",lat:-.3031,lon:36.08},
  {name:"Eldoret",county:"Uasin Gishu",lat:.5143,lon:35.2698},
  {name:"Nyeri",county:"Nyeri",lat:-.4201,lon:36.9476},
  {name:"Thika",county:"Kiambu",lat:-1.0333,lon:37.0693},
  {name:"Malindi",county:"Kilifi",lat:-3.2192,lon:40.1169}
];
const W=750,H=690;
const project=(p:number[])=>[(p[0]-33.75)/8.35*W,(5.7-p[1])/10.6*H] as const;
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

export function VisualVerseKenyaMap(){
  const [cityIndex,setCityIndex]=useState(0);
  const selected=cities[cityIndex];
  const cityMarkers=useMemo(()=>cities.map(c=>({...c,coords:project([c.lon,c.lat])})),[]);
  return (
    <div className="vv-close-location vv-map-v2">
      <div className="vv-close-location-heading">
        <div><span className="vv-close-eyebrow"><span/> WHERE WE SERVE / 006</span><h2>Made in Nairobi.<br/>Made for <em>Kenya.</em></h2></div>
        <div className="vv-close-location-summary"><p>We're based in Nairobi and open to creative collaborations across Kenya. Explore the cities and counties on the map, and talk to us about remote or on-location work.</p><div className="vv-close-location-meta"><span><MapPin size={15}/> NAIROBI HOME BASE</span><span><Globe2 size={15}/> COUNTRYWIDE ENQUIRIES</span></div></div>
      </div>
      <div className="vv-close-map-card">
        <div className="vv-close-map-top"><span>KENYA / 47 COUNTIES</span><div className="vv-close-map-legend">
          <span><i className="vv-close-legend-kenya"/> CONFIRMED BASE</span>
          <span><i className="vv-close-legend-neighbor"/> OTHER COUNTIES</span>
        </div></div>
        <div className="vv-close-map-stage vv-kenya-only-stage">
          <svg viewBox="0 0 750 690" role="img" aria-label="Geographic silhouette of Kenya showing all 47 counties. Nairobi county is highlighted as the confirmed home base. City markers show locations for project enquiries.">
            <defs>
              <pattern id="vv-county-grey" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.25" fill="#afc6bf"/></pattern>
              <pattern id="vv-county-aqua" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.7" fill="#18a791"/></pattern>
            </defs>
            <g>
              {outlines.map(c=>{
                const base=c.name.toLowerCase().includes("nairobi");
                const chosen=c.name.toLowerCase()===selected.county.toLowerCase();
                return <path key={c.id} d={c.path} fill={base?"url(#vv-county-aqua)":"url(#vv-county-grey)"}
                  stroke={base?"#149e90":chosen?"#237a79":"#d0dfd9"}
                  strokeWidth={base?2.2:chosen?2:1} vectorEffect="non-scaling-stroke"
                  fillRule="evenodd" />;
              })}
            </g>
            {cityMarkers.map((c,i)=>{
              const active=i===cityIndex;
              return <g key={c.name} transform={"translate("+c.coords[0]+","+c.coords[1]+")"} tabIndex={0} role="button"
                aria-label={"Show "+c.name+", "+c.county+" County"} aria-pressed={active}
                onClick={()=>setCityIndex(i)} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();setCityIndex(i);}}}
                className={"vv-close-map-marker"+(active?" is-active":"")}>
                <circle r={active?15:10} fill={active?"rgba(46,196,182,.22)":"rgba(0,63,92,.08)"}/>
                <circle r={active?6.5:4.5} fill={i===0?"#003f5c":"#119e8f"} stroke="#fff" strokeWidth="2"/>
                {(active||i===0)&&<text x="11" y="-10" className="vv-map-city-label">{c.name}</text>}
              </g>;
            })}
          </svg>
        </div>
        <div className="vv-close-map-bottom">
          <div><span className="vv-close-map-local-label">EXPLORE A KENYAN CITY</span><div className="vv-close-map-city-list">
            {cities.map((c,i)=><button key={c.name} type="button" aria-pressed={i===cityIndex} onClick={()=>setCityIndex(i)} className={i===cityIndex?"is-active":""}>{c.name}</button>)}
          </div></div>
          <div className="vv-close-map-city-info" aria-live="polite"><MapPin size={17}/><div><strong>{selected.name} · {selected.county}</strong><span>{cityIndex===0?"Studio home base":"Available for project enquiries"}</span></div></div>
        </div>
      </div>
      <p className="vv-close-map-source">County outlines: OCHA data via kenya-regions (MIT). Highlighted counties represent confirmed presence only; grey counties remain available for enquiries, not an assertion of no service.</p>
    </div>
  );
}
