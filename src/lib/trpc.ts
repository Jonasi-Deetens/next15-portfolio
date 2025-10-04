import { initTRPC, TRPCError } from "@trpc/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    });
  }

  return next({
    ctx: {
      ...ctx,
      session: {
        ...session,
        user: session.user,
      },
    },
  });
});
