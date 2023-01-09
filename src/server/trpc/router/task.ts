import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'

export const taskRouter = router({
  createTask: protectedProcedure
    .input(
      z.object({
        title: z
          .string()
          .regex(/^[^\s]*$/)
          .max(100),
        columnId: z.number(),
        projectId: z.number(),
        index: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx
      const { id: userId } = ctx.session.user

      return await prisma.$transaction(async (tx) => {
        const project = await tx.project.update({
          where: {
            id: input.projectId,
          },
          data: {
            taskCount: {
              increment: 1,
            },
          },
        })

        if (project) {
          return await tx.task.create({
            include: {
              assignee: true,
              labels: true,
            },
            data: {
              index: input.index,
              title: input.title,
              taskKey: project.key + '-' + project.taskCount,
              column: {
                connect: { id: input.columnId },
              },
              author: {
                connect: { id: userId },
              },
            },
          })
        }
      })
    }),
  reorderTask: protectedProcedure
    .input(
      z.object({
        sourceTaskId: z.number(),
        sourceTaskIndex: z.number(),
        destinationTaskId: z.number(),
        destinationTaskIndex: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx

      const sourceTask = prisma.task.update({
        where: {
          id: input.sourceTaskId,
        },
        data: {
          index: input.destinationTaskIndex,
        },
      })

      const destinationTask = prisma.task.update({
        where: {
          id: input.destinationTaskId,
        },
        data: {
          index: input.sourceTaskIndex,
        },
      })

      return await prisma.$transaction([sourceTask, destinationTask])
    }),
  moveTaskToColumn: protectedProcedure
    .input(
      z.object({
        taskId: z.number(),
        newTaskIndex: z.number(),
        oldTaskIndex: z.number(),
        newColumnId: z.number(),
        oldColumnId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx

      const updateOldColumnTasks = prisma.task.updateMany({
        where: {
          columnId: input.oldColumnId,
          index: {
            gt: input.oldTaskIndex,
          },
        },
        data: {
          index: {
            decrement: 1,
          },
        },
      })

      const updateNewColumnTasks = prisma.task.updateMany({
        where: {
          columnId: input.newColumnId,
          index: {
            gte: input.newTaskIndex,
          },
        },
        data: {
          index: {
            increment: 1,
          },
        },
      })

      const updateMovedTask = prisma.task.update({
        where: {
          id: input.taskId,
        },
        data: {
          column: {
            connect: {
              id: input.newColumnId,
            },
          },
          index: input.newTaskIndex,
        },
      })

      return prisma.$transaction([
        updateOldColumnTasks,
        updateNewColumnTasks,
        updateMovedTask,
      ])
    }),
})
