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

  console.log({ roles })
  console.log({ icons })
  console.log({ priorities })
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
