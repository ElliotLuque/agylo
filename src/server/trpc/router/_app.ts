import { router } from '../trpc'
import { projectRouter } from './project'
import { columnRouter } from './column'
import { iconRouter } from './icon'
import { taskRouter } from './task'
import { participantsRouter } from './participants'

export const appRouter = router({
  project: projectRouter,
  colors: iconRouter,
  column: columnRouter,
  task: taskRouter,
  participants: participantsRouter
})

// export type definition of API
export type AppRouter = typeof appRouter
