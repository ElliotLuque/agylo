import { useRef, useState } from 'react'
import { trpc } from '../../../../../../utils/trpc'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { DocumentIcon, PlusIcon } from '@heroicons/react/24/solid'

const AttachmentList: React.FC<{ taskKey: string }> = ({ taskKey }) => {
	const [page, setPage] = useState(0)

	const fileInputRef = useRef<HTMLInputElement>(null)

	const { data: attachmentsPage } =
		trpc.attachments.getTaskAttachments.useQuery({
			taskKey,
			page,
		})

	const uploadFile = async () => {
		const file = fileInputRef.current?.files?.[0]
		if (!file) return

		console.log('upload', file)
	}

	const handleUpload = async () => {
		fileInputRef.current?.click()
	}

	return (
		<div className='mt-6 flex flex-col justify-center gap-3'>
			<div className='mb-2 flex items-center justify-between gap-4'>
				<button
					onClick={handleUpload}
					className='flex w-full items-center gap-3'
				>
					<input
						ref={fileInputRef}
						onChange={uploadFile}
						type='file'
						className='hidden'
					/>
					<div className='flex items-center justify-center rounded-xl border-2 border-indigo-200 bg-white p-1'>
						<PlusIcon className='h-6 w-6 text-indigo-400' />
					</div>
					<p className='text-sm font-semibold text-indigo-400'>
						Add a new file
					</p>
				</button>
				{(attachmentsPage?.totalPages as number) > 1 && (
					<div className='flex w-full items-center justify-end gap-2'>
						<button
							className='disabled:opacity-30'
							disabled={page === 0}
							onClick={() => {
								setPage(page - 1)
							}}
						>
							<ChevronLeftIcon className='h-5 w-5 text-gray-800' />
						</button>
						<p className='text-gray-800'>{page + 1}</p>
						<button
							className='disabled:opacity-30'
							disabled={page === (attachmentsPage?.totalPages as number) - 1}
							onClick={() => {
								setPage(page + 1)
							}}
						>
							<ChevronRightIcon className='h-5 w-5 text-gray-800' />
						</button>
					</div>
				)}
			</div>
			{attachmentsPage?.attachments.map((attachment, index) => (
				<div key={index} className='flex items-center gap-4'>
					<div className='flex items-center justify-center rounded-xl bg-indigo-200 p-2'>
						<DocumentIcon className='h-6 w-6 text-indigo-400' />
					</div>
					<p className='text-sm font-medium text-gray-800'>
						{attachment.filename}
					</p>
				</div>
			))}
		</div>
	)
}

export default AttachmentList
