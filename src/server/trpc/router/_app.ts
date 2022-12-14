import { router } from "../trpc";
import { authRouter } from "./auth";
import { boardRouter } from "./board";
import { columnRouter } from "./column";

export const appRouter = router({
  auth: authRouter,
  board: boardRouter,
  column: columnRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
