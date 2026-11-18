import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, BadgeCheck, Check, Clock3, Facebook,
  Instagram, LogIn, MapPin, Minus, Plus, Search, ShoppingBag, ShoppingCart, X,
} from 'lucide-react';
import './_group.css';

type Product = {
  id: number; name: string; category: string; description: string; pricePerKg: number;
  saleUnit?: 'kg' | 'unidade'; tier?: 'signature' | 'premium' | 'classic'; marbling?: number;
  uses?: string[]; badges?: string[]; promoLabel?: string; status?: 'sold_out';
};
type CartLine = { product: Product; quantity: number };
type Fulfillment = 'pickup' | 'delivery';
type Payment = 'pix' | 'card' | 'cash' | 'on_delivery';

const currency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
const products: Product[] = [
  { id: 1, name: 'Tomahawk', category: 'Cortes Especiais', description: 'O machado das brasas. Osso longo, capa de gordura, espetáculo.', pricePerKg: 61.99, tier: 'signature', marbling: 5, uses: ['churrasco', 'parrilla'], badges: ['Maturado 21d', 'Edição Limitada'] },
  { id: 2, name: 'Prime Rib', category: 'Cortes Especiais', description: 'A peça de honra do domingo.', pricePerKg: 60.99, tier: 'signature', marbling: 5, uses: ['forno', 'churrasco'], badges: ['Premium', 'Mais pedido'] },
  { id: 3, name: 'T-Bone', category: 'Cortes Especiais', description: 'Filé mignon e contrafilé na mesma peça.', pricePerKg: 66.9, tier: 'signature', marbling: 4, uses: ['churrasco', 'parrilla'], badges: ['Premium'] },
  { id: 4, name: 'Short Rib', category: 'Cortes Especiais', description: 'Costela curta, fibra macia, intensidade total.', pricePerKg: 56.9, tier: 'premium', marbling: 4, uses: ['forno', 'churrasco', 'panela'], badges: ['Slow cook'] },
  { id: 5, name: 'Assado de Tiras', category: 'Cortes Especiais', description: 'A costela à uruguaia. Tira fina, cocção rápida.', pricePerKg: 33.8, tier: 'premium', marbling: 4, uses: ['churrasco', 'parrilla'], badges: ['Estilo platino'] },
  { id: 6, name: 'Filé Mignon', category: 'Bovinos · sem osso', description: 'O músculo mais macio do boi.', pricePerKg: 100.9, tier: 'signature', marbling: 2, uses: ['churrasco', 'forno', 'panela'], badges: ['Premium'] },
  { id: 7, name: 'Picanha', category: 'Bovinos · sem osso', description: 'A rainha do churrasco brasileiro.', pricePerKg: 90.9, tier: 'signature', marbling: 4, uses: ['churrasco', 'parrilla'], badges: ['Mais pedido'] },
  { id: 8, name: 'Entrecôt', category: 'Bovinos · sem osso', description: 'O contrafilé desossado da escola francesa.', pricePerKg: 68.9, tier: 'premium', marbling: 4, uses: ['churrasco', 'panela'] },
  { id: 9, name: 'Contra Filé', category: 'Bovinos · sem osso', description: 'Estrutura clássica, sabor que sustenta.', pricePerKg: 60.9, tier: 'premium', marbling: 3, uses: ['churrasco', 'panela'] },
  { id: 10, name: 'Miolo da Alcatra', category: 'Bovinos · sem osso', description: 'O coração da alcatra.', pricePerKg: 51.9, tier: 'premium', marbling: 3, uses: ['churrasco', 'forno'] },
  { id: 11, name: 'Fraldinha', category: 'Bovinos · sem osso', description: 'Fibra longa, sabor profundo.', pricePerKg: 44.5, tier: 'premium', marbling: 3, uses: ['churrasco', 'parrilla'] },
  { id: 12, name: 'Maminha', category: 'Bovinos · sem osso', description: 'A ponta macia da alcatra.', pricePerKg: 50.9, tier: 'premium', marbling: 3, uses: ['churrasco', 'forno'] },
  { id: 13, name: 'Costela Ripa', category: 'Bovinos · com osso', description: 'Tira de costela com osso, para 6h de fogo brando.', pricePerKg: 32.9, tier: 'classic', uses: ['churrasco', 'panela'] },
  { id: 14, name: 'Costela Suína', category: 'Suínos', description: 'Costela suína selecionada, macia e suculenta.', pricePerKg: 29.9, tier: 'classic', uses: ['churrasco', 'forno'] },
  { id: 15, name: 'Linguiça de Costela', category: 'Linguiças', description: '100% bovina, feita com costela e gordura entremeada.', pricePerKg: 34.9, tier: 'classic', uses: ['churrasco'] },
];
const categories = [...new Set(products.map((product) => product.category))];
const googleStoreViews = [
  { label: 'Frente da loja', href: 'https://www.google.com/local/place/fid/0x94ded7d48c13d8cf:0xd01030d69dc08768/photosphere' },
  { label: 'Dentro da loja', href: 'https://www.google.com/local/place/fid/0x94ded7d48c13d8cf:0xd01030d69dc08768/photosphere' },
];

export function Current() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [cart, setCart] = useState<CartLine[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [fulfillment, setFulfillment] = useState<Fulfillment>('pickup');
  const [payment, setPayment] = useState<Payment>('pix');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [notes, setNotes] = useState('');
  const [validation, setValidation] = useState('');
  const [createdOrder, setCreatedOrder] = useState<{ number: string; total: number } | null>(null);
  const searchTerm = search.trim().toLocaleLowerCase('pt-BR');
  const visibleProducts = products.filter((product) =>
    (categoryFilter === 'all' || product.category === categoryFilter) &&
    (!searchTerm || `${product.name} ${product.category} ${product.description} ${product.uses?.join(' ') ?? ''}`.toLocaleLowerCase('pt-BR').includes(searchTerm)));
  const groupedProducts = categories.map((category) => ({
    category, items: visibleProducts.filter((product) => product.category === category),
  })).filter((group) => group.items.length);
  const featuredProducts = products.filter((product) => product.tier === 'signature' || product.tier === 'premium').slice(0, 3);
  const itemCount = cart.length;
  const estimatedTotal = cart.reduce((total, line) => total + line.quantity * line.product.pricePerKg, 0);
  const addToCart = (product: Product) => {
    setCreatedOrder(null);
    setCart((previous) => {
      const existing = previous.find((line) => line.product.id === product.id);
      return existing
        ? previous.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + .25 } : line)
        : [...previous, { product, quantity: .25 }];
    });
  };
  const changeQuantity = (id: number, delta: number) => {
    setCart((previous) => previous.map((line) => line.product.id === id ? { ...line, quantity: line.quantity + delta } : line).filter((line) => line.quantity > 0));
    setCreatedOrder(null);
  };
  const removeFromCart = (id: number) => setCart((previous) => previous.filter((line) => line.product.id !== id));
  const submitOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!customerName.trim()) return setValidation('Informe seu nome para identificar o pedido.');
    if (fulfillment === 'delivery' && !deliveryAddress.trim()) return setValidation('Informe o endereço para a entrega.');
    if (!cart.length) return setValidation('Adicione ao menos um item ao pedido.');
    setValidation('');
    setCreatedOrder({ number: `PED-${String(Date.now()).slice(-5)}`, total: estimatedTotal });
    setCart([]);
    setCustomerName(''); setPhone(''); setDeliveryAddress(''); setScheduledAt(''); setNotes('');
    setCheckoutOpen(false);
  };

  return <main className="storefront" id="inicio">
    <StoreHeader cartCount={itemCount} onCart={() => setCheckoutOpen(true)} />
    <section className="store-hero"><div className="store-wrap hero-inner">
      <div className="hero-copy">
        <div className="store-eyebrow"><span /> Carne fresca todos os dias <span className="eyebrow-rule" /></div>
        <h1>O sabor do corte<br /><em>certo.</em></h1>
        <p>Direto do frigorífico, com o cuidado da Casa Luisalvense. Explore os cortes e encaminhe seu pedido para retirada ou entrega.</p>
        <a className="hero-link" href="#catalogo">Explorar catálogo <ArrowDownRight size={17} /></a>
      </div>
      <div className="hero-seal"><img src="/__mockup/images/luisalvense-logo.png" alt="Marca Casa de Carnes Luisalvense" />
        <span>Casa de Carnes</span><small>Carne fresca todos os dias</small></div>
      <div className="hero-index"><span>01 — 11</span><span>{products.length} itens no catálogo</span></div>
    </div></section>

    <nav className="store-wrap brand-highlights" aria-label="Informações da Casa Luisalvense">
      <a className="brand-highlight" href="https://www.instagram.com/carnesluisalvense/" target="_blank" rel="noreferrer">
        <img src="/__mockup/images/butcher-icon.png" alt="" /><span><small>Conheça</small><strong>Bancada</strong></span><ArrowRight size={15} />
      </a>
      <a className="brand-highlight" href="#catalogo"><img src="/__mockup/images/products-icon.png" alt="" /><span><small>Veja a seleção</small><strong>Produtos</strong></span><ArrowRight size={15} /></a>
      <a className="brand-highlight" href="#horarios"><img src="/__mockup/images/hours-icon.png" alt="" /><span><small>Planeje sua visita</small><strong>Horários</strong></span><ArrowRight size={15} /></a>
    </nav>

    <div className="store-wrap store-layout" id="catalogo">
      <section className="catalog-area" aria-label="Catálogo de carnes">
        <div className="catalog-intro"><div><span className="store-eyebrow"><span /> A seleção</span>
          <h2>Da vitrine <em>à mesa.</em></h2><p>Preços e disponibilidade conforme o catálogo atual da loja.</p></div>
          <label className="store-search"><Search size={17} aria-hidden="true" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Buscar cortes" placeholder="Buscar um corte..." />
            {search && <button type="button" onClick={() => setSearch('')} aria-label="Limpar busca"><X size={15} /></button>}
          </label>
        </div>
        <nav className="category-nav" aria-label="Categorias do catálogo">
          <button className={categoryFilter === 'all' ? 'selected' : ''} onClick={() => setCategoryFilter('all')}>Tudo <span>{products.length}</span></button>
          {categories.map((category) => <button key={category} className={categoryFilter === category ? 'selected' : ''} onClick={() => setCategoryFilter(category)}>
            {category} <span>{products.filter((product) => product.category === category).length}</span>
          </button>)}
        </nav>
        {visibleProducts.length === 0 ? <div className="store-empty"><Search size={24} /><h3>Nenhum corte encontrado.</h3>
          <p>Tente outro termo ou limpe os filtros.</p><button className="text-button" onClick={() => { setSearch(''); setCategoryFilter('all'); }}>Limpar filtros</button>
        </div> : <>
          {categoryFilter === 'all' && !search && featuredProducts.length > 0 && <section className="featured-section">
            <div className="section-caption"><span>ESCOLHAS DO AÇOUGUEIRO</span><span>{featuredProducts.length} cortes em destaque</span></div>
            <div className="featured-grid">{featuredProducts.map((product, index) => <ProductCard key={product.id} product={product} featured={index === 0} onAdd={() => addToCart(product)} />)}</div>
          </section>}
          {groupedProducts.map((group) => <section className="product-section" key={group.category}>
            <div className="section-caption"><span>{group.category.toLocaleUpperCase('pt-BR')}</span><span>{group.items.length.toString().padStart(2, '0')} cortes</span></div>
            <div className="product-grid">{group.items.map((product) => <ProductCard key={product.id} product={product} onAdd={() => addToCart(product)} />)}</div>
          </section>)}
        </>}
      </section>
      <aside className="order-sidebar"><OrderPanel cart={cart} itemCount={itemCount} total={estimatedTotal} name={customerName} phone={phone}
        fulfillment={fulfillment} payment={payment} address={deliveryAddress} scheduledAt={scheduledAt} notes={notes} validation={validation}
        createdOrder={createdOrder} onName={setCustomerName} onPhone={setPhone} onFulfillment={setFulfillment} onPayment={setPayment}
        onAddress={setDeliveryAddress} onSchedule={setScheduledAt} onNotes={setNotes} onQuantity={changeQuantity} onRemove={removeFromCart}
        onSubmit={submitOrder} onDismissSuccess={() => setCreatedOrder(null)} /></aside>
    </div>

    <section className="story-section" id="processo" aria-labelledby="story-title"><div className="store-wrap">
      <div className="story-heading"><span className="store-eyebrow"><span /> Por trás de cada corte</span>
        <h2 id="story-title">Da peça inteira<br /><em>à sua mesa.</em></h2>
        <p>Um pouco do trabalho da Casa Luisalvense: as peças, o preparo da equipe e a vitrine onde você escolhe seus cortes.</p>
      </div>
      <article className="story-opening">
        <div className="story-whole-photos" aria-label="Peças inteiras antes do corte">
          <figure><img src="/__mockup/images/whole-cut-1.png" alt="Peça bovina inteira suspensa na área de preparo" loading="lazy" /><figcaption>Peça inteira</figcaption></figure>
          <figure><img src="/__mockup/images/whole-cut-2.png" alt="Peça bovina inteira antes de ser dividida em cortes" loading="lazy" /><figcaption>Antes do corte</figcaption></figure>
          <figure><img src="/__mockup/images/whole-cut-3.png" alt="Peça de carne suspensa para preparação" loading="lazy" /><figcaption>Na área de preparo</figcaption></figure>
        </div>
        <div className="story-opening-copy"><span className="story-number">01 / A ORIGEM</span>
          <h3>A história começa com a peça inteira.</h3>
          <p>Antes de chegar à vitrine, cada peça passa pelo trabalho da equipe da casa. Aqui você vê um pouco desse processo, sem confundir as fotos da loja com imagens de um corte específico do catálogo.</p>
        </div>
      </article>
      <div className="story-steps">
        <StoryCard image="preparation.png" alt="Equipe trabalhando na área de preparo da Casa Luisalvense" number="02 / O PREPARO" title="Trabalho de equipe" text="É na área de preparo que as peças são trabalhadas para se tornarem os cortes escolhidos pelos clientes." />
        <StoryCard image="cut-photo.png" alt="Detalhe de cortes de carne preparados sobre a bancada" number="03 / O ACABAMENTO" title="O cuidado no corte" text="As peças são divididas em cortes para diferentes preparos. A disponibilidade pode variar conforme o dia." />
        <StoryCard image="cut-detail.png" alt="Cortes de carne preparados sobre a bancada" number="04 / OS CORTES" title="Do balcão à escolha" text="Consulte o catálogo para ver os cortes disponíveis, as unidades de venda e os preços atuais." />
        <StoryCard image="display.png" alt="Seleção de carnes exposta na vitrine refrigerada da loja" number="05 / A VITRINE" title="Prontos para escolher" text="Na vitrine, você pode conhecer a seleção da loja e montar seu pedido com a equipe." />
      </div>
    </div></section>

    <section className="visit-section" id="visite-a-loja" aria-labelledby="visit-title"><div className="store-wrap visit-inner">
      <img className="visit-photo" src="/__mockup/images/storefront.png" alt="Fachada da Casa de Carnes Luisalvense" loading="lazy" />
      <div className="visit-copy"><span className="store-eyebrow"><span /> A nossa casa</span><h2 id="visit-title">Estamos em<br /><em>Luiz Alves.</em></h2>
        <p>Carne fresca todos os dias, direto do frigorífico. Venha conhecer a Casa Luisalvense.</p>
        <div className="visit-address"><MapPin size={17} aria-hidden="true" /><span>SC-414, 11014<br />Luiz Alves · SC</span></div>
        <div className="visit-360"><span className="story-number">PASSEIO VIRTUAL NO GOOGLE MAPS</span><p>Veja a frente e o interior da loja em 360°.</p>
          <div className="visit-360-links">{googleStoreViews.map((view) => <a key={view.label} className="visit-360-link" href={view.href} target="_blank" rel="noopener noreferrer">{view.label} <ArrowUpRight size={14} /></a>)}</div>
          <small>O passeio abre em uma nova aba; continue pelas vistas conectadas no Google Maps.</small>
        </div><a className="review-link visit-map-link" href="https://maps.app.goo.gl/mMYAdsCC7Et2UZBX7" target="_blank" rel="noreferrer">Como chegar <ArrowRight size={15} /></a>
      </div>
    </div></section>

    <section className="service-band" id="horarios"><div className="store-wrap service-inner">
      <div><span className="store-eyebrow"><span /> Casa de Carnes Luisalvense</span><h2>Do balcão<br /><em>para sua casa.</em></h2></div>
      <p>O pedido é enviado para confirmação da equipe. Cortes vendidos por peso têm valor estimado; o total final é confirmado pela loja após o preparo.</p>
      <div className="service-hours"><Clock3 size={17} /><span><strong>Horários de atendimento</strong><br />Seg a Sex · 07h30 às 18h00<br />Sáb · 07h30 às 16h00</span></div>
    </div></section>
    <section className="review-band" id="avaliacoes" aria-label="Avaliações da Casa Luisalvense"><div className="store-wrap review-inner">
      <div className="review-mark" aria-hidden="true"><BadgeCheck size={24} /></div><div className="review-copy"><span className="store-eyebrow"><span /> Quem compra recomenda</span>
        <h2>Mais de <em>60 avaliações</em> no Google.</h2><p>Veja o que os clientes contam sobre a experiência na Casa Luisalvense.</p></div>
      <a className="review-link" href="https://www.google.com/maps/search/?api=1&query=Casa%20de%20Carnes%20Luisalvense" target="_blank" rel="noreferrer">Ver avaliações <ArrowRight size={15} /></a>
    </div></section>
    <footer className="store-footer"><div className="store-wrap footer-inner">
      <span>Casa de Carnes Luisalvense</span><span>Carne fresca todos os dias · Direto do frigorífico</span>
      <a href="https://www.instagram.com/carnesluisalvense/" target="_blank" rel="noreferrer"><Instagram size={14} /> Instagram</a>
      <a href="https://www.facebook.com/profile.php?id=61562909257349" target="_blank" rel="noreferrer"><Facebook size={14} /> Facebook</a>
      <a href="#equipe" className="footer-team-access">Acesso da equipe <ArrowRight size={14} /></a><a href="#inicio">Voltar ao início <ArrowRight size={14} /></a>
    </div></footer>
    {checkoutOpen && <div className="checkout-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCheckoutOpen(false); }}>
      <section className="checkout-drawer" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
        <header className="drawer-heading"><div><span className="store-eyebrow"><span /> Seu pedido</span><h2 id="checkout-title">Conferir seleção</h2></div>
          <button className="icon-close" onClick={() => setCheckoutOpen(false)} aria-label="Fechar pedido"><X size={19} /></button></header>
        <OrderPanel cart={cart} itemCount={itemCount} total={estimatedTotal} name={customerName} phone={phone}
          fulfillment={fulfillment} payment={payment} address={deliveryAddress} scheduledAt={scheduledAt} notes={notes} validation={validation}
          createdOrder={createdOrder} onName={setCustomerName} onPhone={setPhone} onFulfillment={setFulfillment} onPayment={setPayment}
          onAddress={setDeliveryAddress} onSchedule={setScheduledAt} onNotes={setNotes} onQuantity={changeQuantity} onRemove={removeFromCart}
          onSubmit={submitOrder} onDismissSuccess={() => setCreatedOrder(null)} />
      </section>
    </div>}
    <nav className="mobile-store-nav" aria-label="Atalhos principais da loja">
      <a href="#catalogo"><ShoppingBag size={17} /><span>Catálogo</span></a><a href="#processo"><MapPin size={17} /><span>Nossa casa</span></a>
      <a href="#horarios"><Clock3 size={17} /><span>Horários</span></a>
      <button type="button" className="mobile-store-order" onClick={() => setCheckoutOpen(true)}><ShoppingCart size={17} /><span>{itemCount > 0 ? `Pedido · ${itemCount}` : 'Meu pedido'}</span>{itemCount > 0 && <strong>{currency(estimatedTotal)}</strong>}</button>
    </nav>
  </main>;
}

function StoreHeader({ cartCount, onCart }: { cartCount: number; onCart: () => void }) {
  return <header className="store-header"><div className="store-wrap header-inner">
    <a href="#inicio" className="store-brand" aria-label="Casa de Carnes Luisalvense — início">
      <img src="/__mockup/images/luisalvense-logo.png" alt="" /><span><strong>LUISALVENSE</strong><small>Carne fresca todos os dias</small></span>
    </a>
    <nav className="header-links" aria-label="Navegação da loja">
      <a href="#catalogo">Catálogo</a><a href="#processo">Nossa casa</a><a href="#horarios">Horários</a>
      <a href="https://www.instagram.com/carnesluisalvense/" target="_blank" rel="noreferrer">Instagram</a>
      <a href="https://www.facebook.com/profile.php?id=61562909257349" target="_blank" rel="noreferrer">Facebook</a>
      <a href="#equipe">Acesso da equipe</a>
    </nav>
    <a href="#entrar" className="header-account"><LogIn size={15} /><span>Entrar</span></a>
    <button className="header-cart" onClick={onCart}><ShoppingBag size={16} /><span>Meu pedido</span>{cartCount > 0 && <b>{cartCount}</b>}</button>
  </div></header>;
}

function ProductCard({ product, featured = false, onAdd }: { product: Product; featured?: boolean; onAdd: () => void }) {
  return <article className={`product-card ${featured ? 'feature-card' : ''}`}>
    <div className={`product-art ${featured ? 'featured-art' : ''}`} aria-hidden="true">
      <span className="art-index">{product.tier === 'signature' ? 'ASSINATURA' : product.tier === 'premium' ? 'PREMIUM' : product.category}</span>
      <span className="art-mark">{product.name.slice(0, 1).toLocaleUpperCase('pt-BR')}</span>
      {product.promoLabel && <span className="product-ribbon">{product.promoLabel}</span>}
      {product.status === 'sold_out' && <span className="availability-tag">Esgotado</span>}
    </div>
    <div className="product-details"><div className="product-head"><div><span className="product-category">{product.category}</span><h3>{product.name}</h3></div>
      {product.tier && <span className={`tier-marker ${product.tier}`} title={product.tier} />}
    </div>
    {product.description && <p className="product-description">{product.description}</p>}
    {product.badges && <div className="product-badges">{product.badges.slice(0, 2).map((badge) => <span key={badge}>{badge}</span>)}</div>}
    {product.marbling != null && <div className="marbling-guide" aria-label={`Marmoreio ${product.marbling} de 5`}><span>MARMOREIO</span>
      {[1, 2, 3, 4, 5].map((mark) => <i key={mark} className={mark <= product.marbling! ? 'on' : ''} />)}</div>}
    {product.uses && <div className="use-guidance"><span>VAI BEM EM</span>{product.uses.slice(0, 3).map((use) => <b key={use}>{use}</b>)}</div>}
    <div className="product-foot"><div className="price-block"><strong>{currency(product.pricePerKg)}</strong><small>por {product.saleUnit ?? 'kg'}</small></div>
      <button className="add-product" onClick={onAdd} disabled={product.status === 'sold_out'} aria-label={`Adicionar ${product.name} ao pedido`}>
        <Plus size={17} /><span>Adicionar</span></button>
    </div></div>
  </article>;
}

function StoryCard({ image, alt, number, title, text }: { image: string; alt: string; number: string; title: string; text: string }) {
  return <article className="story-card"><img src={`/__mockup/images/${image}`} alt={alt} loading="lazy" />
    <div className="story-card-copy"><span className="story-number">{number}</span><h3>{title}</h3><p>{text}</p></div>
  </article>;
}

type OrderPanelProps = {
  cart: CartLine[]; itemCount: number; total: number; name: string; phone: string; fulfillment: Fulfillment;
  payment: Payment; address: string; scheduledAt: string; notes: string; validation: string;
  createdOrder: { number: string; total: number } | null;
  onName: (value: string) => void; onPhone: (value: string) => void; onFulfillment: (value: Fulfillment) => void;
  onPayment: (value: Payment) => void; onAddress: (value: string) => void; onSchedule: (value: string) => void;
  onNotes: (value: string) => void; onQuantity: (id: number, delta: number) => void; onRemove: (id: number) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void; onDismissSuccess: () => void;
};

function OrderPanel(props: OrderPanelProps) {
  const { cart, itemCount, total, name, phone, fulfillment, payment, address, scheduledAt, notes, validation, createdOrder,
    onName, onPhone, onFulfillment, onPayment, onAddress, onSchedule, onNotes, onQuantity, onRemove, onSubmit, onDismissSuccess } = props;
  const paymentLabels: Record<Payment, string> = { pix: 'Pix', card: 'Cartão', cash: 'Dinheiro', on_delivery: 'Na entrega' };
  return <div className="order-panel">
    {createdOrder && <div className="order-success" role="status"><button className="success-close" aria-label="Fechar confirmação" onClick={onDismissSuccess}><X size={15} /></button>
      <span className="success-icon"><Check size={19} /></span><span className="store-eyebrow"><span /> Pedido encaminhado</span>
      <h3>{createdOrder.number}</h3><p>Estimativa de {currency(createdOrder.total)}. A equipe da loja confirmará o pedido e o total final.</p>
      <small>Pagamento pendente — nenhum pagamento foi processado.</small>
    </div>}
    <div className="order-panel-head"><div><span className="store-eyebrow"><span /> BALCÃO DIGITAL</span><h2>Sua seleção <span>{itemCount}</span></h2></div><ShoppingBag size={19} /></div>
    {!cart.length ? <div className="cart-empty"><div className="empty-bag"><ShoppingBag size={20} /></div>
      <strong>Seu pedido começa aqui.</strong><p>Escolha um corte na vitrine. A equipe confirma disponibilidade e preparo.</p>
    </div> : <>
      <div className="cart-line-list">{cart.map(({ product, quantity }) => <div className="cart-line" key={product.id}>
        <div className="cart-line-name"><strong>{product.name}</strong><span>{currency(product.pricePerKg)} / {product.saleUnit ?? 'kg'}</span></div>
        <div className="cart-line-controls">
          <button aria-label={`Diminuir ${product.name}`} onClick={() => quantity > .25 ? onQuantity(product.id, -.25) : onRemove(product.id)}><Minus size={13} /></button>
      <span>{quantity.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} {product.saleUnit ?? 'kg'}</span>
          <button aria-label={`Adicionar mais ${product.name}`} onClick={() => onQuantity(product.id, .25)}><Plus size={13} /></button>
          <strong>{currency(quantity * product.pricePerKg)}</strong>
        </div>
      </div>)}</div><div className="cart-total"><span>Estimativa do pedido</span><strong>{currency(total)}</strong></div>
    </>}
    <form className="order-form" onSubmit={onSubmit}>
      <div className="form-divider"><span>ENCAMINHAR PEDIDO</span></div>
      <label className="store-field">Seu nome <input required autoComplete="name" value={name} onChange={(event) => onName(event.target.value)} placeholder="Como podemos chamar você?" /></label>
      <label className="store-field">Telefone <span className="optional">opcional</span><input type="tel" autoComplete="tel" value={phone} onChange={(event) => onPhone(event.target.value)} placeholder="Para contato sobre seu pedido" /></label>
      <fieldset className="choice-fieldset"><legend>Como prefere receber?</legend><div className="choice-row">
        {(['pickup', 'delivery'] as const).map((option) => <button key={option} type="button" className={fulfillment === option ? 'choice selected' : 'choice'} onClick={() => onFulfillment(option)}>{option === 'pickup' ? 'Retirar' : 'Entrega'}</button>)}
      </div></fieldset>
      {fulfillment === 'delivery' && <label className="store-field">Endereço de entrega <input required autoComplete="street-address" value={address} onChange={(event) => onAddress(event.target.value)} placeholder="Rua, número e bairro" /></label>}
      <label className="store-field">Horário desejado <span className="optional">opcional</span><input type="datetime-local" value={scheduledAt} onChange={(event) => onSchedule(event.target.value)} /></label>
      {fulfillment === 'pickup' && <div className="pickup-times"><span>HORÁRIOS DE RETIRADA</span><div>{['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map((time) => <span key={time}>{time}</span>)}</div></div>}
      <p className="prep-time"><Clock3 size={13} /> Preparo estimado: cerca de 45 min. A equipe confirma o horário.</p>
      <fieldset className="choice-fieldset"><legend>Pagamento</legend><div className="payment-options">
        {(['pix', 'card', 'cash', 'on_delivery'] as const).map((method) => <button key={method} type="button" className={payment === method ? 'payment-option selected' : 'payment-option'} onClick={() => onPayment(method)}>{paymentLabels[method]}</button>)}
      </div></fieldset>
      <label className="store-field">Recado para o açougueiro <span className="optional">opcional</span><textarea rows={2} value={notes} onChange={(event) => onNotes(event.target.value)} placeholder="Algum detalhe para o preparo?" /></label>
      <p className="estimate-disclaimer">Valores estimados. Cortes por peso são pesados no preparo; a loja confirma o total final. O pedido fica pendente de confirmação.</p>
      {validation && <p className="validation-message" role="alert">{validation}</p>}
      <button className="store-button primary submit-order" disabled={!cart.length}>Enviar pedido <ArrowRight size={16} /></button>
    </form>
  </div>;
}
