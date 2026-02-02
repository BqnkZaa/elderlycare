-- CreateTable
CREATE TABLE "appointments" (
    "id" TEXT NOT NULL,
    "elderlyId" TEXT NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "location" VARCHAR(200),
    "doctorName" VARCHAR(100),
    "date" TIMESTAMP(3) NOT NULL,
    "time" VARCHAR(10),
    "notes" TEXT,
    "remindDaysBefore" INTEGER NOT NULL DEFAULT 1,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scheduled_activities" (
    "id" TEXT NOT NULL,
    "elderlyId" TEXT NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "recurrence" VARCHAR(20) NOT NULL DEFAULT 'DAILY',
    "dayOfWeek" INTEGER,
    "dayOfMonth" INTEGER,
    "time" VARCHAR(10),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scheduled_activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "appointments_elderlyId_idx" ON "appointments"("elderlyId");

-- CreateIndex
CREATE INDEX "appointments_date_idx" ON "appointments"("date");

-- CreateIndex
CREATE INDEX "scheduled_activities_elderlyId_idx" ON "scheduled_activities"("elderlyId");

-- CreateIndex
CREATE INDEX "scheduled_activities_recurrence_idx" ON "scheduled_activities"("recurrence");

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_elderlyId_fkey" FOREIGN KEY ("elderlyId") REFERENCES "elderly_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduled_activities" ADD CONSTRAINT "scheduled_activities_elderlyId_fkey" FOREIGN KEY ("elderlyId") REFERENCES "elderly_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
