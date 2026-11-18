"use client";

import { useMemo, useState } from "react";

const categories = ["Todos", "Cortes bovinos", "Aves", "Suínos", "Linguiças", "Para churrasco"];
const products = [
  { id: 1, name: "Ancho Premium", detail: "Marmoreio especial · peça selecionada", price: "R$ 89,90", unit: "/ kg", category: "Cortes bovinos", tag: "MAIS PEDIDO", image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=900&q=85" },
  { id: 2, name: "Picanha da Casa", detail: "Capa uniforme · maciez e sabor", price: "R$ 99,90", unit: "/ kg", category: "Para churrasco", tag: "SELEÇÃO DA CASA", image: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=900&q=85" },
  { id: 3, name: "Costela Premium", detail: "Corte especial para fogo lento", price: "R$ 49,90", unit: "/ kg", category: "Cortes bovinos", tag: "IDEAL PARA FAMÍLIA", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=85" },
  { id: 4, name: "Coração de Frango", detail: "Limpo e pronto para temperar", price: "R$ 34,90", unit: "/ kg", category: "Aves", tag: "PRÁTICO", image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=900&q=85" },
  { id: 5, name: "Linguiça Artesanal", detail: "Tempero equilibrado · feita com cuidado", price: "R$ 39,90", unit: "/ kg", category: "Linguiças", tag: "ARTESANAL", image: "https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&w=900&q=85" },
  { id: 6, name: "Short Rib", detail: "Sabor intenso · corte de respeito", price: "R$ 74,90", unit: "/ kg", category: "Cortes bovinos", tag: "CORTE ESPECIAL", image: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=900&q=85" }
];

const categoryImages = [
  { name: "Cortes bovinos", subtitle: "O melhor da seleção", image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=700&q=80" },
  { name: "Para churrasco", subtitle: "Seu encontro começa aqui", image: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=700&q=80" },
  { name: "Aves", subtitle: "Leveza e versatilidade", image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=700&q=80" },
  { name: "Suínos", subtitle: "Sabor em cada preparo", image: "https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?auto=format&fit=crop&w=700&q=80" }
];

export default function Home() {
  const [active, setActive] = useState("Todos");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<number[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const visible = useMemo(() => products.filter(p => (active === "Todos" || p.category === active) && (p.name.toLowerCase().includes(search.toLowerCase()) || p.detail.toLowerCase().includes(search.toLowerCase()))), [active, search]);

  function addToCart(id: number) { setCart(old => [...old, id]); }
  function toggleFavorite(id: number) { setFavorites(old => old.includes(id) ? old.filter(x => x !== id) : [...old, id]); }

  return (
    <main>
      <div className="announcement">SELEÇÃO ESPECIAL • QUALIDADE QUE VOCÊ SENTE EM CADA CORTE</div>
      <header className="header">
        <a className="brand" href="#" aria-label="Casa de Carnes Luiz Alvense - início">
          <span className="brand-mark">LA</span>
          <span className="brand-copy"><strong>LUIZ ALVENSE</strong><small>CASA DE CARNES</small></span>
        </a>
        <nav className="desktop-nav"><a className="selected" href="#inicio">Início</a><a href="#catalogo">Nosso catálogo</a><a href="#categorias">Categorias</a><a href="#sobre">Nossa qualidade</a></nav>
        <div className="header-actions">
          <a className="whatsapp-link" href="https://wa.me/" target="_blank" rel="noreferrer"><span>◉</span> WhatsApp</a>
          <button className="cart-button" onClick={() => document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" })}>Sacola <span className="cart-count">{cart.length}</span></button>
        </div>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-image" />
        <div className="hero-shade" />
        <div className="hero-content">
          <div className="eyebrow"><span /> TRADIÇÃO EM CADA DETALHE</div>
          <h1>O melhor da carne.<br /><em>Do nosso cuidado</em><br />para sua mesa.</h1>
          <p>Cortes selecionados, preparo cuidadoso e uma experiência feita para quem valoriza o sabor de verdade.</p>
          <div className="hero-actions"><a className="primary-button" href="#catalogo">Explore nossos cortes <span>↗</span></a><a className="text-button" href="#sobre">Conheça nossa casa <span>→</span></a></div>
          <div className="hero-note"><span className="note-line" /> QUALIDADE ESCOLHIDA A DEDO</div>
        </div>
        <div className="hero-stamp"><span>SELEÇÃO</span><strong>LA</strong><span>ESPECIAL</span></div>
        <div className="hero-bottom"><span>01 — 03</span><span className="hero-bottom-line" /><span>CORTES QUE FAZEM A DIFERENÇA</span></div>
      </section>

      <section className="trust-strip">
        <div><span className="trust-icon">✳</span><span><strong>Seleção criteriosa</strong><small>Qualidade em cada escolha</small></span></div>
        <div><span className="trust-icon">♧</span><span><strong>Corte do seu jeito</strong><small>Do jeito que você prefere</small></span></div>
        <div><span className="trust-icon">◷</span><span><strong>Retirada agendada</strong><small>Mais praticidade no seu dia</small></span></div>
        <div><span className="trust-icon">♡</span><span><strong>Atendimento próximo</strong><small>Gente que entende de carne</small></span></div>
      </section>

      <section className="categories section-wrap" id="categorias">
        <div className="section-heading"><div><div className="eyebrow dark"><span /> ESCOLHA POR CATEGORIA</div><h2>Seu próximo favorito<br /><em>está por aqui.</em></h2></div><a className="underlined-link" href="#catalogo">Ver todo o catálogo <span>↗</span></a></div>
        <div className="category-grid">{categoryImages.map((c, i) => <button className="category-card" key={c.name} onClick={() => { setActive(c.name); document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" }); }}><img src={c.image} alt="" /><span className="category-overlay" /><span className="category-number">0{i + 1}</span><span className="category-copy"><strong>{c.name}</strong><small>{c.subtitle}</small></span><span className="category-arrow">↗</span></button>)}</div>
      </section>

      <section className="products-section" id="catalogo">
        <div className="section-wrap">
          <div className="section-heading product-heading"><div><div className="eyebrow dark"><span /> NOSSA VITRINE</div><h2>Cortes especiais,<br /><em>momentos melhores.</em></h2></div><p>Uma seleção pensada para transformar<br />o simples em algo memorável.</p></div>
          <div className="catalog-tools"><div className="filters">{categories.map(c => <button key={c} className={active === c ? "filter active" : "filter"} onClick={() => setActive(c)}>{c}</button>)}</div><label className="search-box"><span>⌕</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar um corte..." /></label></div>
          <div className="product-grid">{visible.map(p => <article className="product-card" key={p.id}><div className="product-image"><img src={p.image} alt={p.name} /><span className="product-tag">{p.tag}</span><button className={favorites.includes(p.id) ? "favorite active" : "favorite"} onClick={() => toggleFavorite(p.id)} aria-label="Adicionar aos favoritos">{favorites.includes(p.id) ? "♥" : "♡"}</button><button className="quick-add" onClick={() => addToCart(p.id)}>＋</button></div><div className="product-info"><div className="product-category">{p.category}</div><h3>{p.name}</h3><p>{p.detail}</p><div className="product-buy"><div><strong>{p.price}</strong><small>{p.unit}</small></div><button onClick={() => addToCart(p.id)}>Adicionar <span>↗</span></button></div></div></article>)}</div>
          {visible.length === 0 && <div className="empty-state">Não encontramos esse corte. Experimente outra busca ou categoria.</div>}
          <div className="catalog-footer"><span>UMA BOA ESCOLHA MUDA A REFEIÇÃO.</span><span>{visible.length} PRODUTOS EM DESTAQUE</span></div>
        </div>
      </section>

      <section className="quality" id="sobre"><div className="quality-photo" /><div className="quality-copy"><div className="eyebrow"><span /> O CUIDADO ESTÁ NOS DETALHES</div><h2>Não é só sobre<br />carne. É sobre<br /><em>fazer bem feito.</em></h2><p>Acreditamos que uma boa experiência começa muito antes da primeira garfada. Está na escolha, no corte, no cuidado e na atenção a cada pedido.</p><a className="primary-button" href="https://wa.me/" target="_blank" rel="noreferrer">Fale com nossa equipe <span>↗</span></a><div className="quality-signature">LUIZ ALVENSE <span>•</span> CASA DE CARNES</div></div></section>

      <section className="closing-banner"><div className="closing-inner"><div className="eyebrow"><span /> SUA MESA MERECE</div><h2>Um bom momento<br /><em>começa com uma boa escolha.</em></h2><a className="light-button" href="#catalogo">Escolher meus cortes <span>↗</span></a></div></section>
      <footer className="footer"><a className="brand footer-brand" href="#inicio"><span className="brand-mark">LA</span><span className="brand-copy"><strong>LUIZ ALVENSE</strong><small>CASA DE CARNES</small></span></a><span>QUALIDADE, CUIDADO E SABOR.</span><span>© 2026 LUIZ ALVENSE</span></footer>
      {cart.length > 0 && <div className="cart-toast"><span>✓</span> {cart.length} {cart.length === 1 ? "item adicionado" : "itens adicionados"} à sacola</div>}
    </main>
  );
}