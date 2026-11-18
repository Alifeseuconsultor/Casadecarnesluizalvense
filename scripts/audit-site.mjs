import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const url = process.env.AUDIT_URL;
if (!url) throw new Error("Defina AUDIT_URL com a URL da vitrine.");

const output = ".audit/screenshots";
const sections = ["inicio", "cortes", "mapa-do-boi", "dry-aged", "kits-churrasco", "contato", "rodape"];
const devices = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];
const hiddenHeader = "header.lux-header { visibility: hidden !important; }";
await fs.mkdir(output, { recursive: true });

async function captureSection(page, id, filename, showHeader = false) {
  const section = page.locator("#" + id);
  await section.screenshot({
    path: path.join(output, filename + ".png"),
    animations: "disabled",
    style: showHeader ? "" : hiddenHeader,
  });
}

async function verifyCatalog(page, device) {
  const product = {
    id: 1, name: "Acém (amostra)", category: "Bovinos", description: null,
    saleUnit: "g", pricePerKg: 40, imageUrl: null, status: "active",
    productType: "product", promoPrice: null, promoStartsAt: null, promoEndsAt: null,
  };
  const samples = [
    product,
    { ...product, id: 2, name: "Kit (amostra)", category: "Kits", saleUnit: "unidade",
      productType: "combo", status: "sold_out", pricePerKg: 80 },
  ];
  // A interceptação fica restrita a esta página de teste; nenhuma gravação é feita na loja.
  let response = { status: 503, json: { error: "simulação" } };
  await page.route("**/api/catalog", route => route.fulfill(response));
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Tentar novamente" }).waitFor();
  response = { status: 200, json: samples };
  await page.getByRole("button", { name: "Tentar novamente" }).click();
  const catalog = page.locator("#cortes");
  await catalog.getByText("Acém (amostra)", { exact: true }).waitFor();
  assert.equal(await catalog.locator(".cut-card").count(), 2);
  await catalog.getByText("Preço por kg (venda em gramas)").waitFor();
  await catalog.getByText("ESGOTADO", { exact: true }).waitFor();
  await captureSection(page, "cortes", device + "-catalogo-dados-de-teste");
  await catalog.getByRole("button", { name: "Kits", exact: true }).click();
  assert.equal(await catalog.locator(".cut-card").count(), 1);
  await catalog.getByRole("searchbox").fill("inexistente");
  await catalog.getByRole("button", { name: "Limpar filtros" }).click();
  assert.equal(await catalog.locator(".cut-card").count(), 2);
  response = { status: 200, json: [] };
  await page.reload({ waitUntil: "domcontentloaded" });
  await catalog.getByText("Nenhum produto disponível no catálogo hoje.").waitFor();
}

const browser = await chromium.launch();
const report = [];
try {
  for (const device of devices) {
    const page = await browser.newPage({
      viewport: { width: device.width, height: device.height },
      deviceScaleFactor: 1, reducedMotion: "reduce",
    });
    const errors = [];
    page.on("pageerror", error => errors.push(String(error)));
    const response = await page.goto(url, { waitUntil: "networkidle" });
    assert(response?.ok(), "Vitrine inacessível");
    await page.getByRole("heading", { level: 1, name: /Um bom corte/ }).waitFor();
    for (const id of sections) {
      await page.locator("#" + id).scrollIntoViewIfNeeded();
    }
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(Array.from(document.images, image => image.decode().catch(() => {})));
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth, innerWidth, scrollHeight: document.documentElement.scrollHeight,
      brokenImages: [...document.images].filter(i => i.naturalWidth === 0).map(i => i.alt),
      timelineCardWidth: Math.round(document.querySelector(".timeline-card").getBoundingClientRect().width),
    }));
    assert.equal(dimensions.scrollWidth, dimensions.innerWidth, "Overflow horizontal");
    assert.deepEqual(dimensions.brokenImages, [], "Imagem indisponível");
    assert(dimensions.timelineCardWidth > (device.name === "desktop" ? 400 : 230), "Coluna Dry Aged estreita");
    await page.screenshot({ path: path.join(output, device.name + "-full.png"), fullPage: true, animations: "disabled" });
    for (const id of sections) await captureSection(page, id, device.name + "-" + id, id === "inicio");

    if (device.name === "mobile") {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.getByRole("button", { name: "Abrir menu" }).click();
      const mobileNav = page.getByRole("navigation", { name: "Navegação para celular" });
      await mobileNav.waitFor();
      await mobileNav.evaluate(el => Promise.all(el.getAnimations().map(a => a.finished.catch(() => {}))));
      await page.screenshot({ path: path.join(output, "mobile-menu.png"), animations: "disabled" });
      await page.keyboard.press("Escape");
      await mobileNav.waitFor({ state: "hidden" });
      assert.equal(await page.getByRole("button", { name: "Abrir menu" }).evaluate(el => el === document.activeElement), true);
      await page.getByRole("button", { name: "Abrir menu" }).click();
      await mobileNav.getByRole("link", { name: "Mapa do boi" }).click();
      assert.equal(new URL(page.url()).hash, "#mapa-do-boi");
    }
    const tabs = page.locator(".map-region-tabs button");
    for (const button of await tabs.all()) {
      const region = await button.innerText();
      await button.click();
      await page.locator(".region-detail").getByRole("heading", { name: region, exact: true }).waitFor();
    }
    const title = await page.title();
    await verifyCatalog(page, device.name);
    assert.deepEqual(errors, [], "Erros de execução no navegador");
    report.push({ device: device.name, status: response.status(), title, ...dimensions, errors, sections,
      catalogTest: "recuperação, categorias, busca, filtros, vazio, esgotado e venda em gramas",
    });
    await page.close();
  }
  await fs.writeFile(".audit/site-report.json", JSON.stringify(report, null, 2) + "\n");
  console.log(report);
} finally {
  await browser.close();
}
