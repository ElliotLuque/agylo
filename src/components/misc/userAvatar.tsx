import Image from 'next/image'

const UserAvatar: React.FC<{ width: number; height: number, imageUrl: string | null, isInvisible: boolean }> = ({
  width,
  height,
  isInvisible,
  imageUrl
}) => {

  return (
    <Image
      className={`rounded-full ${isInvisible ? 'invisible' : undefined }`}
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
