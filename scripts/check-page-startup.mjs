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
let browser;
try {
  browser = await chromium.launch({headless:true});
  const paths = ["", "about.html", "services.html", "who-we-serve.html", "projects.html", "contact.html", "request-quote.html",
    ...["photography","videography","branding","graphic-design","web-ui-ux","social-media"].map(id=>"services.html?service="+id)];
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
      const hero=page.locator("main h1").first();
      await hero.waitFor({state:"visible"});
      const bounds=await hero.boundingBox();
      assert.ok(bounds && bounds.y < viewport.height && bounds.y + bounds.height > 0,"Hero is not in first viewport: "+path);
      assert.ok(await page.evaluate(()=>scrollY<2),"Initial page is not at the top: "+path);
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
