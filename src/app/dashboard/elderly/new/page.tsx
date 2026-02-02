/**
 * New Elderly Profile Page
 *
 * Comprehensive 14-section form for elderly admission.
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { elderlyProfileSchema, type ElderlyProfileInput } from '@/lib/validations';
import { createElderlyProfile } from '@/actions/elderly.actions';
import { PROVINCE_NAMES_TH } from '@/lib/provinces';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea'; // Assuming simple textarea for now if component doesn't exist, we'll check
// If Textarea component doesn't exist, we can use <textarea className="..."/> or Input
import { Checkbox } from '@/components/ui/checkbox'; // Need to verify if this exists, usually it does in Shadcn
import {
    ArrowLeft,
    Save,
    User,
    MapPin,
    Phone,
    Heart,
    AlertCircle,
    Check,
    FileText,
    Activity,
    Brain,
    Eye,
    Accessibility,
    Utensils,
    Cross,
    Home,
} from 'lucide-react';

// Fallback for Textarea if not found, standardized styles
const TextareaField = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }) => (
    <div className="space-y-1">
        <textarea
            {...props}
            className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${props.className} ${props.error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
        />
    </div>
);

export default function NewElderlyPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors },
    } = useForm<ElderlyProfileInput>({
        resolver: zodResolver(elderlyProfileSchema),
        defaultValues: {
            gender: 'MALE',
            bloodType: 'UNKNOWN',
            mobilityStatus: 'INDEPENDENT',
            careLevel: 'LEVEL_1',
            isActive: true,
            // Defaults for new enums
            maritalStatus: 'SINGLE',
            hearingStatus: 'NORMAL',
            visionStatus: 'NORMAL',
            speechStatus: 'CLEAR',
            gaitStatus: 'INDEPENDENT',
            bladderControl: 'CONTINENT',
            bowelControl: 'NORMAL',
            diaperType: 'NONE',
            healthPrivilege: 'SELF_PAY',
            goalOfCare: 'LONG_TERM_CARE',
            admissionDate: new Date(),
        },
    });

    const onSubmit = async (data: ElderlyProfileInput) => {
        setIsSubmitting(true);
        setSubmitResult(null);
        console.log("Submitting form data:", data); // Debug

        try {
            const result = await createElderlyProfile(data);

            if (result.success) {
                setSubmitResult({ success: true, message: 'บันทึกข้อมูลสำเร็จ! (Saved Successfully)' });
                // Optional: Scroll to top to see message
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setTimeout(() => {
                    router.push('/dashboard/elderly');
                }, 2000);
            } else {
                setSubmitResult({ success: false, message: result.error || 'เกิดข้อผิดพลาด (Error occurred)' });
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (err) {
            console.error(err);
            setSubmitResult({ success: false, message: 'เกิดข้อผิดพลาดในการเชื่อมต่อ (Connection error)' });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20">
            {/* Top Navigation */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/elderly">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        ลงทะเบียนผู้สูงอายุเข้าพัก (Admission Form)
                    </h1>
                    <p className="text-gray-500">กรอกข้อมูลให้ครบถ้วนทั้ง 14 หมวดหมู่</p>
                </div>
            </div>

            {/* Alert Messages */}
            {submitResult && (
                <div className={`flex items-center gap-2 p-4 rounded-lg border ${submitResult.success
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400'
                    : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                    {submitResult.success ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    {submitResult.message}
                </div>
            )}

            {Object.keys(errors).length > 0 && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
                    <p className="font-bold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" /> พบข้อผิดพลาดในข้อมูล (Validation Errors):
                    </p>
                    <ul className="list-disc pl-5 mt-2 text-sm">
                        {Object.entries(errors).map(([key, error]) => (
                            <li key={key}>{key}: {error?.message}</li>
                        ))}
                    </ul>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                {/* Header Section */}
                <Card className="border-indigo-100 shadow-sm">
                    <CardHeader className="bg-slate-50 border-b pb-4">
                        <CardTitle className="text-lg">ส่วนหัว: ข้อมูลการรับเข้า (Admission Info)</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <FormField label="วันที่ลงทะเบียน *" error={errors.admissionDate?.message}>
                                <Input type="date" {...register('admissionDate')} error={errors.admissionDate?.message} />
                            </FormField>
                            <FormField label="เวลา *" error={errors.admissionTime?.message}>
                                <Input type="time" {...register('admissionTime')} error={errors.admissionTime?.message} />
                            </FormField>
                            <FormField label="รหัสผู้ป่วย (SAFE-ID) *" error={errors.safeId?.message}>
                                <Input placeholder="SIDxxx69xxx" {...register('safeId')} error={errors.safeId?.message} className="font-mono uppercase" />
                            </FormField>
                            <FormField label="รหัสพันธมิตร" error={errors.partnerId?.message}>
                                <Input placeholder="PID001-PID999" {...register('partnerId')} className="font-mono uppercase" />
                            </FormField>
                        </div>
                    </CardContent>
                </Card>

                {/* 1. Identification */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
                            <User className="w-5 h-5" />
                            1. ข้อมูลทั่วไป (Identification)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField label="ชื่อ *" error={errors.firstName?.message}>
                            <Input placeholder="สมชาย" {...register('firstName')} error={errors.firstName?.message} />
                        </FormField>
                        <FormField label="นามสกุล *" error={errors.lastName?.message}>
                            <Input placeholder="ใจดี" {...register('lastName')} error={errors.lastName?.message} />
                        </FormField>
                        <FormField label="ชื่อเล่น">
                            <Input placeholder="ลุงชาย" {...register('nickname')} />
                        </FormField>

                        <FormField label="อายุ *" error={errors.age?.message}>
                            <Input type="number" placeholder="75" {...register('age')} error={errors.age?.message} />
                        </FormField>
                        <FormField label="เพศ *">
                            <Select {...register('gender')}>
                                <option value="MALE">ชาย (Male)</option>
                                <option value="FEMALE">หญิง (Female)</option>
                                <option value="OTHER">อื่นๆ (Other)</option>
                            </Select>
                        </FormField>
                        <FormField label="สรรพนามที่ชอบให้เรียก">
                            <Input placeholder="พ่อใหญ่, คุณตา" {...register('preferredPronouns')} />
                        </FormField>

                        <FormField label="ระดับการศึกษาสูงสุด">
                            <Input placeholder="ปริญญาตรี" {...register('education')} />
                        </FormField>
                        <FormField label="อาชีพเดิมที่ภาคภูมิใจ" className="md:col-span-2">
                            <Input placeholder="ครูใหญ่, ข้าราชการ" {...register('proudFormerOccupation')} />
                        </FormField>

                        {/* Hidden/Computed fields maintained for schema compatibility */}
                        <input type="hidden" {...register('dateOfBirth')} value={new Date().toISOString().split('T')[0]} />
                    </CardContent>
                </Card>

                {/* 2. Marital & Contact */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
                            <Phone className="w-5 h-5" />
                            2. สถานภาพและผู้ติดต่อ (Marital Status & Contacts)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField label="สถานภาพสมรส *">
                                <Select {...register('maritalStatus')}>
                                    <option value="SINGLE">โสด (Single)</option>
                                    <option value="MARRIED">สมรส (Married)</option>
                                    <option value="WIDOWED">หม้าย (Widowed)</option>
                                    <option value="DIVORCED_SEPARATED">หย่าร้าง/แยกกันอยู่</option>
                                </Select>
                            </FormField>
                        </div>

                        <div className="border p-4 rounded-md bg-slate-50/50 space-y-4">
                            <h3 className="font-semibold text-sm text-gray-900">ผู้ประสานงานหลัก (Key Coordinator)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField label="ชื่อ-นามสกุล">
                                    <Input {...register('keyCoordinatorName')} />
                                </FormField>
                                <FormField label="เบอร์โทรศัพท์">
                                    <Input {...register('keyCoordinatorPhone')} />
                                </FormField>
                                <FormField label="ความสัมพันธ์">
                                    <Input {...register('keyCoordinatorRelation')} />
                                </FormField>
                            </div>
                        </div>

                        <div className="border p-4 rounded-md bg-slate-50/50 space-y-4">
                            <h3 className="font-semibold text-sm text-gray-900">ผู้ทำสัญญา/ตัดสินใจ (Contract Signer)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField label="ชื่อ-นามสกุล">
                                    <Input {...register('legalGuardianName')} />
                                </FormField>
                                <FormField label="เบอร์โทรศัพท์">
                                    <Input {...register('legalGuardianPhone')} />
                                </FormField>
                                <FormField label="ความสัมพันธ์">
                                    <Input {...register('legalGuardianRelation')} />
                                </FormField>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 3. Sensory */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
                            <Eye className="w-5 h-5" />
                            3. ประสาทสัมผัส (Sensory & Communication)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField label="การได้ยิน (Hearing)">
                            <Select {...register('hearingStatus')}>
                                <option value="NORMAL">ปกติ</option>
                                <option value="HARD_OF_HEARING_LEFT">หูตึง (ซ้าย)</option>
                                <option value="HARD_OF_HEARING_RIGHT">หูตึง (ขวา)</option>
                                <option value="HARD_OF_HEARING_BOTH">หูตึง (2 ข้าง)</option>
                                <option value="DEAF">หูหนวก</option>
                                <option value="HEARING_AID">ใช้เครื่องช่วยฟัง</option>
                            </Select>
                        </FormField>
                        <FormField label="การมองเห็น (Vision)">
                            <Select {...register('visionStatus')}>
                                <option value="NORMAL">ปกติ</option>
                                <option value="NEARSIGHTED_FARSIGHTED">สายตาสั้น/ยาว</option>
                                <option value="CATARACT_GLAUCOMA">ต้อกระจก/ต้อหิน</option>
                                <option value="GLASSES">สวมแว่นตา</option>
                                <option value="CONTACT_LENS">คอนแทคเลนส์</option>
                            </Select>
                        </FormField>
                        <FormField label="การสื่อสาร (Speech)">
                            <Select {...register('speechStatus')}>
                                <option value="CLEAR">พูดชัดเจน</option>
                                <option value="DYSARTHRIA">พูดไม่ชัด (Dysarthria)</option>
                                <option value="APHASIA">บกพร่องการสื่อความ</option>
                                <option value="NON_VERBAL">ไม่พูด</option>
                            </Select>
                        </FormField>
                    </CardContent>
                </Card>

                {/* 4. Mobility */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
                            <Accessibility className="w-5 h-5" />
                            4. การเคลื่อนไหว (Mobility & Fall Risk)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-4 border p-4 rounded bg-orange-50/50">
                            <div className="flex items-center h-5">
                                <input id="historyOfFalls" type="checkbox" {...register('historyOfFalls')} className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                            </div>
                            <div className="flex-1 text-sm">
                                <label htmlFor="historyOfFalls" className="font-medium text-gray-700">มีประวัติการหกล้ม (History of Falls)</label>
                                {watch('historyOfFalls') && (
                                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input placeholder="ช่วงเวลา (เช่น 6 เดือนที่ผ่านมา)" {...register('fallsTimeframe')} />
                                        <Input placeholder="สาเหตุการหกล้ม" {...register('fallsCause')} />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField label="การเดิน (Gait)">
                                <Select {...register('gaitStatus')}>
                                    <option value="INDEPENDENT">เดินเองได้</option>
                                    <option value="UNSTEADY">เดินเซ</option>
                                    <option value="NEEDS_SUPPORT">ต้องพยุงเดิน</option>
                                    <option value="NON_AMBULATORY_BEDRIDDEN">เดินไม่ได้/ติดเตียง</option>
                                </Select>
                            </FormField>
                            <FormField label="อุปกรณ์ช่วย (ระบุ เช่น ไม้เท้า, วอล์คเกอร์)">
                                <Input placeholder="ไม้เท้า, วอล์คเกอร์, รถเข็น" {...register('assistiveDevices')} />
                            </FormField>
                        </div>
                    </CardContent>
                </Card>

                {/* 5. Elimination */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
                            <Utensils className="w-5 h-5" />
                            5. การขับถ่าย (Elimination)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4 border p-4 rounded">
                            <h3 className="font-semibold text-sm">ปัสสาวะ (Bladder)</h3>
                            <Select {...register('bladderControl')}>
                                <option value="CONTINENT">กลั้นได้ปกติ</option>
                                <option value="OCCASIONAL_INCONTINENCE">กลั้นไม่ได้บางครั้ง</option>
                                <option value="TOTAL_INCONTINENCE_FOLEY">กลั้นไม่ได้เลย/ใส่สายสวน</option>
                            </Select>
                            <FormField label="ขนาดสายสวน (Foley Size) ถ้ามี">
                                <Input {...register('foleySize')} placeholder="เบอร์ 14/16" />
                            </FormField>
                        </div>
                        <div className="space-y-4 border p-4 rounded">
                            <h3 className="font-semibold text-sm">อุจจาระ (Bowel)</h3>
                            <Select {...register('bowelControl')}>
                                <option value="NORMAL">ขับถ่ายปกติ</option>
                                <option value="CONSTIPATION">ท้องผูก</option>
                                <option value="DIARRHEA">ท้องเสีย</option>
                                <option value="INCONTINENCE">กลั้นไม่ได้</option>
                            </Select>
                        </div>
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField label="การใช้ผ้าอ้อม (Diaper)">
                                <Select {...register('diaperType')}>
                                    <option value="NONE">ไม่ใช้</option>
                                    <option value="TAPE">แบบเทป (Tape)</option>
                                    <option value="PANTS">แบบกางเกง (Pants)</option>
                                </Select>
                            </FormField>
                            <FormField label="ไซส์ผ้าอ้อม">
                                <Input {...register('diaperSize')} placeholder="M, L, XL" />
                            </FormField>
                        </div>
                    </CardContent>
                </Card>

                {/* 6. Cognitive */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
                            <Brain className="w-5 h-5" />
                            6. สภาวะสมองและพฤติกรรม (Cognitive)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="flex items-center h-5">
                                <input id="hasConfusion" type="checkbox" {...register('hasConfusion')} className="w-4 h-4 rounded border-gray-300" />
                            </div>
                            <div className="flex-1 text-sm">
                                <label htmlFor="hasConfusion" className="font-medium text-gray-700">มีภาวะสับสน (Confusion)</label>
                                {watch('hasConfusion') && (
                                    <Input className="mt-2" placeholder="ระบุช่วงเวลาที่มีอาการ" {...register('confusionTimeframe')} />
                                )}
                            </div>
                        </div>

                        <FormField label="ความจำ (Memory) - เลือกได้หลายข้อ (ระบุเป็นข้อความ)">
                            <Input placeholder="เช่น ความจำสั้น, หลงลืม, จำญาติไม่ได้" {...register('memoryStatus')} />
                        </FormField>

                        <FormField label="พฤติกรรม (Behavior) - (เช่น ก้าวร้าว, ซึมเศร้า, เดินไปเรื่อย)">
                            <Input placeholder="ระบุพฤติกรรม..." {...register('behaviorStatus')} />
                        </FormField>
                    </CardContent>
                </Card>

                {/* 7. Chief Complaint */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
                            <FileText className="w-5 h-5" />
                            7. อาการแรกรับ (Chief Complaint)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField label="สาเหตุที่มา (Reason for Admission)">
                            <TextareaField rows={3} {...register('reasonForAdmission')} />
                        </FormField>
                        <FormField label="สภาพจิตใจแรกรับ (Initial Mental State)">
                            <Input placeholder="เช่น วิตกกังวล, นิ่งเฉย, ร่าเริง" {...register('initialMentalState')} />
                        </FormField>
                    </CardContent>
                </Card>

                {/* 8. Medical History */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
                            <Activity className="w-5 h-5" />
                            8. ประวัติเจ็บป่วย (Medical History)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField label="โรคประจำตัว (Underlying Diseases)">
                            <TextareaField rows={2} placeholder="ระบุโรคประจำตัวทั้งหมด" {...register('underlyingDiseases')} />
                        </FormField>
                        <FormField label="ยาประจำ (Current Medications)">
                            <TextareaField rows={2} placeholder="ระบุชื่อยาและขนาด" {...register('currentMedications')} />
                        </FormField>
                        <FormField label="ประวัติผ่าตัด (Surgical History)">
                            <Input placeholder="ระบุการผ่าตัดและปีที่ทำ" {...register('surgicalHistory')} />
                        </FormField>
                    </CardContent>
                </Card>

                {/* 9. Allergies */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
                            <AlertCircle className="w-5 h-5" />
                            9. ประวัติการแพ้ (Allergies)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 border p-3 rounded">
                                <div className="flex items-center gap-2">
                                    <input id="drugAllergy" type="checkbox" {...register('hasDrugAllergies')} className="w-4 h-4" />
                                    <label htmlFor="drugAllergy" className="font-medium">แพ้ยา (Drug Allergy)</label>
                                </div>
                                {watch('hasDrugAllergies') && (
                                    <Input placeholder="ระบุชื่อยาและอาการแพ้" {...register('drugAllergiesDetail')} />
                                )}
                            </div>
                            <div className="space-y-2 border p-3 rounded">
                                <div className="flex items-center gap-2">
                                    <input id="foodAllergy" type="checkbox" {...register('hasFoodChemicalAllergies')} className="w-4 h-4" />
                                    <label htmlFor="foodAllergy" className="font-medium">แพ้อาหาร/สารเคมี</label>
                                </div>
                                {watch('hasFoodChemicalAllergies') && (
                                    <Input placeholder="ระบุสิ่งที่แพ้และอาการ" {...register('foodChemicalAllergiesDetail')} />
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 10. Physical & Devices */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
                            <Activity className="w-5 h-5" />
                            10. สภาพร่างกายและอุปกรณ์ (Physical & Devices)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField label="สภาพผิวหนัง (Skin)">
                            <Input placeholder="ปกติ, แห้ง, คัน, มีรอยฟกช้ำ" {...register('skinCondition')} />
                        </FormField>

                        <div className="flex items-start gap-4 border p-4 rounded bg-slate-50">
                            <div className="flex items-center h-5">
                                <input id="pressureUlcer" type="checkbox" {...register('hasPressureUlcer')} className="w-4 h-4" />
                            </div>
                            <div className="flex-1 space-y-2">
                                <label htmlFor="pressureUlcer" className="font-medium">มีแผลกดทับ (Pressure Ulcer)</label>
                                {watch('hasPressureUlcer') && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input placeholder="ตำแหน่ง (Location)" {...register('pressureUlcerLocation')} />
                                        <Input placeholder="ระดับ (Stage)" {...register('pressureUlcerStage')} />
                                    </div>
                                )}
                            </div>
                        </div>

                        <FormField label="อุปกรณ์การแพทย์ (Medical Devices)">
                            <Input placeholder="NG Tube, Tracheostomy, Oxygen, etc." {...register('medicalDevices')} />
                        </FormField>
                    </CardContent>
                </Card>

                {/* 11. Social & Financial */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
                            <User className="w-5 h-5" />
                            11. สังคมและเศรษฐกิจ (Social & Financial)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label="ผู้ดูแลหลักเดิม (Primary Caregiver)">
                            <Input placeholder="ชื่อผู้ดูแล" {...register('primaryCaregiverName')} />
                        </FormField>
                        <FormField label="ความสัมพันธ์">
                            <Input placeholder="เช่น บุตร, คู่สมรส, จ้างผู้ดูแล" {...register('primaryCaregiverRelation')} />
                        </FormField>
                        <FormField label="สิทธิการรักษา (Privilege)">
                            <Select {...register('healthPrivilege')}>
                                <option value="SELF_PAY">ชำระเอง (Self-pay)</option>
                                <option value="SOCIAL_SECURITY">ประกันสังคม</option>
                                <option value="GOLD_CARD">บัตรทอง (30 บาท)</option>
                                <option value="GOVERNMENT_OFFICER">ข้าราชการ/เบิกตรง</option>
                            </Select>
                        </FormField>
                        <FormField label="ผู้รับผิดชอบค่าใช้จ่าย (Sponsor)">
                            <Input placeholder="ระบุชื่อผู้จ่ายเงิน" {...register('sponsor')} />
                        </FormField>
                    </CardContent>
                </Card>

                {/* 12. Religion */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
                            <Heart className="w-5 h-5" />
                            12. ศาสนาและความเชื่อ (Religion)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label="ศาสนา">
                            <Input placeholder="พุทธ, คริสต์, อิสลาม" {...register('religion')} />
                        </FormField>
                        <FormField label="สิ่งยึดเหนี่ยวจิตใจ">
                            <Input placeholder="" {...register('spiritualNeeds')} />
                        </FormField>
                        <FormField label="ข้อห้าม/ข้อปฏิบัติ" className="md:col-span-2">
                            <Input placeholder="เช่น ไม่ทานหมู, สวดมนต์ก่อนนอน" {...register('religiousRestrictions')} />
                        </FormField>
                    </CardContent>
                </Card>

                {/* 13. Goals */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
                            <Cross className="w-5 h-5" />
                            13. ความคาดหวัง (Goals & Expectations)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField label="เป้าหมายการดูแล (Goal of Care)">
                            <Select {...register('goalOfCare')}>
                                <option value="REHABILITATION">ฟื้นฟูสภาพ (Rehabilitation)</option>
                                <option value="LONG_TERM_CARE">ดูแลระยะยาว (Long-term)</option>
                                <option value="PALLIATIVE">ประคับประคอง (Palliative)</option>
                            </Select>
                        </FormField>
                        <FormField label="รายละเอียดความคาดหวัง">
                            <TextareaField rows={3} placeholder="สิ่งที่ญาติคาดหวังจากการดูแล" {...register('expectationDetails')} />
                        </FormField>
                    </CardContent>
                </Card>

                {/* 14. Environment */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
                            <Home className="w-5 h-5" />
                            14. สภาพแวดล้อมและผังครอบครัว
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label="ที่พักอาศัยเดิม">
                            <Select {...register('homeType')}>
                                <option value="">ไม่ได้ระบุ</option>
                                <option value="SINGLE_HOUSE">บ้านเดี่ยว</option>
                                <option value="TOWNHOUSE">ตึกแถว/ทาวน์เฮาส์</option>
                            </Select>
                        </FormField>
                        <FormField label="ห้องนอนอยู่ชั้นไหน">
                            <Input placeholder="ชั้นล่าง / ชั้นบน" {...register('bedroomLocation')} />
                        </FormField>
                        <FormField label="ผังครอบครัว (Genogram Summary)" className="md:col-span-2">
                            <TextareaField rows={3} placeholder="อธิบายผังครอบครัวโดยสังเขป" {...register('familyGenogram')} />
                        </FormField>
                    </CardContent>
                </Card>

                {/* 15. Assessor Signature Placeholder */}
                <Card className="bg-slate-50 border-dashed">
                    <CardContent className="pt-6 flex flex-col items-end gap-4">
                        <div className="w-64 border-b border-gray-400 h-8"></div>
                        <p className="mr-8 text-sm text-gray-500">ลงชื่อผู้ประเมิน (Assessor Signature)</p>
                    </CardContent>
                </Card>

                {/* Old Address fields - Hidden or minimal for schema compatibility if required, or keep as optional section at bottom */}
                <details className="text-sm text-gray-400">
                    <summary>ข้อมูลที่อยู่ตามทะเบียนบ้าน (ถ้ามี)</summary>
                    <div className="p-4 bg-gray-50 rounded mt-2 grid grid-cols-2 gap-4">
                        <Input {...register('address')} placeholder="ที่อยู่" />
                        <Input {...register('province')} placeholder="จังหวัด" />
                        <Input {...register('district')} placeholder="เขต/อำเภอ" />
                        <Input {...register('subDistrict')} placeholder="แขวง/ตำบล" />
                        <Input {...register('postalCode')} placeholder="รหัสไปรษณีย์" />
                    </div>
                </details>

                {/* Action Buttons */}
                <div className="sticky bottom-4 z-10 flex justify-end gap-4 bg-white/80 p-4 backdrop-blur-sm rounded-xl border shadow-lg">
                    <Link href="/dashboard/elderly">
                        <Button variant="outline" type="button" size="lg">
                            ยกเลิก (Cancel)
                        </Button>
                    </Link>
                    <Button type="submit" disabled={isSubmitting} size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[200px]">
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                กำลังบันทึก...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5 mr-2" />
                                บันทึกข้อมูล (Save)
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}

function FormField({
    label,
    error,
    children,
    className = '',
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {label}
            </label>
            {children}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}
