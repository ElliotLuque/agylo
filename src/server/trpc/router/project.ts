import { TRPCError } from "@trpc/server";
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
      const { id: userId } = ctx.session.user;

      const participant = await prisma.projectParticipants.findUnique({
        where: {
          projectId_userId: {
            projectId: input.id,
            userId,
          },
        },
      });

      if (!participant) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You dont have access to this project",
        });
      }

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
      const { id: userId } = ctx.session.user;

      const participant = await prisma.projectParticipants.findUnique({
        where: {
          projectId_userId: {
            projectId: input.id,
            userId,
          },
        },
      });

      if (!participant) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You dont have access to this project",
        });
      }

      return await prisma.project.delete({
        where: {
          id: input.id,
        },
      });
    }),
  listUserProjects: protectedProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;
    const { id: userId } = ctx.session.user;

    return await prisma.projectParticipants.findMany({
      where: {
        userId,
      },
      include: {
        project: {
          include: {
            icon: true,
          },
        },
      },
    });
  }),
  getProject: protectedProcedure
    .input(z.object({ url: z.string().regex(/^[a-zA-Z0-9-]+$/) }))
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { id: userId } = ctx.session.user;

      const projectId = await prisma.project.findUnique({
        where: {
          url: input.url,
        },
        select: {
          id: true,
        },
      });

      if (!projectId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      const participant = await prisma.projectParticipants.findUnique({
        where: {
          projectId_userId: {
            projectId: projectId?.id as number,
            userId,
          },
        },
      });

      if (!participant) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You dont have access to this project",
        });
      }

      return await prisma.project.findUnique({
        where: {
          url: input.url,
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
    .input(z.object({ url: z.string().regex(/^[a-zA-Z0-9-]+$/) }))
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;

      return await prisma.project.findUnique({
        where: {
          url: input.url,
        },
        include: {
          icon: true,
        },
      });
    }),
});
