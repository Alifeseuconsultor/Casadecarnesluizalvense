"use client";

import { useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  price: string;
  detail: string;
  image: string;
  badge?: string;
};

const categories = ["Todos", "Carnes Bovinas", "Carnes Suínas", "Aves", "Linguiças", "Churrasco", "Especiais"];

const products: Product[] = [
  {
    id: 1,
    name: "Picanha",
    category: "Carnes Bovinas",
    price: "R$ 89,90",
    detail: "Corte selecionado, macio e suculento",
    image: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=900&q=85",
    badge: "MAIS PEDIDO",
  },
  {
    id: 2,
    name: "Contrafilé",
    category: "Carnes Bovinas",
    price: "R$ 79,90",
    detail: "Marmoreio especial e sabor marcante",
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 3,
    name: "Alcatra",
    category: "Carnes Bovinas",
    price: "R$ 69,90",
    detail: "Versátil, macia e perfeita para o dia a dia",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 4,
    name: "Costela",
    category: "Churrasco",
    price: "R$ 49,90",
    detail: "Ideal para assar lentamente e compartilhar",
    image: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 5,
    name: "Fraldinha",
    category: "Carnes Bovinas",
    price: "R$ 59,90",
    detail: "Sabor intenso e fibras delicadas",
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 6,
    name: "Coração de frango",
    category: "Aves",
    price: "R$ 34,90",
    detail: "Limpo e pronto para a churrasqueira",
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 7,
    name: "Linguiça artesanal",
    category: "Linguiças",
    price: "R$ 39,90",
    detail: "Tempero equilibrado, feita com cuidado",
    image: "https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 8,
    name: "Short rib",
    category: "Especiais",
    price: "R$ 74,90",
    detail: "Corte especial para momentos especiais",
    image: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=900&q=85",
  },
];

function BullMark() {
  return (
    <svg className="bull-mark" viewBox="0 0 72 72" aria-hidden="true">
      <path d="M8 12C5 9 3 4 3 2c6 6 13 8 21 8 5 0 9 3 12 7 3-4 7-7 12-7 8 0 15-2 21-8 0 2-2 7-5 10 0 12-5 21-16 26l-2 14-9 12-9-12-2-14C14 33 9 24 8 12Z" fill="currentColor"/>
      <path d="M23 29c4-3 9-3 13 0 4-3 9-3 13 0M28 42h16M31 49h10" fill="none" stroke="#17130f" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M12 17 5 11M60 17l7-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function SearchIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg>;
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);

  const visibleProducts = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("pt-BR");
    return products.filter((product) => {
      const matchesCategory = activeCategory === "Todos" || product.category === activeCategory;
      const matchesSearch = !term || product.name.toLocaleLowerCase("pt-BR").includes(term) || product.detail.toLocaleLowerCase("pt-BR").includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  return (
    <main className="storefront">
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
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              document.getElementById("destaques")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }}
            placeholder="O que você procura?"
            aria-label="Buscar produtos"
          />
          <button type="button" aria-label="Buscar"><SearchIcon /></button>
        </label>

        <div className="header-actions">
          <button className="icon-action" aria-label="Minha conta" type="button">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M4.5 20c.8-3.5 3.3-5.3 7.5-5.3s6.7 1.8 7.5 5.3"/></svg>
          </button>
          <button className="icon-action cart-action" aria-label="Sacola de compras" type="button" onClick={() => document.getElementById("destaques")?.scrollIntoView({ behavior: "smooth" })}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.1 11.1a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 1.9-1.4L22 8H6"/><circle cx="10" cy="20" r="1.2"/><circle cx="18" cy="20" r="1.2"/></svg>
            {cartCount > 0 && <b className="cart-count">{cartCount}</b>}
          </button>
        </div>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-photo" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>Carne de<br/>qualidade,<br/><em>sempre!</em></h1>
          <p>Sabor e confiança<br/>em cada escolha.</p>
          <a className="hero-button" href="#destaques">Ver ofertas <span>→</span></a>
        </div>
        <div className="hero-caption"><span>SELEÇÃO ESPECIAL</span><i/> CASA DE CARNES LUIZ ALVENSE</div>
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
          <span className="benefit-icon">★</span>
          <span><strong>Qualidade premium</strong><small>Seleção em cada detalhe</small></span>
        </div>
      </section>

      <section className="featured-section" id="destaques">
        <div className="section-heading">
          <div>
            <h2>Nossos Destaques</h2>
            <p>Cortes selecionados especialmente para você.</p>
          </div>
          <a className="see-all" href="#catalogo">Ver todos <span>→</span></a>
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
          {visibleProducts.slice(0, 8).map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-image">
                <img src={product.image} alt={product.name}/>
                {product.badge && <span className="product-badge">{product.badge}</span>}
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.price}<small>/kg</small></p>
                <button type="button" onClick={() => setCartCount((count) => count + 1)}>Adicionar <span>+</span></button>
              </div>
            </article>
          ))}
          {visibleProducts.length === 0 && <div className="empty-state">Não encontramos esse corte. Tente outra busca.</div>}
        </div>
      </section>

      <footer className="store-footer">
        <a className="store-brand footer-brand" href="#inicio">
          <span className="brand-symbol"><BullMark /></span>
          <span className="brand-name"><small>CASA DE CARNES</small><strong>LUIZ ALVENSE</strong><em>QUALIDADE EM CADA DETALHE</em></span>
        </a>
        <span>QUALIDADE EM CADA DETALHE.</span>
        <span>© 2026 CASA DE CARNES LUIZ ALVENSE</span>
      </footer>

      {cartCount > 0 && <div className="cart-feedback"><span>✓</span> {cartCount} {cartCount === 1 ? "item adicionado" : "itens adicionados"} à sacola <button type="button" onClick={() => setCartCount(0)} aria-label="Fechar aviso">×</button></div>}
    </main>
  );
}
