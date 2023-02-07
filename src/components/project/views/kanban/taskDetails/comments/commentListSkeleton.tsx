import SkeletonPiece from '../../../../../skeletons/skeletonPiece'

const CommentListSkeletonLoader: React.FC = () => {
	return (
		<div className='flex flex-col gap-10'>
			<div className='flex flex-col justify-center gap-2'>
				<div className='flex items-center gap-2'>
					<SkeletonPiece classNames='w-8 h-8 rounded-full' />
					<SkeletonPiece classNames='w-32 h-6 rounded' />
					<SkeletonPiece classNames='w-20 h-5 rounded' />
				</div>
				<SkeletonPiece classNames='ml-1 w-44 h-6 rounded' />
			</div>
			<div className='flex flex-col justify-center gap-2'>
				<div className='flex items-center gap-2'>
					<SkeletonPiece classNames='w-8 h-8 rounded-full' />
					<SkeletonPiece classNames='w-28 h-6 rounded' />
					<SkeletonPiece classNames='w-16 h-5 rounded' />
				</div>
				<SkeletonPiece classNames='ml-1 w-56 h-6 rounded' />
			</div>
		</div>
	)
}

export default CommentListSkeletonLoader
