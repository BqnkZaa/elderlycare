/**
 * Prisma Client Singleton
 * 
 * Creates a single Prisma client instance to be reused across the application.
 * This prevents connection pool exhaustion during development with hot-reloading.
 */

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

export default prisma;
