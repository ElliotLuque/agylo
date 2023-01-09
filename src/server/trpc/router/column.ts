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
})
