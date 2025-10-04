import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "@/lib/trpc";
import { db } from "@/lib/db";

export const userRouter = router({
  getAll: publicProcedure.query(async () => {
    return await db.user.findMany({
      include: {
        posts: true,
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
      },
    });
  }),
});
