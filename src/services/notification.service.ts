/**
 * Notification Service
 * 
 * This service handles sending notifications for birthdays and anniversaries.
 * It uses a Provider Interface pattern to allow easy integration with
 * SMS, LINE, or other notification APIs in the future.
 * 
 * INTEGRATION POINTS:
 * - To add SMS: Implement SMSNotificationProvider class
 * - To add LINE: Implement LINENotificationProvider class
 */

import prisma from '@/lib/prisma';
import { isBirthdayToday, isAnniversaryToday, getYearsSinceRegistration, calculateAge } from '@/lib/utils';

// ============================================
// TYPES & INTERFACES
// ============================================

export type AlertType = 'BIRTHDAY' | 'ANNIVERSARY';
export type RecipientType = 'STAFF' | 'RELATIVE';

export interface Alert {
    type: AlertType;
    elderlyId: string;
    elderlyName: string;
    message: string;
    age?: number;
    years?: number;
}

export interface NotificationResult {
    success: boolean;
    alertId?: string;
    error?: string;
}

// ============================================
// NOTIFICATION PROVIDER INTERFACE
// ============================================

/**
 * Interface for notification providers
 * Implement this interface to add SMS, LINE, or other notification channels.
 */
export interface NotificationProvider {
    name: string;

    /**
     * Send a notification to a recipient
     * @param recipient - Phone number, LINE ID, or other identifier
     * @param message - The message to send
     * @returns Promise<boolean> - true if sent successfully
     */
    send(recipient: string, message: string): Promise<boolean>;
}

// ============================================
// CONSOLE NOTIFICATION PROVIDER (DEFAULT)
// ============================================

/**
 * Console Notification Provider
 * 
 * This is the default provider that logs notifications to the console.
 * Replace this with SMS/LINE providers for production use.
 * 
 * TODO: Replace with real SMS/LINE API integration:
 * 
 * Example SMS Integration:
 * ```typescript
 * class SMSNotificationProvider implements NotificationProvider {
 *   name = 'SMS';
 *   private apiKey: string;
 *   private apiUrl: string;
 *   
 *   constructor() {
 *     this.apiKey = process.env.SMS_API_KEY!;
 *     this.apiUrl = process.env.SMS_API_URL!;
 *   }
 *   
 *   async send(recipient: string, message: string): Promise<boolean> {
 *     const response = await fetch(this.apiUrl, {
 *       method: 'POST',
 *       headers: {
 *         'Authorization': `Bearer ${this.apiKey}`,
 *         'Content-Type': 'application/json',
 *       },
 *       body: JSON.stringify({ to: recipient, message }),
 *     });
 *     return response.ok;
 *   }
 * }
 * ```
 * 
 * Example LINE Integration:
 * ```typescript
 * class LINENotificationProvider implements NotificationProvider {
 *   name = 'LINE';
 *   private channelAccessToken: string;
 *   
 *   constructor() {
 *     this.channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN!;
 *   }
 *   
 *   async send(recipient: string, message: string): Promise<boolean> {
 *     const response = await fetch('https://api.line.me/v2/bot/message/push', {
 *       method: 'POST',
 *       headers: {
 *         'Authorization': `Bearer ${this.channelAccessToken}`,
 *         'Content-Type': 'application/json',
 *       },
 *       body: JSON.stringify({
 *         to: recipient,
 *         messages: [{ type: 'text', text: message }],
 *       }),
 *     });
 *     return response.ok;
 *   }
 * }
 * ```
 */
class ConsoleNotificationProvider implements NotificationProvider {
    name = 'Console';

    async send(recipient: string, message: string): Promise<boolean> {
        console.log('═'.repeat(60));
        console.log('📧 NOTIFICATION SENT');
        console.log('═'.repeat(60));
        console.log(`📱 Recipient: ${recipient}`);
        console.log(`💬 Message: ${message}`);
        console.log(`⏰ Time: ${new Date().toLocaleString('th-TH')}`);
        console.log('═'.repeat(60));

        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 100));

        return true;
    }
}

// ============================================
// NOTIFICATION SERVICE CLASS
// ============================================

export class NotificationService {
    private staffProvider: NotificationProvider;
    private relativeProvider: NotificationProvider;

    constructor(
        staffProvider?: NotificationProvider,
        relativeProvider?: NotificationProvider
    ) {
        // Default to console provider - replace with SMS/LINE for production
        this.staffProvider = staffProvider || new ConsoleNotificationProvider();
        this.relativeProvider = relativeProvider || new ConsoleNotificationProvider();
    }

    /**
     * Check for daily events (birthdays and anniversaries)
     * Called by the cron job at 8:00 AM
     */
    async checkDailyEvents(): Promise<Alert[]> {
        const alerts: Alert[] = [];

        try {
            // Fetch all active elderly profiles
            const elderlyProfiles = await prisma.elderlyProfile.findMany({
                where: { isActive: true },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    dateOfBirth: true,
                    registrationDate: true,
                    emergencyContactPhone: true,
                    emergencyContactName: true,
                },
            });

            console.log(`🔍 Checking ${elderlyProfiles.length} elderly profiles for today's events...`);

            for (const profile of elderlyProfiles) {
                const fullName = `${profile.firstName} ${profile.lastName}`;

                // Check for birthday
                if (profile.dateOfBirth && isBirthdayToday(profile.dateOfBirth)) {
                    const age = calculateAge(profile.dateOfBirth);
                    alerts.push({
                        type: 'BIRTHDAY',
                        elderlyId: profile.id,
                        elderlyName: fullName,
                        message: `🎂 วันนี้เป็นวันเกิดของ คุณ${fullName} อายุครบ ${age} ปี`,
                        age,
                    });
                }

                // Check for registration anniversary (1+ years)
                if (isAnniversaryToday(profile.registrationDate)) {
                    const years = getYearsSinceRegistration(profile.registrationDate);
                    alerts.push({
                        type: 'ANNIVERSARY',
                        elderlyId: profile.id,
                        elderlyName: fullName,
                        message: `🎉 วันนี้ครบรอบ ${years} ปี ที่คุณ${fullName} เข้าร่วมโครงการ`,
                        years,
                    });
                }
            }

            console.log(`📋 Found ${alerts.length} events for today`);

        } catch (error) {
            console.error('Error checking daily events:', error);
            throw error;
        }

        return alerts;
    }

    /**
     * Send alert notification
     * @param type - Alert type (BIRTHDAY/ANNIVERSARY)
     * @param recipientType - Recipient type (STAFF/RELATIVE)
     * @param recipient - Phone number or contact identifier
     * @param message - Message to send
     * @param elderlyId - ID of the elderly profile
     * @param elderlyName - Name of the elderly person
     */
    async sendAlert(
        type: AlertType,
        recipientType: RecipientType,
        recipient: string,
        message: string,
        elderlyId: string,
        elderlyName: string
    ): Promise<NotificationResult> {
        try {
            // Log the alert to database
            const alertLog = await prisma.alertLog.create({
                data: {
                    alertType: type,
                    elderlyId,
                    elderlyName,
                    recipientType,
                    recipientContact: recipient,
                    message,
                    status: 'PENDING',
                },
            });

            // Select provider based on recipient type
            const provider = recipientType === 'STAFF'
                ? this.staffProvider
                : this.relativeProvider;

            // Send notification
            const success = await provider.send(recipient, message);

            // Update alert log status
            await prisma.alertLog.update({
                where: { id: alertLog.id },
                data: {
                    status: success ? 'SENT' : 'FAILED',
                    sentAt: success ? new Date() : null,
                },
            });

            return {
                success,
                alertId: alertLog.id,
            };

        } catch (error) {
            console.error('Error sending alert:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    /**
     * Process all daily alerts
     * Sends notifications to both staff and relatives
     */
    async processDailyAlerts(): Promise<{
        processed: number;
        successful: number;
        failed: number;
        alerts: Alert[];
    }> {
        const alerts = await this.checkDailyEvents();
        let successful = 0;
        let failed = 0;

        // Staff notification contact (could be from config/database)
        const staffContact = 'STAFF_NOTIFICATION_CHANNEL';

        for (const alert of alerts) {
            // Send to staff
            const staffResult = await this.sendAlert(
                alert.type,
                'STAFF',
                staffContact,
                `[แจ้งเตือนเจ้าหน้าที่] ${alert.message}`,
                alert.elderlyId,
                alert.elderlyName
            );

            if (staffResult.success) successful++;
            else failed++;

            // Get relative contact for this elderly
            try {
                const profile = await prisma.elderlyProfile.findUnique({
                    where: { id: alert.elderlyId },
                    select: { emergencyContactPhone: true, emergencyContactName: true },
                });

                if (profile?.emergencyContactPhone) {
                    const relativeResult = await this.sendAlert(
                        alert.type,
                        'RELATIVE',
                        profile.emergencyContactPhone,
                        `[แจ้งเตือนญาติ] ${alert.message}`,
                        alert.elderlyId,
                        alert.elderlyName
                    );

                    if (relativeResult.success) successful++;
                    else failed++;
                }
            } catch (error) {
                console.error(`Error sending relative notification for ${alert.elderlyId}:`, error);
                failed++;
            }
        }

        return {
            processed: alerts.length,
            successful,
            failed,
            alerts,
        };
    }
}

// Export singleton instance
export const notificationService = new NotificationService();
