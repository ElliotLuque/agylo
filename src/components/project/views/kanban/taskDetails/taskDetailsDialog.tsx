import { Dialog, Tab, Transition } from '@headlessui/react'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { EllipsisHorizontalIcon, XMarkIcon } from '@heroicons/react/24/outline'
import {
	CalendarDaysIcon,
	BookmarkIcon,
	ChartBarIcon,
	TagIcon,
	UserIcon,
} from '@heroicons/react/24/solid'
import { useRouter } from 'next/router'
import AssigneeSelector from './assignee/assigneeSelector'
import PrioritySelector from './priority/prioritySelector'
import { useOnClickOutside } from 'usehooks-ts'
import { useForm } from 'react-hook-form'
import LabelIcon from './labels/labelIcon'
import LabelSelector from './labels/labelSelector'
import { trpc } from '../../../../../utils/trpc'
import TaskDetailsSkeletonLoader from './taskDetailsSkeletonLoader'

interface TaskProps {
	taskKey: string
	projectName: string
	projectId: number
}

const TaskDetailsDialog: React.FC<TaskProps> = ({
	taskKey,
	projectName,
	projectId,
}) => {
	const { data: taskData, isLoading } = trpc.task.getTaskInfo.useQuery({
		key: taskKey,
	})
	const { mutateAsync: renameTask } = trpc.task.renameTask.useMutation()

	const trpcUtils = trpc.useContext()
	const [open, setOpen] = useState(true)

	const titleRef = useRef<HTMLFormElement>(null)

	const handleOutsideClick = () => handleRenameTask(getValues())

	useOnClickOutside(titleRef, handleOutsideClick, 'mouseup')

	const handleRenameTask = async (data: { title: string }) => {
		try {
			if (data.title !== taskData?.title && open) {
				if (document.activeElement instanceof HTMLElement) {
					document.activeElement.blur()
				}
				await renameTask({ taskKey, newTitle: data.title })
				trpcUtils.task.invalidate()
				trpcUtils.project.invalidate()
			}
		} catch (error) {
			console.log(error)
		}
	}

	const { register, handleSubmit, getValues, reset } = useForm<{
		title: string
	}>({})

	const router = useRouter()
	const query = router.query

	useEffect(() => {
		if (taskData?.title) {
			reset({ title: taskData?.title })
		}
	}, [taskData?.title, reset])

	return (
		<>
			<Transition appear show={open} as={Fragment}>
				<Dialog
					as='div'
					className='relative z-10'
					onClose={() => {
						setOpen(false)
						setTimeout(() => {
							router.push({
								pathname: router.pathname,
								query: { projectUrl: query.projectUrl },
							})
						}, 200)
					}}
				>
					<Transition.Child
						as={Fragment}
						enter='ease-out duration-300'
						enterFrom='opacity-0'
						enterTo='opacity-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'
					>
						<div className='fixed inset-0 bg-black/25' />
					</Transition.Child>

					<div className='fixed inset-0 overflow-y-auto'>
						<div className='flex min-h-full items-center justify-center p-4 text-center focus:outline-none'>
							<Transition.Child
								as={Fragment}
								enter='ease-out duration-300'
								enterFrom='opacity-0 scale-95'
								enterTo='opacity-100 scale-100'
								leave='ease-in duration-200'
								leaveFrom='opacity-100 scale-100'
								leaveTo='opacity-0 scale-95'
							>
								<Dialog.Panel className='min-w-[35vw] max-w-md rounded-2xl bg-white px-7 py-5 text-left align-middle shadow-xl transition-all'>
									{isLoading ? (
										<TaskDetailsSkeletonLoader setOpen={setOpen} />
									) : (
										<div>
											<div className='flex items-center justify-between pb-2'>
												<div className='font-bold text-gray-700'>
													<span className='cursor-default font-medium text-gray-900 opacity-60'>
														{projectName} /{' '}
													</span>
													<span className='hover:cursor-pointer hover:underline hover:underline-offset-4'>
														{taskData?.taskKey}
													</span>
												</div>
												<div className='flex items-center gap-2'>
													<EllipsisHorizontalIcon className='mt-[0.07rem] h-5 w-5 cursor-pointer text-gray-900 opacity-80' />
													<button
														className='focus:outline-none'
														onClick={() => {
															setOpen(false)
															setTimeout(() => {
																router.push({
																	pathname: router.pathname,
																	query: { projectUrl: query.projectUrl },
																})
															}, 200)
														}}
													>
														<XMarkIcon className='h-4 w-4 cursor-pointer text-gray-900 opacity-70 ' />
													</button>
												</div>
											</div>
											<Dialog.Title
												as='div'
												className='pb-4 font-medium text-gray-800'
											>
												<form
													className='align-middle'
													ref={titleRef}
													onSubmit={handleSubmit(handleRenameTask)}
												>
													<input
														spellCheck='false'
														type='text'
														{...register('title', {
															required: true,
															maxLength: 80,
														})}
														className='w-full py-1.5 pl-1 text-4xl leading-none outline-indigo-300'
													/>
												</form>
											</Dialog.Title>
											<div className='flex flex-col justify-center'>
												<div className='grid w-[22rem] grid-cols-[8rem_1fr] grid-rows-5 gap-y-1.5 pl-1'>
													<div className='row-start-1 flex items-center gap-3 text-gray-900 opacity-70'>
														<BookmarkIcon className='mt-0.5 h-4 w-4' />
														<h3 className='text-base font-medium'>Status</h3>
													</div>
													<div className='row-start-1 flex items-center'>
														<p className='cursor-default pl-1 text-sm font-semibold'>
															{taskData?.column.name}
														</p>
													</div>
													<div className='row-start-2 flex items-center gap-3 text-gray-900 opacity-70'>
														<UserIcon className='mt-0.5 h-4 w-4' />
														<h3 className='text-base font-medium'>Assignee</h3>
													</div>
													<div className='row-start-2 flex items-center gap-1'>
														<AssigneeSelector
															projectId={projectId}
															taskId={taskData?.id as number}
															assigneeId={taskData?.assignee?.id as string}
															assigneeImage={
																taskData?.assignee?.image as string
															}
															assigneeName={taskData?.assignee?.name as string}
														/>
													</div>
													<div className='row-start-3 flex items-center gap-3 text-gray-900 opacity-70'>
														<TagIcon className='mt-0.5 h-4 w-4' />
														<h3 className='text-base font-medium'>Labels</h3>
													</div>
													<div className='row-start-3 flex w-[25rem] flex-col justify-center'>
														<div className='flex items-center gap-1 '>
															<div className='mt-1 flex flex-wrap items-center gap-1'>
																{taskData?.labels?.map((label, index) => (
																	<LabelIcon
																		key={index}
																		colorId={label.label.color.id}
																		name={label.label.name}
																		classNames='text-sm '
																	/>
																))}
																<LabelSelector
																	projectId={projectId as number}
																	labelIds={
																		taskData?.labels.map(
																			(label) => label.label.id,
																		) as Array<number>
																	}
																/>
															</div>
														</div>
													</div>
													<div className='row-start-4 flex items-center gap-3 text-gray-900 opacity-70'>
														<CalendarDaysIcon className='mt-0.5 h-4 w-4 stroke-2' />
														<h3 className='text-base font-medium'>Due date</h3>
													</div>
													<div className='row-start-4 flex cursor-pointer items-center'>
														<p className='text-sm text-gray-800'>
															30 Feb, 2022
														</p>
													</div>
													<div className='row-start-5 flex items-center gap-3 text-gray-900 opacity-70'>
														<ChartBarIcon className='mt-0.5 h-4 w-4' />
														<h3 className='text-base font-medium'>Priority</h3>
													</div>
													<div className='row-start-5 flex items-center'>
														<PrioritySelector
															taskId={taskData?.id as number}
															priorityId={taskData?.priorityId ?? null}
														/>
													</div>
												</div>
												<h1 className='mt-5 mb-2 text-2xl font-medium text-gray-800'>
													Description
												</h1>
												<p className='mb-7 text-sm text-gray-500'>
													{taskData?.description}
												</p>
												<Tab.Group>
													<Tab.List className='flex items-center gap-5 border-b border-b-gray-200'>
														<Tab
															className={({ selected }) =>
																`inline-flex select-none items-center gap-1.5 border-b-[0.13rem] px-0.5 pb-1 text-base font-medium focus:outline-none ${
																	selected
																		? 'border-b-indigo-500 text-indigo-500'
																		: 'border-b-white text-gray-500'
																}`
															}
														>
															Comments
															{taskData?.commentCount &&
															taskData?.commentCount > 0 ? (
																<span className='rounded-full bg-indigo-100 py-0.5 px-2 text-xs text-indigo-500'>
																	{taskData?.commentCount}
																</span>
															) : undefined}
														</Tab>
														<Tab
															className={({ selected }) =>
																`select-none border-b-[0.13rem] px-0.5 pb-1 text-base font-medium focus:outline-none ${
																	selected
																		? 'border-b-indigo-500 text-indigo-500'
																		: 'border-b-white text-gray-500'
																}`
															}
														>
															Attachments
														</Tab>
													</Tab.List>
													<Tab.Panels>
														<Tab.Panel>
															<div className='mt-6'>
																<form>
																	<textarea
																		spellCheck={false}
																		rows={3}
																		className={`h-24 w-full resize-none rounded-lg bg-gray-100 p-3 text-gray-800 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-50`}
																		placeholder='Write a comment...'
																	/>
																</form>
															</div>
														</Tab.Panel>
														<Tab.Panel>
															<p className='mt-5'>attachm akiii</p>
														</Tab.Panel>
													</Tab.Panels>
												</Tab.Group>
											</div>
										</div>
									)}
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	)
}

export default TaskDetailsDialog
