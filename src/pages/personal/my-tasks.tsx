import type { GetServerSideProps } from 'next'
import type { ReactElement } from 'react'
import Layout from '../../layouts/layout'
import type { NextPageWithLayout } from '../_app'
import Head from 'next/head'
import { protectedPage } from '../../server/common/protected-page'

const MyTasksPage: NextPageWithLayout = () => {
	return (
		<>
			<Head>
				<title>My Tasks - Agylo</title>
			</Head>
			<section>
				<h1 className='w-full'>buenas tasks</h1>
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
