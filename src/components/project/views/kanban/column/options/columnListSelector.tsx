import { Listbox, Transition } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/24/outline'
import { Fragment } from 'react'
import type { SelectColumn } from '../../../../../../types/kanban-delete'

const ColumnListSelector: React.FC<{
	setSelectedColumn: React.Dispatch<React.SetStateAction<SelectColumn>>
	selectedColumn: SelectColumn
	columns: SelectColumn[]
}> = ({ selectedColumn, setSelectedColumn, columns }) => {
	return (
		<div className='w-44'>
			<Listbox
				value={selectedColumn}
				onChange={(changeColumn) => {
					setSelectedColumn(changeColumn)
				}}
			>
				<div className='relative '>
					<Listbox.Button className='relative w-full cursor-default rounded-lg bg-white p-3 pr-9 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm'>
						<div className='flex items-center justify-between'>
							<span className='block truncate text-xs'>
								{selectedColumn?.name}
							</span>
							<span className='text-[0.65rem] text-gray-500'>
								{selectedColumn?.tasksCount} tasks
							</span>
						</div>

						<span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
							<ChevronUpDownIcon
								className='h-5 w-5 text-gray-400'
								aria-hidden='true'
							/>
						</span>
					</Listbox.Button>
					<Transition
						as={Fragment}
						leave='transition ease-in duration-100'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'
					>
						{/* eslint-disable-next-line tailwindcss/no-custom-classname*/}
						<Listbox.Options className='scroll scrollbar-thumb-rounded-md absolute mt-1 max-h-44 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg outline-none ring-1 ring-black/5 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-indigo-400 sm:text-sm'>
							{columns.map((column, colIndex) => (
								<Listbox.Option
									key={colIndex}
									className={({ active }) =>
										`relative cursor-default select-none overflow-visible py-2 pl-4 pr-4 ${
											active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'
										}`
									}
									value={column}
								>
									{({ selected }) => (
										<div className='flex items-center justify-between'>
											<span
												className={`block truncate ${
													selected ? 'font-bold' : 'font-normal'
												}`}
											>
												{column.name}
											</span>
											<span>
												{column.tasksCount > 0 && (
													<span className='text-[0.65rem] text-gray-500'>
														{column.tasksCount} tasks
													</span>
												)}
											</span>
										</div>
									)}
								</Listbox.Option>
							))}
						</Listbox.Options>
					</Transition>
				</div>
			</Listbox>
		</div>
	)
}

export default ColumnListSelector
