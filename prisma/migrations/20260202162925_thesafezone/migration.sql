-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'STAFF');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "BloodType" AS ENUM ('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "MobilityStatus" AS ENUM ('INDEPENDENT', 'NEEDS_ASSISTANCE', 'WHEELCHAIR', 'BEDRIDDEN');

-- CreateEnum
CREATE TYPE "CareLevel" AS ENUM ('LEVEL_1', 'LEVEL_2', 'LEVEL_3', 'LEVEL_4');

-- CreateEnum
CREATE TYPE "Mood" AS ENUM ('HAPPY', 'CONTENT', 'NEUTRAL', 'SAD', 'ANXIOUS', 'IRRITABLE');

-- CreateEnum
CREATE TYPE "MealIntake" AS ENUM ('FULL', 'PARTIAL', 'MINIMAL', 'NONE');

-- CreateEnum
CREATE TYPE "SleepQuality" AS ENUM ('EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'VERY_POOR');

-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('SINGLE', 'MARRIED', 'WIDOWED', 'DIVORCED_SEPARATED');

-- CreateEnum
CREATE TYPE "HearingStatus" AS ENUM ('NORMAL', 'HARD_OF_HEARING_LEFT', 'HARD_OF_HEARING_RIGHT', 'HARD_OF_HEARING_BOTH', 'DEAF', 'HEARING_AID');

-- CreateEnum
CREATE TYPE "VisionStatus" AS ENUM ('NORMAL', 'NEARSIGHTED_FARSIGHTED', 'CATARACT_GLAUCOMA', 'GLASSES', 'CONTACT_LENS');

-- CreateEnum
CREATE TYPE "SpeechStatus" AS ENUM ('CLEAR', 'DYSARTHRIA', 'APHASIA', 'NON_VERBAL');

-- CreateEnum
CREATE TYPE "GaitStatus" AS ENUM ('INDEPENDENT', 'UNSTEADY', 'NEEDS_SUPPORT', 'NON_AMBULATORY_BEDRIDDEN');

-- CreateEnum
CREATE TYPE "BladderControl" AS ENUM ('CONTINENT', 'OCCASIONAL_INCONTINENCE', 'TOTAL_INCONTINENCE_FOLEY');

-- CreateEnum
CREATE TYPE "BowelControl" AS ENUM ('NORMAL', 'CONSTIPATION', 'DIARRHEA', 'INCONTINENCE');

-- CreateEnum
CREATE TYPE "DiaperType" AS ENUM ('NONE', 'TAPE', 'PANTS');

-- CreateEnum
CREATE TYPE "HealthPrivilege" AS ENUM ('SELF_PAY', 'SOCIAL_SECURITY', 'GOLD_CARD', 'GOVERNMENT_OFFICER');

-- CreateEnum
CREATE TYPE "GoalOfCare" AS ENUM ('REHABILITATION', 'LONG_TERM_CARE', 'PALLIATIVE');

-- CreateEnum
CREATE TYPE "HomeType" AS ENUM ('SINGLE_HOUSE', 'TOWNHOUSE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STAFF',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "elderly_profiles" (
    "id" TEXT NOT NULL,
    "admissionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "admissionTime" VARCHAR(10),
    "safeId" VARCHAR(20),
    "partnerId" VARCHAR(20),
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "nickname" VARCHAR(50),
    "age" INTEGER,
    "gender" "Gender" NOT NULL,
    "preferredPronouns" VARCHAR(100),
    "education" VARCHAR(100),
    "proudFormerOccupation" VARCHAR(200),
    "dateOfBirth" TIMESTAMP(3),
    "maritalStatus" "MaritalStatus" NOT NULL DEFAULT 'SINGLE',
    "keyCoordinatorName" VARCHAR(100),
    "keyCoordinatorPhone" VARCHAR(255),
    "keyCoordinatorRelation" VARCHAR(100),
    "legalGuardianName" VARCHAR(100),
    "legalGuardianPhone" VARCHAR(255),
    "legalGuardianRelation" VARCHAR(100),
    "hearingStatus" "HearingStatus" NOT NULL DEFAULT 'NORMAL',
    "visionStatus" "VisionStatus" NOT NULL DEFAULT 'NORMAL',
    "speechStatus" "SpeechStatus" NOT NULL DEFAULT 'CLEAR',
    "historyOfFalls" BOOLEAN NOT NULL DEFAULT false,
    "fallsTimeframe" VARCHAR(50),
    "fallsCause" TEXT,
    "gaitStatus" "GaitStatus" NOT NULL DEFAULT 'INDEPENDENT',
    "assistiveDevices" TEXT,
    "mobilityStatus" "MobilityStatus" NOT NULL DEFAULT 'INDEPENDENT',
    "bladderControl" "BladderControl" NOT NULL DEFAULT 'CONTINENT',
    "foleySize" VARCHAR(10),
    "bowelControl" "BowelControl" NOT NULL DEFAULT 'NORMAL',
    "diaperType" "DiaperType" NOT NULL DEFAULT 'NONE',
    "diaperSize" VARCHAR(10),
    "hasConfusion" BOOLEAN NOT NULL DEFAULT false,
    "confusionTimeframe" TEXT,
    "memoryStatus" TEXT,
    "behaviorStatus" TEXT,
    "reasonForAdmission" TEXT,
    "initialMentalState" TEXT,
    "underlyingDiseases" TEXT,
    "currentMedications" TEXT,
    "surgicalHistory" TEXT,
    "hasDrugAllergies" BOOLEAN NOT NULL DEFAULT false,
    "drugAllergiesDetail" TEXT,
    "hasFoodChemicalAllergies" BOOLEAN NOT NULL DEFAULT false,
    "foodChemicalAllergiesDetail" TEXT,
    "allergies" TEXT,
    "skinCondition" TEXT,
    "hasPressureUlcer" BOOLEAN NOT NULL DEFAULT false,
    "pressureUlcerLocation" VARCHAR(100),
    "pressureUlcerStage" VARCHAR(10),
    "medicalDevices" TEXT,
    "primaryCaregiverName" VARCHAR(100),
    "primaryCaregiverRelation" VARCHAR(100),
    "primaryCaregiverId" VARCHAR(100),
    "healthPrivilege" "HealthPrivilege" NOT NULL DEFAULT 'SELF_PAY',
    "sponsor" VARCHAR(200),
    "religion" VARCHAR(100),
    "religiousRestrictions" TEXT,
    "spiritualNeeds" TEXT,
    "goalOfCare" "GoalOfCare" NOT NULL DEFAULT 'LONG_TERM_CARE',
    "expectationDetails" TEXT,
    "careLevel" "CareLevel" NOT NULL DEFAULT 'LEVEL_1',
    "homeType" "HomeType",
    "bedroomLocation" VARCHAR(50),
    "familyGenogram" TEXT,
    "address" VARCHAR(255),
    "subDistrict" VARCHAR(100),
    "district" VARCHAR(100),
    "province" VARCHAR(100),
    "postalCode" VARCHAR(10),
    "nationalId" VARCHAR(255),
    "phoneNumber" VARCHAR(255),
    "email" VARCHAR(255),
    "emergencyContactName" VARCHAR(100),
    "emergencyContactPhone" VARCHAR(255),
    "emergencyContactRelation" VARCHAR(50),
    "bloodType" "BloodType" NOT NULL DEFAULT 'UNKNOWN',
    "profilePhoto" TEXT,
    "specialDietaryNeeds" TEXT,
    "registrationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assessorSignature" VARCHAR(100),
    "assessmentDate" TIMESTAMP(3),
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "elderly_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_logs" (
    "id" TEXT NOT NULL,
    "elderlyId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "vitals" JSONB,
    "activityNote" TEXT,
    "mood" "Mood" NOT NULL DEFAULT 'NEUTRAL',
    "mealIntake" "MealIntake" NOT NULL DEFAULT 'FULL',
    "sleepQuality" "SleepQuality" NOT NULL DEFAULT 'GOOD',
    "sleepHours" DOUBLE PRECISION,
    "medicationsTaken" BOOLEAN NOT NULL DEFAULT true,
    "medicationNotes" TEXT,
    "physicalCondition" TEXT,
    "behavioralNotes" TEXT,
    "incidentsReported" TEXT,
    "recordedBy" VARCHAR(100) NOT NULL,
    "recordedByName" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alert_logs" (
    "id" TEXT NOT NULL,
    "alertType" VARCHAR(50) NOT NULL,
    "elderlyId" TEXT NOT NULL,
    "elderlyName" VARCHAR(200) NOT NULL,
    "recipientType" VARCHAR(50) NOT NULL,
    "recipientContact" VARCHAR(255),
    "message" TEXT NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alert_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "elderly_profiles_safeId_key" ON "elderly_profiles"("safeId");

-- CreateIndex
CREATE UNIQUE INDEX "elderly_profiles_nationalId_key" ON "elderly_profiles"("nationalId");

-- CreateIndex
CREATE INDEX "elderly_profiles_province_idx" ON "elderly_profiles"("province");

-- CreateIndex
CREATE INDEX "elderly_profiles_safeId_idx" ON "elderly_profiles"("safeId");

-- CreateIndex
CREATE INDEX "elderly_profiles_registrationDate_idx" ON "elderly_profiles"("registrationDate");

-- CreateIndex
CREATE INDEX "elderly_profiles_isActive_idx" ON "elderly_profiles"("isActive");

-- CreateIndex
CREATE INDEX "daily_logs_elderlyId_date_idx" ON "daily_logs"("elderlyId", "date");

-- CreateIndex
CREATE INDEX "daily_logs_date_idx" ON "daily_logs"("date");

-- CreateIndex
CREATE INDEX "alert_logs_alertType_createdAt_idx" ON "alert_logs"("alertType", "createdAt");

-- CreateIndex
CREATE INDEX "alert_logs_elderlyId_idx" ON "alert_logs"("elderlyId");

-- AddForeignKey
ALTER TABLE "daily_logs" ADD CONSTRAINT "daily_logs_elderlyId_fkey" FOREIGN KEY ("elderlyId") REFERENCES "elderly_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
