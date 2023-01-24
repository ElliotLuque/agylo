import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
	const icons = await prisma.icon.createMany({
		data: [
			{ color: 'bg-red-500' },
			{ color: 'bg-yellow-500' },
			{ color: 'bg-lime-500' },
			{ color: 'bg-blue-500' },
			{ color: 'bg-pink-700' },
			{ color: 'bg-purple-500' },
			{ color: 'bg-pink-500' },
			{ color: 'bg-gray-700' },
		],
	})

	const priorities = await prisma.priority.createMany({
		data: [{ name: 'Low' }, { name: 'Medium' }, { name: 'High' }],
	})

	const roles = await prisma.role.createMany({
		data: [{ name: 'admin' }, { name: 'member' }],
	})

	const labelColors = await prisma.labelColor.createMany({
		data: [
			{ background: 'bg-gray-100', foreground: 'text-gray-500' },
			{ background: 'bg-lime-200', foreground: 'text-lime-600' },
			{ background: 'bg-emerald-100', foreground: 'text-emerald-500' },
			{ background: 'bg-sky-100', foreground: 'text-sky-400' },
			{ background: 'bg-teal-100', foreground: 'text-teal-500' },
			{ background: 'bg-violet-100', foreground: 'text-violet-500' },
			{ background: 'bg-fuchsia-100', foreground: 'text-fuchsia-400' },
			{ background: 'bg-pink-100', foreground: 'text-pink-400' },
		],
	})

	console.log({ icons })
	console.log({ priorities })
	console.log({ roles })
	console.log({ labelColors })
}
main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
