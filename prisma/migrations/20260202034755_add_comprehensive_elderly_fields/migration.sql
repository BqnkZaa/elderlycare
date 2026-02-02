/*
  Warnings:

  - You are about to drop the column `chronicDiseases` on the `elderly_profiles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[safeId]` on the table `elderly_profiles` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `elderly_profiles_dateOfBirth_idx` ON `elderly_profiles`;

-- AlterTable
ALTER TABLE `elderly_profiles` DROP COLUMN `chronicDiseases`,
    ADD COLUMN `admissionDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `admissionTime` VARCHAR(10) NULL,
    ADD COLUMN `age` INTEGER NULL,
    ADD COLUMN `assessmentDate` DATETIME(3) NULL,
    ADD COLUMN `assessorSignature` VARCHAR(100) NULL,
    ADD COLUMN `assistiveDevices` TEXT NULL,
    ADD COLUMN `bedroomLocation` VARCHAR(50) NULL,
    ADD COLUMN `behaviorStatus` TEXT NULL,
    ADD COLUMN `bladderControl` ENUM('CONTINENT', 'OCCASIONAL_INCONTINENCE', 'TOTAL_INCONTINENCE_FOLEY') NOT NULL DEFAULT 'CONTINENT',
    ADD COLUMN `bowelControl` ENUM('NORMAL', 'CONSTIPATION', 'DIARRHEA', 'INCONTINENCE') NOT NULL DEFAULT 'NORMAL',
    ADD COLUMN `confusionTimeframe` TEXT NULL,
    ADD COLUMN `diaperSize` VARCHAR(10) NULL,
    ADD COLUMN `diaperType` ENUM('NONE', 'TAPE', 'PANTS') NOT NULL DEFAULT 'NONE',
    ADD COLUMN `drugAllergiesDetail` TEXT NULL,
    ADD COLUMN `education` VARCHAR(100) NULL,
    ADD COLUMN `expectationDetails` TEXT NULL,
    ADD COLUMN `fallsCause` TEXT NULL,
    ADD COLUMN `fallsTimeframe` VARCHAR(50) NULL,
    ADD COLUMN `familyGenogram` TEXT NULL,
    ADD COLUMN `foleySize` VARCHAR(10) NULL,
    ADD COLUMN `foodChemicalAllergiesDetail` TEXT NULL,
    ADD COLUMN `gaitStatus` ENUM('INDEPENDENT', 'UNSTEADY', 'NEEDS_SUPPORT', 'NON_AMBULATORY_BEDRIDDEN') NOT NULL DEFAULT 'INDEPENDENT',
    ADD COLUMN `goalOfCare` ENUM('REHABILITATION', 'LONG_TERM_CARE', 'PALLIATIVE') NOT NULL DEFAULT 'LONG_TERM_CARE',
    ADD COLUMN `hasConfusion` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `hasDrugAllergies` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `hasFoodChemicalAllergies` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `hasPressureUlcer` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `healthPrivilege` ENUM('SELF_PAY', 'SOCIAL_SECURITY', 'GOLD_CARD', 'GOVERNMENT_OFFICER') NOT NULL DEFAULT 'SELF_PAY',
    ADD COLUMN `hearingStatus` ENUM('NORMAL', 'HARD_OF_HEARING_LEFT', 'HARD_OF_HEARING_RIGHT', 'HARD_OF_HEARING_BOTH', 'DEAF', 'HEARING_AID') NOT NULL DEFAULT 'NORMAL',
    ADD COLUMN `historyOfFalls` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `homeType` ENUM('SINGLE_HOUSE', 'TOWNHOUSE') NULL,
    ADD COLUMN `initialMentalState` TEXT NULL,
    ADD COLUMN `keyCoordinatorName` VARCHAR(100) NULL,
    ADD COLUMN `keyCoordinatorPhone` VARCHAR(255) NULL,
    ADD COLUMN `keyCoordinatorRelation` VARCHAR(100) NULL,
    ADD COLUMN `legalGuardianName` VARCHAR(100) NULL,
    ADD COLUMN `legalGuardianPhone` VARCHAR(255) NULL,
    ADD COLUMN `legalGuardianRelation` VARCHAR(100) NULL,
    ADD COLUMN `maritalStatus` ENUM('SINGLE', 'MARRIED', 'WIDOWED', 'DIVORCED_SEPARATED') NOT NULL DEFAULT 'SINGLE',
    ADD COLUMN `medicalDevices` TEXT NULL,
    ADD COLUMN `memoryStatus` TEXT NULL,
    ADD COLUMN `partnerId` VARCHAR(20) NULL,
    ADD COLUMN `preferredPronouns` VARCHAR(100) NULL,
    ADD COLUMN `pressureUlcerLocation` VARCHAR(100) NULL,
    ADD COLUMN `pressureUlcerStage` VARCHAR(10) NULL,
    ADD COLUMN `primaryCaregiverName` VARCHAR(100) NULL,
    ADD COLUMN `primaryCaregiverRelation` VARCHAR(100) NULL,
    ADD COLUMN `proudFormerOccupation` VARCHAR(200) NULL,
    ADD COLUMN `reasonForAdmission` TEXT NULL,
    ADD COLUMN `religion` VARCHAR(100) NULL,
    ADD COLUMN `religiousRestrictions` TEXT NULL,
    ADD COLUMN `safeId` VARCHAR(20) NULL,
    ADD COLUMN `skinCondition` TEXT NULL,
    ADD COLUMN `speechStatus` ENUM('CLEAR', 'DYSARTHRIA', 'APHASIA', 'NON_VERBAL') NOT NULL DEFAULT 'CLEAR',
    ADD COLUMN `spiritualNeeds` TEXT NULL,
    ADD COLUMN `sponsor` VARCHAR(200) NULL,
    ADD COLUMN `surgicalHistory` TEXT NULL,
    ADD COLUMN `underlyingDiseases` TEXT NULL,
    ADD COLUMN `visionStatus` ENUM('NORMAL', 'NEARSIGHTED_FARSIGHTED', 'CATARACT_GLAUCOMA', 'GLASSES', 'CONTACT_LENS') NOT NULL DEFAULT 'NORMAL',
    MODIFY `nationalId` VARCHAR(255) NULL,
    MODIFY `dateOfBirth` DATETIME(3) NULL,
    MODIFY `address` VARCHAR(255) NULL,
    MODIFY `subDistrict` VARCHAR(100) NULL,
    MODIFY `district` VARCHAR(100) NULL,
    MODIFY `province` VARCHAR(100) NULL,
    MODIFY `postalCode` VARCHAR(10) NULL,
    MODIFY `emergencyContactName` VARCHAR(100) NULL,
    MODIFY `emergencyContactPhone` VARCHAR(255) NULL,
    MODIFY `emergencyContactRelation` VARCHAR(50) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `elderly_profiles_safeId_key` ON `elderly_profiles`(`safeId`);

-- CreateIndex
CREATE INDEX `elderly_profiles_safeId_idx` ON `elderly_profiles`(`safeId`);
