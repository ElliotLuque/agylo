import { Combobox, Popover } from '@headlessui/react'
import { PlusIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { trpc } from '../../../../../../utils/trpc'
import { useState } from 'react'
import { useDebounce } from 'usehooks-ts'

const LabelSelector: React.FC<{
	projectId: number
	labelIds: Array<number>
}> = ({ projectId, labelIds }) => {
	const [query, setQuery] = useState<string>('')
	const debouncedQuery = useDebounce(query, 150)

	const { data: availableLabels } = trpc.label.getAvailableLabels.useQuery({
		projectId,
		taskLabelIds: labelIds,
		filter: debouncedQuery,
	})

	return (
		<Popover className='relative '>
			{availableLabels?.length !== 0 && (
				<Popover.Button className='focus:outline-none'>
					<div className='flex w-fit cursor-pointer items-center gap-1 rounded px-1.5 py-1 text-gray-900 opacity-70 hover:bg-gray-100'>
						<PlusIcon className='mt-0.5 h-3.5 w-3.5 stroke-2' />
						<p className='select-none text-sm font-semibold'>Add Label</p>
					</div>
				</Popover.Button>
			)}

			<Popover.Panel
				as='div'
				className='absolute top-8 left-1 z-30 mt-2 w-32 origin-top-left divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none'
			>
				<motion.div
					initial={{ scale: 0.95, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.1, ease: 'easeOut' }}
				>
					<Combobox>
						<Combobox.Input
							autoFocus
							spellCheck='false'
							defaultValue={''}
							onChange={(event) => {
								setQuery(event.target.value)
							}}
							className='w-full rounded-md px-2 py-1 text-sm focus:outline-none'
							placeholder='Search...'
						/>
						<Combobox.Options className='absolute w-full bg-white shadow-lg'>
							{availableLabels?.map((label, index) => (
								<Combobox.Option key={index} value={label.id}>
									{label.name}
								</Combobox.Option>
							))}
						</Combobox.Options>
					</Combobox>
				</motion.div>
			</Popover.Panel>
		</Popover>
	)
}

export default LabelSelector
