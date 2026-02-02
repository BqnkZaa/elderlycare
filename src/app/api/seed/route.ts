/**
 * Database Seed API Route
 * 
 * Creates initial admin user for the system.
 * Call this once after deploying: GET /api/seed
 */

import { NextResponse } from 'next/server';
import { seedAdminUser } from '@/actions/auth.actions';

export async function GET() {
    try {
        const result = await seedAdminUser();

        return NextResponse.json({
            success: result.success,
            message: result.message,
            data: result.data,
        });
    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
