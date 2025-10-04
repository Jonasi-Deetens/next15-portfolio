import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "@/lib/trpc";
import { db } from "@/lib/db";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const user = await db.user.findUnique({
    where: { id: ctx.session.user.id },
    select: { role: true },
  });

  if (!user || !["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Admin access required",
    });
  }

  return next({ ctx });
});

export const userRouter = router({
  getAll: protectedProcedure.query(async () => {
    return await db.user.findMany({
      include: {
        posts: true,
        _count: {
          select: {
            installedApps: true,
            activityLogs: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await db.user.findUnique({
        where: { id: input.id },
        include: {
          posts: true,
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await db.user.create({
        data: input,
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        email: z.string().email().optional(),
        name: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await db.user.update({
        where: { id },
        data,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await db.user.delete({
        where: { id: input.id },
      });
    }),

  getMe: protectedProcedure.query(async ({ ctx }) => {
    return await db.user.findUnique({
      where: { id: ctx.session.user.id },
      include: {
        posts: true,
        installedApps: {
          include: {
            app: true,
          },
        },
      },
    });
  }),

  // Admin-only procedures
  getAllWithDetails: adminProcedure.query(async () => {
    return await db.user.findMany({
      include: {
        posts: true,
        installedApps: {
          include: {
            app: true,
          },
        },
        _count: {
          select: {
            activityLogs: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  updateRole: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(["USER", "ADMIN", "SUPER_ADMIN"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Prevent self-demotion
      if (input.userId === ctx.session.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot change your own role",
        });
      }

      const user = await db.user.update({
        where: { id: input.userId },
        data: { role: input.role },
      });

      // Log activity
      await db.activityLog.create({
        data: {
          userId: ctx.session.user.id,
          action: "user.role_updated",
          entityType: "User",
          entityId: input.userId,
          metadata: {
            newRole: input.role,
          },
        },
      });

      return user;
    }),

  updateStatus: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Prevent self-suspension
      if (input.userId === ctx.session.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot change your own status",
        });
      }

      const user = await db.user.update({
        where: { id: input.userId },
        data: { status: input.status },
      });

      // Log activity
      await db.activityLog.create({
        data: {
          userId: ctx.session.user.id,
          action: "user.status_updated",
          entityType: "User",
          entityId: input.userId,
          metadata: {
            newStatus: input.status,
          },
        },
      });

      return user;
    }),

  updateUser: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        name: z.string().optional(),
        email: z.string().email().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { userId, ...data } = input;

      const user = await db.user.update({
        where: { id: userId },
        data,
      });

      // Log activity
      await db.activityLog.create({
        data: {
          userId: ctx.session.user.id,
          action: "user.updated",
          entityType: "User",
          entityId: userId,
          metadata: data,
        },
      });

      return user;
    }),

  deleteUser: adminProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Prevent self-deletion
      if (input.userId === ctx.session.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot delete your own account",
        });
      }

      const user = await db.user.delete({
        where: { id: input.userId },
      });

      // Log activity
      await db.activityLog.create({
        data: {
          userId: ctx.session.user.id,
          action: "user.deleted",
          entityType: "User",
          entityId: input.userId,
        },
      });

      return user;
    }),

  createUser: adminProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string(),
        password: z.string().min(6),
        role: z.enum(["USER", "ADMIN", "SUPER_ADMIN"]).default("USER"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const hashedPassword = await bcrypt.hash(input.password, 10);

      const user = await db.user.create({
        data: {
          email: input.email,
          name: input.name,
          password: hashedPassword,
          role: input.role,
        },
      });

      // Log activity
      await db.activityLog.create({
        data: {
          userId: ctx.session.user.id,
          action: "user.created",
          entityType: "User",
          entityId: user.id,
          metadata: {
            email: input.email,
            role: input.role,
          },
        },
      });

      return user;
    }),

  getStats: adminProcedure.query(async () => {
    const [total, active, admins, suspended] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { status: "ACTIVE" } }),
      db.user.count({ where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } } }),
      db.user.count({ where: { status: "SUSPENDED" } }),
    ]);

    return {
      total,
      active,
      admins,
      suspended,
    };
  }),
});
