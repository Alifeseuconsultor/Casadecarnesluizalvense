import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  getGetDashboardSummaryQueryKey,
  getGetStoreSettingsQueryKey,
  getListCatalogQueryKey,
  getListOrdersQueryKey,
  useCreateOrder,
  useGetStoreSettings,
  useListCatalog,
} from '@workspace/api-client-react';
import type { CatalogProduct, OrderInput } from '@workspace/api-client-react';
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  CircleAlert,
  Clock3,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  ShoppingCart,
  X,
} from 'lucide-react';
import logo from '@assets/image_1794603595147.png';
import './storefront.css';

type Fulfillment = 'pickup' | 'delivery';
type Payment = 'pix' | 'card' | 'cash' | 'on_delivery';
type CartLine = { product: CatalogProduct; quantity: number };

const currency = (value: number) => new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
}).format(value);

const livePrice = (product: CatalogProduct) => {
  const now = Date.now();
  const startsAt = product.promoStartsAt ? new Date(product.promoStartsAt).getTime() : null;
  const endsAt = product.promoEndsAt ? new Date(product.promoEndsAt).getTime() : null;
  const promoIsLive = product.promoPrice != null &&
    (startsAt == null || startsAt <= now) &&
    (endsAt == null || endsAt >= now);
  return promoIsLive ? product.promoPrice as number : product.pricePerKg;
};

const quantityStep = (product: CatalogProduct) => product.productType === 'combo' || product.saleUnit === 'unidade'
  ? 1
  : product.saleUnit === 'g' ? 100 : 0.25;

const slug = (text: string) => text.toLocaleLowerCase('pt-BR')
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const paymentLabels: Record<Payment, string> = {
  pix: 'Pix',
  card: 'Cartão',
  cash: 'Dinheiro',
  on_delivery: 'Na entrega',
};

const tierLabels: Record<string, string> = {
  signature: 'Assinatura',
  premium: 'Premium',
  classic: 'Clássico',
  daily: 'Do dia a dia',
};

function Storefront() {
  const queryClient = useQueryClient();
  const catalogQuery = useListCatalog({ query: { queryKey: getListCatalogQueryKey() } });
  const settingsQuery = useGetStoreSettings({ query: { queryKey: getGetStoreSettingsQueryKey() } });
  const createOrder = useCreateOrder();
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

  const allProducts = catalogQuery.data ?? [];
  const products = allProducts.filter((product) => product.active && product.status !== 'inactive');
  const categories = useMemo(() => [...new Set(products.map((product) => product.category))], [products]);
  const searchTerm = search.trim().toLocaleLowerCase('pt-BR');
  const visibleProducts = products.filter((product) => {
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const editorialText = [
      product.editorial?.tagline,
      ...(product.editorial?.uses ?? []),
      ...(product.editorial?.badges ?? []),
    ].join(' ');
    const matchesSearch = !searchTerm ||
      `${product.name} ${product.category} ${product.description ?? ''} ${editorialText}`
        .toLocaleLowerCase('pt-BR').includes(searchTerm);
    return matchesCategory && matchesSearch;
  });
  const groupedProducts = categories.map((category) => ({
    category,
    items: visibleProducts.filter((product) => product.category === category),
  })).filter((group) => group.items.length > 0);
  const featuredProducts = products.filter((product) =>
    product.editorial?.tier === 'signature' || product.editorial?.tier === 'premium',
  ).slice(0, 3);
  const settings = settingsQuery.data;
  const services = settings?.serviceTypes?.length ? settings.serviceTypes : ['pickup', 'delivery'];
  const payments = settings?.paymentMethods?.length ? settings.paymentMethods : ['pix'];
  const allowedService = services.includes(fulfillment);
  const allowedPayment = payments.includes(payment);
  const itemCount = cart.length;
  const estimatedTotal = cart.reduce((sum, line) => sum + line.quantity * estimateUnitPrice(line.product), 0);
  const requestItems = cart.filter((line) => line.product.editorial?.priceOnRequest);

  useEffect(() => {
    if (services.length && !services.includes(fulfillment)) setFulfillment(services[0] as Fulfillment);
    if (payments.length && !payments.includes(payment)) setPayment(payments[0] as Payment);
  }, [settings, fulfillment, payment]);

  function estimateUnitPrice(product: CatalogProduct) {
    const price = livePrice(product);
    if (product.productType === 'combo' || product.saleUnit === 'unidade') return price;
    return product.saleUnit === 'g' ? price / 1000 : price;
  }

  function addToCart(product: CatalogProduct) {
    if (product.status === 'sold_out' || product.editorial?.priceOnRequest) return;
    setCreatedOrder(null);
    setCart((current) => {
      const existing = current.find((line) => line.product.id === product.id);
      return existing
        ? current.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + quantityStep(product) } : line)
        : [...current, { product, quantity: quantityStep(product) }];
    });
  }

  function changeQuantity(productId: number, delta: number) {
    setCart((current) => current
      .map((line) => line.product.id === productId ? { ...line, quantity: line.quantity + delta } : line)
      .filter((line) => line.quantity > 0));
    setCreatedOrder(null);
  }

  function removeFromCart(productId: number) {
    setCart((current) => current.filter((line) => line.product.id !== productId));
    setCreatedOrder(null);
  }

  function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidation('');
    if (!customerName.trim()) {
      setValidation('Informe seu nome para identificar o pedido.');
      return;
    }
    if (fulfillment === 'delivery' && !deliveryAddress.trim()) {
      setValidation('Informe o endereço para a entrega.');
      return;
    }
    if (!cart.length) {
      setValidation('Adicione ao menos um item ao pedido.');
      return;
    }
    if (requestItems.length) {
      setValidation('Há itens para consultar no balcão. Remova-os antes de enviar o pedido.');
      return;
    }
    if (!allowedService || !allowedPayment) {
      setValidation('As opções de atendimento ou pagamento mudaram. Atualize a página e tente novamente.');
      return;
    }
    const orderInput: OrderInput = {
      customer: { name: customerName.trim(), phone: phone.trim() || null },
      serviceType: fulfillment,
      ...(fulfillment === 'delivery' ? { deliveryAddress: deliveryAddress.trim() } : {}),
      paymentMethod: payment,
      scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      notes: notes.trim() || null,
      items: cart.map(({ product, quantity }) => {
        const unit = product.productType === 'combo' ? 'unidade' : product.saleUnit;
        const estimatedWeightKg = unit === 'kg' ? quantity : unit === 'g' ? quantity / 1000 : null;
        return {
          productId: product.id,
          productName: product.name,
          quantity,
          unit,
          pricePerKg: livePrice(product),
          estimatedWeightKg,
        };
      }),
    };
    createOrder.mutate({ data: orderInput }, {
      onSuccess: (order) => {
        void queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
        void queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
        setCreatedOrder({ number: order.orderNumber, total: order.estimatedTotal });
        setCart([]);
        setCustomerName('');
        setPhone('');
        setDeliveryAddress('');
        setScheduledAt('');
        setNotes('');
        setCheckoutOpen(false);
      },
      onError: () => setValidation('Não foi possível enviar agora. Confira seus dados e tente novamente.'),
    });
  }

  if (catalogQuery.isLoading) {
    return <main className="storefront store-loading" aria-label="Carregando catálogo">
      <StoreHeader cartCount={itemCount} onCart={() => setCheckoutOpen(true)} />
      <div className="store-wrap">
        <div className="store-skeleton hero-skeleton" />
        <div className="store-skeleton heading-skeleton" />
        <div className="store-skeleton-grid">{[0, 1, 2, 3].map((item) => <div className="store-skeleton" key={item} />)}</div>
      </div>
    </main>;
  }

  if (catalogQuery.isError) {
    return <main className="storefront">
      <StoreHeader cartCount={itemCount} onCart={() => setCheckoutOpen(true)} />
      <div className="store-state">
        <CircleAlert size={26} />
        <h1>O catálogo não chegou por aqui.</h1>
        <p>Confira sua conexão e tente carregar novamente.</p>
      <button className="store-button primary" onClick={() => void catalogQuery.refetch()} data-testid="button-store-retry">Tentar novamente <ArrowRight size={16} /></button>
      </div>
    </main>;
  }

  return <main className="storefront" id="inicio">
    <StoreHeader cartCount={itemCount} onCart={() => setCheckoutOpen(true)} />
    <section className="store-hero">
      <div className="store-wrap hero-inner">
        <div className="hero-copy">
          <div className="store-eyebrow"><span /> Catálogo da casa <span className="eyebrow-rule" /></div>
          <h1>O sabor do corte<br /><em>certo.</em></h1>
          <p>Escolhido no balcão, preparado do seu jeito. Explore os cortes e deixe o pedido encaminhado para retirada ou entrega.</p>
          <a className="hero-link" href="#catalogo">Explorar catálogo <ArrowDownRight size={17} /></a>
        </div>
        <div className="hero-seal">
          <img src={logo} alt="Marca Casa de Carnes Luisalvense" />
          <span>Casa de Carnes</span>
           <small>Carne fresca todos os dias</small>
        </div>
        <div className="hero-index"><span>01 — 11</span><span>{products.length} itens no catálogo</span></div>
      </div>
    </section>

    <div className="store-wrap store-layout" id="catalogo">
      <section className="catalog-area" aria-label="Catálogo de carnes">
        <div className="catalog-intro">
          <div>
            <span className="store-eyebrow"><span /> A seleção</span>
            <h2>Da vitrine <em>à mesa.</em></h2>
            <p>Preços e disponibilidade conforme o catálogo atual da loja.</p>
          </div>
          <label className="store-search">
            <Search size={17} aria-hidden="true" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Buscar cortes" placeholder="Buscar um corte..." data-testid="input-store-search" />
            {search && <button type="button" onClick={() => setSearch('')} aria-label="Limpar busca" data-testid="button-clear-store-search"><X size={15} /></button>}
          </label>
        </div>

        <nav className="category-nav" aria-label="Categorias do catálogo">
          <button className={categoryFilter === 'all' ? 'selected' : ''} onClick={() => setCategoryFilter('all')} data-testid="button-category-all">Tudo <span>{products.length}</span></button>
          {categories.map((category) => <button key={category} className={categoryFilter === category ? 'selected' : ''} onClick={() => setCategoryFilter(category)} data-testid={`button-category-${slug(category)}`}>
            {category} <span>{products.filter((product) => product.category === category).length}</span>
          </button>)}
        </nav>

        {settingsQuery.isError && <div className="settings-note" role="status">As opções de retirada e pagamento estão temporariamente indisponíveis; as escolhas padrão estão disponíveis.</div>}

        {products.length === 0 ? <div className="store-empty">
          <ShoppingBag size={25} />
          <h3>A vitrine está sendo preparada.</h3>
          <p>Não há itens disponíveis no catálogo neste momento.</p>
        </div> : visibleProducts.length === 0 ? <div className="store-empty">
          <Search size={24} />
          <h3>Nenhum corte encontrado.</h3>
          <p>Tente outro termo ou limpe os filtros.</p>
          <button className="text-button" onClick={() => { setSearch(''); setCategoryFilter('all'); }} data-testid="button-clear-store-filters">Limpar filtros</button>
        </div> : <>
          {categoryFilter === 'all' && !search && featuredProducts.length > 0 && <section className="featured-section">
            <div className="section-caption"><span>ESCOLHAS DO AÇOUGUEIRO</span><span>{featuredProducts.length} cortes em destaque</span></div>
            <div className="featured-grid">{featuredProducts.map((product, index) =>
              <ProductCard key={product.id} product={product} featured={index === 0} onAdd={() => addToCart(product)} />
            )}</div>
          </section>}
          {groupedProducts.map((group) => <section className="product-section" key={group.category} id={`cat-${slug(group.category)}`}>
            <div className="section-caption"><span>{group.category.toLocaleUpperCase('pt-BR')}</span><span>{group.items.length.toString().padStart(2, '0')} cortes</span></div>
            <div className="product-grid">{group.items.map((product) =>
              <ProductCard key={product.id} product={product} onAdd={() => addToCart(product)} />
            )}</div>
          </section>)}
        </>}
      </section>
      <aside className="order-sidebar">
        <OrderPanel
          cart={cart} itemCount={itemCount} total={estimatedTotal} name={customerName} phone={phone}
          fulfillment={fulfillment} payment={payment} address={deliveryAddress} scheduledAt={scheduledAt} notes={notes}
          settings={settings} services={services} payments={payments} busy={createOrder.isPending}
          validation={validation} createdOrder={createdOrder}
          onName={setCustomerName} onPhone={setPhone} onFulfillment={setFulfillment} onPayment={setPayment}
          onAddress={setDeliveryAddress} onSchedule={setScheduledAt} onNotes={setNotes}
          onQuantity={changeQuantity} onRemove={removeFromCart} onSubmit={submitOrder}
          onDismissSuccess={() => setCreatedOrder(null)}
        />
      </aside>
    </div>

    <section className="service-band">
      <div className="store-wrap service-inner">
        <div><span className="store-eyebrow"><span /> Do balcão para sua casa</span><h2>Peça com calma.<br /><em>A gente prepara.</em></h2></div>
        <p>O pedido é enviado para confirmação da equipe. Cortes vendidos por peso têm valor estimado; o total final é confirmado pela loja após o preparo.</p>
        <div className="service-hours"><Clock3 size={17} /><span>Seg–Sex · 07:30–18:00<br />Sáb · 07:30–16:00</span></div>
      </div>
    </section>
    <footer className="store-footer">
      <div className="store-wrap footer-inner">
        <span>Casa de Carnes Luisalvense</span><span>Seleção da casa · Atendimento local</span><a href="#inicio">Voltar ao início <ArrowRight size={14} /></a>
      </div>
    </footer>

    {checkoutOpen && <div className="checkout-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) setCheckoutOpen(false);
    }}>
      <section className="checkout-drawer" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
        <header className="drawer-heading"><div><span className="store-eyebrow"><span /> Seu pedido</span><h2 id="checkout-title">Conferir seleção</h2></div>
          <button className="icon-close" onClick={() => setCheckoutOpen(false)} aria-label="Fechar pedido"><X size={19} /></button>
        </header>
        <OrderPanel
          cart={cart} itemCount={itemCount} total={estimatedTotal} name={customerName} phone={phone}
          fulfillment={fulfillment} payment={payment} address={deliveryAddress} scheduledAt={scheduledAt} notes={notes}
          settings={settings} services={services} payments={payments} busy={createOrder.isPending}
          validation={validation} createdOrder={createdOrder}
          onName={setCustomerName} onPhone={setPhone} onFulfillment={setFulfillment} onPayment={setPayment}
          onAddress={setDeliveryAddress} onSchedule={setScheduledAt} onNotes={setNotes}
          onQuantity={changeQuantity} onRemove={removeFromCart} onSubmit={(event) => { submitOrder(event); }}
          onDismissSuccess={() => setCreatedOrder(null)}
        />
      </section>
    </div>}
    {itemCount > 0 && <button className="mobile-cart-button" onClick={() => setCheckoutOpen(true)} aria-label={`Abrir pedido com ${itemCount} itens`}>
      <span><ShoppingCart size={18} /> {itemCount} {itemCount === 1 ? 'item' : 'itens'}</span><strong>{currency(estimatedTotal)}</strong><ArrowRight size={17} />
    </button>}
  </main>;
}

function StoreHeader({ cartCount, onCart }: { cartCount: number; onCart: () => void }) {
  return <header className="store-header">
    <div className="store-wrap header-inner">
      <a href="#inicio" className="store-brand" aria-label="Casa de Carnes Luisalvense — início">
        <img src={logo} alt="" />
         <span><strong>LUISALVENSE</strong><small>Carne fresca todos os dias</small></span>
      </a>
      <nav className="header-links" aria-label="Navegação da loja">
        <a href="#catalogo">Catálogo</a><a href="#catalogo">Cortes e kits</a>
      </nav>
      <button className="header-cart" onClick={onCart} data-testid="button-open-store-cart"><ShoppingBag size={16} /> <span>Meu pedido</span>{cartCount > 0 && <b>{cartCount}</b>}</button>
    </div>
  </header>;
}

function ProductCard({ product, featured = false, onAdd }: { product: CatalogProduct; featured?: boolean; onAdd: () => void }) {
  const price = livePrice(product);
  const unavailable = product.status === 'sold_out';
  const consultOnly = Boolean(product.editorial?.priceOnRequest);
  const combo = product.productType === 'combo';
  const unitLabel = combo ? 'kit' : product.saleUnit;
  const heroImage = product.imageUrl;
  const tier = product.editorial?.tier;
  return <article className={`product-card ${featured ? 'feature-card' : ''} ${combo ? 'combo-card' : ''}`} data-testid={`card-store-product-${product.id}`}>
    <div className={`product-art ${heroImage ? 'with-photo' : ''} ${featured ? 'featured-art' : ''}`} aria-hidden="true">
      {heroImage ? <img src={heroImage} alt="" loading="lazy" /> : <><span className="art-index">{combo ? 'KIT' : tier ? tierLabels[tier] ?? 'CORTE' : product.category}</span><span className="art-mark">{combo ? 'C' : product.name.slice(0, 1).toLocaleUpperCase('pt-BR')}</span></>}
      {(product.promoLabel || combo) && <span className="product-ribbon">{product.promoLabel || 'Da casa'}</span>}
      {unavailable && <span className="availability-tag">Esgotado</span>}
    </div>
    <div className="product-details">
      <div className="product-head"><div><span className="product-category">{combo ? 'COMBINAÇÃO DA CASA' : product.category}</span><h3>{product.name}</h3></div>
        {tier && <span className={`tier-marker ${tier}`} title={tierLabels[tier]} />}
      </div>
      {(product.editorial?.tagline || product.description) && <p className="product-description">{product.editorial?.tagline || product.description}</p>}
      {product.editorial?.badges && product.editorial.badges.length > 0 && <div className="product-badges">
        {product.editorial.badges.slice(0, 2).map((badge) => <span key={badge}>{badge}</span>)}
      </div>}
      {product.editorial?.marbling != null && <div className="marbling-guide" aria-label={`Marmoreio ${product.editorial.marbling} de 5`}>
        <span>MARMOREIO</span>{[1, 2, 3, 4, 5].map((mark) => <i key={mark} className={mark <= (product.editorial?.marbling ?? 0) ? 'on' : ''} />)}
      </div>}
      {combo && product.editorial?.items && product.editorial.items.length > 0 && <ul className="kit-contents">
        {product.editorial.items.slice(0, 3).map((item) => <li key={item}>{item}</li>)}
      </ul>}
      {combo && product.editorial?.serves && <p className="combo-serves">{product.editorial.serves}</p>}
      {combo && product.editorial?.savings != null && product.editorial.savings > 0 && <span className="combo-saving">Economize {currency(product.editorial.savings)}</span>}
      {product.editorial?.uses && product.editorial.uses.length > 0 && <div className="use-guidance">
        <span>VAI BEM EM</span>{product.editorial.uses.slice(0, 3).map((use) => <b key={use}>{use}</b>)}
      </div>}
      <div className="product-foot">
        <div className="price-block">
          {consultOnly ? <strong className="price-consult">Consulte</strong> : <>
            {product.promoPrice != null && price !== product.pricePerKg && <del>{currency(product.pricePerKg)}</del>}
            <strong>{currency(price)}</strong><small>por {unitLabel}</small>
          </>}
        </div>
        <button className="add-product" onClick={onAdd} disabled={unavailable || consultOnly} aria-label={unavailable ? `${product.name} esgotado` : consultOnly ? `Consultar ${product.name} no balcão` : `Adicionar ${product.name} ao pedido`} title={consultOnly ? 'Disponível para consulta no balcão' : unavailable ? 'Indisponível' : 'Adicionar ao pedido'} data-testid={`button-add-store-product-${product.id}`}>
          {unavailable || consultOnly ? <span>{unavailable ? 'Indisponível' : 'Consultar'}</span> : <><Plus size={17} /><span>Adicionar</span></>}
        </button>
      </div>
    </div>
  </article>;
}

type OrderPanelProps = {
  cart: CartLine[];
  itemCount: number;
  total: number;
  name: string;
  phone: string;
  fulfillment: Fulfillment;
  payment: Payment;
  address: string;
  scheduledAt: string;
  notes: string;
  settings?: { preparationMinutes: number; pickupSlots: { time: string; limit: number }[] } | null;
  services: readonly string[];
  payments: readonly string[];
  busy: boolean;
  validation: string;
  createdOrder: { number: string; total: number } | null;
  onName: (value: string) => void;
  onPhone: (value: string) => void;
  onFulfillment: (value: Fulfillment) => void;
  onPayment: (value: Payment) => void;
  onAddress: (value: string) => void;
  onSchedule: (value: string) => void;
  onNotes: (value: string) => void;
  onQuantity: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onDismissSuccess: () => void;
};

function OrderPanel(props: OrderPanelProps) {
  const {
    cart, itemCount, total, name, phone, fulfillment, payment, address, scheduledAt, notes,
    settings, services, payments, busy, validation, createdOrder, onName, onPhone, onFulfillment,
    onPayment, onAddress, onSchedule, onNotes, onQuantity, onRemove, onSubmit, onDismissSuccess,
  } = props;
  const requestOnly = cart.some((line) => line.product.editorial?.priceOnRequest);
  return <div className="order-panel">
    {createdOrder && <div className="order-success" role="status">
          <button className="success-close" aria-label="Fechar confirmação" onClick={onDismissSuccess} data-testid="button-dismiss-order-success"><X size={15} /></button>
      <span className="success-icon"><Check size={19} /></span>
      <span className="store-eyebrow"><span /> Pedido encaminhado</span>
      <h3>{createdOrder.number}</h3>
      <p>Estimativa de {currency(createdOrder.total)}. A equipe da loja confirmará o pedido e o total final.</p>
      <small>Pagamento pendente — nenhum pagamento foi processado.</small>
    </div>}
    <div className="order-panel-head">
      <div><span className="store-eyebrow"><span /> BALCÃO DIGITAL</span><h2>Sua seleção <span>{itemCount}</span></h2></div>
      <ShoppingBag size={19} />
    </div>
    {cart.length === 0 ? <div className="cart-empty">
      <div className="empty-bag"><ShoppingBag size={20} /></div>
      <strong>Seu pedido começa aqui.</strong>
      <p>Escolha um corte na vitrine. A equipe confirma disponibilidade e preparo.</p>
    </div> : <>
      <div className="cart-line-list">
        {cart.map(({ product, quantity }) => <div className="cart-line" key={product.id}>
          <div className="cart-line-name"><strong>{product.name}</strong><span>{currency(livePrice(product))} / {product.productType === 'combo' ? 'kit' : product.saleUnit}</span></div>
          <div className="cart-line-controls">
            <button aria-label={`Diminuir ${product.name}`} onClick={() => quantity > quantityStep(product) ? onQuantity(product.id, -quantityStep(product)) : onRemove(product.id)} data-testid={`button-decrease-cart-${product.id}`}><Minus size={13} /></button>
            <span>{quantity.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} {product.productType === 'combo' ? 'kit' : product.saleUnit}</span>
            <button aria-label={`Adicionar mais ${product.name}`} onClick={() => onQuantity(product.id, quantityStep(product))} data-testid={`button-increase-cart-${product.id}`}><Plus size={13} /></button>
            <strong>{currency(quantity * (product.saleUnit === 'g' && product.productType !== 'combo' ? livePrice(product) / 1000 : livePrice(product)))}</strong>
          </div>
        </div>)}
      </div>
      <div className="cart-total"><span>Estimativa do pedido</span><strong>{currency(total)}</strong></div>
    </>}
    <form className="order-form" onSubmit={onSubmit}>
      <div className="form-divider"><span>ENCAMINHAR PEDIDO</span></div>
      <label className="store-field">Seu nome <input required autoComplete="name" value={name} onChange={(event) => onName(event.target.value)} placeholder="Como podemos chamar você?" data-testid="input-order-customer-name" /></label>
      <label className="store-field">Telefone <span className="optional">opcional</span><input type="tel" autoComplete="tel" value={phone} onChange={(event) => onPhone(event.target.value)} placeholder="Para contato sobre seu pedido" data-testid="input-order-customer-phone" /></label>
      <fieldset className="choice-fieldset"><legend>Como prefere receber?</legend>
        <div className="choice-row">
          {(['pickup', 'delivery'] as const).filter((option) => services.includes(option)).map((option) => <button key={option} type="button" className={fulfillment === option ? 'choice selected' : 'choice'} onClick={() => onFulfillment(option)} data-testid={`button-fulfillment-${option}`}>
            {option === 'pickup' ? 'Retirar' : 'Entrega'}
          </button>)}
        </div>
      </fieldset>
      {fulfillment === 'delivery' && <label className="store-field">Endereço de entrega <input required autoComplete="street-address" value={address} onChange={(event) => onAddress(event.target.value)} placeholder="Rua, número e bairro" data-testid="input-order-address" /></label>}
      <label className="store-field">Horário desejado <span className="optional">opcional</span><input type="datetime-local" value={scheduledAt} onChange={(event) => onSchedule(event.target.value)} data-testid="input-order-schedule" /></label>
      {fulfillment === 'pickup' && settings && (settings.pickupSlots?.length ?? 0) > 0 && <div className="pickup-times"><span>HORÁRIOS DE RETIRADA</span><div>{settings.pickupSlots?.map((slot) => <span key={slot.time}>{slot.time}</span>)}</div></div>}
      {settings && settings.preparationMinutes > 0 && <p className="prep-time"><Clock3 size={13} /> Preparo estimado: cerca de {settings.preparationMinutes} min. A equipe confirma o horário.</p>}
      <fieldset className="choice-fieldset"><legend>Pagamento</legend>
        <div className="payment-options">{(['pix', 'card', 'cash', 'on_delivery'] as const).filter((method) => payments.includes(method)).map((method) => <button key={method} type="button" className={payment === method ? 'payment-option selected' : 'payment-option'} onClick={() => onPayment(method)} data-testid={`button-payment-${method}`}>{paymentLabels[method]}</button>)}</div>
      </fieldset>
      <label className="store-field">Recado para o açougueiro <span className="optional">opcional</span><textarea rows={2} value={notes} onChange={(event) => onNotes(event.target.value)} placeholder="Algum detalhe para o preparo?" data-testid="input-order-notes" /></label>
      <p className="estimate-disclaimer">Valores estimados. Cortes por peso são pesados no preparo; a loja confirma o total final. O pedido fica pendente de confirmação.</p>
      {validation && <p className="validation-message" role="alert"><CircleAlert size={15} />{validation}</p>}
      <button className="store-button primary submit-order" disabled={!cart.length || requestOnly || busy || !services.length || !payments.length} data-testid="button-submit-store-order">
        {busy ? 'Enviando pedido…' : <>Enviar pedido <ArrowRight size={16} /></>}
      </button>
    </form>
  </div>;
}

export default Storefront;
