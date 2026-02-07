/**
 * SMS Service
 * 
 * Sends SMS notifications via ThaiBulkSMS API.
 * Configuration through environment variables.
 * 
 * API Documentation: https://www.thaibulksms.com/developer
 */
import fetch from 'node-fetch';

interface SMSOptions {
    to: string | string[];
    message: string;
}

interface SMSResult {
    success: boolean;
    creditUsed?: number;
    error?: string;
}

// Check if SMS is configured
function isSMSConfigured(): boolean {
    return !!(
        process.env.SMS_API_KEY &&
        process.env.SMS_API_SECRET
    );
}

// Format phone number to Thai format (66xxxxxxxxx)
function formatPhoneNumber(phone: string): string {
    // Remove all non-digits
    let cleaned = phone.replace(/\D/g, '');

    // Handle Thai numbers starting with 0
    if (cleaned.startsWith('0')) {
        cleaned = '66' + cleaned.substring(1);
    }

    // Handle numbers already with country code
    if (!cleaned.startsWith('66')) {
        cleaned = '66' + cleaned;
    }

    return cleaned;
}

export const smsService = {
    /**
     * Check if SMS service is available
     */
    isConfigured(): boolean {
        return isSMSConfigured();
    },

    /**
     * Send an SMS via ThaiBulkSMS API
     */
    async send(options: SMSOptions): Promise<SMSResult> {
        if (!isSMSConfigured()) {
            console.log('📱 [SMS] Not configured - skipping send');
            return {
                success: false,
                error: 'SMS not configured. Set SMS_API_KEY and SMS_API_SECRET in .env'
            };
        }

        try {
            const apiKey = process.env.SMS_API_KEY!;
            const apiSecret = process.env.SMS_API_SECRET!;
            const sender = process.env.SMS_SENDER || 'ELDERCARE';

            // Format phone numbers
            const phoneNumbers = Array.isArray(options.to)
                ? options.to.map(formatPhoneNumber)
                : [formatPhoneNumber(options.to)];

            // ThaiBulkSMS API endpoint
            const url = 'https://api-v2.thaibulksms.com/sms';

            // Using node-fetch
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`,
                },
                body: JSON.stringify({
                    msisdn: phoneNumbers,
                    message: options.message,
                    sender: sender,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Typings for node-fetch response.json() are any, but we expect an error object or structure
                const errorMsg = (data as any).message || `HTTP ${response.status}`;
                throw new Error(errorMsg);
            }

            console.log(`📱 [SMS] Sent successfully to ${phoneNumbers.length} recipient(s)`);
            return {
                success: true,
                creditUsed: (data as any).credit_used || phoneNumbers.length * 0.5,
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error(`📱 [SMS] Failed to send: ${errorMessage}`);
            return {
                success: false,
                error: errorMessage,
            };
        }
    },

    /**
     * Send birthday notification SMS
     */
    async sendBirthdayNotification(elderlyName: string, recipientPhone: string): Promise<SMSResult> {
        return this.send({
            to: recipientPhone,
            message: `🎂 แจ้งเตือนจาก ElderCare: วันนี้เป็นวันเกิดของ ${elderlyName} กรุณาส่งความสุขให้ท่านด้วยนะคะ`,
        });
    },

    /**
     * Send anniversary notification SMS
     */
    async sendAnniversaryNotification(elderlyName: string, years: number, recipientPhone: string): Promise<SMSResult> {
        return this.send({
            to: recipientPhone,
            message: `🎊 แจ้งเตือนจาก ElderCare: วันนี้ครบรอบ ${years} ปี ที่ ${elderlyName} เข้ารับบริการ ขอบคุณที่ไว้วางใจ`,
        });
    },

    /**
     * Send appointment reminder SMS
     */
    async sendAppointmentReminder(elderlyName: string, title: string, date: Date, location: string | null, recipientPhone: string): Promise<SMSResult> {
        const dateStr = new Date(date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
        return this.send({
            to: recipientPhone,
            message: `💊 ElderCare: ${elderlyName} มีนัด "${title}" วันที่ ${dateStr}${location ? ` ที่ ${location}` : ''} กรุณาเตรียมตัวให้พร้อม`,
        });
    },

    /**
     * Send activity reminder SMS
     */
    async sendActivityReminder(elderlyName: string, activityTitle: string, time: string | null, recipientPhone: string): Promise<SMSResult> {
        return this.send({
            to: recipientPhone,
            message: `📅 ElderCare: ${elderlyName} มีกิจกรรม "${activityTitle}"${time ? ` เวลา ${time}` : ''} วันนี้`,
        });
    },

    /**
     * Send missing daily log warning SMS
     */
    async sendMissingLogWarning(elderlyName: string, days: number, recipientPhone: string): Promise<SMSResult> {
        return this.send({
            to: recipientPhone,
            message: `⚠️ ElderCare: ${elderlyName} ไม่มีบันทึก DailyLog มากกว่า ${days} วัน กรุณาตรวจสอบ`,
        });
    },
};
