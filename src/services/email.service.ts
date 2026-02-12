/**
 * Email Service
 * 
 * Sends email notifications via ThaiBulkSMS (ThaiBulkMail) API.
 * Configuration through environment variables.
 */
import nodemailer from 'nodemailer';

interface EmailOptions {
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
}

interface EmailResult {
    success: boolean;
    messageId?: string;
    error?: string;
}

// Check if email API is configured
function isEmailConfigured(): boolean {
    const hasApiConfig = !!(
        process.env.SMS_API_KEY &&
        process.env.SMS_API_SECRET &&
        process.env.EMAIL_FROM_ADDRESS
    );

    const hasSmtpConfig = !!(
        process.env.SMTP_HOST &&
        process.env.SMTP_USER &&
        process.env.SMTP_PASS
    );

    if (!hasApiConfig && !hasSmtpConfig) {
        console.log('📧 Email Config Debug: Missing both API and SMTP config');
    }

    return hasApiConfig || hasSmtpConfig;
}

export const emailService = {
    /**
     * Check if email service is available
     */
    isConfigured(): boolean {
        return isEmailConfigured();
    },

    /**
     * Send an email via SMTP (preferred) or ThaiBulkMail API
     */
    async send(options: EmailOptions): Promise<EmailResult> {
        if (!isEmailConfigured()) {
            console.log('📧 [EMAIL] Not configured - skipping send');
            return {
                success: false,
                error: 'Email not configured. Set SMTP_* or SMS_API_* vars in .env'
            };
        }

        const fromAddress = process.env.EMAIL_FROM_ADDRESS || process.env.SMTP_USER || 'no-reply@eldercare.com';
        const fromName = process.env.EMAIL_FROM_NAME || 'ElderCare';

        // 1. Try SMTP first if configured
        if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
            try {
                const transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST,
                    port: parseInt(process.env.SMTP_PORT || '587'),
                    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS,
                    },
                });

                const recipients = Array.isArray(options.to) ? options.to.join(', ') : options.to;

                const info = await transporter.sendMail({
                    from: `"${fromName}" <${fromAddress}>`,
                    to: recipients,
                    subject: options.subject,
                    text: options.text,
                    html: options.html,
                });

                console.log(`📧 [EMAIL] Sent successfully via SMTP: ${info.messageId}`);
                return {
                    success: true,
                    messageId: info.messageId,
                };
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                console.error(`📧 [EMAIL] SMTP failed, falling back to API:`, errorMessage);
                // Fall through to API fallback below
            }
        }

        // 2. Fallback to API
        try {
            const apiKey = process.env.SMS_API_KEY;
            const apiSecret = process.env.SMS_API_SECRET;

            if (!apiKey || !apiSecret) {
                return {
                    success: false,
                    error: 'SMTP failed and API keys missing.',
                };
            }

            const templateId = process.env.EMAIL_TEMPLATE_ID;

            if (!templateId) {
                console.warn('📧 [EMAIL] No EMAIL_TEMPLATE_ID configured. API send likely to fail.');
            }

            const recipientEmails = Array.isArray(options.to)
                ? options.to.map(e => e.trim())
                : [options.to.trim()];

            const url = 'https://email-api.thaibulksms.com/email/v1/send_template';

            const body = {
                template_uuid: templateId,
                subject: options.subject,
                mail_from: {
                    name: fromName,
                    email: fromAddress
                },
                mail_to: recipientEmails.map(email => ({ email })),
                payload: {
                    message: options.html || options.text,
                    title: options.subject
                }
            };

            console.log(`📧 [EMAIL] API Request body:`, JSON.stringify(body, null, 2));

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMsg = JSON.stringify(data);
                throw new Error(errorMsg);
            }

            console.log(`📧 [EMAIL] Sent successfully via API: ${JSON.stringify(data)}`);
            return {
                success: true,
                messageId: (data as any).message_id || 'sent-via-api',
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error(`📧 [EMAIL] Failed to send via API: ${errorMessage}`);
            return {
                success: false,
                error: errorMessage,
            };
        }
    },

    /**
     * Send birthday notification email
     */
    async sendBirthdayNotification(elderlyName: string, recipientEmail: string): Promise<EmailResult> {
        return this.send({
            to: recipientEmail,
            subject: `🎂 วันเกิดผู้สูงอายุ: ${elderlyName}`,
            html: `
                <div style="font-family: 'Sarabun', sans-serif; padding: 20px; background: #f9fafb; border-radius: 8px;">
                    <h2 style="color: #4f46e5;">🎂 แจ้งเตือนวันเกิด</h2>
                    <p style="font-size: 16px; color: #374151;">
                        วันนี้เป็นวันเกิดของ <strong>${elderlyName}</strong>
                    </p>
                    <p style="color: #6b7280;">
                        กรุณาส่งความสุขและอวยพรให้ท่านด้วยนะคะ 🎉
                    </p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                    <p style="font-size: 12px; color: #9ca3af;">
                        ข้อความนี้ส่งอัตโนมัติจากระบบ ElderCare
                    </p>
                </div>
            `,
            text: `วันนี้เป็นวันเกิดของ ${elderlyName} - กรุณาส่งความสุขให้ท่านด้วยนะคะ`,
        });
    },

    /**
     * Send anniversary notification email
     */
    async sendAnniversaryNotification(elderlyName: string, years: number, recipientEmail: string): Promise<EmailResult> {
        return this.send({
            to: recipientEmail,
            subject: `🎊 ครบรอบ ${years} ปี: ${elderlyName}`,
            html: `
                <div style="font-family: 'Sarabun', sans-serif; padding: 20px; background: #f9fafb; border-radius: 8px;">
                    <h2 style="color: #059669;">🎊 แจ้งเตือนวันครบรอบ</h2>
                    <p style="font-size: 16px; color: #374151;">
                        วันนี้ครบรอบ <strong>${years} ปี</strong> ที่ <strong>${elderlyName}</strong> เข้ารับบริการ
                    </p>
                    <p style="color: #6b7280;">
                        ขอแสดงความยินดีและขอบคุณที่ไว้วางใจ 🙏
                    </p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                    <p style="font-size: 12px; color: #9ca3af;">
                        ข้อความนี้ส่งอัตโนมัติจากระบบ ElderCare
                    </p>
                </div>
            `,
            text: `วันนี้ครบรอบ ${years} ปี ที่ ${elderlyName} เข้ารับบริการ`,
        });
    },

    /**
     * Send appointment reminder email
     */
    async sendAppointmentReminder(elderlyName: string, title: string, date: Date, location: string | null, recipientEmail: string): Promise<EmailResult> {
        const dateStr = new Date(date).toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        return this.send({
            to: recipientEmail,
            subject: `💊 นัดพบแพทย์: ${elderlyName} - ${title}`,
            html: `
                <div style="font-family: 'Sarabun', sans-serif; padding: 20px; background: #f9fafb; border-radius: 8px;">
                    <h2 style="color: #dc2626;">💊 แจ้งเตือนนัดพบแพทย์</h2>
                    <p style="font-size: 16px; color: #374151;">
                        <strong>${elderlyName}</strong> มีนัด <strong>"${title}"</strong>
                    </p>
                    <p style="font-size: 14px; color: #374151;">
                        📅 วันที่: ${dateStr}<br>
                        ${location ? `📍 สถานที่: ${location}` : ''}
                    </p>
                    <p style="color: #6b7280;">
                        กรุณาเตรียมตัวและเอกสารให้พร้อม 🏥
                    </p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                    <p style="font-size: 12px; color: #9ca3af;">
                        ข้อความนี้ส่งอัตโนมัติจากระบบ ElderCare
                    </p>
                </div>
            `,
            text: `${elderlyName} มีนัด "${title}" วันที่ ${dateStr}${location ? ` ที่ ${location}` : ''}`,
        });
    },

    /**
     * Send activity reminder email
     */
    async sendActivityReminder(elderlyName: string, activityTitle: string, time: string | null, recipientEmail: string): Promise<EmailResult> {
        return this.send({
            to: recipientEmail,
            subject: `📅 กิจกรรมประจำวัน: ${elderlyName} - ${activityTitle}`,
            html: `
                <div style="font-family: 'Sarabun', sans-serif; padding: 20px; background: #f9fafb; border-radius: 8px;">
                    <h2 style="color: #2563eb;">📅 แจ้งเตือนกิจกรรมประจำวัน</h2>
                    <p style="font-size: 16px; color: #374151;">
                        <strong>${elderlyName}</strong> มีกิจกรรม <strong>"${activityTitle}"</strong> วันนี้
                    </p>
                    ${time ? `<p style="font-size: 14px; color: #374151;">⏰ เวลา: ${time}</p>` : ''}
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                    <p style="font-size: 12px; color: #9ca3af;">
                        ข้อความนี้ส่งอัตโนมัติจากระบบ ElderCare
                    </p>
                </div>
            `,
            text: `${elderlyName} มีกิจกรรม "${activityTitle}" วันนี้${time ? ` เวลา ${time}` : ''}`,
        });
    },

    /**
     * Send missing daily log warning email
     */
    async sendMissingLogWarning(elderlyName: string, days: number, recipientEmail: string): Promise<EmailResult> {
        return this.send({
            to: recipientEmail,
            subject: `⚠️ ไม่มี DailyLog: ${elderlyName} (${days}+ วัน)`,
            html: `
                <div style="font-family: 'Sarabun', sans-serif; padding: 20px; background: #fef2f2; border-radius: 8px; border: 1px solid #fecaca;">
                    <h2 style="color: #dc2626;">⚠️ แจ้งเตือน: ไม่มีการบันทึก DailyLog</h2>
                    <p style="font-size: 16px; color: #374151;">
                        <strong>${elderlyName}</strong> ไม่มีการบันทึก DailyLog มากกว่า <strong>${days} วัน</strong>
                    </p>
                    <p style="color: #6b7280;">
                        กรุณาตรวจสอบและบันทึกข้อมูลสุขภาพประจำวัน
                    </p>
                    <hr style="border: none; border-top: 1px solid #fecaca; margin: 20px 0;">
                    <p style="font-size: 12px; color: #9ca3af;">
                        ข้อความนี้ส่งอัตโนมัติจากระบบ ElderCare
                    </p>
                </div>
            `,
            text: `${elderlyName} ไม่มีการบันทึก DailyLog มากกว่า ${days} วัน`,
        });
    },
};
