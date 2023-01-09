import Link from 'next/link'
import UserAvatar from '../components/misc/userAvatar'

const Header: React.FC<{ name: string; description: string; url: string }> = ({
  name,
  description,
  url,
}) => {
  return (
    <header className='z-10 flex w-full flex-row flex-wrap items-center justify-between py-2 px-2 '>
      <div className='flex flex-row items-center gap-4'>
        <h1 className='text-lg'>{name}</h1>
      </div>
      <div className='flex flex-row items-center gap-4'>
        <h1 className='text-lg'>Search</h1>
        <Link
          href={{
            pathname: '/[projectUrl]/settings',
            query: { projectUrl: url },
          }}
        >
          <h1 className='text-lg'>Configuration</h1>
        </Link>
        <UserAvatar width={42} height={42} />
      </div>
    </header>
  )
}

export default Header
