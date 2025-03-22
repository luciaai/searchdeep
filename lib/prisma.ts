// This file is used to instantiate the Prisma client
// Using require instead of import to avoid TypeScript errors
const { PrismaClient } = require('@prisma/client');

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global as unknown as { prisma: any };

// Create a new PrismaClient instance
export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
