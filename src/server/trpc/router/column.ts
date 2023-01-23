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
				name: z.string().min(5),
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
	reorderColumn: protectedProcedure
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

			const sourceColumn = prisma.column.update({
				where: {
					id: input.sourceColumnId,
				},
				data: {
					index: input.destinationIndex,
				},
			})

			const destinationColumn = prisma.column.update({
				where: {
					id: input.destinationColumnId,
				},
				data: {
					index: input.sourceIndex,
				},
			})

			return await prisma.$transaction([sourceColumn, destinationColumn])
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

			const updateColumnInTasks = prisma.task.updateMany({
				where: {
					columnId: input.columnId,
				},
				data: {
					columnId: input.newColumnId,
				},
			})

			const deleteColumn = prisma.column.delete({
				where: {
					id: input.columnId,
				},
			})

			return await prisma.$transaction([updateColumnInTasks, deleteColumn])
		}),
})
