
import { z } from "zod";

export const elderlyProfileSchema = z.object({
    // Header
    admissionDate: z.preprocess((val) => {
        if (!val) return undefined;
        if (typeof val === 'string') return new Date(val);
        return val;
    }, z.date({
        message: "กรุณาระบุวันที่ให้ถูกต้อง"
    })),
    admissionTime: z.string().min(1, "กรุณาระบุเวลา"),
    safeId: z.string().min(1, "กรุณาระบุรหัสผู้ป่วย"),
    partnerId: z.string().optional(),

    // 1. Identification
    firstName: z.string().min(1, "กรุณาระบุชื่อ"),
    lastName: z.string().min(1, "กรุณาระบุนามสกุล"),
    nickname: z.string().optional(),
    age: z.coerce.number().min(1, "กรุณาระบุอายุ"),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]),
    preferredPronouns: z.string().optional(),
    education: z.string().optional(),
    proudFormerOccupation: z.string().optional(),
    dateOfBirth: z.union([z.string(), z.date()]).optional().transform((val) => {
        if (!val) return undefined;
        if (typeof val === 'string') return val === '' ? undefined : new Date(val);
        return val;
    }), // Handle both string (from form) and Date (from internal/transformed data)
    genderOther: z.string().optional(),
    childrenCount: z.enum(["NONE", "ONE", "TWO", "THREE", "FOUR", "FIVE_OR_MORE"]).default("NONE"),
    formerOccupation: z.enum(["COMMERCE", "SERVICE", "OTHER"]).default("OTHER"),
    formerOccupationOther: z.string().optional(),

    // 2. Marital & Status
    maritalStatus: z.enum(["SINGLE", "MARRIED", "WIDOWED", "DIVORCED_SEPARATED", "PARTNERED"]),
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
    selfHelpStatus: z.enum(["INDEPENDENT_NON_BEDRIDDEN", "INDEPENDENT_BEDRIDDEN", "DEPENDENT_BEDRIDDEN"]).default("INDEPENDENT_NON_BEDRIDDEN"),

    // 5. Elimination
    bladderControl: z.enum(["CONTINENT", "OCCASIONAL_INCONTINENCE", "TOTAL_INCONTINENCE_FOLEY"]),
    foleySize: z.string().optional(),
    bowelControl: z.enum(["NORMAL", "CONSTIPATION", "DIARRHEA", "INCONTINENCE"]),
    diaperType: z.enum(["NONE", "TAPE", "PANTS"]),
    diaperSize: z.string().optional(),
    eatingStatus: z.enum(["EAT_NORMAL", "EAT_SOFT", "NEEDS_FEEDING", "TUBE_FEEDING"]).default("EAT_NORMAL"),

    // 6. Cognitive
    hasConfusion: z.boolean().default(false),
    confusionTimeframe: z.string().optional(),
    memoryStatus: z.string().optional(),
    behaviorStatus: z.string().optional(),
    psychiatricStatus: z.enum(["NONE", "SYMPTOMS_NO_MEDS", "SYMPTOMS_WITH_MEDS"]).default("NONE"),
    hasAggressiveBehavior: z.boolean().default(false),
    hasPsychiatricMedication: z.boolean().default(false),
    hasSpecialMedication: z.boolean().default(false),
    specialMedicationDetail: z.string().optional(),

    // 7. Chief Complaint
    reasonForAdmission: z.string().optional(),
    initialMentalState: z.string().optional(),
    currentLocation: z.enum(["HOME", "HOSPITAL", "CARE_CENTER"]).default("HOME"),
    initialSymptoms: z.string().optional(),

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
    bedsoreStatus: z.enum(["NONE", "ONE", "TWO", "MORE_THAN_THREE"]).default("NONE"),
    useAirMattress: z.boolean().default(false),
    oxygenSupport: z.enum(["NONE", "LITERS_5", "LITERS_10", "TEMPORARY_CYLINDER"]).default("NONE"),
    useVentilator: z.boolean().default(false),
    hasTracheostomy: z.boolean().default(false),
    medicalDevices: z.string().optional(),

    // 11. Social
    primaryCaregiverName: z.string().optional(),
    primaryCaregiverRelation: z.string().optional(),
    healthPrivilege: z.enum(["SELF_PAY", "SOCIAL_SECURITY", "GOLD_CARD", "GOVERNMENT_OFFICER", "INSURANCE", "OTHER"]),
    sponsor: z.string().optional(),
    hasLifeInsurance: z.boolean().default(false),
    hospitalAffiliation: z.string().optional(),

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

    // ==========================================
    // PART 3: ADL & Medical Complexity
    // ==========================================

    // ADL (Part 1)
    adlEating: z.enum(["CANNOT_EAT", "TUBE_FED", "NEEDS_HELP", "INDEPENDENT"]).optional().nullable(),
    adlGrooming: z.enum(["NEEDS_HELP", "INDEPENDENT"]).optional().nullable(),
    adlBathing: z.enum(["NEEDS_HELP", "INDEPENDENT"]).optional().nullable(),
    adlDressing: z.enum(["CANNOT_DRESS", "NEEDS_HELP", "INDEPENDENT"]).optional().nullable(),
    adlBowel: z.enum(["INCONTINENT", "ENEMA", "OCCASIONAL_INCONTINENCE", "CONTINENT"]).optional().nullable(),
    adlBladder: z.enum(["INCONTINENT", "CATHETER", "OCCASIONAL_INCONTINENCE", "CONTINENT"]).optional().nullable(),
    adlToilet: z.enum(["CANNOT_USE", "NEEDS_HELP", "INDEPENDENT"]).optional().nullable(),
    adlTransfer: z.enum(["CANNOT_TRANSFER", "NEEDS_HELP_SITTING", "NEEDS_HELP", "INDEPENDENT"]).optional().nullable(),
    adlMobility: z.enum(["IMMOBILE", "WHEELCHAIR_INDEPENDENT", "NEEDS_HELP_WALKING", "INDEPENDENT"]).optional().nullable(),
    adlStairs: z.enum(["CANNOT_CLIMB", "NEEDS_HELP", "INDEPENDENT"]).optional().nullable(),

    // Medical Complexity (Part 2)
    hasNgt: z.boolean().default(false),
    hasPeg: z.boolean().default(false),
    hasFoleyCatheter: z.boolean().default(false),
    hasColostomy: z.boolean().default(false),
    oxygenCannulaLiters: z.string().optional(),
    oxygenMaskLiters: z.string().optional(),
    ventilatorMode: z.string().optional(),
    needSuction: z.boolean().default(false),

    woundsNone: z.boolean().default(true),
    bedsoreStage1Location: z.string().optional(),
    bedsoreStage2Location: z.string().optional(),
    bedsoreStage3Location: z.string().optional(),
    bedsoreStage4Location: z.string().optional(),
    diabeticWoundLocation: z.string().optional(),
    surgicalWoundLocation: z.string().optional(),

    hasCapd: z.boolean().default(false),
    hasHd: z.boolean().default(false),
    hasIvSupport: z.boolean().default(false),
    requireBloodSugarCheck: z.boolean().default(false),

    // Cognitive & Behavioral (Part 3)
    cognitiveStatus: z.enum(["ALZHEIMERS_MOBILE_WANDERING", "ALZHEIMERS_IMMOBILE"]).optional().nullable(),
    aggressiveStatus: z.enum(["AGGRESSIVE_WITH_MEDS", "AGGRESSIVE_NO_MEDS"]).optional().nullable(),
    noisyConfusionTimeframe: z.string().optional(),
    talksToSelfQuietly: z.boolean().default(false),
    psychiatricWithMeds: z.boolean().default(false),
    psychiatricNoMeds: z.boolean().default(false),

    // Safety Risks (Part 4)
    fallHistoryLevel: z.enum(["NONE_IN_6_MONTHS", "ONCE_OR_TWICE", "FREQUENT_HIGH_RISK"]).optional().nullable(),
    bradenScale: z.enum(["LOW_TO_MODERATE_RISK", "HIGH_RISK"]).optional().nullable(),
    infectionNone: z.boolean().default(true),
    infectionDetails: z.string().optional(),
    frailtyScore: z.enum(["ROBUST", "PRE_FRAIL", "FRAIL"]).optional().nullable(),

    // Hospital & Medications (Part 5)
    recentDischargeDate: z.string().optional(),
    recentHospital: z.string().optional(),
    recentAdmissionReason: z.string().optional(),
    nextAppointmentDate: z.string().optional(),

    polypharmacy: z.enum(["LESS_THAN_5", "FIVE_OR_MORE"]).optional().nullable(),
    highAlertAnticoagulant: z.boolean().default(false),
    highAlertDiabetic: z.boolean().default(false),
    highAlertPsychiatric: z.boolean().default(false),

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
    role: z.enum(["ADMIN", "STAFF", "NURSE"]),
    status: z.enum(["APPROVED", "PENDING", "REJECTED"]).optional(),
});

export type UserInput = z.infer<typeof userSchema>;

export const publicAdmissionSchema = elderlyProfileSchema.omit({
    safeId: true,
    admissionDate: true,
    admissionTime: true,
    partnerId: true,
    // careLevel: true, // Keep as optional/default
    isActive: true,
}).extend({
    // Override/Add specific fields for public inquiry
    name: z.string().min(1, "Contact name is required"), // Contact person name
    phone: z.string().min(1, "Phone number is required"), // Contact person phone
    lineId: z.string().optional(),
    // Make these mandatory for public form if needed, or keep optional matching schema
});

export type PublicAdmissionInput = z.infer<typeof publicAdmissionSchema>;



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
    search: z.string().optional(),
    page: z.number().optional(),
    pageSize: z.number().optional(),
});

export type DailyLogFilter = z.infer<typeof dailyLogFilterSchema>;

export const partnerCenterSchema = z.object({
    pid: z.string().min(1, "กรุณาระบุรหัสศูนย์ (PID)"),
    name: z.string().min(1, "กรุณาระบุชื่อศูนย์"),
    contact: z.string().optional(),
    address: z.string().optional(),

    // Supported Patient Types
    supportIndependentNonBedridden: z.boolean().default(true),
    supportIndependentBedridden: z.boolean().default(false),
    supportDependentBedridden: z.boolean().default(false),

    supportNormalDiet: z.boolean().default(true),
    supportSoftDiet: z.boolean().default(true),
    supportNeedsFeeding: z.boolean().default(false),
    supportTubeFeeding: z.boolean().default(false),

    supportTracheostomy: z.boolean().default(false),
    supportBedsore: z.boolean().default(false),
    supportAirMattress: z.boolean().default(false),
    supportOxygen: z.boolean().default(false),
    supportVentilator: z.boolean().default(false),

    supportPsychiatric: z.boolean().default(false),
    supportAggressiveBehavior: z.boolean().default(false),
    supportPsychiatricMedication: z.boolean().default(false),

    isActive: z.boolean().default(true),
});

export type PartnerCenterInput = z.infer<typeof partnerCenterSchema>;
