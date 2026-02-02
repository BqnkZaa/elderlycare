/**
 * Zod Validation Schemas
 * 
 * Defines validation schemas for all form inputs using Zod.
 */

import { z } from 'zod';
import { PROVINCE_NAMES_TH } from '@/lib/provinces';

// ============================================
// ELDERLY PROFILE SCHEMAS
// ============================================

export const elderlyProfileSchema = z.object({
    // Header / Admission Info
    admissionDate: z.union([z.string(), z.date()]).transform((val) => new Date(val)),
    admissionTime: z.string().optional().nullable(),
    safeId: z.string().min(1, 'กรุณาระบุ SAFE-ID').max(20).optional().nullable(),
    partnerId: z.string().max(20).optional().nullable(),

    // Section 1: Identification & Personal Background
    firstName: z.string().min(1, 'กรุณากรอกชื่อ').max(100),
    lastName: z.string().min(1, 'กรุณากรอกนามสกุล').max(100),
    nickname: z.string().max(50).optional().nullable(),
    age: z.coerce.number().min(50).max(120).optional().nullable(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
    preferredPronouns: z.string().max(100).optional().nullable(),
    education: z.string().max(100).optional().nullable(),
    proudFormerOccupation: z.string().max(200).optional().nullable(),
    dateOfBirth: z.union([z.string(), z.date()]).optional().nullable().transform((val) => val ? new Date(val) : null),
    nationalId: z.string().max(13).optional().nullable(), // Optional now

    // Section 2: Marital Status & Contacts
    maritalStatus: z.enum(['SINGLE', 'MARRIED', 'WIDOWED', 'DIVORCED_SEPARATED']),
    keyCoordinatorName: z.string().max(100).optional().nullable(),
    keyCoordinatorPhone: z.string().max(255).optional().nullable(),
    keyCoordinatorRelation: z.string().max(100).optional().nullable(),
    legalGuardianName: z.string().max(100).optional().nullable(),
    legalGuardianPhone: z.string().max(255).optional().nullable(),
    legalGuardianRelation: z.string().max(100).optional().nullable(),

    // Section 3: Sensory & Communication
    hearingStatus: z.enum(['NORMAL', 'HARD_OF_HEARING_LEFT', 'HARD_OF_HEARING_RIGHT', 'HARD_OF_HEARING_BOTH', 'DEAF', 'HEARING_AID']),
    visionStatus: z.enum(['NORMAL', 'NEARSIGHTED_FARSIGHTED', 'CATARACT_GLAUCOMA', 'GLASSES', 'CONTACT_LENS']),
    speechStatus: z.enum(['CLEAR', 'DYSARTHRIA', 'APHASIA', 'NON_VERBAL']),

    // Section 4: Mobility & Fall Risk
    historyOfFalls: z.coerce.boolean(),
    fallsTimeframe: z.string().max(50).optional().nullable(),
    fallsCause: z.string().optional().nullable(),
    gaitStatus: z.enum(['INDEPENDENT', 'UNSTEADY', 'NEEDS_SUPPORT', 'NON_AMBULATORY_BEDRIDDEN']),
    assistiveDevices: z.string().optional().nullable(), // JSON string
    mobilityStatus: z.enum(['INDEPENDENT', 'NEEDS_ASSISTANCE', 'WHEELCHAIR', 'BEDRIDDEN']).optional(), // Keep for compat

    // Section 5: Elimination
    bladderControl: z.enum(['CONTINENT', 'OCCASIONAL_INCONTINENCE', 'TOTAL_INCONTINENCE_FOLEY']),
    foleySize: z.string().max(10).optional().nullable(),
    bowelControl: z.enum(['NORMAL', 'CONSTIPATION', 'DIARRHEA', 'INCONTINENCE']),
    diaperType: z.enum(['NONE', 'TAPE', 'PANTS']),
    diaperSize: z.string().max(10).optional().nullable(),

    // Section 6: Cognitive & Behavioral
    hasConfusion: z.coerce.boolean(),
    confusionTimeframe: z.string().optional().nullable(),
    memoryStatus: z.string().optional().nullable(), // JSON string
    behaviorStatus: z.string().optional().nullable(), // JSON string

    // Section 7: Chief Complaint
    reasonForAdmission: z.string().optional().nullable(),
    initialMentalState: z.string().optional().nullable(),

    // Section 8: Medical History
    underlyingDiseases: z.string().optional().nullable(),
    currentMedications: z.string().optional().nullable(),
    surgicalHistory: z.string().optional().nullable(),

    // Section 9: Allergies
    hasDrugAllergies: z.coerce.boolean(),
    drugAllergiesDetail: z.string().optional().nullable(),
    hasFoodChemicalAllergies: z.coerce.boolean(),
    foodChemicalAllergiesDetail: z.string().optional().nullable(),
    allergies: z.string().optional().nullable(), // Keep for compat

    // Section 10: Physical & Medical Devices
    skinCondition: z.string().optional().nullable(), // JSON string
    hasPressureUlcer: z.coerce.boolean(),
    pressureUlcerLocation: z.string().max(100).optional().nullable(),
    pressureUlcerStage: z.string().max(10).optional().nullable(),
    medicalDevices: z.string().optional().nullable(), // JSON string

    // Section 11: Social Support & Financial
    primaryCaregiverName: z.string().max(100).optional().nullable(),
    primaryCaregiverRelation: z.string().max(100).optional().nullable(),
    healthPrivilege: z.enum(['SELF_PAY', 'SOCIAL_SECURITY', 'GOLD_CARD', 'GOVERNMENT_OFFICER']),
    sponsor: z.string().max(200).optional().nullable(),

    // Section 12: Religion & Beliefs
    religion: z.string().max(100).optional().nullable(),
    religiousRestrictions: z.string().optional().nullable(),
    spiritualNeeds: z.string().optional().nullable(),

    // Section 13: Goals & Expectations
    goalOfCare: z.enum(['REHABILITATION', 'LONG_TERM_CARE', 'PALLIATIVE']),
    expectationDetails: z.string().optional().nullable(),
    careLevel: z.enum(['LEVEL_1', 'LEVEL_2', 'LEVEL_3', 'LEVEL_4']),

    // Section 14: Environment & Genogram
    homeType: z.enum(['SINGLE_HOUSE', 'TOWNHOUSE']).optional().nullable(),
    bedroomLocation: z.string().max(50).optional().nullable(),
    familyGenogram: z.string().optional().nullable(),

    // Address Information (Keep for backward compatibility)
    address: z.string().max(255).optional().nullable(),
    subDistrict: z.string().max(100).optional().nullable(),
    district: z.string().max(100).optional().nullable(),
    province: z.string().optional().nullable(),
    postalCode: z.string().max(5).optional().nullable(),

    // Other existing fields
    phoneNumber: z.string().max(255).optional().nullable(),
    email: z.string().email('รูปแบบอีเมลไม่ถูกต้อง').optional().nullable().or(z.literal('')),
    emergencyContactName: z.string().max(100).optional().nullable(),
    emergencyContactPhone: z.string().max(255).optional().nullable(),
    emergencyContactRelation: z.string().max(50).optional().nullable(),
    bloodType: z.enum([
        'A_POSITIVE', 'A_NEGATIVE',
        'B_POSITIVE', 'B_NEGATIVE',
        'O_POSITIVE', 'O_NEGATIVE',
        'AB_POSITIVE', 'AB_NEGATIVE',
        'UNKNOWN'
    ]).optional(),
    profilePhoto: z.string().optional().nullable(),
    specialDietaryNeeds: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    isActive: z.boolean(),
});

export type ElderlyProfileInput = z.infer<typeof elderlyProfileSchema>;

// ============================================
// DAILY LOG SCHEMAS
// ============================================

export const vitalsSchema = z.object({
    bp_systolic: z.number().min(60).max(250).optional(),
    bp_diastolic: z.number().min(40).max(150).optional(),
    heartRate: z.number().min(30).max(200).optional(),
    temperature: z.number().min(35).max(42).optional(),
    oxygenLevel: z.number().min(70).max(100).optional(),
    weight: z.number().min(20).max(200).optional(),
});

export const dailyLogSchema = z.object({
    elderlyId: z.string().uuid('ID ผู้สูงอายุไม่ถูกต้อง'),
    date: z.string().min(1, 'กรุณาเลือกวันที่'),
    vitals: vitalsSchema.optional().nullable(),
    activityNote: z.string().optional().nullable(),
    mood: z.enum(['HAPPY', 'CONTENT', 'NEUTRAL', 'SAD', 'ANXIOUS', 'IRRITABLE']),
    mealIntake: z.enum(['FULL', 'PARTIAL', 'MINIMAL', 'NONE']),
    sleepQuality: z.enum(['EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'VERY_POOR']),
    sleepHours: z.number().min(0).max(24).optional().nullable(),
    medicationsTaken: z.boolean(),
    medicationNotes: z.string().optional().nullable(),
    physicalCondition: z.string().optional().nullable(),
    behavioralNotes: z.string().optional().nullable(),
    incidentsReported: z.string().optional().nullable(),
    recordedBy: z.string().min(1, 'กรุณาระบุผู้บันทึก'),
    recordedByName: z.string().optional().nullable(),
});

export type DailyLogInput = z.infer<typeof dailyLogSchema>;

// ============================================
// USER SCHEMAS
// ============================================

export const loginSchema = z.object({
    email: z.string().email('รูปแบบอีเมลไม่ถูกต้อง'),
    password: z.string().min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const userSchema = z.object({
    email: z.string().email('รูปแบบอีเมลไม่ถูกต้อง'),
    password: z.string().min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'),
    name: z.string().min(1, 'กรุณากรอกชื่อ'),
    role: z.enum(['ADMIN', 'STAFF']),
});

export type UserInput = z.infer<typeof userSchema>;

// ============================================
// FILTER/QUERY SCHEMAS
// ============================================

export const elderlyFilterSchema = z.object({
    search: z.string().optional(),
    province: z.string().optional(),
    careLevel: z.enum(['LEVEL_1', 'LEVEL_2', 'LEVEL_3', 'LEVEL_4']).optional(),
    mobilityStatus: z.enum(['INDEPENDENT', 'NEEDS_ASSISTANCE', 'WHEELCHAIR', 'BEDRIDDEN']).optional(),
    isActive: z.boolean().optional(),
    page: z.number().min(1).optional(),
    pageSize: z.number().min(1).max(100).optional(),
});

export type ElderlyFilter = z.infer<typeof elderlyFilterSchema>;

export const dailyLogFilterSchema = z.object({
    elderlyId: z.string().uuid().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    page: z.number().min(1).optional(),
    pageSize: z.number().min(1).max(100).optional(),
});

export type DailyLogFilter = z.infer<typeof dailyLogFilterSchema>;
