import { createInsertSchema } from "drizzle-zod";
import { boolean, numeric, pgTable, serial, text } from "drizzle-orm/pg-core";
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
  active: boolean("active").notNull().default(true),
  demo: boolean("demo").notNull().default(false),
});

export const insertCatalogProductSchema = createInsertSchema(
  catalogProductsTable,
).omit({ id: true });

export type InsertCatalogProduct = z.infer<typeof insertCatalogProductSchema>;
export type CatalogProduct = typeof catalogProductsTable.$inferSelect;
