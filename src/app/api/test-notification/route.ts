/**
 * Test Notification API Route
 * 
 * POST /api/test-notification
 * Body: { email?: string, phone?: string }
 * 
 * Sends a test email and/or SMS to verify notification services are working.
 */
import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/services/email.service';
import { smsService } from '@/services/sms.service';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, phone } = body as { email?: string; phone?: string };

        const results: {
            email?: { success: boolean; messageId?: string; error?: string; configured: boolean };
            sms?: { success: boolean; creditUsed?: number; error?: string; configured: boolean };
        } = {};

        // Test Email
        if (email) {
            const emailConfigured = emailService.isConfigured();
            console.log(`📧 Testing email to: ${email} (configured: ${emailConfigured})`);

            if (emailConfigured) {
                const emailResult = await emailService.send({
                    to: email,
                    subject: '✅ ทดสอบระบบแจ้งเตือน ElderCare',
                    html: `
                        <div style="font-family: 'Sarabun', sans-serif; padding: 20px; background: #f0fdf4; border-radius: 8px; border: 1px solid #bbf7d0;">
                            <h2 style="color: #16a34a;">✅ ทดสอบระบบแจ้งเตือนอีเมล</h2>
                            <p style="font-size: 16px; color: #374151;">
                                ระบบแจ้งเตือนอีเมลทำงาน<strong>สำเร็จ</strong>แล้ว!
                            </p>
                            <p style="color: #6b7280;">
                                ข้อความนี้ถูกส่งเมื่อ: ${new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })}
                            </p>
                            <hr style="border: none; border-top: 1px solid #bbf7d0; margin: 20px 0;">
                            <p style="font-size: 12px; color: #9ca3af;">
                                ข้อความทดสอบจากระบบ ElderCare
                            </p>
                        </div>
                    `,
                    text: 'ทดสอบระบบแจ้งเตือนอีเมล ElderCare - ระบบทำงานสำเร็จ!',
                });
                results.email = { ...emailResult, configured: true };
            } else {
                results.email = { success: false, error: 'Email not configured', configured: false };
            }
        }

        // Test SMS
        if (phone) {
            const smsConfigured = smsService.isConfigured();
            console.log(`📱 Testing SMS to: ${phone} (configured: ${smsConfigured})`);

            if (smsConfigured) {
                const smsResult = await smsService.send({
                    to: phone,
                    message: `✅ ทดสอบระบบ ElderCare: ระบบแจ้งเตือน SMS ทำงานสำเร็จ! (${new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })})`,
                });
                results.sms = { ...smsResult, configured: true };
            } else {
                results.sms = { success: false, error: 'SMS not configured', configured: false };
            }
        }

        if (!email && !phone) {
            return NextResponse.json(
                { error: 'Please provide at least one of: email, phone' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            timestamp: new Date().toISOString(),
            results,
        });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Test notification error:', error);
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
