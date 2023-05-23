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
	QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import UserMenu from './userMenu'

const Navbar: React.FC = () => {
	return (
		<div className='mt-3 flex flex-col justify-center gap-6 font-semibold text-gray-800'>
			<UserMenu />
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
				<div className='flex h-full flex-col justify-between px-7'>
					<div className='h-full flex-col gap-6 py-4 '>
						<Link
							href={'/personal/dashboard'}
							className='mt-5 mb-14 flex w-full items-center gap-2'
						>
							<Image src='/agylo.svg' width={50} height={50} alt='logo' />
							{/* eslint-disable-next-line tailwindcss/no-custom-classname */}
							<p className='font-poppins text-3xl font-semibold text-gray-900/95'>
								agylo
							</p>
						</Link>
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
					<Link
						href={'https://github.com/ElliotLuque/agylo'}
						className='my-5 flex items-center gap-2 hover:underline'
					>
						<QuestionMarkCircleIcon className='mt-0.5 h-5 w-5 opacity-50' />
						<p className='text-sm font-semibold opacity-50'>Help & feedback</p>
					</Link>
				</div>
			</aside>
		</>
	)
}

export default Sidebar
