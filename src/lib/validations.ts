
import { z } from "zod";

export const elderlyProfileSchema = z.object({
    // Header
    admissionDate: z.coerce.date(),
    admissionTime: z.string().min(1, "Required"),
    safeId: z.string().min(1, "Required"),
    partnerId: z.string().optional(),

    // 1. Identification
    firstName: z.string().min(1, "Required"),
    lastName: z.string().min(1, "Required"),
    nickname: z.string().optional(),
    age: z.coerce.number().min(1, "Required"),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]),
    preferredPronouns: z.string().optional(),
    education: z.string().optional(),
    proudFormerOccupation: z.string().optional(),
    dateOfBirth: z.union([z.string(), z.date()]).optional().transform((val) => {
        if (!val) return undefined;
        if (typeof val === 'string') return val === '' ? undefined : new Date(val);
        return val;
    }), // Handle both string (from form) and Date (from internal/transformed data)

    // 2. Marital & Status
    maritalStatus: z.enum(["SINGLE", "MARRIED", "WIDOWED", "DIVORCED_SEPARATED"]),
    keyCoordinatorName: z.string().optional(),
    keyCoordinatorPhone: z.string().optional(),
    keyCoordinatorRelation: z.string().optional(),
    legalGuardianName: z.string().optional(),
    legalGuardianPhone: z.string().optional(),
    legalGuardianRelation: z.string().optional(),

    // 3. Sensory
    hearingStatus: z.enum(["NORMAL", "HARD_OF_HEARING_LEFT", "HARD_OF_HEARING_RIGHT", "HARD_OF_HEARING_BOTH", "DEAF", "HEARING_AID"]),
    visionStatus: z.enum(["NORMAL", "NEARSIGHTED_FARSIGHTED", "CATARACT_GLAUCOMA", "GLASSES", "CONTACT_LENS"]),
    speechStatus: z.enum(["CLEAR", "DYSARTHRIA", "APHASIA", "NON_VERBAL"]),

    // 4. Mobility
    historyOfFalls: z.boolean().default(false),
    fallsTimeframe: z.string().optional(),
    fallsCause: z.string().optional(),
    gaitStatus: z.enum(["INDEPENDENT", "UNSTEADY", "NEEDS_SUPPORT", "NON_AMBULATORY_BEDRIDDEN"]),
    assistiveDevices: z.string().optional(),

    // 5. Elimination
    bladderControl: z.enum(["CONTINENT", "OCCASIONAL_INCONTINENCE", "TOTAL_INCONTINENCE_FOLEY"]),
    foleySize: z.string().optional(),
    bowelControl: z.enum(["NORMAL", "CONSTIPATION", "DIARRHEA", "INCONTINENCE"]),
    diaperType: z.enum(["NONE", "TAPE", "PANTS"]),
    diaperSize: z.string().optional(),

    // 6. Cognitive
    hasConfusion: z.boolean().default(false),
    confusionTimeframe: z.string().optional(),
    memoryStatus: z.string().optional(),
    behaviorStatus: z.string().optional(),

    // 7. Chief Complaint
    reasonForAdmission: z.string().optional(),
    initialMentalState: z.string().optional(),

    // 8. Medical History
    underlyingDiseases: z.string().optional(),
    currentMedications: z.string().optional(),
    surgicalHistory: z.string().optional(),

    // 9. Allergies
    hasDrugAllergies: z.boolean().default(false),
    drugAllergiesDetail: z.string().optional(),
    hasFoodChemicalAllergies: z.boolean().default(false),
    foodChemicalAllergiesDetail: z.string().optional(),

    // 10. Physical
    skinCondition: z.string().optional(),
    hasPressureUlcer: z.boolean().default(false),
    pressureUlcerLocation: z.string().optional(),
    pressureUlcerStage: z.string().optional(),
    medicalDevices: z.string().optional(),

    // 11. Social
    primaryCaregiverName: z.string().optional(),
    primaryCaregiverRelation: z.string().optional(),
    healthPrivilege: z.enum(["SELF_PAY", "SOCIAL_SECURITY", "GOLD_CARD", "GOVERNMENT_OFFICER"]),
    sponsor: z.string().optional(),

    // 12. Religion
    religion: z.string().optional(),
    spiritualNeeds: z.string().optional(),
    religiousRestrictions: z.string().optional(),

    // 13. Goals
    goalOfCare: z.enum(["REHABILITATION", "LONG_TERM_CARE", "PALLIATIVE"]),
    expectationDetails: z.string().optional(),
    careLevel: z.string().default("LEVEL_1"), // Default from form

    // 14. Environment
    homeType: z.enum(["SINGLE_HOUSE", "TOWNHOUSE"]).optional().or(z.literal("")),
    bedroomLocation: z.string().optional(),
    familyGenogram: z.string().optional(),

    // Address (Optional)
    address: z.string().optional(),
    province: z.string().optional(),
    district: z.string().optional(),
    subDistrict: z.string().optional(),
    postalCode: z.string().optional(),

    // System
    isActive: z.boolean().default(true),
    bloodType: z.enum(["A_POSITIVE", "A_NEGATIVE", "B_POSITIVE", "B_NEGATIVE", "O_POSITIVE", "O_NEGATIVE", "AB_POSITIVE", "AB_NEGATIVE", "UNKNOWN"]).optional(),
    mobilityStatus: z.enum(["INDEPENDENT", "NEEDS_ASSISTANCE", "WHEELCHAIR", "BEDRIDDEN"]).optional(),
});

export type ElderlyProfileInput = z.infer<typeof elderlyProfileSchema>;

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const userSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["ADMIN", "STAFF"]).default("STAFF"),
});

export type UserInput = z.infer<typeof userSchema>;


export const dailyLogSchema = z.object({
    elderlyId: z.string().min(1, "Elderly ID is required"),
    date: z.coerce.date(),

    // Vitals (JSON)
    vitals: z.object({
        temperature: z.coerce.number().optional(),
        bloodPressureSystolic: z.coerce.number().optional(),
        bloodPressureDiastolic: z.coerce.number().optional(),
        heartRate: z.coerce.number().optional(),
        respiratoryRate: z.coerce.number().optional(),
        oxygenSaturation: z.coerce.number().optional(),
        weight: z.coerce.number().optional(),
    }).optional(),

    // Activity & Status
    activityNote: z.string().optional(),
    mood: z.enum(["HAPPY", "CONTENT", "NEUTRAL", "SAD", "ANXIOUS", "IRRITABLE"]).default("NEUTRAL"),
    mealIntake: z.enum(["FULL", "PARTIAL", "MINIMAL", "NONE"]).default("FULL"),
    sleepQuality: z.enum(["EXCELLENT", "GOOD", "FAIR", "POOR", "VERY_POOR"]).default("GOOD"),
    sleepHours: z.coerce.number().optional(),

    // Medication
    medicationsTaken: z.boolean().default(true),
    medicationNotes: z.string().optional(),

    // Observations
    physicalCondition: z.string().optional(),
    behavioralNotes: z.string().optional(),
    incidentsReported: z.string().optional(),

    recordedBy: z.string().min(1, "Recorder ID is required"),
    recordedByName: z.string().optional(),
});

export type DailyLogInput = z.infer<typeof dailyLogSchema>;

export const dailyLogFilterSchema = z.object({
    elderlyId: z.string().optional(),
    date: z.coerce.date().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    page: z.number().optional(),
    pageSize: z.number().optional(),
});

export type DailyLogFilter = z.infer<typeof dailyLogFilterSchema>;
