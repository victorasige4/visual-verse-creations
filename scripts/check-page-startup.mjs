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
  const pacing=await page.locator(".vv-sp-process").evaluate(root=>{
    const pin=root.querySelector(".vv-sp-pin"),count=root.querySelectorAll(".vv-sp-step-button").length;
    return {distance:(root.offsetHeight-pin.offsetHeight)/count,viewport:pin.offsetHeight,count};
  });
  assert.ok(pacing.count===7&&Math.abs(pacing.distance-pacing.viewport)<=2,"Each process step must have a full viewport of reading space: "+path);
  // Inspect both ends of every equal-duration chapter, including the first and last.
  for(let i=0;i<pacing.count;i++){
    for(const fraction of [.15,.85]){
      await page.locator(".vv-sp-process").evaluate((root,{i,fraction})=>{
        const pin=root.querySelector(".vv-sp-pin"),count=root.querySelectorAll(".vv-sp-step-button").length;
        const distance=(root.offsetHeight-pin.offsetHeight)/count;
        window.scrollTo({top:scrollY+root.getBoundingClientRect().top+(i+fraction)*distance,behavior:"instant"});
      },{i,fraction});
      await page.waitForFunction(n=>document.querySelector(".vv-sp-stage")?.getAttribute("data-active-step")===String(n),i+1);
    }
  }
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
    if(path==="about.html"){
      const landing=motionPage.locator(".vv-about-landing");
      const canvas=landing.locator(":scope > .vv-about-cube-canvas");
      await canvas.waitFor({state:"visible"});
      await landing.dispatchEvent("pointerleave",{pointerType:"mouse"});
      await motionPage.waitForTimeout(1400);
      // Sample the static grid and verify that an actual pointer wave changes
      // it, mouse-up does not reset it, and leaving restores the same pixels.
      const signature=()=>canvas.evaluate(el=>{
        const ctx=el.getContext("2d");
        const size=Math.min(160,el.width,el.height),x=Math.round(el.width*.25),y=Math.round(el.height*.25);
        const data=ctx.getImageData(x,y,size,size).data;
        let hash=2166136261;
        for(let i=0;i<data.length;i++)hash=Math.imul(hash^data[i],16777619);
        return hash>>>0;
      });
      const initial=await signature();
      const rect=await landing.boundingBox();
      assert.ok(rect);
      const x=rect.x+rect.width*.28,y=rect.y+rect.height*.28;
      await landing.dispatchEvent("pointermove",{clientX:x,clientY:y,pointerType:"mouse"});
      await motionPage.waitForTimeout(450);
      assert.notEqual(await signature(),initial,"About cursor wave must visibly animate");
      await landing.dispatchEvent("pointerup",{clientX:x,clientY:y,pointerType:"mouse"});
      await motionPage.waitForTimeout(450);
      assert.notEqual(await signature(),initial,"Mouse release must not extinguish the wave");
      await landing.dispatchEvent("pointerleave",{pointerType:"mouse"});
      await motionPage.waitForTimeout(1500);
      assert.equal(await signature(),initial,"Pointer exit must restore the unchanged grid without residual pixels");
      console.log("About landing: pointer wave, click continuity and clean restoration passed");
    }
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
  await motionPage.locator("#lets-create").evaluate(el=>window.scrollTo({top:scrollY+el.getBoundingClientRect().top,behavior:"instant"}));
  await motionPage.waitForFunction(()=>[...document.querySelectorAll(".vvx-edge-marquee .vvx-ribbon-track")].every(el=>getComputedStyle(el).animationPlayState==="running"));
  const railReport=await motionPage.evaluate(()=>{
    const cta=document.querySelector("#lets-create");
    const boundary=document.querySelector(".vvx-through-cta");
    const footer=document.querySelector("footer.vv-close-footer-wrap");
    const panel=cta.querySelector(".vv-cta-panel").getBoundingClientRect();
    const rails=[...document.querySelectorAll(".vvx-edge-marquee")];
    return {contained:boundary.contains(cta)&&!boundary.contains(footer),ctaCount:document.querySelectorAll("#lets-create").length,
      mobileHidden:getComputedStyle(document.querySelector(".vvx-ribbon")).display==="none",
      rails:rails.map(el=>{const r=el.getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right,repeat:getComputedStyle(el.querySelector(".vvx-ribbon-track")).animationIterationCount};}),
      panelLeft:panel.left,panelRight:panel.right,viewport:innerHeight};
  });
  assert.ok(railReport.contained&&railReport.ctaCount===1&&railReport.mobileHidden,"Desktop marquee boundary or duplicate CTA");
  assert.equal(railReport.rails.length,2);
  assert.ok(railReport.rails.every(r=>r.bottom>railReport.viewport/2&&r.top<railReport.viewport/2&&r.repeat==="infinite"),"Rails must continue through CTA: "+JSON.stringify(railReport));
  assert.ok(railReport.rails[0].right<=railReport.panelLeft&&railReport.rails[1].left>=railReport.panelRight,"Rails overlap CTA panel: "+JSON.stringify(railReport));
  await motionPage.locator("footer.vv-close-footer-wrap").evaluate(el=>el.scrollIntoView({block:"start",behavior:"instant"}));
  assert.ok(await motionPage.evaluate(()=>{const boundary=document.querySelector(".vvx-through-cta"),footer=document.querySelector("footer.vv-close-footer-wrap");return getComputedStyle(boundary).overflowY==="clip"&&boundary.getBoundingClientRect().bottom<=footer.getBoundingClientRect().top+1;}),"Rails must be clipped at the footer boundary");
  console.log("Who We Serve: endless desktop rails continue through CTA and end at footer");
  await motionPage.goto(base+"projects.html",{waitUntil:"commit"});
  await motionPage.locator("html:not([data-vv-boot])").waitFor({state:"attached",timeout:20000});
  await motionPage.mouse.move(8,110);
  await motionPage.locator('.vv-pj-sheet[data-autoplay="playing"]').waitFor({state:"attached"});
  const filmstrip=motionPage.locator(".vv-pj-filmstrip");
  const filmStart=await filmstrip.evaluate(el=>el.scrollLeft);
  await motionPage.waitForFunction(start=>document.querySelector(".vv-pj-filmstrip").scrollLeft>start+8,filmStart);
  const firstFrame=await motionPage.locator(".vv-pj-thumbs [aria-pressed=true]").getAttribute("aria-label");
  await motionPage.waitForFunction(name=>document.querySelector(".vv-pj-thumbs [aria-pressed=true]")?.getAttribute("aria-label")!==name,firstFrame,{timeout:4500});
  // Pause the moving filmstrip with a real pointer before targeting a frame.
  await motionPage.locator(".vv-pj-sheet-top").hover();
  await motionPage.getByRole("button",{name:"Show Social Media & Digital Marketing",exact:true}).click();
  await motionPage.mouse.move(8,110);
  await motionPage.waitForFunction(()=>document.querySelector(".vv-pj-thumbs [aria-pressed=true]")?.getAttribute("aria-label")==="Show Graphic Design",null,{timeout:4500});
  await motionPage.getByRole("button",{name:"Pause automatic slideshow",exact:true}).click();
  await motionPage.mouse.move(8,110);
  assert.equal(await motionPage.locator(".vv-pj-sheet").getAttribute("data-autoplay"),"paused");
  const pausedFrame=await motionPage.locator(".vv-pj-thumbs [aria-pressed=true]").getAttribute("aria-label");
  await motionPage.waitForTimeout(3200);
  assert.equal(await motionPage.locator(".vv-pj-thumbs [aria-pressed=true]").getAttribute("aria-label"),pausedFrame);
  console.log("Projects: contact sheet advances automatically, loops and pauses");
  await motionPage.locator("#graphic-design .vv-pj-card-media").hover();
  await motionPage.waitForFunction(()=>{
    const first=document.querySelector("#graphic-design"), second=document.querySelector("#photography");
    return getComputedStyle(first).filter==="none" && getComputedStyle(second).filter==="blur(4px)" &&
      getComputedStyle(first.querySelector(".vv-focus-caption")).opacity==="1";
  });
  await motionPage.locator("#photography .vv-pj-card-media").hover();
  await motionPage.waitForFunction(()=>getComputedStyle(document.querySelector("#photography")).filter==="none" && getComputedStyle(document.querySelector("#graphic-design")).filter==="blur(4px)");
  await motionPage.locator(".vv-pj-results").hover();
  await motionPage.waitForFunction(()=>[...document.querySelectorAll(".vv-focus-card")].every(card=>getComputedStyle(card).filter==="none"));
  console.log("Projects: hover focus switches between cards and clears on exit");
  await motionPage.locator("#graphic-design .vv-pj-detail-button").click();
  const collection=motionPage.locator(".vv-pj-collection-page[open]");
  await collection.locator(":scope > .vv-cursor-layer").waitFor({state:"attached"});
  // The pointer can remain over the moving cards after clicking Explore.
  // A stationary pointer must not prevent the initial autoplay.
  await motionPage.waitForFunction(()=>document.querySelector(".vv-apple-carousel")?.getAttribute("data-autoplay")==="playing");
  await motionPage.mouse.move(8,110);
  const movingCards=collection.locator(".vv-apple-carousel");
  const movingScroller=collection.locator(".vv-apple-scroller");
  await movingCards.locator("[aria-label='Pause automatic cards']").waitFor();
  await motionPage.waitForFunction(()=>document.querySelector(".vv-apple-carousel")?.getAttribute("data-autoplay")==="playing");
  const startLeft=await movingScroller.evaluate(el=>el.scrollLeft);
  await motionPage.waitForFunction(start=>document.querySelector(".vv-apple-scroller").scrollLeft>start+8,startLeft);
  const loopPeriod=await movingScroller.evaluate(el=>el.querySelector(".vv-apple-group[data-copy='1']").offsetLeft);
  await movingScroller.evaluate((el,width)=>{el.scrollLeft=width*2-5;},loopPeriod);
  await motionPage.waitForFunction(width=>document.querySelector(".vv-apple-scroller").scrollLeft<width+100,loopPeriod);
  assert.equal(await collection.locator(".vv-pj-collection-end").evaluate(el=>el.getBoundingClientRect().bottom<=innerHeight),true,"Collection footer remains in viewport");
  // Enter the stable viewport before asking Playwright to locate a moving card.
  // A real pointer pauses the entire track immediately on entry.
  const movingBounds=await movingScroller.boundingBox();
  assert.ok(movingBounds);
  await motionPage.mouse.move(movingBounds.x+movingBounds.width/2,movingBounds.y+movingBounds.height/2);
  await motionPage.waitForFunction(()=>document.querySelector(".vv-apple-carousel")?.getAttribute("data-autoplay")==="paused");
  const creativeCard=collection.getByRole("button",{name:"Explore Campaign graphics",exact:true});
  await creativeCard.hover();
  await motionPage.waitForFunction(()=>document.querySelector(".vv-apple-carousel")?.getAttribute("data-autoplay")==="paused");
  await collection.locator(":scope > .vv-cursor-layer .vv-cursor-core.is-visible").waitFor({state:"visible"});
  assert.ok(await collection.locator(":scope > .vv-cursor-layer .vv-cursor-orbit").evaluate(el=>el.classList.contains("is-interactive")),"Cursor reacts to creative card hover");
  await creativeCard.click();
  const creativeDetail=motionPage.locator(".vv-apple-detail[open]");
  await creativeDetail.locator(":scope > .vv-cursor-layer").waitFor({state:"attached"});
  await creativeDetail.getByRole("button",{name:"Close creative detail"}).hover();
  await creativeDetail.locator(".vv-cursor-core.is-visible").waitFor({state:"visible"});
  assert.equal(await creativeDetail.locator(".vv-draggable-card").count(),14,"All campaign designs are present");
  assert.equal(await creativeDetail.getByText("Drag to view",{exact:true}).count(),1);
  await motionPage.waitForFunction(()=>[...document.querySelectorAll(".vv-draggable-card img")].every(image=>image.complete&&image.naturalWidth===1080&&image.naturalHeight===1350));
  const topArtwork=creativeDetail.locator(".vv-draggable-card[aria-pressed='true']");
  const artworkBounds=await topArtwork.boundingBox();
  assert.ok(artworkBounds);
  await motionPage.mouse.move(artworkBounds.x+artworkBounds.width/2,artworkBounds.y+artworkBounds.height/2);
  await motionPage.mouse.down();
  await motionPage.mouse.move(artworkBounds.x+artworkBounds.width/2-50,artworkBounds.y+artworkBounds.height/2-25,{steps:8});
  await motionPage.mouse.up();
  await motionPage.waitForFunction(x=>Math.abs(document.querySelector(".vv-draggable-card[aria-pressed='true']").getBoundingClientRect().x-x)>25,artworkBounds.x);
  await creativeDetail.getByRole("combobox",{name:"Choose campaign artwork"}).selectOption("0");
  await creativeDetail.locator(".vv-campaign-preview img").waitFor({state:"visible"});
  assert.equal(await creativeDetail.locator(".vv-campaign-preview img").getAttribute("alt"),"Identify high-value AI opportunities");
  await creativeDetail.getByRole("button",{name:"Back to cards"}).click();
  await creativeDetail.getByRole("button",{name:"Reset",exact:true}).click();
  assert.equal(await creativeDetail.locator(".vv-draggable-card[aria-pressed='true']").getAttribute("aria-label"),"Select artwork: Score the risk with Xobriq Guard");
  console.log("Projects: all 14 campaign artworks load, drag, preview and reset");
  await creativeDetail.getByRole("button",{name:"Close creative detail"}).click();
  await collection.locator(":scope > .vv-cursor-layer").waitFor({state:"attached"});
  await collection.getByRole("button",{name:"Explore Editorial & poster design",exact:true}).click();
  await creativeDetail.getByRole("heading",{name:"Editorial & poster design"}).waitFor();
  assert.equal(await creativeDetail.locator(".vv-draggable-card").count(),8,"All eight editorial posters are present");
  assert.equal(await creativeDetail.getByText("Drag to view",{exact:true}).count(),1);
  await motionPage.waitForFunction(()=>[...document.querySelectorAll(".vv-draggable-card img")].every(image=>image.complete&&image.naturalWidth===Number(image.getAttribute("width"))&&image.naturalHeight===Number(image.getAttribute("height"))));
  await creativeDetail.getByRole("combobox",{name:"Choose editorial artwork"}).selectOption("6");
  await creativeDetail.locator(".vv-campaign-preview img").waitFor({state:"visible"});
  assert.equal(await creativeDetail.locator(".vv-campaign-preview img").getAttribute("alt"),"Men Always Ought to Pray — Hillside Church");
  await creativeDetail.getByRole("button",{name:"Reset",exact:true}).click();
  assert.equal(await creativeDetail.locator(".vv-draggable-card[aria-pressed='true']").getAttribute("aria-label"),"Select artwork: Next Dimension — Hillside Church");
  await creativeDetail.getByRole("button",{name:"Close creative detail"}).click();
  console.log("Projects: all eight editorial posters load at their original proportions, preview and reset");
  await collection.getByRole("button",{name:"Explore Print collateral",exact:true}).click();
  await creativeDetail.getByRole("heading",{name:"Print collateral"}).waitFor();
  assert.equal(await creativeDetail.locator(".vv-draggable-card").count(),2);
  await motionPage.waitForFunction(()=>[...document.querySelectorAll(".vv-draggable-card img")].every(image=>image.complete&&image.naturalWidth===1800&&image.naturalHeight===1272));
  await creativeDetail.getByRole("combobox",{name:"Choose print artwork"}).selectOption("0");
  await creativeDetail.locator(".vv-campaign-preview img").waitFor({state:"visible"});
  assert.equal(await creativeDetail.locator(".vv-campaign-preview img").getAttribute("alt"),"Xobriq Verify brochure — outside");
  await creativeDetail.getByRole("button",{name:"Reset",exact:true}).click();
  await creativeDetail.getByRole("button",{name:"Close creative detail"}).click();
  console.log("Projects: both brochure sides load, preview and reset");
  await collection.getByRole("button",{name:"Close collection",exact:true}).click();
  await motionPage.locator("#vv-cursor-root > .vv-cursor-layer").waitFor({state:"attached"});
  console.log("Projects: precision cursor follows collection and nested creative card dialogs");
  await motionPage.locator("#photography .vv-pj-detail-button").click();
  await collection.getByRole("button",{name:"Explore Graduations & celebrations",exact:true}).click();
  const photoGallery=creativeDetail.locator(".vv-photo-gallery");
  const photoRail=photoGallery.locator(".vv-photo-rail");
  await photoGallery.waitFor({state:"visible"});
  assert.equal(await photoGallery.locator(".vv-photo-group[data-copy='1'] img").count(),10);
  await motionPage.mouse.move(8,110);
  await motionPage.waitForFunction(()=>document.querySelector(".vv-photo-gallery")?.getAttribute("data-autoplay")==="playing");
  const photoStart=await photoRail.evaluate(el=>el.scrollLeft);
  await motionPage.waitForFunction(start=>document.querySelector(".vv-photo-rail").scrollLeft>start+8,photoStart);
  const photoPeriod=await photoRail.evaluate(el=>el.querySelector(".vv-photo-group[data-copy='1']").offsetLeft);
  await photoRail.evaluate((el,period)=>{el.scrollLeft=period*2-4;},photoPeriod);
  await motionPage.waitForFunction(period=>document.querySelector(".vv-photo-rail").scrollLeft<period+100,photoPeriod);
  await photoGallery.getByRole("button",{name:"Pause",exact:true}).click();
  assert.equal(await photoGallery.getAttribute("data-autoplay"),"paused");
  await creativeDetail.getByRole("button",{name:"Close creative detail"}).click();
  await collection.getByRole("button",{name:"Close collection",exact:true}).click();
  console.log("Projects: graduation photo gallery contains ten portraits, auto-scrolls, loops and pauses");
  // Simulate a stale/missing deployment entry and verify a single fresh
  // request restores the page, leaving the canonical URL clean.
  const retryContext = await browser.newContext({viewport:{width:1280,height:800},reducedMotion:"reduce"});
  const retryPage = await retryContext.newPage();
  let failedEntry = false;
  await retryPage.route("**/assets/audiences-*.js", async route => {
    if (!failedEntry) {
      failedEntry = true;
      await route.abort("failed");
    } else await route.continue();
  });
  await retryPage.goto(base+"who-we-serve.html",{waitUntil:"commit"});
  await retryPage.locator(".vvx-hero").waitFor({state:"visible",timeout:25000});
  await retryPage.locator("html:not([data-vv-boot])").waitFor({state:"attached",timeout:25000});
  assert.ok(failedEntry,"Test must interrupt the audience entry request");
  assert.equal(new URL(retryPage.url()).searchParams.has("vv-reconnect"),false);
  await retryContext.close();
  console.log("Who We Serve: recovers automatically from an interrupted entry request");
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
    if(path==="projects.html"){
      await touch.locator("#graphic-design").getByRole("link",{name:"Explore Graphic Design",exact:true}).tap();
      await touch.locator(".vv-pj-collection-page[open]").waitFor({state:"visible"});
      assert.equal(await touch.locator(".vv-apple-group[data-copy='1'] button").count(),4);
      assert.equal(await touch.locator(".vv-pj-collection-end").evaluate(el=>el.getBoundingClientRect().bottom<=innerHeight),true,"Phone collection actions remain in viewport");
      assert.ok(await touch.locator(".vv-focus-card").evaluateAll(cards=>cards.every(card=>getComputedStyle(card).filter==="none")),"Touch interaction must not leave neighboring cards blurred");
      await touch.getByRole("button",{name:"Close collection",exact:true}).tap();
      await touch.locator(".vv-pj-collection-page").waitFor({state:"detached"});
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
      assert.equal(await touch.locator(".vvx-edge-marquees").evaluate(el=>getComputedStyle(el).display),"none");
      await touch.locator(".vvx-ribbon").scrollIntoViewIfNeeded();
      await touch.waitForFunction(()=>getComputedStyle(document.querySelector(".vvx-ribbon .vvx-ribbon-track")).animationPlayState==="running");
      assert.equal(await touch.locator(".vvx-ribbon .vvx-ribbon-track").evaluate(el=>getComputedStyle(el).animationIterationCount),"infinite");
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
      // Each public landing has exactly one cube canvas, never in body sections.
      const cube=page.locator("#vvHeroCubes, .vv-shared-hero-cubes");
      await cube.waitFor({state:"attached"});
      assert.equal(await cube.count(),1,"One hero cube background: "+path);
      assert.ok(await cube.evaluate(el=>el.parentElement?.matches(".vv-hero,.vv-about-hero,.vv-about-landing,.vv-sv-hero--impractical,.vv-sv-hero--potadot,.vv-detail-hero,.vvx-hero,.vv-pj-hero,.vv-inner-hero")&&getComputedStyle(el).pointerEvents==="none"),"Hero-only non-blocking canvas: "+path);
      if(await cube.evaluate(el=>el.classList.contains("vv-shared-hero-cubes"))){
        await cube.waitFor({state:"visible"});
        assert.ok(await cube.evaluate(el=>{
          const style=getComputedStyle(el),rect=el.getBoundingClientRect();
          const context=el.getContext("2d");
          const painted=!!context&&el.dataset.vvPainted==="true"&&el.width>1&&el.height>1&&context.getImageData(Math.floor(el.width/2),Math.floor(el.height/2),1,1).data[3]>0;
          return rect.width>200&&rect.height>150&&style.zIndex==="0"&&Number(style.opacity)>=.8&&(painted||style.backgroundImage!=="none");
        }),"Hero grid must actually paint or have a visible fallback: "+path);
      }
      if(path==="about.html"){
        assert.ok(await cube.evaluate(el=>{
          const landing=el.parentElement,stats=landing?.querySelector("#our-impact"),belief=landing?.nextElementSibling;
          if(!stats||belief?.id!=="our-belief")return false;
          const grid=el.getBoundingClientRect(),end=belief.getBoundingClientRect();
          return Math.abs(grid.bottom-end.top)<=2&&getComputedStyle(stats).backgroundColor==="rgba(0, 0, 0, 0)";
        }),"About cube grid reaches the What We Believe section");
      }
      const headingSize=await hero.evaluate(node=>parseFloat(getComputedStyle(node).fontSize));
      assert.ok(headingSize>=23 && headingSize<=(viewport.width===390?48:70),"Unexpected public heading size: "+path+" ("+headingSize+"px)");
      const editorialHeroLines={"about.html":[["We turn","your ideas","into experiences."],["We turn","your ideas","into experiences."]],"services.html":[["Six ways we create,","all of them yours."],["Six ways we create,","all of them yours."]],"who-we-serve.html":[["No two","stories","alike."],["No two","stories","alike."]],"projects.html":[["Every story,","a different","canvas."],["Every story,","a different","canvas."]],"contact.html":[["Let's start a","conversation."],["Let's start a","conversation."]],"request-quote.html":[["Tell us about","your big idea."],["Tell us about","your big idea."]],"services.html?service=graphic-design":[["Ideas that","deserve to","be seen."],["Ideas that","deserve to","be seen."]],"services.html?service=photography":[["Frames that","make the","moment","last."],["Frames that","make the","moment last."]],"services.html?service=web-ui-ux":[["Digital","experiences","built for","real people."],["Digital","experiences","built for","real people."]],"services.html?service=videography":[["Stories","that move","people."],["Stories that","move people."]],"services.html?service=branding":[["An identity","that feels","unmistakably","yours."],["An identity","that feels","unmistakably","yours."]],"services.html?service=social-media":[["Good stories","deserve","a bigger","stage."],["Good stories","deserve a","bigger stage."]]};
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
        const glass=await page.locator(".vv-hero-visual").evaluate(el=>{
          const style=getComputedStyle(el);
          return {alpha:Number(style.backgroundColor.match(/,\s*([\d.]+)\)$/)?.[1]),blur:Number(style.backdropFilter.match(/blur\(([\d.]+)px\)/)?.[1]),canvas:!!el.querySelector("#vvCanvas")};
        });
        assert.ok(glass.alpha>0&&glass.alpha<=.25&&glass.blur>0&&glass.blur<=3&&glass.canvas,"Homepage hero must retain transparent glass and animated artwork: "+JSON.stringify(glass));
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
        assert.equal(await page.getByRole("button",{name:"Play automatic slideshow",exact:true}).count(),1,"Reduced motion disables autoplay by default");
        assert.deepEqual((await labels(page,".vv-projects-filters button")).slice(1),serviceNames,"Project filter order");
        assert.deepEqual(await labels(page,".vv-projects-category h2"),serviceNames,"Project category order");
        const layout=await page.locator(".vv-projects-category").evaluateAll(cards=>cards.map(card=>{
          const rect=card.getBoundingClientRect();
          const media=card.querySelector(".vv-pj-card-media").getBoundingClientRect();
          const copy=card.querySelector(".vv-pj-card-copy").getBoundingClientRect();
          return {top:rect.top,bottom:rect.bottom,mediaHeight:media.height,mediaWidth:media.width,cardWidth:rect.width,innerGap:copy.top-media.bottom};
        }));
        assert.ok(layout.every(card=>Math.abs(card.innerGap)<2 && Math.abs(card.mediaWidth-card.cardWidth)<3),"Gallery media must fill each card without an internal gap: "+JSON.stringify(layout));
        if(viewport.width>760){
          for(let i=0;i<layout.length;i+=2){
            const [left,right]=layout.slice(i,i+2);
            assert.ok(Math.abs(left.top-right.top)<2 && Math.abs(left.bottom-right.bottom)<2 && Math.abs(left.mediaHeight-right.mediaHeight)<2,"Gallery row must align: "+JSON.stringify([left,right]));
          }
        }
        const frames=page.locator(".vv-pj-thumb-group[data-film-copy='1'] button");
        assert.equal(await frames.count(),6,"Project contact sheet frame count");
        assert.deepEqual(await frames.evaluateAll(buttons=>buttons.map(button=>button.getAttribute("aria-label"))),serviceNames.map(name=>"Show "+name));
        const collectionImages=await page.locator(".vv-pj-card-media > img").all();
        assert.equal(collectionImages.length,6,"Each collection needs a service photo");
        for (const [index,photo] of collectionImages.entries()){
          assert.ok((await photo.getAttribute("src")).endsWith("service-cover-"+serviceIds[index]+".webp"));
          assert.ok(await photo.evaluate(async img=>{img.loading="eager";await img.decode();return img.naturalWidth===1200 && !!img.alt;}),"Collection photo loads: "+serviceIds[index]);
        }
        assert.equal(await page.locator(".vv-pj-frame-step").count(),0,"No previous/next filmstrip arrows");
        await frames.nth(1).click();
        assert.equal(await frames.nth(1).getAttribute("aria-pressed"),"true");
        assert.ok(await page.locator(".vv-pj-frame-scene img").evaluate(async image=>{await image.decode();return image.naturalWidth>0;}),"Collection image loads");
        await frames.first().click();
        assert.equal(await frames.first().getAttribute("aria-pressed"),"true");
        await page.locator(".vv-projects-filters").getByRole("button",{name:"Photography",exact:true}).click();
        assert.equal(await page.locator(".vv-projects-category:visible").count(),1,"Filtering displays one collection");
        assert.equal(await page.locator("#photography").isVisible(),true);
        assert.ok(await page.locator("#photography").evaluate(card=>Math.abs(card.getBoundingClientRect().width-card.parentElement.getBoundingClientRect().width)<2),"Filtered collection must fill the gallery");
        const details=page.locator("#photography").getByRole("link",{name:"Explore collection",exact:true});
        await details.click();
        await page.locator(".vv-pj-collection-page[open]").waitFor({state:"visible"});
        assert.equal(new URL(page.url()).searchParams.get("collection"),"photography");
        assert.equal(await page.locator(".vv-apple-group[data-copy='1'] button").count(),4,"Creative carousel contains four deliverables");
        assert.equal(await page.locator(".vv-pj-archive").count(),0,"No redundant archive section");
        const scroller=page.locator(".vv-apple-scroller");
        await page.waitForFunction(()=>{const el=document.querySelector(".vv-apple-scroller");return el.scrollLeft>0;});
        const period=await scroller.evaluate(el=>el.querySelector(".vv-apple-group[data-copy='1']").offsetLeft);
        assert.equal(await page.locator(".vv-apple-carousel").getAttribute("data-autoplay"),"paused","Reduced motion disables autoplay");
        assert.equal(await page.getByRole("button",{name:"Next creative card",exact:true}).count(),0,"No manual arrow controls");
        await scroller.evaluate((el,width)=>{el.scrollLeft=width*2+20;},period);
        await page.waitForFunction(width=>Math.abs(document.querySelector(".vv-apple-scroller").scrollLeft-width-20)<3,period);
        assert.equal(await page.locator(".vv-pj-collection-end").evaluate(el=>el.getBoundingClientRect().bottom<=innerHeight),true);
        await page.getByRole("button",{name:"Explore Birthdays",exact:true}).click();
        await page.locator(".vv-apple-detail[open]").waitFor({state:"visible"});
        assert.equal(await page.locator(".vv-photo-gallery-heading").textContent(),"Birthday celebrations20 photographs");
        const birthdayImages=page.locator(".vv-photo-group[data-copy='1'] img");
        assert.equal(await birthdayImages.count(),20,"Birthday gallery includes every supplied photograph");
        assert.ok(await birthdayImages.evaluateAll(async images=>{await Promise.all(images.map(image=>{image.loading="eager";return image.decode();}));return images.every(image=>image.naturalWidth>0&&image.alt&&image.src.includes("/birthday-photos/"));}),"All birthday photos load with descriptions");
        assert.equal(await page.locator(".vv-photo-gallery").getAttribute("data-autoplay"),"paused","Reduced motion disables photo autoplay");
        await page.keyboard.press("Escape");
        await page.locator(".vv-apple-detail").waitFor({state:"detached"});
        await page.getByRole("button",{name:"Explore Corporate events",exact:true}).click();
        await page.locator(".vv-apple-detail[open]").waitFor({state:"visible"});
        assert.equal(await page.locator(".vv-photo-gallery-heading").textContent(),"Corporate event photography12 photographs");
        const corporateImages=page.locator(".vv-photo-group[data-copy='1'] img");
        assert.equal(await corporateImages.count(),12,"Every photograph from the original corporate events portfolio is included");
        assert.ok(await corporateImages.evaluateAll(async images=>{await Promise.all(images.map(image=>{image.loading="eager";return image.decode();}));return new Set(images.map(image=>image.src)).size===12&&images.every(image=>image.naturalWidth>0&&image.alt&&image.src.includes("/corporate-event-photos/"));}),"Original corporate event photographs load with descriptions");
        assert.equal(await page.locator(".vv-photo-gallery").getAttribute("data-autoplay"),"paused","Reduced motion disables corporate event gallery autoplay");
        await page.keyboard.press("Escape");
        await page.locator(".vv-apple-detail").waitFor({state:"detached"});
        await page.getByRole("button",{name:"Explore Weddings",exact:true}).click();
        await page.locator(".vv-apple-detail[open]").waitFor({state:"visible"});
        assert.equal(await page.locator(".vv-photo-gallery-heading").textContent(),"Wedding photography inspiration10 photographs");
        const weddingImages=page.locator(".vv-photo-group[data-copy='1'] img");
        assert.equal(await weddingImages.count(),10,"Wedding gallery contains ten distinct supplied photos");
        assert.ok(await weddingImages.evaluateAll(async images=>{await Promise.all(images.map(image=>{image.loading="eager";return image.decode();}));return new Set(images.map(image=>image.src)).size===10&&images.every(image=>image.naturalWidth>0&&image.alt&&image.src.includes("/wedding-photos/"));}),"All wedding photos load with descriptions");
        assert.equal(await page.locator(".vv-photo-gallery").getAttribute("data-autoplay"),"paused","Reduced motion disables wedding autoplay");
        assert.equal(await page.getByRole("link",{name:"Stock photography: Magnific"}).getAttribute("href"),"https://www.magnific.com/serie/34914720");
        await page.keyboard.press("Escape");
        await page.locator(".vv-apple-detail").waitFor({state:"detached"});
        await page.getByRole("button",{name:"Close collection",exact:true}).click();
        await page.locator(".vv-pj-collection-page").waitFor({state:"detached"});
        await page.locator(".vv-projects-filters").getByRole("button",{name:"All collections",exact:true}).click();
        assert.equal(await page.locator(".vv-projects-category:visible").count(),6,"Reset displays all collections");
        await page.locator("#web-ui-ux").getByRole("link",{name:"Explore collection",exact:true}).click();
        await page.locator(".vv-pj-collection-page[open]").waitFor({state:"visible"});
        const webProject=page.locator(".vv-pj-client-card");
        assert.equal(await webProject.count(),1,"Web design displays only its completed project");
        assert.equal(await page.locator(".vv-pj-collection-page .vv-apple-carousel").count(),0,"Web design has no carousel");
        assert.equal(await webProject.getAttribute("href"),"https://stevenloise.com/");
        assert.equal(await webProject.getAttribute("target"),"_blank");
        assert.ok(await webProject.locator("img").evaluate(async image=>{await image.decode();return image.naturalWidth===1280&&image.naturalHeight===889;}),"Authentic landing page thumbnail loads");
        await webProject.focus();
        assert.ok(await webProject.evaluate(link=>document.activeElement===link),"Project card is keyboard accessible");
        await page.keyboard.press("Escape");
        await page.locator(".vv-pj-collection-page").waitFor({state:"detached"});
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),"Projects must not overflow horizontally");
      }
      if(path==="request-quote.html"){
        const sparks=page.locator(".vv-quote-idea-card");
        assert.equal(await sparks.count(),6,"Six interactive hero photographs");
        const firstSlot=await sparks.first().getAttribute("style");
        await page.getByRole("button",{name:"Remix",exact:true}).click();
        assert.notEqual(await sparks.first().getAttribute("style"),firstSlot,"Remix moves the creative cards");
        await sparks.first().click();
        assert.equal(await sparks.first().getAttribute("aria-pressed"),"true","Hero card selects a service");
        assert.equal(await page.locator(".vv-quote-services .vv-quote-service").first().getAttribute("aria-pressed"),"true","Hero and form share selection");
        await page.getByRole("button",{name:"Clear",exact:true}).click();
        const picker=page.locator(".vv-quote-services .vv-quote-service");
        assert.deepEqual(await labels(page,".vv-quote-service strong"),serviceNames,"Quote service order");
        await picker.nth(0).click();
        await picker.nth(2).click();
        assert.equal(await page.locator('.vv-quote-service[aria-pressed="true"]').count(),2,"Multiple disciplines can be selected");
        await page.getByLabel("Tell us about the project").fill("We need a brand campaign and a responsive website.");
        await page.getByRole("button",{name:"Continue to details"}).click();
        await page.getByLabel("Full name").fill("Example Client");
        await page.getByLabel("Email",{exact:false}).fill("client@example.com");
        await page.getByRole("button",{name:"Review my brief"}).click();
        assert.ok((await page.locator(".vv-quote-review").innerText()).includes("Example Client"));
        assert.ok((await page.locator(".vv-quote-review").innerText()).includes(serviceNames[0]));
        assert.ok((await page.locator(".vv-quote-review").innerText()).includes(serviceNames[2]));
        assert.ok(await page.getByRole("button",{name:"Save & open WhatsApp"}).isEnabled(),"WhatsApp handoff available");
        let posted;
        await page.route("**/functions/v1/website-enquiry",async route=>{
          posted=route.request().postDataJSON();
          await route.fulfill({status:503,contentType:"application/json",body:JSON.stringify({error:"Test unavailable"})});
        });
        await page.getByRole("button",{name:"Save & open email draft"}).click();
        await page.locator(".vv-enquiry-feedback").waitFor({state:"visible"});
        assert.equal(posted.source,"quote");
        assert.equal(posted.channel,"email");
        assert.ok(posted.brief.includes(serviceNames[0])&&posted.brief.includes(serviceNames[2]));
        assert.ok((await page.locator(".vv-enquiry-feedback").innerText()).includes("Test unavailable"),"Failed capture must preserve form and report error");
        await page.unroute("**/functions/v1/website-enquiry");
        await page.getByRole("button",{name:"Back",exact:false}).click();
        assert.equal(await page.getByLabel("Full name").inputValue(),"Example Client","Back navigation preserves details");
      }
      if(path.startsWith("services.html")){
        assert.deepEqual(await page.locator(".vv-service-switcher a").evaluateAll(links=>links.map(link=>new URL(link.href).searchParams.get("service"))),serviceIds,"Service nav links");
        if(path==="services.html"){
          const rail=page.locator(".vv-service-rail");
          const originals=rail.locator(".vv-service-rail-card:not([aria-hidden=true])");
          assert.equal(await originals.count(),6,"Six distinct service cards present");
          assert.deepEqual(await originals.locator("h3").allTextContents(),serviceNames,"Service listing");
          assert.deepEqual(await originals.locator(":scope > a").evaluateAll(links=>links.map(link=>new URL(link.href).searchParams.get("service"))),serviceIds,"All carousel cards open their service pages");
          assert.ok(await rail.evaluate(el=>el.scrollWidth>el.clientWidth),"Services scroll horizontally");
          const pause=page.getByRole("button",{name:"Pause automatic service scrolling"});
          if(await pause.count())await pause.click();
          const before=await rail.evaluate(el=>el.scrollLeft);
          await page.getByRole("button",{name:"Next services",exact:true}).click();
          await page.waitForFunction(previous=>Math.abs(document.querySelector(".vv-service-rail").scrollLeft-previous)>10,before);
          const input=page.getByRole("textbox",{name:"Describe your creative project"});
          const find=page.getByRole("button",{name:"Find my service"});
          for(const [query,expected] of [["I need a poster for an event",["graphic-design"]],["I want photos of my graduation",["photography"]],["I need an online store",["web-ui-ux"]],["I need a video for my brand",["videography"]],["I need a logo and website",["web-ui-ux","branding"]],["Manage my Instagram and grow my audience",["social-media"]],["Hello there",[]]]){
            await input.fill(query);await find.click();
            await page.locator(".vv-sv-finder-response").waitFor({state:"visible"});
            const actual=await page.locator(".vv-sv-finder-results a").evaluateAll(links=>links.map(link=>new URL(link.href).searchParams.get("service")));
            assert.deepEqual(actual.sort(),expected.sort(),"Local creative service match: "+query);
          }
        }
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
    await page.goto(base+"projects.html?collection=branding",{waitUntil:"commit"});
    await page.locator(".vv-pj-collection-page[open]").waitFor({state:"visible",timeout:20000});
    assert.equal(await page.locator("#vv-pj-collection-title").textContent(),"Branding & Identity","Collection deep links open directly");
    await page.getByRole("button",{name:"Close collection",exact:true}).click();
    await page.locator(".vv-pj-collection-page").waitFor({state:"detached"});
    assert.equal(new URL(page.url()).searchParams.has("collection"),false);
    await followFromHome(page,"About","about.html");
    await context.close();
  }
} finally {
  await browser?.close();
  server.close();
}
