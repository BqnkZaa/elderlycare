-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'STAFF') NOT NULL DEFAULT 'STAFF',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `elderly_profiles` (
    `id` VARCHAR(191) NOT NULL,
    `nationalId` VARCHAR(255) NOT NULL,
    `firstName` VARCHAR(100) NOT NULL,
    `lastName` VARCHAR(100) NOT NULL,
    `nickname` VARCHAR(50) NULL,
    `dateOfBirth` DATETIME(3) NOT NULL,
    `gender` ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL,
    `bloodType` ENUM('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'UNKNOWN') NOT NULL DEFAULT 'UNKNOWN',
    `profilePhoto` TEXT NULL,
    `address` VARCHAR(255) NOT NULL,
    `subDistrict` VARCHAR(100) NOT NULL,
    `district` VARCHAR(100) NOT NULL,
    `province` VARCHAR(100) NOT NULL,
    `postalCode` VARCHAR(10) NOT NULL,
    `phoneNumber` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `emergencyContactName` VARCHAR(100) NOT NULL,
    `emergencyContactPhone` VARCHAR(255) NOT NULL,
    `emergencyContactRelation` VARCHAR(50) NOT NULL,
    `chronicDiseases` TEXT NULL,
    `allergies` TEXT NULL,
    `currentMedications` TEXT NULL,
    `specialDietaryNeeds` TEXT NULL,
    `mobilityStatus` ENUM('INDEPENDENT', 'NEEDS_ASSISTANCE', 'WHEELCHAIR', 'BEDRIDDEN') NOT NULL DEFAULT 'INDEPENDENT',
    `careLevel` ENUM('LEVEL_1', 'LEVEL_2', 'LEVEL_3', 'LEVEL_4') NOT NULL DEFAULT 'LEVEL_1',
    `primaryCaregiverId` VARCHAR(100) NULL,
    `registrationDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `notes` TEXT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `elderly_profiles_nationalId_key`(`nationalId`),
    INDEX `elderly_profiles_province_idx`(`province`),
    INDEX `elderly_profiles_dateOfBirth_idx`(`dateOfBirth`),
    INDEX `elderly_profiles_registrationDate_idx`(`registrationDate`),
    INDEX `elderly_profiles_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `daily_logs` (
    `id` VARCHAR(191) NOT NULL,
    `elderlyId` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `vitals` JSON NULL,
    `activityNote` TEXT NULL,
    `mood` ENUM('HAPPY', 'CONTENT', 'NEUTRAL', 'SAD', 'ANXIOUS', 'IRRITABLE') NOT NULL DEFAULT 'NEUTRAL',
    `mealIntake` ENUM('FULL', 'PARTIAL', 'MINIMAL', 'NONE') NOT NULL DEFAULT 'FULL',
    `sleepQuality` ENUM('EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'VERY_POOR') NOT NULL DEFAULT 'GOOD',
    `sleepHours` DOUBLE NULL,
    `medicationsTaken` BOOLEAN NOT NULL DEFAULT true,
    `medicationNotes` TEXT NULL,
    `physicalCondition` TEXT NULL,
    `behavioralNotes` TEXT NULL,
    `incidentsReported` TEXT NULL,
    `recordedBy` VARCHAR(100) NOT NULL,
    `recordedByName` VARCHAR(100) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `daily_logs_elderlyId_date_idx`(`elderlyId`, `date`),
    INDEX `daily_logs_date_idx`(`date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `alert_logs` (
    `id` VARCHAR(191) NOT NULL,
    `alertType` VARCHAR(50) NOT NULL,
    `elderlyId` VARCHAR(191) NOT NULL,
    `elderlyName` VARCHAR(200) NOT NULL,
    `recipientType` VARCHAR(50) NOT NULL,
    `recipientContact` VARCHAR(255) NULL,
    `message` TEXT NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    `sentAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `alert_logs_alertType_createdAt_idx`(`alertType`, `createdAt`),
    INDEX `alert_logs_elderlyId_idx`(`elderlyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `daily_logs` ADD CONSTRAINT `daily_logs_elderlyId_fkey` FOREIGN KEY (`elderlyId`) REFERENCES `elderly_profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
