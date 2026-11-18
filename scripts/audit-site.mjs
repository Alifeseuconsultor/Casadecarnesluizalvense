import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const url = process.env.AUDIT_URL;
if (!url) throw new Error("AUDIT_URL not set");
const output = ".audit/screenshots";
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({headless:true});
const report = [];
const sections = ["inicio","cortes","mapa-do-boi","dry-aged","kits-churrasco","contato"];
for (const device of [{name:"desktop",width:1440,height:900},{name:"mobile",width:390,height:844}]) {
  const page = await browser.newPage({viewport:{width:device.width,height:device.height},deviceScaleFactor:1, reducedMotion:"reduce"});
  const errors=[];
  page.on("pageerror",error=>errors.push(String(error)));
  const response=await page.goto(url,{waitUntil:"domcontentloaded",timeout:45000});
  await page.waitForTimeout(4500);
  const title=await page.title();
  const body=await page.locator("body").innerText().catch(()=>"");
  if (!response?.ok() || /Authentication Required|Vercel Authentication|Log in to Vercel/i.test(title+" "+body.slice(0,350))) {
    throw new Error("Preview not publicly accessible: "+response?.status()+" "+title+" "+body.slice(0,150));
  }
  await page.screenshot({path:path.join(output,device.name+"-full.png"),fullPage:true,animations:"disabled"});
  const dims=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,innerWidth:window.innerWidth,scrollHeight:document.documentElement.scrollHeight}));
  for (const id of sections) {
    const el=page.locator("#"+id);
    if (await el.count()) {
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await el.screenshot({path:path.join(output,device.name+"-"+id+".png"),animations:"disabled"});
    }
  }
  report.push({device:device.name,status:response?.status(),title,...dims,errors,sections:await Promise.all(sections.map(async id=>({id,found:(await page.locator("#"+id).count())>0})))});
  await page.close();
}
await fs.writeFile(".audit/site-report.json",JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
await browser.close();
