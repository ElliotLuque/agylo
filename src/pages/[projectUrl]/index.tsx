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
      onSuccess: () => {
        // setColumns([]);
        // projectData?.columns?.forEach((column) => {
        //   setColumns((prev) => [...prev, column]);
        // });
      },
      retry: false,
    },
  )

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
          <LoadingSpinner height={48} width={48} />
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>{projectData?.name} - Agylo</title>
      </Head>
      <div className='flex w-full flex-col px-7 py-3'>
        <Header
          name={projectData?.name ?? 'Project'}
          description={projectData?.description ?? ''}
          url={projectData?.url as string}
        />
        <div className='flex w-full gap-4 p-6'>
          <KanbanBoard projectUrl={url} />
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
