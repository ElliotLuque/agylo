const LabelIcon: React.FC<{ colorId: number; name: string, classNames: string }> = ({
  colorId,
  name,
  classNames
}) => {
  const labels = [
    { id: 1, bgColor: 'bg-gray-100', color: 'text-gray-500' },
    { id: 2, bgColor: 'bg-lime-200', color: 'text-lime-600' },
    { id: 3, bgColor: 'bg-emerald-100', color: 'text-emerald-500' },
    { id: 4, bgColor: 'bg-sky-100', color: 'text-sky-400' },
    { id: 5, bgColor: 'bg-teal-100', color: 'text-teal-500' },
    { id: 6, bgColor: 'bg-violet-100', color: 'text-violet-500' },
    { id: 7, bgColor: 'bg-fuchsia-100', color: 'text-fuchsia-400' },
    { id: 8, bgColor: 'bg-pink-100', color: 'text-pink-400' },
  ]

  const getLabel = (id: number) => {
    return labels.find((label) => label.id === id)
  }

  return (
    <div
      className={`${classNames} w-fit select-none rounded-lg px-1.5 py-1 font-semibold ${
        getLabel(colorId)?.bgColor
      } ${getLabel(colorId)?.color} cursor-default`}
    >
      {name}
    </div>
  )
}

export default LabelIcon
