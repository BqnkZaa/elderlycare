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
    // Personal Information
    nationalId: z.string()
        .min(13, 'เลขบัตรประชาชนต้องมี 13 หลัก')
        .max(13, 'เลขบัตรประชาชนต้องมี 13 หลัก')
        .regex(/^\d+$/, 'เลขบัตรประชาชนต้องเป็นตัวเลขเท่านั้น'),
    firstName: z.string().min(1, 'กรุณากรอกชื่อ').max(100),
    lastName: z.string().min(1, 'กรุณากรอกนามสกุล').max(100),
    nickname: z.string().max(50).optional().nullable(),
    dateOfBirth: z.string().min(1, 'กรุณาเลือกวันเกิด'),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
    bloodType: z.enum([
        'A_POSITIVE', 'A_NEGATIVE',
        'B_POSITIVE', 'B_NEGATIVE',
        'O_POSITIVE', 'O_NEGATIVE',
        'AB_POSITIVE', 'AB_NEGATIVE',
        'UNKNOWN'
    ]),
    profilePhoto: z.string().optional().nullable(),

    // Address Information
    address: z.string().min(1, 'กรุณากรอกที่อยู่').max(255),
    subDistrict: z.string().min(1, 'กรุณากรอกตำบล/แขวง').max(100),
    district: z.string().min(1, 'กรุณากรอกอำเภอ/เขต').max(100),
    province: z.string()
        .min(1, 'กรุณาเลือกจังหวัด')
        .refine((val) => PROVINCE_NAMES_TH.includes(val), {
            message: 'จังหวัดไม่ถูกต้อง',
        }),
    postalCode: z.string()
        .min(5, 'รหัสไปรษณีย์ต้องมี 5 หลัก')
        .max(5, 'รหัสไปรษณีย์ต้องมี 5 หลัก')
        .regex(/^\d+$/, 'รหัสไปรษณีย์ต้องเป็นตัวเลขเท่านั้น'),

    // Contact Information
    phoneNumber: z.string().max(255).optional().nullable(),
    email: z.string().email('รูปแบบอีเมลไม่ถูกต้อง').optional().nullable().or(z.literal('')),

    // Emergency Contact
    emergencyContactName: z.string().min(1, 'กรุณากรอกชื่อผู้ติดต่อฉุกเฉิน').max(100),
    emergencyContactPhone: z.string().min(9, 'เบอร์โทรศัพท์ไม่ถูกต้อง').max(255),
    emergencyContactRelation: z.string().min(1, 'กรุณากรอกความสัมพันธ์').max(50),

    // Health Information
    chronicDiseases: z.string().optional().nullable(),
    allergies: z.string().optional().nullable(),
    currentMedications: z.string().optional().nullable(),
    specialDietaryNeeds: z.string().optional().nullable(),

    // Care Status
    mobilityStatus: z.enum(['INDEPENDENT', 'NEEDS_ASSISTANCE', 'WHEELCHAIR', 'BEDRIDDEN']),
    careLevel: z.enum(['LEVEL_1', 'LEVEL_2', 'LEVEL_3', 'LEVEL_4']),
    primaryCaregiverId: z.string().optional().nullable(),

    // System Fields
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
