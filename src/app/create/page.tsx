'use client' // tells next.js this component runs in the browser

import { useState } from 'react' // react hook for tracking form inputs

export default function CreateBagPage() {
    // want to let the user create a new bag, with title, desc, privacy setting
    // + save that bag into our database
    // these tracks what the user types into the forms 
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [isPrivate, setIsPrivate] = useState(false)

    // function runs when form is submitted
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault() // prevents browser from refreshing the page

        // send a post request to my api with the bag data
        const res = await fetch('/api/create-bag', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, description, isPrivate })
        })

        const data = await res.json() // parse the response

        if (res.ok) {
            alert('bag created!')
            console.log('created bag:', data)
            // can make user navigate to other page later
        } else {
            alert(`Error: ${data.message}`) // show error if something went wrong
            console.log('error response:', data)
        }
    }

    return (
        <main className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Create a New Bag</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Input for the bag title */}
                    <input
                    placeholder="Bag title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)} // update the title state
                    className="border p-2 w-full"
                    />

                    {/* Input for the bag description */}
                    <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)} // update the description state
                    className="border p-2 w-full"
                    />

                    {/* Checkbox to mark bag as private */}
                    <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={isPrivate}
                        onChange={(e) => setIsPrivate(e.target.checked)} // update private flag
                    />
                    Make bag private?
                    </label>

                    {/* Submit button */}
                    <button type="submit" className="bg-black text-white px-4 py-2 rounded">
                    Create Bag
                    </button>
                </form>
        </main>
    )
}