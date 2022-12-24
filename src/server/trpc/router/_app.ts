import { router } from "../trpc";
import { authRouter } from "./auth";
import { projectRouter } from "./project";
import { columnRouter } from "./column";

export const appRouter = router({
  auth: authRouter,
  project: projectRouter,
  column: columnRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
