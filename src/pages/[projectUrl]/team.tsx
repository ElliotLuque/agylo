import { type ReactElement } from 'react'
import type { NextPageWithLayout } from '../_app'
import { type GetServerSideProps } from 'next'
import { protectedRouterPage } from '../../server/common/protected-router-page'
import Layout from '../../layouts/layout'

const TeamPage: NextPageWithLayout = () => {
	return <div className='w-full'>Team</div>
}

TeamPage.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>
}

export const getServerSideProps: GetServerSideProps = async (context) =>
	protectedRouterPage(context)

export default TeamPage
