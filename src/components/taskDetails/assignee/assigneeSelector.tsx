import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import UserAvatar from '../../misc/userAvatar'
import { useSession } from 'next-auth/react'

const AssigneeSelector: React.FC<{ name: string; image: string }> = ({
  name,
  image,
}) => {
  const session = useSession()

  return (
    <>
      <Menu as='div' className='relative z-20 grid place-content-center'>
        <Menu.Button className='flex items-center gap-1  rounded-md p-1 focus:outline-none hover:cursor-pointer hover:bg-gray-50'>
          <UserAvatar width={32} height={32} imageUrl={image as string} />
          <p className='text-md font-semibold text-gray-900 opacity-80'>
            {name ? undefined : 'Unassigned'}
            {name === session.data?.user?.name ? 'You' : name}
          </p>
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

export default AssigneeSelector
