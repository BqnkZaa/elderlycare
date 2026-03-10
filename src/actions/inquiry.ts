"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { PublicAdmissionInput } from "@/lib/validations";

export async function createInquiry(data: PublicAdmissionInput) {
    try {
        // Basic validation is handled by Zod on client, but good to be safe
        if (!data.phone) {
            return { success: false, error: "กรุณากรอกเบอร์โทรศัพท์" };
        }

        // Create inquiry with comprehensive data
        const inquiry = await prisma.inquiry.create({
            data: {
                // Contact Info
                name: data.name,
                phone: data.phone,
                lineId: data.lineId,

                // Section 1: Identification
                firstName: data.firstName,
                lastName: data.lastName,
                nickname: data.nickname,
                age: data.age,
                gender: data.gender,
                preferredPronouns: data.preferredPronouns,
                education: data.education,
                proudFormerOccupation: data.proudFormerOccupation,
                dateOfBirth: data.dateOfBirth,

                // Section 2: Marital
                maritalStatus: data.maritalStatus,
                keyCoordinatorName: data.keyCoordinatorName,
                keyCoordinatorPhone: data.keyCoordinatorPhone,
                keyCoordinatorRelation: data.keyCoordinatorRelation,
                legalGuardianName: data.legalGuardianName,
                legalGuardianPhone: data.legalGuardianPhone,
                legalGuardianRelation: data.legalGuardianRelation,

                // Section 3: Sensory
                hearingStatus: data.hearingStatus,
                visionStatus: data.visionStatus,
                speechStatus: data.speechStatus,

                // Section 4: Mobility
                historyOfFalls: data.historyOfFalls,
                fallsTimeframe: data.fallsTimeframe,
                fallsCause: data.fallsCause,
                gaitStatus: data.gaitStatus,
                assistiveDevices: data.assistiveDevices, // JSON string or text

                // Section 5: Elimination
                bladderControl: data.bladderControl,
                foleySize: data.foleySize,
                bowelControl: data.bowelControl,
                diaperType: data.diaperType,
                diaperSize: data.diaperSize,

                // Section 6: Cognitive
                hasConfusion: data.hasConfusion,
                confusionTimeframe: data.confusionTimeframe,
                memoryStatus: data.memoryStatus, // JSON/Text
                behaviorStatus: data.behaviorStatus, // JSON/Text

                // Section 7: Chief Complaint
                reasonForAdmission: data.reasonForAdmission,
                initialMentalState: data.initialMentalState,

                // Section 8: Medical History
                underlyingDiseases: data.underlyingDiseases,
                currentMedications: data.currentMedications,
                surgicalHistory: data.surgicalHistory,

                // Section 9: Allergies
                hasDrugAllergies: data.hasDrugAllergies,
                drugAllergiesDetail: data.drugAllergiesDetail,
                hasFoodChemicalAllergies: data.hasFoodChemicalAllergies,
                foodChemicalAllergiesDetail: data.foodChemicalAllergiesDetail,

                // Section 10: Physical
                skinCondition: data.skinCondition,
                hasPressureUlcer: data.hasPressureUlcer,
                pressureUlcerLocation: data.pressureUlcerLocation,
                pressureUlcerStage: data.pressureUlcerStage,
                medicalDevices: data.medicalDevices,

                // Section 11: Social
                primaryCaregiverName: data.primaryCaregiverName,
                primaryCaregiverRelation: data.primaryCaregiverRelation,
                healthPrivilege: data.healthPrivilege,
                sponsor: data.sponsor,

                // Section 12: Religion
                religion: data.religion,
                spiritualNeeds: data.spiritualNeeds,
                religiousRestrictions: data.religiousRestrictions,

                // Section 13: Goals
                goalOfCare: data.goalOfCare,
                expectationDetails: data.expectationDetails,

                // Section 14: Environment
                homeType: data.homeType as any, // Cast if enum mismatch or ensure enum matches
                bedroomLocation: data.bedroomLocation,
                familyGenogram: data.familyGenogram,

                // ==========================================
                // PART 3: OCM/ADL & Medical Complexity
                // ==========================================

                // ADL (Part 1)
                adlEating: data.adlEating as any,
                adlGrooming: data.adlGrooming as any,
                adlBathing: data.adlBathing as any,
                adlDressing: data.adlDressing as any,
                adlBowel: data.adlBowel as any,
                adlBladder: data.adlBladder as any,
                adlToilet: data.adlToilet as any,
                adlTransfer: data.adlTransfer as any,
                adlMobility: data.adlMobility as any,
                adlStairs: data.adlStairs as any,

                // Medical Complexity (Part 2)
                hasNgt: data.hasNgt,
                hasPeg: data.hasPeg,
                hasFoleyCatheter: data.hasFoleyCatheter,
                hasColostomy: data.hasColostomy,
                oxygenCannulaLiters: data.oxygenCannulaLiters,
                oxygenMaskLiters: data.oxygenMaskLiters,
                ventilatorMode: data.ventilatorMode,
                needSuction: data.needSuction,

                woundsNone: data.woundsNone,
                bedsoreStage1Location: data.bedsoreStage1Location,
                bedsoreStage2Location: data.bedsoreStage2Location,
                bedsoreStage3Location: data.bedsoreStage3Location,
                bedsoreStage4Location: data.bedsoreStage4Location,
                diabeticWoundLocation: data.diabeticWoundLocation,
                surgicalWoundLocation: data.surgicalWoundLocation,

                hasCapd: data.hasCapd,
                hasHd: data.hasHd,
                hasIvSupport: data.hasIvSupport,
                requireBloodSugarCheck: data.requireBloodSugarCheck,

                // Cognitive & Behavioral (Part 3)
                cognitiveStatus: data.cognitiveStatus as any,
                aggressiveStatus: data.aggressiveStatus as any,
                noisyConfusionTimeframe: data.noisyConfusionTimeframe,
                talksToSelfQuietly: data.talksToSelfQuietly,
                psychiatricWithMeds: data.psychiatricWithMeds,
                psychiatricNoMeds: data.psychiatricNoMeds,

                // Safety Risks (Part 4)
                fallHistoryLevel: data.fallHistoryLevel as any,
                bradenScale: data.bradenScale as any,
                infectionNone: data.infectionNone,
                infectionDetails: data.infectionDetails,
                frailtyScore: data.frailtyScore as any,

                // Hospital & Medications (Part 5)
                recentDischargeDate: data.recentDischargeDate,
                recentHospital: data.recentHospital,
                recentAdmissionReason: data.recentAdmissionReason,
                nextAppointmentDate: data.nextAppointmentDate,

                polypharmacy: data.polypharmacy as any,
                highAlertAnticoagulant: data.highAlertAnticoagulant,
                highAlertDiabetic: data.highAlertDiabetic,
                highAlertPsychiatric: data.highAlertPsychiatric,

                status: "PENDING",
            },
        });

        // Revalidate landing page
        revalidatePath("/");

        return { success: true, inquiry };
    } catch (error) {
        console.error("Error creating inquiry:", error);
        return { success: false, error: "เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง" };
    }
}
