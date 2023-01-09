import Image from 'next/image'
import { signOut, useSession } from 'next-auth/react'

const UserAvatar: React.FC<{ width: number; height: number }> = ({
  width,
  height,
}) => {
  const { data: session } = useSession()

  return (
    <Image
      onClick={() => signOut()}
      className='cursor-pointer rounded-full p-1'
      width={width}
      height={height}
      src={
        session?.user?.image ??
        'https://t3.ftcdn.net/jpg/03/58/90/78/360_F_358907879_Vdu96gF4XVhjCZxN2kCG0THTsSQi8IhT.jpg'
      }
      alt='User image'
    />
  )
}

export default UserAvatar
