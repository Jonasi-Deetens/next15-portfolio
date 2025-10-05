import { router } from "@/lib/trpc";
import { userRouter } from "./routers/user";
import { postRouter } from "./routers/post";
import { projectRouter } from "./routers/project";

export const appRouter = router({
  user: userRouter,
  post: postRouter,
  project: projectRouter,
});

export type AppRouter = typeof appRouter;
