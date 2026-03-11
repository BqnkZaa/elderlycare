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
        return { success: false, error: 'ไม่สามารถดึงข้อมูลศูนย์ดูแลได้' };
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
        if (!partner) return { success: false, error: 'ไม่พบข้อมูลศูนย์ดูแลนี้' };
        return { success: true, data: partner };
    } catch (error) {
        console.error('getPartnerCenterById error:', error);
        return { success: false, error: 'ไม่สามารถดึงข้อมูลศูนย์ดูแลได้' };
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
        return { success: false, error: error.message || 'ไม่สามารถบันทึกข้อมูลศูนย์ดูแลได้' };
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
        return { success: false, error: error.message || 'ไม่สามารถแก้ไขข้อมูลศูนย์ดูแลได้' };
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
        return { success: false, error: 'ไม่สามารถลบข้อมูลศูนย์ดูแลได้' };
    }
}

/**
 * Get recommended partner centers based on elderly assessment
 */
export async function getRecommendations(elderlyId: string) {
    try {
        const elderly = await prisma.elderlyProfile.findUnique({
            where: { id: elderlyId }
        });

        if (!elderly) return { success: false, error: 'ไม่พบข้อมูลผู้สูงอายุ' };

        const partners = await prisma.partnerCenter.findMany({
            where: { isActive: true }
        });

        const scoredPartners = partners.map(partner => {
            let score = 0;
            let matchCount = 0;
            const reasons: string[] = [];

            // 1. Mobility Matching
            if (elderly.selfHelpStatus === 'INDEPENDENT_NON_BEDRIDDEN') {
                if (partner.supportIndependentNonBedridden) { score += 10; matchCount++; reasons.push('รองรับผู้สูงอายุที่ช่วยเหลือตัวเองได้'); }
            } else if (elderly.selfHelpStatus === 'INDEPENDENT_BEDRIDDEN') {
                if (partner.supportIndependentBedridden) { score += 10; matchCount++; reasons.push('รองรับผู้สูงอายุที่ติดเตียงแต่ช่วยเหลือตัวเองได้'); }
            } else if (elderly.selfHelpStatus === 'DEPENDENT_BEDRIDDEN') {
                if (partner.supportDependentBedridden) { score += 10; matchCount++; reasons.push('รองรับผู้สูงอายุที่ติดเตียงและช่วยเหลือตัวเองไม่ได้'); }
            }

            // 2. Eating Matching
            if (elderly.eatingStatus === 'EAT_NORMAL') {
                if (partner.supportNormalDiet) { score += 5; matchCount++; reasons.push('รองรับอาหารปกติ'); }
            } else if (elderly.eatingStatus === 'EAT_SOFT') {
                if (partner.supportSoftDiet) { score += 5; matchCount++; reasons.push('รองรับอาหารอ่อน'); }
            } else if (elderly.eatingStatus === 'NEEDS_FEEDING') {
                if (partner.supportNeedsFeeding) { score += 8; matchCount++; reasons.push('มีบริการป้อนอาหาร'); }
            } else if (elderly.eatingStatus === 'TUBE_FEEDING') {
                if (partner.supportTubeFeeding) { score += 15; matchCount++; reasons.push('รองรับการให้อาหารทางสายยาง'); }
            }

            // 3. Medical Support (Critical if exists)
            if (elderly.hasTracheostomy) {
                if (partner.supportTracheostomy) { score += 20; matchCount++; reasons.push('รองรับผู้ป่วยเจาะคอ'); }
                else { score -= 100; } // Major mismatch
            }

            if (elderly.bedsoreStatus !== 'NONE') {
                if (partner.supportBedsore) { score += 10; matchCount++; reasons.push('รองรับการดูแลแผลกดทับ'); }
                else { score -= 50; }
            }

            if (elderly.useAirMattress) {
                if (partner.supportAirMattress) { score += 5; matchCount++; reasons.push('มีบริการที่นอนลม'); }
            }

            if (elderly.oxygenSupport !== 'NONE') {
                if (partner.supportOxygen) { score += 15; matchCount++; reasons.push('รองรับการใช้ออกซิเจน'); }
                else { score -= 80; }
            }

            if (elderly.useVentilator) {
                if (partner.supportVentilator) { score += 30; matchCount++; reasons.push('รองรับเครื่องช่วยหายใจ'); }
                else { score -= 200; }
            }

            // 4. Psychiatric
            if (elderly.psychiatricStatus !== 'NONE') {
                if (partner.supportPsychiatric) { score += 10; matchCount++; reasons.push('รองรับผู้ป่วยจิตเวช/อัลไซเมอร์'); }
                else { score -= 50; }
            }

            if (elderly.hasAggressiveBehavior) {
                if (partner.supportAggressiveBehavior) { score += 15; matchCount++; reasons.push('รองรับผู้ป่วยที่มีพฤติกรรมก้าวร้าว'); }
                else { score -= 150; }
            }

            if (elderly.hasPsychiatricMedication) {
                if (partner.supportPsychiatricMedication) { score += 10; matchCount++; reasons.push('รองรับการใช้ยาทางจิตเวช'); }
            }

            return {
                ...partner,
                matchScore: score,
                matchReasons: reasons,
                isCompatible: score > -50 // Threshold for basic compatibility
            };
        });

        // Filter out incompatible ones and sort by score
        const recommendations = scoredPartners
            .filter(p => p.isCompatible)
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 5); // Return top 5

        return { success: true, data: recommendations };
    } catch (error) {
        console.error('getRecommendations error:', error);
        return { success: false, error: 'เกิดข้อผิดพลาดในการประมวลผลคำแนะนำ' };
    }
}

