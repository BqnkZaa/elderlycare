/**
 * Database Seed API Route
 * 
 * Creates sample data for the elderly care system.
 * Includes: Users, Elderly Profiles, Daily Logs, Appointments, Scheduled Activities
 * 
 * Call this once after deploying: GET /api/seed
 * Or use query params for specific seeds:
 *   - GET /api/seed?type=all (default - seeds everything)
 *   - GET /api/seed?type=users
 *   - GET /api/seed?type=elderly
 *   - GET /api/seed?type=logs
 *   - GET /api/seed?type=appointments
 *   - GET /api/seed?type=activities
 */

import { NextRequest, NextResponse } from 'next/server';
import {
    seedUsers,
    seedElderlyProfiles,
    seedDailyLogs,
    seedAppointments,
    seedScheduledActivities,
    seedAll
} from '@/actions/seed.actions';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const type = searchParams.get('type') || 'all';

        let result;

        switch (type) {
            case 'users':
                result = await seedUsers();
                break;
            case 'elderly':
                result = await seedElderlyProfiles();
                break;
            case 'logs':
                result = await seedDailyLogs();
                break;
            case 'appointments':
                result = await seedAppointments();
                break;
            case 'activities':
                result = await seedScheduledActivities();
                break;
            case 'all':
            default:
                result = await seedAll();
                break;
        }

        if (!result.success) {
            throw new Error('error' in result ? result.error : 'Seed failed');
        }

        return NextResponse.json({
            success: true,
            message: result.message,
            type,
            details: 'details' in result ? result.details : undefined
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
