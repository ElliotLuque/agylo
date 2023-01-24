import Link from 'next/link'

const Header: React.FC<{ name: string; description: string; url: string }> = ({
	name,
	url,
}) => {
	return (
		<header className='z-10 flex w-full flex-row flex-wrap items-center justify-between p-2'>
			<div className='flex flex-row items-center gap-4'>
				<h1 className='text-lg'>{name}</h1>
			</div>
			<div className='flex flex-row items-center gap-4'>
				<Link
					href={{
						pathname: '/[projectUrl]/settings',
						query: { projectUrl: url },
					}}
				>
					<h1 className='text-lg'>Project configuration</h1>
				</Link>
			</div>
		</header>
	)
}

export default Header
