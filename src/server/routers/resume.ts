import { z } from "zod";
import { router, protectedProcedure } from "@/lib/trpc";
import { db } from "@/lib/db";
import { TRPCError } from "@trpc/server";

export const resumeRouter = router({
  getMyResumes: protectedProcedure.query(async ({ ctx }) => {
    return await db.resume.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { updatedAt: "desc" },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const resume = await db.resume.findUnique({
        where: { id: input.id },
      });

      if (!resume || resume.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Resume not found" });
      }
      return resume;
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(100).optional(),
        elements: z.array(z.any()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const resume = await db.resume.create({
        data: {
          title: input.title || "My Resume",
          elements: input.elements || [],
          userId: ctx.session.user.id,
        },
      });

      await db.activityLog.create({
        data: {
          userId: ctx.session.user.id,
          action: "resume.created",
          entityType: "Resume",
          entityId: resume.id,
          metadata: { title: resume.title } as any,
        },
      });

      return resume;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).max(100).optional(),
        elements: z.array(z.any()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;
      const existingResume = await db.resume.findUnique({ where: { id } });

      if (!existingResume || existingResume.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Resume not found or unauthorized",
        });
      }

      const resume = await db.resume.update({
        where: { id },
        data,
      });

      await db.activityLog.create({
        data: {
          userId: ctx.session.user.id,
          action: "resume.updated",
          entityType: "Resume",
          entityId: resume.id,
          metadata: {
            title: resume.title,
            updatedFields: Object.keys(data),
          } as any,
        },
      });

      return resume;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const existingResume = await db.resume.findUnique({
        where: { id: input.id },
      });

      if (!existingResume || existingResume.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Resume not found or unauthorized",
        });
      }

      await db.resume.delete({
        where: { id: input.id },
      });

      await db.activityLog.create({
        data: {
          userId: ctx.session.user.id,
          action: "resume.deleted",
          entityType: "Resume",
          entityId: input.id,
          metadata: { title: existingResume.title } as any,
        },
      });

      return { success: true };
    }),
});
