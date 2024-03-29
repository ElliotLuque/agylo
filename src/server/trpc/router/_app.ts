import { router } from '../trpc'
import { projectRouter } from './project'
import { columnRouter } from './column'
import { iconRouter } from './icon'
import { taskRouter } from './task'
import { participantsRouter } from './participants'
import { labelRouter } from './label'
import { attachmentRouter } from './attachment'
import { commentsRouter } from './comments'

export const appRouter = router({
	project: projectRouter,
	colors: iconRouter,
	column: columnRouter,
	task: taskRouter,
	participants: participantsRouter,
	label: labelRouter,
	attachments: attachmentRouter,
	comments: commentsRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
