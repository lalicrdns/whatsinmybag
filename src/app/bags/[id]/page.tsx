import { notFound } from 'next/navigation'
import { prisma } from '../../../lib/db'
import EnhancedBagDetail from './EnhancedBagDetail'

export default async function BagDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  const bag = await prisma.bag.findUnique({
    where: { id },
    include: {
      user: true,
      items: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!bag) return notFound()

  // Convert to the format expected by the client component
  const bagData = {
    id: bag.id,
    title: bag.title,
    description: bag.description,
    isPrivate: bag.isPrivate,
    createdAt: bag.createdAt.toISOString(),
    userId: bag.userId
  }

  const itemsData = bag.items.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    quantity: item.quantity,
    category: item.category,
    bagId: item.bagId,
    createdAt: item.createdAt.toISOString()
  }))

  return <EnhancedBagDetail bag={bagData} items={itemsData} />
}