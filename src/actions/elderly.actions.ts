'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { elderlyProfileSchema, type ElderlyProfileInput } from "@/lib/validations";
import { Prisma } from "@prisma/client";
import { requireRole } from "@/lib/auth-utils";


export async function createElderlyProfile(data: ElderlyProfileInput) {
    try {
        await requireRole(['ADMIN', 'STAFF']);
        console.log("Server Action Received:", data);

        // Validate data server-side
        const validatedFields = elderlyProfileSchema.safeParse(data);

        if (!validatedFields.success) {
            return {
                success: false,
                error: "ข้อมูลไม่ถูกต้อง: " + validatedFields.error.issues.map((e: any) => e.message).join(", "),
            };
        }

        const profileData = validatedFields.data;

        // Create in Database
        const newProfile = await prisma.elderlyProfile.create({
            data: {
                ...profileData,
                // Handle enums or specific transformations if needed
                // Most fields map directly from Zod schema to Prisma schema
                gender: profileData.gender as any,
                maritalStatus: profileData.maritalStatus as any,
                hearingStatus: profileData.hearingStatus as any,
                visionStatus: profileData.visionStatus as any,
                speechStatus: profileData.speechStatus as any,
                mobilityStatus: profileData.mobilityStatus as any || 'INDEPENDENT',
                gaitStatus: profileData.gaitStatus as any,
                bladderControl: profileData.bladderControl as any,
                bowelControl: profileData.bowelControl as any,
                diaperType: profileData.diaperType as any,
                healthPrivilege: profileData.healthPrivilege as any,
                goalOfCare: profileData.goalOfCare as any,
                careLevel: profileData.careLevel as any || 'LEVEL_1',
                homeType: profileData.homeType as any || null,
                bloodType: profileData.bloodType as any || 'UNKNOWN',
                childrenCount: profileData.childrenCount as any || 'NONE',
                formerOccupation: profileData.formerOccupation as any || 'OTHER',
                currentLocation: profileData.currentLocation as any || 'HOME',
                selfHelpStatus: profileData.selfHelpStatus as any || 'INDEPENDENT_NON_BEDRIDDEN',
                eatingStatus: profileData.eatingStatus as any || 'EAT_NORMAL',
                bedsoreStatus: profileData.bedsoreStatus as any || 'NONE',
                oxygenSupport: profileData.oxygenSupport as any || 'NONE',
                psychiatricStatus: profileData.psychiatricStatus as any || 'NONE',

                // PART 3 fields
                adlEating: profileData.adlEating as any,
                adlGrooming: profileData.adlGrooming as any,
                adlBathing: profileData.adlBathing as any,
                adlDressing: profileData.adlDressing as any,
                adlBowel: profileData.adlBowel as any,
                adlBladder: profileData.adlBladder as any,
                adlToilet: profileData.adlToilet as any,
                adlTransfer: profileData.adlTransfer as any,
                adlMobility: profileData.adlMobility as any,
                adlStairs: profileData.adlStairs as any,

                hasNgt: profileData.hasNgt,
                hasPeg: profileData.hasPeg,
                hasFoleyCatheter: profileData.hasFoleyCatheter,
                hasColostomy: profileData.hasColostomy,
                oxygenCannulaLiters: profileData.oxygenCannulaLiters,
                oxygenMaskLiters: profileData.oxygenMaskLiters,
                ventilatorMode: profileData.ventilatorMode,
                needSuction: profileData.needSuction,

                woundsNone: profileData.woundsNone,
                bedsoreStage1Location: profileData.bedsoreStage1Location,
                bedsoreStage2Location: profileData.bedsoreStage2Location,
                bedsoreStage3Location: profileData.bedsoreStage3Location,
                bedsoreStage4Location: profileData.bedsoreStage4Location,
                diabeticWoundLocation: profileData.diabeticWoundLocation,
                surgicalWoundLocation: profileData.surgicalWoundLocation,

                hasCapd: profileData.hasCapd,
                hasHd: profileData.hasHd,
                hasIvSupport: profileData.hasIvSupport,
                requireBloodSugarCheck: profileData.requireBloodSugarCheck,

                cognitiveStatus: profileData.cognitiveStatus as any,
                aggressiveStatus: profileData.aggressiveStatus as any,
                noisyConfusionTimeframe: profileData.noisyConfusionTimeframe,
                talksToSelfQuietly: profileData.talksToSelfQuietly,
                psychiatricWithMeds: profileData.psychiatricWithMeds,
                psychiatricNoMeds: profileData.psychiatricNoMeds,

                fallHistoryLevel: profileData.fallHistoryLevel as any,
                bradenScale: profileData.bradenScale as any,
                infectionNone: profileData.infectionNone,
                infectionDetails: profileData.infectionDetails,
                frailtyScore: profileData.frailtyScore as any,

                recentDischargeDate: profileData.recentDischargeDate,
                recentHospital: profileData.recentHospital,
                recentAdmissionReason: profileData.recentAdmissionReason,
                nextAppointmentDate: profileData.nextAppointmentDate,

                polypharmacy: profileData.polypharmacy as any,
                highAlertAnticoagulant: profileData.highAlertAnticoagulant,
                highAlertDiabetic: profileData.highAlertDiabetic,
                highAlertPsychiatric: profileData.highAlertPsychiatric,
            },
        });

        console.log("Created Profile ID:", newProfile.id);

        revalidatePath('/dashboard/elderly');
        return { success: true, data: newProfile };

    } catch (error: any) {
        console.error("Failed to create elderly profile:", error);

        // Handle Prisma Unique Constraint Error (P2002)
        if (error.code === 'P2002' && error.meta?.target?.includes('safeId')) {
            return {
                success: false,
                error: "รหัสผู้ป่วย (SAFE-ID) นี้ถูกใช้ลงทะเบียนไปแล้ว กรุณาระบุรหัสใหม่ครับ",
            };
        }

        return {
            success: false,
            error: error.message || "เกิดข้อผิดพลาดในการสร้างโปรไฟล์",
        };
    }
}

interface GetProfilesParams {
    search?: string;
    partnerId?: string;
    page?: number;
    pageSize?: number;
}

export async function getElderlyProfiles({
    search,
    partnerId,
    page = 1,
    pageSize = 10,
}: GetProfilesParams) {
    try {
        const skip = (page - 1) * pageSize;

        // Build where clause
        const where: Prisma.ElderlyProfileWhereInput = {
            isActive: true,
        };

        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { safeId: { contains: search, mode: 'insensitive' } },
                { nationalId: { contains: search, mode: 'insensitive' } },
                { phoneNumber: { contains: search, mode: 'insensitive' } },
                { keyCoordinatorName: { contains: search, mode: 'insensitive' } },
                { emergencyContactName: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (partnerId) {
            where.partnerId = partnerId;
        }

        // Parallel fetch: data and count
        const [profiles, totalItems] = await Promise.all([
            prisma.elderlyProfile.findMany({
                where,
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    nickname: true,
                    dateOfBirth: true,
                    gender: true,
                    partnerId: true,
                    careLevel: true,
                    mobilityStatus: true,
                    isActive: true,
                    createdAt: true,
                    _count: {
                        select: { dailyLogs: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: pageSize,
            }),
            prisma.elderlyProfile.count({ where }),
        ]);

        const totalPages = Math.ceil(totalItems / pageSize);

        return {
            success: true,
            data: profiles,
            pagination: {
                currentPage: page,
                pageSize,
                totalItems,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        };

    } catch (error: any) {
        console.error("Failed to fetch elderly profiles:", error);
        return {
            success: false,
            error: error.message || "เกิดข้อผิดพลาดในการดึงข้อมูล",
        };
    }
}

export async function getElderlyProfile(id: string) {
    try {
        const profile = await prisma.elderlyProfile.findUnique({
            where: { id },
        });

        if (!profile) {
            return { success: false, error: "ไม่พบข้อมูลโปรไฟล์ผู้สูงอายุ" };
        }

        return { success: true, data: profile };
    } catch (error: any) {
        console.error("Failed to fetch profile:", error);
        return { success: false, error: error.message || "เกิดข้อผิดพลาดในการดึงข้อมูลโปรไฟล์" };
    }
}

export async function updateElderlyProfile(id: string, data: ElderlyProfileInput) {
    try {
        await requireRole(['ADMIN', 'STAFF']);
        const validatedFields = elderlyProfileSchema.safeParse(data);

        if (!validatedFields.success) {
            return {
                success: false,
                error: "ข้อมูลไม่ถูกต้อง: " + validatedFields.error.issues.map((e: any) => e.message).join(", "),
            };
        }

        const profileData = validatedFields.data;

        const updatedProfile = await prisma.elderlyProfile.update({
            where: { id },
            data: {
                ...profileData,
                gender: profileData.gender as any,
                maritalStatus: profileData.maritalStatus as any,
                hearingStatus: profileData.hearingStatus as any,
                visionStatus: profileData.visionStatus as any,
                speechStatus: profileData.speechStatus as any,
                mobilityStatus: profileData.mobilityStatus as any || 'INDEPENDENT',
                gaitStatus: profileData.gaitStatus as any,
                bladderControl: profileData.bladderControl as any,
                bowelControl: profileData.bowelControl as any,
                diaperType: profileData.diaperType as any,
                healthPrivilege: profileData.healthPrivilege as any,
                goalOfCare: profileData.goalOfCare as any,
                careLevel: profileData.careLevel as any || 'LEVEL_1',
                homeType: profileData.homeType as any || null,
                bloodType: profileData.bloodType as any || 'UNKNOWN',
                childrenCount: profileData.childrenCount as any || 'NONE',
                formerOccupation: profileData.formerOccupation as any || 'OTHER',
                currentLocation: profileData.currentLocation as any || 'HOME',
                selfHelpStatus: profileData.selfHelpStatus as any || 'INDEPENDENT_NON_BEDRIDDEN',
                eatingStatus: profileData.eatingStatus as any || 'EAT_NORMAL',
                bedsoreStatus: profileData.bedsoreStatus as any || 'NONE',
                oxygenSupport: profileData.oxygenSupport as any || 'NONE',
                psychiatricStatus: profileData.psychiatricStatus as any || 'NONE',

                // PART 3 fields
                adlEating: profileData.adlEating as any,
                adlGrooming: profileData.adlGrooming as any,
                adlBathing: profileData.adlBathing as any,
                adlDressing: profileData.adlDressing as any,
                adlBowel: profileData.adlBowel as any,
                adlBladder: profileData.adlBladder as any,
                adlToilet: profileData.adlToilet as any,
                adlTransfer: profileData.adlTransfer as any,
                adlMobility: profileData.adlMobility as any,
                adlStairs: profileData.adlStairs as any,

                hasNgt: profileData.hasNgt,
                hasPeg: profileData.hasPeg,
                hasFoleyCatheter: profileData.hasFoleyCatheter,
                hasColostomy: profileData.hasColostomy,
                oxygenCannulaLiters: profileData.oxygenCannulaLiters,
                oxygenMaskLiters: profileData.oxygenMaskLiters,
                ventilatorMode: profileData.ventilatorMode,
                needSuction: profileData.needSuction,

                woundsNone: profileData.woundsNone,
                bedsoreStage1Location: profileData.bedsoreStage1Location,
                bedsoreStage2Location: profileData.bedsoreStage2Location,
                bedsoreStage3Location: profileData.bedsoreStage3Location,
                bedsoreStage4Location: profileData.bedsoreStage4Location,
                diabeticWoundLocation: profileData.diabeticWoundLocation,
                surgicalWoundLocation: profileData.surgicalWoundLocation,

                hasCapd: profileData.hasCapd,
                hasHd: profileData.hasHd,
                hasIvSupport: profileData.hasIvSupport,
                requireBloodSugarCheck: profileData.requireBloodSugarCheck,

                cognitiveStatus: profileData.cognitiveStatus as any,
                aggressiveStatus: profileData.aggressiveStatus as any,
                noisyConfusionTimeframe: profileData.noisyConfusionTimeframe,
                talksToSelfQuietly: profileData.talksToSelfQuietly,
                psychiatricWithMeds: profileData.psychiatricWithMeds,
                psychiatricNoMeds: profileData.psychiatricNoMeds,

                fallHistoryLevel: profileData.fallHistoryLevel as any,
                bradenScale: profileData.bradenScale as any,
                infectionNone: profileData.infectionNone,
                infectionDetails: profileData.infectionDetails,
                frailtyScore: profileData.frailtyScore as any,

                recentDischargeDate: profileData.recentDischargeDate,
                recentHospital: profileData.recentHospital,
                recentAdmissionReason: profileData.recentAdmissionReason,
                nextAppointmentDate: profileData.nextAppointmentDate,

                polypharmacy: profileData.polypharmacy as any,
                highAlertAnticoagulant: profileData.highAlertAnticoagulant,
                highAlertDiabetic: profileData.highAlertDiabetic,
                highAlertPsychiatric: profileData.highAlertPsychiatric,
            },
        });

        revalidatePath('/dashboard/elderly');
        revalidatePath(`/dashboard/elderly/${id}`);

        return { success: true, data: updatedProfile };
    } catch (error: any) {
        console.error("Failed to update profile:", error);
        return { success: false, error: error.message || "เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์" };
    }
}

export async function getDashboardStats() {
    try {
        const [totalElderly, activeElderly] = await Promise.all([
            prisma.elderlyProfile.count(),
            prisma.elderlyProfile.count({ where: { isActive: true } })
        ]);

        return {
            success: true,
            data: {
                totalElderly,
                activeElderly
            }
        };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}


