import {
  type AnimateLayoutChanges,
  defaultAnimateLayoutChanges,
  useSortable,
} from '@dnd-kit/sortable'
import type { Column } from '../../../../../types/kanban'
import { CSS } from '@dnd-kit/utilities'
import { EllipsisHorizontalIcon, PlusIcon } from '@heroicons/react/24/outline'
import ColumnOptions from './misc/columnOptionsMenu'
import { SelectColumn } from '../../../../../types/kanban-delete'

interface Props {
  id: Column['id']
  index: Column['index']
  name: Column['name']
  tasksCount: number
  availableColumns: SelectColumn[]
  children: React.ReactNode
}

const ColumnSortable: React.FC<Props> = ({
  id,
  name,
  children,
  tasksCount,
  availableColumns
}) => {
  const animateLayoutChanges: AnimateLayoutChanges = (args) =>
    defaultAnimateLayoutChanges({ ...args, wasDragging: true })

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, animateLayoutChanges })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  if (isDragging) {
    return (
      <div
        className='flex h-full min-w-[20rem] flex-col gap-5 rounded-lg border-2 border-dashed border-gray-200 p-4 opacity-50 shadow'
        ref={setNodeRef}
        style={style}
      >
        <div className='flex items-center justify-between gap-2'>
          <div className='flex items-center gap-4'>
            <h2 className='select-none text-xl font-bold'>{name}</h2>
          </div>
          <div className='flex items-center gap-2'>
            <PlusIcon className='h-4 w-4 text-gray-900 hover:cursor-pointer' />
            <EllipsisHorizontalIcon className='h-6 w-6 text-gray-900 hover:cursor-pointer' />
          </div>
        </div>
        <div className='flex cursor-pointer flex-col gap-3'>{children}</div>
      </div>
    )
  }

  return (
    <div
      className='flex h-full min-w-[20rem] flex-col gap-5 rounded bg-white p-4'
      ref={setNodeRef}
      style={style}
    >
      <div className='flex h-7 items-center justify-between gap-2'>
        <div
          className='flex h-full w-full cursor-grab items-center gap-4'
          {...attributes}
          {...listeners}
        >
          <h2 className='select-none text-xl font-bold'>{name}</h2>
        </div>
        <div className='flex h-full items-center gap-2'>
          <div className='grid h-full place-content-center rounded p-1 hover:cursor-pointer hover:bg-gray-100'>
            <PlusIcon className='w-4 text-gray-900' />
          </div>
          <ColumnOptions
            columnId={id}
            columnName={name}
            tasksCount={tasksCount}
            availableColumns={availableColumns}
          />
        </div>
      </div>
      <div className='flex flex-col gap-3'>{children}</div>
    </div>
  )
}

export default ColumnSortable
