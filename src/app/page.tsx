import BagBoard from '@/components/BagBoard'

export default function Home() {
  return (
    <main className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        { <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            what's in my bag?
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            share the items u can't go without!
          </p>
        </header> }

        <BagBoard title="lali's everyday essentials" />
      </div>
    </main>
  )
}