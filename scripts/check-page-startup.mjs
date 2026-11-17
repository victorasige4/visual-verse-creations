import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname } from "node:path";
import { chromium } from "playwright";

const prefix = "/visual-verse-creations/";
const dist = resolve("dist");
const mime = {".html":"text/html",".js":"text/javascript",".css":"text/css",".svg":"image/svg+xml",".png":"image/png",".jpg":"image/jpeg",".webp":"image/webp",".woff2":"font/woff2"};
const server = createServer(async (req,res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    if (!url.pathname.startsWith(prefix)) throw new Error("Unrecognised path");
    const relative = decodeURIComponent(url.pathname.slice(prefix.length)) || "index.html";
    const file = resolve(dist, relative);
    if (!file.startsWith(dist + "/")) throw new Error("Invalid path");
    res.setHeader("Content-Type", mime[extname(file)] ?? "application/octet-stream");
    res.end(await readFile(file));
  } catch { res.statusCode=404; res.end("Not found"); }
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const base = "http://127.0.0.1:" + server.address().port + prefix;
const serviceIds = ["graphic-design","photography","web-ui-ux","videography","branding","social-media"];
const serviceNames = ["Graphic Design","Photography","Web & UI/UX Design","Videography","Branding & Identity","Social Media & Digital Marketing"];
const labels = async (page,selector) => (await page.locator(selector).allTextContents()).map(text=>text.trim());
async function checkProcess(page, viewport, path) {
  for (let i = 0; i < 7; i++) {
    await page.locator(".vv-sp-step-button").nth(i).evaluate(button=>button.click());
    await page.waitForFunction(n=>document.querySelector(".vv-sp-stage")?.getAttribute("data-active-step")===String(n) && document.querySelector(".vv-ps-card")?.getAttribute("data-chapter")===String(n),i+1);
    const active=page.locator(".vv-sp-step.is-active");
    const title=(await active.locator("strong").textContent()).trim();
    assert.equal((await page.locator(".vv-sp-stage-label span:last-child").textContent()).trim(),title,"Animation and timeline mismatch: "+path);
    const stage=await page.locator(".vv-sp-stage").boundingBox();
    const right=await page.locator(".vv-sp-right").boundingBox();
    assert.ok(stage && right && stage.y>=-2 && stage.y+stage.height<=viewport.height+2,"Process stage outside viewport: "+path);
    if(viewport.width>760) assert.ok(Math.abs(stage.y-right.y)<2 && Math.abs(stage.height-right.height)<2,"Process card and timeline misaligned: "+path);
    else {
      const caption=page.locator(".vv-sp-mobile-copy");
      assert.equal((await caption.locator("strong").textContent()).trim(),title);
      assert.equal((await caption.locator("p").textContent()).trim(),(await active.locator(".vv-sp-step-description").textContent()).trim());
      const rect=await caption.boundingBox();
      assert.ok(rect && rect.y+rect.height<=viewport.height+2 && rect.y>=stage.y+stage.height-2,"Mobile description clipped: "+path);
    }
  }
}
let browser;
try {
  browser = await chromium.launch({headless:true});
  const paths = ["", "about.html", "services.html", "who-we-serve.html", "projects.html", "contact.html", "request-quote.html",
    ...serviceIds.map(id=>"services.html?service="+id)];
  const messages = {"index":"Welcome TO Our Universe...","about":"Meet the minds behind the orbit...","services":"Choose your creative constellation...","who-we-serve":"Every orbit has a story...","projects":"A galaxy of ideas awaits...","contact":"Establishing first contact...","request-quote":"Plotting your next mission...","graphic-design":"Transmitting a new visual language...","photography":"Capturing light-years of memories...","web-ui-ux":"Launching your digital universe...","videography":"Putting stars in motion...","branding":"Finding your own constellation...","social-media":"Sending your signal across the galaxy..."};
  const routeMessage = path => {
    const url = new URL(base + path);
    const key = url.searchParams.get("service") || url.pathname.split("/").pop().replace(/\.html$/, "") || "index";
    return messages[key];
  };
  // Real motion: verify the overlay is still covering the hero while the
  // transmission is encrypted, and the final glyphs match before reveal.
  const motion = await browser.newContext({viewport:{width:1440,height:900},reducedMotion:"no-preference"});
  const motionPage = await motion.newPage();
  await motionPage.addInitScript(()=>{
    const observer = new MutationObserver(()=>{
      if(document.documentElement?.dataset.vvTextComplete!=="true")return;
      const text=[...document.querySelectorAll("#vv-page-loading .vv-boot-word")].map(word=>[...word.querySelectorAll(".vv-boot-letter-display")].map(el=>el.textContent).join("")).join(" ");
      window.vvDecodedAt=performance.now();
      window.addEventListener("vv-page-revealed",()=>{window.vvRevealAt=performance.now()},{once:true});
      window.vvDecodedSnapshot={text,covered:document.documentElement.hasAttribute("data-vv-boot"),boxes:!!document.querySelector("#vv-page-loading .vv-boot-boxes")};
      observer.disconnect();
    });
    observer.observe(document,{subtree:true,attributes:true,attributeFilter:["data-vv-text-complete"]});
  });
  for (const path of ["", "about.html", "services.html?service=photography"]) {
    await motionPage.goto(base+path,{waitUntil:"commit"});
    await motionPage.locator("#vv-page-loading .vv-boot-encrypted").waitFor({state:"visible"});
    assert.equal(await motionPage.locator("html").getAttribute("data-vv-message"),routeMessage(path));
    await motionPage.locator("html:not([data-vv-boot])").waitFor({state:"attached",timeout:20000});
    const result=await motionPage.evaluate(()=>window.vvDecodedSnapshot);
    assert.deepEqual(result,{text:routeMessage(path),covered:true,boxes:true},"Reveal before entire message decoded: "+path);
    const hold=await motionPage.evaluate(()=>window.vvRevealAt-window.vvDecodedAt);
    assert.ok(hold>=2450,"Decoded statement did not remain visible for 2.5 seconds: "+hold);
    console.log("Decoded message reading time: "+Math.round(hold)+"ms");
    assert.equal(await motionPage.locator("html").getAttribute("data-vv-page-ready"),"true");
    assert.equal(await motionPage.locator("html").getAttribute("data-vv-decrypted"),"true");
    assert.ok(await motionPage.evaluate(()=>scrollY<2),"Hero must be first after decoding");
    console.log("Animated transmission: "+(path||"home")+" passed");
  }
  // Verify the new hero photo, real canvas animation, and preserved side-to-side pointer tilt.
  await motionPage.goto(base+"who-we-serve.html",{waitUntil:"commit"});
  await motionPage.locator("#vv-page-loading .vv-boot-encrypted").waitFor({state:"visible"});
  await motionPage.locator("html:not([data-vv-boot])").waitFor({state:"attached",timeout:20000});
  const servingHero=motionPage.locator(".vvx-hero");
  const servingImage=servingHero.locator(".vvx-hero-stage img");
  assert.equal(await servingImage.count(),1,"Hero must contain exactly one photo");
  await servingImage.evaluate(img=>img.decode());
  assert.equal(await servingImage.evaluate(img=>img.naturalWidth),933);
  assert.ok((await servingImage.getAttribute("src")).endsWith("who-we-serve-creative-service.webp"));
  assert.equal((await servingHero.locator(".vvx-hero-disc").textContent()).trim(),"SERVING");
  // All audience assets are requested before users interact with the cards.
  await motionPage.waitForFunction(()=>["brands","businesses","founders","creators","events","digital"].every(id=>performance.getEntriesByType("resource").some(entry=>entry.name.endsWith(`audience-${id}-creative.webp`) && entry.responseEnd>0)));
  const servingCanvas=servingHero.locator(".vvx-hero-stage canvas");
  await servingCanvas.waitFor({state:"visible"});
  assert.ok(await servingCanvas.evaluate(canvas=>canvas.width>0&&canvas.height>0),"Loader canvas must be painted at its layout size");
  const heroBox=await servingHero.boundingBox();
  assert.ok(heroBox);
  await motionPage.mouse.move(heroBox.x+heroBox.width*.2, Math.min(heroBox.y+heroBox.height*.48,650));
  await motionPage.waitForFunction(()=>document.querySelector(".vvx-hero-stage-perspective")?.style.transform.includes("rotateY(-"));
  await motionPage.mouse.move(heroBox.x+heroBox.width*.8, Math.min(heroBox.y+heroBox.height*.48,650));
  await motionPage.waitForFunction(()=>{const transform=document.querySelector(".vvx-hero-stage-perspective")?.style.transform||"";return /rotateY\([1-9]/.test(transform);});
  console.log("Who We Serve: image decoded, live canvas and left/right tilt passed");
  // Warm internal navigation must replay the route's own transmission,
  // even when its HTML and shared scripts have already been cached.
  async function followFromHome(page, name, path, touch = false) {
    await page.goto(base,{waitUntil:"commit"});
    await page.locator("#vv-page-loading .vv-boot-encrypted").waitFor({state:"visible",timeout:10000});
    await page.locator("html:not([data-vv-boot])").waitFor({state:"attached",timeout:20000});
    const link = page.locator('[aria-label="Visual Verse Creations navigation"]').getByRole("link",{name,exact:true});
    await Promise.all([
      page.waitForURL(base+path,{waitUntil:"commit"}),
      touch ? link.tap() : link.click({noWaitAfter:true})
    ]);
    await page.locator("#vv-page-loading .vv-boot-encrypted").waitFor({state:"visible",timeout:10000});
    assert.equal(await page.locator("html").getAttribute("data-vv-message"),routeMessage(path));
    assert.ok(await page.evaluate(()=>document.documentElement.hasAttribute("data-vv-boot") && !!document.elementFromPoint(innerWidth/2,innerHeight/2)?.closest("#vv-page-loading")),"Navigation transmission not covering the hero: "+path);
    await page.locator("html:not([data-vv-boot])").waitFor({state:"attached",timeout:20000});
    assert.equal(await page.locator("html").getAttribute("data-vv-decrypted"),"true");
    assert.ok(await page.evaluate(()=>scrollY<2),"Navigation did not reveal the hero: "+path);
    console.log("Home → "+name+" ("+(touch?"touch":"click")+") passed");
  }
  for (const [name,path] of [["About","about.html"],["Services","services.html"],["Who We Serve","who-we-serve.html"],["Projects","projects.html"],["Contact","contact.html"],["Let's talk","request-quote.html"]]) {
    await followFromHome(motionPage,name,path);
  }
  // A persisted pageshow simulates restoration of the already-rendered
  // document without re-running its entry module.
  await motionPage.evaluate(()=>window.dispatchEvent(new PageTransitionEvent("pageshow",{persisted:true})));
  await motionPage.locator("#vv-page-loading .vv-boot-encrypted").waitFor({state:"visible"});
  await motionPage.locator("html:not([data-vv-boot])").waitFor({state:"attached",timeout:20000});
  assert.equal(await motionPage.locator("html").getAttribute("data-vv-decrypted"),"true");
  console.log("Restored document transmission passed");
  await motion.close();
  // A real touch/mobile context (not merely a narrow desktop window), with
  // all animation enabled. Check every public route, then exercise the
  // highest-cost interactive components on the phone.
  const phone = await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true,reducedMotion:"no-preference"});
  const touch = await phone.newPage();
  const errors = [];
  touch.on("pageerror", error=>errors.push(error.message));
  for(const path of paths){
    await touch.goto(base+path,{waitUntil:"commit"});
    await touch.locator("#vv-page-loading .vv-boot-encrypted").waitFor({state:"visible",timeout:10000});
    await touch.locator("html:not([data-vv-boot])").waitFor({state:"attached",timeout:20000});
    await touch.locator("main h1").first().waitFor({state:"visible"});
    assert.equal(await touch.locator("html").getAttribute("data-vv-decrypted"),"true",path);
    assert.equal(await touch.evaluate(()=>matchMedia("(pointer:coarse)").matches),true);
    // SVG viewBoxes and dimensions must be valid, including the large
    // artwork. Hidden icons and decorative defs are intentionally skipped.
    const svgReport=await touch.evaluate(()=>{
      const visible=[...document.querySelectorAll("svg")].filter(svg=>{
        const r=svg.getBoundingClientRect();return r.width>0&&r.height>0&&getComputedStyle(svg).visibility!=="hidden";
      });
      return {count:visible.length,invalid:visible.filter(svg=>svg.hasAttribute("viewBox")&&(!svg.viewBox.baseVal.width||!svg.viewBox.baseVal.height)).length,viewport:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth};
    });
    assert.ok(svgReport.count>0 && svgReport.invalid===0,"Broken SVG geometry: "+path);
    assert.ok(svgReport.scroll<=svgReport.viewport+2,"Phone horizontal overflow: "+path+" "+JSON.stringify(svgReport));
    if(!path){
      // A finger tap must open the dropdown once, not trigger a synthetic
      // mouse hover followed by a click that closes it again.
      await touch.getByRole("button",{name:"Open Services menu",exact:true}).tap();
      await touch.locator("#vv-nav-mega").waitFor({state:"visible"});
      assert.deepEqual(await labels(touch,".vv-nav-resize-mega-item-copy strong"),serviceNames);
      await touch.getByRole("button",{name:"Close Services menu",exact:true}).tap();
      await touch.locator("#vv-nav-mega").waitFor({state:"hidden"});
      await touch.getByRole("button",{name:"Show Photography",exact:true}).tap();
      assert.equal(await touch.locator("#serviceName").textContent(),"Photography");
      await touch.locator(".vv-pixel-surface").scrollIntoViewIfNeeded();
      await touch.locator(".vv-pixel-fallback.is-ready").waitFor({state:"attached"});
      const pixel=touch.locator(".vv-pixel-surface");
      const before=await pixel.evaluate(canvas=>canvas.toDataURL());
      await pixel.tap();
      await touch.waitForFunction(value=>document.querySelector(".vv-pixel-surface").toDataURL()!==value,before,{timeout:5000});
      await touch.locator(".vv-svc-slice-tab").nth(2).tap();
      await touch.locator(".vv-svc-active-panel h3").filter({hasText:"Web & UI/UX Design"}).waitFor({state:"visible"});
      await touch.locator(".vvcr-category").nth(2).tap();
      await touch.locator(".vvcr-category").nth(2).getAttribute("aria-pressed").then(value=>assert.equal(value,"true"));
      await touch.locator(".vv-atlas-map").scrollIntoViewIfNeeded();
      await touch.locator(".vv-atlas-dot-overlay path").waitFor({state:"attached"});
      assert.equal(await touch.getByRole("button",{name:"Pause automatic map tour"}).count(),1,"Mobile atlas should autoplay");
      await touch.locator(".vv-atlas-city-grid button").nth(1).tap();
      await touch.locator(".vv-atlas-active-route").waitFor({state:"visible"});
      await touch.locator(".vv-atlas-map animateMotion").waitFor({state:"attached"});
      await touch.getByRole("button",{name:"Next question",exact:true}).tap();
      await touch.locator(".vv-faq-lab-answer-copy").waitFor({state:"visible"});
      // Scroll away: CSS motion must be paused on offscreen sections.
      await touch.evaluate(()=>window.scrollTo({top:0,behavior:"instant"}));
      await touch.waitForFunction(()=>document.querySelector(".vv-close-marquee-section")?.classList.contains("vv-motion-offscreen"));
    }
    if(path==="services.html?service=photography"){
      const compare=touch.getByRole("slider",{name:"Compare original and edited photography"});
      await compare.scrollIntoViewIfNeeded();
      const box=await compare.boundingBox();
      assert.ok(box&&box.width>0);
      await compare.tap({position:{x:Math.round(box.width*.74),y:Math.round(box.height*.5)}});
      const amount=Number(await compare.getAttribute("aria-valuenow"));
      assert.ok(amount>=65&&amount<=85,"Touch photo comparison did not update: "+amount);
    }
    if(path==="who-we-serve.html"){
      const photoIds=["brands","businesses","founders","creators","events","digital"];
      for(const [index,id] of photoIds.entries()){
        await touch.locator(".vvx-world-mobile-tabs button").nth(index).tap();
        const image=touch.locator(`.vvx-world-photo[src$="audience-${id}-creative.webp"]`);
        await image.waitFor({state:"attached"});
        await image.evaluate(img=>img.decode());
        assert.ok(await image.evaluate(img=>img.naturalWidth>=1000 && !!img.alt),"Audience photo failed to decode: "+id);
        const poster=touch.locator(".vvx-world-poster").filter({has:image});
        const mark=poster.locator(".vvx-world-watermark");
        await mark.evaluate(img=>img.decode());
        assert.ok(await mark.evaluate(img=>img.naturalWidth>0 && Number(getComputedStyle(img).opacity)<.2),"Logo watermark missing: "+id);
        const posterSize=await poster.locator(".vvx-world-poster-word").evaluate(el=>parseFloat(getComputedStyle(el).fontSize));
        assert.ok(posterSize>=30 && posterSize<=50,"Audience title size not reduced: "+id);
      }
      assert.equal(await touch.locator(".vvx-world-stamp").count(),0);
      console.log("Who We Serve: all six audience photos, watermark and smaller titles verified on touch");
    }
    if(path.startsWith("services.html")){
      await touch.evaluate(()=>{const section=document.querySelector("#our-process");window.scrollTo({top:scrollY+section.getBoundingClientRect().top,behavior:"instant"});});
      await touch.locator(".vv-sp-step-button").nth(3).tap();
      await touch.waitForFunction(()=>document.querySelector(".vv-sp-stage")?.getAttribute("data-active-step")==="4"&&document.querySelector(".vv-ps-card")?.getAttribute("data-chapter")==="4");
    }
    assert.deepEqual(errors,[],"Mobile JavaScript errors on "+path);
    console.log("Touch + full motion: "+(path||"home")+" passed; "+svgReport.count+" SVG elements");
  }
  await followFromHome(touch,"About","about.html",true);
  await followFromHome(touch,"Services","services.html",true);
  await phone.close();

  for (const viewport of [{width:1440,height:900},{width:390,height:844}]) {
    const context = await browser.newContext({viewport, reducedMotion:"reduce"});
    const page = await context.newPage();
    // Reproduce a slow bundle download; a footer, CTA or fallback must never
    // become the visible page while the correct hero is still loading.
    await page.route("**/assets/*.js",async route => {
      await new Promise(resolve=>setTimeout(resolve,300));
      await route.continue();
    });
    for (const path of paths) {
      await page.goto(base+path,{waitUntil:"commit"});
      await page.locator("#vv-page-loading").waitFor({state:"visible",timeout:5000});
      assert.equal(await page.evaluate(()=>document.elementFromPoint(innerWidth/2,innerHeight/2)?.closest("#vv-page-loading")!==null),true,"Startup cover missing: "+path);
      await page.locator("html:not([data-vv-boot])").waitFor({state:"attached",timeout:20000});
      assert.equal(await page.locator("html").getAttribute("data-vv-message"),routeMessage(path),"Route-specific transmission: "+path);
      assert.equal(await page.locator("html").getAttribute("data-vv-decrypted"),"true","Decryption gate: "+path);
      const hero=page.locator("main h1").first();
      await hero.waitFor({state:"visible"});
      const headingSize=await hero.evaluate(node=>parseFloat(getComputedStyle(node).fontSize));
      assert.ok(headingSize>=23 && headingSize<=(viewport.width===390?48:70),"Unexpected public heading size: "+path+" ("+headingSize+"px)");
      const editorialHeroLines={"about.html":[["We turn","your ideas","into experiences."],["We turn","your ideas","into experiences."]],"services.html":[["Six ways we","create,","all of them","yours."],["Six ways we","create,","all of them","yours."]],"who-we-serve.html":[["No two","stories","alike."],["No two","stories","alike."]],"projects.html":[["Every story,","a different","canvas."],["Every story,","a different","canvas."]],"contact.html":[["Let's start a","conversation."],["Let's start a","conversation."]],"request-quote.html":[["Tell us about","your big idea."],["Tell us about","your big idea."]],"services.html?service=graphic-design":[["Ideas that","deserve to","be seen."],["Ideas that","deserve to","be seen."]],"services.html?service=photography":[["Frames that","make the","moment","last."],["Frames that","make the","moment last."]],"services.html?service=web-ui-ux":[["Digital","experiences","built for","real people."],["Digital","experiences","built for","real people."]],"services.html?service=videography":[["Stories","that move","people."],["Stories that","move people."]],"services.html?service=branding":[["An identity","that feels","unmistakably","yours."],["An identity","that feels","unmistakably","yours."]],"services.html?service=social-media":[["Good stories","deserve","a bigger","stage."],["Good stories","deserve a","bigger stage."]]};
      if(editorialHeroLines[path]){
        const lines=await hero.evaluate(el=>{
          const rows=[];
          const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
          let node;
          while(node=walker.nextNode()) for(const match of node.nodeValue.matchAll(/\S+/g)){
            const range=document.createRange();range.setStart(node,match.index);range.setEnd(node,match.index+match[0].length);
            const r=range.getBoundingClientRect();if(!r.width||!r.height)continue;
            const y=r.top+r.height/2;let row=rows.find(row=>Math.abs(row.y-y)<6);
            if(!row){row={y,words:[]};rows.push(row);}
            row.words.push(match[0]);
          }
          return rows.sort((a,b)=>a.y-b.y).map(row=>row.words.join(" "));
        });
        assert.deepEqual(lines,editorialHeroLines[path][viewport.width===390?1:0],"Preserved page headline layout: "+path);
      }
      assert.ok(await hero.evaluate(node=>{const spacing=getComputedStyle(node).letterSpacing;return spacing==="normal"||parseFloat(spacing)>=-0.1}),"Overcompressed hero tracking: "+path);
      if(path==="who-we-serve.html"){
        assert.equal(await page.locator(".vvx-hero-id,.vvx-hero-counter").count(),0,"Landing page numbering should be removed");
        const rows=await page.locator(".vvx-hero-heading-row").evaluateAll(rows=>rows.map(row=>({scroll:row.scrollWidth,client:row.clientWidth})));
        assert.equal(rows.length,3);
        assert.ok(rows.every(r=>r.scroll<=r.client+2),"Audience heading is clipped: "+JSON.stringify(rows));
      }

      const bounds=await hero.boundingBox();
      assert.ok(bounds && bounds.y < viewport.height && bounds.y + bounds.height > 0,"Hero is not in first viewport: "+path);
      assert.ok(await page.evaluate(()=>scrollY<2),"Initial page is not at the top: "+path);
      await page.locator('nav[aria-label="Footer services"] a').nth(5).waitFor({state:"attached"});
      assert.deepEqual(await labels(page,'nav[aria-label="Footer services"] a'),serviceNames,"Footer order: "+path);
      if(path===""){
        await page.locator(".vv-svc-slice-tab-label").nth(5).waitFor({state:"attached"});
        await page.locator(".vv-pf-card-category").nth(5).waitFor({state:"attached"});
        assert.deepEqual(await labels(page,".vv-svc-slice-tab-label"),serviceNames,"Homepage services");
        assert.deepEqual(await labels(page,".vv-pf-card-category"),serviceNames.map(name=>name.toUpperCase()),"Homepage projects");
        const photos=page.locator("#work .vv-pf-selected-photo");
        assert.equal(await photos.count(),6,"Homepage portrait imagery");
        assert.ok(await photos.evaluateAll(images=>images.every(image=>getComputedStyle(image).objectFit==="contain")),"All selected directions photos must fit without cropping");
        assert.equal(await page.locator("#work .vv-pf-header .vv-section-h").evaluate(el=>getComputedStyle(el).fontWeight),"850","Selected directions heading weight");
        const media=await page.locator("#work .vv-pf-card-media").evaluateAll(nodes=>nodes.map(n=>({w:n.clientWidth,h:n.clientHeight})));
        assert.ok(media.every(({w,h})=>w>0 && Math.abs(w/h-9/16)<0.02),"Portrait media aspect ratio: "+JSON.stringify(media));
        for(const photo of await photos.all()){
          await photo.evaluate(async img=>{img.loading="eager";await img.decode();});
          assert.deepEqual(await photo.evaluate(img=>[img.naturalWidth,img.naturalHeight]),[720,1280],"Portrait WebP dimensions");
        }
        assert.equal(await page.locator("#serviceName").textContent(),"Graphic Design");
        const heroLines=[["Designed to","connect"],["Moments that","last"],["Made to","explore"],["Stories in","motion"],["Made to","be known"],["Stories worth","sharing"]];
        for(let i=0;i<serviceNames.length;i++){
          await page.getByRole("button",{name:"Show "+serviceNames[i],exact:true}).evaluate(button=>button.click());
          const lines=(await page.locator("#headline").innerText()).split("\n").map(line=>line.trim()).filter(Boolean);
          assert.deepEqual(lines,heroLines[i],"Homepage editorial headline layout: "+serviceNames[i]);
        }
        await page.getByRole("button",{name:"Show Graphic Design",exact:true}).evaluate(button=>button.click());
        await page.locator('button[aria-label="Open Services menu"]').evaluate(button=>button.click());
        await page.locator(".vv-nav-resize-mega-item-copy strong").nth(5).waitFor({state:"attached"});
        assert.deepEqual(await labels(page,".vv-nav-resize-mega-item-copy strong"),serviceNames,"Navigation order");
        await page.keyboard.press("Escape");
      }
      if(path==="projects.html"){
        assert.deepEqual((await labels(page,".vv-projects-filters button")).slice(1),serviceNames,"Project filter order");
        assert.deepEqual(await labels(page,".vv-projects-category h2"),serviceNames,"Project category order");
      }
      if(path==="request-quote.html") assert.deepEqual((await page.locator(".vv-inner-quote-form select").first().locator("option").allTextContents()).slice(0,6),serviceNames,"Quote service order");
      if(path.startsWith("services.html")){
        assert.deepEqual(await page.locator(".vv-service-switcher a").evaluateAll(links=>links.map(link=>new URL(link.href).searchParams.get("service"))),serviceIds,"Service nav links");
        if(path==="services.html") assert.deepEqual(await labels(page,".vv-service-row-copy h3"),serviceNames,"Service listing");
        await checkProcess(page,viewport,path);
      }
      await page.evaluate(()=>window.scrollTo({top:document.body.scrollHeight,behavior:"instant"}));
      await page.reload({waitUntil:"commit"});
      await page.locator("#vv-page-loading").waitFor({state:"visible",timeout:5000});
      await page.locator("html:not([data-vv-boot])").waitFor({state:"attached",timeout:20000});
      assert.ok(await page.evaluate(()=>scrollY<2),"Reload restored old scroll position: "+path);
      console.log(viewport.width+"px: "+(path||"home")+" passed");
    }
    await page.goto(base+"projects.html#digital",{waitUntil:"commit"});
    await page.locator("#vv-page-loading").waitFor({state:"visible",timeout:5000});
    await page.locator("html:not([data-vv-boot])").waitFor({state:"attached",timeout:20000});
    const target=await page.locator("#web-ui-ux").boundingBox();
    assert.ok(target && target.y < viewport.height && target.y+target.height>0,"Explicit project link did not reach target");
    await followFromHome(page,"About","about.html");
    await context.close();
  }
} finally {
  await browser?.close();
  server.close();
}
