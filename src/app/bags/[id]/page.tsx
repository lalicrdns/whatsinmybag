import { prisma } from '../../../lib/db'
import { notFound } from 'next/navigation'

interface BagPageProps {
  params: { id: string } // tells Next.js we're expecting a dynamic `id` param
}

export default async function BagPage({ params }: BagPageProps) {
  const bag = await prisma.bag.findUnique({
    where: { id: params.id },
    include: { items: true }, // optional: include related items (empty for now)
  })

  if (!bag) return notFound()

  return (
    <main className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold">{bag.title}</h1>
      <p className="text-gray-600 mb-2">{bag.description}</p>
      <p className="text-sm text-gray-400">
        {bag.isPrivate ? '🔒 Private' : '🌎 Public'}
      </p>

      <hr className="my-6" />

      <h2 className="text-xl font-semibold mb-2">my essentials!</h2>
      <ul className="list-disc pl-6">
        {Array.isArray(bag.items) && bag.items.length > 0 ? (
          bag.items.map((item: any) => <li key={item.id}>{item.name}</li>)
        ) : (
          <p className="text-gray-500 italic">no items yet</p>
        )}
      </ul>
    </main>
  )
}