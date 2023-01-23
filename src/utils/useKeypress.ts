import { useEffect } from 'react'

export const useKeypress = (key: string, callback: () => void) => {
	useEffect(() => {
		const handle = (e: KeyboardEvent) => {
			if (e.key === key) {
				callback()
			}
		}
		document.addEventListener('keyup', handle)
		return () => document.removeEventListener('keyup', handle)
	}, [key, callback])
}
