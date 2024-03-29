const colors: Record<number, string> = {
	1: 'bg-red-500',
	2: 'bg-yellow-500',
	3: 'bg-lime-500',
	4: 'bg-blue-500',
	5: 'bg-pink-700',
	6: 'bg-purple-500',
	7: 'bg-pink-500',
	8: 'bg-gray-700',
}

const colorsFg: Record<number, string> = {
	1: 'text-red-500',
	2: 'text-yellow-500',
	3: 'text-lime-500',
	4: 'text-blue-500',
	5: 'text-pink-700',
	6: 'text-purple-500',
	7: 'text-pink-500',
	8: 'text-gray-700',
}

export const getIconBg = (id: number) => {
	return colors[id]
}

export const getIconFg = (id: number) => {
	return colorsFg[id]
}
