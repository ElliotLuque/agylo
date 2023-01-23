const SkeletonPiece: React.FC<{ classNames?: string }> = ({ classNames }) => {
  return <span className={`${classNames} inline-flex animate-pulse bg-gray-300`} />
}

export default SkeletonPiece
