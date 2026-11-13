import { createInsertSchema } from "drizzle-zod";
import {
  boolean,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { z } from "zod/v4";

// This is the single catalog source for the operational panel and a future customer app.
export const catalogProductsTable = pgTable("catalog_products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  pricePerKg: numeric("price_per_kg", { precision: 10, scale: 2, mode: "number" })
    .notNull()
    .default(0),
  saleUnit: text("sale_unit").notNull().default("kg"),
  active: boolean("active").notNull().default(true),
  status: text("status").notNull().default("active"),
  productType: text("product_type").notNull().default("product"),
  stockQuantity: numeric("stock_quantity", {
    precision: 10,
    scale: 3,
    mode: "number",
  }),
  imageUrl: text("image_url"),
  promoPrice: numeric("promo_price", {
    precision: 10,
    scale: 2,
    mode: "number",
  }),
  promoLabel: text("promo_label"),
  promoStartsAt: timestamp("promo_starts_at", { withTimezone: true }),
  promoEndsAt: timestamp("promo_ends_at", { withTimezone: true }),
  demo: boolean("demo").notNull().default(false),
});

export const insertCatalogProductSchema = createInsertSchema(
  catalogProductsTable,
).omit({ id: true });

export type InsertCatalogProduct = z.infer<typeof insertCatalogProductSchema>;
export type CatalogProduct = typeof catalogProductsTable.$inferSelect;
