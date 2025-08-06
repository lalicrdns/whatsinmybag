'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface AddItemFormProps {
    bagId: string
}

export default function AddItemForm({ bagId }: AddItemFormProps) {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [category, setCategory] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
        const res = await fetch('/api/add-item', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                description: description || null,
                quantity,
                category: category || null,
                bagId
            })
        })

        if (res.ok) {
            // clear form
            setName('')
            setDescription('')
            setQuantity(1)
            setCategory('')
            
            router.refresh() // Refresh page to show new item
            alert('Item added successfully!')
        } else {
            const error = await res.json()
            alert(`Error: ${error.error}`)
        }
        } catch (error) {
            console.error('Error adding item:', error)
            alert('Failed to add item')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Item name */}
                <input
                    type="text"
                    placeholder="Item name (required)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="border border-gray-300 rounded px-3 py-2"
                />

                {/* Category */}
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2"
                >
                    <option value="">Select category (optional)</option>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="toiletries">Toiletries</option>
                    <option value="documents">Documents</option>
                    <option value="accessories">Accessories</option>
                    <option value="food">Food & Snacks</option>
                    <option value="other">Other</option>
                </select>
            </div>

        {/* Description */}
        <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full"
            rows={2}
        />

        {/* Quantity */}
        <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Quantity:</label>
            <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="border border-gray-300 rounded px-3 py-2 w-20"
            />
        </div>

        {/* Submit button */}
        <button
            type="submit"
            disabled={isSubmitting || !name.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isSubmitting ? 'Adding...' : 'Add Item'}
        </button>
        </form>
    )
}