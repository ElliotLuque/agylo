import SkeletonPiece from '../../../skeletons/skeletonPiece'

const KanbanBoardSkeletonLoader: React.FC = () => {
	return (
		<div className='flex h-screen w-full'>
			<div className='flex items-start gap-2'>
				<div className='flex min-w-[23rem] flex-col gap-3 p-4'>
					<div className='mb-2 flex items-center justify-between'>
						<SkeletonPiece lighter classNames='rounded-lg w-40 h-10' />
						<div className='flex items-center gap-2'>
							<SkeletonPiece classNames='rounded-lg w-8 h-8' />
							<SkeletonPiece classNames='rounded-lg w-8 h-8' />
						</div>
					</div>
					<div className='flex h-[6.5rem] w-full flex-col justify-between rounded-lg bg-slate-100 px-3.5 py-2.5'>
						<div className='flex flex-col '>
							<SkeletonPiece classNames='rounded-lg w-24 h-4 mt-2' />
						</div>
						<SkeletonPiece classNames='rounded-full w-7 h-7' />
					</div>
					<div className='flex h-[8.5rem] w-full flex-col justify-between rounded-lg bg-slate-100 px-3.5 py-2.5'>
						<div className='mt-2 flex flex-col'>
							<SkeletonPiece classNames='rounded-lg w-56 h-4' />
							<div className='mt-3 flex items-center gap-2'>
								<SkeletonPiece classNames='rounded-lg w-16 h-7' />
								<SkeletonPiece classNames='rounded-lg w-24 h-7' />
							</div>
						</div>
						<SkeletonPiece classNames='rounded-full w-7 h-7' />
					</div>
					<div className='flex h-[6.5rem] w-full flex-col justify-between rounded-lg bg-slate-100 px-3.5 py-2.5'>
						<div className='flex flex-col '>
							<SkeletonPiece classNames='rounded-lg w-32 h-4 mt-2' />
						</div>
						<SkeletonPiece classNames='rounded-full w-7 h-7' />
					</div>

					<div className='flex h-[6.5rem] w-full flex-col justify-between rounded-lg bg-slate-100 px-3.5 py-2.5'>
						<div className='flex flex-col '>
							<SkeletonPiece classNames='rounded-lg w-52 h-4 mt-2' />
						</div>
						<SkeletonPiece classNames='rounded-full w-7 h-7' />
					</div>
				</div>
				<div className='flex w-[23rem] flex-col gap-3 p-4 opacity-60'>
					<div className='mb-2 flex items-center justify-between'>
						<SkeletonPiece lighter classNames='rounded-lg w-52 h-10' />
						<div className='flex items-center gap-2'>
							<SkeletonPiece classNames='rounded-lg w-8 h-8' />
							<SkeletonPiece classNames='rounded-lg w-8 h-8' />
						</div>
					</div>
					<div className='flex h-[6.5rem] w-full flex-col justify-between rounded-lg bg-slate-100 px-3.5 py-2.5'>
						<div className='flex flex-col '>
							<SkeletonPiece classNames='rounded-lg w-52 h-4 mt-2' />
						</div>
						<SkeletonPiece classNames='rounded-full w-7 h-7' />
					</div>
					<div className='flex h-[8.5rem] w-full flex-col justify-between rounded-lg bg-slate-100 px-3.5 py-2.5'>
						<div className='mt-2 flex flex-col'>
							<SkeletonPiece classNames='rounded-lg w-52 h-4' />
							<div className='mt-3 flex items-center gap-2'>
								<SkeletonPiece classNames='rounded-lg w-16 h-7' />
								<SkeletonPiece classNames='rounded-lg w-20 h-7' />
								<SkeletonPiece classNames='rounded-lg w-24 h-7' />
							</div>
						</div>
						<SkeletonPiece classNames='rounded-full w-7 h-7' />
					</div>
					<div className='flex h-[8.5rem] w-full flex-col justify-between rounded-lg bg-slate-100 px-3.5 py-2.5'>
						<div className='mt-2 flex flex-col'>
							<SkeletonPiece classNames='rounded-lg w-40 h-4' />
							<div className='mt-3 flex items-center gap-2'>
								<SkeletonPiece classNames='rounded-lg w-16 h-7' />
								<SkeletonPiece classNames='rounded-lg w-16 h-7' />
							</div>
						</div>
						<SkeletonPiece classNames='rounded-full w-7 h-7' />
					</div>
					<div className='flex h-[6.5rem] w-full flex-col justify-between rounded-lg bg-slate-100 px-3.5 py-2.5'>
						<div className='flex flex-col '>
							<SkeletonPiece classNames='rounded-lg w-32 h-4 mt-2' />
						</div>
						<SkeletonPiece classNames='rounded-full w-7 h-7' />
					</div>
					<div className='flex h-[6.5rem] w-full flex-col justify-between rounded-lg bg-slate-100 px-3.5 py-2.5'>
						<div className='flex flex-col '>
							<SkeletonPiece classNames='rounded-lg w-20 h-4 mt-2' />
						</div>
						<SkeletonPiece classNames='rounded-full w-7 h-7' />
					</div>
				</div>
				<div className='flex w-[23rem] flex-col gap-3 p-4 opacity-40'>
					<div className='mb-2 flex items-center justify-between'>
						<SkeletonPiece lighter classNames='rounded-lg w-36 h-10' />
						<div className='flex items-center gap-2'>
							<SkeletonPiece classNames='rounded-lg w-8 h-8' />
							<SkeletonPiece classNames='rounded-lg w-8 h-8' />
						</div>
					</div>
					<div className='flex h-[8.5rem] w-full flex-col justify-between rounded-lg bg-slate-100 px-3.5 py-2.5'>
						<div className='mt-2 flex flex-col'>
							<SkeletonPiece classNames='rounded-lg w-56 h-4' />
							<div className='mt-3 flex items-center gap-2'>
								<SkeletonPiece classNames='rounded-lg w-16 h-7' />
								<SkeletonPiece classNames='rounded-lg w-24 h-7' />
							</div>
						</div>
						<SkeletonPiece classNames='rounded-full w-7 h-7' />
					</div>
					<div className='flex h-[6.5rem] w-full flex-col justify-between rounded-lg bg-slate-100 px-3.5 py-2.5'>
						<div className='flex flex-col '>
							<SkeletonPiece classNames='rounded-lg w-24 h-4 mt-2' />
						</div>
						<SkeletonPiece classNames='rounded-full w-7 h-7' />
					</div>
					<div className='flex h-[6.5rem] w-full flex-col justify-between rounded-lg bg-slate-100 px-3.5 py-2.5'>
						<div className='flex flex-col '>
							<SkeletonPiece classNames='rounded-lg w-32 h-4 mt-2' />
						</div>
						<SkeletonPiece classNames='rounded-full w-7 h-7' />
					</div>

					<div className='flex h-[6.5rem] w-full flex-col justify-between rounded-lg bg-slate-100 px-3.5 py-2.5'>
						<div className='flex flex-col '>
							<SkeletonPiece classNames='rounded-lg w-52 h-4 mt-2' />
						</div>
						<SkeletonPiece classNames='rounded-full w-7 h-7' />
					</div>
				</div>
			</div>
		</div>
	)
}

export default KanbanBoardSkeletonLoader
