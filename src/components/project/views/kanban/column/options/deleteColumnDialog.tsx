import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { trpc } from '../../../../../../utils/trpc'
import LoadingSpinner from '../../../../../misc/loadingSpinner'
import ColumnListSelector from './columnListSelector'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { SelectColumn } from '../../../../../../types/kanban-delete'
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid'

const DeleteColumnDialog: React.FC<{
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
	columnDeleteId: number
	columnDeleteName: string
	columnDeleteTasksCount: number
	availableColumns: SelectColumn[]
}> = ({
	open,
	setOpen,
	columnDeleteId,
	columnDeleteName,
	columnDeleteTasksCount,
	availableColumns,
}) => {
	const trpcUtils = trpc.useContext()

	const { mutateAsync: deleteColumnWithTasks } =
		trpc.column.deleteColumnAndReorderTasks.useMutation()

	const { mutateAsync: deleteColumn, isLoading } =
		trpc.column.deleteColumn.useMutation()

	const { mutateAsync: deleteColumnAndTasks } =
		trpc.column.deleteColumnAndTasks.useMutation()

	const [selectedColumn, setSelectedColumn] = useState<SelectColumn>(
		availableColumns[0] as SelectColumn,
	)

	const tasksSubmit = async () => {
		try {
			await deleteColumnWithTasks({
				columnId: columnDeleteId,
				newColumnId: selectedColumn.id,
			})
			trpcUtils.project.invalidate()
			setOpen(false)
		} catch (error) {
			console.log(error)
		}
	}

	const noTasksSubmit = async () => {
		try {
			await deleteColumn({ columnId: columnDeleteId })
			trpcUtils.project.invalidate()
			setOpen(false)
		} catch (error) {
			console.log(error)
		}
	}

	const fullDeleteSubmit = async () => {
		try {
			await deleteColumnAndTasks({
				columnId: columnDeleteId,
			})
			trpcUtils.project.invalidate()
			setOpen(false)
		} catch (error) {
			console.log(error)
		}
	}

	if (availableColumns.length <= 0 && columnDeleteTasksCount > 0) {
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
							<div className='fixed inset-0 bg-black bg-opacity-25' />
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
									<Dialog.Panel className=' max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
										<Dialog.Title
											as='div'
											className='flex items-center gap-3 pb-5'
										>
											<ExclamationTriangleIcon className='mt-1 inline-block h-6 w-6 text-red-500' />
											<h3 className='text-xl font-medium leading-6 text-gray-800'>
												Delete column and tasks
											</h3>
										</Dialog.Title>
										<p className='text-sm'>
											<span className='font-bold'>Warning!</span> This column
											contains tasks and it&apos;s the only column remaining.
										</p>
										<p className='mt-3 text-sm'>
											You will delete the column and all tasks in it.
										</p>
										<form
											className='mt-8 flex justify-between'
											onSubmit={fullDeleteSubmit}
										>
											{isLoading ? (
												<LoadingSpinner classNames='p-1 h-8 w-8 animate-spin fill-indigo-500 text-gray-200 dark:text-gray-600' />
											) : (
												<span className='h-8 w-8 p-1' />
											)}
											<div className='flex items-center gap-3'>
												<button
													onClick={() => {
														setOpen(false)
													}}
													type='button'
													className='w-full rounded-lg border border-gray-200 bg-white px-5 py-2 text-center text-sm font-medium text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-300 hover:bg-gray-100 dark:bg-blue-600 dark:focus:ring-blue-800 dark:hover:bg-blue-700 sm:w-auto'
												>
													Cancel
												</button>
												<button
													type='submit'
													className={`rounded-lg bg-red-500 px-5 py-2 text-center text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-red-300 hover:bg-red-800 dark:bg-red-600 dark:focus:ring-red-800 dark:hover:bg-red-700`}
												>
													Delete column and tasks
												</button>
											</div>
										</form>
									</Dialog.Panel>
								</Transition.Child>
							</div>
						</div>
					</Dialog>
				</Transition>
			</>
		)
	}

	if (columnDeleteTasksCount > 0) {
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
							<div className='fixed inset-0 bg-black bg-opacity-25' />
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
									<Dialog.Panel className='max-w-md transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
										<Dialog.Title
											as='div'
											className='flex items-center gap-3 pb-5'
										>
											<ExclamationTriangleIcon className='mt-1 inline-block h-6 w-6 text-red-500' />
											<h3 className='text-xl font-medium leading-6 text-gray-800'>
												Relocate tasks to another column
											</h3>
										</Dialog.Title>

										<p className='text-sm text-gray-900'>
											This column contains tasks, please select a column to move
											the current tasks.
										</p>
										<div className='mt-9 flex items-center justify-between'>
											<div className='flex w-28 flex-col items-center justify-center gap-3'>
												<span className='select-none rounded-lg bg-gray-100 p-2 text-xs line-through'>
													{columnDeleteName}
												</span>
												<p className='text-xs font-medium text-red-500'>
													Will be deleted
												</p>
											</div>
											<ArrowRightIcon className='h-5 w-5' />
											<ColumnListSelector
												selectedColumn={selectedColumn}
												setSelectedColumn={setSelectedColumn}
												columns={availableColumns}
											/>
										</div>
										<form
											className='mt-8 flex justify-between'
											onSubmit={tasksSubmit}
										>
											{isLoading ? (
												<LoadingSpinner classNames='p-1 h-8 w-8 animate-spin fill-indigo-500 text-gray-200 dark:text-gray-600' />
											) : (
												<span className='h-8 w-8 p-1' />
											)}
											<div className='flex items-center gap-3'>
												<button
													onClick={() => {
														setOpen(false)
													}}
													type='button'
													className='w-full rounded-lg border border-gray-200 bg-white px-5 py-2 text-center text-sm font-medium text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-300 hover:bg-gray-100 dark:bg-blue-600 dark:focus:ring-blue-800 dark:hover:bg-blue-700 sm:w-auto'
												>
													Cancel
												</button>
												<button
													type='submit'
													className={`rounded-lg bg-red-500 px-5 py-2 text-center text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-red-300 hover:bg-red-800 dark:bg-red-600 dark:focus:ring-red-800 dark:hover:bg-red-700`}
												>
													Delete column
												</button>
											</div>
										</form>
									</Dialog.Panel>
								</Transition.Child>
							</div>
						</div>
					</Dialog>
				</Transition>
			</>
		)
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
						<div className='fixed inset-0 bg-black bg-opacity-25' />
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
								<Dialog.Panel className=' max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
									<Dialog.Title
										as='div'
										className='flex items-center gap-3 pb-5'
									>
										<ExclamationTriangleIcon className='mt-1 inline-block h-6 w-6 text-red-500' />
										<h3 className='text-xl font-medium leading-6 text-gray-800'>
											Delete column
										</h3>
									</Dialog.Title>
									<p className='text-sm'>
										This column doesn't contain tasks, you can safely delete it.
									</p>
									<form
										className='mt-8 flex justify-between'
										onSubmit={noTasksSubmit}
									>
										{isLoading ? (
											<LoadingSpinner classNames='p-1 h-8 w-8 animate-spin fill-indigo-500 text-gray-200 dark:text-gray-600' />
										) : (
											<span className='h-8 w-8 p-1' />
										)}
										<div className='flex items-center gap-3'>
											<button
												onClick={() => {
													setOpen(false)
												}}
												type='button'
												className='w-full rounded-lg border border-gray-200 bg-white px-5 py-2 text-center text-sm font-medium text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-300 hover:bg-gray-100 dark:bg-blue-600 dark:focus:ring-blue-800 dark:hover:bg-blue-700 sm:w-auto'
											>
												Cancel
											</button>
											<button
												type='submit'
												className={`rounded-lg bg-red-500 px-5 py-2 text-center text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-red-300 hover:bg-red-800 dark:bg-red-600 dark:focus:ring-red-800 dark:hover:bg-red-700`}
											>
												Delete column
											</button>
										</div>
									</form>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	)
}

export default DeleteColumnDialog
