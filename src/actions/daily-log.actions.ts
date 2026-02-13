/**
 * Daily Log Server Actions
 * 
 * CRUD operations for DailyLog using Next.js Server Actions.
 * Supports high-volume data with pagination.
 */

'use server';

import { prisma } from '@/lib/prisma';
import { dailyLogSchema, dailyLogFilterSchema, type DailyLogInput, type DailyLogFilter } from '@/lib/validations';
import { getPaginationMeta } from '@/lib/utils';
import { revalidatePath } from 'next/cache';

// ============================================
// CREATE
// ============================================

export async function createDailyLog(data: DailyLogInput) {
    try {
        // Validate input
        const validated = dailyLogSchema.parse(data);

        // Check if elderly exists
        const elderly = await prisma.elderlyProfile.findUnique({
            where: { id: validated.elderlyId },
        });

        if (!elderly) {
            return {
                success: false,
                error: 'ไม่พบข้อมูลผู้สูงอายุ'
            };
        }

        // Create log
        const log = await prisma.dailyLog.create({
            data: {
                ...validated,
                date: new Date(validated.date), // Convert string to Date
                vitals: validated.vitals || undefined,
            },
        });

        revalidatePath(`/dashboard/elderly/${validated.elderlyId}`);
        revalidatePath('/dashboard');

        return {
            success: true,
            data: log,
            message: 'บันทึกข้อมูลประจำวันสำเร็จ'
        };

    } catch (error) {
        console.error('Error creating daily log:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
        };
    }
}

// ============================================
// READ
// ============================================

export async function getDailyLogs(filters: DailyLogFilter = { page: 1, pageSize: 10 }) {
    try {
        const validated = dailyLogFilterSchema.parse(filters);
        const { elderlyId, startDate, endDate } = validated;
        const page = validated.page ?? 1;
        const pageSize = validated.pageSize ?? 10;

        // Build where clause
        const where: Record<string, unknown> = {};

        if (elderlyId) {
            where.elderlyId = elderlyId;
        }

        if (startDate || endDate) {
            where.date = {};
            if (startDate) {
                (where.date as Record<string, Date>).gte = new Date(startDate);
            }
            if (endDate) {
                (where.date as Record<string, Date>).lte = new Date(endDate);
            }
        }

        if (filters.search) {
            const search = filters.search.trim();
            // Check if search term is effectively applied to elderly profile
            where.elderly = {
                OR: [
                    { firstName: { contains: search } }, // Case-insensitive in Postgres (if configured) or handle via mode. For MySQL/Standard Prisma, contains is usually case-insensitive.
                    { lastName: { contains: search } },
                    { nickname: { contains: search } },
                    { safeId: { contains: search } },
                    { nationalId: { contains: search } },
                ],
            };
        }

        // Get total count
        const totalItems = await prisma.dailyLog.count({ where });

        // Get logs with pagination
        const logs = await prisma.dailyLog.findMany({
            where,
            orderBy: { date: 'desc' },
            skip: (page - 1) * pageSize,
            take: pageSize,
            include: {
                elderly: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        safeId: true,
                        nickname: true,
                    },
                },
            },
        });

        return {
            success: true,
            data: logs,
            pagination: getPaginationMeta(totalItems, page, pageSize),
        };

    } catch (error) {
        console.error('Error fetching daily logs:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการดึงข้อมูล'
        };
    }
}

export async function getDailyLogById(id: string) {
    try {
        const log = await prisma.dailyLog.findUnique({
            where: { id },
            include: {
                elderly: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profilePhoto: true,
                    },
                },
            },
        });

        if (!log) {
            return {
                success: false,
                error: 'ไม่พบข้อมูลบันทึกประจำวัน'
            };
        }

        return {
            success: true,
            data: log
        };

    } catch (error) {
        console.error('Error fetching daily log:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการดึงข้อมูล'
        };
    }
}

export async function getElderlyDailyLogs(elderlyId: string, page: number = 1, pageSize: number = 10) {
    try {
        const totalItems = await prisma.dailyLog.count({
            where: { elderlyId },
        });

        const logs = await prisma.dailyLog.findMany({
            where: { elderlyId },
            orderBy: { date: 'desc' },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });

        return {
            success: true,
            data: logs,
            pagination: getPaginationMeta(totalItems, page, pageSize),
        };

    } catch (error) {
        console.error('Error fetching elderly daily logs:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการดึงข้อมูล'
        };
    }
}

// ============================================
// UPDATE
// ============================================

export async function updateDailyLog(id: string, data: Partial<DailyLogInput>) {
    try {
        const validated = dailyLogSchema.partial().parse(data);

        const log = await prisma.dailyLog.update({
            where: { id },
            data: {
                ...validated,
                date: validated.date ? new Date(validated.date) : undefined, // Convert string to Date
                vitals: validated.vitals || undefined,
            },
        });

        revalidatePath(`/dashboard/elderly/${log.elderlyId}`);

        return {
            success: true,
            data: log,
            message: 'อัปเดตข้อมูลสำเร็จ'
        };

    } catch (error) {
        console.error('Error updating daily log:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล'
        };
    }
}

// ============================================
// DELETE
// ============================================

export async function deleteDailyLog(id: string) {
    try {
        const log = await prisma.dailyLog.delete({
            where: { id },
        });

        revalidatePath(`/dashboard/elderly/${log.elderlyId}`);

        return {
            success: true,
            message: 'ลบข้อมูลสำเร็จ'
        };

    } catch (error) {
        console.error('Error deleting daily log:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการลบข้อมูล'
        };
    }
}

// ============================================
// STATISTICS
// ============================================

export async function getDailyLogStats(elderlyId?: string) {
    try {
        const where = elderlyId ? { elderlyId } : {};

        const [
            totalCount,
            todayCount,
            weekCount,
        ] = await Promise.all([
            prisma.dailyLog.count({ where }),
            prisma.dailyLog.count({
                where: {
                    ...where,
                    date: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    },
                },
            }),
            prisma.dailyLog.count({
                where: {
                    ...where,
                    date: {
                        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    },
                },
            }),
        ]);

        return {
            success: true,
            data: {
                totalCount,
                todayCount,
                weekCount,
            },
        };

    } catch (error) {
        console.error('Error fetching daily log stats:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการดึงสถิติ'
        };
    }
}
