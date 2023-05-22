import Link from 'next/link'
import { trpc } from '../utils/trpc'
import { useState } from 'react'
import CreateProjectDialog from '../components/alerts/createProjectDialog'
import { getIconBg } from '../utils/colorSetter'
import {
	BellIcon,
	CheckCircleIcon,
	HomeIcon,
	PlusIcon,
} from '@heroicons/react/24/outline'
import UserAvatar from '../components/misc/userAvatar'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'

const Navbar: React.FC = () => {
	const session = useSession()

	return (
		<div className='mt-3 flex flex-col justify-center gap-6 font-semibold text-gray-800'>
			<div
				onClick={() => signOut()}
				className='mb-5 flex cursor-pointer items-center gap-3.5'
			>
				<UserAvatar
					isInvisible={false}
					imageUrl={session.data?.user?.image as string}
					width={28}
					height={28}
				/>
				<h1 className='text-base text-gray-800 opacity-90'>
					{session.data?.user?.name}
				</h1>
			</div>
			<Link href='/personal/dashboard'>
				<div className='flex items-center gap-3'>
					<HomeIcon className='h-7 w-7' />
					<h1 className='text-lg'>Home</h1>
				</div>
			</Link>
			<Link href='/personal/my-tasks'>
				<div className='flex items-center gap-3'>
					<CheckCircleIcon className='h-7 w-7' />
					<h1 className='text-lg'>My tasks</h1>
				</div>
			</Link>
			<div>
				<div className='flex cursor-default items-center gap-3'>
					<BellIcon className='h-7 w-7 opacity-40' />
					<h1 className='text-lg opacity-40'>
						Inbox <span className='text-sm'>(Coming soon!)</span>
					</h1>
				</div>
			</div>
		</div>
	)
}

const ProjectItem: React.FC<{ name: string; url: string; iconId: number }> = ({
	name,
	url,
	iconId,
}) => {
	return (
		<Link className='flex items-center gap-2 align-middle' href={`/${url}`}>
			<span
				className={`mr-3 mt-1 h-3 w-3 rounded-sm ${getIconBg(iconId)}`}
			></span>
			<p className='text-base font-bold text-gray-800'>{name}</p>
		</Link>
	)
}

const Sidebar: React.FC = () => {
	const { data: userProjects } = trpc.project.listUserProjects.useQuery()

	const [openCreateDialog, setOpenCreateDialog] = useState(false)

	return (
		<>
			<CreateProjectDialog
				open={openCreateDialog}
				setOpen={setOpenCreateDialog}
			/>

			<aside className='fixed top-0 z-10 h-screen w-72 border-r border-gray-200 bg-white'>
				<div className='flex h-full flex-col gap-6 py-4 px-7'>
					<div className='my-5 flex w-full items-center gap-2'>
						<Image src='/agylo.svg' width={50} height={50} alt='logo' />
						{/* eslint-disable-next-line tailwindcss/no-custom-classname */}
						<p className='font-poppins text-3xl font-semibold text-gray-900/95'>
							agylo
						</p>
					</div>
					<Navbar />
					<div className='mt-8'>
						<div className='flex w-full items-center justify-between'>
							<h1 className='text-lg font-medium opacity-70'>Projects</h1>
							<PlusIcon
								onClick={() => setOpenCreateDialog(true)}
								className='h-5 w-5 hover:cursor-pointer'
							/>
						</div>
						<div className='ml-1.5 mt-5 mb-4 flex h-56 flex-col gap-3.5 overflow-auto'>
							{userProjects?.map((project) => {
								return (
									<ProjectItem
										key={project.projectId}
										name={project.project.name}
										url={project.project.url}
										iconId={project.project.iconId}
									/>
								)
							})}
						</div>
					</div>
				</div>
			</aside>
		</>
	)
}

export default Sidebar
