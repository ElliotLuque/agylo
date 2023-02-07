import Link from 'next/link'
import { getIconBg } from '../utils/colorSetter'
import { Cog6ToothIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import {
	InformationCircleIcon,
	UserPlusIcon,
} from '@heroicons/react/24/outline'
import ProjectInfoDialog from '../components/project/projectInfoDialog'
import { useState } from 'react'
import type { ParticipantsInfo } from '../pages/[projectUrl]'
import Image from 'next/image'
import HeaderSkeletonLoader from './headerSkeletonLoader'

const Header: React.FC<{
	name: string
	description: string
	url: string
	isLoading: boolean
	iconId: number
	participants: ParticipantsInfo
	participantsCount: number
}> = ({
	name,
	description,
	url,
	iconId,
	isLoading,
	participants,
	participantsCount,
}) => {
	const [openDialog, setOpenDialog] = useState(false)

	return isLoading ? (
		<HeaderSkeletonLoader />
	) : (
		<>
			<ProjectInfoDialog
				open={openDialog}
				setOpen={setOpenDialog}
				name={name}
				description={description}
			/>
			<header className='flex w-full flex-wrap items-center justify-between p-2'>
				<div className='flex items-center gap-4'>
					<span className={`mt-1 h-10 w-10 rounded-md ${getIconBg(iconId)}`} />
					<h1 className='text-4xl font-semibold text-gray-800'>{name}</h1>
					<InformationCircleIcon
						onClick={() => setOpenDialog(true)}
						className='mt-3 h-5 w-5 cursor-pointer stroke-2 text-gray-800/50'
					/>
				</div>
				<div className='flex h-full items-center gap-5'>
					<div className='flex flex-row-reverse items-center'>
						{participants?.length >= 4 && (
							<span className='flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-xs font-medium text-white'>
								{participantsCount - 3}
							</span>
						)}
						{participants?.map((participant, index) => (
							<Image
								key={index}
								className='z-[2] ml-[-0.4rem] rounded-full'
								width={35}
								height={35}
								src={participant.user.image as string}
								alt={participant.user.name + 'image'}
							/>
						))}
					</div>
					<button className='flex items-center gap-2 rounded-lg border-2 p-2'>
						<UserPlusIcon className='h-4 w-4 stroke-2 text-gray-800/70' />
						<p className='text-xs font-medium text-gray-800/70'>
							Invite people
						</p>
					</button>
					<span className='h-[70%] w-[0.1rem] bg-gray-100' />
					<div className='flex items-center gap-2 rounded-lg border-2 p-2'>
						<input
							type='text'
							className='w-32 text-sm text-gray-700 outline-none'
							placeholder='Search...'
						/>
						<MagnifyingGlassIcon className='mt-0.5 h-3.5 w-3.5 cursor-pointer stroke-2 text-gray-800 placeholder:font-medium' />
					</div>
					<Link
						className='flex items-center gap-2 font-semibold text-gray-800 hover:text-gray-900'
						href={{
							pathname: '/[projectUrl]/settings',
							query: { projectUrl: url },
						}}
					>
						<Cog6ToothIcon className='h-5 w-5' />
						<h1 className='text-lg'>Configuration</h1>
					</Link>
				</div>
			</header>
		</>
	)
}

export default Header
