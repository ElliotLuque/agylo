import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'

export const taskRouter = router({
	getTaskInfo: protectedProcedure
		.input(
			z.object({
				key: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const { prisma } = ctx

			return await prisma.task.findUnique({
				where: {
					taskKey: input.key,
				},
				select: {
					id: true,
					title: true,
					description: true,
					taskKey: true,
					priorityId: true,
					createdAt: true,
					commentCount: true,
					attachmentCount: true,
					assignee: {
						select: {
							id: true,
							name: true,
							image: true,
						},
					},
					author: {
						select: {
							id: true,
							name: true,
							image: true,
						},
					},
					comments: {
						take: 3,
						select: {
							id: true,
							body: true,
							createdAt: true,
							author: {
								select: {
									id: true,
									name: true,
									image: true,
								},
							},
							attachments: { select: { url: true, filename: true } },
						},
					},
					column: {
						select: {
							id: true,
							name: true,
						},
					},
					attachments: {
						take: 3,
						select: {
							url: true,
							filename: true,
						},
					},
					labels: {
						select: {
							label: {
								select: {
									id: true,
									name: true,
									color: true,
								},
							},
						},
					},
				},
			})
		}),
	createTask: protectedProcedure
		.input(
			z.object({
				title: z.string().max(100),
				columnId: z.number(),
				projectId: z.number(),
				index: z.number(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { prisma } = ctx
			const { id: userId } = ctx.session.user

			return await prisma.$transaction(async (tx) => {
				const project = await tx.project.update({
					where: {
						id: input.projectId,
					},
					data: {
						taskCount: {
							increment: 1,
						},
					},
				})

				if (project) {
					return await tx.task.create({
						include: {
							assignee: true,
							labels: true,
						},
						data: {
							index: input.index,
							title: input.title,
							taskKey: project.key + '-' + project.taskCount,
							column: {
								connect: { id: input.columnId },
							},
							author: {
								connect: { id: userId },
							},
						},
					})
				}
			})
		}),
	orderUpTask: protectedProcedure
		.input(
			z.object({
				columnId: z.number(),
				sourceTaskId: z.number(),
				sourceTaskIndex: z.number(),
				destinationTaskIndex: z.number(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { prisma } = ctx

			const updateTasks = prisma.task.updateMany({
				where: {
					columnId: input.columnId,
					index: {
						gt: input.sourceTaskIndex,
						lte: input.destinationTaskIndex,
					},
				},
				data: {
					index: {
						increment: 1,
					},
				},
			})

			const updateMovedTask = prisma.task.update({
				where: {
					id: input.sourceTaskId,
				},
				data: {
					index: input.destinationTaskIndex,
				},
			})

			return await prisma.$transaction([updateTasks, updateMovedTask])
		}),
	moveTaskToColumn: protectedProcedure
		.input(
			z.object({
				taskId: z.number(),
				newTaskIndex: z.number(),
				oldTaskIndex: z.number(),
				newColumnId: z.number(),
				oldColumnId: z.number(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { prisma } = ctx

			const updateOldColumnTasks = prisma.task.updateMany({
				where: {
					columnId: input.oldColumnId,
					index: {
						gt: input.oldTaskIndex,
					},
				},
				data: {
					index: {
						decrement: 1,
					},
				},
			})

			const updateNewColumnTasks = prisma.task.updateMany({
				where: {
					columnId: input.newColumnId,
					index: {
						gte: input.newTaskIndex,
					},
				},
				data: {
					index: {
						increment: 1,
					},
				},
			})

			const updateMovedTask = prisma.task.update({
				where: {
					id: input.taskId,
				},
				data: {
					column: {
						connect: {
							id: input.newColumnId,
						},
					},
					index: input.newTaskIndex,
				},
			})

			return prisma.$transaction([
				updateOldColumnTasks,
				updateNewColumnTasks,
				updateMovedTask,
			])
		}),
	updateTaskPriority: protectedProcedure
		.input(
			z.object({
				taskId: z.number(),
				priorityId: z.number().nullable(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { prisma } = ctx

			return await prisma.task.update({
				where: {
					id: input.taskId,
				},
				data: {
					priorityId: input.priorityId,
				},
			})
		}),
	renameTask: protectedProcedure
		.input(
			z.object({
				taskKey: z.string(),
				newTitle: z.string().max(80),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { prisma } = ctx

			return await prisma.task.update({
				where: {
					taskKey: input.taskKey,
				},
				data: {
					title: input.newTitle,
				},
			})
		}),
	assignTask: protectedProcedure
		.input(
			z.object({
				taskId: z.number(),
				assigneeId: z.string().nullable(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { prisma } = ctx

			if (input.assigneeId === null) {
				return await prisma.task.update({
					where: {
						id: input.taskId,
					},
					data: {
						assignee: {
							disconnect: true,
						},
					},
				})
			}

			return await prisma.task.update({
				where: {
					id: input.taskId,
				},
				data: {
					assignee: {
						connect: {
							id: input.assigneeId,
						},
					},
				},
			})
		}),
})
