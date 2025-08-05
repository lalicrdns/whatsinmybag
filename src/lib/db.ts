// src/lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Avoid creating multiple instances of Prisma in dev
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'], // optional: shows DB queries in terminal
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma