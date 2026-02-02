import path from 'node:path'
import { defineConfig } from 'prisma/config'
import dotenv from 'dotenv'

// Load .env file
const envPath = path.join(__dirname, '.env')
console.log('Loading .env using dotenv from:', envPath)
const result = dotenv.config({ path: envPath })

if (result.error) {
    console.error('Error loading .env:', result.error)
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
