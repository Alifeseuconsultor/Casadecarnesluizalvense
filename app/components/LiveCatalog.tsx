"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, RefreshCw, ArrowUpRight } from "lucide-react";

type Product = {
  id: number; name: string; category: string; description: string | null;
  saleUnit: "kg" | "g" | "unidade"; pricePerKg: number; imageUrl: string | null;
  status: string; productType: "product" | "combo";
  promoPrice: number | null; promoStartsAt: string | null; promoEndsAt: string | null;
  editorial?: { tagline?: string | null; badges?: string[]; priceOnRequest?: boolean } | null;
};
const money = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
const price = (p: Product) => {
  const now = Date.now();
  const start = p.promoStartsAt ? Date.parse(p.promoStartsAt) : -Infinity;
  const end = p.promoEndsAt ? Date.parse(p.promoEndsAt) : Infinity;
  return p.promoPrice !== null && now >= start && now <= end ? p.promoPrice : p.pricePerKg;
};
const basis = (p: Product) => p.saleUnit === "unidade" || p.productType === "combo" ? "un." : "kg";

function ProductImage({ src, name }: { src: string | null; name: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <div className="catalog-placeholder">Foto indisponível</div>;
  return <img src={src} alt={name} loading="lazy" onError={() => setFailed(true)} />;
}

export default function LiveCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [term, setTerm] = useState("");
  const [category, setCategory] = useState("Todas");

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/catalog", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("catalog unavailable");
        const json: unknown = await response.json();
        if (!Array.isArray(json)) throw new Error("invalid catalog response");
        return json as Product[];
      })
      .then((data) => { setProducts(data); setError(false); })
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [refreshKey]);

  function resetFilters() {
    setCategory("Todas");
    setTerm("");
  }

  const categories = useMemo(() => ["Todas", ...new Set(products.map(p => p.category))], [products]);
  const filtered = useMemo(() => products.filter(p =>
    (category === "Todas" || p.category === category) &&
    (p.name + " " + (p.description || "")).toLocaleLowerCase("pt-BR").includes(term.trim().toLocaleLowerCase("pt-BR"))
  ), [products, category, term]);

  return <section className="cuts-section" id="cortes">
    <div className="section-shell">
      <div className="section-intro">
        <div className="eyebrow-copper">SELEÇÃO LUIZ ALVENSE <span /></div>
        <div className="section-title-row">
          <h2>Catálogo de<br/><em>cortes especiais.</em></h2>
          <p>Produtos e preços exibidos conforme o catálogo da loja. Peso final e disponibilidade são confirmados pela equipe.</p>
        </div>
      </div>
      {loading ? <div className="catalog-empty" role="status">Carregando produtos da loja...</div> :
        error ? <div className="catalog-empty" role="alert">
          <h3>Catálogo indisponível no momento</h3>
          <p>Enquanto isso, conheça os cortes e as sugestões de preparo no mapa do boi.</p>
          <div className="catalog-recovery"><a href="#mapa-do-boi">Explorar o mapa do boi <ArrowUpRight size={16}/></a>
          <button type="button" onClick={() => { setLoading(true); setRefreshKey(k => k + 1); }}><RefreshCw size={15}/> Tentar novamente</button></div>
        </div> : products.length === 0 ?
        <div className="catalog-empty" role="status">Nenhum produto disponível no catálogo hoje.</div> :
        <>
          <div className="catalog-toolbar">
            <div className="catalog-toolbar-title"><div><span>NOSSA VITRINE</span><strong>{filtered.length} produtos encontrados</strong></div></div>
            <label className="catalog-search"><Search size={15}/><input type="search" value={term} onChange={e => setTerm(e.target.value)} placeholder="Buscar cortes..." aria-label="Buscar produtos"/></label>
          </div>
          <div className="catalog-layout">
            <aside className="catalog-sidebar" aria-label="Categorias">
              <strong>Categorias</strong>
              {categories.map(c => <button type="button" key={c} aria-pressed={category === c} className={category === c ? "catalog-category active" : "catalog-category"} onClick={() => setCategory(c)}>{c}</button>)}
            </aside>
            <div className="catalog-results">
              <div className="catalog-results-top"><span>Exibindo {filtered.length} de {products.length} produtos</span><span>PREÇOS DO CATÁLOGO</span></div>
              <div className="cuts-grid">
                {filtered.map(p => <article className="cut-card" key={p.id}>
                  <div className="cut-card-image">
                    <ProductImage src={p.imageUrl} name={p.name} key={p.imageUrl} />
                    {p.status === "sold_out" && <span className="cut-badge">ESGOTADO</span>}
                  </div>
                  <div className="cut-card-copy">
                    <div className="cut-category">{p.category}</div>
                    <h3>{p.name}</h3>
                    <p>{p.editorial?.tagline || p.description || "Consulte a equipe para detalhes deste produto."}</p>
                    <div className="cut-price-row"><span>{p.saleUnit === "g" ? "Preço por kg (venda em gramas)" : "Preço por " + basis(p)}</span>
                      <strong>{p.editorial?.priceOnRequest ? "Sob consulta" : money(price(p))}</strong>
                    </div>
                    <div className="cut-card-footer">
                      <span className="catalog-sale-unit">Venda por {p.saleUnit === "unidade" || p.productType === "combo" ? "unidade" : p.saleUnit === "g" ? "gramas" : "quilo"}</span>
                      <a className="add-cut-button" href="#contato">Consultar <ArrowUpRight size={14}/></a>
                    </div>
                  </div>
                </article>)}
              </div>
              {filtered.length === 0 && <div className="catalog-empty"><p>Nenhum produto encontrado.</p><button type="button" onClick={resetFilters}>Limpar filtros</button></div>}
            </div>
          </div>
        </>}
      <div className="catalog-footer-note"><span/> PREÇO E DISPONIBILIDADE SUJEITOS À CONFIRMAÇÃO <span/></div>
    </div>
  </section>;
}
