import { useState } from 'react'
import { trpc } from '../../../../../../utils/trpc'
import { useForm } from 'react-hook-form'
import UserAvatar from '../../../../../misc/userAvatar'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useSession } from 'next-auth/react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import CommentOptionsMenu from './commentOptionsMenu'
import CommentListSkeletonLoader from './commentListSkeleton'
dayjs.extend(relativeTime)

const CommentsList: React.FC<{ taskKey: string }> = ({ taskKey }) => {
	const trpcUtils = trpc.useContext()
	const [page, setPage] = useState(0)

	const { data: commentsPage, isLoading: isLoadingList } =
		trpc.comments.getCommentsFromTask.useQuery({
			taskKey,
			page,
		})

	const { mutateAsync: addComment } =
		trpc.comments.addCommentToTask.useMutation()

	const { register, reset, handleSubmit, getValues } = useForm<{
		body: string
	}>()

	const handleAddComment = async (data: { body: string }) => {
		try {
			await addComment({ taskKey, body: data.body })
			reset({ body: '' })

			trpcUtils.comments.getCommentsFromTask.invalidate()
			trpcUtils.task.getTaskInfo.invalidate()
			trpcUtils.project.getKanbanData.invalidate()
		} catch (error) {
			console.log(error)
		}
	}

	const handleEnterPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			handleAddComment(getValues())
		}
	}

	const session = useSession()

	return (
		<div className='mt-5'>
			<div className='mb-5 flex items-center justify-between'>
				{isLoadingList ? (
					<CommentListSkeletonLoader />
				) : (
					<>
						{(commentsPage?.comments?.length as number) > 0 ? (
							<div className='flex w-full flex-col justify-center gap-3'>
								{commentsPage?.comments?.map((comment, index) => (
									<div
										key={index}
										className='flex flex-col gap-1.5 rounded-lg p-3'
									>
										<div className='flex items-center justify-between'>
											<div className='flex items-center gap-2'>
												<UserAvatar
													height={30}
													width={30}
													imageUrl={comment.author.image}
												/>
												<p className='text-sm font-semibold text-gray-800'>
													{comment.author.name}
												</p>
												<span className='h-[4px] w-[4px] rounded-full bg-gray-800/40' />
												<p className='text-sm text-gray-800/80'>
													{String(dayjs(comment.createdAt).fromNow())}
												</p>
											</div>
											{session?.data?.user?.id === comment.author.id && (
												<CommentOptionsMenu
													commentId={comment.id}
													taskKey={taskKey}
												/>
											)}
										</div>
										<p className='text-base text-gray-800'>{comment.body}</p>
									</div>
								))}
								{(commentsPage?.totalPages as number) > 1 && (
									<div className='flex w-full items-center justify-end gap-2'>
										<button
											className='disabled:opacity-30'
											disabled={page === 0}
											onClick={() => {
												setPage(page - 1)
											}}
										>
											<ChevronLeftIcon className='h-5 w-5 text-gray-800' />
										</button>
										<p className='text-gray-800'>{page + 1}</p>
										<button
											className='disabled:opacity-30'
											disabled={
												page === (commentsPage?.totalPages as number) - 1
											}
											onClick={() => {
												setPage(page + 1)
											}}
										>
											<ChevronRightIcon className='h-5 w-5 text-gray-800' />
										</button>
									</div>
								)}
							</div>
						) : (
							<p className='my-3 text-sm text-gray-500'>No comments yet...</p>
						)}
					</>
				)}
			</div>
			<form
				onSubmit={handleSubmit(handleAddComment)}
				className='flex h-24 flex-col items-end justify-end rounded-lg bg-gray-100 p-4'
			>
				<textarea
					// eslint-disable-next-line tailwindcss/no-custom-classname
					className={`h-full w-full resize-none bg-gray-100 text-base text-gray-800 scrollbar-none focus:outline-none`}
					{...register('body', { required: true, maxLength: 100 })}
					spellCheck={false}
					rows={2}
					onKeyDown={handleEnterPress}
					placeholder='Write a comment...'
				/>
				<button
					className='absolute rounded bg-indigo-500 p-2 text-base font-medium text-white'
					type='submit'
				>
					Comment
				</button>
			</form>
		</div>
	)
}

export default CommentsList
