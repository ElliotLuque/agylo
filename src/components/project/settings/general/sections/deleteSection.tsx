const DeleteSection: React.FC<{
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ setOpenDialog }) => {
  return (
    <div className='py-5'>
      <h1 className='text-lg font-medium text-gray-800'>Delete project</h1>
      <p className='mt-2 text-sm text-gray-500'>
        If you delete this project, all tasks, team members and comments will be
        permanently deleted. Please be certain.
      </p>

      <button
        onClick={() => setOpenDialog(true)}
        className='text-md mt-5 w-full rounded-lg bg-red-500 px-8 py-2.5 text-center font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 sm:w-auto'
      >
        Delete this project
      </button>
    </div>
  )
}

export default DeleteSection
