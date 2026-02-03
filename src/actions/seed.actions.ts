'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import {
    Gender, MaritalStatus, HearingStatus, VisionStatus, SpeechStatus,
    GaitStatus, BladderControl, BowelControl, DiaperType, HealthPrivilege,
    GoalOfCare, CareLevel, BloodType, MobilityStatus, Role, Mood, MealIntake, SleepQuality, HomeType
} from '@prisma/client';

export async function seedUsers() {
    try {
        const passwordHash = await bcrypt.hash('admin123', 12);

        // 1. Admin User
        const adminEmail = 'admin@elderlycare.com';
        await prisma.user.upsert({
            where: { email: adminEmail },
            update: {
                password: passwordHash,
            },
            create: {
                email: adminEmail,
                password: passwordHash,
                name: 'System Admin',
                role: Role.ADMIN,
                isActive: true,
            },
        });

        // 2. Staff User 1
        const staffEmail = 'staff@elderlycare.com';
        await prisma.user.upsert({
            where: { email: staffEmail },
            update: {
                password: passwordHash,
            },
            create: {
                email: staffEmail,
                password: passwordHash,
                name: 'คุณพยาบาล สมใจ',
                role: Role.STAFF,
                isActive: true,
            },
        });

        // 3. Staff User 2
        const staff2Email = 'nurse@elderlycare.com';
        await prisma.user.upsert({
            where: { email: staff2Email },
            update: {
                password: passwordHash,
            },
            create: {
                email: staff2Email,
                password: passwordHash,
                name: 'คุณพยาบาล วรรณี',
                role: Role.STAFF,
                isActive: true,
            },
        });

        // 4. Staff User 3
        const staff3Email = 'caregiver@elderlycare.com';
        await prisma.user.upsert({
            where: { email: staff3Email },
            update: {
                password: passwordHash,
            },
            create: {
                email: staff3Email,
                password: passwordHash,
                name: 'คุณผู้ช่วย ประเสริฐ',
                role: Role.STAFF,
                isActive: true,
            },
        });

        return { success: true, message: 'Users seeded successfully (4 users)' };
    } catch (error) {
        console.error('Error seeding users:', error);
        return { success: false, error: 'Failed to seed users' };
    }
}

export async function seedElderlyProfiles() {
    try {
        // Sample Elderly 1: Relatively healthy, mostly independent
        const elderly1 = await prisma.elderlyProfile.upsert({
            where: { safeId: 'SID2024001' },
            update: {},
            create: {
                safeId: 'SID2024001',
                partnerId: 'PID001',
                firstName: 'สมชาย',
                lastName: 'ใจดี',
                nickname: 'ลุงสม',
                age: 75,
                gender: Gender.MALE,
                dateOfBirth: new Date('1949-05-15'),
                maritalStatus: MaritalStatus.MARRIED,
                education: 'ปริญญาตรี วิศวกรรมศาสตร์',
                proudFormerOccupation: 'วิศวกรโยธา',

                // Contact
                keyCoordinatorName: 'สมศรี ใจดี',
                keyCoordinatorPhone: '081-111-1111',
                keyCoordinatorRelation: 'ภรรยา',
                legalGuardianName: 'สมชัย ใจดี',
                legalGuardianPhone: '081-222-2222',
                legalGuardianRelation: 'บุตรชาย',

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
                currentMedications: 'Amlodipine 5mg วันละ 1 เม็ด หลังอาหารเช้า',
                healthPrivilege: HealthPrivilege.SOCIAL_SECURITY,
                bloodType: BloodType.A_POSITIVE,

                // Care
                careLevel: CareLevel.LEVEL_1,
                goalOfCare: GoalOfCare.LONG_TERM_CARE,

                // Religion
                religion: 'พุทธ',
                religiousRestrictions: 'ไม่มี',

                // Environment
                homeType: HomeType.SINGLE_HOUSE,
                bedroomLocation: 'ชั้น 1',

                registrationDate: new Date('2024-01-15'),
                admissionDate: new Date('2024-01-15'),
                assessmentDate: new Date('2024-01-15'),
                assessorSignature: 'พยาบาลสมใจ',
            }
        });

        // Sample Elderly 2: Needs assistance, dementia symptoms
        const elderly2 = await prisma.elderlyProfile.upsert({
            where: { safeId: 'SID2024002' },
            update: {},
            create: {
                safeId: 'SID2024002',
                partnerId: 'PID002',
                firstName: 'สมหญิง',
                lastName: 'รักสงบ',
                nickname: 'ยายหญิง',
                age: 82,
                gender: Gender.FEMALE,
                dateOfBirth: new Date('1942-11-20'),
                maritalStatus: MaritalStatus.WIDOWED,
                education: 'มัธยมศึกษาปีที่ 6',
                proudFormerOccupation: 'แม่บ้าน',

                // Contact
                keyCoordinatorName: 'วิชัย รักสงบ',
                keyCoordinatorPhone: '089-999-9999',
                keyCoordinatorRelation: 'บุตรชาย',
                legalGuardianName: 'วิชัย รักสงบ',
                legalGuardianPhone: '089-999-9999',
                legalGuardianRelation: 'บุตรชาย',

                // Health
                hearingStatus: HearingStatus.HARD_OF_HEARING_LEFT,
                visionStatus: VisionStatus.CATARACT_GLAUCOMA,
                speechStatus: SpeechStatus.CLEAR,
                mobilityStatus: MobilityStatus.NEEDS_ASSISTANCE,
                gaitStatus: GaitStatus.NEEDS_SUPPORT,
                assistiveDevices: JSON.stringify(['Walker', 'ไม้เท้า']),
                historyOfFalls: true,
                fallsTimeframe: '6 เดือนที่ผ่านมา',
                fallsCause: 'ลื่นล้มในห้องน้ำ',

                // Cognitive
                hasConfusion: true,
                confusionTimeframe: 'ช่วงเย็นและกลางคืน',
                memoryStatus: JSON.stringify(['ลืมเหตุการณ์ล่าสุด', 'จำคนคุ้นเคยได้']),
                behaviorStatus: JSON.stringify(['ฉุนเฉียวบางครั้ง', 'นอนไม่หลับ']),

                // Elimination
                bladderControl: BladderControl.OCCASIONAL_INCONTINENCE,
                bowelControl: BowelControl.CONSTIPATION,
                diaperType: DiaperType.PANTS,
                diaperSize: 'L',

                // Medical
                underlyingDiseases: 'เบาหวานชนิดที่ 2, อัลไซเมอร์ระยะต้น, โรคหัวใจ',
                currentMedications: 'Metformin 500mg วันละ 2 เม็ด, Donepezil 10mg วันละ 1 เม็ด, Aspirin 81mg',
                surgicalHistory: 'ผ่าตัดถุงน้ำดี ปี 2560',
                healthPrivilege: HealthPrivilege.GOLD_CARD,
                bloodType: BloodType.O_POSITIVE,

                // Allergies
                hasDrugAllergies: true,
                drugAllergiesDetail: 'Penicillin - ผื่นแดง',
                hasFoodChemicalAllergies: true,
                foodChemicalAllergiesDetail: 'อาหารทะเล - คัน บวม',

                // Care
                careLevel: CareLevel.LEVEL_2,
                goalOfCare: GoalOfCare.LONG_TERM_CARE,
                expectationDetails: 'ดูแลให้ปลอดภัย ไม่ล้ม กินยาตรงเวลา',

                // Religion
                religion: 'พุทธ',
                spiritualNeeds: 'ต้องการทำบุญทุกวันพระ',

                // Environment
                homeType: HomeType.TOWNHOUSE,
                bedroomLocation: 'ชั้น 2',

                registrationDate: new Date('2024-02-01'),
                admissionDate: new Date('2024-02-01'),
                assessmentDate: new Date('2024-02-01'),
                assessorSignature: 'พยาบาลวรรณี',
            }
        });

        // Sample Elderly 3: Wheelchair bound, full care needed
        const elderly3 = await prisma.elderlyProfile.upsert({
            where: { safeId: 'SID2024003' },
            update: {},
            create: {
                safeId: 'SID2024003',
                partnerId: 'PID003',
                firstName: 'ประสิทธิ์',
                lastName: 'มั่นคง',
                nickname: 'ลุงสิทธิ์',
                age: 78,
                gender: Gender.MALE,
                dateOfBirth: new Date('1946-03-10'),
                maritalStatus: MaritalStatus.MARRIED,
                education: 'ปริญญาโท บริหารธุรกิจ',
                proudFormerOccupation: 'ผู้จัดการธนาคาร',

                // Contact
                keyCoordinatorName: 'ประภา มั่นคง',
                keyCoordinatorPhone: '082-333-4444',
                keyCoordinatorRelation: 'ภรรยา',
                legalGuardianName: 'ประภา มั่นคง',
                legalGuardianPhone: '082-333-4444',
                legalGuardianRelation: 'ภรรยา',

                // Health
                hearingStatus: HearingStatus.HEARING_AID,
                visionStatus: VisionStatus.GLASSES,
                speechStatus: SpeechStatus.DYSARTHRIA,
                mobilityStatus: MobilityStatus.WHEELCHAIR,
                gaitStatus: GaitStatus.NON_AMBULATORY_BEDRIDDEN,
                assistiveDevices: JSON.stringify(['รถเข็น', 'เตียงไฟฟ้า']),
                historyOfFalls: false,

                // Elimination
                bladderControl: BladderControl.TOTAL_INCONTINENCE_FOLEY,
                foleySize: '16Fr',
                bowelControl: BowelControl.INCONTINENCE,
                diaperType: DiaperType.TAPE,
                diaperSize: 'XL',

                // Skin
                hasPressureUlcer: true,
                pressureUlcerLocation: 'กระดูกก้นกบ',
                pressureUlcerStage: '2',
                skinCondition: JSON.stringify(['แห้ง', 'บาง']),
                medicalDevices: JSON.stringify(['สาย Foley', 'เครื่องดูดเสมหะ']),

                // Medical
                underlyingDiseases: 'โรคหลอดเลือดสมอง (Stroke), ความดันโลหิตสูง, ไขมันในเลือดสูง',
                currentMedications: 'Aspirin 81mg, Atorvastatin 20mg, Amlodipine 10mg, Enalapril 5mg',
                surgicalHistory: 'ไม่มี',
                healthPrivilege: HealthPrivilege.GOVERNMENT_OFFICER,
                bloodType: BloodType.B_POSITIVE,
                reasonForAdmission: 'มีปัญหาอัมพาตครึ่งซีกขวาหลัง Stroke เมื่อ 2 ปีก่อน ต้องการการดูแลตลอด 24 ชม.',

                // Care
                careLevel: CareLevel.LEVEL_4,
                goalOfCare: GoalOfCare.REHABILITATION,
                expectationDetails: 'ฟื้นฟูสมรรถภาพให้ดีขึ้น ป้องกันแผลกดทับ',
                specialDietaryNeeds: 'อาหารเหลว บด ปั่น',

                // Religion
                religion: 'พุทธ',
                spiritualNeeds: 'ต้องการพระมาสวดมนต์',

                registrationDate: new Date('2024-03-01'),
                admissionDate: new Date('2024-03-01'),
                assessmentDate: new Date('2024-03-01'),
                assessorSignature: 'พยาบาลสมใจ',
            }
        });

        // Sample Elderly 4: Active elderly, minor assistance
        const elderly4 = await prisma.elderlyProfile.upsert({
            where: { safeId: 'SID2024004' },
            update: {},
            create: {
                safeId: 'SID2024004',
                partnerId: 'PID004',
                firstName: 'สุภาพ',
                lastName: 'เจริญสุข',
                nickname: 'ป้าภาพ',
                age: 68,
                gender: Gender.FEMALE,
                dateOfBirth: new Date('1956-08-25'),
                maritalStatus: MaritalStatus.DIVORCED_SEPARATED,
                education: 'ปริญญาตรี ครุศาสตร์',
                proudFormerOccupation: 'ครูประถมศึกษา',

                // Contact
                keyCoordinatorName: 'สุรีรัตน์ เจริญสุข',
                keyCoordinatorPhone: '085-666-7777',
                keyCoordinatorRelation: 'บุตรสาว',

                // Health
                hearingStatus: HearingStatus.NORMAL,
                visionStatus: VisionStatus.NEARSIGHTED_FARSIGHTED,
                speechStatus: SpeechStatus.CLEAR,
                mobilityStatus: MobilityStatus.INDEPENDENT,
                gaitStatus: GaitStatus.INDEPENDENT,

                // Elimination
                bladderControl: BladderControl.CONTINENT,
                bowelControl: BowelControl.NORMAL,
                diaperType: DiaperType.NONE,

                // Medical
                underlyingDiseases: 'ข้อเข่าเสื่อม, กระดูกพรุน',
                currentMedications: 'Glucosamine, Calcium 600mg, Vitamin D',
                healthPrivilege: HealthPrivilege.SOCIAL_SECURITY,
                bloodType: BloodType.AB_POSITIVE,

                // Care
                careLevel: CareLevel.LEVEL_1,
                goalOfCare: GoalOfCare.LONG_TERM_CARE,
                expectationDetails: 'มีเพื่อนคุย ออกกำลังกาย ทำกิจกรรมร่วมกัน',

                // Religion
                religion: 'คริสต์',
                religiousRestrictions: 'ไปโบสถ์ทุกวันอาทิตย์',

                registrationDate: new Date('2024-01-20'),
                admissionDate: new Date('2024-01-20'),
                assessmentDate: new Date('2024-01-20'),
                assessorSignature: 'พยาบาลวรรณี',
            }
        });

        // Sample Elderly 5: Palliative care
        const elderly5 = await prisma.elderlyProfile.upsert({
            where: { safeId: 'SID2024005' },
            update: {},
            create: {
                safeId: 'SID2024005',
                partnerId: 'PID005',
                firstName: 'บุญมี',
                lastName: 'สุขสันต์',
                nickname: 'ลุงบุญ',
                age: 85,
                gender: Gender.MALE,
                dateOfBirth: new Date('1939-12-05'),
                maritalStatus: MaritalStatus.WIDOWED,
                education: 'ประถมศึกษาปีที่ 4',
                proudFormerOccupation: 'ชาวนา',

                // Contact
                keyCoordinatorName: 'บุญเรือง สุขสันต์',
                keyCoordinatorPhone: '086-888-9999',
                keyCoordinatorRelation: 'บุตรชาย',

                // Health
                hearingStatus: HearingStatus.HARD_OF_HEARING_BOTH,
                visionStatus: VisionStatus.CATARACT_GLAUCOMA,
                speechStatus: SpeechStatus.CLEAR,
                mobilityStatus: MobilityStatus.BEDRIDDEN,
                gaitStatus: GaitStatus.NON_AMBULATORY_BEDRIDDEN,

                // Elimination
                bladderControl: BladderControl.TOTAL_INCONTINENCE_FOLEY,
                foleySize: '14Fr',
                bowelControl: BowelControl.INCONTINENCE,
                diaperType: DiaperType.TAPE,
                diaperSize: 'L',

                // Medical
                underlyingDiseases: 'มะเร็งตับระยะสุดท้าย, ตับแข็ง',
                currentMedications: 'Morphine Syrup 10mg ทุก 4 ชม., Lactulose 30ml วันละ 2 ครั้ง',
                healthPrivilege: HealthPrivilege.GOLD_CARD,
                bloodType: BloodType.O_NEGATIVE,
                reasonForAdmission: 'ดูแลแบบประคับประคอง ลดความเจ็บปวด',

                // Allergies
                hasDrugAllergies: false,

                // Care
                careLevel: CareLevel.LEVEL_4,
                goalOfCare: GoalOfCare.PALLIATIVE,
                expectationDetails: 'ดูแลให้สบาย ไม่เจ็บปวด จากไปอย่างสงบ',
                specialDietaryNeeds: 'อาหารเหลว ทางสายยาง',

                // Religion
                religion: 'พุทธ',
                spiritualNeeds: 'ต้องการฟังเทศน์ สวดมนต์',

                registrationDate: new Date('2024-04-01'),
                admissionDate: new Date('2024-04-01'),
                assessmentDate: new Date('2024-04-01'),
                assessorSignature: 'พยาบาลสมใจ',
            }
        });

        return { success: true, message: 'Elderly profiles seeded successfully (5 profiles)' };
    } catch (error) {
        console.error('Error seeding elderly profiles:', error);
        return { success: false, error: 'Failed to seed elderly profiles' };
    }
}

export async function seedDailyLogs() {
    try {
        // Get elderly profiles
        const elderly = await prisma.elderlyProfile.findMany({
            take: 5,
            orderBy: { safeId: 'asc' }
        });

        if (elderly.length === 0) {
            return { success: false, error: 'No elderly profiles found. Please seed profiles first.' };
        }

        const today = new Date();
        const moods = [Mood.HAPPY, Mood.CONTENT, Mood.NEUTRAL, Mood.SAD, Mood.ANXIOUS];
        const mealIntakes = [MealIntake.FULL, MealIntake.PARTIAL, MealIntake.MINIMAL];
        const sleepQualities = [SleepQuality.EXCELLENT, SleepQuality.GOOD, SleepQuality.FAIR, SleepQuality.POOR];

        // Create logs for past 7 days for each elderly
        for (const el of elderly) {
            for (let i = 0; i < 7; i++) {
                const logDate = new Date(today);
                logDate.setDate(logDate.getDate() - i);
                logDate.setHours(8, 0, 0, 0);

                const randomMood = moods[Math.floor(Math.random() * moods.length)];
                const randomMeal = mealIntakes[Math.floor(Math.random() * mealIntakes.length)];
                const randomSleep = sleepQualities[Math.floor(Math.random() * sleepQualities.length)];

                await prisma.dailyLog.create({
                    data: {
                        elderlyId: el.id,
                        date: logDate,
                        vitals: {
                            bp_systolic: 110 + Math.floor(Math.random() * 30),
                            bp_diastolic: 70 + Math.floor(Math.random() * 20),
                            heartRate: 60 + Math.floor(Math.random() * 20),
                            temperature: 36 + Math.random() * 1.5,
                            oxygenLevel: 95 + Math.floor(Math.random() * 5),
                            weight: el.gender === Gender.MALE ? 60 + Math.random() * 20 : 45 + Math.random() * 15
                        },
                        activityNote: getRandomActivityNote(i),
                        mood: randomMood,
                        mealIntake: randomMeal,
                        sleepQuality: randomSleep,
                        sleepHours: 5 + Math.random() * 4,
                        medicationsTaken: Math.random() > 0.1,
                        medicationNotes: Math.random() > 0.7 ? 'กินยาตรงเวลา' : null,
                        physicalCondition: getRandomPhysicalCondition(),
                        behavioralNotes: getRandomBehavioralNote(),
                        recordedBy: 'staff-001',
                        recordedByName: 'คุณพยาบาล สมใจ'
                    }
                });
            }
        }

        return { success: true, message: 'Daily logs seeded successfully (35 logs for 5 elderly over 7 days)' };
    } catch (error) {
        console.error('Error seeding daily logs:', error);
        return { success: false, error: 'Failed to seed daily logs' };
    }
}

function getRandomActivityNote(dayIndex: number): string {
    const activities = [
        'ตื่นเช้า ทำกิจวัตรประจำวันได้เอง อ่านหนังสือพิมพ์',
        'ร่วมกิจกรรมกายภาพบำบัดตอนเช้า นั่งคุยกับเพื่อน',
        'ดูทีวี เดินเล่นในสวน ทานอาหารได้ดี',
        'พักผ่อนเป็นหลัก มีญาติมาเยี่ยม',
        'ทำกายภาพบำบัด เล่นหมากรุก อารมณ์ดี',
        'นอนหลับพักผ่อน ตื่นมาทานอาหารได้ครบ 3 มื้อ',
        'ร่วมกิจกรรมวันพระ ทำบุญ ฟังเทศน์'
    ];
    return activities[dayIndex % activities.length];
}

function getRandomPhysicalCondition(): string | null {
    const conditions = [
        'สภาพร่างกายปกติ',
        'มีอาการปวดหลังเล็กน้อย',
        'ไม่มีอาการผิดปกติ',
        null,
        'เหนื่อยง่าย พักบ่อย',
        'ปกติดี กินอาหารได้',
        null
    ];
    return conditions[Math.floor(Math.random() * conditions.length)];
}

function getRandomBehavioralNote(): string | null {
    const behaviors = [
        'อารมณ์ดี ยิ้มแย้ม',
        'พูดคุยกับเพื่อนร่วมห้อง',
        null,
        'หงุดหงิดเล็กน้อยช่วงเช้า',
        'สงบ ไม่มีอาการผิดปกติ',
        null,
        'ร่าเริง มีส่วนร่วมในกิจกรรม'
    ];
    return behaviors[Math.floor(Math.random() * behaviors.length)];
}

export async function seedAppointments() {
    try {
        const elderly = await prisma.elderlyProfile.findMany({
            take: 5,
            orderBy: { safeId: 'asc' }
        });

        if (elderly.length === 0) {
            return { success: false, error: 'No elderly profiles found.' };
        }

        const today = new Date();

        // Appointments for Elderly 1 (สมชาย - ความดัน)
        if (elderly[0]) {
            await prisma.appointment.createMany({
                data: [
                    {
                        elderlyId: elderly[0].id,
                        title: 'นัดตรวจความดันโลหิต',
                        location: 'รพ.ศิริราช ตึก OPD อายุรกรรม',
                        doctorName: 'นพ. สมศักดิ์ หัวใจดี',
                        date: addDays(today, 7),
                        time: '09:00',
                        notes: 'งดน้ำงดอาหาร 8 ชม. ก่อนตรวจ',
                        remindDaysBefore: 2,
                        isCompleted: false
                    },
                    {
                        elderlyId: elderly[0].id,
                        title: 'นัดตรวจสุขภาพประจำปี',
                        location: 'รพ.ศิริราช',
                        doctorName: 'นพ. สมศักดิ์ หัวใจดี',
                        date: addDays(today, 30),
                        time: '08:00',
                        notes: 'ตรวจเลือด ตรวจปัสสาวะ เอกซเรย์ปอด',
                        remindDaysBefore: 3,
                        isCompleted: false
                    }
                ]
            });
        }

        // Appointments for Elderly 2 (สมหญิง - เบาหวาน/อัลไซเมอร์)
        if (elderly[1]) {
            await prisma.appointment.createMany({
                data: [
                    {
                        elderlyId: elderly[1].id,
                        title: 'นัดพบจิตแพทย์ ติดตาม Dementia',
                        location: 'รพ.รามาธิบดี คลินิกจิตเวช',
                        doctorName: 'พญ. ณัฐกานต์ สมองดี',
                        date: addDays(today, 14),
                        time: '10:30',
                        notes: 'นำยาปัจจุบันมาด้วย',
                        remindDaysBefore: 2,
                        isCompleted: false
                    },
                    {
                        elderlyId: elderly[1].id,
                        title: 'นัดตรวจเบาหวาน',
                        location: 'รพ.รามาธิบดี อายุรกรรม',
                        doctorName: 'พญ. สุชาดา ต่อมหวาน',
                        date: addDays(today, 5),
                        time: '08:00',
                        notes: 'งดน้ำงดอาหาร เจาะเลือด HbA1c',
                        remindDaysBefore: 1,
                        isCompleted: false
                    }
                ]
            });
        }

        // Appointments for Elderly 3 (ประสิทธิ์ - Stroke)
        if (elderly[2]) {
            await prisma.appointment.createMany({
                data: [
                    {
                        elderlyId: elderly[2].id,
                        title: 'นัดกายภาพบำบัด',
                        location: 'ศูนย์ฟื้นฟู รพ.จุฬาลงกรณ์',
                        doctorName: 'นักกายภาพ วิชัย',
                        date: addDays(today, 3),
                        time: '14:00',
                        notes: 'ฝึกกล้ามเนื้อแขนขา',
                        remindDaysBefore: 1,
                        isCompleted: false
                    },
                    {
                        elderlyId: elderly[2].id,
                        title: 'นัดประเมินแผลกดทับ',
                        location: 'รพ.จุฬาลงกรณ์ แผนกศัลยกรรม',
                        doctorName: 'นพ. อนันต์ ผิวดี',
                        date: addDays(today, 10),
                        time: '09:30',
                        notes: 'เปลี่ยนแผล ประเมินการหาย',
                        remindDaysBefore: 1,
                        isCompleted: false
                    }
                ]
            });
        }

        // Past appointment (completed)
        if (elderly[3]) {
            await prisma.appointment.create({
                data: {
                    elderlyId: elderly[3].id,
                    title: 'นัดตรวจข้อเข่า',
                    location: 'รพ.ราชวิถี ออร์โธปิดิกส์',
                    doctorName: 'นพ. กฤษณ์ กระดูกดี',
                    date: addDays(today, -5),
                    time: '10:00',
                    notes: 'ทำกายภาพบำบัดต่อเนื่อง',
                    remindDaysBefore: 1,
                    isCompleted: true
                }
            });
        }

        return { success: true, message: 'Appointments seeded successfully (7 appointments)' };
    } catch (error) {
        console.error('Error seeding appointments:', error);
        return { success: false, error: 'Failed to seed appointments' };
    }
}

function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

export async function seedScheduledActivities() {
    try {
        const elderly = await prisma.elderlyProfile.findMany({
            take: 5,
            orderBy: { safeId: 'asc' }
        });

        if (elderly.length === 0) {
            return { success: false, error: 'No elderly profiles found.' };
        }

        // Activities for all elderly (daily medication)
        for (const el of elderly) {
            await prisma.scheduledActivity.createMany({
                data: [
                    {
                        elderlyId: el.id,
                        title: 'กินยาเช้า',
                        description: 'รับประทานยาตามที่แพทย์สั่งหลังอาหารเช้า',
                        recurrence: 'DAILY',
                        time: '08:00',
                        isActive: true
                    },
                    {
                        elderlyId: el.id,
                        title: 'กินยาเย็น',
                        description: 'รับประทานยาตามที่แพทย์สั่งหลังอาหารเย็น',
                        recurrence: 'DAILY',
                        time: '18:00',
                        isActive: true
                    }
                ]
            });
        }

        // Specific activities for Elderly 1 (สมชาย - active)
        if (elderly[0]) {
            await prisma.scheduledActivity.createMany({
                data: [
                    {
                        elderlyId: elderly[0].id,
                        title: 'เดินออกกำลังกาย',
                        description: 'เดินรอบสวน 30 นาที',
                        recurrence: 'DAILY',
                        time: '06:30',
                        isActive: true
                    },
                    {
                        elderlyId: elderly[0].id,
                        title: 'วัดความดัน',
                        description: 'วัดความดันโลหิตและบันทึก',
                        recurrence: 'DAILY',
                        time: '07:00',
                        isActive: true
                    }
                ]
            });
        }

        // Activities for Elderly 2 (สมหญิง - dementia)
        if (elderly[1]) {
            await prisma.scheduledActivity.createMany({
                data: [
                    {
                        elderlyId: elderly[1].id,
                        title: 'ฝึกสมอง',
                        description: 'เล่นเกมจับคู่ ตอบคำถาม 15 นาที',
                        recurrence: 'DAILY',
                        time: '10:00',
                        isActive: true
                    },
                    {
                        elderlyId: elderly[1].id,
                        title: 'ตรวจน้ำตาล',
                        description: 'เจาะเลือดปลายนิ้ว ตรวจน้ำตาลก่อนอาหารเช้า',
                        recurrence: 'DAILY',
                        time: '07:00',
                        isActive: true
                    }
                ]
            });
        }

        // Activities for Elderly 3 (ประสิทธิ์ - wheelchair)
        if (elderly[2]) {
            await prisma.scheduledActivity.createMany({
                data: [
                    {
                        elderlyId: elderly[2].id,
                        title: 'กายภาพบำบัด',
                        description: 'ฝึกเคลื่อนไหวแขนขา กับนักกายภาพ',
                        recurrence: 'DAILY',
                        time: '10:00',
                        isActive: true
                    },
                    {
                        elderlyId: elderly[2].id,
                        title: 'พลิกตัวทุก 2 ชม.',
                        description: 'พลิกตัวป้องกันแผลกดทับ',
                        recurrence: 'DAILY',
                        time: '08:00',
                        isActive: true
                    },
                    {
                        elderlyId: elderly[2].id,
                        title: 'ดูดเสมหะ',
                        description: 'ดูดเสมหะจากปากและคอ',
                        recurrence: 'DAILY',
                        time: '09:00',
                        isActive: true
                    }
                ]
            });
        }

        // Weekly activities
        if (elderly[0]) {
            await prisma.scheduledActivity.create({
                data: {
                    elderlyId: elderly[0].id,
                    title: 'ทำบุญใส่บาตร',
                    description: 'ตักบาตรพระหน้าศูนย์',
                    recurrence: 'WEEKLY',
                    dayOfWeek: 0, // Sunday
                    time: '06:00',
                    isActive: true
                }
            });
        }

        if (elderly[3]) {
            await prisma.scheduledActivity.create({
                data: {
                    elderlyId: elderly[3].id,
                    title: 'ไปโบสถ์',
                    description: 'ร่วมพิธีนมัสการวันอาทิตย์',
                    recurrence: 'WEEKLY',
                    dayOfWeek: 0, // Sunday
                    time: '08:00',
                    isActive: true
                }
            });
        }

        return { success: true, message: 'Scheduled activities seeded successfully (20+ activities)' };
    } catch (error) {
        console.error('Error seeding scheduled activities:', error);
        return { success: false, error: 'Failed to seed scheduled activities' };
    }
}

// Main seed function that calls all others
export async function seedAll() {
    const results = {
        users: await seedUsers(),
        elderlyProfiles: await seedElderlyProfiles(),
        dailyLogs: await seedDailyLogs(),
        appointments: await seedAppointments(),
        scheduledActivities: await seedScheduledActivities()
    };

    const allSuccess = Object.values(results).every(r => r.success);

    return {
        success: allSuccess,
        message: allSuccess ? 'All data seeded successfully!' : 'Some seeds failed',
        details: results
    };
}
