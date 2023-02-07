import { Menu, Transition } from '@headlessui/react'
import { EllipsisHorizontalIcon, TrashIcon } from '@heroicons/react/24/outline'
import { ShareIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/router'
import { Fragment, useState } from 'react'
import { useCopyToClipboard } from 'usehooks-ts'
import Toast from '../../../../alerts/toast'
import TaskDetailsDeleteDialog from './taskDetailsDeleteDialog'

const TaskDetailsMenu: React.FC<{ taskKey: string }> = ({ taskKey }) => {
	const router = useRouter()
	const path = router.asPath

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [value, copyValue] = useCopyToClipboard()

	const [openToast, setOpenToast] = useState(false)
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

	return (
		<>
			<Toast
				isOpen={openToast}
				error={false}
				message='Copied to clipboard!'
				classNames='fixed right-[-20rem]'
			/>
			<TaskDetailsDeleteDialog
				open={openDeleteDialog}
				setOpen={setOpenDeleteDialog}
				taskKey={taskKey}
			/>
			<Menu as='div' className='relative z-10 grid place-content-center'>
				<div>
					<Menu.Button className='flex cursor-pointer flex-col items-center justify-center rounded-md p-1 outline-none hover:bg-gray-100'>
						<EllipsisHorizontalIcon className='mt-[0.07rem] h-5 w-5 cursor-pointer text-gray-900 opacity-80' />
					</Menu.Button>
				</div>
				<Transition
					as={Fragment}
					enter='transition ease-out duration-100'
					enterFrom='transform opacity-0 scale-95'
					enterTo='transform opacity-100 scale-100'
					leave='transition ease-in duration-75'
					leaveFrom='transform opacity-100 scale-100'
					leaveTo='transform opacity-0 scale-95'
				>
					<Menu.Items className='absolute top-6 right-2 mt-2 w-32 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none'>
						<div className='p-1'>
							<Menu.Item>
								{({ active }) => (
									<button
										onClick={() => {
											copyValue('localhost:3000' + path)
											setOpenToast(true)
											setTimeout(() => {
												setOpenToast(false)
											}, 1500)
										}}
										className={`${
											active ? 'bg-gray-100' : 'bg-white'
										} group flex  w-full items-center justify-between gap-1 rounded-md p-2 text-sm text-gray-800`}
									>
										<p className='select-none'>Share</p>
										<ShareIcon className='h-3.5 w-3.5 text-gray-900 opacity-70' />
									</button>
								)}
							</Menu.Item>
							<Menu.Item>
								{({ active }) => (
									<button
										onClick={() => setOpenDeleteDialog(true)}
										className={`${
											active ? 'bg-gray-100' : 'bg-white'
										} group flex w-full items-center justify-between gap-1 rounded-md p-2 text-sm text-gray-800`}
									>
										<p className='select-none'>Delete</p>
										<TrashIcon className='h-4 w-4 text-red-500' />
									</button>
								)}
							</Menu.Item>
						</div>
					</Menu.Items>
				</Transition>
			</Menu>
		</>
	)
}

export default TaskDetailsMenu
