import {
  ExclamationCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'framer-motion'

const Toast: React.FC<{ message: string; isOpen: boolean; error: boolean }> = ({
  message,
  isOpen,
  error,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key='toast-updated'
          initial={{ x: 100, opacity: 0.1 }}
          exit={{ x: 100, opacity: 0.1 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.65 }}
        >
          <div
            className='pointer-events-none max-w-xs select-none rounded-md border bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800'
            role='alert'
          >
            <div className='flex items-center  gap-4 p-4'>
              {error ? (
                <ExclamationCircleIcon className='h-6 w-6 self-center text-red-500' />
              ) : (
                <InformationCircleIcon className='h-4 w-4 text-indigo-500' />
              )}
              <p className='text-md align-middle text-gray-700 dark:text-gray-400'>
                {message}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Toast
