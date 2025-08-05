'use client'

import { useState } from 'react'
// usestate lets us track if users is hovering on an item or not

interface BagItemProps {
    name: string
    brand?: string
    imageUrl: string
    price?: number 
    x: number
    y: number
    caption?: string 
}

// react functional component named BagIten
// like a widget showing said info, renders a little box on screen
export default function BagItem({
    name,
    brand,
    imageUrl,
    price,
    x,
    y,
    caption,
}: BagItemProps) {
    const [showInfo, setShowInfo] = useState(false) // flag starts off as false

    return ( // this div is the card container for item
        <div // white bg, rounded corners, medium drop shadow, padding, bigger shadown on hover, animates hover, width limit
        className={`absolute group ${showInfo ? 'z-20' : 'z-10'}`}
        // visual styling
        // absolute = positions this box relative to a parent
        style={{
            left: `${x}%`, // moves card to the right/left and down/up a % of the parents size
            top: `${y}%`,
            transform: 'translate(-50%, -50%)', // centers card exactly on the x/y spot
        }}
        onMouseEnter={() => setShowInfo(true)} // when users mouse moves over this item, true
        onMouseLeave={() => setShowInfo(false)}
        >
            <img // shows the item image
                src={imageUrl}
                alt={name} 
                // object-cover makes image fill the square without stretching
                // rounded makes it circualr-ish
                // mx-auto centers it horizontally 
                className="w-24 h-24 object-contain transition-transform duration-200 group-hover:scale-110"
            />

        {/* hover info box */}
        {showInfo && ( // only render box if showinfo is true
            <div 
                className="absolute z-10 bg-white text-sm p-2 rounded-lg shadow-lg max-w-xs min-w-[10rem] break-words z-30"
                style={{
                    top: '110%', 
                    left: '50%', 
                    transform: 'translateX(-50%)' }} // positions info box
            >
                <p className="font-semibold text-gray-800">{name}</p>
                {brand && <p className="text-gray-500">{brand}</p>}
                {price && <p className="text-green-600 font-medium">{price}</p>}
                {caption && <p className="text-gray-700 mt-1 italic">"{caption}"</p>}
            </div>
        )}
        </div>
    )
}