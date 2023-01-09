import React, { type ReactElement, useState } from 'react'
import { trpc } from '../../utils/trpc'
import type { NextPageWithLayout } from '../_app'
import { protectedRouterPage } from '../../server/common/protected-router-page'
import { type InferGetServerSidePropsType, type GetServerSideProps } from 'next'

import Head from 'next/head'
import Toast from '../../components/alerts/toast'
import Layout from '../../layouts/layout'
import DeleteProjectDialog from '../../components/project/settings/general/deleteProjectDialog'
import SettingsSection from '../../components/project/settings/general/sections/settingsSection'
import DeleteSection from '../../components/project/settings/general/sections/deleteSection'
import IconSection from '../../components/project/settings/general/sections/iconSection'
import LoadingSpinner from '../../components/misc/loadingSpinner'

const SettingsPage: NextPageWithLayout = ({
  url,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: projectInfo, isLoading } =
    trpc.project.getProjectBasicInfo.useQuery({
      url,
    })

  const [openDialog, setOpenDialog] = useState(false)

  const [toast, setToast] = useState(false)
  const [errorToast, setErrorToast] = useState(false)

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
        <title>{projectInfo?.name} - Settings - Agylo</title>
      </Head>

      <DeleteProjectDialog
        open={openDialog}
        setOpen={setOpenDialog}
        projectId={projectInfo?.id as number}
        projectName={projectInfo?.name as string}
      />

      <div className='absolute right-28 top-36'>
        <Toast
          message='Project updated successfully!'
          isOpen={toast}
          error={false}
        />
        <Toast
          message='Project URL is already in use!'
          isOpen={errorToast}
          error
        />
      </div>
      <div className='w-full'>
        <div className='flex flex-col items-center justify-center'>
          <div className='mx-4 flex w-[32rem] flex-col gap-5 divide-y p-5'>
            <div className='mt-5 mb-2'>
              <h1 className='text-2xl font-bold text-gray-800'>Project</h1>
              <h2 className='text-sm  font-medium text-gray-500'>
                Manage your project settings
              </h2>
            </div>
            <IconSection
              currentIcon={projectInfo?.iconId as number}
              iconId={projectInfo?.iconId as number}
              setToast={setToast}
              projectId={projectInfo?.id as number}
            />
            <SettingsSection
              id={projectInfo?.id as number}
              url={projectInfo?.url as string}
              name={projectInfo?.name ?? ''}
              description={projectInfo?.description ?? ''}
              setToast={setToast}
              setErrorToast={setErrorToast}
            />
            <DeleteSection setOpenDialog={setOpenDialog} />
          </div>
        </div>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) =>
  protectedRouterPage(context)

SettingsPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default SettingsPage
