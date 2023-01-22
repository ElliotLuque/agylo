import Image from 'next/image'

const UserAvatar: React.FC<{ width: number; height: number, imageUrl: string }> = ({
  width,
  height,
  imageUrl
}) => {

  return (
    <Image
      className='rounded-full p-1'
      width={width}
      height={height}
      src={
        imageUrl ??
        'https://t3.ftcdn.net/jpg/03/58/90/78/360_F_358907879_Vdu96gF4XVhjCZxN2kCG0THTsSQi8IhT.jpg'
      }
      alt='User image'
    />
  )
}

export default UserAvatar
