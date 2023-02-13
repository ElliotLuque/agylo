import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'

const ProjectInfoDialog: React.FC<{
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
	name: string
	description: string
	participantsCount: number
}> = ({ open, setOpen, name, description, participantsCount }) => {
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
								<Dialog.Panel className='w-72 max-w-md overflow-hidden rounded-2xl bg-white p-5 text-left align-middle shadow-xl transition-all'>
									<Dialog.Title
										as='div'
										className='flex items-center gap-3 pb-5'
									>
										<h3 className='text-2xl font-medium leading-6 text-gray-800'>
											{name} details
										</h3>
									</Dialog.Title>
									<div className='flex flex-col justify-center'>
										<p className='text-sm text-gray-500'>{description}</p>
										<div className='flex items-center'>
											<p className='text-sm text-gray-500'>Participants: </p>
											<p className='text-sm text-gray-500'>
												{participantsCount}
											</p>
										</div>
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

export default ProjectInfoDialog
