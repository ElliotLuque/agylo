import { TRPCError } from '@trpc/server'
import { router, protectedProcedure } from '../trpc'
import { z } from 'zod'
import { Prisma } from '@prisma/client'

export interface IActivityItem {
	taskKey: string
	iconId: number
	activityUrl: string
	title: string
	createdAt: Date
	author: {
		id: string
		name: string
		image: string
	}
	attachments?: {
		filename: string
		filesize: number
	}
	comments?: {
		body: string
	}
}

export const projectRouter = router({
	createProject: protectedProcedure
		.input(
			z.object({
				iconId: z.number(),
				name: z.string(),
				url: z.string().regex(/^[a-zA-Z0-9-]+$/),
				description: z.string().max(200).optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { prisma } = ctx
			const { id: userId } = ctx.session.user

			return await prisma.projectParticipants.create({
				data: {
					project: {
						create: {
							name: input.name,
							url: input.url,
							key: input.name.substring(0, 3).toUpperCase(),
							description: input.description,
							icon: {
								connect: {
									id: input.iconId,
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
			})
		}),
	updateProject: protectedProcedure
		.input(
			z.object({
				id: z.number(),
				name: z.string(),
				url: z.string().regex(/^[a-zA-Z0-9-]+$/),
				description: z.string().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { prisma } = ctx
			const { id: userId } = ctx.session.user

			const participant = await prisma.projectParticipants.findUnique({
				where: {
					projectId_userId: {
						projectId: input.id,
						userId,
					},
				},
			})

			if (!participant) {
				throw new TRPCError({
					code: 'FORBIDDEN',
					message: 'You dont have access to this project',
				})
			}

			try {
				return await prisma.project.update({
					where: {
						id: input.id,
					},
					data: {
						name: input.name,
						url: input.url,
						description: input.description,
					},
				})
			} catch (error) {
				if (error instanceof Prisma.PrismaClientKnownRequestError) {
					if (error.code === 'P2002') {
						throw new TRPCError({
							code: 'CONFLICT',
							message: 'Project url already exists!',
						})
					}
				}
			}
		}),
	updateProjectIcon: protectedProcedure
		.input(
			z.object({
				id: z.number(),
				iconId: z.number(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { prisma } = ctx
			const { id: userId } = ctx.session.user

			const participant = await prisma.projectParticipants.findUnique({
				where: {
					projectId_userId: {
						projectId: input.id,
						userId,
					},
				},
			})

			if (!participant) {
				throw new TRPCError({
					code: 'FORBIDDEN',
					message: 'You dont have access to this project',
				})
			}

			return await prisma.project.update({
				where: {
					id: input.id,
				},
				data: {
					icon: {
						connect: {
							id: input.iconId,
						},
					},
				},
			})
		}),
	deleteProject: protectedProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ ctx, input }) => {
			const { prisma } = ctx
			const { id: userId } = ctx.session.user

			const participant = await prisma.projectParticipants.findUnique({
				where: {
					projectId_userId: {
						projectId: input.id,
						userId,
					},
				},
			})

			if (!participant) {
				throw new TRPCError({
					code: 'FORBIDDEN',
					message: 'You dont have access to this project',
				})
			}

			return await prisma.project.delete({
				where: {
					id: input.id,
				},
			})
		}),
	listUserProjects: protectedProcedure.query(async ({ ctx }) => {
		const { prisma } = ctx
		const { id: userId } = ctx.session.user

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
		})
	}),
	countUserProjects: protectedProcedure.query(async ({ ctx }) => {
		const { prisma } = ctx
		const { id: userId } = ctx.session.user

		return await prisma.projectParticipants.count({
			where: {
				userId,
			},
		})
	}),
	getKanbanData: protectedProcedure
		.input(z.object({ url: z.string().regex(/^[a-zA-Z0-9-]+$/) }))
		.query(async ({ ctx, input }) => {
			const { prisma } = ctx
			const { id: userId } = ctx.session.user

			const projectId = await prisma.project.findUnique({
				where: {
					url: input.url,
				},
				select: {
					id: true,
				},
			})

			if (!projectId) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Project not found',
				})
			}

			const participant = await prisma.projectParticipants.findUnique({
				where: {
					projectId_userId: {
						projectId: projectId?.id as number,
						userId,
					},
				},
			})

			if (!participant) {
				throw new TRPCError({
					code: 'FORBIDDEN',
					message: 'You dont have access to this project',
				})
			}

			return await prisma.project.findUnique({
				where: {
					url: input.url,
				},
				select: {
					id: true,
					name: true,
					url: true,
					key: true,
					description: true,
					columns: {
						orderBy: {
							index: 'asc',
						},
						select: {
							id: true,
							name: true,
							index: true,
							tasks: {
								orderBy: {
									index: 'asc',
								},
								select: {
									id: true,
									title: true,
									index: true,
									taskKey: true,
									commentCount: true,
									attachmentCount: true,
									priorityId: true,
									labels: {
										select: {
											label: {
												select: {
													id: true,
													name: true,
													colorId: true,
												},
											},
										},
									},
									assignee: {
										select: {
											id: true,
											image: true,
										},
									},
								},
							},
						},
					},
				},
			})
		}),
	getProjectBasicInfo: protectedProcedure
		.input(z.object({ url: z.string().regex(/^[a-zA-Z0-9-]+$/) }))
		.query(async ({ ctx, input }) => {
			const { prisma } = ctx

			return await prisma.project.findUnique({
				where: {
					url: input.url,
				},
				include: {
					icon: true,
				},
			})
		}),
	getProjectInfo: protectedProcedure
		.input(z.object({ url: z.string().regex(/^[a-zA-Z0-9-]+$/) }))
		.query(async ({ ctx, input }) => {
			const { prisma } = ctx

			return await prisma.project.findUnique({
				where: {
					url: input.url,
				},
				include: {
					_count: true,
					icon: true,
					participants: {
						take: 3,
						select: {
							user: {
								select: { id: true, name: true, image: true },
							},
						},
					},
				},
			})
		}),
	getDashboardActivity: protectedProcedure.query(async ({ ctx }) => {
		const { prisma } = ctx
		const { id: userId } = ctx.session.user

		const projectData = await prisma.projectParticipants.findMany({
			where: {
				userId,
			},
			select: {
				project: {
					select: {
						iconId: true,
						url: true,
						columns: {
							select: {
								tasks: {
									select: {
										taskKey: true,
										title: true,
										attachments: {
											select: {
												filename: true,
												filesize: true,
												createdAt: true,
												author: {
													select: {
														id: true,
														name: true,
														image: true,
													},
												},
											},
											orderBy: {
												createdAt: 'desc',
											},
										},
										comments: {
											select: {
												body: true,
												createdAt: true,
												author: {
													select: {
														id: true,
														name: true,
														image: true,
													},
												},
											},
											orderBy: {
												createdAt: 'desc',
											},
										},
									},
								},
							},
						},
					},
				},
			},
		})

		const activity: IActivityItem[] = []

		projectData.map((project) => {
			project.project.columns.map((column) => {
				column.tasks.map((task) => {
					// Get attachments
					task.attachments.map((attachment) => {
						activity.push({
							activityUrl: `${project.project.url}?selectedTask=${task.taskKey}`,
							iconId: project.project.iconId as number,
							taskKey: task.taskKey,
							title: task.title,
							createdAt: attachment.createdAt,
							author: {
								id: attachment.author.id,
								image: attachment.author.image as string,
								name: attachment.author.name as string,
							},
							attachments: {
								filename: attachment.filename,
								filesize: attachment.filesize,
							},
						})
					})

					// Get comments
					task.comments.map((comment) => {
						activity.push({
							activityUrl: `${project.project.url}?selectedTask=${task.taskKey}`,
							iconId: project.project.iconId as number,
							taskKey: task.taskKey,
							title: task.title,
							createdAt: comment.createdAt,
							author: {
								id: comment.author.id,
								image: comment.author.image as string,
								name: comment.author.name as string,
							},
							comments: {
								body: comment.body,
							},
						})
					})
				})
			})
		})

		// Sort by date
		activity.sort((a, b) => {
			return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		})

		// Delete user in session
		const myActivity = activity.filter((item) => item.author.id !== userId)

		return myActivity
	}),
})
