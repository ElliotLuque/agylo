import { router } from "../trpc";
import { projectRouter } from "./project";
import { columnRouter } from "./column";
import { iconRouter } from "./icon";
import { taskRouter } from "./task";

export const appRouter = router({
  project: projectRouter,
  colors: iconRouter,
  column: columnRouter,
  task: taskRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
