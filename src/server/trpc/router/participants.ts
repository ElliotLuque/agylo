import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'

export const participantsRouter = router({
  projectParticipants: protectedProcedure
    .input(
      z.object({
        projectId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx

      return await prisma.projectParticipants.findMany({
        where: {
          projectId: input.projectId,
        },
        select: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          roleId: true,
        },
      })
    }),
})
