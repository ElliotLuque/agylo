import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment, useState } from 'react'
import { trpc } from '../../../../../utils/trpc'
import {
  EllipsisHorizontalIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import {
  BookmarkIcon,
  ChartBarIcon,
  TagIcon,
  UserIcon,
} from '@heroicons/react/24/solid'
import { useRouter } from 'next/router'
import AssigneeSelector from '../../../../taskDetails/assignee/assigneeSelector'
import PrioritySelector from '../../../../taskDetails/priority/prioritySelector'

interface TaskProps {
  taskKey: string
  projectName: string
}

const TaskViewDialog: React.FC<TaskProps> = ({ taskKey, projectName }) => {
  const { data: taskData, isLoading } = trpc.task.getTaskInfo.useQuery({
    key: taskKey,
  })

  const [open, setOpen] = useState(true)

  const router = useRouter()
  const query = router.query

  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-10'
          onClose={() => {
            setOpen(false)
            setTimeout(() => {
              router.push({
                pathname: router.pathname,
                query: { projectUrl: query.projectUrl },
              })
            }, 200)
          }}
        >
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center focus:outline-none'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='min-w-[35vw] max-w-md transform rounded-2xl bg-white px-7 py-5 text-left align-middle shadow-xl transition-all'>
                  <div className='flex items-center justify-between pb-8'>
                    <h3 className='font-bold text-gray-700'>
                      <span className='font-medium text-gray-900 opacity-60'>
                        {projectName} /{' '}
                      </span>
                      {taskData?.taskKey}
                    </h3>
                    <div className='flex items-center gap-2'>
                      <EllipsisHorizontalIcon className='h-5 w-5 cursor-pointer text-gray-900 opacity-80 ' />
                      <button
                        className='focus:outline-none'
                        onClick={() => {
                          setOpen(false)
                          setTimeout(() => {
                            router.push({
                              pathname: router.pathname,
                              query: { projectUrl: query.projectUrl },
                            })
                          }, 200)
                        }}
                      >
                        <XMarkIcon className='h-4 w-4 cursor-pointer text-gray-900 opacity-70 ' />
                      </button>
                    </div>
                  </div>
                  <Dialog.Title
                    as='h1'
                    className='pb-10 text-4xl font-medium leading-6 text-gray-800'
                  >
                    {taskData?.title}
                  </Dialog.Title>
                  <div className='flex flex-col justify-center '>
                    <div className='grid w-[22rem] grid-cols-[8rem_1fr] grid-rows-4 gap-y-4'>
                      <div className='row-start-1 flex items-center gap-3 text-gray-900 opacity-70'>
                        <BookmarkIcon className='h-4 w-4' />
                        <h3 className='text-md font-medium'>Status</h3>
                      </div>
                      <div className='row-start-1 flex items-center'>
                        <p className='font-semibold'>{taskData?.column.name}</p>
                      </div>
                      <div className='row-start-2 flex items-center gap-3 text-gray-900 opacity-70'>
                        <UserIcon className='h-4 w-4' />
                        <h3 className='text-md font-medium'>Assignee</h3>
                      </div>
                      <div className='row-start-2 flex items-center gap-1'>
                        <AssigneeSelector
                          image={taskData?.assignee?.image as string}
                          name={taskData?.assignee?.name as string}
                        />
                      </div>
                      <div className='row-start-3 flex items-center gap-3 text-gray-900 opacity-70'>
                        <TagIcon className='h-4 w-4' />
                        <h3 className='text-md font-medium'>Labels</h3>
                      </div>
                      <div className='row-start-3 flex flex-col justify-center'>
                        <div className='flex w-fit cursor-pointer items-center gap-1 px-2 py-1 text-gray-900 opacity-70'>
                          <PlusIcon className='h-3.5 w-3.5 stroke-2' />
                          <p className='text-sm font-semibold'>Add Label</p>
                        </div>
                      </div>
                      <div className='row-start-4 flex items-center gap-3 text-gray-900 opacity-70'>
                        <ChartBarIcon className='h-4 w-4' />
                        <h3 className='text-md font-medium'>Priority</h3>
                      </div>
                      <div className='row-start-4 flex items-center'>
                        <PrioritySelector
                          taskId={taskData?.id as number}
                          priorityId={taskData?.priorityId ?? null}
                        />
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default TaskViewDialog
