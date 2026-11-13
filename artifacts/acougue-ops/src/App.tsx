import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import {
  getListCustomersQueryKey,
  getListOrdersQueryKey,
  getGetDashboardSummaryQueryKey,
  useCreateCustomer,
  useCreateOrder,
  useListCatalog,
  useListCustomers,
  useListOrders,
  useGetDashboardSummary,
  useUpdateItemPrepared,
  useUpdateItemWeight,
  useUpdateOrderStatus,
} from '@workspace/api-client-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  Activity, ArrowRight, Bell, Check, ChefHat, ChevronDown, Clock3,
  ClipboardList, CreditCard, Headphones, LoaderCircle, MapPin, Minus, PackageCheck,
  Plus, Search, ShoppingBag, SlidersHorizontal, Speaker, VolumeX, Truck, UserRound,
  Utensils, X,
} from 'lucide-react';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import type { Order } from '@workspace/api-client-react';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();
const columns = [
  { key: 'new', label: 'Novos', note: 'Aguardando preparo', tone: 'gold' },
  { key: 'preparing', label: 'Em preparação', note: 'Na bancada', tone: 'green' },
  { key: 'ready', label: 'Prontos para retirada', note: 'Conferir saída', tone: 'blue' },
  { key: 'completed', label: 'Concluídos', note: 'Finalizados hoje', tone: 'muted' },
] as const;
const brl = (value: number | null | undefined) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value ?? 0);
const time = (value: string | null) => value ? new Date(value).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'Sem horário';
const stageLabel = (status: string) => columns.find((c) => c.key === status)?.label ?? status;

function Home() {
  const query = useQueryClient();
  const ordersQuery = useListOrders({ query: { refetchInterval: 15000 } });
  const customersQuery = useListCustomers();
  const catalogQuery = useListCatalog();
  const summaryQuery = useGetDashboardSummary({ query: { refetchInterval: 30000 } });
  const updateStatus = useUpdateOrderStatus();
  const updatePrepared = useUpdateItemPrepared();
  const updateWeight = useUpdateItemWeight();
  const createOrder = useCreateOrder();
  const createCustomer = useCreateCustomer();
  const [activeStage, setActiveStage] = useState('new');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [prepView, setPrepView] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [notice, setNotice] = useState('');
  const [orderForm, setOrderForm] = useState({
    customerId: '', customerName: '', phone: '', serviceType: 'pickup', address: '',
    paymentMethod: 'pix', scheduledAt: '', notes: '', selectedProduct: '', quantity: '1',
    unit: 'kg', cut: '', thickness: '', fatTrim: '', observations: '',
  });
  const [cart, setCart] = useState<Array<{ productId: number; productName: string; quantity: number; unit: string; pricePerKg: number; cutPreference: string; thickness: string; fatTrim: string; observations: string; estimatedWeightKg: number | null }>>([]);
  const audioRef = useRef<AudioContext | null>(null);
  const seenOrders = useRef<Set<number> | null>(null);
  const orders = ordersQuery.data ?? [];
  const customers = customersQuery.data ?? [];
  const products = (catalogQuery.data ?? []).filter((item) => item.active);

  useEffect(() => {
    const openCreate = () => setCreateOpen(true);
    const openPrep = () => setPrepView((value) => !value);
    const showOrders = () => { setActiveStage('new'); setSearch(''); setSelectedId(null); };
    window.addEventListener('open-create-order', openCreate);
    window.addEventListener('toggle-prep-view', openPrep);
    window.addEventListener('show-orders', showOrders);
    return () => {
      window.removeEventListener('open-create-order', openCreate);
      window.removeEventListener('toggle-prep-view', openPrep);
      window.removeEventListener('show-orders', showOrders);
    };
  }, []);

  useEffect(() => {
    if (!ordersQuery.data) return;
    const ids = new Set(ordersQuery.data.map((order) => order.id));
    if (seenOrders.current) {
      const fresh = ordersQuery.data.filter((order) => !seenOrders.current?.has(order.id));
      if (fresh.length) {
        setNotice(`${fresh.length === 1 ? 'Novo pedido' : `${fresh.length} novos pedidos`} recebido${fresh.length === 1 ? '' : 's'}`);
        window.setTimeout(() => setNotice(''), 5000);
        if (soundOn && audioRef.current) {
          const oscillator = audioRef.current.createOscillator();
          const gain = audioRef.current.createGain();
          oscillator.frequency.value = 740;
          gain.gain.value = 0.08;
          oscillator.connect(gain); gain.connect(audioRef.current.destination);
          oscillator.start(); oscillator.stop(audioRef.current.currentTime + 0.16);
        }
      }
    }
    seenOrders.current = ids;
  }, [ordersQuery.data, soundOn]);

  const filteredOrders = useMemo(() => {
    const needle = search.trim().toLocaleLowerCase('pt-BR');
    return orders.filter((order) => order.status === activeStage && (paymentFilter === 'all' || order.paymentStatus === paymentFilter) && (
      !needle || [order.orderNumber, order.customer.name, order.customer.phone, ...order.items.map((i) => i.productName)]
        .some((value) => value?.toLocaleLowerCase('pt-BR').includes(needle))
    )).sort((a, b) => new Date(a.scheduledAt ?? a.createdAt).getTime() - new Date(b.scheduledAt ?? b.createdAt).getTime());
  }, [orders, activeStage, search, paymentFilter]);
  const selectedOrder = orders.find((order) => order.id === selectedId) ?? filteredOrders[0] ?? null;
  const totals = summaryQuery.data;
  const pendingWrites = updateStatus.isPending || updatePrepared.isPending || updateWeight.isPending;
  const invalidateOrders = () => {
    query.invalidateQueries({ queryKey: getListOrdersQueryKey() });
    query.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
  };
  const advance = (order: Order) => {
    const next = columns[Math.min(columns.findIndex((c) => c.key === order.status) + 1, columns.length - 1)].key;
    updateStatus.mutate({ id: order.id, data: { status: next } }, { onSuccess: () => {
      invalidateOrders();
      setActiveStage(next);
      setSelectedId(order.id);
    } });
  };
  const enableSound = async () => {
    if (soundOn) { setSoundOn(false); return; }
    try {
      const context = new AudioContext();
      await context.resume();
      audioRef.current = context;
      setSoundOn(true);
    } catch { setNotice('Áudio indisponível neste navegador'); window.setTimeout(() => setNotice(''), 3500); }
  };
  const selectedProduct = products.find((p) => p.id === Number(orderForm.selectedProduct));
  const addProduct = () => {
    if (!selectedProduct) return;
    const quantity = Number(orderForm.quantity);
    if (!Number.isFinite(quantity) || quantity <= 0) return;
    setCart((current) => [...current, {
      productId: selectedProduct.id, productName: selectedProduct.name, quantity,
      unit: orderForm.unit, pricePerKg: selectedProduct.pricePerKg,
      cutPreference: orderForm.cut, thickness: orderForm.thickness, fatTrim: orderForm.fatTrim,
      observations: orderForm.observations,
      estimatedWeightKg: orderForm.unit === 'kg' ? quantity : orderForm.unit === 'g' ? quantity / 1000 : null,
    }]);
    setOrderForm((f) => ({ ...f, selectedProduct: '', quantity: '1', cut: '', thickness: '', fatTrim: '', observations: '' }));
  };
  const submitOrder = async () => {
    if (!cart.length) return;
    let customerId = orderForm.customerId ? Number(orderForm.customerId) : undefined;
    if (!customerId && orderForm.customerName.trim()) {
      try {
        const result = await createCustomer.mutateAsync({ data: { name: orderForm.customerName.trim(), phone: orderForm.phone || null } });
        customerId = result.id;
        await query.invalidateQueries({ queryKey: getListCustomersQueryKey() });
      } catch { setNotice('Não foi possível salvar o cadastro do cliente'); window.setTimeout(() => setNotice(''), 4000); return; }
    }
    if (!customerId && !orderForm.customerName.trim()) { setNotice('Selecione um cliente ou informe o nome'); window.setTimeout(() => setNotice(''), 3500); return; }
    createOrder.mutate({
      data: {
        ...(customerId ? { customerId } : {}),
        customer: { name: orderForm.customerName.trim() || customers.find((c) => c.id === customerId)?.name || '', phone: orderForm.phone || customers.find((c) => c.id === customerId)?.phone || null },
        serviceType: orderForm.serviceType as 'pickup' | 'delivery',
        deliveryAddress: orderForm.serviceType === 'delivery' ? orderForm.address : null,
        paymentMethod: orderForm.paymentMethod as 'pix' | 'card' | 'cash' | 'on_delivery',
        scheduledAt: orderForm.scheduledAt ? new Date(orderForm.scheduledAt).toISOString() : null,
        notes: orderForm.notes || null,
        items: cart.map((item) => ({
          productId: item.productId, productName: item.productName, quantity: item.quantity,
          unit: item.unit as 'kg' | 'g' | 'unidade', pricePerKg: item.pricePerKg,
          estimatedWeightKg: item.estimatedWeightKg, cutPreference: item.cutPreference || null,
          thickness: item.thickness || null, fatTrim: item.fatTrim || null, observations: item.observations || null,
        })),
      },
    }, {
      onSuccess: (created) => {
        invalidateOrders();
        setActiveStage('new'); setSelectedId(created.id); setCart([]); setCreateOpen(false);
        setOrderForm({ customerId: '', customerName: '', phone: '', serviceType: 'pickup', address: '', paymentMethod: 'pix', scheduledAt: '', notes: '', selectedProduct: '', quantity: '1', unit: 'kg', cut: '', thickness: '', fatTrim: '', observations: '' });
      },
      onError: () => { setNotice('Falha ao criar pedido. Confira os dados e tente novamente.'); window.setTimeout(() => setNotice(''), 4500); },
    });
  };
  const stageCounts = (status: string) => orders.filter((order) => order.status === status).length;

  if (ordersQuery.isLoading) return <Shell><div className="loading-state"><div className="skeleton skeleton-title" /><div className="skeleton skeleton-line" /><div className="skeleton-grid">{[0, 1, 2].map((i) => <div className="skeleton skeleton-card" key={i} />)}</div></div></Shell>;
  if (ordersQuery.isError) return <Shell><div className="state-card error-state"><Activity size={24} /><h2>Não foi possível carregar os pedidos</h2><p>Verifique a conexão com o servidor e tente novamente.</p><button className="button button-dark" data-testid="button-retry-orders" onClick={() => ordersQuery.refetch()}>Tentar novamente</button></div></Shell>;

  return <Shell>
    <main className="workspace">
      <header className="topbar">
        <div className="breadcrumbs"><span>Operação</span><span className="crumb-divider">/</span><strong>Pedidos</strong></div>
        <div className="top-actions">
          <div className="live-indicator"><i /> Atualizado há poucos segundos</div>
          <button className={`icon-button sound-button ${soundOn ? 'sound-active' : ''}`} onClick={enableSound} aria-label={soundOn ? 'Desativar som' : 'Ativar som'} data-testid="button-sound-toggle">
            {soundOn ? <Speaker size={18} /> : <VolumeX size={18} />}<span>{soundOn ? 'Som ligado' : 'Som desligado'}</span>
          </button>
          <div className="user-chip"><span className="user-avatar">OP</span><span className="user-label">Operação</span><ChevronDown size={14} /></div>
        </div>
      </header>

      <section className="page-heading">
        <div>
          <div className="eyebrow"><span className="eyebrow-line" /> AÇOUGUE · TURNO EM ANDAMENTO</div>
          <h1>Pedidos <span>em andamento</span></h1>
          <p>Uma bancada organizada começa pelo próximo pedido.</p>
        </div>
        <div className="heading-actions">
          <button className={`button ${prepView ? 'button-active' : 'button-outline'}`} onClick={() => setPrepView(!prepView)} data-testid="button-prep-view">
            <ChefHat size={17} /> {prepView ? 'Visão completa' : 'Visão de preparo'}
          </button>
          <button className="button button-dark" onClick={() => setCreateOpen(true)} data-testid="button-create-order"><Plus size={18} /> Novo pedido</button>
        </div>
      </section>

      <div className="notice-row">
        <div className="notice-text"><Bell size={14} /><span>Pedidos atualizados automaticamente a cada 15 segundos</span></div>
        <span className="demo-key"><i /> registros de demonstração identificados</span>
      </div>
      {notice && <div className="toast-notice" role="status" data-testid="status-new-order"><Bell size={15} />{notice}<button onClick={() => setNotice('')} aria-label="Fechar notificação"><X size={14} /></button></div>}

      <section className="metric-strip" aria-label="Resumo do turno">
        <div className="metric metric-emphasis"><div className="metric-label">PEDIDOS HOJE <span><ClipboardList size={14} /></span></div><strong>{totals?.ordersToday ?? orders.length}</strong><small>nesta operação</small></div>
        <div className="metric"><div className="metric-label">EM PREPARO <span><Utensils size={14} /></span></div><strong>{totals?.preparing ?? stageCounts('preparing')}</strong><small>na bancada agora</small></div>
        <div className="metric"><div className="metric-label">PRONTOS <span><PackageCheck size={14} /></span></div><strong>{totals?.ready ?? stageCounts('ready')}</strong><small>aguardando retirada</small></div>
        <div className="metric metric-sales"><div className="metric-label">PREVISÃO DO DIA <span><Activity size={14} /></span></div><strong>{brl(totals?.estimatedSalesToday ?? 0)}</strong><small>estimativa dos pedidos</small></div>
      </section>

      <section className="board-section">
        <div className="board-toolbar">
          <div className="stage-tabs" role="tablist" aria-label="Etapas dos pedidos">
            {columns.map((column) => <button key={column.key} className={`stage-tab ${activeStage === column.key ? 'stage-selected' : ''}`} onClick={() => { setActiveStage(column.key); setSelectedId(null); }} role="tab" aria-selected={activeStage === column.key} data-testid={`tab-stage-${column.key}`}>
              <span className={`stage-dot ${column.tone}`} /><span>{column.label}</span><b>{stageCounts(column.key)}</b>
            </button>)}
          </div>
          <div className="filter-tools">
            <label className="search-box"><Search size={16} /><input aria-label="Buscar pedidos" placeholder="Buscar pedido ou cliente..." value={search} onChange={(event) => setSearch(event.target.value)} data-testid="input-search-orders" /><kbd>⌘ K</kbd></label>
            <button className={`icon-button filter-button ${showFilters ? 'sound-active' : ''}`} onClick={() => setShowFilters(!showFilters)} aria-label="Filtros de pedido" title="Filtros" data-testid="button-filters"><SlidersHorizontal size={17} /></button>
          </div>
        </div>
        {showFilters && <div className="filter-popover"><label htmlFor="payment-filter">Pagamento</label><select id="payment-filter" value={paymentFilter} onChange={(event) => setPaymentFilter(event.target.value)} data-testid="select-payment-filter"><option value="all">Todos</option><option value="pending">Pendente</option><option value="paid">Pago</option></select></div>}
        <div className="stage-caption"><div><span>{columns.find((item) => item.key === activeStage)?.note}</span><span className="caption-separator">·</span><span>{filteredOrders.length} {filteredOrders.length === 1 ? 'pedido' : 'pedidos'}</span></div><div className="updated-label"><Clock3 size={13} /> Atualização automática ativa</div></div>

        {filteredOrders.length === 0 ? <div className="empty-state" data-testid="empty-orders">
          <div className="empty-icon"><ShoppingBag size={22} /></div><h3>{search ? 'Nenhum pedido encontrado' : `Sem pedidos ${activeStage === 'new' ? 'novos' : 'nesta etapa'}`}</h3>
          <p>{search ? 'Tente buscar por outro nome ou número.' : activeStage === 'new' ? 'Quando chegar um pedido, ele aparece aqui.' : 'Tudo certo por aqui. Os próximos pedidos aparecerão nesta lista.'}</p>
          {search && <button className="text-action" onClick={() => setSearch('')}>Limpar busca</button>}
        </div> : <div className={`orders-layout ${prepView ? 'prep-layout' : ''}`}>
          <div className="order-list" data-testid="list-orders">
            {filteredOrders.map((order) => <OrderCard key={order.id} order={order} selected={selectedOrder?.id === order.id} onSelect={() => setSelectedId(order.id)} onAdvance={() => advance(order)} busy={pendingWrites} prepView={prepView} />)}
          </div>
          {selectedOrder && <OrderDetails order={selectedOrder} onAdvance={() => advance(selectedOrder)} busy={pendingWrites}
            onPrepared={(itemId, prepared) => updatePrepared.mutate({ id: selectedOrder.id, itemId, data: { prepared } }, { onSuccess: invalidateOrders })}
            onWeight={(itemId, actualWeightKg) => updateWeight.mutate({ id: selectedOrder.id, itemId, data: { actualWeightKg } }, { onSuccess: invalidateOrders })}
          />}
        </div>}
      </section>
      <footer className="app-footer"><span>Açougue Operação <b>•</b> Uso interno da equipe</span><span>Cliente final: interface não incluída neste projeto.</span></footer>
    </main>

    {createOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCreateOpen(false); }}>
      <section className="create-modal" role="dialog" aria-modal="true" aria-labelledby="create-title" data-testid="dialog-create-order">
        <header className="modal-header"><div><div className="eyebrow">BALCÃO · NOVO REGISTRO</div><h2 id="create-title">Montar pedido</h2><p>Use o catálogo compartilhado para adicionar itens.</p></div><button className="icon-button" onClick={() => setCreateOpen(false)} aria-label="Fechar" data-testid="button-close-create"><X size={19} /></button></header>
        {(customersQuery.isError || catalogQuery.isError) ? <div className="inline-error">Não foi possível carregar clientes ou catálogo. Recarregue a página para tentar novamente.</div> : customersQuery.isLoading || catalogQuery.isLoading ? <div className="modal-loading"><div className="skeleton skeleton-line" /><div className="skeleton skeleton-card" /></div> : <>
          <div className="form-section"><div className="section-heading"><span>01</span><h3>Cliente e entrega</h3></div>
            <label className="field-label">Cliente cadastrado<select value={orderForm.customerId} onChange={(e) => { const chosen = customers.find((c) => c.id === Number(e.target.value)); setOrderForm((f) => ({ ...f, customerId: e.target.value, customerName: chosen?.name ?? '', phone: chosen?.phone ?? '' })); }} data-testid="select-customer"><option value="">Novo cadastro</option>{customers.map((c) => <option key={c.id} value={c.id}>{c.name}{c.phone ? ` · ${c.phone}` : ''}</option>)}</select></label>
            {!orderForm.customerId && <div className="field-pair"><label className="field-label">Nome<input value={orderForm.customerName} onChange={(e) => setOrderForm((f) => ({ ...f, customerName: e.target.value }))} placeholder="Nome do cliente" data-testid="input-customer-name" /></label><label className="field-label">Telefone<input value={orderForm.phone} onChange={(e) => setOrderForm((f) => ({ ...f, phone: e.target.value }))} placeholder="(11) 99999-0000" data-testid="input-customer-phone" /></label></div>}
            <div className="field-pair"><label className="field-label">Serviço<select value={orderForm.serviceType} onChange={(e) => setOrderForm((f) => ({ ...f, serviceType: e.target.value }))} data-testid="select-service"><option value="pickup">Retirada no balcão</option><option value="delivery">Entrega</option></select></label><label className="field-label">Pagamento<select value={orderForm.paymentMethod} onChange={(e) => setOrderForm((f) => ({ ...f, paymentMethod: e.target.value }))} data-testid="select-payment"><option value="pix">Pix</option><option value="card">Cartão</option><option value="cash">Dinheiro</option><option value="on_delivery">Na entrega</option></select></label></div>
            {orderForm.serviceType === 'delivery' && <label className="field-label">Endereço de entrega<input value={orderForm.address} onChange={(e) => setOrderForm((f) => ({ ...f, address: e.target.value }))} placeholder="Rua, número, bairro" data-testid="input-delivery-address" /></label>}
            <label className="field-label">Horário combinado<input type="datetime-local" value={orderForm.scheduledAt} onChange={(e) => setOrderForm((f) => ({ ...f, scheduledAt: e.target.value }))} data-testid="input-scheduled-at" /></label>
          </div>
          <div className="form-section"><div className="section-heading"><span>02</span><h3>Itens e preferências</h3></div>
            <div className="field-pair product-row"><label className="field-label">Produto do catálogo<select value={orderForm.selectedProduct} onChange={(e) => setOrderForm((f) => ({ ...f, selectedProduct: e.target.value }))} data-testid="select-catalog-product"><option value="">Escolha um corte</option>{products.map((p) => <option value={p.id} key={p.id}>{p.name} · {brl(p.pricePerKg)}/kg</option>)}</select></label><label className="field-label narrow-field">Quantidade<input type="number" min="0.01" step="0.01" value={orderForm.quantity} onChange={(e) => setOrderForm((f) => ({ ...f, quantity: e.target.value }))} data-testid="input-item-quantity" /></label><label className="field-label unit-field">Unidade<select value={orderForm.unit} onChange={(e) => setOrderForm((f) => ({ ...f, unit: e.target.value }))} data-testid="select-item-unit"><option value="kg">kg</option><option value="g">g</option><option value="unidade">unid.</option></select></label></div>
            <div className="field-pair"><label className="field-label">Corte / preparo<input value={orderForm.cut} onChange={(e) => setOrderForm((f) => ({ ...f, cut: e.target.value }))} placeholder="Ex.: bifes, cubos" data-testid="input-cut-preference" /></label><label className="field-label">Espessura<input value={orderForm.thickness} onChange={(e) => setOrderForm((f) => ({ ...f, thickness: e.target.value }))} placeholder="Ex.: 2 cm" data-testid="input-thickness" /></label></div>
            <div className="field-pair"><label className="field-label">Gordura<input value={orderForm.fatTrim} onChange={(e) => setOrderForm((f) => ({ ...f, fatTrim: e.target.value }))} placeholder="Ex.: retirar excesso" data-testid="input-fat-trim" /></label><label className="field-label">Observação do item<input value={orderForm.observations} onChange={(e) => setOrderForm((f) => ({ ...f, observations: e.target.value }))} placeholder="Instrução para a equipe" data-testid="input-item-observations" /></label></div>
            <button className="add-item-button" onClick={addProduct} disabled={!selectedProduct} data-testid="button-add-item"><Plus size={16} /> Adicionar item</button>
            {cart.length > 0 && <div className="cart-items">{cart.map((item, index) => <div className="cart-item" key={`${item.productId}-${index}`}><div><strong>{item.productName}</strong><small>{item.quantity} {item.unit}{item.cutPreference ? ` · ${item.cutPreference}` : ''}</small></div><span>{item.estimatedWeightKg ? brl(item.estimatedWeightKg * item.pricePerKg) : `${brl(item.pricePerKg)}/kg`}</span><button aria-label={`Remover ${item.productName}`} onClick={() => setCart((current) => current.filter((_, i) => i !== index))} data-testid={`button-remove-cart-item-${index}`}><Minus size={14} /></button></div>)}</div>}
          </div>
          <div className="form-section"><div className="section-heading"><span>03</span><h3>Recado para a bancada</h3></div><textarea value={orderForm.notes} onChange={(e) => setOrderForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Observações gerais do pedido" rows={2} data-testid="input-order-notes" /></div>
          <div className="estimate-note">Valores estimados. O total é recalculado após o registro dos pesos finais. Nenhum pagamento é iniciado por esta tela.</div>
          <footer className="modal-footer"><button className="button button-outline" onClick={() => setCreateOpen(false)} data-testid="button-cancel-create">Cancelar</button><button className="button button-dark" onClick={submitOrder} disabled={!cart.length || createOrder.isPending || createCustomer.isPending} data-testid="button-submit-order">{createOrder.isPending || createCustomer.isPending ? <LoaderCircle className="spin" size={16} /> : <Plus size={17} />} Criar pedido <ArrowRight size={15} /></button></footer>
        </>}
      </section>
    </div>}
  </Shell>;
}

function Shell({ children }: { children: ReactNode }) {
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><Utensils size={20} strokeWidth={2.2} /></div><div><strong>Açougue</strong><span>OPERAÇÃO</span></div></div>
      <div className="side-label">ROTINA</div>
      <nav className="side-nav">
        <button className="side-link active" onClick={() => { window.dispatchEvent(new CustomEvent('show-orders')); }} data-testid="nav-orders"><ClipboardList size={18} /><span>Pedidos</span></button>
        <button className="side-link" onClick={() => window.dispatchEvent(new CustomEvent('open-create-order'))} data-testid="nav-counter"><ShoppingBag size={18} /><span>Balcão</span></button>
        <button className="side-link" onClick={() => window.dispatchEvent(new CustomEvent('toggle-prep-view'))} data-testid="nav-prep"><ChefHat size={18} /><span>Preparação</span></button>
      </nav>
      <div className="sidebar-bottom"><div className="shift-card"><div className="shift-top"><span className="shift-live" /><span>Turno aberto</span></div><strong>Equipe do balcão</strong><small>Operação em andamento</small></div><div className="help-link"><Headphones size={16} /> Suporte interno</div></div>
      <div className="sidebar-ornament">A CASA<br />DA CARNE</div>
    </aside>
    {children}
  </div>;
}

function OrderCard({ order, selected, onSelect, onAdvance, busy, prepView }: { order: Order; selected: boolean; onSelect: () => void; onAdvance: () => void; busy: boolean; prepView: boolean }) {
  const readyItems = order.items.filter((item) => item.prepared).length;
  return <article className={`order-card ${selected ? 'selected' : ''} ${prepView ? 'prep-card' : ''}`} data-testid={`card-order-${order.id}`}>
    <button className="card-main" onClick={onSelect} data-testid={`button-select-order-${order.id}`}>
      <div className="order-card-top"><span className="order-number">{order.orderNumber}</span>{order.demo && <span className="demo-tag">DEMO</span>}<span className="order-time">{time(order.scheduledAt ?? order.createdAt)}</span></div>
      <div className="customer-line"><span className="customer-initial">{order.customer.name.slice(0, 1).toLocaleUpperCase()}</span><div><strong>{order.customer.name}</strong><small>{order.customer.phone || 'Sem telefone cadastrado'}</small></div></div>
      <div className="order-card-meta"><span>{order.serviceType === 'delivery' ? <Truck size={14} /> : <ShoppingBag size={14} />}{order.serviceType === 'delivery' ? 'Entrega' : 'Retirada'}</span><span>{order.items.length} {order.items.length === 1 ? 'item' : 'itens'}</span><span className={order.paymentStatus === 'paid' ? 'paid-status' : 'pending-status'}>{order.paymentStatus === 'paid' ? 'Pago' : 'Pendente'}</span></div>
      <div className="card-items-preview">{order.items.slice(0, prepView ? 4 : 2).map((item) => <span key={item.id}>{item.productName}{item.estimatedWeightKg ? ` · ${item.estimatedWeightKg.toLocaleString('pt-BR')} kg` : ` · ${item.quantity} ${item.unit}`}</span>)}{order.items.length > 2 && !prepView && <span className="more-items">+{order.items.length - 2} itens</span>}</div>
      {prepView && <div className="prep-progress"><span>{readyItems}/{order.items.length} preparados</span><div><i style={{ width: `${order.items.length ? (readyItems / order.items.length) * 100 : 0}%` }} /></div></div>}
    </button>
    <div className="order-card-bottom"><span className="estimated-value">{brl(order.finalTotal ?? order.estimatedTotal)} <small>{order.finalTotal ? 'final' : 'estimado'}</small></span><button className="advance-button" onClick={onAdvance} disabled={busy || order.status === 'completed'} data-testid={`button-advance-order-${order.id}`}>{order.status === 'new' ? 'Iniciar preparo' : order.status === 'preparing' ? 'Marcar pronto' : order.status === 'ready' ? 'Concluir' : 'Concluído'} <ArrowRight size={14} /></button></div>
  </article>;
}

function OrderDetails({ order, onAdvance, busy, onPrepared, onWeight }: { order: Order; onAdvance: () => void; busy: boolean; onPrepared: (itemId: number, prepared: boolean) => void; onWeight: (itemId: number, weight: number) => void }) {
  const [weights, setWeights] = useState<Record<number, string>>({});
  useEffect(() => setWeights({}), [order.id]);
  const actualTotal = order.items.reduce((sum, item) => sum + (item.finalSubtotal ?? item.estimatedSubtotal), 0);
  const adjustment = order.balanceAdjustment ?? (order.finalTotal != null ? order.finalTotal - order.estimatedTotal : 0);
  return <aside className="detail-panel" data-testid={`panel-order-details-${order.id}`}>
    <div className="detail-header"><div><div className="detail-kicker">DETALHE DO PEDIDO <span className="detail-status">{stageLabel(order.status)}</span></div><h2>{order.orderNumber}</h2></div><span className="detail-demo">{order.demo ? 'DEMONSTRAÇÃO' : 'PEDIDO REAL'}</span></div>
    <div className="detail-customer"><span className="detail-customer-icon"><UserRound size={18} /></span><div><strong>{order.customer.name}</strong><small>{order.customer.phone || 'Telefone não informado'}</small></div><button className="small-link" onClick={() => navigator.clipboard?.writeText(order.customer.phone ?? '')} data-testid={`button-copy-phone-${order.id}`}>Copiar</button></div>
    <div className="detail-facts"><div><small>SERVIÇO</small><strong>{order.serviceType === 'delivery' ? <><Truck size={14} /> Entrega</> : <><ShoppingBag size={14} /> Retirada</>}</strong></div><div><small>HORÁRIO</small><strong><Clock3 size={14} /> {time(order.scheduledAt)}</strong></div></div>
    {order.serviceType === 'delivery' && order.deliveryAddress && <div className="address-line"><MapPin size={15} />{order.deliveryAddress}</div>}
    <div className="detail-section-title"><h3>Itens e preparo</h3><span>{order.items.filter((item) => item.prepared).length}/{order.items.length} concluídos</span></div>
    <div className="detail-items">{order.items.map((item) => <div className={`detail-item ${item.prepared ? 'item-prepared' : ''}`} key={item.id} data-testid={`item-order-${order.id}-${item.id}`}>
      <div className="item-heading"><button className={`check-item ${item.prepared ? 'checked' : ''}`} onClick={() => onPrepared(item.id, !item.prepared)} aria-label={item.prepared ? 'Desmarcar como preparado' : 'Marcar como preparado'} data-testid={`button-prepared-${item.id}`}>{item.prepared && <Check size={14} />}</button><div className="item-title"><strong>{item.productName}</strong><span>{item.estimatedWeightKg ? `${item.estimatedWeightKg.toLocaleString('pt-BR')} kg estimados` : `${item.quantity} ${item.unit}`}</span></div><span className="item-subtotal">{brl(item.finalSubtotal ?? item.estimatedSubtotal)}</span></div>
      {(item.cutPreference || item.thickness || item.fatTrim || item.observations) && <div className="preference-list">{item.cutPreference && <span><b>Corte</b>{item.cutPreference}</span>}{item.thickness && <span><b>Espessura</b>{item.thickness}</span>}{item.fatTrim && <span><b>Gordura</b>{item.fatTrim}</span>}{item.observations && <span><b>Nota</b>{item.observations}</span>}</div>}
      {item.estimatedWeightKg != null && <div className="weight-entry"><label htmlFor={`weight-${item.id}`}>Peso final</label><div><input id={`weight-${item.id}`} type="number" inputMode="decimal" min="0.001" step="0.001" placeholder={item.actualWeightKg?.toString() ?? '0,000'} value={weights[item.id] ?? ''} onChange={(e) => setWeights((prev) => ({ ...prev, [item.id]: e.target.value }))} data-testid={`input-final-weight-${item.id}`} /><span>kg</span><button disabled={busy || !Number(weights[item.id])} onClick={() => { const value = Number(weights[item.id]); if (value > 0) { onWeight(item.id, value); setWeights((prev) => ({ ...prev, [item.id]: '' })); } }} data-testid={`button-save-weight-${item.id}`}>Registrar</button></div>{item.actualWeightKg != null && <small>Registrado: {item.actualWeightKg.toLocaleString('pt-BR')} kg</small>}</div>}
    </div>)}</div>
    {order.notes && <div className="order-notes"><span>RECADO DO PEDIDO</span><p>{order.notes}</p></div>}
    <div className="price-summary"><div><span>Estimativa inicial</span><strong>{brl(order.estimatedTotal)}</strong></div><div><span>Subtotal após pesos</span><strong>{brl(actualTotal)}</strong></div>{order.finalTotal != null && <div className="adjustment-line"><span>{adjustment > 0 ? 'Diferença a cobrar' : adjustment < 0 ? 'Diferença a ajustar' : 'Sem diferença'} <small>(sem cobrança nesta tela)</small></span><strong>{adjustment > 0 ? '+' : ''}{brl(adjustment)}</strong></div>}<div className="total-line"><span>{order.finalTotal != null ? 'Total final' : 'Total estimado'}</span><strong>{brl(order.finalTotal ?? order.estimatedTotal)}</strong></div></div>
    <div className="payment-note"><CreditCard size={15} /><span>Pagamento: <b>{({ pix: 'Pix', card: 'Cartão', cash: 'Dinheiro', on_delivery: 'Na entrega' } as Record<string, string>)[order.paymentMethod]}</b> · {order.paymentStatus === 'paid' ? 'Pago' : 'Pendente'}<small>Registro operacional apenas. Nenhuma transação é iniciada.</small></span></div>
    <button className="detail-advance" onClick={onAdvance} disabled={busy || order.status === 'completed'} data-testid={`button-detail-advance-${order.id}`}>{order.status === 'new' ? 'Começar preparo' : order.status === 'preparing' ? 'Pedido pronto para retirada' : order.status === 'ready' ? 'Concluir pedido' : 'Pedido concluído'} <ArrowRight size={16} /></button>
  </aside>;
}

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}
function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}
function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}
export default App;
