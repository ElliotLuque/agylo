import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'
import dayjs from 'dayjs'

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
					dueDate: true,
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
					column: {
						select: {
							id: true,
							name: true,
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
							attachmentCount: 0,
							commentCount: 0,
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
	orderTask: protectedProcedure
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
						gte:
							input.destinationTaskIndex > input.sourceTaskIndex
								? input.sourceTaskIndex
								: input.destinationTaskIndex,
						lte:
							input.sourceTaskIndex > input.destinationTaskIndex
								? input.sourceTaskIndex
								: input.destinationTaskIndex,
					},
					AND: {
						id: {
							not: input.sourceTaskId,
						},
					},
				},
				data: {
					index: {
						increment:
							input.destinationTaskIndex > input.sourceTaskIndex ? -1 : 1,
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
	deleteTask: protectedProcedure
		.input(
			z.object({
				taskKey: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { prisma } = ctx

			return await prisma.task.delete({
				where: {
					taskKey: input.taskKey,
				},
			})
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
	renameTaskTitle: protectedProcedure
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
	renameTaskDescription: protectedProcedure
		.input(
			z.object({
				taskKey: z.string(),
				newDescription: z.string().max(1000),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { prisma } = ctx

			return await prisma.task.update({
				where: {
					taskKey: input.taskKey,
				},
				data: {
					description: input.newDescription,
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
	assignedTasksByPriority: protectedProcedure.query(async ({ ctx }) => {
		const { prisma } = ctx
		const { id: userId } = ctx.session.user

		const priorities = await prisma.task.groupBy({
			by: ['priorityId'],
			where: {
				assigneeId: userId,
			},
			_count: {
				id: true,
			},
		})

		const prioritiesChart = [
			{
				name: 'Low',
				value: priorities?.find((item) => item.priorityId === 1)?._count.id,
			},
			{
				name: 'Medium',
				value: priorities?.find((item) => item.priorityId === 2)?._count.id,
			},
			{
				name: 'High',
				value: priorities?.find((item) => item.priorityId === 3)?._count.id,
			},
		]

		return prioritiesChart
	}),
	totalTasksInMyProjects: protectedProcedure.query(async ({ ctx }) => {
		const { prisma } = ctx
		const { id: userId } = ctx.session.user

		const userProjects = await prisma.projectParticipants.findMany({
			where: {
				userId,
			},
			select: {
				projectId: true,
			},
		})

		return await prisma.task.count({
			where: {
				column: {
					projectId: {
						in: userProjects.map((project) => project.projectId),
					},
				},
			},
		})
	}),
	assignedTasksByProject: protectedProcedure.query(async ({ ctx }) => {
		const { prisma } = ctx
		const { id: userId } = ctx.session.user

		const tasks =
			(await prisma.$queryRaw`SELECT COUNT(DISTINCT agylo.Task.id) AS 'Tasks', agylo.Project.name FROM Task INNER JOIN agylo.\`Column\` ON agylo.Task.columnId = agylo.\`Column\`.id INNER JOIN agylo.ProjectParticipants ON agylo.\`Column\`.projectId = agylo.ProjectParticipants.projectId INNER JOIN agylo.Project ON agylo.ProjectParticipants.projectId = agylo.Project.id WHERE assigneeId = ${userId} GROUP BY agylo.Project.id`) as {
				name: string
				Tasks: bigint
			}[]

		const result = tasks.map((item) => {
			const obj = {
				name: item.name,
				Tasks: Number(item.Tasks),
			}
			return obj
		})

		return result
	}),
	lastWeekTasks: protectedProcedure.query(async ({ ctx }) => {
		const { prisma } = ctx
		const { id: userId } = ctx.session.user

		const weeklyTasks =
			(await prisma.$queryRaw`SELECT COUNT(id) AS 'Created tasks', DATE_FORMAT(createdAt, '%Y-%m-%d') AS 'Date' FROM agylo.Task WHERE createdAt BETWEEN DATE_SUB(NOW(), INTERVAL 1 WEEK) AND NOW() AND authorId = ${userId} GROUP BY DATE_FORMAT(createdAt, '%Y-%m-%d') ORDER BY DATE_FORMAT(createdAt, '%Y-%m-%d') ASC`) as {
				'Created tasks': bigint
				Date: Date
			}[]

		const result = weeklyTasks.map((item) => {
			const obj = {
				date: dayjs(item.Date).format('DD MMM'),
				'Created tasks': Number(item['Created tasks']),
			}
			return obj
		})

		return result
	}),
	myTasks: protectedProcedure.query(async ({ ctx }) => {
		const { prisma } = ctx
		const { id: userId } = ctx.session.user

		const tasks = await prisma.projectParticipants.findMany({
			where: {
				userId,
			},
			select: {
				project: {
					select: {
						url: true,
						iconId: true,
						name: true,
						description: true,
						columns: {
							select: {
								tasks: {
									select: {
										id: true,
										title: true,
										taskKey: true,
										createdAt: true,
										priorityId: true,
										attachmentCount: true,
										commentCount: true,
										labels: {
											select: {
												label: {
													select: {
														id: true,
														name: true,
														colorId: true,
													},
												},
											},
										},
									},
									where: {
										assigneeId: userId,
									},
								},
							},
						},
					},
				},
			},
		})

		return tasks
	}),
})
