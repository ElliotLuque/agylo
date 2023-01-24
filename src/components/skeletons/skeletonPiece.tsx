const SkeletonPiece: React.FC<{ classNames?: string }> = ({ classNames }) => {
	return (
		<span
			className={`${classNames} inline-flex animate-pulse bg-slate-200 dark:bg-slate-700`}
		/>
	)
}

export default SkeletonPiece
