import { router } from "../trpc";
import { authRouter } from "./auth";
import { boardRouter } from "./board";

export const appRouter = router({
  auth: authRouter,
  board: boardRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
