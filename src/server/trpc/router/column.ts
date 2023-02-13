import { router, protectedProcedure } from '../trpc'
import { z } from 'zod'

export const columnRouter = router({
	createColumn: protectedProcedure
		.input(
			z.object({
				name: z.string().min(1),
				projectId: z.number(),
				index: z.number(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { prisma } = ctx

			return await prisma.column.create({
				data: {
					name: input.name,
					index: input.index,
					project: {
						connect: { id: input.projectId },
					},
				},
			})
		}),
	renameColumn: protectedProcedure
		.input(
			z.object({
				columnId: z.number(),
				name: z.string().min(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { prisma } = ctx

			return await prisma.column.update({
				where: {
					id: input.columnId,
				},
				data: {
					name: input.name,
				},
			})
		}),
	orderColumn: protectedProcedure
		.input(
			z.object({
				sourceColumnId: z.number(),
				sourceIndex: z.number(),
				destinationColumnId: z.number(),
				destinationIndex: z.number(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { prisma } = ctx

			const updateColumns = prisma.column.updateMany({
				where: {
					index: {
						gte:
							input.destinationIndex > input.sourceIndex
								? input.sourceIndex
								: input.destinationIndex,
						lte:
							input.destinationIndex > input.sourceIndex
								? input.destinationIndex
								: input.sourceIndex,
					},
					AND: {
						id: {
							not: input.sourceColumnId,
						},
					},
				},
				data: {
					index: {
						increment: input.destinationIndex > input.sourceIndex ? -1 : 1,
					},
				},
			})

			const updateSourceColumn = prisma.column.update({
				where: {
					id: input.sourceColumnId,
				},
				data: {
					index: input.destinationIndex,
				},
			})

			return await prisma.$transaction([updateColumns, updateSourceColumn])
		}),
	deleteColumn: protectedProcedure
		.input(
			z.object({
				columnId: z.number(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { prisma } = ctx

			return await prisma.column.delete({
				where: {
					id: input.columnId,
				},
			})
		}),
	deleteColumnAndTasks: protectedProcedure
		.input(
			z.object({
				columnId: z.number(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { prisma } = ctx

			const deleteTasks = prisma.task.deleteMany({
				where: {
					columnId: input.columnId,
				},
			})

			const deleteColumn = prisma.column.delete({
				where: {
					id: input.columnId,
				},
			})

			return await prisma.$transaction([deleteTasks, deleteColumn])
		}),
	deleteColumnAndReorderTasks: protectedProcedure
		.input(
			z.object({
				columnId: z.number(),
				newColumnId: z.number(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { prisma } = ctx

			const newColumnLength = await prisma.task.count({
				where: {
					columnId: input.newColumnId,
				},
			})

			const updateTasksInOldColumn = prisma.task.updateMany({
				where: {
					columnId: input.columnId,
				},
				data: {
					columnId: input.newColumnId,
					index: {
						increment: newColumnLength,
					},
				},
			})

			const deleteColumn = prisma.column.delete({
				where: {
					id: input.columnId,
				},
			})

			return await prisma.$transaction([updateTasksInOldColumn, deleteColumn])
		}),
})
