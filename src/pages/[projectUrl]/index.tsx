import { type ReactElement } from 'react'
import { trpc } from '../../utils/trpc'
import type { NextPageWithLayout } from '../_app'
import { type InferGetServerSidePropsType, type GetServerSideProps } from 'next'
import { protectedRouterPage } from '../../server/common/protected-router-page'

import Head from 'next/head'
import Header from '../../layouts/header'
import Layout from '../../layouts/layout'
import KanbanBoard from '../../components/project/views/kanban/kanbanBoard'
import { useRouter } from 'next/router'

export type ParticipantsInfo = {
	user: {
		id: string
		name: string | null
		image: string | null
	}
}[]

const KanbanPage: NextPageWithLayout = ({
	url,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const {
		data: projectData,
		error,
		isLoading,
	} = trpc.project.getProjectInfo.useQuery(
		{ url },
		{
			retry: false,
		},
	)

	const router = useRouter()
	const query = router.query

	if (error?.data?.httpStatus === 403) {
		return (
			<>
				<Head>
					<title> Not authorized - Agylo</title>
				</Head>
				<div className='grid w-full place-items-center'>
					<h1 className='text-2xl'>
						You don&apos;t have access to this project
					</h1>
				</div>
			</>
		)
	}

	if (error?.data?.httpStatus === 404) {
		return (
			<>
				<Head>
					<title> Not found - Agylo</title>
				</Head>
				<div className='grid w-full place-items-center'>
					<h1 className='text-2xl'>Project not found</h1>
				</div>
			</>
		)
	}

	return (
		<>
			<Head>
				<title>{isLoading ? 'Agylo' : projectData?.name + ' - Agylo'}</title>
			</Head>
			<div className='m-5 flex w-full flex-col'>
				<Header
					name={projectData?.name ?? 'Project'}
					description={projectData?.description ?? ''}
					url={projectData?.url as string}
					iconId={projectData?.iconId as number}
					participants={projectData?.participants as ParticipantsInfo}
					participantsCount={projectData?._count.participants as number}
					isLoading={isLoading}
				/>
				<div className='mt-3 flex w-[78vw] gap-2 py-3'>
					<KanbanBoard
						dialogTaskKey={(query?.selectedTask as string) ?? ''}
						projectUrl={url}
					/>
				</div>
			</div>
		</>
	)
}

export const getServerSideProps: GetServerSideProps = async (context) =>
	protectedRouterPage(context)

KanbanPage.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>
}

export default KanbanPage
