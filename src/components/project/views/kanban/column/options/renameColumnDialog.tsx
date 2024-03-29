import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect } from 'react'
import { trpc } from '../../../../../../utils/trpc'
import { useForm } from 'react-hook-form'
import LoadingSpinner from '../../../../../misc/loadingSpinner'

const RenameColumnDialog: React.FC<{
	columnId: number
	columnName: string
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ columnId, columnName, open, setOpen }) => {
	const trpcUtils = trpc.useContext()
	const {
		register,
		handleSubmit,
		reset,
		formState: { isValid },
	} = useForm<{ newName: string }>()

	const { mutateAsync: renameColumn, isLoading } =
		trpc.column.renameColumn.useMutation()

	const handleRenameColumn = async (data: { newName: string }) => {
		try {
			await renameColumn({ columnId, name: data.newName })
			setOpen(false)

			trpcUtils.project.getKanbanData.invalidate()
			trpcUtils.column.invalidate()
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		reset({ newName: columnName })
	}, [columnName, reset])

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
								<Dialog.Panel className=' w-96 max-w-md overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
									<Dialog.Title
										as='div'
										className='flex items-center gap-3 pb-3'
									>
										<h3 className='text-xl font-medium leading-6 text-gray-800'>
											Rename column
										</h3>
									</Dialog.Title>
									<p className='text-sm'>Change the name of this column.</p>
									<form
										className='mt-5'
										onSubmit={handleSubmit(handleRenameColumn)}
									>
										<div className='mb-1'>
											<label
												htmlFor='name'
												className='mb-2 block text-base font-medium text-gray-800'
											></label>
											<input
												{...register('newName', {
													required: {
														value: true,
														message: 'Name is required',
													},
												})}
												type='text'
												id='name'
												className={`block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm font-medium text-gray-900 ${
													!isValid
														? 'border-red-400 bg-red-50 focus:ring-red-200'
														: 'focus:border-indigo-400 focus:ring-indigo-200'
												}
                      							focus:outline-none focus:ring-1 `}
											/>
											{!isValid && (
												<p className='mt-2 text-sm font-medium text-red-400'>
													Please enter a name
												</p>
											)}
											<div className='mt-3 flex w-full flex-row items-center'>
												{isLoading ? (
													<LoadingSpinner classNames='p-1 h-8 w-8 animate-spin fill-indigo-500 text-gray-200' />
												) : (
													<span className='h-8 w-8 p-1' />
												)}
												<div className='flex w-full items-center justify-end gap-3'>
													<button
														onClick={() => {
															setOpen(false)
														}}
														type='button'
														className={`mt-3 rounded-lg  border 
													 border-gray-200 bg-white px-5 py-2.5 text-center text-sm font-medium text-gray-500 focus:outline-none focus:ring-4 focus:ring-indigo-300`}
													>
														Cancel
													</button>
													<button
														disabled={!isValid}
														type='submit'
														className={`mt-3 rounded-lg  px-5 ${
															isValid ? 'bg-indigo-500' : 'bg-indigo-300'
														}
													 py-2.5 text-center text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-indigo-300`}
													>
														Rename column
													</button>
												</div>
											</div>
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

export default RenameColumnDialog
