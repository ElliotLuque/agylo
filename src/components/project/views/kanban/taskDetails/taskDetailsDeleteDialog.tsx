import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { Fragment } from 'react'
import LoadingSpinner from '../../../../misc/loadingSpinner'
import { trpc } from '../../../../../utils/trpc'
import { useRouter } from 'next/router'

const TaskDetailsDeleteDialog: React.FC<{
	taskKey: string
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ taskKey, open, setOpen }) => {
	const trpcUtils = trpc.useContext()
	const { mutateAsync: deleteTask, isLoading } =
		trpc.task.deleteTask.useMutation()

	const router = useRouter()
	const { query } = router

	const handleDeleteTask = async (event: React.FormEvent) => {
		event.preventDefault()
		try {
			await deleteTask({ taskKey })
			setOpen(false)
			setTimeout(() => {
				router.push({
					pathname: router.pathname,
					query: { projectUrl: query.projectUrl },
				})
				trpcUtils.project.getKanbanData.invalidate()
			}, 200)
		} catch {
			console.log('Error deleting task')
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
										<ExclamationTriangleIcon className='mt-1 inline-block h-6 w-6 text-red-500' />
										<h3 className='text-xl font-medium leading-6 text-gray-800'>
											Delete task
										</h3>
									</Dialog.Title>
									<p className='text-sm'>
										Are you sure you want to delete this task? All of the data
										related to this task will be removed.
									</p>
									<p className='mt-2 text-sm'>This action cannot be undone.</p>
									<form
										className='mt-8 flex justify-between'
										onSubmit={handleDeleteTask}
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
												className={`rounded-lg bg-red-500 px-5 py-2 text-center text-sm font-bold text-white outline-none focus:ring-4 focus:ring-red-300 hover:bg-red-800 dark:bg-red-600 dark:focus:ring-red-800 dark:hover:bg-red-700`}
											>
												Delete task
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

export default TaskDetailsDeleteDialog
