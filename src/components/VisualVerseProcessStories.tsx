import { useEffect, useRef, useState, type ReactNode } from "react";
import type { ServiceId } from "./visual-verse-service-detail-content";
import "../process-stories.css";

export type StoryKind = ServiceId | "overview";
type Chapter = readonly [string, string];
const chapters: Record<StoryKind, readonly Chapter[]> = {
  overview:[["THE CREATIVE BRIEF","Listen / understand / connect"],["THE ROADMAP","Research / scope / milestones"],["VISUAL DIRECTION","Concept / colour / composition"],["ONE CREATIVE TEAM","Design / film / photo / digital"],["THE FINAL CHECK","Review / refine / approve"],["READY TO GO","Export / deliver / launch"],["THE NEXT CHAPTER","Learn / evolve / create again"]],
  photography:[["THE SHOT BRIEF","People / place / feeling"],["THE CONTACT SHEET","Plan the light and shot list"],["THE LIGHTING SETUP","Set the mood before the shoot"],["THE VIEWFINDER","Capture a moment in focus"],["THE DIGITAL DARKROOM","Select / colour / retouch"],["THE FINAL GALLERY","Curated frames, ready to share"],["THE PHOTO ALBUM","A story worth keeping"]],
  videography:[["THE STORYBOARD","Opening / story / ending"],["THE TREATMENT","Script / sequence / rhythm"],["THE CALL SHEET","Locations / crew / equipment"],["THE FILM SET","Frame / record / monitor"],["THE EDIT SUITE","Picture / sound / colour"],["THE EXPORT DESK","Review / render / deliver"],["THE CUTDOWN STUDIO","One film, many formats"]],
  branding:[["BRAND DISCOVERY","Values / audience / voice"],["POSITIONING","Find the brand's territory"],["IDENTITY EXPLORATION","Construct a distinct mark"],["THE BRAND SYSTEM","Logo / type / colour"],["TOUCHPOINTS","Test the identity in context"],["THE BRAND BOOK","A system others can use"],["THE ROLLOUT","One identity, many expressions"]],
  "graphic-design":[["THE DESIGN BRIEF","Message / audience / format"],["THE REFERENCE WALL","Research patterns and context"],["THE CONCEPT BOARD","Explore visual routes"],["THE ARTBOARD","Compose with type and shape"],["THE PROOF","Check alignment and hierarchy"],["THE EXPORT DESK","Print, digital and source files"],["THE TEMPLATE SYSTEM","Keep the visual language consistent"]],
  "web-ui-ux":[["THE USER JOURNEY","User / need / goal"],["THE INFORMATION MAP","Organise the experience"],["THE WIREFRAME","Prototype the core flow"],["THE RESPONSIVE UI","Design across screen sizes"],["THE USABILITY TEST","Check the critical path"],["THE DEV HANDOFF","Components / tokens / states"],["THE NEXT ITERATION","Feedback shapes the next release"]],
  "social-media":[["THE AUDIENCE","People / voice / channels"],["THE CONTENT AUDIT","Illustrative content audit"],["THE CONTENT CALENDAR","Themes / formats / schedule"],["THE CREATIVE FEED","Create platform-ready assets"],["THE PUBLISH QUEUE","Review / approve / schedule"],["THE INSIGHT BOARD","Illustrative insights, not client data"],["THE NEXT CAMPAIGN","Learn / refine / repeat"]],
};

const mint="#2ec4b6", ink="#003f5c", deep="#062f40", mist="#d9f5ee", paper="#f6fcfa", mid="#55999f", frame="#326775";
const seq = (n:number) => Array.from({length:n},(_,i)=>i);
function Box({x,y,w,h,fill=deep,stroke=frame,r=9,children}:{x:number;y:number;w:number;h:number;fill?:string;stroke?:string;r?:number;children?:ReactNode}){
  return <g transform={`translate(${x} ${y})`}><rect width={w} height={h} rx={r} fill={fill} stroke={stroke}/>{children}</g>;
}
function Label({x,y,children,light=false,size=10}:{x:number;y:number;children:ReactNode;light?:boolean;size?:number}){
  return <text x={x} y={y} fill={light?ink:"#b5dedb"} fontSize={size} fontWeight="700" letterSpacing=".7">{children}</text>;
}
function Dot({x,y,colour=mint}:{x:number;y:number;colour?:string}){return <circle cx={x} cy={y} r="4" fill={colour} className="vv-ps-pulse"/>}
function Lines({x,y,w=86,count=3,colour=mid}:{x:number;y:number;w?:number;count?:number;colour?:string}){
  return <g>{seq(count).map(i=><rect className="vv-ps-pop" key={i} x={x} y={y+i*12} width={w*(i===count-1?.63:1)} height="4" rx="2" fill={colour} style={{animationDelay:i*.16+"s"}}/>)}</g>;
}
function Tick({x,y}:{x:number;y:number}){return <g className="vv-ps-pop"><circle cx={x} cy={y} r="9" fill={mint}/><path d={`M${x-4} ${y} l3 3 l5 -6`} fill="none" stroke={deep} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></g>}
function Path({d}:{d:string}){return <><path d={d} stroke={frame} strokeWidth="2" fill="none" strokeDasharray="4 5"/><path d={d} pathLength="100" className="vv-ps-flow-path" stroke={mint} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeDasharray="14 86"/></>}
function Tiles({labels,light=false}:{labels:readonly string[];light?:boolean}){
  return <g>{labels.map((v,i)=><Box key={v} x={18+i*138} y={42} w={128} h={116} fill={light?paper:deep} stroke={light?mist:frame}><g className="vv-ps-pop" style={{animationDelay:i*.25+"s"}}><circle cx="64" cy="38" r="19" fill={light?mist:"#194f59"}/><path d={i===0?"M54 38h20M64 28v20":i===1?"M54 45l10-17 10 17Z":"M50 38l8 8 19-20"} stroke={mint} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/><Label x={12} y={79} light={light}>{v}</Label><Lines x={12} y={92} w={88} count={1} colour={light?"#9ec2c0":mid}/></g></Box>)}</g>;
}
function Photo({x,y,w,h,variant=0}:{x:number;y:number;w:number;h:number;variant?:number}){
  const skies=["#bcece5","#669ca6","#e5d8bc","#9ad2d0"], hills=["#26727c","#063f5d","#826e50","#347b77"];
  return <g transform={`translate(${x} ${y}) scale(${w/150} ${h/100})`}>
    <rect width="150" height="100" rx="3" fill={skies[variant%4]}/>
    <circle cx="112" cy="25" r="14" fill="#e9f6d9"/>
    <path d="M0 68L33 32 69 75 103 47 150 86V100H0Z" fill={hills[variant%4]}/>
    <path d="M0 85L39 68 75 88 120 61 150 77V100H0Z" fill={deep} opacity=".84"/>
    <path d="M12 19v-8h8M130 11h8v8M138 81v8h-8M20 89h-8v-8" stroke={paper} strokeWidth="1.8" fill="none"/>
  </g>;
}
function FilmStrip({y=119}:{y?:number}){return <Box x={17} y={y} w={406} h={52} fill="#0b3b4a"><g>{seq(7).map(i=><g key={i}><Photo x={9+i*56} y={8} w={50} h={34} variant={i}/><rect x={13+i*56} y="3" width="5" height="2" fill={mid}/></g>)}<rect className="vv-ps-slide" x="10" y="3" width="2" height="46" rx="1" fill={mint}/></g></Box>}
function Layout({x,y,w,h,mobile=false,bright=false}:{x:number;y:number;w:number;h:number;mobile?:boolean;bright?:boolean}){
  return <Box x={x} y={y} w={w} h={h} fill={paper} stroke="#98c8c6" r={mobile?12:7}>
    <rect x="0" y="0" width={w} height="16" rx="5" fill="#c9e7e4"/><circle cx="7" cy="8" r="2" fill={mint}/><circle cx="14" cy="8" r="2" fill={mid}/>
    <rect x="8" y="25" width={w-16} height={h*.36} rx="4" fill={bright?ink:"#c8e4e0"}/>
    <Lines x={13} y={33} w={w*.44} count={2} colour={bright?mist:mid}/>
    {seq(mobile?2:3).map(i=><g key={i}><rect className="vv-ps-pop" x={8+i*(w-12)/(mobile?2:3)} y={h*.59} width={(w-22)/(mobile?2:3)} height={h*.26} rx="4" fill={bright&&i===0?mint:"#d5e9e7"} style={{animationDelay:i*.16+"s"}}/></g>)}
  </Box>;
}
function Logo({x=220,y=90,scale=1,colour=mint}:{x?:number;y?:number;scale?:number;colour?:string}){
  return <g transform={`translate(${x} ${y}) scale(${scale})`}><g className="vv-ps-logo-motion"><path d="M-34 -21L-9 33 3 8 16 33 42 -21H24L15 3 3 -20 -9 3 -18 -21Z" fill={colour}/><circle cx="3" cy="-20" r="4" fill={paper}/></g></g>;
}
function Swatches({x=20,y=138}:{x?:number;y?:number}){return <g>{[ink,mint,paper,"#82a9a3"].map((c,i)=><rect className="vv-ps-pop" key={c} x={x+i*45} y={y} width="39" height="25" rx="3" fill={c} stroke={frame} style={{animationDelay:i*.16+"s"}}/>)}</g>}
function Board({labels,active=1}:{labels:readonly string[];active?:number}){
  return <g>{labels.map((l,i)=><g key={l}><path d={`M90 ${36+i*42} H350`} stroke={frame} strokeWidth="1"/><Label x={18} y={40+i*42}>{l}</Label><rect x={94+i*29} y={25+i*42} rx="4" width={Math.max(68,221-i*37)} height="21" fill={i===active?mint:"#235764"} className={i===active?"vv-ps-grow":"vv-ps-pop"}/>{i<active&&<Tick x={397} y={36+i*42}/>}</g>)}</g>;
}
function Network({names,centre}:{names:readonly string[];centre:string}){
  return <g>{names.map((name,i)=>{const x=i%2?316:20,y=i<2?22:113;return <g key={name}><Path d={`M${x+52} ${y+20} Q220 ${y+20} 220 93`}/><Box x={x} y={y} w={104} h={42} fill={deep}><Dot x={12} y={21}/><Label x={24} y={25}>{name}</Label></Box></g>})}<Box x={165} y={61} w={110} h={63} fill={mint} stroke={mint}><Label x={14} y={35} light size={11}>{centre}</Label></Box></g>;
}
function Package({labels}:{labels:readonly string[]}){return <g>{labels.map((l,i)=><Box key={l} x={25+i*137} y={24+i*8} w={112} h={132} fill={paper} stroke={mist}><path d="M24 18h42l22 22v45H24Z" fill="#c8e7e2"/><path d="M66 18v22h22" fill="none" stroke={mid}/><Label x={18} y={104} light>{l}</Label><Tick x={93} y={18}/></Box>)}</g>}
function Chart({labels}:{labels:readonly string[]}){return <g><Box x={20} y={23} w={400} h={140}><g>{seq(4).map(i=><path key={i} d={`M15 ${32+i*25} H385`} stroke={frame} strokeWidth=".5"/>)}</g>{labels.map((l,i)=><g key={l}><rect x={38+i*99} y={105-i*17} width="45" height={15+i*17} rx="4" fill={i===3?mint:"#3b8390"} className="vv-ps-grow" style={{animationDelay:i*.19+"s"}}/><Label x={28+i*99} y={135}>{l}</Label></g>)}<path d="M52 97L151 76 250 82 349 32" stroke={mint} pathLength="100" className="vv-ps-draw" strokeWidth="2" fill="none"/></Box></g>}
function Scene({kind,step}:{kind:StoryKind;step:number}):ReactNode{
  if(kind==="photography"){
    switch(step){
      case 0:return <><Photo x={22} y={22} w={195} h={137} variant={0}/><Box x={230} y={18} w={189} h={143}><Label x={14} y={26}>THE SHOOT BRIEF</Label>{["PEOPLE","PLACE","FEELING"].map((l,i)=><g key={l}><Dot x={17} y={51+i*26}/><Label x={31} y={55+i*26}>{l}</Label></g>)}</Box><rect x="80" y="51" width="75" height="60" fill="none" stroke={mint} strokeWidth="2" className="vv-ps-focus"/></>;
      case 1:return <><Photo x={23} y={15} w={129} h={84}/><Photo x={163} y={15} w={129} h={84} variant={1}/><Photo x={303} y={15} w={114} h={84} variant={2}/>{["PORTRAIT","DETAIL","WIDE"].map((label,i)=><Box key={label} x={23+i*134} y={116} w={124} h={43}><Label x={10} y={25}>{label}</Label><Tick x={108} y={21}/></Box>)}<rect x="20" y="12" width="135" height="90" rx="5" fill="none" stroke={mint} strokeWidth="2" className="vv-ps-pulse"/></>;
      case 2:return <><path d="M82 45L198 120M362 45L242 120" stroke={mint} strokeWidth="1.5" strokeDasharray="7 5" className="vv-ps-pulse"/><path d="M70 32l35 15-20 35-35-15Z M370 32l-35 15 20 35 35-15Z" fill={paper}/><circle cx="220" cy="94" r="18" fill={mint}/><path d="M180 152q0-45 40-45t40 45" fill="#235764"/><Label x={20} y={20}>KEY LIGHT</Label><Label x={321} y={20}>FILL LIGHT</Label><Label x={179} y={174}>SUBJECT</Label></>;
      case 3:return <><Photo x={32} y={10} w={376} h={159} variant={1}/><rect x="181" y="62" width="78" height="52" rx="2" stroke={mint} strokeWidth="2" fill="none" className="vv-ps-focus"/><circle cx="45" cy="23" r="5" fill={mint} className="vv-ps-pulse"/><Label x={55} y={27}>AF / RAW</Label><rect x="28" y="10" width="384" height="159" fill={paper} opacity="0" className="vv-ps-shutter"/></>;
      case 4:return <><Photo x={23} y={22} w={187} h={130} variant={2}/><Photo x={230} y={22} w={187} h={130} variant={0}/><rect x="207" y="20" width="3" height="134" fill={mint} className="vv-ps-pulse"/><Label x={25} y={17}>BEFORE</Label><Label x={232} y={17}>AFTER / GRADE</Label><Swatches x={133} y={158}/></>;
      case 5:return <g>{seq(6).map(i=><g key={i} className="vv-ps-pop" style={{animationDelay:i*.15+"s"}}><Photo x={23+i%3*133} y={12+Math.floor(i/3)*81} w={124} h={74} variant={i}/><Tick x={133+i%3*133} y={24+Math.floor(i/3)*81}/></g>)}</g>;
      default:return <><Box x={42} y={16} w={356} h={156} fill={paper} stroke={mist}><Photo x={12} y={12} w={157} h={121}/><Photo x={187} y={12} w={157} h={121} variant={3}/><path d="M178 4v148" stroke={mid}/><path d="M12 143h157m18 0h157" stroke={mid}/></Box><path className="vv-ps-draw" d="M55 169Q220 177 385 169" stroke={mint} fill="none" pathLength="100" strokeWidth="2"/></>;
    }
  }
  if(kind==="videography"){
    switch(step){
      case 0:return <><Label x={19} y={19}>OPENING</Label><Label x={160} y={19}>STORY</Label><Label x={301} y={19}>ENDING</Label>{seq(3).map(i=><g key={i} className="vv-ps-pop" style={{animationDelay:i*.2+"s"}}><Photo x={19+i*137} y={30} w={127} h={84} variant={i}/><Lines x={19+i*137} y={126} count={2}/></g>)}<Path d="M30 160H410"/></>;
      case 1:return <><Box x={19} y={17} w={168} h={146} fill={paper} stroke={mist}><Label x={12} y={22} light>TREATMENT / 01</Label><Lines x={12} y={43} w={142} count={6} colour="#8bb4b3"/></Box><Photo x={205} y={17} w={215} h={100} variant={3}/><Path d="M205 140h215"/><Label x={206} y={159}>NARRATIVE / RHYTHM</Label></>;
      case 2:return <><Board labels={["CREW","LOCATIONS","EQUIPMENT","SHOTS"]} active={2}/></>;
      case 3:return <><Photo x={22} y={8} w={396} h={109} variant={1}/><circle cx="36" cy="21" r="4.5" fill="#ed856d" className="vv-ps-pulse"/><Label x={46} y={25}>REC</Label><FilmStrip/></>;
      case 4:return <><Photo x={131} y={5} w={179} h={75} variant={2}/><Box x={17} y={87} w={406} h={87}><g>{seq(3).map(i=><g key={i}>{seq(4).map(j=><rect key={j} x={10+j*94+(i%2)*8} y={9+i*23} width={86-(j%2)*8} height="17" rx="3" fill={i===0?"#377c8b":i===1?mint:"#779ca1"}/>)}</g>)}<rect x="12" y="0" width="2" height="86" fill={paper} className="vv-ps-slide"/></g></Box></>;
      case 5:return <><Board labels={["MASTER","VERTICAL","CAPTIONS","AUDIO"]} active={3}/><Tick x={404} y={162}/></>;
      default:return <><Photo x={20} y={30} w={185} h={100} variant={1}/><Photo x={222} y={35} w={100} h={100} variant={1}/><Photo x={340} y={11} w={80} h={149} variant={1}/><Label x={20} y={153}>16:9</Label><Label x={222} y={153}>1:1</Label><Label x={339} y={176}>9:16</Label><Path d="M30 169H330"/></>;
    }
  }
  if(kind==="branding"){
    switch(step){
      case 0:return <><g stroke={mid} fill="none"><circle cx="220" cy="90" r="73"/><circle cx="220" cy="90" r="56" strokeDasharray="3 5"/><path d="M145 90H295M220 18v144"/></g><Logo/><Path d="M108 32L165 53M332 32L275 53M108 148L165 127M332 148L275 127"/>{["VALUES","PEOPLE","VOICE","VISION"].map((l,i)=><Box x={i%2?332:20} y={i<2?16:132} w={88} h={30} key={l}><Label x={9} y={19}>{l}</Label></Box>)}</>;
      case 1:return <><Box x={97} y={12} w={246} h={150}><path d="M123 12V138M10 75H236" stroke={mid} strokeDasharray="4 4"/><Label x={12} y={20}>BOLD</Label><Label x={143} y={137}>REFINED</Label><circle cx="176" cy="39" r="18" stroke={mint} fill="none" className="vv-ps-focus"/><Dot x={176} y={39}/></Box><Label x={18} y={177}>POSITION / PERSONALITY / PURPOSE</Label></>;
      case 2:return <><g stroke={frame} strokeWidth="1" fill="none"><circle cx="220" cy="90" r="72"/><circle cx="220" cy="90" r="48"/><path d="M130 90h180M220 0v180M160 30l120 120M160 150L280 30" strokeDasharray="4 4"/></g><Logo scale={1.5}/><circle cx="220" cy="90" r="79" stroke={mint} pathLength="100" strokeDasharray="14 86" fill="none" className="vv-ps-flow-path"/></>;
      case 3:return <><Box x={22} y={18} w={192} h={140} fill={ink}><Logo x={95} y={57} scale={1.4}/><Label x={18} y={115}>PRIMARY MARK</Label></Box><Box x={229} y={18} w={188} h={140} fill={paper} stroke={mist}><text x="16" y="48" fontSize="34" fontWeight="800" fill={ink}>Aa</text><Label x={16} y={71} light>TYPE SYSTEM</Label><Swatches x={9} y={95}/></Box></>;
      case 4:return <><Box x={21} y={38} w={155} h={100} fill={paper} stroke={mist}><Logo x={75} y={49} colour={ink} scale={.8}/></Box><Box x={185} y={15} w={108} h={148} fill={ink}><Logo x={53} y={64} scale={.9}/><Label x={11} y={122}>IDENTITY</Label></Box><Layout x={306} y={20} w={108} h={139} mobile bright/></>;
      case 5:return <><Box x={50} y={15} w={340} h={150} fill={paper} stroke={mist}><rect width="160" height="150" rx="9" fill={ink}/><Logo x={80} y={61} scale={1.1}/><text x="17" y="114" fill={paper} fontSize="15" fontWeight="800">BRAND BOOK</text><Label x={178} y={24} light>USAGE / GUIDELINES</Label><Swatches x={167} y={39}/><Lines x={178} y={90} w={137} count={4}/></Box></>;
      default:return <><Box x={20} y={22} w={128} h={138} fill={ink}><Logo x={63} y={55} scale={1.25}/><Label x={17} y={114}>CAMPAIGN</Label></Box><Box x={161} y={40} w={116} h={104} fill={paper} stroke={mist}><Logo x={58} y={40} scale={.8} colour={ink}/><Label x={15} y={86} light>PRINT</Label></Box><Layout x={290} y={18} w={128} h={144} bright/><Path d="M148 90h13M277 90h13"/></>;
    }
  }
  if(kind==="graphic-design"){
    switch(step){
      case 0:return <Tiles labels={["MESSAGE","AUDIENCE","FORMAT"]} light/>;
      case 1:return <><Photo x={20} y={20} w={136} h={122}/><Box x={167} y={17} w={114} h={139} fill={paper} stroke={mist}><text x="12" y="54" fontSize="32" fill={ink} fontWeight="900">Aa</text><Lines x={13} y={77} w={86} colour={mid}/><Label x={13} y={126} light>TYPE</Label></Box><Box x={294} y={17} w={125} h={139} fill="#145663"><circle cx="62" cy="60" r="34" fill={mint} className="vv-ps-focus"/><path d="M25 96l37-48 37 48Z" fill={paper}/><Label x={12} y={126}>SHAPES</Label></Box></>;
      case 2:return <g>{seq(3).map(i=><Box key={i} x={25+i*136} y={18+i*8} w={115} h={137} fill={i===1?mint:paper} stroke={mist}><text x="12" y="35" fill={ink} fontSize="11" fontWeight="800">ROUTE 0{i+1}</text><circle cx="60" cy="72" r={25+i*4} fill={i===1?ink:mint} className="vv-ps-focus"/><text x="13" y="116" fill={ink} fontSize="20" fontWeight="900">IDEA.</text></Box>)}</g>;
      case 3:return <><Box x={77} y={9} w={285} h={160} fill={paper} stroke={mist}><rect x="20" y="17" width="245" height="125" fill={ink}/><text x="34" y="58" fontSize="29" fontWeight="900" fill={paper}>MAKE</text><text x="34" y="86" fontSize="29" fontWeight="900" fill={mint}>IT MATTER.</text><circle cx="214" cy="100" r="29" fill={mint} className="vv-ps-focus"/><rect x="14" y="11" width="257" height="137" fill="none" stroke={mint} strokeDasharray="4 4"/>{[[14,11],[271,11],[14,148],[271,148]].map(([x,y])=><rect key={x+":"+y} x={x-3} y={y-3} width="6" height="6" fill={mint}/>)}</Box><Path d="M40 70H76M362 120h38"/></>;
      case 4:return <><Box x={95} y={9} w={250} h={157} fill={paper} stroke={mist}><rect x="12" y="12" width="226" height="133" stroke={mint} strokeDasharray="3 4" fill="none"/><text x="27" y="51" fontSize="19" fontWeight="800" fill={ink}>THE HEADLINE</text><Lines x={27} y={68} w={167} count={4}/><path d="M27 20v115M17 55h216" stroke={mid} strokeDasharray="3 4" className="vv-ps-pulse"/></Box><Tick x={365} y={31}/><Tick x={365} y={73}/><Tick x={365} y={115}/></>;
      case 5:return <Package labels={["PRINT / PDF","DIGITAL / PNG","SOURCE / AI"]}/>;
      default:return <><Layout x={20} y={30} w={179} h={123} bright/><Box x={215} y={12} w={100} h={157} fill={paper} stroke={mist}><text x="12" y="40" fill={ink} fontWeight="800" fontSize="14">YOUR</text><text x="12" y="57" fill={ink} fontWeight="800" fontSize="14">STORY.</text><circle cx="50" cy="104" r="25" fill={mint} className="vv-ps-pulse"/></Box><Box x={332} y={39} w={84} h={84} fill={ink}><Logo x={41} y={40} scale={.7}/></Box></>;
    }
  }
  if(kind==="web-ui-ux"){
    switch(step){
      case 0:return <Network centre="USER GOAL" names={["NEED","CONTEXT","ACTION","OUTCOME"]}/>;
      case 1:return <><Path d="M220 52V83H83V111M220 83V111M220 83H357V111"/><Box x={164} y={16} w={112} h={36} fill={mint}><Label x={22} y={23} light>HOME</Label></Box>{["EXPLORE","DETAILS","CONTACT"].map((l,i)=><Box x={25+i*137} y={111} w={115} h={43} key={l}><Label x={13} y={26}>{l}</Label></Box>)}</>;
      case 2:return <><Layout x={30} y={28} w={162} h={123}/><Layout x={243} y={28} w={162} h={123}/><Path d="M192 94H243"/><circle cx="217" cy="94" r="5" fill={mint} className="vv-ps-pulse"/></>;
      case 3:return <><Layout x={20} y={17} w={259} h={144} bright/><Layout x={266} y={38} w={107} h={129} mobile bright/><Layout x={369} y={55} w={52} h={108} mobile bright/></>;
      case 4:return <><Layout x={36} y={12} w={247} h={154} bright/><circle cx="123" cy="101" r="19" stroke={mint} strokeWidth="3" fill="none" className="vv-ps-focus"/><Label x={306} y={35}>TEST FLOW</Label>{["NAV","TOUCH","ACCESS"].map((l,i)=><g key={l}><Tick x={315} y={62+i*40}/><Label x={329} y={66+i*40}>{l}</Label></g>)}</>;
      case 5:return <><Box x={20} y={15} w={195} h={150} fill={paper} stroke={mist}><Label x={12} y={23} light>DESIGN TOKENS</Label><Swatches x={10} y={38}/><rect x="12" y="82" width="80" height="26" rx="13" fill={mint}/><Label x={20} y={98} light>BUTTON</Label><Lines x={13} y={122} colour={mid}/></Box><Box x={230} y={15} w={190} h={150}><Label x={12} y={25}>COMPONENTS</Label><Lines x={12} y={43} w={151} count={5}/><path d="M14 116h150" stroke={mint} className="vv-ps-draw" pathLength="100"/></Box></>;
      default:return <Network centre="IMPROVE" names={["FEEDBACK","ANALYSE","DESIGN","RELEASE"]}/>;
    }
  }
  if(kind==="social-media"){
    switch(step){
      case 0:return <><Box x={25} y={14} w={390} h={151}><Label x={15} y={24}>AUDIENCE / PERSONAS</Label>{["DISCOVER","CONNECT","RETURN"].map((l,i)=><g key={l} className="vv-ps-pop" style={{animationDelay:i*.22+"s"}}><circle cx={66+i*129} cy="66" r="24" fill={i===1?mint:"#2a7080"}/><circle cx={66+i*129} cy="60" r="7" fill={paper}/><path d={"M"+(52+i*129)+" 79q14-20 28 0"} fill={paper}/><Label x={23+i*129} y={111}>{l}</Label><Lines x={25+i*129} y={121} w={77} count={1}/></g>)}</Box></>;
      case 1:return <Chart labels={["REACH","SAVES","CLICKS","IDEAS"]}/>;
      case 2:return <><Box x={19} y={15} w={402} h={150} fill={paper} stroke={mist}>{["MON","TUE","WED","THU","FRI"].map((d,i)=><g key={d}><Label x={11+i*79} y={21} light>{d}</Label>{seq(3).map(j=><rect key={j} x={9+i*79} y={32+j*35} width="69" height="27" rx="4" fill={(i+j)%3===0?mint:"#c6e6e0"} className="vv-ps-pop" style={{animationDelay:(i+j)*.12+"s"}}/>)}</g>)}</Box></>;
      case 3:return <><Box x={36} y={11} w={112} h={154} fill={paper} stroke={mist}><Photo x={7} y={24} w={98} h={80}/><Lines x={9} y={113} w={86}/></Box><Box x={165} y={11} w={112} h={154} fill={ink}><text x="10" y="58" fill={paper} fontSize="19" fontWeight="900">NEW</text><text x="10" y="82" fill={mint} fontSize="19" fontWeight="900">STORY.</text><Logo x={57} y={120} scale={.6}/></Box><Box x={294} y={11} w={112} h={154} fill={paper} stroke={mist}><Photo x={7} y={15} w={98} h={119} variant={3}/><path d="M51 65l16 10-16 10Z" fill={paper} className="vv-ps-pulse"/></Box></>;
      case 4:return <><Board labels={["POST","CAROUSEL","REEL","STORY"]} active={2}/></>;
      case 5:return <Chart labels={["VIEWS","SHARES","SAVES","CLICKS"]}/>;
      default:return <><circle cx="220" cy="90" r="61" fill="none" stroke={frame} strokeWidth="2"/><circle cx="220" cy="90" r="61" fill="none" stroke={mint} strokeWidth="3" pathLength="100" strokeDasharray="14 86" className="vv-ps-flow-path"/><Label x={192} y={94}>REPEAT</Label>{["LEARN","PLAN","CREATE","MEASURE"].map((l,i)=><Box key={l} x={[173,305,173,40][i]} y={[6,73,144,73][i]} w={94} h={28}><Label x={8} y={18}>{l}</Label></Box>)}</>;
    }
  }
  switch(step){
    case 0:return <><Box x={28} y={15} w={256} h={52} fill={paper} stroke={mist}><Dot x={17} y={17}/><Label x={30} y={22} light>WHAT ARE WE CREATING?</Label><Lines x={30} y={32} w={190} count={1}/></Box><Box x={155} y={79} w={259} h={59} fill={mint} stroke={mint}><Label x={16} y={22} light>LET'S FIND YOUR STORY.</Label><Lines x={16} y={35} w={210} colour={ink}/></Box><Path d="M40 159H399"/></>;
    case 1:return <Board labels={["RESEARCH","CONCEPT","PRODUCE","DELIVER"]} active={1}/>;
    case 2:return <><Photo x={19} y={13} w={197} h={143}/><Box x={231} y={13} w={190} h={143} fill={paper} stroke={mist}><text x="15" y="53" fill={ink} fontSize="29" fontWeight="900">MAKE IT</text><text x="15" y="83" fill={ink} fontSize="29" fontWeight="900">MATTER.</text><Swatches x={8} y={101}/></Box></>;
    case 3:return <Network centre="CREATE" names={["DESIGN","FILM","PHOTO","DIGITAL"]}/>;
    case 4:return <Tiles labels={["CHECK","REFINE","APPROVE"]} light/>;
    case 5:return <Package labels={["DESIGN","MEDIA","DIGITAL"]}/>;
    default:return <Network centre="GROW" names={["LEARN","EVOLVE","SUPPORT","CREATE"]}/>;
  }
}

/** Illustrative motion, not live client data. Only the visible scene animates. */
export function ProcessStoryArt({kind,step}:{kind:StoryKind;step:number}){
  const root=useRef<HTMLDivElement>(null);
  const [running,setRunning]=useState(false);
  useEffect(()=>{
    const node=root.current;
    if(!node)return;
    let visible=false;
    const sync=()=>setRunning(visible&&!document.hidden);
    const observer=typeof IntersectionObserver==="undefined"?null:new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync()},{threshold:.15});
    if(observer)observer.observe(node);else{visible=true;sync();}
    document.addEventListener("visibilitychange",sync);
    return()=>{observer?.disconnect();document.removeEventListener("visibilitychange",sync);};
  },[]);
  const chapter=chapters[kind][step]??chapters[kind][0];
  return <div className="vv-ps-card" data-story={kind} data-running={running} data-chapter={step+1} ref={root} aria-hidden="true">
    <div className="vv-ps-head"><span><i/> {chapter[0]}</span><small>STORY / 0{step+1}</small></div>
    <svg viewBox="0 0 440 180" className="vv-ps-illustration" fill="none" focusable="false"><Scene kind={kind} step={step}/></svg>
    <div className="vv-ps-foot"><span>{chapter[1]}</span><div>{seq(7).map(i=><i key={i} className={i<=step?"is-current":""}/>)}</div></div>
  </div>;
}
