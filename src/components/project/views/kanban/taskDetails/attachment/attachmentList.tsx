import { useRef, useState } from 'react'
import { trpc } from '../../../../../../utils/trpc'
import {
	ArrowDownTrayIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
} from '@heroicons/react/24/outline'
import { DocumentIcon, PlusIcon } from '@heroicons/react/24/solid'
import AttachmentOptionsMenu from './attachmentOptionsMenu'
import { useSession } from 'next-auth/react'

const AttachmentList: React.FC<{ taskKey: string }> = ({ taskKey }) => {
	const trpcUtils = trpc.useContext()
	const [page, setPage] = useState(0)

	const fileInputRef = useRef<HTMLInputElement>(null)

	const { data: attachmentsPage } =
		trpc.attachments.getTaskAttachments.useQuery({
			taskKey,
			page,
		})

	const { mutateAsync: downloadUrl } =
		trpc.attachments.getDownloadUrl.useMutation()

	const { mutateAsync: uploadUrl } = trpc.attachments.getUploadUrl.useMutation()

	const uploadFile = async () => {
		const file = fileInputRef.current?.files?.[0]
		if (!file) return

		const filename = file.name
		const filetype = file.type

		const url = await uploadUrl({
			filename,
			type: filetype,
			taskKey,
		})

		const upload = await fetch(url, {
			method: 'PUT',
			body: file,
		})

		if (upload.ok) {
			setPage(0)
			trpcUtils.attachments.getTaskAttachments.invalidate()
			trpcUtils.task.getTaskInfo.invalidate()
			trpcUtils.project.getKanbanData.invalidate()
		}
	}

	const handleUpload = async () => {
		fileInputRef.current?.value && (fileInputRef.current.value = '')
		fileInputRef.current?.click()
	}

	const handleDownload = async (attachmentKey: string) => {
		const url = await downloadUrl({ attachmentKey })
		window.open(url, '_blank')
	}

	const session = useSession()

	return (
		<div className='mt-6 flex flex-col justify-center gap-3'>
			<div className='mb-2 flex items-center justify-between'>
				<button
					onClick={handleUpload}
					className='flex w-full items-center gap-3 rounded-lg outline-none hover:bg-gray-50'
				>
					<input
						ref={fileInputRef}
						onChange={uploadFile}
						type='file'
						className='hidden outline-none'
					/>
					<div className='flex items-center justify-center rounded-xl border-2 border-indigo-200 bg-white p-1 outline-none'>
						<PlusIcon className='h-6 w-6 text-indigo-400' />
					</div>
					<p className='text-sm font-semibold text-indigo-400'>
						Add a new file
					</p>
				</button>
				{(attachmentsPage?.totalPages as number) > 1 && (
					<div className='flex w-full items-center justify-end gap-2'>
						<button
							className='outline-none disabled:opacity-30'
							disabled={page === 0}
							onClick={() => {
								setPage(page - 1)
							}}
						>
							<ChevronLeftIcon className='h-5 w-5 text-gray-800' />
						</button>
						<p className='text-gray-800'>{page + 1}</p>
						<button
							className='outline-none disabled:opacity-30'
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
				<div key={index} className='flex w-full items-center justify-between '>
					<div className='flex items-center gap-3'>
						<div className='flex items-center justify-center rounded-xl bg-indigo-200 p-2'>
							<DocumentIcon className='h-6 w-6 text-indigo-400' />
						</div>
						<p className='text-sm font-medium text-gray-800'>
							{attachment.filename}
						</p>
					</div>
					<div className='flex items-center gap-2'>
						<ArrowDownTrayIcon
							onClick={() => handleDownload(attachment.key)}
							className='h-[32px] w-[32px] cursor-pointer rounded-md p-2 text-gray-800 hover:bg-gray-100'
						/>
						{attachment.author.id === session?.data?.user?.id && (
							<AttachmentOptionsMenu attachmentKey={attachment.key} />
						)}
					</div>
				</div>
			))}
		</div>
	)
}

export default AttachmentList
