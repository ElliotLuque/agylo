import { Menu, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import PriorityIcon from './priorityIcon'
import { ChartBarIcon } from '@heroicons/react/24/solid'
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline'
import { trpc } from '../../../../../../utils/trpc'

const PrioritySelector: React.FC<{
  priorityId: number | null
  taskId: number
}> = ({ priorityId, taskId }) => {
  const trpcUtils = trpc.useContext()
  const { mutateAsync: updateTaskPriority } =
    trpc.task.updateTaskPriority.useMutation()

  const handlePriorityChange = async (priorityId: number | null) => {
    try {
      setSelectedPriorityId(priorityId)
      await updateTaskPriority({ priorityId: priorityId, taskId })
      trpcUtils.task.invalidate()
    } catch (error) {
      console.log(error)
    }
  }

  const [selectedPriorityId, setSelectedPriorityId] = useState<number | null>(
    null,
  )

  useEffect(() => {
    setSelectedPriorityId(priorityId)
  }, [priorityId])

  return (
    <>
      <Menu as='div' className='relative z-20 grid place-content-center'>
        <Menu.Button className='flex items-center gap-1 rounded-md transition-all outline-none select-none hover:scale-[1.2] hover:cursor-pointer'>
          <PriorityIcon priorityId={selectedPriorityId} />
        </Menu.Button>

        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
        >
          <Menu.Items className='absolute top-8 left-1 mt-2 w-32 origin-top-left divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
            <div className='flex flex-col justify-center px-1 py-1'>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => handlePriorityChange(null)}
                    className={`flex items-center gap-1 opacity-80 rounded p-2 ${
                      active ? 'bg-gray-100' : 'bg-white'
                    }`}
                  >
                    <EllipsisHorizontalIcon className='w-4 text-gray-900 mt-1' />
                    <p className='text-sm text-gray-900 '>No priority</p>
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => handlePriorityChange(1)}
                    className={`flex items-center gap-1 rounded p-2 ${
                      active ? 'bg-gray-100' : 'bg-white'
                    }`}
                  >
                    <ChartBarIcon className='w-4 text-blue-500' />
                    <p className='text-sm text-blue-400'>Low</p>
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => handlePriorityChange(2)}
                    className={`flex items-center gap-1 rounded p-2 ${
                      active ? 'bg-gray-100' : 'bg-white'
                    }`}
                  >
                    <ChartBarIcon className='w-4 text-yellow-500' />
                    <p className='text-sm text-yellow-600'>Medium</p>
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => handlePriorityChange(3)}
                    className={`flex items-center gap-1 rounded p-2 ${
                      active ? 'bg-gray-100' : 'bg-white'
                    }`}
                  >
                    <ChartBarIcon className='w-4 text-red-500' />
                    <p className='text-sm text-red-400'>High</p>
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  )
}

export default PrioritySelector
