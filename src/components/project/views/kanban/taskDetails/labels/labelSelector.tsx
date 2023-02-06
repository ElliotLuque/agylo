import { PlusIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { trpc } from '../../../../../../utils/trpc'
import { useRef, useState } from 'react'
import { useDebounce, useOnClickOutside } from 'usehooks-ts'
import LabelColorCreate from './labelColorCreate'

type LabelListItem = {
	id: number
	name: string
	colorId: number
}

const LabelSelector: React.FC<{
	projectId: number
	labelIds: Array<number>
	taskId: number
	addLabelCallback: (label: LabelListItem) => void
}> = ({ projectId, labelIds, taskId, addLabelCallback: labelToDialog }) => {
	const [query, setQuery] = useState<string>('')
	const debouncedQuery = useDebounce(query, 100)

	const trpcUtils = trpc.useContext()

	trpc.label.getAvailableLabels.useQuery(
		{
			projectId,
			taskLabelIds: labelIds,
			filter: debouncedQuery,
		},
		{
			onSuccess: (data) => {
				const ids = data.map((label) => label.id)
				const colorIds = data.map((label) => label.color.id)
				const names = data.map((label) => label.name)

				const labels = ids.map((id, index) => ({
					id,
					name: names[index],
					colorId: colorIds[index],
				}))

				setAvailableLabelsState(labels as LabelListItem[])
			},
		},
	)

	const { mutateAsync: addLabel } = trpc.label.addLabelToTask.useMutation()

	const [availabelLabelsState, setAvailableLabelsState] = useState<
		LabelListItem[]
	>([])
	const [open, setOpen] = useState<boolean>(false)
	const [openColorDialog, setOpenColorDialog] = useState<boolean>(false)
	const ref = useRef<HTMLDivElement>(null)

	const handleOutsideClick = () => {
		setOpen(false), setQuery('')
	}

	useOnClickOutside(ref, handleOutsideClick, 'mousedown')

	const getLabelListColor = (colorId: number) => {
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

		return colors[colorId]
	}

	const handleAddLabel = async (labelId: number) => {
		try {
			labelToDialog({
				id: labelId,
				name: availabelLabelsState.find((label) => label.id === labelId)
					?.name as string,
				colorId: availabelLabelsState.find((label) => label.id === labelId)
					?.colorId as number,
			})

			setOpen(false)
			setQuery('')

			await addLabel({
				labelId,
				taskId,
			})

			trpcUtils.label.invalidate()
			trpcUtils.task.getTaskInfo.invalidate()
			trpcUtils.project.getKanbanData.invalidate()
		} catch (error) {
			console.log(error)
		}
	}

	const addLabelCallback = (label: LabelListItem) => {
		return labelToDialog(label)
	}

	return (
		<>
			<LabelColorCreate
				projectId={projectId}
				labelName={debouncedQuery}
				taskId={taskId}
				open={openColorDialog}
				setOpen={setOpenColorDialog}
				addLabelCallback={addLabelCallback}
			/>
			<div ref={ref} className='relative'>
				<button
					onClick={() => {
						setOpen(!open)
						setQuery('')
					}}
					className='focus:outline-none'
				>
					<div className='flex w-fit cursor-pointer items-center gap-1 rounded px-1.5 py-1 text-gray-900 opacity-70 hover:bg-gray-100'>
						<PlusIcon className='mt-0.5 h-3.5 w-3.5 stroke-2' />
						<p className='select-none text-sm font-semibold'>Add Label</p>
					</div>
				</button>

				{open ? (
					<motion.div
						className='absolute z-30 mt-1 w-48 origin-top-left divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none'
						initial={{ scale: 0.95, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ duration: 0.1, ease: 'easeOut' }}
					>
						<div className='flex flex-col justify-center'>
							<input
								type='text'
								autoFocus
								spellCheck={false}
								onChange={(event) => setQuery(event.target.value)}
								placeholder='Search...'
								className='px-2 py-1.5 text-sm text-gray-800 focus:outline-none'
							/>
						</div>
						<div className='flex flex-col'>
							{availabelLabelsState.map((label) => (
								<button
									onClick={() => handleAddLabel(label.id)}
									key={label.id}
									className='flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-gray-100'
								>
									<span
										className={`mt-0.5 h-4 w-1 rounded  ${getLabelListColor(
											label.colorId,
										)}`}
									/>
									<p>{label.name}</p>
								</button>
							))}
							{availabelLabelsState.length === 0 && debouncedQuery !== '' && (
								<button
									onClick={() => {
										setOpenColorDialog(true)
									}}
									className='flex items-center px-2 py-1.5 text-sm'
								>
									Create label &quot;{debouncedQuery}&quot;
								</button>
							)}
						</div>
					</motion.div>
				) : undefined}
			</div>
		</>
	)
}

export default LabelSelector
