import { createInsertSchema } from "drizzle-zod";
import {
  boolean,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { z } from "zod/v4";
import { catalogProductsTable } from "./catalog";
import { customersTable } from "./customers";

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  customerId: integer("customer_id")
    .notNull()
    .references(() => customersTable.id),
  status: text("status").notNull().default("new"),
  serviceType: text("service_type").notNull(),
  deliveryAddress: text("delivery_address"),
  paymentMethod: text("payment_method").notNull(),
  paymentStatus: text("payment_status").notNull().default("pending"),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
  notes: text("notes"),
  estimatedTotal: numeric("estimated_total", {
    precision: 10,
    scale: 2,
    mode: "number",
  })
    .notNull()
    .default(0),
  finalTotal: numeric("final_total", {
    precision: 10,
    scale: 2,
    mode: "number",
  }),
  balanceAdjustment: numeric("balance_adjustment", {
    precision: 10,
    scale: 2,
    mode: "number",
  }),
  demo: boolean("demo").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const orderItemsTable = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => ordersTable.id, { onDelete: "cascade" }),
  productId: integer("product_id").references(() => catalogProductsTable.id),
  productName: text("product_name").notNull(),
  quantity: numeric("quantity", { precision: 10, scale: 3, mode: "number" })
    .notNull()
    .default(1),
  unit: text("unit").notNull().default("kg"),
  cutPreference: text("cut_preference"),
  thickness: text("thickness"),
  fatTrim: text("fat_trim"),
  observations: text("observations"),
  estimatedWeightKg: numeric("estimated_weight_kg", {
    precision: 10,
    scale: 3,
    mode: "number",
  }),
  actualWeightKg: numeric("actual_weight_kg", {
    precision: 10,
    scale: 3,
    mode: "number",
  }),
  pricePerKg: numeric("price_per_kg", {
    precision: 10,
    scale: 2,
    mode: "number",
  })
    .notNull()
    .default(0),
  estimatedSubtotal: numeric("estimated_subtotal", {
    precision: 10,
    scale: 2,
    mode: "number",
  })
    .notNull()
    .default(0),
  finalSubtotal: numeric("final_subtotal", {
    precision: 10,
    scale: 2,
    mode: "number",
  }),
  prepared: boolean("prepared").notNull().default(false),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertOrderItemSchema = createInsertSchema(orderItemsTable).omit({
  id: true,
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type Order = typeof ordersTable.$inferSelect;
export type OrderItem = typeof orderItemsTable.$inferSelect;
