import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'

export const labelRouter = router({
	getAvailableLabels: protectedProcedure
		.input(
			z.object({
				projectId: z.number(),
				taskLabelIds: z.array(z.number()),
				filter: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const { prisma } = ctx
			return await prisma.label.findMany({
				where: {
					project: {
						id: input.projectId,
					},
					AND: {
						name: {
							contains: input.filter,
						},
						id: {
							notIn: input.taskLabelIds,
						},
					},
				},
				select: {
					id: true,
					name: true,
					color: true,
				},
			})
		}),
	newLabelToTask: protectedProcedure
		.input(
			z.object({
				projectId: z.number(),
				name: z.string(),
				colorId: z.number(),
				taskId: z.number(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { prisma } = ctx

			return await prisma.task.update({
				where: {
					id: input.taskId,
				},
				data: {
					labels: {
						create: {
							label: {
								create: {
									name: input.name,
									color: {
										connect: {
											id: input.colorId,
										},
									},
									project: {
										connect: {
											id: input.projectId,
										},
									},
								},
							},
						},
					},
				},
			})
		}),
	addLabelToTask: protectedProcedure
		.input(
			z.object({
				labelId: z.number(),
				taskId: z.number(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { prisma } = ctx

			return await prisma.task.update({
				where: {
					id: input.taskId,
				},
				data: {
					labels: {
						create: {
							labelId: input.labelId,
						},
					},
				},
			})
		}),
	removeLabelFromTask: protectedProcedure
		.input(
			z.object({
				labelId: z.number(),
				taskKey: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { prisma } = ctx

			const task = prisma.task.findUnique({
				where: {
					taskKey: input.taskKey,
				},
			})

			const removeLabelFromTask = prisma.task.update({
				where: {
					id: (await task)?.id,
				},
				data: {
					labels: {
						delete: {
							taskId_labelId: {
								taskId: (await task)?.id as number,
								labelId: input.labelId,
							},
						},
					},
				},
			})

			return await prisma.$transaction([task, removeLabelFromTask])
		}),
})
