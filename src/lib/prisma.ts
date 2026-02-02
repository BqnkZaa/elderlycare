/**
 * Prisma Client Singleton
 * 
 * Creates a single Prisma client instance to be reused across the application.
 * This prevents connection pool exhaustion during development with hot-reloading.
 * 
 * For Prisma 7.x, we use the MariaDB adapter for MySQL/MariaDB connections.
 */

import { PrismaClient } from '@/generated/prisma';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

function createPrismaClient() {
    // Create adapter with connection string
    const connectionString = process.env.DATABASE_URL ||
        `mysql://${process.env.DB_USER || 'root'}:${process.env.DB_PASSWORD || ''}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '3306'}/${process.env.DB_NAME || 'elderlycare'}`;

    const adapter = new PrismaMariaDb(connectionString);

    // Create Prisma client with adapter
    return new PrismaClient({ adapter });
}

const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

export default prisma;
