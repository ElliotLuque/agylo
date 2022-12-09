import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const boardRouter = router({
  createBoard: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation( async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { id: userId } = ctx.session.user

      const board = prisma.board.create({
        data: {
          name: input.name,
          description: input.description,
          icon: {
            create: {
              url: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
            },
          },
        },
      });

      const boardParticipant = prisma.boardParticipants.create({
        data: {
            role: {
                create: {
                    name: "admin"
                }
            },
            board: {
                connect: {
                  id: (await board).id
                }
            },
            user: {
                connect: { id: userId }
            }
        }
      })

      return await prisma.$transaction([board, boardParticipant]); 
    }),
});
