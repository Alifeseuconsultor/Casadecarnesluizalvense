import { clerkClient, getAuth } from "@clerk/express";
import { count, desc, eq, sql } from "drizzle-orm";
import { Router, type IRouter } from "express";
import {
  GetCurrentAccessResponse,
  ListAccessUsersResponse,
  UpdateAccessUserRoleBody,
  UpdateAccessUserRoleParams,
  UpdateAccessUserRoleResponse,
} from "@workspace/api-zod";
import { db, userAccessTable, type UserRole } from "@workspace/db";
import { ensureUserRole, requireRoles } from "../middlewares/authorization";

const router: IRouter = Router();
const ROLE_ASSIGNMENT_LOCK_ID = 942761;

router.get("/auth/me", async (req, res): Promise<void> => {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: "Entre na sua conta para continuar." });
    return;
  }
  const role = await ensureUserRole(userId);
  res.json(GetCurrentAccessResponse.parse({ userId, role }));
});

router.get("/admin/access/users", requireRoles("admin"), async (_req, res): Promise<void> => {
  const roles = await db
    .select()
    .from(userAccessTable)
    .orderBy(desc(userAccessTable.createdAt))
    .limit(500);
  if (roles.length === 0) {
    res.json(ListAccessUsersResponse.parse([]));
    return;
  }

  const profiles = await clerkClient.users.getUserList({
    userId: roles.map((user) => user.clerkUserId),
    limit: roles.length,
  });
  const profileById = new Map(profiles.data.map((user) => [user.id, user]));
  const response = roles.map((user) => {
    const profile = profileById.get(user.clerkUserId);
    return {
      userId: user.clerkUserId,
      role: user.role,
      name: profile?.fullName ?? profile?.username ?? null,
      email:
        profile?.emailAddresses.find(
          (email) => email.id === profile.primaryEmailAddressId,
        )?.emailAddress ?? null,
      createdAt: user.createdAt.toISOString(),
    };
  });
  res.json(ListAccessUsersResponse.parse(response));
});

router.patch(
  "/admin/access/users/:userId/role",
  requireRoles("admin"),
  async (req, res): Promise<void> => {
    const params = UpdateAccessUserRoleParams.safeParse(req.params);
    const body = UpdateAccessUserRoleBody.safeParse(req.body);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    if (!body.success) {
      res.status(400).json({ error: body.error.message });
      return;
    }

    const updateResult = await db.transaction(async (tx) => {
      await tx.execute(sql`select pg_advisory_xact_lock(${ROLE_ASSIGNMENT_LOCK_ID})`);
      const [target] = await tx
        .select()
        .from(userAccessTable)
        .where(eq(userAccessTable.clerkUserId, params.data.userId))
        .limit(1);
      if (!target) return { kind: "not_found" as const };

      if (target.role === "admin" && body.data.role !== "admin") {
        const [adminCount] = await tx
          .select({ value: count() })
          .from(userAccessTable)
          .where(eq(userAccessTable.role, "admin"));
        if (Number(adminCount?.value ?? 0) <= 1) {
          return { kind: "last_admin" as const };
        }
      }

      const [updated] = await tx
        .update(userAccessTable)
        .set({ role: body.data.role })
        .where(eq(userAccessTable.clerkUserId, target.clerkUserId))
        .returning();
      return updated ? { kind: "updated" as const, user: updated } : { kind: "not_found" as const };
    });

    if (updateResult.kind === "not_found") {
      res.status(404).json({ error: "Conta não encontrada." });
      return;
    }
    if (updateResult.kind === "last_admin") {
      res.status(409).json({ error: "Não é possível remover o último administrador." });
      return;
    }

    const { user: updated } = updateResult;
    const profiles = await clerkClient.users.getUserList({
      userId: [updated.clerkUserId],
      limit: 1,
    });
    const profile = profiles.data[0];
    const email = profile?.emailAddresses.find(
      (address) => address.id === profile.primaryEmailAddressId,
    )?.emailAddress ?? null;
    res.json(
      UpdateAccessUserRoleResponse.parse({
        userId: updated.clerkUserId,
        role: updated.role as UserRole,
        name: profile?.fullName ?? profile?.username ?? null,
        email,
        createdAt: updated.createdAt.toISOString(),
      }),
    );
  },
);

export default router;
