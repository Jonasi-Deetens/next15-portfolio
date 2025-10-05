import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "@/lib/trpc";
import { db } from "@/lib/db";
import { TRPCError } from "@trpc/server";

export const projectRouter = router({
  // Get all projects for the current user
  getMyProjects: protectedProcedure.query(async ({ ctx }) => {
    return await db.project.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { createdAt: "desc" },
    });
  }),

  // Get a specific project by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const project = await db.project.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      return project;
    }),

  // Create a new project
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, "Title is required"),
        description: z.string().min(1, "Description is required"),
        link: z.string().url().optional().or(z.literal("")),
        image: z.string().url().optional().or(z.literal("")),
        tags: z.array(z.string()).default([]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const project = await db.project.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
          link: input.link || null,
          image: input.image || null,
        },
      });

      // Log activity
      await db.activityLog.create({
        data: {
          userId: ctx.session.user.id,
          action: "project.created",
          entityType: "Project",
          entityId: project.id,
          metadata: {
            title: project.title,
          } as any,
        },
      });

      return project;
    }),

  // Update a project
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1, "Title is required").optional(),
        description: z.string().min(1, "Description is required").optional(),
        link: z.string().url().optional().or(z.literal("")),
        image: z.string().url().optional().or(z.literal("")),
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...updateData } = input;

      // Check if project exists and belongs to user
      const existingProject = await db.project.findFirst({
        where: {
          id,
          userId: ctx.session.user.id,
        },
      });

      if (!existingProject) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      const project = await db.project.update({
        where: { id },
        data: {
          ...updateData,
          link: updateData.link || null,
          image: updateData.image || null,
        },
      });

      // Log activity
      await db.activityLog.create({
        data: {
          userId: ctx.session.user.id,
          action: "project.updated",
          entityType: "Project",
          entityId: project.id,
          metadata: {
            title: project.title,
          } as any,
        },
      });

      return project;
    }),

  // Delete a project
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Check if project exists and belongs to user
      const existingProject = await db.project.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });

      if (!existingProject) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      await db.project.delete({
        where: { id: input.id },
      });

      // Log activity
      await db.activityLog.create({
        data: {
          userId: ctx.session.user.id,
          action: "project.deleted",
          entityType: "Project",
          entityId: input.id,
          metadata: {
            title: existingProject.title,
          } as any,
        },
      });

      return { success: true };
    }),
});
