import { PrismaClient } from '@prisma/client'

declare global {
  let prisma: PrismaClient | undefined
}

const prisma = global.prisma || new PrismaClient({
  log: ['query', 'error', 'warn'],
  errorFormat: 'pretty',
})

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

// Add debug logging for production
if (process.env.NODE_ENV === 'production') {
  console.log('Production environment detected')
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set in production environment')
  }
  if (!process.env.DIRECT_URL) {
    console.error('DIRECT_URL is not set in production environment')
  }
}

export { prisma }
