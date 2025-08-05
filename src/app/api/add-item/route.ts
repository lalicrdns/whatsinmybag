import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'

export async function POST(req: Request) {
  try {
    const { name, description, quantity, category, bagId } = await req.json()

    // Validate required fields
    if (!name || !bagId) {
      return Response.json(
        { error: 'Name and bagId are required' }, 
        { status: 400 }
      )
    }

    // Check if bag exists
    const bag = await prisma.bag.findUnique({
      where: { id: bagId }
    })

    if (!bag) {
      return Response.json(
        { error: 'Bag not found' }, 
        { status: 404 }
      )
    }

    // Create the item
    const newItem = await prisma.item.create({
      data: {
        name,
        description: description || null,
        quantity: quantity || 1,
        category: category || null,
        bagId
      }
    })

    return Response.json(newItem)
  } catch (error) {
    console.error('Error adding item:', error)
    return Response.json(
      { error: 'Failed to add item' }, 
      { status: 500 }
    )
  }
}