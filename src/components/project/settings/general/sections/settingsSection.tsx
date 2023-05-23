import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { trpc } from '../../../../../utils/trpc'
import { useRouter } from 'next/router'

interface IProjectUpdateInputs {
	name: string
	url: string
	description: string
}

const SettingsSection: React.FC<{
	id: number
	name: string
	url: string
	description: string
	setToast: React.Dispatch<React.SetStateAction<boolean>>
	setErrorToast: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ id, name, url, description, setToast, setErrorToast }) => {
	const trpcUtils = trpc.useContext()

	const router = useRouter()
	const { projectUrl } = router.query

	const { mutateAsync: updateProject } = trpc.project.updateProject.useMutation(
		{
			onSuccess: (updated) => {
				if (projectUrl !== updated?.url) {
					router.push(`/[projectUrl]/settings`, `/${updated?.url}/settings`)
				}
				setToast(true)
				trpcUtils.project.invalidate()
				setTimeout(() => {
					setToast(false)
				}, 3500)
			},
		},
	)

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<IProjectUpdateInputs>({})

	const onSubmit = async (data: IProjectUpdateInputs) => {
		try {
			await updateProject({
				id,
				name: data.name,
				url: data.url,
				description: data.description,
			})
		} catch (error) {
			setErrorToast(true)
			setTimeout(() => {
				setErrorToast(false)
			}, 3500)
		}
	}

	useEffect(() => {
		reset({
			name,
			url,
			description,
		})
	}, [name, url, description, reset])

	return (
		<div className='py-5'>
			<h1 className='text-lg font-medium text-gray-800'>Details</h1>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className='my-6'>
					<label
						htmlFor='name'
						className='mb-2 block text-base font-medium text-gray-800 '
					>
						Name
					</label>
					<input
						{...register('name', {
							required: { value: true, message: 'is required' },
							minLength: {
								value: 5,
								message: 'must have at least 5 characters',
							},
							maxLength: {
								value: 20,
								message: 'must have a maximum of 20 characters',
							},
						})}
						type='text'
						id='name'
						className={`block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm font-medium text-gray-900 ${
							errors.name
								? 'border-red-400 bg-red-50 focus:ring-red-200'
								: 'focus:border-indigo-400 focus:ring-indigo-200'
						} focus:outline-none focus:ring-1`}
					/>
					{errors.name && (
						<p className='mt-2 text-sm font-medium text-red-400'>
							Project name {String(errors.name.message)}
						</p>
					)}
				</div>
				<div className='mb-6'>
					<label
						htmlFor='name'
						className='mb-2 block text-base font-medium text-gray-800'
					>
						URL
					</label>
					<div
						className={`flex w-full overflow-hidden rounded-lg border border-gray-300 bg-gray-50 text-sm font-medium text-gray-900 ${
							errors.url
								? 'border-red-400 bg-red-50 focus-within:ring-red-200'
								: 'focus-within:border-indigo-400 focus-within:ring-indigo-200'
						} focus-within:outline-none focus-within:ring-1`}
					>
						<span className='border-r border-gray-300 bg-gray-100 p-2.5'>
							agylo.app/
						</span>
						<input
							{...register('url', {
								required: { value: true, message: 'is required' },
								maxLength: {
									value: 20,
									message: 'must have a maximum of 20 characters',
								},
								pattern: {
									value: /^[a-zA-Z0-9-]+$/,
									message: 'can only contain letters, numbers and dashes',
								},
							})}
							type='text'
							id='url'
							className={`w-full bg-gray-50 p-2.5 ${
								errors.url
									? 'border-red-400 bg-red-50 focus:ring-red-200'
									: 'focus:border-indigo-400 focus:ring-indigo-200'
							} focus:outline-none focus:ring-1`}
						/>
					</div>
					{errors.url && (
						<p className='mt-2 text-sm font-medium text-red-400'>
							Project URL {String(errors.url.message)}
						</p>
					)}
				</div>
				<div className='mb-6'>
					<label
						htmlFor='description'
						className='mb-2 block text-base font-medium text-gray-800'
					>
						Description
					</label>
					<textarea
						{...register('description', {
							maxLength: {
								value: 200,
								message: 'must have a maximum of 200 characters',
							},
						})}
						id='description'
						rows={5}
						className={`block w-full resize-none rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 ${
							errors.description
								? 'border-red-400 bg-red-50 focus:ring-red-200'
								: 'focus:border-indigo-400 focus:ring-indigo-200'
						}  focus:outline-none focus:ring-1   `}
						placeholder='Write your project description...'
					/>
					{errors.description && (
						<p className='mt-2 text-sm font-medium text-red-400'>
							Project description {String(errors.description.message)}
						</p>
					)}
				</div>
				<div className='flex flex-row items-center justify-between'>
					<button
						type='submit'
						className='w-full rounded-lg bg-indigo-500 px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300 hover:bg-indigo-800 sm:w-auto'
					>
						Update
					</button>
				</div>
			</form>
		</div>
	)
}

export default SettingsSection
