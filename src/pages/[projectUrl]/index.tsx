import { type ReactElement } from 'react'
import { trpc } from '../../utils/trpc'
import type { NextPageWithLayout } from '../_app'
import { type InferGetServerSidePropsType, type GetServerSideProps } from 'next'
import { protectedRouterPage } from '../../server/common/protected-router-page'
import LoadingSpinner from '../../components/misc/loadingSpinner'

import Head from 'next/head'
import Header from '../../layouts/header'
import Layout from '../../layouts/layout'
import KanbanBoard from '../../components/project/views/kanban/kanbanBoard'
import { useRouter } from 'next/router'

const KanbanPage: NextPageWithLayout = ({
  url,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const {
    data: projectData,
    isLoading,
    error,
  } = trpc.project.getProjectBasicInfo.useQuery(
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

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Agylo</title>
        </Head>
        <div className='grid w-full place-items-center'>
          <LoadingSpinner classNames='w-48 h-48 p-12' />
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>{projectData?.name} - Agylo</title>
      </Head>
      <div className='flex w-full flex-col px-5 py-3'>
        <Header
          name={projectData?.name ?? 'Project'}
          description={projectData?.description ?? ''}
          url={projectData?.url as string}
        />
        <div className='flex w-[78vw] gap-2 overflow-auto py-3'>
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
