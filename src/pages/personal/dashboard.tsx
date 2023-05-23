import type { GetServerSideProps } from 'next'
import { type ReactElement } from 'react'
import prettyBytes from 'pretty-bytes'
import { protectedPage } from '../../server/common/protected-page'
import { trpc } from '../../utils/trpc'
import type { NextPageWithLayout } from '../_app'
import Head from 'next/head'
import Layout from '../../layouts/layout'
import {
	AreaChart,
	BarChart,
	Card,
	Col,
	DonutChart,
	Flex,
	Grid,
	Icon,
	Legend,
	Metric,
	Subtitle,
	Text,
	Title,
} from '@tremor/react'
import { useSession } from 'next-auth/react'
import {
	CheckCircleIcon,
	DocumentIcon,
	Square3Stack3DIcon,
} from '@heroicons/react/24/outline'
import relativeTime from 'dayjs/plugin/relativeTime'
import type { IActivityItem } from '../../server/trpc/router/project'
import UserAvatar from '../../components/misc/userAvatar'

import Link from 'next/link'
import { env } from '../../env/client.mjs'
import { getIconFg } from '../../utils/colorSetter'

import dayjs from 'dayjs'
dayjs.extend(relativeTime)

function formatRelativeDate(date: Date) {
	const currentDate = dayjs()
	const targetDate = dayjs(date)

	if (targetDate.isSame(currentDate, 'day')) {
		return 'Today, ' + targetDate.format('HH:mm')
	} else if (targetDate.isSame(currentDate.subtract(1, 'day'), 'day')) {
		return 'Yesterday, ' + targetDate.format('HH:mm')
	} else {
		return targetDate.fromNow() + ', ' + targetDate.format('HH:mm')
	}
}

const AttachmentActivityItem: React.FC<{
	filename: string
	filesize: number
	taskKey: string
	url: string
	iconId: number
}> = ({ filename, filesize, taskKey, url, iconId }) => {
	return (
		<div className='mb-8 flex items-center gap-1'>
			<div className='flex w-72 flex-col gap-5'>
				<p className='font-semibold text-gray-600'>
					Added a file to{' '}
					<Link
						href={`${env.NEXT_PUBLIC_URL}/${url}`}
						className={`text-sm font-bold ${getIconFg(iconId)}`}
					>
						{taskKey}
					</Link>
				</p>
				<div className='w-72 rounded-xl p-3 shadow-md'>
					<div className='flex items-start gap-3'>
						<Icon icon={DocumentIcon} size='lg' color='indigo' />
						<div className='flex flex-col justify-center truncate'>
							<p className='font-semibold'>{filename}</p>
							<p className='text-sm font-medium text-gray-400'>
								{prettyBytes(filesize)}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

const CommentActivityItem: React.FC<{
	commentBody: string
	taskKey: string
	url: string
	iconId: number
}> = ({ commentBody, taskKey, url, iconId }) => {
	return (
		<div className='mb-8 flex items-center gap-1'>
			<div className='flex w-72 flex-col gap-5'>
				<p className='font-semibold text-gray-600'>
					Commented on{' '}
					<Link
						href={`${env.NEXT_PUBLIC_URL}/${url}`}
						className={`text-sm font-bold ${getIconFg(iconId)}`}
					>
						{taskKey}
					</Link>
				</p>
				<p className='rounded-lg bg-gray-50 p-3 font-semibold'>{commentBody}</p>
			</div>
		</div>
	)
}

const ActivityItem: React.FC<{ data: IActivityItem }> = ({ data }) => {
	return (
		<div className='flex items-start gap-4'>
			<div className='flex h-full flex-col items-center'>
				<UserAvatar height={54} width={54} imageUrl={data.author.image} />
				<span className='h-full border-l-[3px] border-dashed border-gray-300'></span>
			</div>
			<div className='flex w-full flex-col justify-center gap-4'>
				<div className='flex flex-col justify-center'>
					<p className='text-lg font-semibold'>{data.author.name}</p>
					<p className='text-sm text-gray-500'>
						{formatRelativeDate(data.createdAt)}
					</p>
				</div>
				<div className='flex flex-col justify-center'>
					{data.attachments ? (
						<AttachmentActivityItem
							filename={data.attachments.filename}
							filesize={data.attachments.filesize ?? 1}
							taskKey={data.taskKey}
							url={data.activityUrl}
							iconId={data.iconId}
						/>
					) : (
						<CommentActivityItem
							commentBody={data.comments?.body as string}
							taskKey={data.taskKey}
							url={data.activityUrl}
							iconId={data.iconId}
						/>
					)}
				</div>
			</div>
		</div>
	)
}

const Dashboard: NextPageWithLayout = () => {
	const { data: priorities } = trpc.task.assignedTasksByPriority.useQuery()
	const { data: tasksByProject } = trpc.task.assignedTasksByProject.useQuery()
	const { data: userProjectsCount } = trpc.project.countUserProjects.useQuery()
	const { data: userTasksCount } = trpc.task.totalTasksInMyProjects.useQuery()
	const { data: lastWeekTasks } = trpc.task.lastWeekTasks.useQuery()
	const { data: activity } = trpc.project.getDashboardActivity.useQuery()

	const session = useSession()

	return (
		<>
			<Head>
				<title>Dashboard - Agylo</title>
			</Head>
			<section className='mx-12 my-4 flex w-full flex-col flex-nowrap p-6'>
				<div className='flex flex-col flex-wrap justify-center'>
					<h1 className='text-3xl font-bold'>Dashboard</h1>
					<h2 className='ml-1 text-lg text-gray-900/90'>
						Welcome, {session.data?.user?.name}!
					</h2>
				</div>
				<div className='mt-12 flex w-full items-center gap-5'>
					<Grid numCols={3} className='h-full w-full gap-x-5 gap-y-8'>
						<Col numColSpan={2}>
							<Card>
								<Title className='font-bold'>Assigned tasks by project</Title>
								<BarChart
									className='mt-5 h-[20.5rem] w-full'
									index='name'
									yAxisWidth={20}
									categories={['Tasks']}
									colors={['indigo']}
									// eslint-disable-next-line @typescript-eslint/no-explicit-any
									data={tasksByProject as any[]}
								/>
							</Card>
						</Col>
						<Card>
							<Title className='font-bold'>Assigned tasks by priority</Title>
							<div className='flex flex-col items-center justify-center gap-6'>
								<DonutChart
									// eslint-disable-next-line @typescript-eslint/no-explicit-any
									data={priorities as any[]}
									className='mt-5 h-72 w-72'
									index='name'
									label=' '
									colors={['sky', 'amber', 'rose']}
								/>
								<Legend
									categories={['Low', 'Medium', 'High']}
									colors={['sky', 'amber', 'rose']}
								/>
							</div>
						</Card>
						<Col className='flex flex-col gap-5'>
							<Card
								decoration='top'
								decorationColor='indigo'
								className='h-full'
							>
								<Flex
									justifyContent='start'
									alignItems='center'
									className=' h-full space-x-4'
								>
									<Icon
										icon={CheckCircleIcon}
										size='xl'
										color='indigo'
										variant='light'
									/>
									<div className='truncate'>
										<Text className='text-lg'>Total tasks</Text>
										<Metric>{userTasksCount}</Metric>
									</div>
								</Flex>
							</Card>
							<Card
								decoration='top'
								decorationColor='indigo'
								className='h-full'
							>
								<Flex
									justifyContent='start'
									alignItems='center'
									className='h-full space-x-4'
								>
									<Icon
										icon={Square3Stack3DIcon}
										size='xl'
										color='indigo'
										variant='light'
									/>
									<div className='truncate'>
										<Text className='text-lg'>Projects</Text>
										<Metric>{userProjectsCount}</Metric>
									</div>
								</Flex>
							</Card>
						</Col>
						<Col numColSpan={2}>
							<Card decoration='top' decorationColor='indigo'>
								<Title className='font-bold'>Tasks reported this week</Title>
								<AreaChart
									className='mt-5 h-52 w-full'
									yAxisWidth={20}
									index='date'
									colors={['indigo']}
									curveType='natural'
									categories={['Created tasks']}
									// eslint-disable-next-line @typescript-eslint/no-explicit-any
									data={lastWeekTasks as any[]}
								/>
							</Card>
						</Col>
					</Grid>
					<Card className='h-full w-[38rem]'>
						<Title className='text-3xl font-bold'>Activity</Title>
						<Subtitle className='text-gray-500'>
							{String(dayjs(new Date()).format('DD MMM'))}
						</Subtitle>
						<div className='mt-10 flex h-[39rem] flex-col overflow-scroll'>
							{activity?.map((item, idx) => (
								<ActivityItem key={idx} data={item} />
							))}
						</div>
					</Card>
				</div>
			</section>
		</>
	)
}

Dashboard.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>
}

export default Dashboard

export const getServerSideProps: GetServerSideProps = async (context) =>
	protectedPage(context)
