"use client";

import { useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  price: string;
  detail: string;
  image: string;
  badge: string;
};

const categories = ["Todos", "Bovinos", "Churrasco", "Aves", "Suínos", "Linguiças"];

const products: Product[] = [
  {
    id: 1,
    name: "Picanha seleção da casa",
    category: "Churrasco",
    price: "R$ 89,90",
    detail: "Capa uniforme · maciez e sabor",
    image: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=900&q=85",
    badge: "MAIS PEDIDO",
  },
  {
    id: 2,
    name: "Contrafilé premium",
    category: "Bovinos",
    price: "R$ 79,90",
    detail: "Marmoreio delicado · corte especial",
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=900&q=85",
    badge: "SELEÇÃO PREMIUM",
  },
  {
    id: 3,
    name: "Alcatra especial",
    category: "Bovinos",
    price: "R$ 69,90",
    detail: "Versátil, macia e muito saborosa",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=85",
    badge: "ESCOLHA DO AÇOUGUEIRO",
  },
  {
    id: 4,
    name: "Costela janela",
    category: "Churrasco",
    price: "R$ 49,90",
    detail: "Ideal para fogo baixo e bons encontros",
    image: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=900&q=85",
    badge: "PARA COMPARTILHAR",
  },
  {
    id: 5,
    name: "Coração de frango",
    category: "Aves",
    price: "R$ 34,90",
    detail: "Limpo e pronto para sua churrasqueira",
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=900&q=85",
    badge: "PRÁTICO",
  },
  {
    id: 6,
    name: "Linguiça artesanal",
    category: "Linguiças",
    price: "R$ 39,90",
    detail: "Tempero equilibrado · feita com cuidado",
    image: "https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&w=900&q=85",
    badge: "ARTESANAL",
  },
];

function BullMark() {
  return (
    <svg className="bull-mark" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M11 13C7 12 5 7 4 4c5 5 10 5 16 5 5 0 9 3 12 7 3-4 7-7 12-7 6 0 11 0 16-5-1 3-3 8-7 9-1 10-5 17-13 21l-2 12-6 7-6-7-2-12c-8-4-12-11-13-21Z" fill="currentColor" />
      <path d="M22 28c3-2 6-2 10 0 4-2 7-2 10 0M27 39h10M29 45h6" fill="none" stroke="#17130f" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 5 5" />
    </svg>
  );
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);

  const visibleProducts = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("pt-BR");
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "Todos" ||
        product.category === activeCategory;
      const matchesSearch =
        !term ||
        product.name.toLocaleLowerCase("pt-BR").includes(term) ||
        product.detail.toLocaleLowerCase("pt-BR").includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  return (
    <main className="storefront">
      <div className="topline">
        <span>QUALIDADE EM CADA DETALHE</span>
        <span className="topline-dot">◆</span>
        <span>ATENDIMENTO PRÓXIMO E SELEÇÃO ESPECIAL</span>
      </div>

      <header className="store-header">
        <a className="store-brand" href="#inicio" aria-label="Casa de Carnes Luiz Alvense - início">
          <span className="brand-symbol"><BullMark /></span>
          <span className="brand-name">
            <small>CASA DE CARNES</small>
            <strong>LUIZ ALVENSE</strong>
            <em>QUALIDADE EM CADA DETALHE</em>
          </span>
        </a>

        <label className="store-search">
          <SearchIcon />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              document.getElementById("destaques")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }}
            placeholder="O que você procura?"
            aria-label="Buscar produtos"
          />
          <kbd>⌕</kbd>
        </label>

        <div className="header-actions">
          <button className="icon-action" aria-label="Minha conta" type="button">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5" /><path d="M4.5 20c.8-3.5 3.3-5.3 7.5-5.3s6.7 1.8 7.5 5.3" /></svg>
            <span>Minha conta</span>
          </button>
          <button className="icon-action cart-action" aria-label="Sacola de compras" type="button" onClick={() => document.getElementById("destaques")?.scrollIntoView({ behavior: "smooth" })}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.1 11.1a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 1.9-1.4L22 8H6" /><circle cx="10" cy="20" r="1.2" /><circle cx="18" cy="20" r="1.2" /></svg>
            <span>Sacola</span>
            {cartCount > 0 && <b className="cart-count">{cartCount}</b>}
          </button>
        </div>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-photo" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="eyebrow"><span /> SELEÇÃO ESPECIAL LUIZ ALVENSE</div>
          <h1>Carne de qualidade,<br /><em>sempre!</em></h1>
          <p>Sabor e confiança em cada escolha.<br />Do nosso cuidado para a sua mesa.</p>
          <a className="hero-button" href="#destaques">Ver ofertas <span>→</span></a>
        </div>
        <div className="hero-seal">
          <span>QUALIDADE</span>
          <strong><BullMark /></strong>
          <span>SELECIONADA</span>
        </div>
        <div className="hero-caption"><span>01</span><i /> CORTES ESCOLHIDOS A DEDO</div>
      </section>

      <section className="benefits" aria-label="Benefícios">
        <div className="benefit-item">
          <span className="benefit-icon">▣</span>
          <span><strong>Entrega rápida</strong><small>Praticidade até sua casa</small></span>
        </div>
        <div className="benefit-item">
          <span className="benefit-icon">♙</span>
          <span><strong>Compra segura</strong><small>Seus dados protegidos</small></span>
        </div>
        <div className="benefit-item">
          <span className="benefit-icon">✦</span>
          <span><strong>Qualidade premium</strong><small>Seleção em cada detalhe</small></span>
        </div>
      </section>

      <section className="featured-section" id="destaques">
        <div className="section-heading">
          <div>
            <div className="section-kicker"><span /> NOSSA SELEÇÃO</div>
            <h2>Nossos <em>destaques</em></h2>
            <p>Cortes especiais escolhidos para deixar cada refeição ainda melhor.</p>
          </div>
          <a className="see-all" href="#catalogo">Ver todo o catálogo <span>↗</span></a>
        </div>

        <div className="category-pills" aria-label="Filtrar por categoria">
          {categories.map((category) => (
            <button
              className={activeCategory === category ? "category-pill active" : "category-pill"}
              key={category}
              onClick={() => setActiveCategory(category)}
              type="button"
            >
              {category}
            </button>
          ))}
        </div>

        <div className="product-grid" id="catalogo">
          {visibleProducts.slice(0, 4).map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-image">
                <img src={product.image} alt={product.name} />
                <span className="product-badge">{product.badge}</span>
                <button className="quick-add" type="button" aria-label={"Adicionar " + product.name + " à sacola"} onClick={() => setCartCount((count) => count + 1)}>+</button>
              </div>
              <div className="product-info">
                <div className="product-meta">{product.category} <span>•</span> POR KG</div>
                <h3>{product.name}</h3>
                <p>{product.detail}</p>
                <div className="product-bottom">
                  <div><strong>{product.price}</strong><small>/ kg</small></div>
                  <button type="button" onClick={() => setCartCount((count) => count + 1)}>Adicionar <span>+</span></button>
                </div>
              </div>
            </article>
          ))}
          {visibleProducts.length === 0 && <div className="empty-state">Não encontramos esse corte. Tente outra busca.</div>}
        </div>
      </section>

      <section className="editorial-band">
        <div className="editorial-copy">
          <div className="section-kicker light"><span /> O PADRÃO LUIZ ALVENSE</div>
          <h2>Mais que um corte.<br /><em>Uma escolha de qualidade.</em></h2>
          <p>Da seleção ao atendimento, cada detalhe é pensado para você comprar bem e receber o melhor.</p>
        </div>
        <a href="#destaques" className="editorial-link">Conheça nossa seleção <span>↗</span></a>
      </section>

      <footer className="store-footer">
        <a className="store-brand footer-brand" href="#inicio">
          <span className="brand-symbol"><BullMark /></span>
          <span className="brand-name"><small>CASA DE CARNES</small><strong>LUIZ ALVENSE</strong><em>QUALIDADE EM CADA DETALHE</em></span>
        </a>
        <span>TRADIÇÃO, CUIDADO E SABOR.</span>
        <span>© 2026 CASA DE CARNES LUIZ ALVENSE</span>
      </footer>

      {cartCount > 0 && <div className="cart-feedback"><span>✓</span> {cartCount} {cartCount === 1 ? "item adicionado" : "itens adicionados"} à sacola <button type="button" onClick={() => setCartCount(0)} aria-label="Fechar aviso">×</button></div>}
    </main>
  );
}
