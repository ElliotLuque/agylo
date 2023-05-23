import type { GetServerSideProps } from 'next'
import type { ReactElement } from 'react'
import Layout from '../../layouts/layout'
import type { NextPageWithLayout } from '../_app'
import Head from 'next/head'
import { protectedPage } from '../../server/common/protected-page'
import { trpc } from '../../utils/trpc'
import { Subtitle, Title } from '@tremor/react'
import { getIconBg } from '../../utils/colorSetter'
import Link from 'next/link'
import { env } from '../../env/client.mjs'
import { ChartBarIcon } from '@heroicons/react/24/solid'

import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import {
	ChatBubbleBottomCenterIcon,
	PaperClipIcon,
} from '@heroicons/react/24/outline'
import type { Task } from '../../types/kanban'
import LabelIcon from '../../components/project/views/kanban/taskDetails/labels/labelIcon'
dayjs.extend(relativeTime)

const priorityColors: Record<number, string> = {
	1: 'text-blue-500',
	2: 'text-yellow-600',
	3: 'text-red-500',
}

const ProjectListItem: React.FC<{
	name: string
	iconId: number
	description: string | null
	columns: {
		tasks: Task[]
	}[]
	url: string
}> = ({ name, iconId, description, url, columns }) => {
	return (
		<div className='flex flex-col justify-center'>
			<div className='my-4 flex gap-2'>
				<span className={`mt-2 h-5 w-5 rounded-md ${getIconBg(iconId)}`} />
				<div className='flex flex-col'>
					<Title className='text-2xl font-bold'>{name}</Title>
					<Subtitle className='text-gray-500'>{description}</Subtitle>
				</div>
			</div>
			<div className='flex flex-col justify-center divide-y'>
				{columns.map((column) =>
					column.tasks.map((task, idx) => (
						<TaskListItem
							title={task.title}
							taskKey={task.taskKey}
							priorityId={task.priorityId}
							attachmentCount={task.attachmentCount as number}
							commentCount={task.commentCount as number}
							createdAt={task.createdAt}
							labels={task.labels}
							url={url}
							key={idx}
							id={task.id}
							assignee={task.assignee}
							index={0}
						/>
					)),
				)}
			</div>
		</div>
	)
}

const TaskListItem: React.FC<Task & { url: string }> = ({
	title,
	taskKey,
	priorityId,
	attachmentCount,
	commentCount,
	createdAt,
	labels,
	url,
}) => {
	return (
		<Link
			href={`${env.NEXT_PUBLIC_URL}/${url}?selectedTask=${taskKey}`}
			className='ml-4 flex cursor-pointer items-center justify-between rounded bg-white p-4 hover:bg-gray-100'
		>
			<div className='flex items-center gap-3.5'>
				<p className='font-semibold text-gray-900/90'>{taskKey}</p>
				<h2 className='text-lg text-gray-900/80'>{title}</h2>
			</div>
			<div className='flex items-center gap-3'>
				<div className='mr-6 flex items-center gap-3'>
					{labels?.map((label, index) => (
						<LabelIcon
							classNames='text-sm'
							key={index}
							colorId={label.label.colorId}
							name={label.label.name}
						/>
					))}
				</div>
				<div className='flex items-center gap-2'>
					<ChatBubbleBottomCenterIcon className='h-5 w-5 text-gray-400' />
					<p className='text-sm text-gray-900/80'>{commentCount}</p>
				</div>
				<div className='flex items-center gap-2'>
					<PaperClipIcon className='h-5 w-5 text-gray-400' />
					<p className='text-sm text-gray-900/80'>{attachmentCount}</p>
				</div>
				<div className='flex items-center gap-2'>
					<ChartBarIcon
						className={`h-5 w-5 ${
							priorityId !== null
								? priorityColors[priorityId as number]
								: 'text-gray-400'
						}`}
					/>
				</div>
				<div className='flex items-center gap-2'>
					<p className='text-sm text-gray-900/80'>
						{dayjs(createdAt).format('DD/MM/YYYY')}
					</p>
				</div>
			</div>
		</Link>
	)
}

const MyTasksPage: NextPageWithLayout = () => {
	const { data: myProjects } = trpc.task.myTasks.useQuery()

	return (
		<>
			<Head>
				<title>My Tasks - Agylo</title>
			</Head>
			<section className='mx-12 my-4 flex w-full flex-col flex-nowrap p-6'>
				<div className='flex flex-col flex-wrap justify-center'>
					<h1 className='text-3xl font-bold'>My tasks</h1>
					<h2 className='ml-1 text-lg text-gray-900/90'>
						Check your active tasks
					</h2>
				</div>
				<div className='mt-6 flex flex-col gap-5 divide-y overflow-scroll'>
					{myProjects?.map((project, idx) => {
						return (
							<ProjectListItem
								name={project.project.name}
								iconId={project.project.iconId}
								description={project.project.description}
								columns={project.project.columns}
								url={project.project.url}
								key={idx}
							/>
						)
					})}
				</div>
			</section>
		</>
	)
}

MyTasksPage.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>
}

export default MyTasksPage

export const getServerSideProps: GetServerSideProps = async (context) =>
	protectedPage(context)
