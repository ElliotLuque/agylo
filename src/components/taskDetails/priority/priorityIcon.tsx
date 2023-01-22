import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline'

const PriorityIcon: React.FC<{ priorityId: number | null }> = ({
  priorityId,
}) => {
  const priorities = [
    { id: 1, name: 'Low', color: 'text-blue-500', bgColor: 'bg-blue-100' },
    {
      id: 2,
      name: 'Medium',
      color: 'text-yellow-600',
      bgColor: 'bg-amber-100',
    },
    { id: 3, name: 'High', color: 'text-red-500', bgColor: 'bg-red-100' },
  ]

  const getPriorityInfo = (priorityId: number | null) => {
    return priorities.find((p) => p.id === priorityId)
  }

  if (priorityId === null) {
    return (
      <div className='flex items-center gap-1 hover:cursor-pointer'>
        <EllipsisHorizontalIcon className='w-4 text-gray-800' />
        <p className='text-sm font-semibold text-gray-900 opacity-70'>No priority</p>
      </div>
    )
  }

  return (
    <div
      className={`rounded px-1.5 py-1 text-sm font-semibold ${
        getPriorityInfo(priorityId)?.color
      } ${getPriorityInfo(priorityId)?.bgColor}`}
    >
      {getPriorityInfo(priorityId)?.name}
    </div>
  )
}

export default PriorityIcon
