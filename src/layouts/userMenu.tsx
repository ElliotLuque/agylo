import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import UserAvatar from '../components/misc/userAvatar'
import { signOut, useSession } from 'next-auth/react'
import { Cog8ToothIcon } from '@heroicons/react/24/solid'
import { ArrowLeftOnRectangleIcon, UserIcon } from '@heroicons/react/24/outline'

const UserMenu: React.FC = () => {
	const session = useSession()

	return (
		<Menu as='div' className='relative z-10'>
			<Menu.Button className='mb-5 flex w-full cursor-pointer items-center gap-3.5 rounded-md outline-none'>
				<UserAvatar
					isInvisible={false}
					imageUrl={session.data?.user?.image as string}
					width={28}
					height={28}
				/>
				<h1 className='text-base text-gray-800 opacity-90'>
					{session.data?.user?.name}
				</h1>
			</Menu.Button>

			<Transition
				as={Fragment}
				enter='transition ease-out duration-100'
				enterFrom='transform opacity-0 scale-95'
				enterTo='transform opacity-100 scale-100'
				leave='transition ease-in duration-75'
				leaveFrom='transform opacity-100 scale-100'
				leaveTo='transform opacity-0 scale-95'
			>
				<Menu.Items className='absolute top-6 mt-2 w-40 origin-top-left divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none'>
					<div className='p-1'>
						<Menu.Item disabled>
							{({ active }) => (
								<button
									onClick={() => {
										return
									}}
									className={`${
										active ? 'bg-gray-100' : 'bg-white'
									} group flex  w-full items-center gap-1 rounded-md p-2 text-[0.85rem] text-gray-400`}
								>
									<Cog8ToothIcon className='h-6 w-6 ' />
									<p className='select-none'>Options</p>
								</button>
							)}
						</Menu.Item>
						<Menu.Item disabled>
							{({ active }) => (
								<button
									onClick={() => {
										return
									}}
									className={`${
										active ? 'bg-gray-100' : 'bg-white'
									} group flex  w-full items-center gap-1 rounded-md p-2 text-[0.85rem] text-gray-400`}
								>
									<UserIcon className='h-6 w-6 ' />
									<p className='select-none'>Profile</p>
								</button>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<button
									onClick={() => signOut()}
									className={`${
										active ? 'bg-gray-100' : 'bg-white'
									} group flex w-full items-center gap-1 rounded-md p-2 text-[0.85rem] text-gray-800`}
								>
									<ArrowLeftOnRectangleIcon className='h-6 w-6 text-gray-900' />
									<p className='select-none'>Sign out</p>
								</button>
							)}
						</Menu.Item>
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	)
}

export default UserMenu
