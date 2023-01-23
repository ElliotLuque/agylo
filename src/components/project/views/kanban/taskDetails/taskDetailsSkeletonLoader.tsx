import { Dialog } from '@headlessui/react'
import { EllipsisHorizontalIcon, XMarkIcon } from '@heroicons/react/24/outline'
import SkeletonPiece from '../../../../skeletons/skeletonPiece'
import React from 'react'

const TaskDetailsSkeletonLoader: React.FC<{
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ setOpen }) => {
	return (
		<div>
			<div className='mb-9 mt-2 flex items-center justify-between'>
				<div className='flex items-center gap-2 font-bold'>
					<SkeletonPiece classNames='w-16 h-6 rounded' />
					<SkeletonPiece classNames='w-20 h-6 rounded' />
				</div>
				<div className='flex items-center gap-2'>
					<EllipsisHorizontalIcon className='mt-[0.07rem] h-5 w-5 cursor-pointer text-gray-900 opacity-80' />
					<button
						className='focus:outline-none'
						onClick={() => {
							setOpen(false)
						}}
					>
						<XMarkIcon className='h-4 w-4 cursor-pointer text-gray-900 opacity-70 ' />
					</button>
				</div>
			</div>
			<Dialog.Title as='div' className='pb-8'>
				<SkeletonPiece classNames='w-72 h-12 rounded-xl' />
			</Dialog.Title>
			<div className='flex flex-col justify-center'>
				<div className='mb-8 grid w-[22rem] grid-cols-[1rem_8rem_1fr] grid-rows-5 items-center gap-y-4 gap-x-2 pl-1'>
					{/* First row */}
					<SkeletonPiece classNames='row-start-1 w-5 h-5 rounded-lg' />
					<div className='row-start-1 ml-1 flex items-center'>
						<SkeletonPiece classNames='w-16 h-5 rounded' />
					</div>
					<div className='row-start-1 flex items-center'>
						<SkeletonPiece classNames='w-24 h-5 rounded-lg' />
					</div>

					{/* Second row */}
					<SkeletonPiece classNames='row-start-2 w-5 h-5 rounded-lg' />
					<div className='row-start-2 ml-1 flex items-center'>
						<SkeletonPiece classNames='w-24 h-5 rounded' />
					</div>
					<div className='row-start-2 flex items-center gap-2'>
						<SkeletonPiece classNames='w-7 h-7 rounded-full' />
						<SkeletonPiece classNames='w-24 h-5 rounded' />
					</div>

					{/* Third row */}
					<SkeletonPiece classNames='row-start-3 w-5 h-5 rounded-lg' />
					<div className='row-start-3 ml-1 flex items-center'>
						<SkeletonPiece classNames='w-20 h-5 rounded' />
					</div>
					<div className='row-start-3 flex w-[25rem] flex-col justify-center'>
						<div className='flex items-center gap-1 '>
							<div className='mt-1 flex flex-wrap items-center gap-1'>
								<SkeletonPiece classNames='w-14 h-6 rounded' />
								<SkeletonPiece classNames='w-14 h-6 rounded ml-1' />
								<SkeletonPiece classNames='w-14 h-6 rounded ml-1' />
							</div>
						</div>
					</div>

					{/* Fourth row */}
					<SkeletonPiece classNames='row-start-4 w-5 h-5 rounded-lg' />
					<div className='row-start-4 ml-1 flex items-center'>
						<SkeletonPiece classNames='w-24 h-5 rounded' />
					</div>
					<div className='row-start-4 flex cursor-pointer items-center'>
						<SkeletonPiece classNames='w-16 h-6 rounded-md' />
					</div>

					{/* Fifth row */}
					<SkeletonPiece classNames='row-start-5 w-5 h-5 rounded-lg' />
					<div className='row-start-5 ml-1 flex items-center'>
						<SkeletonPiece classNames='w-20 h-5 rounded' />
					</div>
					<div className='row-start-5 flex items-center'>
						<SkeletonPiece classNames='w-14 h-6 rounded' />
					</div>
				</div>
				<SkeletonPiece classNames='w-36 h-8 mb-6 rounded' />
				<div className='mb-7 flex flex-col gap-2'>
					<SkeletonPiece classNames='w-72 h-4 rounded' />
					<SkeletonPiece classNames='w-80 h-4 rounded' />
					<SkeletonPiece classNames='w-64 h-4 rounded' />
				</div>
				{/* <Tab.Group>
                      <Tab.List className='flex items-center gap-5 border-b border-b-gray-200'>
                        <Tab
                          className={({ selected }) =>
                            `text-base inline-flex select-none items-center gap-1.5 border-b-[0.13rem] px-0.5 pb-1 font-medium focus:outline-none ${
                              selected
                                ? 'border-b-indigo-500 text-indigo-500'
                                : 'border-b-white text-gray-500'
                            }`
                          }
                        >
                          Comments
                          {taskData?.commentCount &&
                          taskData?.commentCount > 0 ? (
                            <span className='rounded-full bg-indigo-100 py-0.5 px-2 text-xs text-indigo-500'>
                              {taskData?.commentCount}
                            </span>
                          ) : undefined}
                        </Tab>
                        <Tab
                          className={({ selected }) =>
                            `text-base select-none border-b-[0.13rem] px-0.5 pb-1 font-medium focus:outline-none ${
                              selected
                                ? 'border-b-indigo-500 text-indigo-500'
                                : 'border-b-white text-gray-500'
                            }`
                          }
                        >
                          Attachments
                        </Tab>
                      </Tab.List>
                      <Tab.Panels>
                        <Tab.Panel>
                          <div className='mt-6'>
                            <form>
                              <textarea
                                spellCheck={false}
                                rows={3}
                                className={`h-24 w-full resize-none rounded-lg bg-gray-100 p-3 text-gray-800 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-50`}
                                placeholder='Write a comment...'
                              />
                            </form>
                          </div>
                        </Tab.Panel>
                        <Tab.Panel>
                          <p className='mt-5'>attachm akiii</p>
                        </Tab.Panel>
                      </Tab.Panels>
                    </Tab.Group> */}
			</div>
		</div>
	)
}

export default TaskDetailsSkeletonLoader
