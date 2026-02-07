/**
 * Notification Service
 * 
 * Orchestrates daily alerts for:
 * - 🎂 Birthdays
 * - 🎊 Anniversaries
 * - 💊 Doctor Appointments
 * - 📅 Scheduled Activities
 * - ⚠️ Missing DailyLog warnings
 */

import { prisma } from "@/lib/prisma";
import { emailService } from "./email.service";
import { smsService } from "./sms.service";

// Threshold for missing daily log warning (in days)
const MISSING_LOG_THRESHOLD_DAYS = 3;

interface AlertItem {
    type: "BIRTHDAY" | "ANNIVERSARY" | "APPOINTMENT" | "ACTIVITY" | "MISSING_LOG";
    elderlyId: string;
    elderlyName: string;
    message: string;
    years?: number;
    emailSent: boolean;
    smsSent: boolean;
    emailError?: string;
    smsError?: string;
}

interface ProcessResult {
    processed: number;
    successful: number;
    failed: number;
    alerts: AlertItem[];
}

export const notificationService = {
    /**
     * Main entry point - process all daily alerts
     */
    async processDailyAlerts(): Promise<ProcessResult> {
        const today = new Date();
        console.log(`🔍 Processing daily alerts for ${today.toLocaleDateString('th-TH')}`);

        const allAlerts: AlertItem[] = [];
        let totalProcessed = 0;
        let totalSuccessful = 0;
        let totalFailed = 0;

        // 1. Birthday & Anniversary checks
        const basicAlerts = await this.checkBirthdaysAndAnniversaries();
        allAlerts.push(...basicAlerts.alerts);
        totalProcessed += basicAlerts.processed;
        totalSuccessful += basicAlerts.successful;
        totalFailed += basicAlerts.failed;

        // 2. Appointment reminders
        const appointmentAlerts = await this.checkUpcomingAppointments();
        allAlerts.push(...appointmentAlerts.alerts);
        totalSuccessful += appointmentAlerts.successful;
        totalFailed += appointmentAlerts.failed;

        // 3. Daily activity reminders
        const activityAlerts = await this.checkDailyActivities();
        allAlerts.push(...activityAlerts.alerts);
        totalSuccessful += activityAlerts.successful;
        totalFailed += activityAlerts.failed;

        // 4. Missing daily log warnings
        const missingLogAlerts = await this.checkMissingDailyLogs();
        allAlerts.push(...missingLogAlerts.alerts);
        totalSuccessful += missingLogAlerts.successful;
        totalFailed += missingLogAlerts.failed;

        console.log(`✅ Total alerts: ${allAlerts.length}, Sent: ${totalSuccessful}, Failed: ${totalFailed}`);

        return {
            processed: totalProcessed,
            successful: totalSuccessful,
            failed: totalFailed,
            alerts: allAlerts,
        };
    },

    /**
     * Check birthdays and anniversaries
     */
    async checkBirthdaysAndAnniversaries(): Promise<ProcessResult> {
        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        const currentDay = today.getDate();
        const currentYear = today.getFullYear();

        const profiles = await prisma.elderlyProfile.findMany({
            where: { isActive: true },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                dateOfBirth: true,
                registrationDate: true,
                keyCoordinatorPhone: true,
                emergencyContactPhone: true,
            }
        });

        const alerts: AlertItem[] = [];
        let successful = 0;
        let failed = 0;
        const adminEmail = process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER;

        for (const profile of profiles) {
            const fullName = `${profile.firstName} ${profile.lastName}`;
            const phoneToNotify = profile.keyCoordinatorPhone || profile.emergencyContactPhone;

            // Birthday check
            if (profile.dateOfBirth) {
                const dob = new Date(profile.dateOfBirth);
                if (dob.getMonth() + 1 === currentMonth && dob.getDate() === currentDay) {
                    console.log(`🎂 Birthday: ${fullName}`);

                    let emailSent = false, smsSent = false;

                    let emailError: string | undefined;
                    let smsError: string | undefined;

                    if (adminEmail && emailService.isConfigured()) {
                        const result = await emailService.sendBirthdayNotification(fullName, adminEmail);
                        emailSent = result.success;
                        if (!result.success) emailError = result.error;
                    }
                    if (phoneToNotify && smsService.isConfigured()) {
                        const result = await smsService.sendBirthdayNotification(fullName, phoneToNotify);
                        smsSent = result.success;
                        if (!result.success) smsError = result.error;
                    }

                    const alert: AlertItem = {
                        type: "BIRTHDAY",
                        elderlyId: profile.id,
                        elderlyName: fullName,
                        message: `🎂 วันนี้เป็นวันเกิดของ ${fullName}!`,
                        emailSent,
                        smsSent,
                        emailError,
                        smsError,
                    };

                    await this.logAlert(alert, phoneToNotify);
                    alerts.push(alert);
                    if (emailSent || smsSent) successful++; else failed++;
                }
            }

            // Anniversary check
            if (profile.registrationDate) {
                const regDate = new Date(profile.registrationDate);
                if (regDate.getMonth() + 1 === currentMonth && regDate.getDate() === currentDay && regDate.getFullYear() < currentYear) {
                    const years = currentYear - regDate.getFullYear();
                    console.log(`🎊 Anniversary: ${fullName} - ${years} year(s)`);

                    let emailSent = false, smsSent = false;
                    let emailError: string | undefined;
                    let smsError: string | undefined;

                    if (adminEmail && emailService.isConfigured()) {
                        const result = await emailService.sendAnniversaryNotification(fullName, years, adminEmail);
                        emailSent = result.success;
                        if (!result.success) emailError = result.error;
                    }
                    if (phoneToNotify && smsService.isConfigured()) {
                        const result = await smsService.sendAnniversaryNotification(fullName, years, phoneToNotify);
                        smsSent = result.success;
                        if (!result.success) smsError = result.error;
                    }

                    const alert: AlertItem = {
                        type: "ANNIVERSARY",
                        elderlyId: profile.id,
                        elderlyName: fullName,
                        message: `🎊 วันนี้ครบรอบ ${years} ปี ที่ ${fullName} เข้ารับบริการ!`,
                        years,
                        emailSent,
                        smsSent,
                        emailError,
                        smsError,
                    };

                    await this.logAlert(alert, phoneToNotify);
                    alerts.push(alert);
                    if (emailSent || smsSent) successful++; else failed++;
                }
            }
        }

        return { processed: profiles.length, successful, failed, alerts };
    },

    /**
     * Check upcoming appointments (remind 1 day before by default)
     */
    async checkUpcomingAppointments(): Promise<{ alerts: AlertItem[]; successful: number; failed: number }> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Find appointments that need reminders
        const appointments = await prisma.appointment.findMany({
            where: {
                isCompleted: false,
            },
            include: {
                elderly: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        keyCoordinatorPhone: true,
                        emergencyContactPhone: true,
                    }
                }
            }
        });

        const alerts: AlertItem[] = [];
        let successful = 0;
        let failed = 0;
        const adminEmail = process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER;

        for (const apt of appointments) {
            const aptDate = new Date(apt.date);
            aptDate.setHours(0, 0, 0, 0);

            // Calculate days until appointment
            const daysUntil = Math.ceil((aptDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

            // Check if we should remind today
            if (daysUntil === apt.remindDaysBefore) {
                const fullName = `${apt.elderly.firstName} ${apt.elderly.lastName}`;
                const phoneToNotify = apt.elderly.keyCoordinatorPhone || apt.elderly.emergencyContactPhone;

                console.log(`💊 Appointment reminder: ${fullName} - ${apt.title} on ${aptDate.toLocaleDateString('th-TH')}`);

                let emailSent = false, smsSent = false;
                let emailError: string | undefined;
                let smsError: string | undefined;

                if (adminEmail && emailService.isConfigured()) {
                    const result = await emailService.sendAppointmentReminder(fullName, apt.title, apt.date, apt.location, adminEmail);
                    emailSent = result.success;
                    if (!result.success) emailError = result.error;
                }
                if (phoneToNotify && smsService.isConfigured()) {
                    const result = await smsService.sendAppointmentReminder(fullName, apt.title, apt.date, apt.location, phoneToNotify);
                    smsSent = result.success;
                    if (!result.success) smsError = result.error;
                }

                const alert: AlertItem = {
                    type: "APPOINTMENT",
                    elderlyId: apt.elderly.id,
                    elderlyName: fullName,
                    message: `💊 ${fullName} มีนัด "${apt.title}" ${daysUntil === 0 ? 'วันนี้' : `ในอีก ${daysUntil} วัน`}${apt.location ? ` ที่ ${apt.location}` : ''}`,
                    emailSent,
                    smsSent,
                    emailError,
                    smsError,
                };

                await this.logAlert(alert, phoneToNotify);
                alerts.push(alert);
                if (emailSent || smsSent) successful++; else failed++;
            }
        }

        return { alerts, successful, failed };
    },

    /**
     * Check daily scheduled activities
     */
    async checkDailyActivities(): Promise<{ alerts: AlertItem[]; successful: number; failed: number }> {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0-6
        const dayOfMonth = today.getDate(); // 1-31

        // Find activities that should trigger today
        const activities = await prisma.scheduledActivity.findMany({
            where: {
                isActive: true,
                OR: [
                    { recurrence: 'DAILY' },
                    { recurrence: 'WEEKLY', dayOfWeek: dayOfWeek },
                    { recurrence: 'MONTHLY', dayOfMonth: dayOfMonth },
                ]
            },
            include: {
                elderly: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        isActive: true,
                        keyCoordinatorPhone: true,
                        emergencyContactPhone: true,
                    }
                }
            }
        });

        const alerts: AlertItem[] = [];
        let successful = 0;
        let failed = 0;
        const adminEmail = process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER;

        for (const activity of activities) {
            // Skip if elderly is not active
            if (!activity.elderly.isActive) continue;

            const fullName = `${activity.elderly.firstName} ${activity.elderly.lastName}`;
            const phoneToNotify = activity.elderly.keyCoordinatorPhone || activity.elderly.emergencyContactPhone;

            console.log(`📅 Activity reminder: ${fullName} - ${activity.title}`);

            let emailSent = false, smsSent = false;
            let emailError: string | undefined;
            let smsError: string | undefined;

            if (adminEmail && emailService.isConfigured()) {
                const result = await emailService.sendActivityReminder(fullName, activity.title, activity.time, adminEmail);
                emailSent = result.success;
                if (!result.success) emailError = result.error;
            }
            if (phoneToNotify && smsService.isConfigured()) {
                const result = await smsService.sendActivityReminder(fullName, activity.title, activity.time, phoneToNotify);
                smsSent = result.success;
                if (!result.success) smsError = result.error;
            }

            const alert: AlertItem = {
                type: "ACTIVITY",
                elderlyId: activity.elderly.id,
                elderlyName: fullName,
                message: `📅 ${fullName} มีกิจกรรม "${activity.title}"${activity.time ? ` เวลา ${activity.time}` : ''} วันนี้`,
                emailSent,
                smsSent,
                emailError,
                smsError,
            };

            await this.logAlert(alert, phoneToNotify);
            alerts.push(alert);
            if (emailSent || smsSent) successful++; else failed++;
        }

        return { alerts, successful, failed };
    },

    /**
     * Check for missing daily logs
     */
    async checkMissingDailyLogs(): Promise<{ alerts: AlertItem[]; successful: number; failed: number }> {
        const today = new Date();
        const thresholdDate = new Date(today);
        thresholdDate.setDate(thresholdDate.getDate() - MISSING_LOG_THRESHOLD_DAYS);

        // Find active profiles
        const profiles = await prisma.elderlyProfile.findMany({
            where: { isActive: true },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                keyCoordinatorPhone: true,
                emergencyContactPhone: true,
                dailyLogs: {
                    where: {
                        date: { gte: thresholdDate }
                    },
                    orderBy: { date: 'desc' },
                    take: 1,
                }
            }
        });

        const alerts: AlertItem[] = [];
        let successful = 0;
        let failed = 0;
        const adminEmail = process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER;

        for (const profile of profiles) {
            // If no logs in threshold period
            if (profile.dailyLogs.length === 0) {
                const fullName = `${profile.firstName} ${profile.lastName}`;
                const phoneToNotify = profile.keyCoordinatorPhone || profile.emergencyContactPhone;

                console.log(`⚠️ Missing log: ${fullName} - no log for ${MISSING_LOG_THRESHOLD_DAYS}+ days`);

                let emailSent = false, smsSent = false;
                let emailError: string | undefined;
                let smsError: string | undefined;

                if (adminEmail && emailService.isConfigured()) {
                    const result = await emailService.sendMissingLogWarning(fullName, MISSING_LOG_THRESHOLD_DAYS, adminEmail);
                    emailSent = result.success;
                    if (!result.success) emailError = result.error;
                }
                if (phoneToNotify && smsService.isConfigured()) {
                    const result = await smsService.sendMissingLogWarning(fullName, MISSING_LOG_THRESHOLD_DAYS, phoneToNotify);
                    smsSent = result.success;
                    if (!result.success) smsError = result.error;
                }

                const alert: AlertItem = {
                    type: "MISSING_LOG",
                    elderlyId: profile.id,
                    elderlyName: fullName,
                    message: `⚠️ ${fullName} ไม่มีการบันทึก DailyLog มากกว่า ${MISSING_LOG_THRESHOLD_DAYS} วัน`,
                    emailSent,
                    smsSent,
                    emailError,
                    smsError,
                };

                await this.logAlert(alert, phoneToNotify);
                alerts.push(alert);
                if (emailSent || smsSent) successful++; else failed++;
            }
        }

        return { alerts, successful, failed };
    },

    /**
     * Log alert to database
     */
    async logAlert(alert: AlertItem, recipientPhone?: string | null): Promise<void> {
        try {
            await prisma.alertLog.create({
                data: {
                    alertType: alert.type,
                    elderlyId: alert.elderlyId,
                    elderlyName: alert.elderlyName,
                    recipientType: 'STAFF',
                    recipientContact: recipientPhone || undefined,
                    message: alert.message,
                    status: (alert.emailSent || alert.smsSent) ? 'SENT' : 'PENDING',
                    sentAt: (alert.emailSent || alert.smsSent) ? new Date() : null,
                },
            });
        } catch (error) {
            console.error('Failed to log alert:', error);
        }
    },
};
