import { pgTable, integer, jsonb, text } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const storeSettingsTable = pgTable("store_settings", {
  id: integer("id").primaryKey().default(1),
  weeklyHours: jsonb("weekly_hours")
    .$type<Record<string, { open: string; close: string; closed: boolean }>>()
    .notNull()
    .default({
      monday: { open: "08:00", close: "18:00", closed: false },
      tuesday: { open: "08:00", close: "18:00", closed: false },
      wednesday: { open: "08:00", close: "18:00", closed: false },
      thursday: { open: "08:00", close: "18:00", closed: false },
      friday: { open: "08:00", close: "18:00", closed: false },
      saturday: { open: "08:00", close: "14:00", closed: false },
      sunday: { open: "08:00", close: "12:00", closed: true },
    }),
  pickupSlots: jsonb("pickup_slots")
    .$type<Array<{ time: string; limit: number }>>()
    .notNull()
    .default([{ time: "10:00", limit: 8 }, { time: "12:00", limit: 8 }, { time: "16:00", limit: 8 }]),
  serviceTypes: jsonb("service_types")
    .$type<string[]>()
    .notNull()
    .default(["pickup", "delivery"]),
  preparationMinutes: integer("preparation_minutes").notNull().default(60),
  paymentMethods: jsonb("payment_methods")
    .$type<string[]>()
    .notNull()
    .default(["pix", "card", "cash", "on_delivery"]),
  whatsapp: text("whatsapp"),
});

export const storeSettingsSchema = z.object({
  weeklyHours: z.record(
    z.string(),
    z.object({ open: z.string(), close: z.string(), closed: z.boolean() }),
  ),
  pickupSlots: z.array(z.object({ time: z.string(), limit: z.number().int().min(1) })),
  serviceTypes: z.array(z.enum(["pickup", "delivery"])).min(1),
  preparationMinutes: z.number().int().min(0),
  paymentMethods: z.array(z.enum(["pix", "card", "cash", "on_delivery"])).min(1),
  whatsapp: z.string().nullable(),
});

export type StoreSettings = typeof storeSettingsTable.$inferSelect;
