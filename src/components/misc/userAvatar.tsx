import Image from 'next/image'

const UserAvatar: React.FC<{ width: number; height: number, imageUrl: string | null }> = ({
  width,
  height,
  imageUrl
}) => {

  return (
    <Image
      className='rounded-full'
      width={width}
      height={height}
      src={
        imageUrl ??
        '/default-user.jpg'
      }
      alt='User image'
    />
  )
}

export default UserAvatar
