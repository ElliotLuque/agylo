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
        columnId: z.number(),
        index: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;

      return await prisma.column.update({
        where: {
          id: input.columnId,
        },
        data: {
          index: input.index,
        },
      });
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
