import SkeletonPiece from '../components/skeletons/skeletonPiece'

const HeaderSkeletonLoader: React.FC = () => {
	return (
		<div className='flex w-full items-center justify-between p-2'>
			<div className='flex items-center gap-4'>
				<SkeletonPiece classNames=' h-10 w-10 rounded-md' />
				<SkeletonPiece classNames=' h-9 w-56 rounded-lg' />
				<SkeletonPiece classNames=' h-5 w-5 rounded-md' />
			</div>
			<div className='flex h-full items-center gap-5'>
				<div className='flex flex-row-reverse'>
					<SkeletonPiece classNames='z-[2] ml-[-0.4rem] rounded-full w-8 h-8' />
					<SkeletonPiece classNames='z-[2] ml-[-0.4rem] rounded-full w-8 h-8' />
					<SkeletonPiece classNames='z-[2] ml-[-0.4rem] rounded-full w-8 h-8' />
				</div>
				<SkeletonPiece classNames='h-8 w-28 rounded-md' />
				<span className='h-[70%] w-[0.1rem] bg-gray-100' />
				<SkeletonPiece classNames='h-9 w-44 rounded-md' />
				<div className='flex items-center gap-1.5'>
					<SkeletonPiece classNames='h-5 w-5 rounded-md' />
					<SkeletonPiece classNames='ml-1 h-7 w-[6.8rem] rounded-lg' />
				</div>
			</div>
		</div>
	)
}

export default HeaderSkeletonLoader
