import { useRef, useState } from "react";
import { Hand, Maximize2, RotateCcw, LayoutGrid } from "lucide-react";
import type { PortfolioArtwork } from "../../data/project-deliverables";
import { DraggableCardBody } from "./draggable-card";
import "./campaign-artwork-gallery.css";

// The two staggered rows overlap like a studio proofing table. Every item
// remains available through the native select, even when another covers it.
const positions=[[3,8,-8],[19,3,4],[35,9,-5],[51,4,6],[67,8,-4],[83,4,7],[9,39,6],[25,45,-6],[41,37,5],[57,43,-7],[73,35,5],[4,45,-9],[44,4,3],[77,43,-4]];
const smallCollectionPositions=[[3,9,-8],[28,5,4],[55,10,-5],[80,7,6],[10,43,6],[36,45,-6],[60,38,5],[79,44,-4]];
const spreadPositions=[[5,16,-5],[78,30,5]];
const asset=(path:string)=>import.meta.env.BASE_URL+path;

export function CampaignArtworkGallery({items,title,collectionLabel}:{items:PortfolioArtwork[];title:string;collectionLabel:string}) {
  const board=useRef<HTMLDivElement>(null);
  const [selected,setSelected]=useState(items.length-1);
  const [order,setOrder]=useState(()=>items.map((_,index)=>index));
  const [generation,setGeneration]=useState(0);
  const [expanded,setExpanded]=useState(false);
  const select=(index:number)=>{setSelected(index);setOrder(previous=>previous.at(-1)===index?previous:[...previous.filter(item=>item!==index),index]);};
  const reset=()=>{setGeneration(value=>value+1);setOrder(items.map((_,index)=>index));setSelected(items.length-1);setExpanded(false);};
  const print=title==="Print collateral";
  const arrangement=print&&items.length===2?spreadPositions:items.length<=8?smallCollectionPositions:positions;
  const campaign=title==="Campaign graphics";
  return <section className="vv-campaign-gallery" aria-label={`${title} artwork`}>
    <div className="vv-campaign-toolbar"><span className="vv-campaign-drag"><Hand size={18} aria-hidden="true"/> Drag to view</span><span className="vv-campaign-count">{collectionLabel} · {items.length} {print?"sides":"designs"}</span></div>
    <div className={`vv-campaign-board${items.length<=8?" vv-campaign-board--compact":""}${print?" vv-campaign-board--spreads":""}${expanded?" vv-campaign-board--preview":""}`} ref={board} data-artwork-board aria-label={`Draggable ${title.toLowerCase()} designs`}>
      <div className="vv-campaign-board-mark" aria-hidden="true">{collectionLabel.toUpperCase()} <span>{print?"PRINT / COLLATERAL":campaign?"CAMPAIGN / GRAPHICS":"EDITORIAL / POSTERS"}</span></div>
      {items.map((item,index)=>{const [x,y,rotation]=arrangement[index%arrangement.length];return <DraggableCardBody key={`${generation}-${item.image}`} constraints={board} x={x} y={y} rotation={rotation} layer={order.indexOf(index)+1} aspectRatio={item.width/item.height} label={`Select artwork: ${item.title}`} selected={index===selected} onSelect={()=>select(index)}><img src={asset(item.image)} alt={item.title} width={item.width} height={item.height} draggable={false} decoding="async"/></DraggableCardBody>;})}
      {expanded&&<div className="vv-campaign-preview"><img src={asset(items[selected].image)} alt={items[selected].title} width={items[selected].width} height={items[selected].height} draggable={false}/></div>}
    </div>
    <div className="vv-campaign-actions">
      <label><span>Artwork</span><select aria-label={`Choose ${print?"print":campaign?"campaign":"editorial"} artwork`} value={selected} onChange={event=>{select(Number(event.target.value));setExpanded(true);}}>{items.map((item,index)=><option value={index} key={item.image}>{String(index+1).padStart(2,"0")} · {item.title}</option>)}</select></label>
      <button type="button" onClick={()=>setExpanded(value=>!value)}>{expanded?<LayoutGrid size={16}/>:<Maximize2 size={16}/>} {expanded?"Back to cards":"View artwork"}</button>
      <button type="button" onClick={reset}><RotateCcw size={16}/> Reset</button>
    </div>
  </section>;
}
