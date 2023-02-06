import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { trpc } from '../../../../../../utils/trpc'

type LabelListItem = {
	id: number
	name: string
	colorId: number
}

const LabelColorCreate: React.FC<{
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
	projectId: number
	taskId: number
	labelName: string
	addLabelCallback: (label: LabelListItem) => void
}> = ({ open, setOpen, projectId, taskId, labelName, addLabelCallback }) => {
	const trpcUtils = trpc.useContext()
	const { mutateAsync: createAndAddLabel } =
		trpc.label.newLabelToTask.useMutation()

	const colors: Record<number, string> = {
		1: 'bg-gray-500',
		2: 'bg-lime-300',
		3: 'bg-emerald-500',
		4: 'bg-sky-400',
		5: 'bg-teal-500',
		6: 'bg-violet-500',
		7: 'bg-fuchsia-400',
		8: 'bg-pink-400',
	}

	const names: Record<number, string> = {
		1: 'Gray',
		2: 'Lime',
		3: 'Emerald',
		4: 'Sky',
		5: 'Teal',
		6: 'Violet',
		7: 'Fuchsia',
		8: 'Pink',
	}

	const getLabelListColor = (colorId: number) => {
		return colors[colorId]
	}

	const getLabelListName = (colorId: number) => {
		return names[colorId]
	}

	const handleCreateAndAddLabel = async (colorId: number) => {
		try {
			setOpen(false)
			await createAndAddLabel({
				projectId,
				taskId,
				colorId,
				name: labelName,
			})
			trpcUtils.label.invalidate()
			trpcUtils.task.getTaskInfo.invalidate()
			trpcUtils.project.getKanbanData.invalidate()
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<>
			<Transition appear show={open} as={Fragment}>
				<Dialog as='div' className='relative z-10' onClose={setOpen}>
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
						<div className='flex min-h-full items-center justify-center p-4 text-center'>
							<Transition.Child
								as={Fragment}
								enter='ease-out duration-300'
								enterFrom='opacity-0 scale-95'
								enterTo='opacity-100 scale-100'
								leave='ease-in duration-200'
								leaveFrom='opacity-100 scale-100'
								leaveTo='opacity-0 scale-95'
							>
								<Dialog.Panel className=' max-w-md overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
									<Dialog.Title
										as='div'
										className='flex items-center gap-3 pb-5'
									>
										<h3 className='text-xl font-medium leading-6 text-gray-800'>
											Select label color
										</h3>
									</Dialog.Title>
									{/* eslint-disable-next-line tailwindcss/no-custom-classname*/}
									<div className='scroll scrollbar-thumb-rounded-xl flex h-full w-52 flex-col items-center justify-center gap-5 overflow-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-indigo-400'>
										{Object.keys(colors).map((colorId, index) => (
											<button
												onClick={() => {
													handleCreateAndAddLabel(parseInt(colorId))
												}}
												className='flex w-full items-center gap-5 bg-white text-left text-base'
												key={index}
											>
												<span
													className={`${getLabelListColor(
														parseInt(colorId),
													)} h-4 w-4 rounded-full`}
												/>
												<p>{getLabelListName(parseInt(colorId))}</p>
											</button>
										))}
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	)
}

export default LabelColorCreate
