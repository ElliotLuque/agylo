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
})
