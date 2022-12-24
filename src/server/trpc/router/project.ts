import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const projectRouter = router({
  createProject: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        url: z.string().regex(/^[a-zA-Z0-9-]+$/),
        description: z.string().max(200).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { id: userId } = ctx.session.user;

      return await prisma.projectParticipants.create({
        data: {
          project: {
            create: {
              name: input.name,
              url: input.url,
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
  updateProject: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;

      return await prisma.project.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
        },
      });
    }),
  deleteProject: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;

      return await prisma.project.delete({
        where: {
          id: input.id,
        },
      });
    }),
  listUserProject: protectedProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;
    const { id: userId } = ctx.session.user;

    return await prisma.projectParticipants.findMany({
      where: {
        userId,
      },
      include: {
        project: true,
      },
    });
  }),
  getProject: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;

      return await prisma.project.findUnique({
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
  getProjectBasicInfo: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;

      return await prisma.project.findUnique({
        where: {
          id: input.id,
        },
        include: {
          icon: true,
        },
      });
    }),
});
