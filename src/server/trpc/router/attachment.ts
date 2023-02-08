import S3 from 'aws-sdk/clients/s3'
import { protectedProcedure, router } from '../trpc'
import { z } from 'zod'
import { env } from '../../../env/server.mjs'
import { randomUUID } from 'crypto'

export const attachmentRouter = router({
	getTaskAttachments: protectedProcedure
		.input(
			z.object({
				taskKey: z.string(),
				page: z.number(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const { prisma } = ctx

			const limit = 3

			const totalPages = await prisma.attachment.count({
				where: {
					task: {
						taskKey: input.taskKey,
					},
				},
			})

			return {
				totalPages: Math.ceil(totalPages / limit),
				attachments: await prisma.attachment.findMany({
					take: limit,
					skip: (input.page ?? 0) * limit,
					where: {
						task: {
							taskKey: input.taskKey,
						},
					},
					select: {
						id: true,
						filename: true,
						key: true,
					},
				}),
			}
		}),
	getUploadUrl: protectedProcedure
		.input(
			z.object({
				taskKey: z.string(),
				filename: z.string(),
				type: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { prisma } = ctx

			const s3 = new S3({
				signatureVersion: 'v4',
				credentials: {
					accessKeyId: env.AWS_ACCESS_KEY_ID,
					secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
				},
				region: env.AWS_REGION,
			})

			const uuidFileName = randomUUID()
			const key = `${input.taskKey}/${uuidFileName}.${input.filename
				.split('.')
				.pop()}`

			const post = s3.getSignedUrl('putObject', {
				Bucket: env.AWS_BUCKET_NAME,
				Expires: 60,
				Key: key,
			})

			const createAttachment = prisma.attachment.create({
				data: {
					filename: input.filename,
					key,
					task: {
						connect: {
							taskKey: input.taskKey,
						},
					},
				},
			})

			const increaseAttachmentCount = prisma.task.update({
				where: {
					taskKey: input.taskKey,
				},
				data: {
					attachmentCount: {
						increment: 1,
					},
				},
			})

			await prisma.$transaction([createAttachment, increaseAttachmentCount])

			return post
		}),
	getDownloadUrl: protectedProcedure
		.input(
			z.object({
				attachmentKey: z.string(),
			}),
		)
		.mutation(async ({ input }) => {
			const s3 = new S3({
				signatureVersion: 'v4',
				credentials: {
					accessKeyId: env.AWS_ACCESS_KEY_ID,
					secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
				},
				region: env.AWS_REGION,
			})

			return s3.getSignedUrl('getObject', {
				Bucket: env.AWS_BUCKET_NAME,
				Key: input.attachmentKey,
			})
		}),
	deleteAttachment: protectedProcedure
		.input(
			z.object({
				attachmentKey: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { prisma } = ctx

			const s3 = new S3({
				signatureVersion: 'v4',
				credentials: {
					accessKeyId: env.AWS_ACCESS_KEY_ID,
					secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
				},
				region: env.AWS_REGION,
			})

			const deleteAttachment = prisma.attachment.delete({
				where: {
					key: input.attachmentKey,
				},
			})

			const decreaseAttachmentCount = prisma.task.update({
				where: {
					taskKey: input.attachmentKey.split('/')[0],
				},
				data: {
					attachmentCount: {
						decrement: 1,
					},
				},
			})

			await prisma.$transaction([deleteAttachment, decreaseAttachmentCount])

			return s3
				.deleteObject({
					Bucket: env.AWS_BUCKET_NAME,
					Key: input.attachmentKey,
				})
				.promise()
		}),
})
