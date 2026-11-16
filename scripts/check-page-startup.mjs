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
    assert.equal(await motionPage.locator("html").getAttribute("data-vv-page-ready"),"true");
    assert.equal(await motionPage.locator("html").getAttribute("data-vv-decrypted"),"true");
    assert.ok(await motionPage.evaluate(()=>scrollY<2),"Hero must be first after decoding");
    console.log("Animated transmission: "+(path||"home")+" passed");
  }
  await motion.close();
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
        assert.equal(await page.locator("#serviceName").textContent(),"Graphic Design");
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
    await context.close();
  }
} finally {
  await browser?.close();
  server.close();
}
