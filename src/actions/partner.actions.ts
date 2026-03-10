'use server';

import { prisma } from '@/lib/prisma';
import { partnerCenterSchema, type PartnerCenterInput } from '@/lib/validations';
import { revalidatePath } from 'next/cache';

/**
 * Get all partner centers
 */
export async function getPartnerCenters() {
    try {
        const partners = await prisma.partnerCenter.findMany({
            orderBy: { pid: 'asc' },
        });
        return { success: true, data: partners };
    } catch (error) {
        console.error('getPartnerCenters error:', error);
        return { success: false, error: 'Failed to fetch partner centers' };
    }
}

/**
 * Get a single partner center by ID
 */
export async function getPartnerCenterById(id: string) {
    try {
        const partner = await prisma.partnerCenter.findUnique({
            where: { id },
        });
        if (!partner) return { success: false, error: 'Partner center not found' };
        return { success: true, data: partner };
    } catch (error) {
        console.error('getPartnerCenterById error:', error);
        return { success: false, error: 'Failed to fetch partner center' };
    }
}

/**
 * Create a new partner center
 */
export async function createPartnerCenter(data: PartnerCenterInput) {
    try {
        const validated = partnerCenterSchema.parse(data);

        // Check for existing PID
        const existing = await prisma.partnerCenter.findUnique({
            where: { pid: validated.pid },
        });

        if (existing) {
            return { success: false, error: 'รหัสศูนย์ (PID) นี้ถูกใช้ไปแล้ว' };
        }

        const partner = await prisma.partnerCenter.create({
            data: validated,
        });

        revalidatePath('/dashboard/partners');
        return { success: true, data: partner };
    } catch (error: any) {
        console.error('createPartnerCenter error:', error);
        return { success: false, error: error.message || 'Failed to create partner center' };
    }
}

/**
 * Update a partner center
 */
export async function updatePartnerCenter(id: string, data: Partial<PartnerCenterInput>) {
    try {
        // Validate partial data? For simplicity, we usually send full object in edit forms
        const partner = await prisma.partnerCenter.update({
            where: { id },
            data,
        });

        revalidatePath('/dashboard/partners');
        revalidatePath(`/dashboard/partners/${id}`);
        return { success: true, data: partner };
    } catch (error: any) {
        console.error('updatePartnerCenter error:', error);
        return { success: false, error: error.message || 'Failed to update partner center' };
    }
}

/**
 * Toggle active status or delete (usually we do isActive toggle)
 */
export async function deletePartnerCenter(id: string) {
    try {
        await prisma.partnerCenter.delete({
            where: { id },
        });
        revalidatePath('/dashboard/partners');
        return { success: true };
    } catch (error) {
        console.error('deletePartnerCenter error:', error);
        return { success: false, error: 'Failed to delete partner center' };
    }
}
