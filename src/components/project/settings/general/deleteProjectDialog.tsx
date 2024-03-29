import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { trpc } from '../../../../utils/trpc'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'

type DialogProps = {
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
	projectId: number
	projectName: string
}

interface IFormInput {
	name: string
}

const DeleteProjectDialog: React.FC<DialogProps> = ({
	open,
	setOpen,
	projectId,
	projectName,
}) => {
	const trpcUtils = trpc.useContext()

	const router = useRouter()

	const {
		register,
		handleSubmit,
		formState: { isValid },
	} = useForm<IFormInput>({})

	const { mutateAsync: deleteProject } = trpc.project.deleteProject.useMutation(
		{
			onSuccess: () => {
				setOpen(false)
				router.push('/personal/dashboard')
				trpcUtils.project.invalidate()
			},
		},
	)

	const onSubmit = async () => {
		await deleteProject({ id: projectId })
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
								<Dialog.Panel className='w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
									<Dialog.Title
										as='h3'
										className='pb-5 text-2xl font-medium leading-6 text-gray-800'
									>
										Are you sure?
									</Dialog.Title>
									<p>
										This project will be deleted permanently, this action{' '}
										<span className='font-bold'>CANNOT</span> be undone.
									</p>
									<p className='mt-4'>
										Please, type{' '}
										<span className='font-bold'>{projectName}</span> to confirm.
									</p>
									<form className='mt-4' onSubmit={handleSubmit(onSubmit)}>
										<div className='mb-1'>
											<label
												htmlFor='name'
												className='mb-2 block text-base font-medium text-gray-800'
											></label>
											<input
												{...register('name', {
													validate: (value: string) => value === projectName,
												})}
												type='text'
												id='name'
												className={`block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm font-medium text-gray-900 focus:border-red-400
                      focus:outline-none focus:ring-1 focus:ring-red-200`}
											/>
											<div className='mt-3 flex w-full flex-row items-center justify-between'>
												<button
													disabled={!isValid}
													type='submit'
													className={`mt-5 w-full rounded-lg text-base ${
														isValid
															? 'bg-red-500 hover:bg-red-800'
															: 'bg-red-300'
													} px-5 py-2.5 text-center font-bold text-white focus:outline-none focus:ring-4 focus:ring-red-300`}
												>
													Permanently delete this project
												</button>
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

export default DeleteProjectDialog
