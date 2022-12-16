import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const columnRouter = router({
  createColumn: protectedProcedure
    .input(
      z.object({
        name: z.string().min(5),
        boardId: z.number(),
        index: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;

      return await prisma.column.create({
        data: {
          name: input.name,
          index: input.index,
          board: {
            connect: { id: input.boardId },
          },
        },
      });
    }),
  renameColumn: protectedProcedure
    .input(
      z.object({
        columnId: z.number(),
        name: z.string().min(5),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;

      return await prisma.column.update({
        where: {
          id: input.columnId,
        },
        data: {
          name: input.name,
        },
      });
    }),
  reorderColumn: protectedProcedure
    .input(
      z.object({
        sourceColumnId: z.number(),
        sourceIndex: z.number(),
        destinationIndex: z.number(),
        boardId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;

      return await prisma.$transaction(async (tx) => {
         const sourceColumn = await tx.column.findUnique({
            where: {
                id: input.sourceColumnId,
            }
         })

         const destinationColumn = await tx.column.findFirst({
            where: {
                boardId: input.boardId,
                index: input.destinationIndex
            }
         })

         if (sourceColumn && destinationColumn) {
            await tx.column.update({
                where: {
                    id: sourceColumn.id
                },
                data: {
                    index: destinationColumn.index
                }
            })

            await tx.column.update({
                where: {
                    id: destinationColumn.id
                },
                data: {
                    index: sourceColumn.index
                }
            })
         }
      })

      
    }),
  deleteColumn: protectedProcedure
    .input(
      z.object({
        columnId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;

      return await prisma.column.delete({
        where: {
          id: input.columnId,
        },
      });
    }),
});
