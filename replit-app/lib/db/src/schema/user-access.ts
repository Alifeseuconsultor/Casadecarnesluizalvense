import { sql } from "drizzle-orm";
import { check, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const userRoleSchema = z.enum(["admin", "operator", "customer"]);
export type UserRole = z.infer<typeof userRoleSchema>;

export const userAccessTable = pgTable(
  "user_access",
  {
    clerkUserId: text("clerk_user_id").primaryKey(),
    role: text("role").$type<UserRole>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    check(
      "user_access_role_check",
      sql`${table.role} in ('admin', 'operator', 'customer')`,
    ),
  ],
);

export const insertUserAccessSchema = createInsertSchema(userAccessTable).omit({
  createdAt: true,
  updatedAt: true,
});

export type InsertUserAccess = z.infer<typeof insertUserAccessSchema>;
export type UserAccess = typeof userAccessTable.$inferSelect;
