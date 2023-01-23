import type { GetServerSideProps } from 'next'
import { getServerAuthSession } from './get-server-auth-session'

export const protectedRouterPage: GetServerSideProps = async (context) => {
	const { req, res } = context
	const session = await getServerAuthSession({ req, res })

	const url = context.query?.projectUrl

	if (!session) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		}
	}

	return {
		props: { session, url },
	}
}
