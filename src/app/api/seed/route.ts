/**
 * Database Seed API Route
 * 
 * Creates initial admin user for the system.
 * Call this once after deploying: GET /api/seed
 */

import { NextResponse } from 'next/server';
import { seedUsers, seedElderlyProfiles } from '@/actions/seed.actions';

export async function GET() {
    try {
        // Seed Users
        const usersResult = await seedUsers();
        if (!usersResult.success) {
            throw new Error(usersResult.error);
        }

        // Seed Elderly Profiles
        const elderlyResult = await seedElderlyProfiles();
        if (!elderlyResult.success) {
            throw new Error(elderlyResult.error);
        }

        return NextResponse.json({
            success: true,
            message: 'Database seeded successfully',
            data: {
                users: usersResult.message,
                elderly: elderlyResult.message
            }
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
