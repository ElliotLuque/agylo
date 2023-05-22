/* eslint-disable tailwindcss/no-custom-classname */
import type {
	GetServerSideProps,
	InferGetServerSidePropsType,
	NextPage,
} from 'next'
import { getCsrfToken, signIn } from 'next-auth/react'
import Image from 'next/image'
import GoogleIcon from '../../components/misc/icons/google'
import GithubIcon from '../../components/misc/icons/github'
import { SparklesIcon } from '@heroicons/react/24/outline'

const SignInPage: NextPage = ({
	csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	return (
		<main className='mt-12 flex min-h-screen flex-col items-center bg-white'>
			<section className='flex h-full w-[26rem] flex-col '>
				<div className='flex w-full items-center justify-center gap-2'>
					<Image src='/agylo.svg' width={50} height={50} alt='logo' />
					<p className='font-poppins text-3xl font-semibold text-gray-900/95'>
						agylo
					</p>
				</div>
				<div className='mt-10 flex w-full flex-col items-center justify-center gap-2'>
					<h1 className='text-5xl font-black text-gray-900/90'>
						Sign in to Agylo
					</h1>
					<p className='mt-3 text-[1.05rem] text-gray-800/90'>
						Create an account or login to start using Agylo
					</p>
					<div className='mt-8 grid w-full place-items-center items-center gap-4'>
						<button
							className='flex w-full items-center justify-center gap-2 rounded border-2 border-gray-300 bg-white py-2.5 px-4 text-lg font-semibold text-gray-800/90'
							onClick={() =>
								signIn('google', { callbackUrl: '/personal/dashboard' })
							}
						>
							<GoogleIcon width={22} height={22} />
							Sign in with Google
						</button>
						<button
							className='flex w-full items-center justify-center gap-2 rounded border-2 border-gray-300 bg-white py-2.5 px-4 text-lg font-semibold text-gray-800/90'
							onClick={() =>
								signIn('github', { callbackUrl: '/personal/dashboard' })
							}
						>
							<GithubIcon width={22} height={22} />
							Sign in with Github
						</button>
						<div className='my-5 flex w-full items-center gap-5'>
							<hr className='h-[0.1rem] w-full bg-gray-300' />
							<p className='divide-y-2 text-gray-800/80'>OR</p>
							<hr className='h-[0.1rem] w-full bg-gray-300' />
						</div>
						<form
							className='flex w-full flex-col gap-4'
							method='post'
							action='/api/auth/signin/email'
						>
							<input type='hidden' name='csrfToken' defaultValue={csrfToken} />
							<input
								type='email'
								name='email'
								placeholder='email@example.com'
								className='rounded border-2 border-gray-300 py-2 px-4 text-gray-800/90 focus:border-indigo-400 focus:ring-indigo-200'
							/>
							<button
								type='submit'
								className='flex w-full items-center justify-center gap-2 rounded bg-indigo-500 py-2.5 px-4 text-lg font-semibold text-white hover:bg-indigo-700'
							>
								Sign in with Email
							</button>
						</form>
						<div className='mt-2 flex gap-2 rounded-lg bg-gray-100 px-5 py-3'>
							<SparklesIcon className='h-5 w-5 text-gray-800/60' />
							<p className='text-[1rem] text-gray-800/90 '>
								We&apos;ll email you a magic code for a password-free sign in.
							</p>
						</div>
					</div>
				</div>
			</section>
		</main>
	)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const csrfToken = await getCsrfToken(context)

	return {
		props: { csrfToken },
	}
}

export default SignInPage
