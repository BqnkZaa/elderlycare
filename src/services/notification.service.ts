
import { prisma } from "@/lib/prisma";

export const notificationService = {
    async processDailyAlerts() {
        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        const currentDay = today.getDate();

        // Find elderly with birthday today
        // Note: Prisma doesn't have robust date part extraction across all DBs easily in one query without raw SQL,
        // so for simplicity/compatibility we might fetch active profiles and filter in JS, 
        // or use raw query if strictly SQL. Given small scale, JS filter is fine.

        // However, if we want to be efficient, we can try `findMany`. 
        // But safely, let's just fetch id, firstName, lastName, dateOfBirth for all active users 
        // and checks matches.

        const profiles = await prisma.elderlyProfile.findMany({
            where: {
                isActive: true,
                dateOfBirth: { not: undefined } // Ensure DOB exists
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                dateOfBirth: true,
            }
        });

        const birthdays = profiles.filter(p => {
            if (!p.dateOfBirth) return false;
            const dob = new Date(p.dateOfBirth);
            return dob.getMonth() + 1 === currentMonth && dob.getDate() === currentDay;
        });

        const alerts = birthdays.map(p => ({
            type: "BIRTHDAY",
            elderlyName: `${p.firstName} ${p.lastName}`,
            message: `Happy Birthday to ${p.firstName} ${p.lastName}!`,
        }));

        // In a real app, we would send emails/LINE messages here.
        // For now, we simulate success.

        return {
            processed: profiles.length,
            successful: alerts.length,
            failed: 0,
            alerts
        };
    }
};
