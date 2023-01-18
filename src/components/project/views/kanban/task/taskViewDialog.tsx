import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment, useState } from 'react'
import LoadingSpinner from '../../../../misc/loadingSpinner'
import { trpc } from '../../../../../utils/trpc'
import { EllipsisHorizontalIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'

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
                <Dialog.Panel className='min-w-[42vw] max-w-md transform overflow-hidden rounded-2xl bg-white px-7 py-5 text-left align-middle shadow-xl transition-all'>
                  <div className='flex items-center justify-between pb-5'>
                    <h3 className='font-bold text-gray-800'>
                      <span className='font-normal text-gray-900 opacity-70'>
                        {projectName} /{' '}
                      </span>
                      {taskData?.taskKey}
                    </h3>
                    <div className='flex items-center gap-2'>
                      <EllipsisHorizontalIcon className='h-6 w-6 cursor-pointer text-gray-900 opacity-80' />
                      <button
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
                        <XMarkIcon className='h-4 w-4 cursor-pointer text-gray-900 opacity-70' />
                      </button>
                    </div>
                  </div>
                  <Dialog.Title
                    as='h1'
                    className='pb-5 text-3xl font-medium leading-6 text-gray-800'
                  >
                    {taskData?.title}
                  </Dialog.Title>
                  <div>
                    <div className='flex flex-col justify-center'></div>
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
