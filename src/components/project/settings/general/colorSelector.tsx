import { Popover } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { trpc } from '../../../../utils/trpc'
import { motion } from 'framer-motion'
import { getIconBg } from '../../../../utils/colorSetter'
import { Float } from '@headlessui-float/react'

const ColorSelector: React.FC<{
	currentIcon: number
	projectId: number
	setToast: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ currentIcon, projectId, setToast }) => {
	const trpcUtils = trpc.useContext()
	const { data: colors } = trpc.colors.list.useQuery()
	const [selectedColor, setSelectedColor] = useState<number>(currentIcon)

	const { mutateAsync: updateIcon } =
		trpc.project.updateProjectIcon.useMutation({
			onSuccess: () => {
				setToast(true)
				trpcUtils.project.invalidate()
				setTimeout(() => {
					setToast(false)
				}, 3500)
			},
		})

	const handleSave = async () => {
		await updateIcon({ id: projectId, iconId: selectedColor })
	}

	return (
		<Popover className='relative'>
			<Float
				arrow
				offset={15}
				placement='bottom-start'
				as={Fragment}
				enter='transition ease-out duration-200'
				enterFrom='opacity-0 translate-y-1'
				enterTo='opacity-100 translate-y-0'
				leave='transition ease-in duration-150'
				leaveFrom='opacity-100 translate-y-0'
				leaveTo='opacity-0 translate-y-1'
			>
				<Popover.Button className='w-full rounded-lg bg-indigo-500 p-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300 hover:bg-indigo-800 dark:bg-blue-600 dark:focus:ring-blue-800 dark:hover:bg-blue-700 sm:w-auto'>
					Change icon
				</Popover.Button>

				<Popover.Panel className='rounded-xl border border-gray-200 bg-white shadow-lg focus:outline-none '>
					<Float.Arrow className='absolute h-5 w-5 rotate-45 border border-gray-200 bg-white ' />
					<div className='relative flex w-48 flex-col justify-center gap-5 overflow-hidden rounded-xl bg-white px-7 py-5'>
						<div className='grid grid-cols-3 gap-3 '>
							{colors?.map((color) => {
								return (
									<motion.span
										onClick={() => setSelectedColor(color.id)}
										key={color.id}
										className={`h-8 w-8 cursor-pointer rounded ${getIconBg(
											color.id,
										)} ${
											color.id === selectedColor ? 'ring-4 ring-indigo-400' : ''
										}`}
										whileHover={{ scale: 1.3 }}
									></motion.span>
								)
							})}
						</div>
						<button
							onClick={handleSave}
							className='w-full rounded-lg bg-indigo-500 px-2 py-2.5 text-center text-base font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300 hover:bg-indigo-800 dark:bg-blue-600 dark:focus:ring-blue-800 dark:hover:bg-blue-700 sm:w-auto'
						>
							Save
						</button>
					</div>
				</Popover.Panel>
			</Float>
		</Popover>
	)
}

export default ColorSelector
