import { Dialog, Transition } from '@headlessui/react'
import {
	CalendarDaysIcon,
	CheckCircleIcon,
	UserIcon,
} from '@heroicons/react/24/outline'
import { Flex, Icon, Metric, Subtitle, Title, Text } from '@tremor/react'
import { Fragment } from 'react'
import dayjs from 'dayjs'

const ProjectInfoDialog: React.FC<{
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
	name: string
	description: string
	participantsCount: number
	taskCount: number
	projectKey: string
	createdAt: Date
}> = ({
	open,
	setOpen,
	name,
	description,
	participantsCount,
	taskCount,
	projectKey,
	createdAt,
}) => {
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
								<Dialog.Panel className='w-[50rem] max-w-md overflow-hidden rounded-2xl bg-white p-5 text-left align-middle shadow-xl transition-all'>
									<Dialog.Title
										as='div'
										className='flex flex-col justify-center gap-1 pb-5'
									>
										<Title className='text-3xl font-bold'>{name} details</Title>
										<Subtitle
											className={`${!description && 'italic'} text-gray-500`}
										>
											{description || 'No description'}
										</Subtitle>
									</Dialog.Title>
									<div className='flex flex-col justify-center gap-5'>
										<Flex
											justifyContent='start'
											alignItems='center'
											className='h-full gap-12 space-x-4'
										>
											<div className='flex items-center gap-2'>
												<Icon
													icon={UserIcon}
													size='lg'
													color='indigo'
													variant='light'
												/>
												<div className='truncate'>
													<Text className='text-base'>Participants</Text>
													<Metric className='text-2xl'>
														{participantsCount}
													</Metric>
												</div>
											</div>
											<div className='flex items-center gap-2'>
												<Icon
													icon={CheckCircleIcon}
													size='lg'
													color='indigo'
													variant='light'
												/>
												<div className='truncate'>
													<Text className='text-base'>Total tasks created</Text>
													<Metric className='text-2xl'>{taskCount}</Metric>
												</div>
											</div>
										</Flex>

										<div className='flex items-center gap-2'>
											<Icon
												icon={UserIcon}
												size='lg'
												color='indigo'
												variant='light'
											/>
											<div className='truncate'>
												<Text className='text-base'>Project key</Text>
												<Metric className='text-2xl'>{projectKey}</Metric>
											</div>
										</div>
										<div className='flex items-center gap-2'>
											<Icon
												icon={CalendarDaysIcon}
												size='lg'
												color='indigo'
												variant='light'
											/>
											<div className='truncate'>
												<Text className='text-base'>Created at</Text>
												<Metric className='text-xl'>
													{String(dayjs(createdAt).format('DD/MM/YYYY'))}
												</Metric>
											</div>
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
