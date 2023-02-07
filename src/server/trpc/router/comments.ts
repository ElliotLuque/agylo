import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'

export const commentsRouter = router({
	getCommentsFromTask: protectedProcedure
		.input(z.object({ taskKey: z.string(), page: z.number() }))
		.query(async ({ ctx, input }) => {
			const { prisma } = ctx

			const limit = 3

			const totalPages = await prisma.comment.count({
				where: {
					task: {
						taskKey: input.taskKey,
					},
				},
			})

			return {
				totalPages: Math.ceil(totalPages / limit),
				comments: await prisma.comment.findMany({
					take: limit,
					orderBy: {
						createdAt: 'desc',
					},
					skip: (input.page ?? 0) * limit,
					where: {
						task: {
							taskKey: input.taskKey,
						},
					},
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
					},
				}),
			}
		}),
	addCommentToTask: protectedProcedure
		.input(z.object({ taskKey: z.string(), body: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const { prisma } = ctx
			const { user } = ctx.session

			const userId = user?.id

			const addComment = prisma.comment.create({
				data: {
					task: {
						connect: {
							taskKey: input.taskKey,
						},
					},
					author: {
						connect: {
							id: userId,
						},
					},
					body: input.body,
				},
			})

			const increaseCommentCount = prisma.task.update({
				where: {
					taskKey: input.taskKey,
				},
				data: {
					commentCount: {
						increment: 1,
					},
				},
			})

			return await prisma.$transaction([addComment, increaseCommentCount])
		}),
	deleteComment: protectedProcedure
		.input(z.object({ commentId: z.number(), taskKey: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const { prisma } = ctx

			const deleteComment = prisma.comment.delete({
				where: {
					id: input.commentId,
				},
			})

			const decreaseCommentCount = prisma.task.updateMany({
				where: {
					taskKey: input.taskKey,
				},
				data: {
					commentCount: {
						decrement: 1,
					},
				},
			})

			return await prisma.$transaction([deleteComment, decreaseCommentCount])
		}),
})
