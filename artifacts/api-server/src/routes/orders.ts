import { and, desc, eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import {
  CreateCustomerBody,
  CreateCustomerResponse,
  CreateOrderBody,
  CreateOrderResponse,
  GetOrderParams,
  GetOrderResponse,
  ListCatalogResponse,
  ListCustomersResponse,
  ListOrdersResponse,
  UpdateItemPreparedBody,
  UpdateItemPreparedParams,
  UpdateItemPreparedResponse,
  UpdateItemWeightBody,
  UpdateItemWeightParams,
  UpdateItemWeightResponse,
  UpdateOrderStatusBody,
  UpdateOrderStatusParams,
  UpdateOrderStatusResponse,
} from "@workspace/api-zod";
import {
  catalogProductsTable,
  customersTable,
  db,
  orderItemsTable,
  ordersTable,
} from "@workspace/db";
import {
  estimateItemWeight,
  findItemForOrder,
  getAllOrderDetails,
  getOrderDetails,
  makeOrderNumber,
  roundCurrency,
} from "../lib/orders";

const router: IRouter = Router();

router.get("/orders", async (_req, res): Promise<void> => {
  const result = await getAllOrderDetails();
  res.json(ListOrdersResponse.parse(result));
});

router.post("/orders", async (req, res): Promise<void> => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const input = parsed.data;
  const order = await db.transaction(async (tx) => {
    let customer =
      input.customerId == null
        ? undefined
        : (
            await tx
              .select()
              .from(customersTable)
              .where(eq(customersTable.id, input.customerId))
              .limit(1)
          )[0];
    if (input.customerId != null && !customer) {
      return undefined;
    }
    const items = [];
    for (const item of input.items) {
      const [catalogProduct] =
        item.productId == null
          ? []
          : await tx
              .select()
              .from(catalogProductsTable)
              .where(
                and(
                  eq(catalogProductsTable.id, item.productId),
                  eq(catalogProductsTable.active, true),
                ),
              )
              .limit(1);
      if (item.productId != null && !catalogProduct) return undefined;
      const productName = catalogProduct?.name ?? item.productName;
      const pricePerKg = catalogProduct?.pricePerKg ?? item.pricePerKg;
      const weight = estimateItemWeight(item);
      const estimatedSubtotal = roundCurrency(
        (weight ?? item.quantity) * pricePerKg,
      );
      items.push({
        productId: catalogProduct?.id ?? null,
        productName,
        quantity: item.quantity,
        unit: item.unit,
        cutPreference: item.cutPreference ?? null,
        thickness: item.thickness ?? null,
        fatTrim: item.fatTrim ?? null,
        observations: item.observations ?? null,
        estimatedWeightKg: weight,
        actualWeightKg: item.actualWeightKg ?? null,
        pricePerKg,
        estimatedSubtotal,
        finalSubtotal:
          item.actualWeightKg == null
            ? null
            : roundCurrency(item.actualWeightKg * pricePerKg),
        prepared: false,
      });
    }

    if (!customer) {
      const [createdCustomer] = await tx
        .insert(customersTable)
        .values({
          name: input.customer.name,
          phone: input.customer.phone ?? null,
        })
        .returning();
      customer = createdCustomer;
    }
    if (!customer) return undefined;

    const estimatedTotal = roundCurrency(
      items.reduce((sum, item) => sum + item.estimatedSubtotal, 0),
    );
    const [createdOrder] = await tx
      .insert(ordersTable)
      .values({
        orderNumber: makeOrderNumber(),
        customerId: customer.id,
        serviceType: input.serviceType,
        deliveryAddress: input.deliveryAddress ?? null,
        paymentMethod: input.paymentMethod,
        paymentStatus: input.paymentStatus ?? "pending",
        scheduledAt: input.scheduledAt ?? null,
        notes: input.notes ?? null,
        estimatedTotal,
        demo: input.demo,
      })
      .returning();
    await tx.insert(orderItemsTable).values(
      items.map((item) => ({ ...item, orderId: createdOrder!.id })),
    );
    return createdOrder;
  });

  if (!order) {
    res.status(400).json({
      error: "Cliente ou produto não encontrado no catálogo ativo.",
    });
    return;
  }
  const result = await getOrderDetails(order.id);
  res.status(201).json(CreateOrderResponse.parse(result));
});

router.get("/orders/:id", async (req, res): Promise<void> => {
  const params = GetOrderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const result = await getOrderDetails(params.data.id);
  if (!result) {
    res.status(404).json({ error: "Pedido não encontrado." });
    return;
  }
  res.json(GetOrderResponse.parse(result));
});

router.patch("/orders/:id/status", async (req, res): Promise<void> => {
  const params = UpdateOrderStatusParams.safeParse(req.params);
  const body = UpdateOrderStatusBody.safeParse(req.body);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [updated] = await db
    .update(ordersTable)
    .set({ status: body.data.status, updatedAt: new Date() })
    .where(eq(ordersTable.id, params.data.id))
    .returning({ id: ordersTable.id });
  if (!updated) {
    res.status(404).json({ error: "Pedido não encontrado." });
    return;
  }
  const result = await getOrderDetails(updated.id);
  res.json(UpdateOrderStatusResponse.parse(result));
});

router.patch(
  "/orders/:id/items/:itemId/prepared",
  async (req, res): Promise<void> => {
    const params = UpdateItemPreparedParams.safeParse(req.params);
    const body = UpdateItemPreparedBody.safeParse(req.body);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    if (!body.success) {
      res.status(400).json({ error: body.error.message });
      return;
    }
    const item = await findItemForOrder(params.data.id, params.data.itemId);
    if (!item) {
      res.status(404).json({ error: "Item não encontrado neste pedido." });
      return;
    }
    await db
      .update(orderItemsTable)
      .set({ prepared: body.data.prepared })
      .where(eq(orderItemsTable.id, item.id));
    const result = await getOrderDetails(params.data.id);
    res.json(UpdateItemPreparedResponse.parse(result));
  },
);

router.patch(
  "/orders/:id/items/:itemId/weight",
  async (req, res): Promise<void> => {
    const params = UpdateItemWeightParams.safeParse(req.params);
    const body = UpdateItemWeightBody.safeParse(req.body);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    if (!body.success) {
      res.status(400).json({ error: body.error.message });
      return;
    }
    const updatedOrderId = await db.transaction(async (tx) => {
      const [item] = await tx
        .select()
        .from(orderItemsTable)
        .where(
          and(
            eq(orderItemsTable.orderId, params.data.id),
            eq(orderItemsTable.id, params.data.itemId),
          ),
        )
        .limit(1);
      if (!item) return undefined;

      const finalSubtotal = roundCurrency(
        body.data.actualWeightKg * item.pricePerKg,
      );
      await tx
        .update(orderItemsTable)
        .set({
          actualWeightKg: body.data.actualWeightKg,
          finalSubtotal,
        })
        .where(eq(orderItemsTable.id, item.id));
      const lines = await tx
        .select()
        .from(orderItemsTable)
        .where(eq(orderItemsTable.orderId, params.data.id));
      const [order] = await tx
        .select()
        .from(ordersTable)
        .where(eq(ordersTable.id, params.data.id))
        .limit(1);
      if (!order) return undefined;
      const finalTotal = roundCurrency(
        lines.reduce(
          (sum, line) => sum + (line.finalSubtotal ?? line.estimatedSubtotal),
          0,
        ),
      );
      await tx
        .update(ordersTable)
        .set({
          finalTotal,
          balanceAdjustment: roundCurrency(finalTotal - order.estimatedTotal),
          updatedAt: new Date(),
        })
        .where(eq(ordersTable.id, params.data.id));
      return params.data.id;
    });
    if (!updatedOrderId) {
      res.status(404).json({ error: "Item não encontrado neste pedido." });
      return;
    }
    const result = await getOrderDetails(updatedOrderId);
    res.json(UpdateItemWeightResponse.parse(result));
  },
);

router.get("/dashboard/summary", async (_req, res): Promise<void> => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const orders = await db
    .select()
    .from(ordersTable)
    .orderBy(desc(ordersTable.createdAt));
  const summary = {
    new: orders.filter((order) => order.status === "new").length,
    preparing: orders.filter((order) => order.status === "preparing").length,
    ready: orders.filter((order) => order.status === "ready").length,
    completedToday: orders.filter(
      (order) => order.status === "completed" && order.updatedAt >= startOfDay,
    ).length,
    ordersToday: orders.filter((order) => order.createdAt >= startOfDay).length,
  };
  res.json({
    ...summary,
    estimatedSalesToday: roundCurrency(
      orders
        .filter(
          (order) =>
            order.status === "completed" && order.updatedAt >= startOfDay,
        )
        .reduce(
          (sum, order) => sum + (order.finalTotal ?? order.estimatedTotal),
          0,
        ),
    ),
  });
});

router.get("/customers", async (_req, res): Promise<void> => {
  const customers = await db
    .select()
    .from(customersTable)
    .orderBy(desc(customersTable.createdAt));
  res.json(ListCustomersResponse.parse(customers));
});

router.post("/customers", async (req, res): Promise<void> => {
  const parsed = CreateCustomerBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [customer] = await db
    .insert(customersTable)
    .values({ name: parsed.data.name, phone: parsed.data.phone ?? null })
    .returning();
  res.status(201).json(CreateCustomerResponse.parse(customer));
});

router.get("/catalog", async (_req, res): Promise<void> => {
  const products = await db
    .select()
    .from(catalogProductsTable)
    .where(eq(catalogProductsTable.active, true));
  res.json(ListCatalogResponse.parse(products));
});

export default router;
