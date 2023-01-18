import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Task } from '../../../../../types/kanban'
import Link from 'next/link'
import { useRouter } from 'next/router'

const TaskSortable: React.FC<Task & { cursor: string, onClick: () => void }> = ({
  id,
  title,
  taskKey,
  index,
  cursor
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: taskKey,
  })

  const router = useRouter()
  const query = router.query

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className='min-h-[7rem] w-[17rem] rounded-lg border-[0.115rem] border-dashed border-gray-300 bg-gray-50'
      ></div>
    )
  }

  return (
    <Link
      href={{
        pathname: router.pathname,
        query: { ...query, selectedTask: taskKey },
      }}
      {...attributes}
      {...listeners}
      ref={setNodeRef}
      style={style}
      className={`flex min-h-[7rem] w-[17rem] ${cursor} flex-col gap-2 rounded-lg border-[0.09rem] border-gray-200 bg-white p-4`}
    >
      <p className='select-none'>
        {id}-{title} at index {index}{' '}
        <span className='font-bold'>{taskKey}</span>
      </p>
    </Link>
  )
}

export default TaskSortable
