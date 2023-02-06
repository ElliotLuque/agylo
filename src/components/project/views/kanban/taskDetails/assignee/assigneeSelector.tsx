import { Listbox, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { trpc } from '../../../../../../utils/trpc'
import UserAvatar from '../../../../../misc/userAvatar'

type Assignee = {
	id: string | null
	name: string | null
	image: string | null
}

const AssigneeSelector: React.FC<{
	projectId: number
	taskId: number
	assigneeId: string
	assigneeName: string | null
	assigneeImage: string | null
}> = ({ projectId, taskId, assigneeId, assigneeName, assigneeImage }) => {
	const trpcUtils = trpc.useContext()

	const { data: projectParticipants } =
		trpc.participants.getProjectParticipants.useQuery({ projectId })
	const { mutateAsync: assignTask } = trpc.task.assignTask.useMutation()

	const session = useSession()

	const [selectedAssignee, setSelectedAssignee] = useState<Assignee>(
		{} as Assignee,
	)

	const handleAssignTask = async (
		assigneeId: string | null,
		assigneeName: string | null,
		assigneeImage: string | null,
	) => {
		try {
			setSelectedAssignee({
				id: assigneeId,
				name: assigneeName,
				image: assigneeImage,
			})
			await assignTask({ assigneeId, taskId })
			trpcUtils.task.getTaskInfo.invalidate()
			trpcUtils.project.getKanbanData.invalidate()
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		setSelectedAssignee({
			id: assigneeId,
			name: assigneeName,
			image: assigneeImage,
		})
	}, [assigneeId, assigneeName, assigneeImage])

	return (
		<>
			<Listbox
				onChange={() => handleAssignTask}
				as='div'
				className='relative z-30 grid place-content-center'
			>
				<Listbox.Button className='flex cursor-pointer select-none items-center gap-2 rounded-md bg-white p-1 outline-none hover:bg-gray-50'>
					<UserAvatar
						isInvisible={false}
						width={28}
						height={28}
						imageUrl={selectedAssignee.image ?? '/default-user.jpg'}
					/>
					<p className='text-sm font-semibold text-gray-900 opacity-80'>
						{selectedAssignee.name ? selectedAssignee.name : 'Unassigned'}
						{selectedAssignee.name === session.data?.user?.name && (
							<span className='font-bold text-gray-900'> (Me)</span>
						)}
					</p>
				</Listbox.Button>

				<Transition
					as={Fragment}
					enter='transition ease-out duration-100'
					enterFrom='transform opacity-0 scale-95'
					enterTo='transform opacity-100 scale-100'
					leave='transition ease-in duration-75'
					leaveFrom='transform opacity-100 scale-100'
					leaveTo='transform opacity-0 scale-95'
				>
					<Listbox.Options className='absolute top-8 left-1 mt-2 w-56 origin-top-left divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none'>
						<div className='px-1 py-2'>
							<Listbox.Option value={null}>
								{({ active, selected }) => (
									<button
										className={`${active ? 'bg-gray-100' : 'bg-white'} ${
											selected ? 'bg-indigo-100' : 'bg-white'
										} flex w-full items-center gap-2 rounded-md p-2 text-sm text-gray-900`}
										onClick={() => {
											handleAssignTask(null, null, null)
										}}
									>
										<UserAvatar
											width={28}
											height={28}
											imageUrl={null}
											isInvisible={false}
										/>
										<p className='text-sm font-semibold text-gray-900 opacity-80'>
											Unassigned
										</p>
									</button>
								)}
							</Listbox.Option>
							{projectParticipants?.map((participant) => (
								<Listbox.Option
									key={participant.user.id}
									value={participant.user.id}
								>
									{({ active }) => (
										<button
											className={`${
												active ? 'bg-gray-100' : 'bg-white'
											} flex w-full items-center gap-2 rounded-md p-2 text-sm text-gray-900`}
											onClick={() => {
												handleAssignTask(
													participant.user.id,
													participant.user.name,
													participant.user.image,
												)
											}}
										>
											<UserAvatar
												isInvisible={false}
												width={28}
												height={28}
												imageUrl={participant.user.image}
											/>
											<p className='truncate text-sm font-semibold text-gray-900 opacity-80'>
												{participant.user.name}
												{participant.user.name === session.data?.user?.name && (
													<span className='font-bold text-gray-900'> (Me)</span>
												)}
											</p>
										</button>
									)}
								</Listbox.Option>
							))}
						</div>
					</Listbox.Options>
				</Transition>
			</Listbox>
		</>
	)
}

export default AssigneeSelector
