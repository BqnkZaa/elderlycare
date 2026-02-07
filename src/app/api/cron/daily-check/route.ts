/**
 * Cron Job API Route - Daily Check
 * 
 * This route is called by Plesk Scheduler via curl to trigger daily alerts.
 * Protected with a secret key in the query parameter.
 * 
 * Usage (Plesk Scheduler):
 * curl "https://yourdomain.com/api/cron/daily-check?secret=YOUR_CRON_SECRET"
 * 
 * Schedule: 0 8 * * * (Every day at 8:00 AM)
 */

import { NextRequest, NextResponse } from 'next/server';
import { notificationService } from '@/services/notification.service';

export async function GET(request: NextRequest) {
    try {
        // Validate secret key
        const secret = request.nextUrl.searchParams.get('secret');
        const expectedSecret = process.env.CRON_SECRET;

        if (!expectedSecret) {
            console.error('CRON_SECRET not configured in environment');
            return NextResponse.json(
                {
                    success: false,
                    error: 'Server configuration error'
                },
                { status: 500 }
            );
        }

        if (secret !== expectedSecret) {
            console.warn('Invalid cron secret attempted');
            return NextResponse.json(
                {
                    success: false,
                    error: 'Unauthorized'
                },
                { status: 401 }
            );
        }

        console.log('═'.repeat(60));
        console.log('🕗 DAILY CRON JOB STARTED');
        console.log(`⏰ Time: ${new Date().toLocaleString('th-TH')}`);
        console.log('═'.repeat(60));

        // Process daily alerts
        const result = await notificationService.processDailyAlerts();

        console.log('═'.repeat(60));
        console.log('✅ DAILY CRON JOB COMPLETED');
        console.log(`📊 Processed: ${result.processed} events`);
        console.log(`✅ Successful: ${result.successful} notifications`);
        console.log(`❌ Failed: ${result.failed} notifications`);
        console.log('═'.repeat(60));

        return NextResponse.json({
            success: true,
            message: 'Daily check completed',
            data: {
                timestamp: new Date().toISOString(),
                eventsProcessed: result.processed,
                notificationsSent: result.successful,
                notificationsFailed: result.failed,
                channels: {
                    emailConfigured: !!process.env.EMAIL_FROM_ADDRESS,
                    smsConfigured: !!process.env.SMS_API_KEY,
                },
                alerts: result.alerts.map(a => ({
                    type: a.type,
                    elderlyName: a.elderlyName,
                    message: a.message,
                    emailSent: a.emailSent,
                    smsSent: a.smsSent,
                    emailError: a.emailError,
                    smsError: a.smsError,
                })),
            },
        });

    } catch (error) {
        console.error('Cron job error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString(),
            },
            { status: 500 }
        );
    }
}

// Also support POST for flexibility
export async function POST(request: NextRequest) {
    return GET(request);
}
