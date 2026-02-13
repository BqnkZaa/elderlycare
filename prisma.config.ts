import path from 'node:path'
import { defineConfig } from 'prisma/config'
import dotenv from 'dotenv'

// Load .env file
const envPath = path.join(__dirname, '.env')
console.log('Attempting to load .env from:', envPath)
// Only try to load if we are not in production or if we want to force it.
// On Vercel, .env won't exist which causes ENOENT. We should catch this.
try {
    const result = dotenv.config({ path: envPath })
    if (result.error) {
        // If file doesn't exist, it's fine in production.
        console.log('Note: .env file could not be loaded (likely using environment variables):', result.error.message)
    }
} catch (error) {
    console.log('Note: Failed to load .env file (likely intentionally missing in production).')
}

console.log('DATABASE_URL status:', process.env.DATABASE_URL ? 'Present' : 'Missing')
if (process.env.DATABASE_URL) {
    console.log('DATABASE_URL starts with:', process.env.DATABASE_URL.substring(0, 10) + '...')
}

export default defineConfig({
    schema: path.join(__dirname, 'prisma', 'schema.prisma'),
    datasource: {
        url: process.env.DATABASE_URL!,
        // @ts-expect-error - directUrl is supported in newer Prisma versions but types might lag
        directUrl: process.env.DIRECT_URL!,
    },
})
