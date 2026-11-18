import { getAuth } from "@clerk/express";
import { sql } from "drizzle-orm";
import type { RequestHandler } from "express";
import { db, userAccessTable, type UserRole } from "@workspace/db";
import { eq } from "drizzle-orm";

const ROLE_ASSIGNMENT_LOCK_ID = 942761;

export async function ensureUserRole(userId: string): Promise<UserRole> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(${ROLE_ASSIGNMENT_LOCK_ID})`);

    const [existing] = await tx
      .select({ role: userAccessTable.role })
      .from(userAccessTable)
      .where(eq(userAccessTable.clerkUserId, userId))
      .limit(1);
    if (existing) return existing.role;

    const [firstAccount] = await tx
      .select({ clerkUserId: userAccessTable.clerkUserId })
      .from(userAccessTable)
      .limit(1);
    const role: UserRole = firstAccount ? "customer" : "admin";
    const [created] = await tx
      .insert(userAccessTable)
      .values({ clerkUserId: userId, role })
      .onConflictDoNothing({ target: userAccessTable.clerkUserId })
      .returning({ role: userAccessTable.role });

    if (created) return created.role;
    const [winner] = await tx
      .select({ role: userAccessTable.role })
      .from(userAccessTable)
      .where(eq(userAccessTable.clerkUserId, userId))
      .limit(1);
    if (!winner) throw new Error("Não foi possível registrar o papel da conta.");
    return winner.role;
  });
}

export function requireRoles(...allowedRoles: UserRole[]): RequestHandler {
  return async (req, res, next): Promise<void> => {
    const { userId } = getAuth(req);
    if (!userId) {
      res.status(401).json({ error: "Entre na sua conta para continuar." });
      return;
    }

    try {
      const role = await ensureUserRole(userId);
      if (!allowedRoles.includes(role)) {
        res.status(403).json({ error: "Sua conta não tem acesso a esta área." });
        return;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}
