/**
 * Visual Verse hero-only isometric cubes.
 * Reuses the original Aceternity-inspired Canvas geometry and pointer wave
 * from index.html. No third-party runtime or React state per frame.
 * Home retains its established implementation; all other public heroes share
 * this renderer. Dark heroes keep their existing contrast.
 */
const heroSelector = [
  ".vv-about-hero",
  ".vv-sv-hero--impractical",
  ".vv-sv-hero--potadot",
  ".vv-detail-hero",
  ".vvx-hero",
  ".vv-pj-hero",
  ".vv-inner-hero",
].join(",");

type Tile = {x:number;y:number;a:number;b:number};
type Point = [number,number];

function attachHeroCubes(hero:HTMLElement):()=>void {
  const canvas=document.createElement("canvas");
  canvas.className="vv-shared-hero-cubes";
  canvas.setAttribute("aria-hidden","true");
  const ctx=canvas.getContext("2d",{alpha:true});
  if(!ctx)return ()=>{};
  const base=document.createElement("canvas");
  const baseCtx=base.getContext("2d",{alpha:true});
  if(!baseCtx)return ()=>{};
  const dark=hero.matches(".vvx-hero,.vv-contact-signal-hero");
  hero.classList.add("vv-has-hero-cubes");
  hero.prepend(canvas);
  const color=dark
    ? {top:"#06394c",topLit:"#2ec4b6",left:"#053346",right:"#042c40",edge:"rgba(137,224,211,.15)"}
    : {top:"#ffffff",topLit:"#2ec4b6",left:"#ebf9f6",right:"#d8f2ef",edge:"rgba(0,63,92,.16)"};
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
  const coarse=window.matchMedia("(pointer: coarse)");
  let width=0,height=0,dpr=1,tiles:Tile[]=[],frame=0,visible=false,lastDraw=0;
  let pointer={x:0,y:0,clientX:0,clientY:0,active:false,energy:0,dirty:false};
  // Cache colours so the moving wave does not repeatedly parse hex strings.
  function palette(a:string,b:string,multiplier:number){
    const x=parseInt(a.slice(1),16),y=parseInt(b.slice(1),16);
    return Array.from({length:101},(_,i)=>{
      const t=i/100*multiplier;
      const channel=(shift:number)=>(((x>>shift)&255)*(1-t)+((y>>shift)&255)*t)|0;
      return "rgb("+channel(16)+","+channel(8)+","+channel(0)+")";
    });
  }
  const left=palette(color.left,color.topLit,.40);
  const right=palette(color.right,color.topLit,.33);
  const top=palette(color.top,color.topLit,.95);
  function poly(context:CanvasRenderingContext2D,points:Point[],fill:string){
    context.beginPath();context.moveTo(points[0][0],points[0][1]);
    for(let i=1;i<points.length;i++)context.lineTo(points[i][0],points[i][1]);
    context.closePath();context.fillStyle=fill;context.fill();
  }
  function tile(context:CanvasRenderingContext2D,t:Tile,wave:number){
    const index=Math.round(wave*100),depth=3+wave*13;
    const x=t.x,y=t.y-wave*23,a=t.a,b=t.b;
    const L:Point=[x-a,y],T:Point=[x,y-b],R:Point=[x+a,y],B:Point=[x,y+b];
    poly(context,[L,B,[B[0],B[1]+depth],[L[0],L[1]+depth]],left[index]);
    poly(context,[B,R,[R[0],R[1]+depth],[B[0],B[1]+depth]],right[index]);
    poly(context,[L,T,R,B],top[index]);
    context.beginPath();context.moveTo(L[0],L[1]);context.lineTo(T[0],T[1]);context.lineTo(R[0],R[1]);
    context.strokeStyle=color.edge;context.lineWidth=.55;context.stroke();
  }
  function restore(){
    ctx!.setTransform(dpr,0,0,dpr,0,0);
    ctx!.clearRect(0,0,width,height);
    ctx!.drawImage(base,0,0,width,height);
  }
  function resize(){
    const w=Math.max(1,Math.round(hero.clientWidth)),h=Math.max(1,Math.round(hero.clientHeight));
    const ratio=Math.min(window.devicePixelRatio||1,coarse.matches?1:1.4);
    if(w===width&&h===height&&ratio===dpr&&tiles.length)return;
    width=w;height=h;dpr=ratio;
    canvas.width=base.width=Math.round(width*dpr);
    canvas.height=base.height=Math.round(height*dpr);
    baseCtx!.setTransform(dpr,0,0,dpr,0,0);
    const half=Math.max(32,Math.min(58,Math.floor(width/21)));
    const halfH=half*.47;
    tiles=[];
    for(let row=-2;row<Math.ceil(height/halfH)+3;row++){
      for(let col=-2;col<Math.ceil(width/(half*2))+3;col++){
        tiles.push({x:col*half*2+(row%2?half:0),y:row*halfH,a:half,b:halfH});
      }
    }
    for(const t of tiles)tile(baseCtx!,t,0);
    pointer.dirty=true;
    restore();
  }
  function draw(now:number){
    // Paint the cached static cube grid in one blit; only recalculate tiles
    // within the visible pointer wave and a small surrounding overlap margin.
    restore();
    if(pointer.energy<.005)return;
    const radius=560;
    ctx!.save();
    ctx!.beginPath();
    ctx!.rect(pointer.x-radius,pointer.y-radius,radius*2,radius*2);
    ctx!.clip();
    ctx!.clearRect(pointer.x-radius,pointer.y-radius,radius*2,radius*2);
    for(const t of tiles){
      const dx=t.x-pointer.x,dy=t.y-pointer.y;
      if(Math.abs(dx)>radius+t.a+25||Math.abs(dy)>radius+t.b+40)continue;
      const distance=Math.hypot(dx,dy);
      const wave=Math.max(0,Math.min(1,pointer.energy*Math.exp(-distance/230)*(.45+.55*Math.cos(distance*.026-now*.007))));
      // Fade the effect to zero before the edge of the cached region.
      const fade=Math.max(0,Math.min(1,(radius-75-Math.max(Math.abs(dx),Math.abs(dy)))/100));
      tile(ctx!,t,wave*fade);
    }
    ctx!.restore();
  }
  function stop(){if(frame)cancelAnimationFrame(frame);frame=0;lastDraw=0;}
  function tick(now:number){
    frame=0;
    if(!visible||reduced.matches||document.hidden)return;
    const interval=coarse.matches?50:33;
    if(lastDraw&&now-lastDraw<interval-1){frame=requestAnimationFrame(tick);return;}
    const dt=lastDraw?Math.min(80,now-lastDraw):interval;lastDraw=now;
    if(pointer.dirty){
      const rect=hero.getBoundingClientRect();
      pointer.x=pointer.clientX-rect.left;pointer.y=pointer.clientY-rect.top;
      pointer.dirty=false;
    }
    pointer.energy+=(Number(pointer.active)-pointer.energy)*(1-Math.exp(-dt/450));
    if(!pointer.active&&pointer.energy<.005){pointer.energy=0;restore();lastDraw=0;return;}
    draw(now);
    frame=requestAnimationFrame(tick);
  }
  function start(){
    if(!frame&&visible&&!document.hidden&&!reduced.matches&&(pointer.active||pointer.energy>=.005))frame=requestAnimationFrame(tick);
  }
  function move(event:PointerEvent){
    if(event.pointerType==="touch"&&event.type==="pointermove"&&event.buttons===0)return;
    pointer.clientX=event.clientX;pointer.clientY=event.clientY;pointer.dirty=true;pointer.active=true;start();
  }
  function leave(){pointer.active=false;start();}
  function hide(){pointer.active=false;pointer.energy=0;stop();restore();}
  function onVisibility(){if(document.hidden)hide();else start();}
  function onPreference(){if(reduced.matches)hide();}
  function onScroll(){if(pointer.active){pointer.dirty=true;start();}}
  hero.addEventListener("pointermove",move,{passive:true});
  hero.addEventListener("pointerdown",move,{passive:true});
  hero.addEventListener("pointerleave",leave,{passive:true});
  hero.addEventListener("pointerup",leave,{passive:true});
  hero.addEventListener("pointercancel",leave,{passive:true});
  window.addEventListener("blur",hide);
  window.addEventListener("scroll",onScroll,{passive:true});
  document.addEventListener("visibilitychange",onVisibility);
  reduced.addEventListener("change",onPreference);
  const observer=typeof IntersectionObserver!=="undefined"?new IntersectionObserver(([entry])=>{
    visible=entry.isIntersecting;
    if(visible)start();else hide();
  },{threshold:.01}):null;
  if(observer)observer.observe(hero);else visible=true;
  const resizeObserver=typeof ResizeObserver!=="undefined"?new ResizeObserver(resize):null;
  if(resizeObserver)resizeObserver.observe(hero);else window.addEventListener("resize",resize,{passive:true});
  resize();
  return ()=>{
    stop();observer?.disconnect();resizeObserver?.disconnect();
    hero.removeEventListener("pointermove",move);hero.removeEventListener("pointerdown",move);
    hero.removeEventListener("pointerleave",leave);hero.removeEventListener("pointerup",leave);hero.removeEventListener("pointercancel",leave);
    window.removeEventListener("blur",hide);window.removeEventListener("scroll",onScroll);window.removeEventListener("resize",resize);
    document.removeEventListener("visibilitychange",onVisibility);reduced.removeEventListener("change",onPreference);
    canvas.remove();hero.classList.remove("vv-has-hero-cubes");
  };
}

export function mountHeroCubes(){
  // The static homepage already owns exactly this effect. Do not double mount.
  if(document.getElementById("vvHeroCubes")||document.getElementById("vv-shared-hero-cube-styles"))return;
  const style=document.createElement("style");
  style.id="vv-shared-hero-cube-styles";
  style.textContent=`
    .vv-has-hero-cubes{position:relative;isolation:isolate;overflow:hidden}
    .vv-has-hero-cubes>.vv-shared-hero-cubes{position:absolute;inset:0;width:100%;height:100%;z-index:-1;display:block;pointer-events:none;user-select:none;opacity:.88}
    .vvx-hero.vv-has-hero-cubes>.vv-shared-hero-cubes,.vv-contact-signal-hero.vv-has-hero-cubes>.vv-shared-hero-cubes{opacity:.56}
    .vv-sv-hero--impractical.vv-has-hero-cubes::before,.vv-contact-signal-hero.vv-has-hero-cubes::before,.vv-pj-hero.vv-has-hero-cubes::before{display:none}
    @media(max-width:760px){.vv-has-hero-cubes>.vv-shared-hero-cubes{opacity:.76}.vvx-hero.vv-has-hero-cubes>.vv-shared-hero-cubes,.vv-contact-signal-hero.vv-has-hero-cubes>.vv-shared-hero-cubes{opacity:.48}}
  `;
  document.head.appendChild(style);
  let attached:HTMLElement|null=null,cleanup:(()=>void)|null=null,scanFrame=0;
  const scan=()=>{
    scanFrame=0;
    const hero=document.querySelector<HTMLElement>(heroSelector);
    if(hero===attached)return;
    cleanup?.();attached=hero;cleanup=hero?attachHeroCubes(hero):null;
  };
  const observer=new MutationObserver(records=>{
    if(attached&&!attached.isConnected||records.some(record=>[...record.addedNodes].some(node=>node instanceof HTMLElement&&(node.matches(heroSelector)||node.querySelector(heroSelector))))){
      if(!scanFrame)scanFrame=requestAnimationFrame(scan);
    }
  });
  observer.observe(document.body,{childList:true,subtree:true});
  scan();
}
