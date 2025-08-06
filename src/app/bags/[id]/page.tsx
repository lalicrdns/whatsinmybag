import { notFound } from 'next/navigation'
import { prisma } from '../../../lib/db'
import Link from 'next/link'
import AddItemForm from './AddItemForm'

export default async function BagDetailPage({
  params
}: {
  params: { id: string }
}) {
  const bag = await prisma.bag.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      items: {
        orderBy: {createdAt: 'desc' }
      }
    }
  })

  if (!bag) return notFound()

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <Link 
        href="/bags" 
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        ← Back to all bags
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{bag.title}</h1>
        {bag.description && (
          <p className="text-gray-600 mb-2">{bag.description}</p>
        )}
        <p className="text-sm text-gray-400">
          {bag.isPrivate ? 'Private bag' : 'Public bag'} • {bag.items.length} items
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Items in this bag</h2>
          <div className="mb-8 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">add item</h2>
            <AddItemForm bagId={bag.id}/>
          </div>
        
        {bag.items.length === 0 ? (
          <p className="text-gray-500 italic">No items in this bag yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bag.items.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-lg shadow"
              >
                <h3 className="font-semibold text-lg">{item.name}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}