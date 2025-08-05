import { NextResponse } from 'next/server' // nextjs helper for making api responses
import { prisma } from '../../../lib/db' // import prisma to talk to my db


// this handles post requests to api/create-bag
export async function POST(req: Request) {
  try {
    const { title, description, isPrivate } = await req.json();
    const userId = 'demo-user-id';

    // Check if demo user exists, create if not
    let user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          email: 'demo@example.com',
          name: 'Demo User',
        }
      });
    }

    const newBag = await prisma.bag.create({
      data: {
        title,
        description,
        isPrivate,
        userId
      }
    });

    return Response.json(newBag);
  } catch (error) {
    console.error('Error creating bag:', error);
    return Response.json({ error: 'Failed to create bag' }, { status: 500 });
  }
}