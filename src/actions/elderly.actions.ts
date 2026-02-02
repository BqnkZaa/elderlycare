'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { elderlyProfileSchema, type ElderlyProfileInput } from "@/lib/validations";
import { Prisma } from "@prisma/client";

export async function createElderlyProfile(data: ElderlyProfileInput) {
    try {
        console.log("Server Action Received:", data);

        // Validate data server-side
        const validatedFields = elderlyProfileSchema.safeParse(data);

        if (!validatedFields.success) {
            return {
                success: false,
                error: "Invalid fields: " + validatedFields.error.issues.map((e: any) => e.message).join(", "),
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
            },
        });

        console.log("Created Profile ID:", newProfile.id);

        revalidatePath('/dashboard/elderly');
        return { success: true, data: newProfile };

    } catch (error: any) {
        console.error("Failed to create elderly profile:", error);
        return {
            success: false,
            error: error.message || "Failed to create profile",
        };
    }
}

interface GetProfilesParams {
    search?: string;
    province?: string;
    page?: number;
    pageSize?: number;
}

export async function getElderlyProfiles({
    search,
    province,
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
                { firstName: { contains: search } },
                { lastName: { contains: search } },
                { safeId: { contains: search } },
            ];
        }

        if (province) {
            where.province = province;
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
                    province: true,
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
            error: error.message || "Failed to fetch profiles",
        };
    }
}

export async function getElderlyProfile(id: string) {
    try {
        const profile = await prisma.elderlyProfile.findUnique({
            where: { id },
        });

        if (!profile) {
            return { success: false, error: "Profile not found" };
        }

        return { success: true, data: profile };
    } catch (error: any) {
        console.error("Failed to fetch profile:", error);
        return { success: false, error: error.message || "Failed to fetch profile" };
    }
}

export async function updateElderlyProfile(id: string, data: ElderlyProfileInput) {
    try {
        const validatedFields = elderlyProfileSchema.safeParse(data);

        if (!validatedFields.success) {
            return {
                success: false,
                error: "Invalid fields: " + validatedFields.error.issues.map((e: any) => e.message).join(", "),
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
            },
        });

        revalidatePath('/dashboard/elderly');
        revalidatePath(`/dashboard/elderly/${id}`);

        return { success: true, data: updatedProfile };
    } catch (error: any) {
        console.error("Failed to update profile:", error);
        return { success: false, error: error.message || "Failed to update profile" };
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


