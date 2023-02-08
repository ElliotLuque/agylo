import { useRef, useState } from 'react'
import { trpc } from '../../../../../utils/trpc'
import { useOnClickOutside } from 'usehooks-ts'
import { useKeypress } from '../../../../../utils/useKeypress'
import { useForm } from 'react-hook-form'
import { PlusIcon } from '@heroicons/react/24/outline'

const AddColumn: React.FC<{
	projectId: number
	columnsLength: number
}> = ({ projectId, columnsLength }) => {
	const trpcUtils = trpc.useContext()
	const { mutateAsync: createColumn } = trpc.column.createColumn.useMutation()

	const handleCreateColumn = async (formData: { name: string }) => {
		try {
			await createColumn({
				name: formData.name.trim(),
				projectId,
				index: columnsLength,
			})

			setIsCreatingColumn(false)
			trpcUtils.project.invalidate()
			reset({ name: '' })
		} catch (error) {
			console.log(error)
		}
	}

	const [isCreatingColumn, setIsCreatingColumn] = useState(false)

	const ref = useRef<HTMLDivElement>(null)

	const handleOutsideClick = () => setIsCreatingColumn(false)
	const handleInsideClick = () => setIsCreatingColumn(true)

	useOnClickOutside(ref, handleOutsideClick, 'mouseup')
	useKeypress('Escape', () => setIsCreatingColumn(false))

	const { register, reset, handleSubmit } = useForm<{ name: string }>({})

	return isCreatingColumn ? (
		<div
			ref={ref}
			className='flex min-h-[25rem] min-w-[23rem] cursor-pointer flex-col items-start justify-start gap-2 rounded-lg border-2 border-dashed border-gray-200 p-4'
		>
			<div className='flex w-full items-center justify-between'>
				<form onSubmit={handleSubmit(handleCreateColumn)}>
					<input
						{...register('name', { required: true })}
						autoFocus
						type='text'
						className='h-[2rem] w-full select-none rounded-lg p-2 text-xl font-bold placeholder:text-base placeholder:font-normal focus:outline-none'
						placeholder='Write a column title...'
					/>
				</form>
			</div>
		</div>
	) : (
		<button
			onClick={handleInsideClick}
			className='flex min-h-[25rem] min-w-[23rem] cursor-pointer flex-col items-start justify-start gap-2 rounded-lg p-4  hover:bg-gray-50'
		>
			<div className='flex items-center gap-3'>
				<PlusIcon className='h-[1.2rem] w-[1.2rem] text-gray-900 opacity-70' />
				<p className='select-none font-medium text-gray-900 opacity-70'>
					Add column
				</p>
			</div>
		</button>
	)
}

export default AddColumn
