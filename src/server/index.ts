import { router } from "@/lib/trpc";
import { userRouter } from "./routers/user";
import { postRouter } from "./routers/post";
import { projectRouter } from "./routers/project";
import { resumeRouter } from "./routers/resume";

export const appRouter = router({
  user: userRouter,
  post: postRouter,
  project: projectRouter,
  resume: resumeRouter,
});

export type AppRouter = typeof appRouter;
