// writing the server component that fetches all the bags from db and shows them

import { prisma } from '../../lib/db' // @/ points to src folder
import { Bag } from '@prisma/client' // tells ts what shape a bag is
import Link from 'next/link' // need this for clien-side routing

export default async function AllBagsPage() {
  const bags = await prisma.bag.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">all bags</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {bags.map((bag: Bag) => (
          <div
            key={bag.id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
          >
            {/* Wrap bag title in a <Link> so it's clickable */}
            <Link href={`/bags/${bag.id}`}>
              <h2 className="font-semibold text-lg hover:underline">
                {bag.title}
              </h2>
            </Link>

            <p className="text-sm text-gray-600">{bag.description}</p>
            <p className="text-xs text-gray-400 mt-2">
              {bag.isPrivate ? 'private' : 'public'}
            </p>
          </div>
        ))}
      </div>
    </main>
  )
}