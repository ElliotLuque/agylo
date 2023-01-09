import type { GetServerSideProps } from 'next'
import { getServerAuthSession } from './get-server-auth-session'

export const protectedPage: GetServerSideProps = async (context) => {
  const { req, res } = context
  const session = await getServerAuthSession({ req, res })

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: { session },
  }
}
