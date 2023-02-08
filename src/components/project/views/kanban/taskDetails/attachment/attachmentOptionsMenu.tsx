import { Menu, Transition } from '@headlessui/react'
import { trpc } from '../../../../../../utils/trpc'
import { EllipsisHorizontalIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Fragment } from 'react'

const AttachmentOptionsMenu: React.FC<{ attachmentKey: string }> = ({
	attachmentKey,
}) => {
	const trpcUtils = trpc.useContext()

	const { mutateAsync: deleteAttachment } =
		trpc.attachments.deleteAttachment.useMutation()

	const handleDeleteAttachment = async () => {
		try {
			await deleteAttachment({ attachmentKey })

			trpcUtils.attachments.getTaskAttachments.invalidate()
			trpcUtils.task.getTaskInfo.invalidate()
			trpcUtils.project.getKanbanData.invalidate()
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<>
			<Menu as='div' className='relative grid place-content-center'>
				<div>
					<Menu.Button className='flex cursor-pointer flex-col items-center justify-center rounded-md p-1 outline-none hover:bg-gray-100'>
						<EllipsisHorizontalIcon className='mt-[0.07rem] h-6 w-6 cursor-pointer text-gray-900 opacity-90' />
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
					<Menu.Items className=' absolute top-6 right-0 z-10 mt-2 w-24 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none'>
						<div className='p-1'>
							<Menu.Item>
								{({ active }) => (
									<button
										onClick={handleDeleteAttachment}
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

export default AttachmentOptionsMenu
