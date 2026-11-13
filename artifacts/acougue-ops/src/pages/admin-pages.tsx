import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import {
  getListAdminCatalogQueryKey, getListCatalogQueryKey, getListCustomersQueryKey,
  getListOrdersQueryKey, getGetStoreSettingsQueryKey, getGetSalesReportQueryKey,
  useListAdminCatalog, useCreateCatalogProduct, useUpdateCatalogProduct,
  useListCustomers, useUpdateCustomer, useListOrders,
  useGetSalesReport, useGetStoreSettings, useUpdateStoreSettings,
} from '@workspace/api-client-react';
import type { CatalogProduct, CatalogProductInput, StoreSettingsInput } from '@workspace/api-client-react';
import { GramsInput } from '@/components/grams-input';
import { Form } from '@/components/ui/form';
import { Search, Plus, Pencil, Copy, Package, Users, ChartNoAxesCombined, Settings2, X, Save } from 'lucide-react';

const money = (n?: number | null) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n ?? 0);
const isPromotionActive = (product: CatalogProduct) => product.promoPrice != null
  && (!product.promoStartsAt || new Date(product.promoStartsAt).getTime() <= Date.now())
  && (!product.promoEndsAt || new Date(product.promoEndsAt).getTime() >= Date.now());
const fail = (refetch: () => unknown) => <div className="admin-state"><h2>Não foi possível carregar os dados</h2><p>Confira a conexão e tente novamente.</p><button className="button button-dark" onClick={() => refetch()} data-testid="button-admin-retry">Tentar novamente</button></div>;
const loading = <div className="admin-skeleton"><i /><i /><i /></div>;

type ProductForm = {
  name: string; category: string; description: string; pricePerKg: string; saleUnit: string;
  status: string; productType: string; stockQuantity: string; imageUrl: string;
  promoPrice: string; promoLabel: string; promoStartsAt: string; promoEndsAt: string;
};
const blankProduct: ProductForm = { name: '', category: '', description: '', pricePerKg: '', saleUnit: 'kg', status: 'active', productType: 'product', stockQuantity: '', imageUrl: '', promoPrice: '', promoLabel: '', promoStartsAt: '', promoEndsAt: '' };
const inputClass = 'admin-input';

export function CatalogPage() {
  const qc = useQueryClient();
  const query = useListAdminCatalog();
  const create = useCreateCatalogProduct();
  const update = useUpdateCatalogProduct();
  const [editing, setEditing] = useState<CatalogProduct | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [notice, setNotice] = useState('');
  const form = useForm<ProductForm>({ defaultValues: blankProduct });
  const saleUnit = form.watch('saleUnit');
  const saleUnitField = form.register('saleUnit');
  const products = query.data ?? [];
  const categories = [...new Set(products.map(p => p.category))].sort();
  const visible = products.filter(p => (category === 'all' || p.category === category) && `${p.name} ${p.category}`.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR')));
  const open = (product?: CatalogProduct, duplicate = false) => {
    setEditing(product && !duplicate ? product : null);
    form.reset(product ? { name: duplicate ? `${product.name} — cópia` : product.name, category: product.category, description: product.description ?? '', pricePerKg: String(product.pricePerKg), saleUnit: product.saleUnit, status: product.status, productType: product.productType, stockQuantity: product.stockQuantity == null ? '' : String(Math.round(product.stockQuantity * (product.saleUnit === 'kg' ? 1000 : 1))), imageUrl: product.imageUrl ?? '', promoPrice: product.promoPrice == null ? '' : String(product.promoPrice), promoLabel: product.promoLabel ?? '', promoStartsAt: product.promoStartsAt?.slice(0, 16) ?? '', promoEndsAt: product.promoEndsAt?.slice(0, 16) ?? '' } : blankProduct);
    setFormOpen(true);
  };
  const payload = (v: ProductForm): CatalogProductInput => ({
    name: v.name.trim(), category: v.category.trim(), description: v.description || null,
    pricePerKg: Number(v.pricePerKg), saleUnit: v.saleUnit as CatalogProductInput['saleUnit'],
    status: v.status as CatalogProductInput['status'], productType: v.productType as CatalogProductInput['productType'],
    stockQuantity: v.stockQuantity === '' ? null : Number(v.stockQuantity) / (v.saleUnit === 'kg' ? 1000 : 1), imageUrl: v.imageUrl || null,
    promoPrice: v.promoPrice === '' ? null : Number(v.promoPrice), promoLabel: v.promoLabel || null,
    promoStartsAt: v.promoStartsAt ? new Date(v.promoStartsAt).toISOString() : null,
    promoEndsAt: v.promoEndsAt ? new Date(v.promoEndsAt).toISOString() : null,
  });
  const save = (v: ProductForm) => {
    const done = () => { qc.invalidateQueries({ queryKey: getListAdminCatalogQueryKey() }); qc.invalidateQueries({ queryKey: getListCatalogQueryKey() }); setFormOpen(false); setNotice(editing ? 'Produto atualizado.' : 'Produto cadastrado.'); };
    if (editing) update.mutate({ id: editing.id, data: payload(v) }, { onSuccess: done, onError: () => setNotice('Não foi possível salvar o produto.') });
    else create.mutate({ data: payload(v) }, { onSuccess: done, onError: () => setNotice('Não foi possível salvar o produto.') });
  };
  if (query.isLoading) return <AdminFrame title="Catálogo" subtitle="Cortes, combos e ofertas em um só lugar." icon={<Package size={18} />}>{loading}</AdminFrame>;
  if (query.isError) return <AdminFrame title="Catálogo" subtitle="Cortes, combos e ofertas em um só lugar." icon={<Package size={18} />}>{fail(query.refetch)}</AdminFrame>;
  return <AdminFrame title="Catálogo" subtitle="Cortes, combos e ofertas em um só lugar." icon={<Package size={18} />}>
    <div className="admin-toolbar"><label className="admin-search"><Search size={17}/><input aria-label="Buscar produtos" placeholder="Buscar produto ou categoria" value={search} onChange={e=>setSearch(e.target.value)} data-testid="input-catalog-search"/></label><select value={category} onChange={e=>setCategory(e.target.value)} className={inputClass} data-testid="select-catalog-category"><option value="all">Todas as categorias</option>{categories.map(c=><option key={c}>{c}</option>)}</select><button className="button button-dark" onClick={()=>open()} data-testid="button-product-create"><Plus size={16}/> Novo produto</button></div>
    {notice && <div className="admin-feedback" role="status" data-testid="status-catalog-feedback">{notice}<button onClick={()=>setNotice('')} aria-label="Fechar aviso"><X size={14}/></button></div>}
    {formOpen && <section className="admin-editor" data-testid="panel-product-editor"><header><div><small>{editing ? 'EDIÇÃO DO CATÁLOGO' : 'NOVO CADASTRO'}</small><h2>{editing ? 'Editar produto' : 'Adicionar ao catálogo'}</h2></div><button className="icon-button" onClick={()=>setFormOpen(false)} aria-label="Fechar formulário" data-testid="button-product-form-close"><X size={17}/></button></header>
      <Form {...form}><form onSubmit={form.handleSubmit(save)} className="admin-form">
        <label>Nome do produto<input className={inputClass} {...form.register('name',{required:true})} data-testid="input-product-name"/></label><label>Categoria<input className={inputClass} {...form.register('category',{required:true})} list="catalog-categories" data-testid="input-product-category"/><datalist id="catalog-categories">{categories.map(c=><option key={c} value={c}/>)}</datalist></label>
        <label>{saleUnit === 'unidade' ? 'Preço por unidade' : 'Preço por kg'}<input className={inputClass} type="number" min="0" step="0.01" {...form.register('pricePerKg',{required:true})} data-testid="input-product-price"/></label><label>Unidade de venda<select className={inputClass} {...saleUnitField} onChange={(event) => { const previousUnit = form.getValues('saleUnit'); saleUnitField.onChange(event); const nextUnit = event.target.value; if ((previousUnit === 'unidade') !== (nextUnit === 'unidade')) form.setValue('stockQuantity', '', { shouldDirty: true }); }} data-testid="select-product-unit"><option value="kg">Quilo (kg)</option><option value="g">Grama (g)</option><option value="unidade">Unidade</option></select></label>
        <label>Tipo<select className={inputClass} {...form.register('productType')} data-testid="select-product-type"><option value="product">Produto</option><option value="combo">Combo</option></select></label><label>Status<select className={inputClass} {...form.register('status')} data-testid="select-product-status"><option value="active">Disponível</option><option value="inactive">Inativo</option><option value="sold_out">Esgotado</option></select></label>
        <label>Estoque opcional{saleUnit === 'unidade' ? <input className={inputClass} type="number" min="0" step="1" {...form.register('stockQuantity')} data-testid="input-product-stock"/> : <GramsInput value={form.watch('stockQuantity')} onChange={(value) => form.setValue('stockQuantity', value, { shouldDirty: true })} ariaLabel="Estoque em gramas" testId="input-product-stock" className="admin-grams-input" />}</label><label>Imagem por URL<input className={inputClass} type="url" placeholder="https://" {...form.register('imageUrl')} data-testid="input-product-image-url"/></label>
        <label className="admin-span">Descrição<textarea className={inputClass} rows={2} {...form.register('description')} data-testid="input-product-description"/></label>
        <div className="admin-subhead">Oferta opcional</div><label>Preço promocional<input className={inputClass} type="number" min="0" step="0.01" {...form.register('promoPrice')} data-testid="input-product-promo-price"/></label><label>Identificação da oferta<input className={inputClass} {...form.register('promoLabel')} data-testid="input-product-promo-label"/></label><label>Início<input className={inputClass} type="datetime-local" {...form.register('promoStartsAt')} data-testid="input-product-promo-start"/></label><label>Fim<input className={inputClass} type="datetime-local" {...form.register('promoEndsAt')} data-testid="input-product-promo-end"/></label>
        <div className="admin-span admin-form-actions"><button type="button" className="button button-outline" onClick={()=>setFormOpen(false)} data-testid="button-product-cancel">Cancelar</button><button className="button button-dark" disabled={create.isPending||update.isPending} data-testid="button-product-save"><Save size={15}/>{create.isPending||update.isPending?'Salvando…':'Salvar produto'}</button></div>
      </form></Form>
    </section>}
    {visible.length ? <div className="catalog-grid">{visible.map(p=>{const promoActive=isPromotionActive(p);return <article className="catalog-item" key={p.id} data-testid={`card-product-${p.id}`}><div className="catalog-photo">{p.imageUrl ? <img src={p.imageUrl} alt={p.name}/> : <span>{p.productType==='combo'?'COMBO':'CORTE'}</span>}<b className={`product-state state-${p.status}`}>{p.status==='active'?'Ativo':p.status==='sold_out'?'Esgotado':'Inativo'}</b>{p.demo&&<i>DEMO</i>}</div><div className="catalog-info"><small>{p.category} · venda em {p.saleUnit === 'kg' ? 'kg' : p.saleUnit === 'g' ? 'gramas' : 'unidade'}</small><h3>{p.name}</h3><p>{p.description||'Sem descrição cadastrada.'}</p><div className="catalog-price"><strong>{money(promoActive ? p.promoPrice : p.pricePerKg)}</strong><span>{promoActive ? <del>{money(p.pricePerKg)}</del> : `/${p.saleUnit === 'unidade' ? 'unid.' : 'kg'}`}</span></div>{p.stockQuantity!=null&&<div className="stock-line">Estoque registrado <b>{p.stockQuantity} {p.saleUnit}</b></div>}{p.promoLabel&&<div className="promo-line">{p.promoLabel}{promoActive?' · ativa':p.promoStartsAt&&new Date(p.promoStartsAt).getTime()>Date.now()?' · programada':p.promoEndsAt&&new Date(p.promoEndsAt).getTime()<Date.now()?' · encerrada':''}</div>}<div className="catalog-actions"><button onClick={()=>open(p)} data-testid={`button-product-edit-${p.id}`}><Pencil size={14}/>Editar</button><button onClick={()=>open(p,true)} data-testid={`button-product-duplicate-${p.id}`}><Copy size={14}/>Duplicar</button></div></div></article>})}</div> : <div className="admin-empty" data-testid="empty-catalog"><Package size={25}/><h3>{products.length?'Nenhum resultado':'Catálogo sem produtos'}</h3><p>{products.length?'Ajuste sua busca ou categoria.':'Cadastre os cortes e combos disponíveis no balcão.'}</p></div>}
  </AdminFrame>;
}

export function CustomersPage() {
  const qc=useQueryClient(); const customersQuery=useListCustomers(); const ordersQuery=useListOrders();
  const update=useUpdateCustomer(); const [search,setSearch]=useState(''); const [selectedId,setSelectedId]=useState<number|null>(null); const [notice,setNotice]=useState('');
  const customers=customersQuery.data??[]; const orders=ordersQuery.data??[];
  const matches=customers.filter(c=>`${c.name} ${c.phone??''}`.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR')));
  const selected=customers.find(c=>c.id===selectedId)??matches[0]??null;
  const form=useForm<{name:string;phone:string;preferences:string;internalNotes:string}>({defaultValues:{name:'',phone:'',preferences:'',internalNotes:''}});
  useEffect(()=>{if(selected)form.reset({name:selected.name,phone:selected.phone??'',preferences:selected.preferences.join('\n'),internalNotes:selected.internalNotes??''});},[selected?.id, selected?.name, selected?.phone, selected?.internalNotes, selected?.preferences, form]);
  const history=selected?orders.filter(o=>o.customer.id===selected.id).sort((a,b)=>new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime()):[];
  const save=(v:{name:string;phone:string;preferences:string;internalNotes:string})=>selected&&update.mutate({id:selected.id,data:{name:v.name.trim(),phone:v.phone||null,preferences:v.preferences.split('\n').map(x=>x.trim()).filter(Boolean),internalNotes:v.internalNotes||null}},{onSuccess:()=>{qc.invalidateQueries({queryKey:getListCustomersQueryKey()});qc.invalidateQueries({queryKey:getListOrdersQueryKey()});setNotice('Cadastro atualizado.');},onError:()=>setNotice('Não foi possível salvar as alterações.')});
  if(customersQuery.isLoading||ordersQuery.isLoading)return <AdminFrame title="Clientes" subtitle="Histórico e preferências de quem compra aqui." icon={<Users size={18}/>}>{loading}</AdminFrame>;
  if(customersQuery.isError||ordersQuery.isError)return <AdminFrame title="Clientes" subtitle="Histórico e preferências de quem compra aqui." icon={<Users size={18}/>}>{fail(()=>{customersQuery.refetch();ordersQuery.refetch();})}</AdminFrame>;
  return <AdminFrame title="Clientes" subtitle="Histórico e preferências de quem compra aqui." icon={<Users size={18}/>}><div className="customer-workspace"><section className="customer-directory"><label className="admin-search"><Search size={16}/><input placeholder="Nome ou telefone" value={search} onChange={e=>setSearch(e.target.value)} data-testid="input-customer-search"/></label><div className="customer-results">{matches.map(c=><button className={`customer-result ${selected?.id===c.id?'chosen':''}`} key={c.id} onClick={()=>setSelectedId(c.id)} data-testid={`button-customer-select-${c.id}`}><span className="customer-avatar">{c.name.slice(0,1).toUpperCase()}</span><span><b>{c.name}</b><small>{c.phone||'Telefone não informado'}</small></span><em>{orders.filter(o=>o.customer.id===c.id).length}</em></button>)}</div>{!matches.length&&<div className="compact-empty" data-testid="empty-customers">Nenhum cliente encontrado.</div>}</section>
  {selected?<section className="customer-profile"><div className="profile-heading"><div><small>PERFIL DO CLIENTE</small><h2>{selected.name}</h2><span>Cliente desde {new Date(selected.createdAt).toLocaleDateString('pt-BR')}</span></div><span className="profile-orders">{history.length} pedidos</span></div>{notice&&<div className="admin-feedback" role="status" data-testid="status-customer-feedback">{notice}</div>}
    <Form {...form}><form onSubmit={form.handleSubmit(save)} className="admin-form customer-edit"><label>Nome<input className={inputClass} {...form.register('name',{required:true})} data-testid="input-customer-edit-name"/></label><label>Telefone<input className={inputClass} {...form.register('phone')} data-testid="input-customer-edit-phone"/></label><label className="admin-span">Preferências <small>Uma preferência por linha</small><textarea rows={3} className={inputClass} {...form.register('preferences')} data-testid="input-customer-preferences"/></label><label className="admin-span">Notas internas<textarea rows={3} className={inputClass} {...form.register('internalNotes')} data-testid="input-customer-notes"/></label><div className="admin-span admin-form-actions"><button className="button button-dark" disabled={update.isPending} data-testid="button-customer-save"><Save size={15}/>{update.isPending?'Salvando…':'Salvar perfil'}</button></div></form></Form>
    <div className="history-heading"><h3>Pedidos anteriores</h3><span>Dados reais da operação</span></div>{history.length?<div className="history-list">{history.map(o=><article key={o.id} className="history-row" data-testid={`row-customer-order-${o.id}`}><div><b>{o.orderNumber}</b><small>{new Date(o.createdAt).toLocaleDateString('pt-BR')} · {o.status==='completed'?'Concluído':o.status==='ready'?'Pronto':o.status==='preparing'?'Em preparo':'Novo'}</small></div><span>{o.items.map(i=>i.productName).join(', ')}</span><strong>{money(o.finalTotal??o.estimatedTotal)}</strong></article>)}</div>:<div className="compact-empty">Ainda não há pedidos registrados para este cliente.</div>}
  </section>:<div className="admin-empty"><Users size={25}/><h3>Nenhum cliente cadastrado</h3><p>Os clientes aparecerão aqui após o primeiro pedido.</p></div>}</div></AdminFrame>;
}

export function ReportsPage() {
  const [range,setRange]=useState(()=>({from:new Date(Date.now()-6*86400000).toISOString().slice(0,10),to:new Date().toISOString().slice(0,10)}));
  const query=useGetSalesReport(range,{query:{queryKey:getGetSalesReportQueryKey(range)}});
  const report=query.data;
  const max=Math.max(...(report?.dailyRevenue??[]).map(d=>d.revenue),1);
  if(query.isLoading)return <AdminFrame title="Relatórios" subtitle="Vendas observadas no período selecionado." icon={<ChartNoAxesCombined size={18}/>}>{loading}</AdminFrame>;
  if(query.isError)return <AdminFrame title="Relatórios" subtitle="Vendas observadas no período selecionado." icon={<ChartNoAxesCombined size={18}/>}>{fail(query.refetch)}</AdminFrame>;
  return <AdminFrame title="Relatórios" subtitle="Vendas observadas no período selecionado." icon={<ChartNoAxesCombined size={18}/>}><div className="report-toolbar"><span>PERÍODO DO RELATÓRIO</span><label>De<input type="date" value={range.from} onChange={e=>setRange(r=>({...r,from:e.target.value}))} data-testid="input-report-from"/></label><label>Até<input type="date" value={range.to} onChange={e=>setRange(r=>({...r,to:e.target.value}))} data-testid="input-report-to"/></label></div>
    {report&&<><div className="report-metrics"><div className="report-main-metric"><small>RECEITA DO PERÍODO</small><strong data-testid="value-report-revenue">{money(report.revenue)}</strong><span>{report.from} — {report.to}</span></div><div><small>PEDIDOS</small><strong data-testid="value-report-orders">{report.orderCount}</strong><span>no período</span></div><div><small>TICKET MÉDIO</small><strong data-testid="value-report-ticket">{money(report.averageTicket)}</strong><span>por pedido</span></div><div className="pending-metric"><small>PENDENTES</small><strong data-testid="value-report-pending">{report.pendingOrders}</strong><span>aguardando conclusão</span></div></div>
    <div className="report-columns"><section className="report-panel daily-panel"><header><div><small>RITMO DE VENDAS</small><h2>Receita por dia</h2></div><span>BRL</span></header>{report.dailyRevenue.length?<div className="daily-chart">{report.dailyRevenue.map(d=><div className="day-bar" key={d.date} data-testid={`bar-daily-revenue-${d.date}`}><div className="bar-value">{money(d.revenue)}</div><div className="bar-track"><i style={{height:`${Math.max(4,d.revenue/max*100)}%`}}/></div><b>{new Date(`${d.date}T12:00:00`).toLocaleDateString('pt-BR',{day:'2-digit',month:'short'})}</b><small>{d.orders} {d.orders===1?'pedido':'pedidos'}</small></div>)}</div>:<div className="compact-empty">Sem receita registrada neste período.</div>}</section>
    <section className="report-panel sellers-panel"><header><div><small>MAIS PEDIDOS</small><h2>Produtos em destaque</h2></div></header>{report.topProducts.length?report.topProducts.map((p,i)=><div className="seller-row" key={`${p.productName}-${i}`} data-testid={`row-top-product-${i}`}><span className="seller-rank">{String(i+1).padStart(2,'0')}</span><div><b>{p.productName}</b><small>{p.quantity.toLocaleString('pt-BR')} vendidos</small></div><strong>{money(p.revenue)}</strong></div>):<div className="compact-empty">Ainda sem produtos vendidos no período.</div>}</section></div></>}
  </AdminFrame>;
}

type SettingsForm = { weeklyHours: Record<string,{open:string;close:string;closed:boolean}>; pickupSlots:Array<{time:string;limit:number}>; serviceTypes:string[]; preparationMinutes:number; paymentMethods:string[]; whatsapp:string };
const dayNames:Record<string,string>={monday:'Segunda',tuesday:'Terça',wednesday:'Quarta',thursday:'Quinta',friday:'Sexta',saturday:'Sábado',sunday:'Domingo'};
export function SettingsPage(){
 const qc=useQueryClient();const query=useGetStoreSettings();const update=useUpdateStoreSettings();const [notice,setNotice]=useState('');
 const form=useForm<SettingsForm>({defaultValues:{weeklyHours:{},pickupSlots:[],serviceTypes:['pickup'],preparationMinutes:0,paymentMethods:['pix'],whatsapp:''}});
 useEffect(()=>{if(query.data)form.reset({...query.data,whatsapp:query.data.whatsapp??''});},[query.data,form]);
 const save=(v:SettingsForm)=>{const data:StoreSettingsInput={weeklyHours:v.weeklyHours,pickupSlots:v.pickupSlots.filter(s=>s.time),serviceTypes:v.serviceTypes as StoreSettingsInput['serviceTypes'],preparationMinutes:Number(v.preparationMinutes),paymentMethods:v.paymentMethods as StoreSettingsInput['paymentMethods'],whatsapp:v.whatsapp||null};update.mutate({data},{onSuccess:()=>{qc.invalidateQueries({queryKey:getGetStoreSettingsQueryKey()});setNotice('Configurações salvas.');},onError:()=>setNotice('Não foi possível salvar as configurações.')});};
 if(query.isLoading)return <AdminFrame title="Configurações" subtitle="Horários e combinados da loja." icon={<Settings2 size={18}/>}>{loading}</AdminFrame>;
 if(query.isError)return <AdminFrame title="Configurações" subtitle="Horários e combinados da loja." icon={<Settings2 size={18}/>}>{fail(query.refetch)}</AdminFrame>;
 const settings=query.data;
 return <AdminFrame title="Configurações" subtitle="Horários e combinados da loja." icon={<Settings2 size={18}/>}><Form {...form}><form onSubmit={form.handleSubmit(save)} className="settings-form">
  {notice&&<div className="admin-feedback admin-span" role="status" data-testid="status-settings-feedback">{notice}</div>}
  <section className="settings-panel"><header><div><small>01 · FUNCIONAMENTO</small><h2>Horários semanais</h2></div><p>Informe os horários praticados no balcão.</p></header><div className="hours-grid">{Object.entries(settings?.weeklyHours??{}).map(([day,h])=><div className="hours-row" key={day}><b>{dayNames[day]??day}</b><label className="hours-time">Abre<input type="time" disabled={form.watch(`weeklyHours.${day}.closed`)} {...form.register(`weeklyHours.${day}.open`)} data-testid={`input-hours-open-${day}`}/></label><label className="hours-time">Fecha<input type="time" disabled={form.watch(`weeklyHours.${day}.closed`)} {...form.register(`weeklyHours.${day}.close`)} data-testid={`input-hours-close-${day}`}/></label><label className="check-label"><input type="checkbox" {...form.register(`weeklyHours.${day}.closed`)} data-testid={`checkbox-hours-closed-${day}`}/> Fechado</label></div>)}</div></section>
  <section className="settings-panel"><header><div><small>02 · RETIRADA</small><h2>Janelas e capacidade</h2></div><button type="button" className="button button-outline" onClick={()=>form.setValue('pickupSlots',[...form.getValues('pickupSlots'),{time:'12:00',limit:1}])} data-testid="button-add-pickup-slot"><Plus size={14}/>Adicionar horário</button></header><div className="slot-list">{form.watch('pickupSlots').map((slot,index)=><div className="slot-row" key={`${index}-${slot.time}`}><label>Horário<input type="time" className={inputClass} {...form.register(`pickupSlots.${index}.time`)} data-testid={`input-pickup-time-${index}`}/></label><label>Pedidos por horário<input type="number" min="1" className={inputClass} {...form.register(`pickupSlots.${index}.limit`,{valueAsNumber:true})} data-testid={`input-pickup-capacity-${index}`}/></label><button type="button" aria-label="Remover horário" onClick={()=>form.setValue('pickupSlots',form.getValues('pickupSlots').filter((_,i)=>i!==index))} data-testid={`button-remove-pickup-slot-${index}`}><X size={15}/></button></div>)}</div>{!form.watch('pickupSlots').length&&<p className="settings-hint">Nenhuma janela de retirada cadastrada.</p>}</section>
  <section className="settings-panel"><header><div><small>03 · OPERAÇÃO</small><h2>Atendimento e pagamento</h2></div></header><div className="settings-option-grid"><fieldset><legend>Tipos de atendimento</legend>{[['pickup','Retirada no balcão'],['delivery','Entrega']].map(([value,label])=><label className="check-label" key={value}><input type="checkbox" value={value} {...form.register('serviceTypes')} data-testid={`checkbox-service-${value}`}/>{label}</label>)}</fieldset><fieldset><legend>Formas de pagamento</legend>{[['pix','Pix'],['card','Cartão'],['cash','Dinheiro'],['on_delivery','Na entrega']].map(([value,label])=><label className="check-label" key={value}><input type="checkbox" value={value} {...form.register('paymentMethods')} data-testid={`checkbox-payment-${value}`}/>{label}</label>)}</fieldset><label>Tempo de preparo estimado (minutos)<input className={inputClass} type="number" min="0" {...form.register('preparationMinutes',{valueAsNumber:true})} data-testid="input-preparation-minutes"/></label><label>WhatsApp da loja<input className={inputClass} type="tel" {...form.register('whatsapp')} placeholder="5511999999999" data-testid="input-settings-whatsapp"/></label></div></section>
  <div className="settings-savebar"><span>Configuração da loja <b>·</b> ID {settings?.id}</span><button className="button button-dark" disabled={update.isPending} data-testid="button-settings-save"><Save size={15}/>{update.isPending?'Salvando…':'Salvar configurações'}</button></div>
 </form></Form></AdminFrame>;
}

function AdminFrame({title,subtitle,icon,children}:{title:string;subtitle:string;icon:React.ReactNode;children:React.ReactNode}){
 return <main className="workspace admin-workspace"><header className="topbar"><div className="breadcrumbs"><span>Operação</span><span className="crumb-divider">/</span><strong>{title}</strong></div><div className="top-actions"><div className="live-indicator"><i/>Dados conectados</div><div className="user-chip"><span className="user-avatar">OP</span><span className="user-label">Operação</span></div></div></header><section className="page-heading admin-page-heading"><div><div className="eyebrow"><span className="eyebrow-line"/>{icon} AÇOUGUE · GESTÃO DA LOJA</div><h1>{title} <span>da operação</span></h1><p>{subtitle}</p></div></section>{children}<footer className="app-footer"><span>Açougue Operação <b>•</b> Uso interno da equipe</span><span>Dados atualizados diretamente do sistema.</span></footer></main>;
}
