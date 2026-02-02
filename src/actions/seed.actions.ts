'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import {
    Gender, MaritalStatus, HearingStatus, VisionStatus, SpeechStatus,
    GaitStatus, BladderControl, BowelControl, DiaperType, HealthPrivilege,
    GoalOfCare, CareLevel, BloodType, MobilityStatus, Role
} from '@prisma/client';

export async function seedUsers() {
    try {
        const passwordHash = await bcrypt.hash('admin123', 12);

        // 1. Admin User
        const adminEmail = 'admin@elderlycare.com';
        const admin = await prisma.user.upsert({
            where: { email: adminEmail },
            update: {
                password: passwordHash, // Ensure password is updated if user exists
            },
            create: {
                email: adminEmail,
                password: passwordHash,
                name: 'System Admin',
                role: Role.ADMIN,
                isActive: true,
            },
        });

        // 2. Staff User (Service Center Representation)
        const staffEmail = 'staff@elderlycare.com';
        const staff = await prisma.user.upsert({
            where: { email: staffEmail },
            update: {
                password: passwordHash,
            },
            create: {
                email: staffEmail,
                password: passwordHash,
                name: 'Staff Member',
                role: Role.STAFF,
                isActive: true,
            },
        });

        return { success: true, message: 'Users seeded successfully' };
    } catch (error) {
        console.error('Error seeding users:', error);
        return { success: false, error: 'Failed to seed users' };
    }
}

export async function seedElderlyProfiles() {
    try {
        // Sample Elderly 1: Relatively healthy, mostly independent
        await prisma.elderlyProfile.upsert({
            where: { safeId: 'SID2024001' },
            update: {},
            create: {
                safeId: 'SID2024001',
                firstName: 'สมชาย',
                lastName: 'ใจดี',
                nickname: 'ลุงสม',
                age: 75,
                gender: Gender.MALE,
                dateOfBirth: new Date('1949-05-15'),
                maritalStatus: MaritalStatus.MARRIED,

                // Contact
                keyCoordinatorName: 'สมศรี ใจดี',
                keyCoordinatorPhone: '081-111-1111',
                keyCoordinatorRelation: 'ภรรยา',

                // Health
                hearingStatus: HearingStatus.NORMAL,
                visionStatus: VisionStatus.GLASSES,
                speechStatus: SpeechStatus.CLEAR,
                mobilityStatus: MobilityStatus.INDEPENDENT,
                gaitStatus: GaitStatus.INDEPENDENT,

                // Elimination
                bladderControl: BladderControl.CONTINENT,
                bowelControl: BowelControl.NORMAL,
                diaperType: DiaperType.NONE,

                // Medical
                underlyingDiseases: 'ความดันโลหิตสูง',
                currentMedications: 'Amlodipine 5mg',
                healthPrivilege: HealthPrivilege.SOCIAL_SECURITY,

                // Care
                careLevel: CareLevel.LEVEL_1,
                goalOfCare: GoalOfCare.LONG_TERM_CARE,

                registrationDate: new Date(),
                admissionDate: new Date(),
            }
        });

        // Sample Elderly 2: Needs assistance, dementia symptoms
        await prisma.elderlyProfile.upsert({
            where: { safeId: 'SID2024002' },
            update: {},
            create: {
                safeId: 'SID2024002',
                firstName: 'สมหญิง',
                lastName: 'รักสงบ',
                nickname: 'ยายหญิง',
                age: 82,
                gender: Gender.FEMALE,
                dateOfBirth: new Date('1942-11-20'),
                maritalStatus: MaritalStatus.WIDOWED,

                // Contact
                keyCoordinatorName: 'วิชัย รักสงบ',
                keyCoordinatorPhone: '089-999-9999',
                keyCoordinatorRelation: 'บุตรชาย',

                // Health
                hearingStatus: HearingStatus.HARD_OF_HEARING_LEFT,
                visionStatus: VisionStatus.CATARACT_GLAUCOMA,
                speechStatus: SpeechStatus.CLEAR,
                mobilityStatus: MobilityStatus.NEEDS_ASSISTANCE,
                gaitStatus: GaitStatus.NEEDS_SUPPORT,
                assistiveDevices: JSON.stringify(['Walker']),
                historyOfFalls: true,
                fallsTimeframe: '6 เดือนที่ผ่านมา',

                // Cognitive
                hasConfusion: true,
                confusionTimeframe: 'ช่วงเย็น',

                // Elimination
                bladderControl: BladderControl.OCCASIONAL_INCONTINENCE,
                bowelControl: BowelControl.CONSTIPATION,
                diaperType: DiaperType.PANTS,

                // Medical
                underlyingDiseases: 'เบาหวาน, อัลไซเมอร์ระยะต้น',
                currentMedications: 'Metformin, Donepezil',
                healthPrivilege: HealthPrivilege.GOLD_CARD,

                // Care
                careLevel: CareLevel.LEVEL_2,
                goalOfCare: GoalOfCare.LONG_TERM_CARE,

                registrationDate: new Date(),
                admissionDate: new Date(),
            }
        });

        return { success: true, message: 'Elderly profiles seeded successfully' };
    } catch (error) {
        console.error('Error seeding elderly profiles:', error);
        return { success: false, error: 'Failed to seed elderly profiles' };
    }
}
