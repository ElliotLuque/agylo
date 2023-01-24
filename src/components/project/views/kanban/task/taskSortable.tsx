import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Task } from '../../../../../types/kanban'
import Link from 'next/link'
import { useRouter } from 'next/router'
import UserAvatar from '../../../../misc/userAvatar'
import {
	ChatBubbleBottomCenterIcon,
	PaperClipIcon,
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import LabelIcon from '../taskDetails/labels/labelIcon'

const TaskSortable: React.FC<Task & { cursor: string }> = ({
	title,
	taskKey,
	assignee,
	cursor,
	labels,
	attachmentCount,
	commentCount,
}) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: taskKey,
	})

	const router = useRouter()
	const query = router.query

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	}

	if (isDragging) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.3 }}
				ref={setNodeRef}
				style={style}
				className='min-h-[6rem] w-[18rem] rounded-lg border-[0.115rem] border-dashed border-gray-300 bg-gray-50 px-3.5 pt-2 pb-2.5 '
			>
				<div className='invisible flex flex-col gap-1'>
					<div className='flex items-center gap-2'>
						<p className='select-none truncate font-medium text-gray-700'>
							{title}
						</p>
					</div>
					<div className='flex items-center gap-2'>
						{labels?.map((label, index) => (
							<LabelIcon
								key={index}
								colorId={label.label.colorId}
								name={label.label.name}
								classNames='mt-2 mb-6 text-xs'
							/>
						))}
					</div>
				</div>

				<div className='flex items-center justify-between'>
					<UserAvatar width={25} height={25} imageUrl={null} isInvisible />
					<div className='flex items-center gap-2 text-gray-900 opacity-70'>
						{commentCount !== null && commentCount > 0 && (
							<div className='flex items-center gap-1'>
								<ChatBubbleBottomCenterIcon className='mt-0.5 h-3 w-3' />
								<p className='text-sm'>{commentCount}</p>
							</div>
						)}
						{attachmentCount !== null && attachmentCount > 0 && (
							<div className='flex items-center gap-1'>
								<PaperClipIcon className='mt-0.5 h-3 w-3' />
								<p className='text-sm'>{attachmentCount}</p>
							</div>
						)}
					</div>
				</div>
			</motion.div>
		)
	}

	return (
		<Link
			href={{
				pathname: router.pathname,
				query: { ...query, selectedTask: taskKey },
			}}
			{...attributes}
			{...listeners}
			ref={setNodeRef}
			style={style}
			className={`flex min-h-[6rem] w-[18rem] ${cursor} flex-col justify-between rounded-lg border-[0.09rem] border-gray-200 bg-white px-3.5 pt-2 pb-2.5 focus:outline-none`}
		>
			<div className='flex flex-col gap-1'>
				<div className='flex items-center gap-2'>
					<p className='select-none truncate font-medium text-gray-700'>
						{title}
					</p>
				</div>
				<div className='flex items-center gap-2'>
					{labels?.map((label, index) => (
						<LabelIcon
							key={index}
							colorId={label.label.colorId}
							name={label.label.name}
							classNames='mt-2 mb-6 text-xs'
						/>
					))}
				</div>
			</div>

			<div className='flex items-center justify-between'>
				<UserAvatar
					width={25}
					height={25}
					imageUrl={assignee?.image as string}
					isInvisible={false}
				/>
				<div className='flex items-center gap-2 text-gray-900 opacity-70'>
					{commentCount !== null && commentCount > 0 && (
						<div className='flex items-center gap-1'>
							<ChatBubbleBottomCenterIcon className='mt-0.5 h-3 w-3' />
							<p className='text-sm'>{commentCount}</p>
						</div>
					)}
					{attachmentCount !== null && attachmentCount > 0 && (
						<div className='flex items-center gap-1'>
							<PaperClipIcon className='mt-0.5 h-3 w-3' />
							<p className='text-sm'>{attachmentCount}</p>
						</div>
					)}
				</div>
			</div>
		</Link>
	)
}

export default TaskSortable
