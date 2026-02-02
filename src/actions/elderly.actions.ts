/**
 * Elderly Profile Server Actions
 * 
 * CRUD operations for ElderlyProfile using Next.js Server Actions.
 * Includes encryption for sensitive fields (PDPA compliance).
 */

'use server';

import prisma from '@/lib/prisma';
import { encrypt, decrypt } from '@/lib/encryption';
import { elderlyProfileSchema, elderlyFilterSchema, type ElderlyProfileInput, type ElderlyFilter } from '@/lib/validations';
import { getPaginationMeta } from '@/lib/utils';
import { revalidatePath } from 'next/cache';

// ============================================
// CREATE
// ============================================

export async function createElderlyProfile(data: ElderlyProfileInput) {
    try {
        // Validate input
        const validated = elderlyProfileSchema.parse(data);

        // Encrypt sensitive fields for PDPA compliance
        const encryptedData = {
            ...validated,
            dateOfBirth: new Date(validated.dateOfBirth), // Convert string to Date
            nationalId: encrypt(validated.nationalId),
            phoneNumber: validated.phoneNumber ? encrypt(validated.phoneNumber) : null,
            emergencyContactPhone: encrypt(validated.emergencyContactPhone),
        };

        // Create profile
        const profile = await prisma.elderlyProfile.create({
            data: encryptedData,
        });

        revalidatePath('/dashboard/elderly');

        return {
            success: true,
            data: profile,
            message: 'สร้างข้อมูลผู้สูงอายุสำเร็จ'
        };

    } catch (error) {
        console.error('Error creating elderly profile:', error);

        if (error instanceof Error && error.message.includes('Unique constraint')) {
            return {
                success: false,
                error: 'เลขบัตรประชาชนนี้มีอยู่ในระบบแล้ว'
            };
        }

        return {
            success: false,
            error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการสร้างข้อมูล'
        };
    }
}

// ============================================
// READ
// ============================================

export async function getElderlyProfiles(filters: ElderlyFilter = { page: 1, pageSize: 10 }) {
    try {
        const validated = elderlyFilterSchema.parse(filters);
        const { search, province, careLevel, mobilityStatus, isActive } = validated;
        const page = validated.page ?? 1;
        const pageSize = validated.pageSize ?? 10;

        // Build where clause
        const where: Record<string, unknown> = {};

        if (search) {
            where.OR = [
                { firstName: { contains: search } },
                { lastName: { contains: search } },
                { nickname: { contains: search } },
            ];
        }

        if (province) {
            where.province = province;
        }

        if (careLevel) {
            where.careLevel = careLevel;
        }

        if (mobilityStatus) {
            where.mobilityStatus = mobilityStatus;
        }

        if (typeof isActive === 'boolean') {
            where.isActive = isActive;
        }

        // Get total count
        const totalItems = await prisma.elderlyProfile.count({ where });

        // Get profiles with pagination
        const profiles = await prisma.elderlyProfile.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * pageSize,
            take: pageSize,
            include: {
                _count: {
                    select: { dailyLogs: true },
                },
            },
        });

        // Decrypt sensitive fields for display
        const decryptedProfiles = profiles.map(profile => ({
            ...profile,
            nationalId: decrypt(profile.nationalId),
            phoneNumber: profile.phoneNumber ? decrypt(profile.phoneNumber) : null,
            emergencyContactPhone: decrypt(profile.emergencyContactPhone),
        }));

        return {
            success: true,
            data: decryptedProfiles,
            pagination: getPaginationMeta(totalItems, page, pageSize),
        };

    } catch (error) {
        console.error('Error fetching elderly profiles:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการดึงข้อมูล'
        };
    }
}

export async function getElderlyById(id: string) {
    try {
        const profile = await prisma.elderlyProfile.findUnique({
            where: { id },
            include: {
                dailyLogs: {
                    orderBy: { date: 'desc' },
                    take: 10,
                },
            },
        });

        if (!profile) {
            return {
                success: false,
                error: 'ไม่พบข้อมูลผู้สูงอายุ'
            };
        }

        // Decrypt sensitive fields
        const decryptedProfile = {
            ...profile,
            nationalId: decrypt(profile.nationalId),
            phoneNumber: profile.phoneNumber ? decrypt(profile.phoneNumber) : null,
            emergencyContactPhone: decrypt(profile.emergencyContactPhone),
        };

        return {
            success: true,
            data: decryptedProfile
        };

    } catch (error) {
        console.error('Error fetching elderly profile:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการดึงข้อมูล'
        };
    }
}

// ============================================
// UPDATE
// ============================================

export async function updateElderlyProfile(id: string, data: Partial<ElderlyProfileInput>) {
    try {
        // Validate input (partial)
        const validated = elderlyProfileSchema.partial().parse(data);

        // Encrypt sensitive fields if provided
        const updateData: Record<string, unknown> = { ...validated };

        if (validated.nationalId) {
            updateData.nationalId = encrypt(validated.nationalId);
        }
        if (validated.phoneNumber) {
            updateData.phoneNumber = encrypt(validated.phoneNumber);
        }
        if (validated.emergencyContactPhone) {
            updateData.emergencyContactPhone = encrypt(validated.emergencyContactPhone);
        }
        if (validated.dateOfBirth) {
            updateData.dateOfBirth = new Date(validated.dateOfBirth);
        }

        const profile = await prisma.elderlyProfile.update({
            where: { id },
            data: updateData,
        });

        revalidatePath('/dashboard/elderly');
        revalidatePath(`/dashboard/elderly/${id}`);

        return {
            success: true,
            data: profile,
            message: 'อัปเดตข้อมูลสำเร็จ'
        };

    } catch (error) {
        console.error('Error updating elderly profile:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล'
        };
    }
}

// ============================================
// DELETE
// ============================================

export async function deleteElderlyProfile(id: string) {
    try {
        await prisma.elderlyProfile.delete({
            where: { id },
        });

        revalidatePath('/dashboard/elderly');

        return {
            success: true,
            message: 'ลบข้อมูลสำเร็จ'
        };

    } catch (error) {
        console.error('Error deleting elderly profile:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการลบข้อมูล'
        };
    }
}

// ============================================
// STATISTICS
// ============================================

export async function getElderlyStats() {
    try {
        const [
            totalCount,
            activeCount,
            byProvince,
            byCareLevel,
        ] = await Promise.all([
            prisma.elderlyProfile.count(),
            prisma.elderlyProfile.count({ where: { isActive: true } }),
            prisma.elderlyProfile.groupBy({
                by: ['province'],
                _count: { province: true },
                orderBy: { _count: { province: 'desc' } },
                take: 10,
            }),
            prisma.elderlyProfile.groupBy({
                by: ['careLevel'],
                _count: { careLevel: true },
            }),
        ]);

        return {
            success: true,
            data: {
                totalCount,
                activeCount,
                inactiveCount: totalCount - activeCount,
                byProvince,
                byCareLevel,
            },
        };

    } catch (error) {
        console.error('Error fetching elderly stats:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการดึงสถิติ'
        };
    }
}
