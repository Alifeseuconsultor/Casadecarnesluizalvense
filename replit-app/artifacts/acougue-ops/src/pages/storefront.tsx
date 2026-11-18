import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent, MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  getGetDashboardSummaryQueryKey,
  getGetCurrentAccessQueryKey,
  useGetCurrentAccess,
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
  ArrowUpRight,
  BadgeCheck,
  Check,
  CircleAlert,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Facebook,
  Instagram,
  Info,
  LogIn,
  LogOut,
  MapPin,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  ShoppingCart,
  UserRound,
  X,
} from 'lucide-react';
import { Button } from '@workspace/luisalvense-design-system/components/ui/button';
import { Card } from '@workspace/luisalvense-design-system/components/ui/card';
import { Input } from '@workspace/luisalvense-design-system/components/ui/input';
import { useClerk, useUser } from '@clerk/react';
import { Link } from 'wouter';
import logo from '@assets/image_1794603595147.png';
import butcherIcon from '@assets/image_1794933513623.png';
import productsIcon from '@assets/image_1794933508020.png';
import hoursIcon from '@assets/image_1794933519447.png';
import wholeCutOne from '@assets/image_1794960415962.png';
import wholeCutTwo from '@assets/image_1794960422295.png';
import wholeCutThree from '@assets/image_1794960427962.png';
import preparationPhoto from '@assets/image_1794960438353.png';
import cutPhoto from '@assets/image_1794960442023.png';
import cutDetailPhoto from '@assets/image_1794960475723.png';
import displayPhoto from '@assets/image_1794960456944.png';
import storefrontPhoto from '@assets/image_1794960450667.png';
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

const googleStoreViews = [
  {
    label: 'Frente da loja',
    href: 'https://www.google.com/local/place/fid/0x94ded7d48c13d8cf:0xd01030d69dc08768/photosphere?iu=https://lh3.googleusercontent.com/gps-cs-s/ANWiy9SaWzUsSd1e2u2OvXatfHT9U_LH_OOQTMayJeMUX6mb7ZFsx-UmFtyy8cD9uNimqlLgGsOaUIw8SxC_0TlplwvbNn26kzJ2__TwgItEIr0sLwTJ9Kz6gclQxUiaWH2n6pK4y6k%3Dw160-h106-k-no-pi-0-ya171.95-ro-0-fo100&ik=CAoSFkNJSE0wb2dLRUlDQWdJQy12LTZxQmc%3D&vp=DQAAAAAVAAAAAA',
  },
  {
    label: 'Dentro da loja',
    href: 'https://www.google.com/local/place/fid/0x94ded7d48c13d8cf:0xd01030d69dc08768/photosphere?iu=https://lh3.googleusercontent.com/gps-cs-s/ANWiy9SUhjfHOAPHvSOHWpO-nTjbZV5uVX7HX81YWtotxE3b5sryUqyDRd_KGj054bkFzt6P6RPqtL5vU5D0-xHK1lXWca4BkRbg5JhyvRk594DIXIqXR91WvJUqh8FYHG__DbkwowoQ%3Dw160-h106-k-no-pi-10-ya89.700005-ro-0-fo100&ik=CAoSFkNJSE0wb2dLRUlDQWdJQy12LTZBSFE%3D&vp=DQAAjEMVAAAgwQ',
  },
];

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
  const [detailProduct, setDetailProduct] = useState<CatalogProduct | null>(null);
  const [featuredDragging, setFeaturedDragging] = useState(false);
  const featuredTrackRef = useRef<HTMLDivElement | null>(null);
  const featuredDragCleanupRef = useRef<(() => void) | null>(null);
  const suppressFeaturedClickRef = useRef(false);
  const detailTriggerRef = useRef<HTMLElement | null>(null);
  const detailCloseRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const header = document.querySelector('.store-header');
    const heroImage = document.querySelector<HTMLImageElement>('.hero-photo img');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const updateHeader = () => {
      header?.classList.toggle('is-scrolled', window.scrollY > 24);
      if (heroImage && !reduceMotion) {
        heroImage.style.setProperty('--hero-parallax-y', `${Math.min(window.scrollY * 0.07, 28)}px`);
      }
    };
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    return () => window.removeEventListener('scroll', updateHeader);
  }, []);

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>('.storefront .reveal-on-scroll');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      targets.forEach((target) => target.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.01, rootMargin: '0px 0px -35px 0px' });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [catalogQuery.isLoading]);

  useEffect(() => {
    if (!detailProduct) return;
    const previousFocus = detailTriggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusableSelector = 'button:not(:disabled), a[href], input:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDetailProduct(null);
        return;
      }
      if (event.key !== 'Tab') return;
      const dialog = document.querySelector<HTMLElement>('.product-detail-dialog');
      const focusable = dialog ? Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector)) : [];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    window.requestAnimationFrame(() => detailCloseRef.current?.focus());
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [detailProduct]);

  useEffect(() => () => featuredDragCleanupRef.current?.(), []);

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
  );
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

  useEffect(() => {
    const anchor = window.location.hash.slice(1);
    if (!anchor) return;
    const timer = window.setTimeout(() => {
      document.getElementById(anchor)?.scrollIntoView({ block: 'start' });
    }, 120);
    return () => window.clearTimeout(timer);
  }, [catalogQuery.isSuccess]);

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

  function openProductDetails(product: CatalogProduct) {
    detailTriggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setDetailProduct(product);
  }

  function scrollFeatured(direction: -1 | 1) {
    const track = featuredTrackRef.current;
    if (!track) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const firstCard = track.querySelector<HTMLElement>('.product-card');
    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0;
    const distance = firstCard ? firstCard.getBoundingClientRect().width + gap : track.clientWidth * 0.8;
    track.scrollBy({ left: direction * distance, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  function startFeaturedDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    featuredDragCleanupRef.current?.();
    const pointerId = event.pointerId;
    const startX = event.clientX;
    const startScrollLeft = event.currentTarget.scrollLeft;
    let moved = false;
    const onMove = (pointerEvent: PointerEvent) => {
      if (pointerEvent.pointerId !== pointerId) return;
      const distance = pointerEvent.clientX - startX;
      if (Math.abs(distance) <= 5) return;
      moved = true;
      setFeaturedDragging(true);
      pointerEvent.preventDefault();
      if (featuredTrackRef.current) featuredTrackRef.current.scrollLeft = startScrollLeft - distance;
    };
    const cleanup = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onEnd);
      window.removeEventListener('pointercancel', onEnd);
      featuredDragCleanupRef.current = null;
    };
    const onEnd = (pointerEvent: PointerEvent) => {
      if (pointerEvent.pointerId !== pointerId) return;
      cleanup();
      if (moved) {
        suppressFeaturedClickRef.current = true;
        window.setTimeout(() => { suppressFeaturedClickRef.current = false; }, 250);
      }
      setFeaturedDragging(false);
    };
    featuredDragCleanupRef.current = cleanup;
    window.addEventListener('pointermove', onMove, { passive: false });
    window.addEventListener('pointerup', onEnd);
    window.addEventListener('pointercancel', onEnd);
  }

  function suppressFeaturedClick(event: ReactMouseEvent<HTMLDivElement>) {
    if (!suppressFeaturedClickRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressFeaturedClickRef.current = false;
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
      <Button className="store-button primary" onClick={() => void catalogQuery.refetch()} data-testid="button-store-retry">Tentar novamente <ArrowRight size={16} /></Button>
      </div>
    </main>;
  }

  return <main className="storefront" id="inicio">
    <StoreHeader cartCount={itemCount} onCart={() => setCheckoutOpen(true)} />
    <section className="store-hero reveal-on-scroll">
      <div className="hero-photo" aria-hidden="true"><img src={displayPhoto} alt="" fetchPriority="high" /></div>
      <div className="store-wrap hero-inner">
        <div className="hero-copy">
          <div className="store-eyebrow"><span /> Carne fresca todos os dias <span className="eyebrow-rule" /></div>
          <h1>O sabor do corte<br /><em>certo.</em></h1>
          <p>Uma casa de carnes de verdade, com trabalho diário e atendimento próximo. Escolha no catálogo e encaminhe seu pedido para retirada ou entrega.</p>
          <a className="hero-link" href="#catalogo">Explorar catálogo <ArrowDownRight size={17} /></a>
        </div>
        <div className="hero-seal">
          <img src={logo} alt="Marca Casa de Carnes Luisalvense" />
          <span>Casa de Carnes</span>
           <small>Carne fresca todos os dias</small>
        </div>
        <div className="hero-index"><span>{products.length} itens no catálogo</span></div>
      </div>
    </section>

    <nav className="store-wrap brand-highlights reveal-on-scroll" aria-label="Informações da Casa Luisalvense">
      <a className="brand-highlight" href="https://www.instagram.com/carnesluisalvense/" target="_blank" rel="noreferrer" data-testid="link-highlight-bancada">
        <img src={butcherIcon} alt="" />
        <span><small>Conheça</small><strong>Bancada</strong></span>
        <ArrowRight size={15} aria-hidden="true" />
      </a>
      <a className="brand-highlight" href="#catalogo" data-testid="link-highlight-produtos">
        <img src={productsIcon} alt="" />
        <span><small>Veja a seleção</small><strong>Produtos</strong></span>
        <ArrowRight size={15} aria-hidden="true" />
      </a>
      <a className="brand-highlight" href="#horarios" data-testid="link-highlight-horarios">
        <img src={hoursIcon} alt="" />
        <span><small>Planeje sua visita</small><strong>Horários</strong></span>
        <ArrowRight size={15} aria-hidden="true" />
      </a>
    </nav>

    <div className="store-wrap store-layout" id="catalogo">
      <section className="catalog-area reveal-on-scroll" aria-label="Catálogo de carnes">
        <div className="catalog-intro">
          <div>
            <span className="store-eyebrow"><span /> A seleção</span>
            <h2>Da vitrine <em>à mesa.</em></h2>
            <p>Preços e disponibilidade conforme o catálogo atual da loja.</p>
          </div>
          <label className="store-search">
            <Search size={17} aria-hidden="true" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Buscar cortes" placeholder="Buscar um corte..." data-testid="input-store-search" />
            {search && <Button type="button" onClick={() => setSearch('')} aria-label="Limpar busca" data-testid="button-clear-store-search"><X size={15} /></Button>}
          </label>
        </div>

        <nav className="category-nav" aria-label="Categorias do catálogo">
          <Button variant={categoryFilter === 'all' ? 'selected' : 'ghost'} className={categoryFilter === 'all' ? 'selected' : ''} onClick={() => setCategoryFilter('all')} data-testid="button-category-all">Tudo <span>{products.length}</span></Button>
          {categories.map((category) => <Button key={category} variant={categoryFilter === category ? 'selected' : 'ghost'} className={categoryFilter === category ? 'selected' : ''} onClick={() => setCategoryFilter(category)} data-testid={`button-category-${slug(category)}`}>
            {category} <span>{products.filter((product) => product.category === category).length}</span>
          </Button>)}
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
          <Button className="text-button" onClick={() => { setSearch(''); setCategoryFilter('all'); }} data-testid="button-clear-store-filters">Limpar filtros</Button>
        </div> : <>
          {categoryFilter === 'all' && !search && featuredProducts.length > 0 && <section className="featured-section" aria-labelledby="featured-title">
            <div className="featured-heading">
              <div className="section-caption" id="featured-title"><span>ESCOLHAS DO AÇOUGUEIRO</span><span>{featuredProducts.length} cortes em destaque</span></div>
              {featuredProducts.length > 1 && <div className="featured-controls" aria-label="Controles dos cortes em destaque">
                <Button variant="outline" size="icon" onClick={() => scrollFeatured(-1)} aria-label="Ver cortes anteriores" aria-controls="featured-products-track" data-testid="button-featured-scroll-prev"><ChevronLeft size={17} /></Button>
                <Button variant="outline" size="icon" onClick={() => scrollFeatured(1)} aria-label="Ver próximos cortes" aria-controls="featured-products-track" data-testid="button-featured-scroll-next"><ChevronRight size={17} /></Button>
              </div>}
            </div>
            <div
              ref={featuredTrackRef}
              id="featured-products-track"
              className={`featured-grid ${featuredDragging ? 'is-dragging' : ''}`}
              role="region"
              aria-label="Cortes em destaque. Deslize horizontalmente para explorar."
              aria-roledescription="carrossel"
              tabIndex={0}
              onPointerDown={startFeaturedDrag}
              onClickCapture={suppressFeaturedClick}
            >{featuredProducts.map((product, index) =>
              <ProductCard key={product.id} product={product} featured={index === 0} onAdd={() => addToCart(product)} onDetails={() => openProductDetails(product)} />
            )}</div>
          </section>}
          {groupedProducts.map((group) => <section className="product-section" key={group.category} id={`cat-${slug(group.category)}`}>
            <div className="section-caption"><span>{group.category.toLocaleUpperCase('pt-BR')}</span><span>{group.items.length.toString().padStart(2, '0')} cortes</span></div>
            <div className="product-grid">{group.items.map((product) =>
              <ProductCard key={product.id} product={product} onAdd={() => addToCart(product)} onDetails={() => openProductDetails(product)} />
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

    <section className="story-section" id="processo" aria-labelledby="story-title">
      <div className="store-wrap reveal-on-scroll">
        <div className="story-heading">
          <span className="store-eyebrow"><span /> Por trás de cada corte</span>
          <h2 id="story-title">Da peça inteira<br /><em>à sua mesa.</em></h2>
          <p>Um pouco do trabalho da Casa Luisalvense: as peças, o preparo da equipe e a vitrine onde você escolhe seus cortes.</p>
        </div>

        <article className="story-opening">
          <div className="story-whole-photos" aria-label="Peças inteiras antes do corte">
            <figure>
              <img src={wholeCutOne} alt="Peça bovina inteira suspensa na área de preparo" loading="lazy" />
              <figcaption>Peça inteira</figcaption>
            </figure>
            <figure>
              <img src={wholeCutTwo} alt="Peça bovina inteira antes de ser dividida em cortes" loading="lazy" />
              <figcaption>Antes do corte</figcaption>
            </figure>
            <figure>
              <img src={wholeCutThree} alt="Peça de carne suspensa para preparação" loading="lazy" />
              <figcaption>Na área de preparo</figcaption>
            </figure>
          </div>
          <div className="story-opening-copy">
            <span className="story-number">01 / A ORIGEM</span>
            <h3>A história começa com a peça inteira.</h3>
            <p>Antes de chegar à vitrine, cada peça passa pelo trabalho da equipe da casa. Aqui você vê um pouco desse processo, sem confundir as fotos da loja com imagens de um corte específico do catálogo.</p>
          </div>
        </article>

        <div className="story-steps">
          <article className="story-card">
            <img src={preparationPhoto} alt="Equipe trabalhando na área de preparo da Casa Luisalvense" loading="lazy" />
            <div className="story-card-copy">
              <span className="story-number">02 / O PREPARO</span>
              <h3>Trabalho de equipe</h3>
              <p>É na área de preparo que as peças são trabalhadas para se tornarem os cortes escolhidos pelos clientes.</p>
            </div>
          </article>
          <article className="story-card">
            <img src={cutDetailPhoto} alt="Detalhe de cortes de carne preparados sobre a bancada" loading="lazy" />
            <div className="story-card-copy">
              <span className="story-number">03 / O ACABAMENTO</span>
              <h3>O cuidado no corte</h3>
              <p>As peças são divididas em cortes para diferentes preparos. A disponibilidade pode variar conforme o dia.</p>
            </div>
          </article>
          <article className="story-card">
            <img src={cutPhoto} alt="Cortes de carne preparados sobre a bancada" loading="lazy" />
            <div className="story-card-copy">
              <span className="story-number">04 / OS CORTES</span>
              <h3>Do balcão à escolha</h3>
              <p>Consulte o catálogo para ver os cortes disponíveis, as unidades de venda e os preços atuais.</p>
            </div>
          </article>
          <article className="story-card">
            <img src={displayPhoto} alt="Seleção de carnes exposta na vitrine refrigerada da loja" loading="lazy" />
            <div className="story-card-copy">
              <span className="story-number">05 / A VITRINE</span>
              <h3>Prontos para escolher</h3>
              <p>Na vitrine, você pode conhecer a seleção da loja e montar seu pedido com a equipe.</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section className="visit-section reveal-on-scroll" id="visite-a-loja" aria-labelledby="visit-title">
      <div className="store-wrap visit-inner">
        <img className="visit-photo" src={storefrontPhoto} alt="Fachada da Casa de Carnes Luisalvense" loading="lazy" />
        <div className="visit-copy">
          <span className="store-eyebrow"><span /> A nossa casa</span>
          <h2 id="visit-title">Estamos em<br /><em>Luiz Alves.</em></h2>
          <p>Carne fresca todos os dias, direto do frigorífico. Venha conhecer a Casa Luisalvense.</p>
          <div className="visit-address"><MapPin size={17} aria-hidden="true" /><span>SC-414, 11014<br />Luiz Alves · SC</span></div>
          <div className="visit-360">
            <span className="story-number">PASSEIO VIRTUAL NO GOOGLE MAPS</span>
            <p>Veja a frente e o interior da loja em 360°.</p>
            <div className="visit-360-links">
              {googleStoreViews.map((view) => <a key={view.label} className="visit-360-link" href={view.href} target="_blank" rel="noopener noreferrer">
                {view.label} <ArrowUpRight size={14} aria-hidden="true" />
              </a>)}
            </div>
            <small>O passeio abre em uma nova aba; continue pelas vistas conectadas no Google Maps.</small>
          </div>
          <a className="review-link visit-map-link" href="https://maps.app.goo.gl/mMYAdsCC7Et2UZBX7" target="_blank" rel="noreferrer" data-testid="link-store-directions">
            Como chegar <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </section>

    <section className="service-band reveal-on-scroll" id="horarios">
      <div className="store-wrap service-inner">
        <div><span className="store-eyebrow"><span /> Casa de Carnes Luisalvense</span><h2>Do balcão<br /><em>para sua casa.</em></h2></div>
        <p>O pedido é enviado para confirmação da equipe. Cortes vendidos por peso têm valor estimado; o total final é confirmado pela loja após o preparo.</p>
        <div className="service-hours"><Clock3 size={17} /><span><strong>Horários de atendimento</strong><br />Seg a Sex · 07h30 às 18h00<br />Sáb · 07h30 às 16h00</span></div>
      </div>
    </section>
    <section className="review-band reveal-on-scroll" id="avaliacoes" aria-label="Avaliações da Casa Luisalvense">
      <div className="store-wrap review-inner">
        <div className="review-mark" aria-hidden="true"><BadgeCheck size={24} /></div>
        <div className="review-copy">
          <span className="store-eyebrow"><span /> Quem compra recomenda</span>
          <h2>Mais de <em>60 avaliações</em> no Google.</h2>
          <p>Veja o que os clientes contam sobre a experiência na Casa Luisalvense.</p>
        </div>
        <a className="review-link" href="https://www.google.com/maps/search/?api=1&query=Casa%20de%20Carnes%20Luisalvense" target="_blank" rel="noreferrer" data-testid="link-google-reviews">
          Ver avaliações <ArrowRight size={15} />
        </a>
      </div>
    </section>
    <footer className="store-footer">
      <div className="store-wrap footer-inner">
        <span>Casa de Carnes Luisalvense</span>
        <span>Carne fresca todos os dias · Direto do frigorífico</span>
        <a href="https://www.instagram.com/carnesluisalvense/" target="_blank" rel="noreferrer" data-testid="link-instagram-footer"><Instagram size={14} /> Instagram</a>
        <a href="https://www.facebook.com/profile.php?id=61562909257349" target="_blank" rel="noreferrer" data-testid="link-facebook-footer"><Facebook size={14} /> Facebook</a>
        {settings?.whatsapp && <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" data-testid="link-whatsapp-footer">Fale com a loja <ArrowRight size={14} /></a>}
        <StoreStaffAccessLink /><a href="#inicio">Voltar ao início <ArrowRight size={14} /></a>
      </div>
    </footer>

    {checkoutOpen && <div className="checkout-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) setCheckoutOpen(false);
    }}>
      <section className="checkout-drawer" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
        <header className="drawer-heading"><div><span className="store-eyebrow"><span /> Seu pedido</span><h2 id="checkout-title">Conferir seleção</h2></div>
          <Button className="icon-close" onClick={() => setCheckoutOpen(false)} aria-label="Fechar pedido"><X size={19} /></Button>
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
    {detailProduct && <ProductDetailDialog
      product={detailProduct}
      closeRef={detailCloseRef}
      onClose={() => setDetailProduct(null)}
      onAdd={() => {
        addToCart(detailProduct);
        setDetailProduct(null);
      }}
    />}
    <nav className="mobile-store-nav" aria-label="Atalhos principais da loja">
      <a href="#catalogo"><ShoppingBag size={17} aria-hidden="true" /><span>Catálogo</span></a>
      <a href="#processo"><MapPin size={17} aria-hidden="true" /><span>Nossa casa</span></a>
      <a href="#horarios"><Clock3 size={17} aria-hidden="true" /><span>Horários</span></a>
      <Button type="button" className="mobile-store-order" onClick={() => setCheckoutOpen(true)} aria-label={itemCount > 0 ? `Abrir pedido com ${itemCount} itens` : 'Abrir meu pedido'}>
        <ShoppingCart size={17} aria-hidden="true" />
        <span>{itemCount > 0 ? `Pedido · ${itemCount}` : 'Meu pedido'}</span>
        {itemCount > 0 && <strong>{currency(estimatedTotal)}</strong>}
      </Button>
    </nav>
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
        <a href="#catalogo">Catálogo</a><a href="#processo">Nossa casa</a><a href="#horarios">Horários</a>
        <a href="https://www.instagram.com/carnesluisalvense/" target="_blank" rel="noreferrer" data-testid="link-instagram-header">Instagram</a>
        <a href="https://www.facebook.com/profile.php?id=61562909257349" target="_blank" rel="noreferrer" data-testid="link-facebook-header">Facebook</a>
        <StoreStaffAccessLink />
      </nav>
      <StoreAccountActions />
      <Button className="header-cart" onClick={onCart} data-testid="button-open-store-cart"><ShoppingBag size={16} /> <span>Meu pedido</span>{cartCount > 0 && <b>{cartCount}</b>}</Button>
    </div>
  </header>;
}

function StoreAccountActions() {
  const { isLoaded, user } = useUser();
  const { signOut } = useClerk();
  const accessQuery = useGetCurrentAccess({
    query: { enabled: Boolean(isLoaded && user), queryKey: getGetCurrentAccessQueryKey(), retry: false, refetchOnWindowFocus: true },
  });

  if (!isLoaded) return null;
  if (!user) {
    return <Link href="/sign-in" className="header-account" data-testid="link-customer-sign-in"><LogIn size={15} /><span>Entrar</span></Link>;
  }
  const role = accessQuery.data?.role;
  const roleLabel = role === 'admin' ? 'Administrador' : role === 'operator' ? 'Operador' : role === 'customer' ? 'Cliente' : 'Verificando';
  return <div className="header-account-group">
    {(role === 'admin' || role === 'operator') && <Link href="/" className="header-account header-account-team" data-testid="link-team-dashboard"><UserRound size={15} /><span>{role === 'admin' ? 'Admin' : 'Operador'}</span></Link>}
    <span className={`header-role-label header-role-${role ?? 'loading'}`} title={`Conta de ${user.firstName || user.primaryEmailAddress?.emailAddress || 'usuário'}`}>{roleLabel}</span>
    <Button
      type="button"
      className="header-account"
      aria-label="Sair da conta"
      onClick={() => void signOut({ redirectUrl: `${import.meta.env.BASE_URL.replace(/\/$/, '')}/loja` })}
      data-testid="button-customer-sign-out"
    ><LogOut size={15} /><span>Sair</span></Button>
  </div>;
}

function StoreStaffAccessLink() {
  const { isLoaded, user } = useUser();
  const accessQuery = useGetCurrentAccess({
    query: { enabled: Boolean(isLoaded && user), queryKey: getGetCurrentAccessQueryKey(), retry: false },
  });
  if (!isLoaded) return null;
  if (accessQuery.data?.role === 'admin' || accessQuery.data?.role === 'operator') {
    return <Link href="/" className="footer-team-access" data-testid="link-store-team-dashboard">Painel da equipe <ArrowRight size={14} /></Link>;
  }
  return <Link href="/sign-in?redirect_url=%2F" className="footer-team-access" data-testid="link-store-team-access">Acesso da equipe <ArrowRight size={14} /></Link>;
}

function ProductCard({ product, featured = false, onAdd, onDetails }: { product: CatalogProduct; featured?: boolean; onAdd: () => void; onDetails: () => void }) {
  const price = livePrice(product);
  const unavailable = product.status === 'sold_out';
  const consultOnly = Boolean(product.editorial?.priceOnRequest);
  const combo = product.productType === 'combo';
  const unitLabel = combo ? 'kit' : product.saleUnit;
  const heroImage = product.imageUrl;
  const tier = product.editorial?.tier;
  return <Card className={`product-card ${featured ? 'feature-card' : ''} ${combo ? 'combo-card' : ''}`} data-testid={`card-store-product-${product.id}`}>
    <div className={`product-art ${heroImage ? 'with-photo' : ''} ${featured ? 'featured-art' : ''}`} aria-hidden="true">
      {heroImage ? <img src={heroImage} alt="" loading="lazy" draggable={false} /> : <><span className="art-index">{combo ? 'COMBINAÇÃO DA CASA' : product.category}</span><span className="art-mark">{combo ? 'C' : product.name.slice(0, 1).toLocaleUpperCase('pt-BR')}</span><span className="image-fallback-label">Sem foto do produto</span></>}
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
        <div className="product-actions">
          <Button className="product-details-trigger" variant="ghost" onClick={onDetails} aria-label={`Ver detalhes de ${product.name}`} data-testid={`button-product-details-${product.id}`}><Info size={14} /><span>Detalhes</span></Button>
          <Button className="add-product" variant="outline" onClick={onAdd} disabled={unavailable || consultOnly} aria-label={unavailable ? `${product.name} esgotado` : consultOnly ? `Consultar ${product.name} no balcão` : `Adicionar ${product.name} ao pedido`} title={consultOnly ? 'Disponível para consulta no balcão' : unavailable ? 'Indisponível' : 'Adicionar ao pedido'} data-testid={`button-add-store-product-${product.id}`}>
            {unavailable || consultOnly ? <span>{unavailable ? 'Indisponível' : 'Consultar'}</span> : <><Plus size={17} /><span>Adicionar</span></>}
          </Button>
        </div>
      </div>
    </div>
  </Card>;
}

function ProductDetailDialog({
  product,
  closeRef,
  onClose,
  onAdd,
}: {
  product: CatalogProduct;
  closeRef: { current: HTMLButtonElement | null };
  onClose: () => void;
  onAdd: () => void;
}) {
  const price = livePrice(product);
  const unavailable = product.status === 'sold_out';
  const consultOnly = Boolean(product.editorial?.priceOnRequest);
  const unitLabel = product.productType === 'combo' ? 'kit' : product.saleUnit;
  const editorial = product.editorial;
  return <div className="product-detail-backdrop" role="presentation" onMouseDown={(event) => {
    if (event.target === event.currentTarget) onClose();
  }}>
    <section className="product-detail-dialog" role="dialog" aria-modal="true" aria-labelledby="product-detail-title" data-testid={`dialog-product-details-${product.id}`}>
      <header className="product-detail-header">
        <div><span className="store-eyebrow"><span /> DETALHES DO CATÁLOGO</span><p>{product.category}</p></div>
        <Button ref={closeRef} className="icon-close product-dialog-close" variant="outline" onClick={onClose} aria-label={`Fechar detalhes de ${product.name}`} data-testid="button-close-product-details"><X size={18} /></Button>
      </header>
      <div className="product-detail-content">
        {product.imageUrl
          ? <img className="product-detail-image" src={product.imageUrl} alt={product.name} />
          : <div className="product-detail-image product-detail-image-fallback" role="img" aria-label={`Imagem não cadastrada para ${product.name}`}><span>{product.name.slice(0, 1).toLocaleUpperCase('pt-BR')}</span><small>Imagem do produto não cadastrada</small></div>}
        <div className="product-detail-copy">
          <div className="product-detail-state">
            <span className={unavailable ? 'detail-availability unavailable' : 'detail-availability'}>{unavailable ? 'Esgotado' : 'Disponível no catálogo'}</span>
            {editorial?.tier && <span className="detail-tier">{tierLabels[editorial.tier] ?? editorial.tier}</span>}
            {product.productType === 'combo' && <span className="detail-tier">Combinação</span>}
          </div>
          <h2 id="product-detail-title">{product.name}</h2>
          {editorial?.tagline && <p className="product-detail-tagline">{editorial.tagline}</p>}
          {product.description && product.description !== editorial?.tagline && <p className="product-detail-description">{product.description}</p>}

          <div className="product-detail-price" data-testid={`text-product-detail-price-${product.id}`}>
            {consultOnly ? <><strong>Consulte no balcão</strong><span>Preço sob consulta</span></> : <>
              {price !== product.pricePerKg && <del>{currency(product.pricePerKg)}</del>}
              <strong>{currency(price)}</strong>
              <span>por {unitLabel}</span>
              {price !== product.pricePerKg && product.promoLabel && <small>{product.promoLabel}</small>}
            </>}
          </div>

          {editorial?.badges && editorial.badges.length > 0 && <div className="product-detail-tags" aria-label="Características">
            {editorial.badges.map((badge) => <span key={badge}>{badge}</span>)}
          </div>}
          {(editorial?.portion || editorial?.serves || editorial?.pairing || editorial?.marbling != null || editorial?.tenderness != null) &&
            <dl className="product-detail-facts">
              {editorial.portion && <div><dt>Porção</dt><dd>{editorial.portion}</dd></div>}
              {editorial.serves && <div><dt>Serve</dt><dd>{editorial.serves}</dd></div>}
              {editorial.pairing && <div><dt>Acompanhamento</dt><dd>{editorial.pairing}</dd></div>}
              {editorial.marbling != null && <div><dt>Marmoreio</dt><dd>{editorial.marbling} / 5</dd></div>}
              {editorial.tenderness != null && <div><dt>Maciez</dt><dd>{editorial.tenderness} / 5</dd></div>}
            </dl>}
          {editorial?.uses && editorial.uses.length > 0 && <div className="product-detail-list">
            <h3>Indicado para</h3><ul>{editorial.uses.map((use) => <li key={use}>{use}</li>)}</ul>
          </div>}
          {editorial?.items && editorial.items.length > 0 && <div className="product-detail-list">
            <h3>Itens da combinação</h3><ul>{editorial.items.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>}
          {editorial?.savings != null && editorial.savings > 0 && <p className="product-detail-saving">Economia informada: {currency(editorial.savings)}</p>}
        </div>
      </div>
      <footer className="product-detail-footer">
        <Button variant="outline" onClick={onClose} data-testid="button-return-product-details">Voltar ao catálogo</Button>
        <Button className="product-detail-add" onClick={onAdd} disabled={unavailable || consultOnly} aria-label={unavailable ? `${product.name} esgotado` : consultOnly ? `${product.name} disponível para consulta` : `Adicionar ${product.name} ao pedido`} data-testid={`button-add-from-product-details-${product.id}`}>
          {unavailable ? 'Indisponível' : consultOnly ? 'Consultar no balcão' : <><Plus size={16} /> Adicionar ao pedido</>}
        </Button>
      </footer>
    </section>
  </div>;
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
          <Button className="success-close" aria-label="Fechar confirmação" onClick={onDismissSuccess} data-testid="button-dismiss-order-success"><X size={15} /></Button>
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
            <Button aria-label={`Diminuir ${product.name}`} onClick={() => quantity > quantityStep(product) ? onQuantity(product.id, -quantityStep(product)) : onRemove(product.id)} data-testid={`button-decrease-cart-${product.id}`}><Minus size={13} /></Button>
            <span>{quantity.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} {product.productType === 'combo' ? 'kit' : product.saleUnit}</span>
            <Button aria-label={`Adicionar mais ${product.name}`} onClick={() => onQuantity(product.id, quantityStep(product))} data-testid={`button-increase-cart-${product.id}`}><Plus size={13} /></Button>
            <strong>{currency(quantity * (product.saleUnit === 'g' && product.productType !== 'combo' ? livePrice(product) / 1000 : livePrice(product)))}</strong>
          </div>
        </div>)}
      </div>
      <div className="cart-total"><span>Estimativa do pedido</span><strong>{currency(total)}</strong></div>
    </>}
    <form className="order-form" onSubmit={onSubmit}>
      <div className="form-divider"><span>ENCAMINHAR PEDIDO</span></div>
      <label className="store-field">Seu nome <Input required autoComplete="name" value={name} onChange={(event) => onName(event.target.value)} placeholder="Como podemos chamar você?" data-testid="input-order-customer-name" /></label>
      <label className="store-field">Telefone <span className="optional">opcional</span><Input type="tel" autoComplete="tel" value={phone} onChange={(event) => onPhone(event.target.value)} placeholder="Para contato sobre seu pedido" data-testid="input-order-customer-phone" /></label>
      <fieldset className="choice-fieldset"><legend>Como prefere receber?</legend>
        <div className="choice-row">
          {(['pickup', 'delivery'] as const).filter((option) => services.includes(option)).map((option) => <Button key={option} type="button" className={fulfillment === option ? 'choice selected' : 'choice'} onClick={() => onFulfillment(option)} data-testid={`button-fulfillment-${option}`}>
            {option === 'pickup' ? 'Retirar' : 'Entrega'}
          </Button>)}
        </div>
      </fieldset>
      {fulfillment === 'delivery' && <label className="store-field">Endereço de entrega <Input required autoComplete="street-address" value={address} onChange={(event) => onAddress(event.target.value)} placeholder="Rua, número e bairro" data-testid="input-order-address" /></label>}
      <label className="store-field">Horário desejado <span className="optional">opcional</span><Input type="datetime-local" value={scheduledAt} onChange={(event) => onSchedule(event.target.value)} data-testid="input-order-schedule" /></label>
      {fulfillment === 'pickup' && settings && (settings.pickupSlots?.length ?? 0) > 0 && <div className="pickup-times"><span>HORÁRIOS DE RETIRADA</span><div>{settings.pickupSlots?.map((slot) => <span key={slot.time}>{slot.time}</span>)}</div></div>}
      {settings && settings.preparationMinutes > 0 && <p className="prep-time"><Clock3 size={13} /> Preparo estimado: cerca de {settings.preparationMinutes} min. A equipe confirma o horário.</p>}
      <fieldset className="choice-fieldset"><legend>Pagamento</legend>
        <div className="payment-options">{(['pix', 'card', 'cash', 'on_delivery'] as const).filter((method) => payments.includes(method)).map((method) => <Button key={method} type="button" className={payment === method ? 'payment-option selected' : 'payment-option'} onClick={() => onPayment(method)} data-testid={`button-payment-${method}`}>{paymentLabels[method]}</Button>)}</div>
      </fieldset>
      <label className="store-field">Recado para o açougueiro <span className="optional">opcional</span><textarea rows={2} value={notes} onChange={(event) => onNotes(event.target.value)} placeholder="Algum detalhe para o preparo?" data-testid="input-order-notes" /></label>
      <p className="estimate-disclaimer">Valores estimados. Cortes por peso são pesados no preparo; a loja confirma o total final. O pedido fica pendente de confirmação.</p>
      {validation && <p className="validation-message" role="alert"><CircleAlert size={15} />{validation}</p>}
      <Button type="submit" className="store-button primary submit-order" disabled={!cart.length || requestOnly || busy || !services.length || !payments.length} data-testid="button-submit-store-order">
        {busy ? 'Enviando pedido…' : <>Enviar pedido <ArrowRight size={16} /></>}
      </Button>
    </form>
  </div>;
}

export default Storefront;
