import { Dialog, Tab, Transition } from '@headlessui/react'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
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
import LabelSelector from './labels/labelSelector'
import { trpc } from '../../../../../utils/trpc'
import TaskDetailsSkeletonLoader from './taskDetailsSkeletonLoader'
import TaskDetailsMenu from './taskDetailsMenu'
import LabelDialogIcon from './labels/labelDialogIcon'
import DatepickerComponent from './datepicker/datepickerComponent'
import AttachmentList from './attachment/attachmentList'
import CommentsList from './comments/commentsList'
import CommentListSkeletonLoader from './comments/commentListSkeleton'
import SkeletonPiece from '../../../../skeletons/skeletonPiece'

interface TaskProps {
	taskKey: string
	projectName: string
	projectId: number
}

type LabelDialogItem = {
	id: number
	name: string
	colorId: number
}

const TaskDetailsDialog: React.FC<TaskProps> = ({
	taskKey,
	projectName,
	projectId,
}) => {
	const { data: taskData, isLoading } = trpc.task.getTaskInfo.useQuery(
		{
			key: taskKey,
		},
		{
			onSuccess: (data) => {
				setTaskLabels(
					data?.labels?.map((label) => ({
						id: label.label.id,
						name: label.label.name,
						colorId: label.label.color.id,
					})) as LabelDialogItem[],
				)
			},
			retry: false,
		},
	)
	const { mutateAsync: renameTaskDescription } =
		trpc.task.renameTaskDescription.useMutation()
	const { mutateAsync: renameTask } = trpc.task.renameTaskTitle.useMutation()

	const trpcUtils = trpc.useContext()
	const [open, setOpen] = useState(true)

	const titleRef = useRef<HTMLFormElement>(null)
	const descriptionRef = useRef<HTMLFormElement>(null)

	const [taskLabels, setTaskLabels] = useState<LabelDialogItem[]>([])

	const handleOutsideTitleClick = () => handleRenameTitle(getTitleValues())
	const handleOutsideDescriptionClick = () =>
		handleRenameDescription(getDescriptionValues())

	useOnClickOutside(titleRef, handleOutsideTitleClick, 'mouseup')

	useOnClickOutside(descriptionRef, handleOutsideDescriptionClick, 'mouseup')

	const handleRenameTitle = async (data: { title: string }) => {
		try {
			if (data.title !== taskData?.title) {
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

	const handleRenameDescription = async (data: { description: string }) => {
		try {
			if (data.description !== taskData?.description) {
				if (document.activeElement instanceof HTMLElement) {
					document.activeElement.blur()
				}
				await renameTaskDescription({
					taskKey,
					newDescription: data.description,
				})
				trpcUtils.task.invalidate()
				trpcUtils.project.invalidate()
			}
		} catch (error) {
			console.log(error)
		}
	}

	const handleEnterPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			handleRenameDescription(getDescriptionValues())
		}
	}

	const {
		register: registerTitle,
		handleSubmit: handleTitleSubmit,
		getValues: getTitleValues,
		reset: resetTitle,
	} = useForm<{
		title: string
	}>({})

	const {
		register: registerDescription,
		handleSubmit: handleDescriptionSubmit,
		getValues: getDescriptionValues,
		reset: resetDescription,
	} = useForm<{ description: string }>()

	const router = useRouter()
	const query = router.query

	useEffect(() => {
		if (taskData?.title) {
			resetTitle({ title: taskData?.title })
		}
		if (taskData?.description) {
			resetDescription({ description: taskData?.description })
		}
	}, [taskData?.title, resetTitle, taskData?.description, resetDescription])

	const removeLabelCallback = (labelId: number) => {
		const newLabels = taskLabels.filter((label) => label.id !== labelId)
		setTaskLabels(newLabels)
	}

	const addLabelCallback = (label: LabelDialogItem) => {
		const newLabels = [...taskLabels, label]
		setTaskLabels(newLabels)
	}

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
								<Dialog.Panel className='min-w-[35vw] max-w-md rounded-2xl bg-white px-7 py-5 text-left align-middle shadow-xl transition-all lg:min-w-[55vw] 2xl:min-w-[40vw]'>
									{isLoading ? (
										<>
											<TaskDetailsSkeletonLoader setOpen={setOpen} />
											<div className='mb-6 flex items-center gap-2'>
												<SkeletonPiece classNames='w-32 h-9 rounded' />
												<SkeletonPiece classNames='w-32 h-9 rounded' />
											</div>
											<CommentListSkeletonLoader />
											<SkeletonPiece classNames='mt-6 w-[95%] h-20 rounded' />
										</>
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
													<TaskDetailsMenu taskKey={taskKey} />
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
													onSubmit={handleTitleSubmit(handleRenameTitle)}
												>
													<input
														spellCheck='false'
														type='text'
														{...registerTitle('title', {
															required: true,
															maxLength: 80,
														})}
														className='w-full py-1.5 pl-1 text-4xl leading-none outline-indigo-300'
													/>
												</form>
											</Dialog.Title>
											<div className='flex flex-col justify-center'>
												<div className='grid w-[22rem] grid-cols-[8rem_1fr] grid-rows-5 gap-y-1.5 pl-1 2xl:gap-x-7'>
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
															<div className='mt-1 flex flex-wrap items-center gap-2'>
																{taskLabels.map((label, index) => (
																	<LabelDialogIcon
																		key={index}
																		id={label.id}
																		colorId={label.colorId}
																		name={label.name}
																		taskKey={taskData?.taskKey as string}
																		removeLabelCallback={(id) => {
																			removeLabelCallback(id)
																		}}
																	/>
																))}
																<LabelSelector
																	taskId={taskData?.id as number}
																	projectId={projectId as number}
																	labelIds={
																		taskData?.labels.map(
																			(label) => label.label.id,
																		) as Array<number>
																	}
																	addLabelCallback={(label) => {
																		addLabelCallback(label)
																	}}
																/>
															</div>
														</div>
													</div>
													<div className='row-start-4 flex items-center gap-3 text-gray-900 opacity-70'>
														<CalendarDaysIcon className='mt-0.5 h-4 w-4 stroke-2' />
														<h3 className='text-base font-medium'>Due date</h3>
													</div>
													<div className='row-start-4 flex cursor-pointer items-center'>
														{/* <DatepickerComponent /> */}
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
												<form
													onSubmit={handleDescriptionSubmit(
														handleRenameDescription,
													)}
													ref={descriptionRef}
													className='mb-2 w-[64vw] sm:w-[54vw] md:w-[40vw] lg:w-[37vw] xl:w-[40vw] 2xl:w-10/12'
												>
													<textarea
														rows={3}
														spellCheck='false'
														{...registerDescription('description', {
															maxLength: {
																value: 150,
																message:
																	'must have a maximum of 200 characters',
															},
														})}
														onKeyDown={(e) => {
															handleEnterPress(e)
														}}
														className={`w-full resize-none overflow-auto bg-white p-1 text-sm text-gray-900 outline-indigo-300`}
														placeholder='Add a description...'
													/>
												</form>

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
																`inline-flex select-none items-center gap-1.5 border-b-[0.13rem] px-0.5 pb-1 text-base font-medium focus:outline-none ${
																	selected
																		? 'border-b-indigo-500 text-indigo-500'
																		: 'border-b-white text-gray-500'
																}`
															}
														>
															Attachments
															{taskData?.attachmentCount &&
															taskData?.attachmentCount > 0 ? (
																<span className='rounded-full bg-indigo-100 py-0.5 px-2 text-xs text-indigo-500'>
																	{taskData?.attachmentCount}
																</span>
															) : undefined}
														</Tab>
													</Tab.List>
													<Tab.Panels>
														<Tab.Panel>
															<CommentsList taskKey={taskKey} />
														</Tab.Panel>
														<Tab.Panel>
															<AttachmentList taskKey={taskKey} />
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
