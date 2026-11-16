import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const root=resolve('dist'),prefix='/visual-verse-creations/';
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp'};
const srv=createServer(async(req,res)=>{try{const p=resolve(root,decodeURIComponent(new URL(req.url,'http://localhost').pathname.replace(prefix,''))||'index.html');res.setHeader('Content-Type',mime[extname(p)]||'application/octet-stream');res.end(await readFile(p))}catch{res.statusCode=404;res.end()}});await new Promise(r=>srv.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+srv.address().port+prefix;
const b=await chromium.launch();
const paths=['','about.html','services.html','who-we-serve.html','projects.html','contact.html','request-quote.html',...['graphic-design','photography','web-ui-ux','videography','branding','social-media'].map(s=>'services.html?service='+s)];
for(const width of [1440,390]){
 const ctx=await b.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
 for(const path of paths){
  const page=await ctx.newPage();await page.goto(base+path,{waitUntil:'domcontentloaded'});await page.locator('main h1').first().waitFor({state:'attached',timeout:20000});await page.locator('footer').first().waitFor({state:'attached',timeout:20000});await page.evaluate(()=>document.fonts.ready);
  const data=await page.evaluate(()=>{const elts=[...document.querySelectorAll('main h1,main h2,main h3,main .vv-about-headline,main .vv-section-h,.vv-cta-headline')];return [...new Set(elts)].filter(e=>{const s=getComputedStyle(e);return e.getBoundingClientRect().width>0&&parseFloat(s.fontSize)>=23}).map(e=>{const lines=[];const walker=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);let node;while(node=walker.nextNode()){for(const m of node.nodeValue.matchAll(/\S+/g)){const r=document.createRange();r.setStart(node,m.index);r.setEnd(node,m.index+m[0].length);const rc=r.getBoundingClientRect();if(!rc.width||!rc.height)continue;const y=rc.y+rc.height/2;let l=lines.find(l=>Math.abs(l[0]-y)<8);if(!l){l=[y,[]];lines.push(l)}l[1].push(m[0]);}}return {t:e.textContent.replace(/\s+/g,' ').trim(),l:lines.sort((a,b)=>a[0]-b[0]).map(l=>l[1].join(' ')),c:e.className,id:e.id};})});
  console.log('LAYOUT '+JSON.stringify({width,path,data}));await page.close();
 }
 await ctx.close();
}
await b.close();srv.close();
