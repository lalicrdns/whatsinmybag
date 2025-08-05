import BagItem from './BagItem'

// sample bag items (fake data for now)
const sampleItems = [
    {
    name: "iPhone 14 Pro",
    brand: "Apple",
    imageUrl: "https://m.media-amazon.com/images/I/51Vs7ZwpSpL.__AC_SX300_SY300_QL70_FMwebp_.jpg",
    price: 999,
    x: 25,
    y: 30,
    caption: "phone !!"
  },
  {
    name: "AirPods Pro",
    brand: "Apple",
    imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1660803972361",
    price: 249,
    x: 65,
    y: 25,
    caption: "need that noise cancellation"
  },
  {
    name: "Rhode Lip Balm",
    brand: "Rhode",
    imageUrl: "https://internationalmakeup.in/wp-content/uploads/2025/03/Rhode-Peptide-Lip-Tint-PBJ.jpg",
    price: 16,
    x: 45,
    y: 60,
    caption: "lippie"
  }
]

interface BagBoardProps {
    title: string
    items?: typeof sampleItems
}

export default function BagBoard({ title, items = sampleItems }: BagBoardProps) {
    return (
        <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">{title}</h2>

            {/* Collage board */}
            <div className="relative bg-pink-100 rounded-xl p-8 min-h-[500px] shadow-inner">
                {items.map((item, index) => (
                    <BagItem
                        key={index}
                        name={item.name}
                        brand={item.brand}
                        imageUrl={item.imageUrl}
                        price={item.price}
                        x={item.x}
                        y={item.y}
                        caption={item.caption}
                    />
                ))}
            </div>

            {/* Stats footer */}
            <div className="flex justify-center gap-6 mt-4 text-sm text-gray-600">
                <span>{items.length} items</span>
                <span> {'<'}3 24 likes</span>
                <span> + 5 comments</span>
            </div>
        </div>
    )
}