import type { GetServerSideProps, NextPage } from 'next'
import { signIn } from 'next-auth/react'
import { getServerAuthSession } from '../server/common/get-server-auth-session'
import Link from 'next/link'
import Image from 'next/image'
import {
	CurrencyDollarIcon,
	PresentationChartBarIcon,
	UserGroupIcon,
} from '@heroicons/react/24/solid'
import { Icon, Metric, Text } from '@tremor/react'

const LandingPage: NextPage = () => {
	return (
		<div className='w-full bg-white bg-gradient-to-b from-white to-gray-100'>
			<div className='m-auto max-w-6xl '>
				<header>
					<nav className='fixed inset-x-0 flex flex-wrap items-center justify-between border-b border-gray-200 bg-white/30 py-6 px-52 drop-shadow-sm backdrop-blur-sm'>
						<Link
							className='mr-6 flex shrink-0 flex-row items-center text-white'
							href='/'
						>
							<div className='flex w-full items-center justify-center gap-2'>
								<Image src='/agylo.svg' width={45} height={45} alt='logo' />
								{/* eslint-disable-next-line tailwindcss/no-custom-classname */}
								<p className='font-poppins text-2xl font-semibold text-gray-900/95'>
									agylo
								</p>
							</div>
						</Link>
						<div className='flex items-center gap-2'>
							<button
								className=' inline-flex items-center gap-2 px-4 py-3 font-semibold text-gray-800/90 no-underline transition'
								onClick={() => signIn()}
							>
								Sign in
							</button>
							<button
								// eslint-disable-next-line tailwindcss/no-custom-classname
								className='rounded-md bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 bg-size-200 bg-pos-0 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:scale-110 hover:bg-pos-100'
								onClick={() => signIn()}
							>
								Get started
							</button>
						</div>
					</nav>
				</header>
				<main className='flex min-h-screen flex-col items-center '>
					<div className='mt-36 flex flex-col items-center justify-center '>
						{/* eslint-disable-next-line tailwindcss/no-custom-classname */}
						<h1 className='px-10 text-center font-poppins text-[5.5rem] font-extrabold leading-tight tracking-normal text-gray-900/95'>
							Organize your work with{' '}
							<span className='bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent'>
								agylo
							</span>
						</h1>
						<h2 className='mt-7 w-[40rem] text-center text-xl font-semibold text-gray-600/70'>
							Collaborate seamlessly and achieve optimal results with our
							intuitive project management app that simplifies task management.
						</h2>
						<button
							// eslint-disable-next-line tailwindcss/no-custom-classname
							className='mt-8 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 bg-size-200 bg-pos-0 px-10 py-3 text-lg font-semibold text-white transition-all hover:scale-110 hover:bg-pos-100'
							onClick={() => signIn()}
						>
							Get started
						</button>
					</div>
					<div className='my-12 flex flex-col items-center justify-center overflow-hidden rounded-xl border-gray-100 bg-white px-2 pt-5 shadow'>
						<Image
							alt='landing page image'
							src='/kanban-animation.gif'
							width={1400}
							height={1000}
						/>
					</div>
					<div className='mb-24 flex items-center gap-20'>
						<div className='flex items-center gap-4'>
							<Icon
								icon={PresentationChartBarIcon}
								size='xl'
								color='indigo'
								variant='shadow'
							/>
							<div className='flex flex-col justify-center'>
								<Metric className='text-xl'>Task and project management</Metric>
								<Text className='w-72 text-base'>
									Create as many projects as you want and manage them with
									kanban boards.
								</Text>
							</div>
						</div>
						<div className='flex items-center gap-4'>
							<Icon
								icon={UserGroupIcon}
								size='xl'
								color='indigo'
								variant='shadow'
							/>
							<div className='flex flex-col justify-center'>
								<Metric className='text-xl'>Collaboration</Metric>
								<Text className='w-52 text-base'>
									Invite your team members and collaborate altogether.
								</Text>
							</div>
						</div>
						<div className='flex items-center gap-4'>
							<Icon
								icon={CurrencyDollarIcon}
								size='xl'
								color='indigo'
								variant='shadow'
							/>
							<div className='flex flex-col justify-center'>
								<Metric className='text-xl'>Completely free</Metric>
								<Text className='w-52 text-base'>
									Unlimited projects and participants for free.
								</Text>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	)
}

export default LandingPage

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { req, res } = context
	const session = await getServerAuthSession({ req, res })

	if (session) {
		return {
			redirect: {
				destination: '/personal/dashboard',
				permanent: false,
			},
		}
	}

	return {
		props: { session },
	}
}
