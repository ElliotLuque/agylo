import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const boardRouter = router({
  createBoard: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { id: userId } = ctx.session.user;

      return await prisma.boardParticipants.create({
        data: {
          board: {
            create: {
              name: input.name,
              description: input.description,
              icon: {
                connect: {
                  id: 1,
                },
              },
            },
          },
          user: {
            connect: { id: userId },
          },
          role: {
            connect: { id: 1 },
          },
        },
      });
    }),
  updateBoard: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;

      return await prisma.board.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
        },
      });
    }),
  deleteBoard: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;

      return await prisma.board.delete({
        where: {
          id: input.id,
        },
      });
    }),
  listUserBoards: protectedProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;
    const { id: userId } = ctx.session.user;

    return await prisma.boardParticipants.findMany({
      where: {
        userId,
      },
      include: {
        board: true,
      },
    });
  }),
  getBoard: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;

      return await prisma.board.findUnique({
        where: {
          id: input.id,
        },
        include: {
          labels: true,
          participants: true,
          icon: true,
          columns: {
            include: {
              tasks: true,
            },
            orderBy: {
              index: "asc",
            },
          },
        },
      });
    }),
  getBoardInfo: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;

      return await prisma.board.findUnique({
        where: {
          id: input.id,
        },
        include: {
          icon: true,
        },
      });
    }),
});
