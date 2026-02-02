/**
 * Email Service
 * 
 * Sends email notifications via SMTP (nodemailer).
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

// Check if email is configured
function isEmailConfigured(): boolean {
    return !!(
        process.env.SMTP_HOST &&
        process.env.SMTP_USER &&
        process.env.SMTP_PASS
    );
}

// Create transporter (lazy initialization)
function createTransporter() {
    if (!isEmailConfigured()) {
        return null;
    }

    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
}

export const emailService = {
    /**
     * Check if email service is available
     */
    isConfigured(): boolean {
        return isEmailConfigured();
    },

    /**
     * Send an email
     */
    async send(options: EmailOptions): Promise<EmailResult> {
        if (!isEmailConfigured()) {
            console.log('📧 [EMAIL] Not configured - skipping send');
            return {
                success: false,
                error: 'Email not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS in .env'
            };
        }

        const transporter = createTransporter();
        if (!transporter) {
            return {
                success: false,
                error: 'Failed to create email transporter'
            };
        }

        try {
            const from = process.env.SMTP_FROM || process.env.SMTP_USER;
            const recipients = Array.isArray(options.to) ? options.to.join(', ') : options.to;

            const info = await transporter.sendMail({
                from,
                to: recipients,
                subject: options.subject,
                text: options.text,
                html: options.html,
            });

            console.log(`📧 [EMAIL] Sent successfully: ${info.messageId}`);
            return {
                success: true,
                messageId: info.messageId,
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error(`📧 [EMAIL] Failed to send: ${errorMessage}`);
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
