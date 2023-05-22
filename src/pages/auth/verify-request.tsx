/* eslint-disable tailwindcss/no-custom-classname */
import { EnvelopeIcon } from '@heroicons/react/24/outline'
import type { NextPage } from 'next'
import Link from 'next/link'

const VerifyRequestPage: NextPage = () => {
	return (
		<main className='flex min-h-screen flex-col items-center justify-center bg-white'>
			<div className='flex w-full items-center justify-center gap-1'>
				{/* <Image src='/images/logo.png' width={50} height={50} alt='logo' /> */}
				<p className='font-reemKufi text-3xl font-semibold text-gray-900/95'>
					agylo
				</p>
			</div>
			<section className='mt-20 flex flex-col items-center justify-center gap-2  rounded-xl border border-gray-200 py-16 px-20 shadow-xl'>
				<EnvelopeIcon className='h-20 w-20 text-gray-800/95' />
				<h1 className='text-3xl font-bold text-gray-800/90'>
					Check your email
				</h1>

				<div className='mt-8 flex flex-col items-center justify-center gap-3'>
					<p className='text-lg'>
						A sign in link has been sent to your email address
					</p>
					<Link
						className='font-semibold text-indigo-500 hover:underline'
						href='/'
					>
						Go back
					</Link>
				</div>
			</section>
		</main>
	)
}

export default VerifyRequestPage
