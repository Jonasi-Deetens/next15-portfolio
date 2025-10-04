import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "@/lib/trpc";
import { db } from "@/lib/db";

export const postRouter = router({
  getAll: publicProcedure.query(async () => {
    return await db.post.findMany({
      include: {
        author: true,
      },
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await db.post.findUnique({
        where: { id: input.id },
        include: {
          author: true,
        },
      });
    }),

  getByAuthor: publicProcedure
    .input(z.object({ authorId: z.string() }))
    .query(async ({ input }) => {
      return await db.post.findMany({
        where: { authorId: input.authorId },
        include: {
          author: true,
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string().optional(),
        published: z.boolean().default(false),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await db.post.create({
        data: {
          ...input,
          authorId: ctx.session.user.id,
        },
        include: {
          author: true,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        content: z.string().optional(),
        published: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;

      // Check if user owns the post
      const post = await db.post.findUnique({
        where: { id },
        select: { authorId: true },
      });

      if (!post || post.authorId !== ctx.session.user.id) {
        throw new Error("You can only update your own posts");
      }

      return await db.post.update({
        where: { id },
        data,
        include: {
          author: true,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Check if user owns the post
      const post = await db.post.findUnique({
        where: { id: input.id },
        select: { authorId: true },
      });

      if (!post || post.authorId !== ctx.session.user.id) {
        throw new Error("You can only delete your own posts");
      }

      return await db.post.delete({
        where: { id: input.id },
      });
    }),

  getMyPosts: protectedProcedure.query(async ({ ctx }) => {
    return await db.post.findMany({
      where: { authorId: ctx.session.user.id },
      include: {
        author: true,
      },
    });
  }),
});
