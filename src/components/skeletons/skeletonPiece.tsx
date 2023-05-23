import type { ReactElement } from 'react'

const SkeletonPiece: React.FC<{
	classNames?: string
	children?: ReactElement
	darker?: boolean
	lighter?: boolean
}> = ({ classNames, children, darker, lighter }) => {
	return (
		<span
			className={`${classNames} ${darker ? 'bg-gray-300' : 'bg-slate-200'} ${
				lighter ? 'bg-slate-100' : 'bg-slate-200'
			} inline-flex animate-pulse duration-75`}
		>
			{children}
		</span>
	)
}

export default SkeletonPiece
