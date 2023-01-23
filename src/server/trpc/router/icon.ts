import { protectedProcedure, router } from '../trpc'

export const iconRouter = router({
	list: protectedProcedure.query(async ({ ctx }) => {
		const { prisma } = ctx
		return await prisma.icon.findMany()
	}),
})
