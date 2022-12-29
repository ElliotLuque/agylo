import { router } from "../trpc";
import { projectRouter } from "./project";
import { columnRouter } from "./column";
import { iconRouter } from "./icon";

export const appRouter = router({
  project: projectRouter,
  colors: iconRouter,
  column: columnRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
