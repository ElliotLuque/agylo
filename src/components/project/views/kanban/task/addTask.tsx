import { useRef, useState } from 'react'
import { useOnClickOutside } from 'usehooks-ts'
import { useKeypress } from '../../../../../utils/useKeypress'
import { trpc } from '../../../../../utils/trpc'
import { useForm } from 'react-hook-form'
import { PlusIcon } from '@heroicons/react/24/outline'
import LoadingSpinner from '../../../../misc/loadingSpinner'

const AddTask: React.FC<{
  columnId: number
  columnLength: number
  projectId: number
}> = ({ projectId, columnId, columnLength }) => {
  const [isAdding, setIsAdding] = useState(false)

  const ref = useRef<HTMLDivElement>(null)

  const handleOutsideClick = () => setIsAdding(false)
  const handleInsideClick = () => setIsAdding(true)

  useOnClickOutside(ref, handleOutsideClick, 'mouseup')
  useKeypress('Escape', () => setIsAdding(false))

  const { register, reset, handleSubmit } = useForm<{ title: string }>({})

  const trpcUtils = trpc.useContext()
  const { mutateAsync: createTask, isLoading } =
    trpc.task.createTask.useMutation()

  const handleCreateTask = async (formData: { title: string }) => {
    try {
      await createTask({
        title: formData.title.trim(),
        projectId,
        columnId: columnId,
        index: columnLength,
      })

      trpcUtils.project.invalidate()
      reset({ title: '' })

      setIsAdding(false)
    } catch (error) {
      console.log(error)
    }
  }

  return isAdding ? (
    <div
      ref={ref}
      className='flex min-h-[7rem] w-[17rem] flex-col gap-2 rounded-lg border-[0.09rem] border-gray-200 bg-white p-4'
    >
      <div className='flex flex-col justify-start'>
        <form onSubmit={handleSubmit(handleCreateTask)}>
          <input
            {...register('title', { required: true })}
            autoFocus
            type='text'
            className='h-[2rem] w-full rounded-lg p-1 focus:outline-none '
            placeholder='Write a task title...'
          />
        </form>
        {isLoading && (
          <div className='w-10 pt-4'>
            <LoadingSpinner classNames='w-9 h-9 p-2 animate-spin fill-indigo-500 text-gray-200 dark:text-gray-600' />
          </div>
        )}
      </div>
    </div>
  ) : (
    <button
      onClick={handleInsideClick}
      className='flex min-h-[2rem] w-[17rem] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg p-4  hover:bg-gray-50'
    >
      <div className='flex w-full items-center justify-center gap-3'>
        <PlusIcon className='h-[1.2rem] w-[1.2rem] text-gray-900 opacity-70' />
        <p className='select-none text-sm font-medium text-gray-900 opacity-70'>
          Add task
        </p>
      </div>
    </button>
  )
}

export default AddTask
