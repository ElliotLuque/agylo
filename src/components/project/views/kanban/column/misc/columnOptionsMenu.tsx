import { Menu, Transition } from '@headlessui/react'
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline'
import { useState, Fragment } from 'react'
import DeleteColumnDialog from './deleteColumnDialog'
import { SelectColumn } from '../../../../../../types/kanban-delete'

const ColumnOptions: React.FC<{
  tasksCount: number
  columnId: number
  columnName: string
  availableColumns: SelectColumn[]
}> = ({ columnId, columnName, tasksCount, availableColumns }) => {
  const [openDeleteDialog, setDeleteDialog] = useState<boolean>(false)

  return (
    <>
      <DeleteColumnDialog
        columnDeleteId={columnId}
        columnDeleteName={columnName}
        columnDeleteTasksCount={tasksCount}
        availableColumns={availableColumns}
        open={openDeleteDialog}
        setOpen={setDeleteDialog}
      />
      <Menu as='div' className='relative z-20 grid place-content-center'>
        <div>
          <Menu.Button className='flex flex-col items-center justify-center rounded-md p-1 focus:outline-none hover:cursor-pointer hover:bg-gray-100'>
            <EllipsisHorizontalIcon className='h-6 w-6 text-gray-900' />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
        >
          <Menu.Items className='absolute top-6 right-2 mt-2 w-32 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
            <div className='px-1 py-1'>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-100' : 'bg-white'
                    } group flex  w-full items-center rounded-md p-2 text-sm text-gray-900`}
                  >
                    Rename
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => setDeleteDialog(true)}
                    className={`${
                      active ? 'bg-gray-100' : 'bg-white'
                    } group flex w-full items-center rounded-md p-2 text-sm text-gray-900`}
                  >
                    Delete
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

export default ColumnOptions