import Sidebar from './sidebar'
import type { ReactElement } from 'react'

const Layout: React.FC<{
	children: ReactElement
}> = ({ children }) => {
	return (
		<div className='flex h-screen flex-row'>
			<Sidebar />
			<main className='ml-72 flex h-full w-full flex-row'>{children}</main>
		</div>
	)
}

export default Layout
