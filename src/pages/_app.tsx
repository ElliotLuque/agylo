import { type AppType } from 'next/app'
import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'

import { trpc } from '../utils/trpc'

import '../styles/globals.css'
import Head from 'next/head'
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

export type NextPageWithLayout<P = Record<string, never>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <SessionProvider session={session}>
      <Head>
        <title>Agylo</title>
        <meta
          name='description'
          content='An app for managing tasks and projects in kanban boards'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      {getLayout(<Component {...pageProps} />)}
    </SessionProvider>
  )
}

export default trpc.withTRPC(MyApp)
