import { protectedProcedure, router } from '../trpc'
import { z } from 'zod'

export const attachmentRouter = router({
	getTaskAttachments: protectedProcedure
		.input(
			z.object({
				taskKey: z.string(),
				page: z.number(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const { prisma } = ctx

			const limit = 3

			const totalPages = await prisma.attachment.count({
				where: {
					task: {
						taskKey: input.taskKey,
					},
				},
			})

			return {
				totalPages: Math.ceil(totalPages / limit),
				attachments: await prisma.attachment.findMany({
					take: limit,
					skip: (input.page ?? 0) * limit,
					where: {
						task: {
							taskKey: input.taskKey,
						},
					},
					select: {
						id: true,
						filename: true,
						url: true,
					},
				}),
			}
		}),
})
