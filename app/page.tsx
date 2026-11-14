"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  detail: string;
  image: string;
  badge?: string;
  featured?: boolean;
};

const categories = [
  "Todos",
  "Carnes Bovinas",
  "Carnes Suínas",
  "Aves",
  "Linguiças",
  "Temperados",
  "Churrasco",
  "Especiais",
];

const products: Product[] = [
  {
    id: 1,
    name: "Picanha",
    category: "Carnes Bovinas",
    price: 8990,
    detail: "Capa uniforme · maciez e sabor",
    image: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=900&q=85",
    badge: "MAIS PEDIDO",
    featured: true,
  },
  {
    id: 2,
    name: "Contrafilé",
    category: "Carnes Bovinas",
    price: 7990,
    detail: "Marmoreio especial e sabor marcante",
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=900&q=85",
    featured: true,
  },
  {
    id: 3,
    name: "Alcatra",
    category: "Carnes Bovinas",
    price: 6990,
    detail: "Versátil, macia e muito saborosa",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=85",
    featured: true,
  },
  {
    id: 4,
    name: "Costela",
    category: "Churrasco",
    price: 4990,
    detail: "Ideal para assar lentamente e compartilhar",
    image: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=900&q=85",
    featured: true,
  },
  {
    id: 5,
    name: "Fraldinha",
    category: "Carnes Bovinas",
    price: 5990,
    detail: "Sabor intenso e fibras delicadas",
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 6,
    name: "Cupim",
    category: "Carnes Bovinas",
    price: 5490,
    detail: "Textura macia para preparo lento",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 7,
    name: "Coração de frango",
    category: "Aves",
    price: 3490,
    detail: "Limpo e pronto para a churrasqueira",
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 8,
    name: "Linguiça artesanal",
    category: "Linguiças",
    price: 3990,
    detail: "Tempero equilibrado, feita com cuidado",
    image: "https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 9,
    name: "Costelinha suína",
    category: "Carnes Suínas",
    price: 4290,
    detail: "Suculenta e perfeita para o forno",
    image: "https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?auto=format&fit=crop&w=900&q=85",
  },
];

const heroSlides = [
  {
    eyebrow: "SELEÇÃO ESPECIAL",
    title: <>Carne de<br />qualidade,<br /><em>sempre!</em></>,
    description: <>Sabor e confiança<br />em cada escolha.</>,
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=2200&q=90",
    cta: "Ver ofertas",
  },
  {
    eyebrow: "O CHURRASCO COMEÇA AQUI",
    title: <>O corte certo<br />para momentos<br /><em>inesquecíveis.</em></>,
    description: <>Seleção especial para reunir<br />quem você gosta.</>,
    image: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=2200&q=90",
    cta: "Escolher meus cortes",
  },
  {
    eyebrow: "QUALIDADE EM CADA DETALHE",
    title: <>Mais sabor<br />em cada<br /><em>encontro.</em></>,
    description: <>Do nosso cuidado para<br />a sua mesa.</>,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=2200&q=90",
    cta: "Conhecer a seleção",
  },
];

const categoryTiles = [
  {
    name: "Carnes bovinas",
    subtitle: "Cortes selecionados",
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=700&q=85",
    filter: "Carnes Bovinas",
  },
  {
    name: "Para churrasco",
    subtitle: "Seu encontro começa aqui",
    image: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=700&q=85",
    filter: "Churrasco",
  },
  {
    name: "Aves",
    subtitle: "Leveza e versatilidade",
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=700&q=85",
    filter: "Aves",
  },
  {
    name: "Linguiças",
    subtitle: "Sabor artesanal",
    image: "https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&w=700&q=85",
    filter: "Linguiças",
  },
  {
    name: "Carnes suínas",
    subtitle: "Sabor em cada preparo",
    image: "https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?auto=format&fit=crop&w=700&q=85",
    filter: "Carnes Suínas",
  },
];

const money = (cents: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);

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

function CartIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.1 11.1a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 1.9-1.4L22 8H6"/><circle cx="10" cy="20" r="1.2"/><circle cx="18" cy="20" r="1.2"/></svg>;
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: (id: number) => void }) {
  return (
    <article className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} loading="lazy"/>
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <button className="product-heart" type="button" aria-label={"Favoritar " + product.name}>♡</button>
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-detail">{product.detail}</p>
        <div className="product-buy">
          <div><strong>{money(product.price)}</strong><small>/kg</small></div>
          <button type="button" onClick={() => onAdd(product.id)}>Adicionar</button>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [catalogSearch, setCatalogSearch] = useState("");
  const [headerSearch, setHeaderSearch] = useState("");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const featuredRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroSlides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!cartOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCartOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [cartOpen]);

  const filteredProducts = useMemo(() => {
    const term = catalogSearch.trim().toLocaleLowerCase("pt-BR");
    return products.filter((product) => {
      const matchesCategory = activeCategory === "Todos" || product.category === activeCategory;
      const matchesSearch = !term || product.name.toLocaleLowerCase("pt-BR").includes(term) || product.detail.toLocaleLowerCase("pt-BR").includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, catalogSearch]);

  const cartItems = products
    .filter((product) => (cart[product.id] || 0) > 0)
    .map((product) => ({ ...product, quantity: cart[product.id] || 0 }));
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addToCart = (id: number) => setCart((current) => ({ ...current, [id]: (current[id] || 0) + 1 }));
  const changeQuantity = (id: number, amount: number) =>
    setCart((current) => {
      const next = { ...current, [id]: Math.max(0, (current[id] || 0) + amount) };
      if (next[id] === 0) delete next[id];
      return next;
    });

  const scrollCatalog = () => document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
  const scrollCarousel = (ref: RefObject<HTMLDivElement | null>, direction: number) => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: direction * ref.current.clientWidth * 0.78, behavior: "smooth" });
  };

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
            value={headerSearch}
            onChange={(event) => setHeaderSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                setCatalogSearch(headerSearch);
                scrollCatalog();
              }
            }}
            placeholder="O que você procura?"
            aria-label="Buscar produtos"
          />
          <button type="button" aria-label="Buscar produtos" onClick={() => { setCatalogSearch(headerSearch); scrollCatalog(); }}><SearchIcon /></button>
        </label>

        <div className="header-actions">
          <button className="icon-action" aria-label="Minha conta" type="button">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M4.5 20c.8-3.5 3.3-5.3 7.5-5.3s6.7 1.8 7.5 5.3"/></svg>
          </button>
          <button className="icon-action cart-action" aria-label="Abrir sacola de compras" type="button" onClick={() => setCartOpen(true)}>
            <CartIcon />
            {cartCount > 0 && <b className="cart-count">{cartCount}</b>}
          </button>
        </div>
      </header>

      <section className="hero" id="inicio">
        {heroSlides.map((slide, index) => (
          <div className={index === heroIndex ? "hero-slide active" : "hero-slide"} key={slide.eyebrow} aria-hidden={index !== heroIndex}>
            <img className="hero-photo" src={slide.image} alt="" fetchPriority={index === 0 ? "high" : "auto"}/>
            <div className="hero-overlay"/>
            <div className="hero-content">
              <div className="hero-kicker"><span/>{slide.eyebrow}</div>
              <h1>{slide.title}</h1>
              <p>{slide.description}</p>
              <a className="hero-button" href="#destaques">{slide.cta}<span>→</span></a>
            </div>
          </div>
        ))}
        <button className="hero-arrow prev" type="button" aria-label="Banner anterior" onClick={() => setHeroIndex((heroIndex + heroSlides.length - 1) % heroSlides.length)}>‹</button>
        <button className="hero-arrow next" type="button" aria-label="Próximo banner" onClick={() => setHeroIndex((heroIndex + 1) % heroSlides.length)}>›</button>
        <div className="hero-dots">
          {heroSlides.map((slide, index) => <button key={slide.eyebrow} className={heroIndex === index ? "active" : ""} type="button" aria-label={"Ir para banner " + (index + 1)} onClick={() => setHeroIndex(index)}/>)}
        </div>
      </section>

      <section className="benefits" aria-label="Benefícios">
        <div className="benefit-item"><span className="benefit-icon">▣</span><span><strong>Entrega rápida</strong><small>Praticidade até sua casa</small></span></div>
        <div className="benefit-item"><span className="benefit-icon">♙</span><span><strong>Compra segura</strong><small>Seus dados protegidos</small></span></div>
        <div className="benefit-item"><span className="benefit-icon">★</span><span><strong>Qualidade premium</strong><small>Seleção em cada detalhe</small></span></div>
      </section>

      <section className="featured-section" id="destaques">
        <div className="section-heading">
          <div><h2>Nossos Destaques</h2><p>Uma seleção especial para sua mesa.</p></div>
          <div className="carousel-controls">
            <button type="button" aria-label="Produtos anteriores" onClick={() => scrollCarousel(featuredRef, -1)}>‹</button>
            <button type="button" aria-label="Próximos produtos" onClick={() => scrollCarousel(featuredRef, 1)}>›</button>
          </div>
        </div>
        <div className="featured-carousel" ref={featuredRef}>
          {products.filter((product) => product.featured).map((product) => (
            <div className="featured-item" key={product.id}><ProductCard product={product} onAdd={addToCart}/></div>
          ))}
        </div>
      </section>

      <section className="category-section">
        <div className="section-heading">
          <div><div className="section-eyebrow">ESCOLHA DO SEU JEITO</div><h2>Explore por categoria</h2></div>
          <div className="carousel-controls">
            <button type="button" aria-label="Categorias anteriores" onClick={() => scrollCarousel(categoryRef, -1)}>‹</button>
            <button type="button" aria-label="Próximas categorias" onClick={() => scrollCarousel(categoryRef, 1)}>›</button>
          </div>
        </div>
        <div className="category-carousel" ref={categoryRef}>
          {categoryTiles.map((tile, index) => (
            <button className="category-tile" key={tile.name} type="button" onClick={() => { setActiveCategory(tile.filter); scrollCatalog(); }}>
              <img src={tile.image} alt="" loading="lazy"/>
              <span className="category-shade"/>
              <small>0{index + 1}</small>
              <span className="category-tile-copy"><strong>{tile.name}</strong><em>{tile.subtitle}</em></span>
              <b>↗</b>
            </button>
          ))}
        </div>
      </section>

      <section className="catalog-section" id="catalogo">
        <div className="catalog-heading">
          <div><div className="section-eyebrow">NOSSA SELEÇÃO COMPLETA</div><h2>Catálogo de Produtos</h2></div>
          <label className="catalog-search"><SearchIcon/><input value={catalogSearch} onChange={(event) => setCatalogSearch(event.target.value)} placeholder="Buscar produtos..."/></label>
        </div>
        <div className="catalog-layout">
          <aside className="catalog-sidebar" aria-label="Categorias de produtos">
            <strong>Categorias</strong>
            {categories.map((category) => (
              <button key={category} type="button" className={activeCategory === category ? "catalog-category active" : "catalog-category"} onClick={() => setActiveCategory(category)}>
                {category}
                {category === "Todos" && <span>›</span>}
              </button>
            ))}
          </aside>
          <div className="catalog-results">
            <div className="catalog-results-top"><span>{filteredProducts.length} produtos encontrados</span><span>Ordenar: <strong>Mais populares</strong></span></div>
            <div className="catalog-grid">
              {filteredProducts.map((product) => <ProductCard product={product} onAdd={addToCart} key={product.id}/>)}
            </div>
            {filteredProducts.length === 0 && <div className="empty-state">Não encontramos produtos nessa categoria ou busca.</div>}
          </div>
        </div>
      </section>

      <section className="closing-band">
        <div><span>CASA DE CARNES LUIZ ALVENSE</span><h2>Qualidade em cada detalhe.</h2><p>Da nossa seleção para os melhores momentos à mesa.</p></div>
        <a href="#catalogo">Ver catálogo <b>→</b></a>
      </section>

      <footer className="store-footer">
        <a className="store-brand footer-brand" href="#inicio"><span className="brand-symbol"><BullMark /></span><span className="brand-name"><small>CASA DE CARNES</small><strong>LUIZ ALVENSE</strong><em>QUALIDADE EM CADA DETALHE</em></span></a>
        <span>QUALIDADE, CUIDADO E SABOR.</span>
        <span>© 2026 CASA DE CARNES LUIZ ALVENSE</span>
      </footer>

      {cartOpen && (
        <div className="cart-layer">
          <button className="cart-backdrop" type="button" aria-label="Fechar sacola" onClick={() => setCartOpen(false)}/>
          <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
            <div className="cart-drawer-header"><div><small>SUA SELEÇÃO</small><h2 id="cart-title">Meu Carrinho <span>({cartCount})</span></h2></div><button type="button" aria-label="Fechar carrinho" onClick={() => setCartOpen(false)}>×</button></div>
            {cartItems.length === 0 ? (
              <div className="cart-empty"><span>🛒</span><h3>Sua sacola está vazia</h3><p>Adicione seus cortes favoritos para continuar.</p><button type="button" onClick={() => setCartOpen(false)}>Explorar produtos</button></div>
            ) : (
              <>
                <div className="cart-items">
                  {cartItems.map((item) => (
                    <div className="cart-line" key={item.id}>
                      <img src={item.image} alt={item.name}/>
                      <div className="cart-line-info"><strong>{item.name}</strong><small>{money(item.price)}/kg</small><div className="quantity-control"><button type="button" aria-label={"Diminuir " + item.name} onClick={() => changeQuantity(item.id, -1)}>−</button><span>{item.quantity}</span><button type="button" aria-label={"Aumentar " + item.name} onClick={() => changeQuantity(item.id, 1)}>+</button></div></div>
                      <strong className="cart-line-total">{money(item.price * item.quantity)}</strong>
                      <button className="remove-line" type="button" aria-label={"Remover " + item.name} onClick={() => setCart((current) => { const next = { ...current }; delete next[item.id]; return next; })}>×</button>
                    </div>
                  ))}
                </div>
                <div className="cart-summary"><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div><span>Entrega</span><strong className="free-delivery">A calcular</strong></div><div className="cart-total"><span>Total</span><strong>{money(subtotal)}</strong></div><button type="button" className="checkout-button" onClick={() => setCartOpen(false)}>Continuar para finalizar <span>→</span></button><p>Valores demonstrativos para avaliação da interface.</p></div>
              </>
            )}
          </aside>
        </div>
      )}
    </main>
  );
}
