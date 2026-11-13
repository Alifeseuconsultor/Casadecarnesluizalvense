import { and, asc, desc, eq, gte, inArray, lt } from "drizzle-orm";
import { Router, type IRouter } from "express";
import {
  CreateCatalogProductBody,
  CreateCatalogProductResponse,
  GetSalesReportQueryParams,
  GetSalesReportResponse,
  GetStoreSettingsResponse,
  ListAdminCatalogResponse,
  UpdateCatalogProductBody,
  UpdateCatalogProductParams,
  UpdateCatalogProductResponse,
  UpdateCustomerBody,
  UpdateCustomerParams,
  UpdateCustomerResponse,
  UpdateStoreSettingsBody,
  UpdateStoreSettingsResponse,
} from "@workspace/api-zod";
import {
  catalogProductsTable,
  customersTable,
  db,
  orderItemsTable,
  ordersTable,
  storeSettingsTable,
} from "@workspace/db";
import { storeSettingsSchema } from "@workspace/db";
import { roundCurrency } from "../lib/orders";

const router: IRouter = Router();

router.get("/catalog/admin", async (_req, res): Promise<void> => {
  const products = await db
    .select()
    .from(catalogProductsTable)
    .orderBy(asc(catalogProductsTable.category), asc(catalogProductsTable.name));
  res.json(ListAdminCatalogResponse.parse(products));
});

router.post("/catalog/products", async (req, res): Promise<void> => {
  const parsed = CreateCatalogProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const status = parsed.data.status;
  const [product] = await db
    .insert(catalogProductsTable)
    .values({
      ...parsed.data,
      active: status === "active",
      description: parsed.data.description ?? null,
      stockQuantity: parsed.data.stockQuantity ?? null,
      imageUrl: parsed.data.imageUrl ?? null,
      promoPrice: parsed.data.promoPrice ?? null,
      promoLabel: parsed.data.promoLabel ?? null,
      promoStartsAt: parsed.data.promoStartsAt ?? null,
      promoEndsAt: parsed.data.promoEndsAt ?? null,
      demo: false,
    })
    .returning();
  res.status(201).json(CreateCatalogProductResponse.parse(product));
});

router.patch("/catalog/products/:id", async (req, res): Promise<void> => {
  const params = UpdateCatalogProductParams.safeParse(req.params);
  const body = UpdateCatalogProductBody.safeParse(req.body);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [product] = await db
    .update(catalogProductsTable)
    .set({
      ...body.data,
      ...(body.data.status !== undefined
        ? { active: body.data.status === "active" }
        : {}),
    })
    .where(eq(catalogProductsTable.id, params.data.id))
    .returning();
  if (!product) {
    res.status(404).json({ error: "Produto não encontrado." });
    return;
  }
  res.json(UpdateCatalogProductResponse.parse(product));
});

router.patch("/customers/:id", async (req, res): Promise<void> => {
  const params = UpdateCustomerParams.safeParse(req.params);
  const body = UpdateCustomerBody.safeParse(req.body);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [customer] = await db
    .update(customersTable)
    .set(body.data)
    .where(eq(customersTable.id, params.data.id))
    .returning();
  if (!customer) {
    res.status(404).json({ error: "Cliente não encontrado." });
    return;
  }
  res.json(UpdateCustomerResponse.parse(customer));
});

async function getOrCreateStoreSettings() {
  await db
    .insert(storeSettingsTable)
    .values({ id: 1 })
    .onConflictDoNothing({ target: storeSettingsTable.id });
  const [settings] = await db
    .select()
    .from(storeSettingsTable)
    .where(eq(storeSettingsTable.id, 1))
    .limit(1);
  if (!settings) throw new Error("Não foi possível carregar as configurações.");
  return settings;
}

router.get("/store-settings", async (_req, res): Promise<void> => {
  const settings = await getOrCreateStoreSettings();
  res.json(GetStoreSettingsResponse.parse(settings));
});

router.put("/store-settings", async (req, res): Promise<void> => {
  const body = UpdateStoreSettingsBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const checked = storeSettingsSchema.safeParse(body.data);
  if (!checked.success) {
    res.status(400).json({ error: checked.error.message });
    return;
  }
  const [settings] = await db
    .insert(storeSettingsTable)
    .values({ id: 1, ...checked.data })
    .onConflictDoUpdate({
      target: storeSettingsTable.id,
      set: checked.data,
    })
    .returning();
  res.json(UpdateStoreSettingsResponse.parse(settings));
});

router.get("/reports", async (req, res): Promise<void> => {
  const parsed = GetSalesReportQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const from = new Date(`${parsed.data.from}T00:00:00.000Z`);
  const through = new Date(`${parsed.data.to}T00:00:00.000Z`);
  if (
    Number.isNaN(from.getTime()) ||
    Number.isNaN(through.getTime()) ||
    through < from
  ) {
    res.status(400).json({ error: "Informe um período válido." });
    return;
  }
  const days = Math.floor((through.getTime() - from.getTime()) / 86_400_000) + 1;
  if (days > 370) {
    res.status(400).json({ error: "O período máximo é de 370 dias." });
    return;
  }
  const until = new Date(through.getTime() + 86_400_000);
  const orders = await db
    .select()
    .from(ordersTable)
    .where(
      and(
        gte(ordersTable.createdAt, from),
        lt(ordersTable.createdAt, until),
      ),
    )
    .orderBy(desc(ordersTable.createdAt));
  const orderIds = orders.map((order) => order.id);
  const items = orderIds.length
    ? await db
        .select()
        .from(orderItemsTable)
        .where(inArray(orderItemsTable.orderId, orderIds))
    : [];
  const completed = orders.filter((order) => order.status === "completed");
  const revenueByDay = new Map<string, { revenue: number; orders: number }>();
  for (let day = 0; day < days; day += 1) {
    const date = new Date(from.getTime() + day * 86_400_000)
      .toISOString()
      .slice(0, 10);
    revenueByDay.set(date, { revenue: 0, orders: 0 });
  }
  for (const order of completed) {
    const date = order.createdAt.toISOString().slice(0, 10);
    const bucket = revenueByDay.get(date);
    if (bucket) {
      bucket.revenue += order.finalTotal ?? order.estimatedTotal;
      bucket.orders += 1;
    }
  }
  const completedIds = new Set(completed.map((order) => order.id));
  const products = new Map<
    string,
    { productName: string; quantity: number; revenue: number }
  >();
  for (const item of items) {
    if (!completedIds.has(item.orderId)) continue;
    const product = products.get(item.productName) ?? {
      productName: item.productName,
      quantity: 0,
      revenue: 0,
    };
    product.quantity += item.quantity;
    product.revenue += item.finalSubtotal ?? item.estimatedSubtotal;
    products.set(item.productName, product);
  }
  const revenue = roundCurrency(
    completed.reduce(
      (sum, order) => sum + (order.finalTotal ?? order.estimatedTotal),
      0,
    ),
  );
  const report = {
    from: parsed.data.from,
    to: parsed.data.to,
    revenue,
    orderCount: orders.length,
    averageTicket: completed.length ? roundCurrency(revenue / completed.length) : 0,
    pendingOrders: orders.filter((order) => order.status !== "completed").length,
    topProducts: [...products.values()]
      .map((product) => ({
        ...product,
        revenue: roundCurrency(product.revenue),
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 8),
    dailyRevenue: [...revenueByDay.entries()].map(([date, values]) => ({
      date,
      revenue: roundCurrency(values.revenue),
      orders: values.orders,
    })),
  };
  res.json(GetSalesReportResponse.parse(report));
});

export default router;
