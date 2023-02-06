import { XMarkIcon } from '@heroicons/react/24/outline'
import LabelIcon from './labelIcon'
import { trpc } from '../../../../../../utils/trpc'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'

interface LabelDialogIconProps {
	taskKey: string
	id: number
	name: string
	colorId: number
	removeLabelCallback: (id: number) => void
}

const LabelDialogIcon: React.FC<LabelDialogIconProps> = ({
	taskKey,
	id,
	name,
	colorId,
	removeLabelCallback,
}) => {
	const trpcUtils = trpc.useContext()

	const { mutateAsync: removeLabel } =
		trpc.label.removeLabelFromTask.useMutation()

	const handleRemoveLabel = async (labelId: number) => {
		try {
			removeLabelCallback(labelId)
			await removeLabel({ taskKey, labelId })
			trpcUtils.project.invalidate()
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<Menu as='div' className='relative z-10 grid place-content-center'>
			<Menu.Button>
				<LabelIcon
					colorId={colorId}
					name={name}
					classNames='text-sm cursor-default transition-all hover:scale-110'
				/>
			</Menu.Button>
			<Transition
				as={Fragment}
				enter='transition ease-out duration-100'
				enterFrom='transform opacity-0 scale-95'
				enterTo='transform opacity-100 scale-100'
				leave='transition ease-in duration-75'
				leaveFrom='transform opacity-100 scale-100'
				leaveTo='transform opacity-0 scale-95'
			>
				<Menu.Items>
					<Menu.Item>
						<div className='absolute z-30 mt-1 w-28 origin-top-left divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none'>
							<button
								onClick={() => {
									handleRemoveLabel(id)
								}}
								className='flex w-full items-center justify-between p-2 '
							>
								<p className='select-none text-xs'>Remove label</p>
								<XMarkIcon className='mt-0.5 h-4 w-4' />
							</button>
						</div>
					</Menu.Item>
				</Menu.Items>
			</Transition>
		</Menu>
	)
}

export default LabelDialogIcon
