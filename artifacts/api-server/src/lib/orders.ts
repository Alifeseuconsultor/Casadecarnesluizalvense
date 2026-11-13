import { randomUUID } from "node:crypto";
import { and, asc, desc, eq } from "drizzle-orm";
import {
  catalogProductsTable,
  customersTable,
  db,
  orderItemsTable,
  ordersTable,
} from "@workspace/db";
import type { OrderItemInput } from "@workspace/api-zod";

function roundMoney(value: number): number {
  const sign = Math.sign(value);
  return (sign * Math.round((Math.abs(value) + 0.00000001) * 100)) / 100;
}

export function estimateItemWeight(
  item: Pick<OrderItemInput, "quantity" | "unit" | "estimatedWeightKg">,
): number | null {
  if (item.estimatedWeightKg != null) {
    return item.estimatedWeightKg;
  }
  if (item.unit === "kg") return item.quantity;
  if (item.unit === "g") return item.quantity / 1000;
  return null;
}

export function makeOrderNumber(): string {
  return `PED-${Date.now().toString(36).toUpperCase()}-${randomUUID().slice(0, 4).toUpperCase()}`;
}

export async function getOrderDetails(orderId: number) {
  const [order] = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.id, orderId))
    .limit(1);
  if (!order) return undefined;

  const [customer] = await db
    .select()
    .from(customersTable)
    .where(eq(customersTable.id, order.customerId))
    .limit(1);
  const items = await db
    .select()
    .from(orderItemsTable)
    .where(eq(orderItemsTable.orderId, orderId))
    .orderBy(asc(orderItemsTable.id));

  if (!customer) return undefined;
  return { ...order, customer, items };
}

export async function getAllOrderDetails() {
  const orders = await db
    .select()
    .from(ordersTable)
    .orderBy(desc(ordersTable.createdAt), desc(ordersTable.id));
  const customers = await db.select().from(customersTable);
  const allItems = await db
    .select()
    .from(orderItemsTable)
    .orderBy(asc(orderItemsTable.id));
  const customersById = new Map(customers.map((customer) => [customer.id, customer]));
  const itemsByOrder = new Map<number, typeof allItems>();

  for (const item of allItems) {
    const rows = itemsByOrder.get(item.orderId) ?? [];
    rows.push(item);
    itemsByOrder.set(item.orderId, rows);
  }

  return orders.flatMap((order) => {
    const customer = customersById.get(order.customerId);
    return customer
      ? [{ ...order, customer, items: itemsByOrder.get(order.id) ?? [] }]
      : [];
  });
}

export async function seedDemoData(): Promise<void> {
  if (process.env.NODE_ENV !== "development") return;

  const [existingOrder] = await db.select({ id: ordersTable.id }).from(ordersTable).limit(1);
  if (existingOrder) return;

  await db.transaction(async (tx) => {
    const existingProducts = await tx
      .select()
      .from(catalogProductsTable)
      .where(eq(catalogProductsTable.active, true))
      .orderBy(asc(catalogProductsTable.id))
      .limit(3);
    const products =
      existingProducts.length > 0
        ? existingProducts
        : await tx
            .insert(catalogProductsTable)
            .values([
              {
                name: "Picanha",
                category: "Bovinos",
                description: "Peça selecionada para churrasco.",
                pricePerKg: 74.9,
                active: true,
                demo: true,
              },
              {
                name: "Fraldinha",
                category: "Bovinos",
                description: "Corte macio, ótimo na grelha.",
                pricePerKg: 48.9,
                active: true,
                demo: true,
              },
              {
                name: "Costela suína",
                category: "Suínos",
                description: "Porção para assar lentamente.",
                pricePerKg: 32.9,
                active: true,
                demo: true,
              },
            ])
            .returning();

    const customers = await tx
      .insert(customersTable)
      .values(
        [
          "Cliente demonstração — balcão",
          "Cliente demonstração — preparo",
          "Cliente demonstração — retirada",
          "Cliente demonstração — concluído",
        ].map((name) => ({ name, phone: null })),
      )
      .returning();

    const examples = [
      {
        status: "new",
        serviceType: "pickup",
        paymentMethod: "pix",
        customer: customers[0]!,
        product: products[0]!,
        quantity: 1.2,
        cutPreference: "Bifes para churrasco",
        thickness: "3 cm",
        fatTrim: "Manter a capa de gordura",
        notes: "Pedido de demonstração — confirmar horário no balcão.",
      },
      {
        status: "preparing",
        serviceType: "delivery",
        paymentMethod: "on_delivery",
        customer: customers[1]!,
        product: products[1]!,
        quantity: 0.9,
        cutPreference: "Peça inteira",
        thickness: "Não se aplica",
        fatTrim: "Limpar excesso, manter uma camada fina",
        notes: "Pedido de demonstração — separar embalagem térmica.",
      },
      {
        status: "ready",
        serviceType: "pickup",
        paymentMethod: "card",
        customer: customers[2]!,
        product: products[2]!,
        quantity: 1.5,
        cutPreference: "Costelas individuais",
        thickness: "Entre os ossos",
        fatTrim: "Manter",
        notes: "Pedido de demonstração — aguardando retirada.",
      },
      {
        status: "completed",
        serviceType: "pickup",
        paymentMethod: "cash",
        customer: customers[3]!,
        product: products[1]!,
        quantity: 0.75,
        cutPreference: "Tiras para panela",
        thickness: "2 cm",
        fatTrim: "Retirar gordura aparente",
        notes: "Pedido de demonstração concluído.",
      },
    ] as const;

    for (const [index, example] of examples.entries()) {
      const estimatedSubtotal = roundMoney(
        example.quantity * example.product.pricePerKg,
      );
      const actualWeightKg =
        example.status === "completed" ? example.quantity - 0.05 : null;
      const finalSubtotal =
        actualWeightKg == null
          ? null
          : roundMoney(actualWeightKg * example.product.pricePerKg);
      const [order] = await tx
        .insert(ordersTable)
        .values({
          orderNumber: `PED-DEMO-0${index + 1}`,
          customerId: example.customer.id,
          status: example.status,
          serviceType: example.serviceType,
          deliveryAddress:
            example.serviceType === "delivery"
              ? "Endereço de demonstração — sem entrega real"
              : null,
          paymentMethod: example.paymentMethod,
          paymentStatus: example.status === "completed" ? "paid" : "pending",
          notes: example.notes,
          estimatedTotal: estimatedSubtotal,
          finalTotal: finalSubtotal,
          balanceAdjustment:
            finalSubtotal == null
              ? null
              : roundMoney(finalSubtotal - estimatedSubtotal),
          demo: true,
        })
        .returning();
      await tx.insert(orderItemsTable).values({
        orderId: order!.id,
        productId: example.product.id,
        productName: example.product.name,
        quantity: example.quantity,
        unit: "kg",
        cutPreference: example.cutPreference,
        thickness: example.thickness,
        fatTrim: example.fatTrim,
        observations: "Item de demonstração para testar a conferência.",
        estimatedWeightKg: example.quantity,
        actualWeightKg,
        pricePerKg: example.product.pricePerKg,
        estimatedSubtotal,
        finalSubtotal,
        prepared: example.status === "ready" || example.status === "completed",
      });
    }
  });
}

export async function findItemForOrder(orderId: number, itemId: number) {
  const [item] = await db
    .select()
    .from(orderItemsTable)
    .where(and(eq(orderItemsTable.orderId, orderId), eq(orderItemsTable.id, itemId)))
    .limit(1);
  return item;
}

export function roundCurrency(value: number): number {
  return roundMoney(value);
}
