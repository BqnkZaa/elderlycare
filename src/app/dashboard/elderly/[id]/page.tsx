/**
 * Edit Elderly Profile Page
 */

'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { elderlyProfileSchema, type ElderlyProfileInput } from '@/lib/validations';
import { getElderlyProfile, updateElderlyProfile } from '@/actions/elderly.actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentList } from '@/components/lists/AppointmentList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NativeSelect as Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
    ArrowLeft,
    Save,
    User,
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

// Reusing TextareaField local component concept
const TextareaField = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }) => (
    <div className="space-y-1">
        <Textarea
            {...props}
            className={`${props.className} ${props.error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
        />
        {props.error && <p className="text-red-500 text-xs">{props.error}</p>}
    </div>
);

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

export default function EditElderlyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { data: session } = useSession();
    const isReadOnly = session?.user?.role === 'NURSE';

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<ElderlyProfileInput>({
        resolver: zodResolver(elderlyProfileSchema) as any,
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await getElderlyProfile(id);
                if (result.success && result.data) {
                    const data = result.data;
                    // Format dates for input fields
                    const formattedData = {
                        ...data,
                        admissionDate: data.admissionDate ? new Date(data.admissionDate) : new Date(),
                        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : '', // Hidden field
                        // Ensure nulls are handled (Zod might expect optional strings, not nulls)
                        nickname: data.nickname || '',
                        education: data.education || '',
                        proudFormerOccupation: data.proudFormerOccupation || '',
                        preferredPronouns: data.preferredPronouns || '',
                    };
                    reset(formattedData as any);
                } else {
                    setSubmitResult({ success: false, message: 'ไม่พบข้อมูลผู้สูงอายุ (Profile not found)' });
                }
            } catch (error) {
                console.error("Fetch error:", error);
                setSubmitResult({ success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [id, reset]);

    const onSubmit = async (data: ElderlyProfileInput) => {
        setIsSubmitting(true);
        setSubmitResult(null);

        try {
            const result = await updateElderlyProfile(id, data);

            if (result.success) {
                setSubmitResult({ success: true, message: 'บันทึกการแก้ไขสำเร็จ! (Updated Successfully)' });
                window.scrollTo({ top: 0, behavior: 'smooth' });
                // Don't redirect immediately so they can see success message, or redirect back to list
                setTimeout(() => {
                    router.push('/dashboard/elderly');
                }, 1500);
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

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20">
            {/* Top Navigation */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/elderly">
                    <Button variant="ghost" size="icon" className="hover:bg-accent hover:text-accent-foreground">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        {isReadOnly ? 'รายละเอียดผู้สูงอายุ (Elderly Profile)' : 'แก้ไขข้อมูลผู้สูงอายุ (Edit Profile)'}
                    </h1>
                    <p className="text-muted-foreground">ID: {id}</p>
                </div>
            </div>

            {isReadOnly && (
                <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg flex items-center gap-2">
                    <Eye className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-medium">
                        คุณกำลังดูข้อมูลในโหมด "ดูอย่างเดียว" (View Only) - คุณไม่สามารถแก้ไขข้อมูลส่วนตัวได้
                    </p>
                </div>
            )}

            {/* Alert Messages */}
            {submitResult && (
                <div className={`flex items-center gap-2 p-4 rounded-lg border ${submitResult.success
                    ? 'bg-secondary/10 text-secondary border-secondary/20'
                    : 'bg-destructive/10 text-destructive border-destructive/20'
                    }`}>
                    {submitResult.success ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    {submitResult.message}
                </div>
            )}

            {Object.keys(errors).length > 0 && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-lg border border-destructive/20">
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
                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                        <TabsTrigger value="profile">ข้อมูลส่วนตัว (Profile)</TabsTrigger>
                        <TabsTrigger value="appointments">นัดหมายแพทย์ (Medical Appointments)</TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile" className="space-y-8">
                        {/* Header Section */}
                        <Card className="border-border shadow-sm bg-card/50 backdrop-blur-sm">
                            <CardHeader className="bg-accent/20 border-b border-border pb-4">
                                <CardTitle className="text-lg text-foreground">ส่วนหัว: ข้อมูลการรับเข้า (Admission Info)</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <FormField label="วันที่ลงทะเบียน *" error={errors.admissionDate?.message}>
                                        <Input type="date" {...register('admissionDate')} error={errors.admissionDate?.message} className="bg-background/50 border-input" />
                                    </FormField>
                                    <FormField label="เวลา *" error={errors.admissionTime?.message}>
                                        <Input type="time" {...register('admissionTime')} error={errors.admissionTime?.message} className="bg-background/50 border-input" />
                                    </FormField>
                                    <FormField label="รหัสผู้ป่วย (SAFE-ID) *" error={errors.safeId?.message}>
                                        <Input placeholder="SIDxxx69xxx" {...register('safeId')} error={errors.safeId?.message} className="font-mono uppercase bg-background/50 border-input" />
                                    </FormField>
                                    <FormField label="รหัสพันธมิตร" error={errors.partnerId?.message}>
                                        <Input placeholder="PID001-PID999" {...register('partnerId')} className="font-mono uppercase bg-background/50 border-input" />
                                    </FormField>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 1. Identification */}
                        <Card className="bg-card/50 backdrop-blur-sm border-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-primary">
                                    <User className="w-5 h-5" />
                                    1. ข้อมูลทั่วไป (Identification)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormField label="ชื่อ *" error={errors.firstName?.message}>
                                    <Input placeholder="สมชาย" {...register('firstName')} error={errors.firstName?.message} className="bg-background/50 border-input" />
                                </FormField>
                                <FormField label="นามสกุล *" error={errors.lastName?.message}>
                                    <Input placeholder="ใจดี" {...register('lastName')} error={errors.lastName?.message} className="bg-background/50 border-input" />
                                </FormField>
                                <FormField label="ชื่อเล่น">
                                    <Input placeholder="ลุงชาย" {...register('nickname')} className="bg-background/50 border-input" />
                                </FormField>

                                <FormField label="อายุ *" error={errors.age?.message}>
                                    <Input type="number" placeholder="75" {...register('age')} error={errors.age?.message} className="bg-background/50 border-input" />
                                </FormField>
                                <FormField label="เพศ *">
                                    <Select {...register('gender')} className="bg-background/50 border-input">
                                        <option value="MALE">ชาย (Male)</option>
                                        <option value="FEMALE">หญิง (Female)</option>
                                        <option value="OTHER">อื่นๆ (Other)</option>
                                    </Select>
                                </FormField>
                                <FormField label="สรรพนามที่ชอบให้เรียก">
                                    <Input placeholder="พ่อใหญ่, คุณตา" {...register('preferredPronouns')} className="bg-background/50 border-input" />
                                </FormField>

                                <FormField label="ระดับการศึกษาสูงสุด">
                                    <Input placeholder="ปริญญาตรี" {...register('education')} className="bg-background/50 border-input" />
                                </FormField>
                                <FormField label="อาชีพเดิมที่ภาคภูมิใจ" className="md:col-span-2">
                                    <Input placeholder="ครูใหญ่, ข้าราชการ" {...register('proudFormerOccupation')} className="bg-background/50 border-input" />
                                </FormField>

                                {/* Hidden/Computed fields maintained for schema compatibility */}
                                <input type="hidden" {...register('dateOfBirth')} />
                            </CardContent>
                        </Card>

                        {/* 2. Marital & Contact */}
                        <Card className="bg-card/50 backdrop-blur-sm border-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-primary">
                                    <Phone className="w-5 h-5" />
                                    2. สถานภาพและผู้ติดต่อ (Marital Status & Contacts)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField label="สถานภาพสมรส *">
                                        <Select {...register('maritalStatus')} className="bg-background/50 border-input">
                                            <option value="SINGLE">โสด (Single)</option>
                                            <option value="MARRIED">สมรส (Married)</option>
                                            <option value="WIDOWED">หม้าย (Widowed)</option>
                                            <option value="DIVORCED_SEPARATED">หย่าร้าง/แยกกันอยู่</option>
                                        </Select>
                                    </FormField>
                                </div>

                                <div className="border border-border p-4 rounded-md bg-accent/10 space-y-4">
                                    <h3 className="font-semibold text-sm text-foreground">ผู้ประสานงานหลัก (Key Coordinator)</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField label="ชื่อ-นามสกุล">
                                            <Input {...register('keyCoordinatorName')} className="bg-background/50 border-input" />
                                        </FormField>
                                        <FormField label="เบอร์โทรศัพท์">
                                            <Input {...register('keyCoordinatorPhone')} className="bg-background/50 border-input" />
                                        </FormField>
                                        <FormField label="ความสัมพันธ์">
                                            <Input {...register('keyCoordinatorRelation')} className="bg-background/50 border-input" />
                                        </FormField>
                                    </div>
                                </div>

                                <div className="border border-border p-4 rounded-md bg-accent/10 space-y-4">
                                    <h3 className="font-semibold text-sm text-foreground">ผู้ทำสัญญา/ตัดสินใจ (Contract Signer)</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField label="ชื่อ-นามสกุล">
                                            <Input {...register('legalGuardianName')} className="bg-background/50 border-input" />
                                        </FormField>
                                        <FormField label="เบอร์โทรศัพท์">
                                            <Input {...register('legalGuardianPhone')} className="bg-background/50 border-input" />
                                        </FormField>
                                        <FormField label="ความสัมพันธ์">
                                            <Input {...register('legalGuardianRelation')} className="bg-background/50 border-input" />
                                        </FormField>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 3. Sensory */}
                        <Card className="bg-card/50 backdrop-blur-sm border-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-primary">
                                    <Eye className="w-5 h-5" />
                                    3. ประสาทสัมผัส (Sensory & Communication)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormField label="การได้ยิน (Hearing)">
                                    <Select {...register('hearingStatus')} className="bg-background/50 border-input">
                                        <option value="NORMAL">ปกติ</option>
                                        <option value="HARD_OF_HEARING_LEFT">หูตึง (ซ้าย)</option>
                                        <option value="HARD_OF_HEARING_RIGHT">หูตึง (ขวา)</option>
                                        <option value="HARD_OF_HEARING_BOTH">หูตึง (2 ข้าง)</option>
                                        <option value="DEAF">หูหนวก</option>
                                        <option value="HEARING_AID">ใช้เครื่องช่วยฟัง</option>
                                    </Select>
                                </FormField>
                                <FormField label="การมองเห็น (Vision)">
                                    <Select {...register('visionStatus')} className="bg-background/50 border-input">
                                        <option value="NORMAL">ปกติ</option>
                                        <option value="NEARSIGHTED_FARSIGHTED">สายตาสั้น/ยาว</option>
                                        <option value="CATARACT_GLAUCOMA">ต้อกระจก/ต้อหิน</option>
                                        <option value="GLASSES">สวมแว่นตา</option>
                                        <option value="CONTACT_LENS">คอนแทคเลนส์</option>
                                    </Select>
                                </FormField>
                                <FormField label="การสื่อสาร (Speech)">
                                    <Select {...register('speechStatus')} className="bg-background/50 border-input">
                                        <option value="CLEAR">พูดชัดเจน</option>
                                        <option value="DYSARTHRIA">พูดไม่ชัด (Dysarthria)</option>
                                        <option value="APHASIA">บกพร่องการสื่อความ</option>
                                        <option value="NON_VERBAL">ไม่พูด</option>
                                    </Select>
                                </FormField>
                            </CardContent>
                        </Card>

                        {/* 4. Mobility */}
                        <Card className="bg-card/50 backdrop-blur-sm border-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-primary">
                                    <Accessibility className="w-5 h-5" />
                                    4. การเคลื่อนไหว (Mobility & Fall Risk)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-4 border border-border p-4 rounded bg-accent/20">
                                    <div className="flex items-center h-5">
                                        <input id="historyOfFalls" type="checkbox" {...register('historyOfFalls')} className="w-4 h-4 rounded border-input text-primary focus:ring-primary bg-background" />
                                    </div>
                                    <div className="flex-1 text-sm">
                                        <label htmlFor="historyOfFalls" className="font-medium text-foreground">มีประวัติการหกล้ม (History of Falls)</label>
                                        {watch('historyOfFalls') && (
                                            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <Input placeholder="ช่วงเวลา (เช่น 6 เดือนที่ผ่านมา)" {...register('fallsTimeframe')} className="bg-background/50 border-input" />
                                                <Input placeholder="สาเหตุการหกล้ม" {...register('fallsCause')} className="bg-background/50 border-input" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField label="การเดิน (Gait)">
                                        <Select {...register('gaitStatus')} className="bg-background/50 border-input">
                                            <option value="INDEPENDENT">เดินเองได้</option>
                                            <option value="UNSTEADY">เดินเซ</option>
                                            <option value="NEEDS_SUPPORT">ต้องพยุงเดิน</option>
                                            <option value="NON_AMBULATORY_BEDRIDDEN">เดินไม่ได้/ติดเตียง</option>
                                        </Select>
                                    </FormField>
                                    <FormField label="อุปกรณ์ช่วย (ระบุ เช่น ไม้เท้า, วอล์คเกอร์)">
                                        <Input placeholder="ไม้เท้า, วอล์คเกอร์, รถเข็น" {...register('assistiveDevices')} className="bg-background/50 border-input" />
                                    </FormField>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 5. Elimination */}
                        <Card className="bg-card/50 backdrop-blur-sm border-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-primary">
                                    <Utensils className="w-5 h-5" />
                                    5. การขับถ่าย (Elimination)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4 border border-border p-4 rounded bg-accent/5">
                                    <h3 className="font-semibold text-sm text-foreground">ปัสสาวะ (Bladder)</h3>
                                    <Select {...register('bladderControl')} className="bg-background/50 border-input">
                                        <option value="CONTINENT">กลั้นได้ปกติ</option>
                                        <option value="OCCASIONAL_INCONTINENCE">กลั้นไม่ได้บางครั้ง</option>
                                        <option value="TOTAL_INCONTINENCE_FOLEY">กลั้นไม่ได้เลย/ใส่สายสวน</option>
                                    </Select>
                                    <FormField label="ขนาดสายสวน (Foley Size) ถ้ามี">
                                        <Input {...register('foleySize')} placeholder="เบอร์ 14/16" className="bg-background/50 border-input" />
                                    </FormField>
                                </div>
                                <div className="space-y-4 border border-border p-4 rounded bg-accent/5">
                                    <h3 className="font-semibold text-sm text-foreground">อุจจาระ (Bowel)</h3>
                                    <Select {...register('bowelControl')} className="bg-background/50 border-input">
                                        <option value="NORMAL">ขับถ่ายปกติ</option>
                                        <option value="CONSTIPATION">ท้องผูก</option>
                                        <option value="DIARRHEA">ท้องเสีย</option>
                                        <option value="INCONTINENCE">กลั้นไม่ได้</option>
                                    </Select>
                                </div>
                                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField label="การใช้ผ้าอ้อม (Diaper)">
                                        <Select {...register('diaperType')} className="bg-background/50 border-input">
                                            <option value="NONE">ไม่ใช้</option>
                                            <option value="TAPE">แบบเทป (Tape)</option>
                                            <option value="PANTS">แบบกางเกง (Pants)</option>
                                        </Select>
                                    </FormField>
                                    <FormField label="ไซส์ผ้าอ้อม">
                                        <Input {...register('diaperSize')} placeholder="M, L, XL" className="bg-background/50 border-input" />
                                    </FormField>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 6. Cognitive */}
                        <Card className="bg-card/50 backdrop-blur-sm border-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-primary">
                                    <Brain className="w-5 h-5" />
                                    6. สภาวะสมองและพฤติกรรม (Cognitive)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="flex items-center h-5">
                                        <input id="hasConfusion" type="checkbox" {...register('hasConfusion')} className="w-4 h-4 rounded border-input text-primary focus:ring-primary bg-background" />
                                    </div>
                                    <div className="flex-1 text-sm">
                                        <label htmlFor="hasConfusion" className="font-medium text-foreground">มีภาวะสับสน (Confusion)</label>
                                        {watch('hasConfusion') && (
                                            <Input className="mt-2 bg-background/50 border-input" placeholder="ระบุช่วงเวลาที่มีอาการ" {...register('confusionTimeframe')} />
                                        )}
                                    </div>
                                </div>

                                <FormField label="ความจำ (Memory) - เลือกได้หลายข้อ (ระบุเป็นข้อความ)">
                                    <Input placeholder="เช่น ความจำสั้น, หลงลืม, จำญาติไม่ได้" {...register('memoryStatus')} className="bg-background/50 border-input" />
                                </FormField>

                                <FormField label="พฤติกรรม (Behavior) - (เช่น ก้าวร้าว, ซึมเศร้า, เดินไปเรื่อย)">
                                    <Input placeholder="ระบุพฤติกรรม..." {...register('behaviorStatus')} className="bg-background/50 border-input" />
                                </FormField>
                            </CardContent>
                        </Card>

                        {/* 7. Chief Complaint */}
                        <Card className="bg-card/50 backdrop-blur-sm border-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-primary">
                                    <FileText className="w-5 h-5" />
                                    7. อาการแรกรับ (Chief Complaint)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField label="สาเหตุที่มา (Reason for Admission)">
                                    <TextareaField rows={3} {...register('reasonForAdmission')} className="bg-background/50 border-input" />
                                </FormField>
                                <FormField label="สภาพจิตใจแรกรับ (Initial Mental State)">
                                    <Input placeholder="เช่น วิตกกังวล, นิ่งเฉย, ร่าเริง" {...register('initialMentalState')} className="bg-background/50 border-input" />
                                </FormField>
                            </CardContent>
                        </Card>

                        {/* 8. Medical History */}
                        <Card className="bg-card/50 backdrop-blur-sm border-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-primary">
                                    <Activity className="w-5 h-5" />
                                    8. ประวัติเจ็บป่วย (Medical History)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField label="โรคประจำตัว (Underlying Diseases)">
                                    <TextareaField rows={2} placeholder="ระบุโรคประจำตัวทั้งหมด" {...register('underlyingDiseases')} className="bg-background/50 border-input" />
                                </FormField>
                                <FormField label="ยาประจำ (Current Medications)">
                                    <TextareaField rows={2} placeholder="ระบุชื่อยาและขนาด" {...register('currentMedications')} className="bg-background/50 border-input" />
                                </FormField>
                                <FormField label="ประวัติผ่าตัด (Surgical History)">
                                    <Input placeholder="ระบุการผ่าตัดและปีที่ทำ" {...register('surgicalHistory')} className="bg-background/50 border-input" />
                                </FormField>
                            </CardContent>
                        </Card>



                        {/* 9. Allergies */}
                        <Card className="bg-card/50 backdrop-blur-sm border-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-primary">
                                    <AlertCircle className="w-5 h-5" />
                                    9. ประวัติการแพ้ (Allergies)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 border border-border p-3 rounded bg-accent/5">
                                        <div className="flex items-center gap-2">
                                            <input id="drugAllergy" type="checkbox" {...register('hasDrugAllergies')} className="w-4 h-4 rounded border-input text-primary focus:ring-primary bg-background" />
                                            <label htmlFor="drugAllergy" className="font-medium text-foreground">แพ้ยา (Drug Allergy)</label>
                                        </div>
                                        {watch('hasDrugAllergies') && (
                                            <Input placeholder="ระบุชื่อยาและอาการแพ้" {...register('drugAllergiesDetail')} className="bg-background/50 border-input" />
                                        )}
                                    </div>
                                    <div className="space-y-2 border border-border p-3 rounded bg-accent/5">
                                        <div className="flex items-center gap-2">
                                            <input id="foodAllergy" type="checkbox" {...register('hasFoodChemicalAllergies')} className="w-4 h-4 rounded border-input text-primary focus:ring-primary bg-background" />
                                            <label htmlFor="foodAllergy" className="font-medium text-foreground">แพ้อาหาร/สารเคมี</label>
                                        </div>
                                        {watch('hasFoodChemicalAllergies') && (
                                            <Input placeholder="ระบุสิ่งที่แพ้และอาการ" {...register('foodChemicalAllergiesDetail')} className="bg-background/50 border-input" />
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 10. Physical & Devices */}
                        <Card className="bg-card/50 backdrop-blur-sm border-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-primary">
                                    <Activity className="w-5 h-5" />
                                    10. สภาพร่างกายและอุปกรณ์ (Physical & Devices)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField label="สภาพผิวหนัง (Skin)">
                                    <Input placeholder="ปกติ, แห้ง, คัน, มีรอยฟกช้ำ" {...register('skinCondition')} className="bg-background/50 border-input" />
                                </FormField>

                                <div className="flex items-start gap-4 border border-border p-4 rounded bg-accent/20">
                                    <div className="flex items-center h-5">
                                        <input id="pressureUlcer" type="checkbox" {...register('hasPressureUlcer')} className="w-4 h-4 rounded border-input text-primary focus:ring-primary bg-background" />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <label htmlFor="pressureUlcer" className="font-medium text-foreground">มีแผลกดทับ (Pressure Ulcer)</label>
                                        {watch('hasPressureUlcer') && (
                                            <div className="grid grid-cols-2 gap-4">
                                                <Input placeholder="ตำแหน่ง (Location)" {...register('pressureUlcerLocation')} className="bg-background/50 border-input" />
                                                <Input placeholder="ระดับ (Stage)" {...register('pressureUlcerStage')} className="bg-background/50 border-input" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <FormField label="อุปกรณ์การแพทย์ (Medical Devices)">
                                    <Input placeholder="NG Tube, Tracheostomy, Oxygen, etc." {...register('medicalDevices')} className="bg-background/50 border-input" />
                                </FormField>
                            </CardContent>
                        </Card>

                        {/* 11. Social & Financial */}
                        <Card className="bg-card/50 backdrop-blur-sm border-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-primary">
                                    <User className="w-5 h-5" />
                                    11. สังคมและเศรษฐกิจ (Social & Financial)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField label="ผู้ดูแลหลักเดิม (Primary Caregiver)">
                                    <Input placeholder="ชื่อผู้ดูแล" {...register('primaryCaregiverName')} className="bg-background/50 border-input" />
                                </FormField>
                                <FormField label="ความสัมพันธ์">
                                    <Input placeholder="เช่น บุตร, คู่สมรส, จ้างผู้ดูแล" {...register('primaryCaregiverRelation')} className="bg-background/50 border-input" />
                                </FormField>
                                <FormField label="สิทธิการรักษา (Privilege)">
                                    <Select {...register('healthPrivilege')} className="bg-background/50 border-input">
                                        <option value="SELF_PAY">ชำระเอง (Self-pay)</option>
                                        <option value="SOCIAL_SECURITY">ประกันสังคม</option>
                                        <option value="GOLD_CARD">บัตรทอง (30 บาท)</option>
                                        <option value="GOVERNMENT_OFFICER">ข้าราชการ/เบิกตรง</option>
                                    </Select>
                                </FormField>
                                <FormField label="ผู้รับผิดชอบค่าใช้จ่าย (Sponsor)">
                                    <Input placeholder="ระบุชื่อผู้จ่ายเงิน" {...register('sponsor')} className="bg-background/50 border-input" />
                                </FormField>
                            </CardContent>
                        </Card>

                        {/* 12. Religion */}
                        <Card className="bg-card/50 backdrop-blur-sm border-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-primary">
                                    <Heart className="w-5 h-5" />
                                    12. ศาสนาและความเชื่อ (Religion)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField label="ศาสนา">
                                    <Input placeholder="พุทธ, คริสต์, อิสลาม" {...register('religion')} className="bg-background/50 border-input" />
                                </FormField>
                                <FormField label="สิ่งยึดเหนี่ยวจิตใจ">
                                    <Input placeholder="" {...register('spiritualNeeds')} className="bg-background/50 border-input" />
                                </FormField>
                                <FormField label="ข้อห้าม/ข้อปฏิบัติ" className="md:col-span-2">
                                    <Input placeholder="เช่น ไม่ทานหมู, สวดมนต์ก่อนนอน" {...register('religiousRestrictions')} className="bg-background/50 border-input" />
                                </FormField>
                            </CardContent>
                        </Card>

                        {/* 13. Goals */}
                        <Card className="bg-card/50 backdrop-blur-sm border-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-primary">
                                    <Cross className="w-5 h-5" />
                                    13. ความคาดหวัง (Goals & Expectations)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField label="เป้าหมายการดูแล (Goal of Care)">
                                    <Select {...register('goalOfCare')} className="bg-background/50 border-input">
                                        <option value="REHABILITATION">ฟื้นฟูสภาพ (Rehabilitation)</option>
                                        <option value="LONG_TERM_CARE">ดูแลระยะยาว (Long-term)</option>
                                        <option value="PALLIATIVE">ประคับประคอง (Palliative)</option>
                                    </Select>
                                </FormField>
                                <FormField label="รายละเอียดความคาดหวัง">
                                    <TextareaField rows={3} placeholder="สิ่งที่ญาติคาดหวังจากการดูแล" {...register('expectationDetails')} className="bg-background/50 border-input" />
                                </FormField>
                            </CardContent>
                        </Card>

                        {/* 14. Environment */}
                        <Card className="bg-card/50 backdrop-blur-sm border-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-primary">
                                    <Home className="w-5 h-5" />
                                    14. สภาพแวดล้อมและผังครอบครัว
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField label="ที่พักอาศัยเดิม">
                                    <Select {...register('homeType')} className="bg-background/50 border-input">
                                        <option value="">ไม่ได้ระบุ</option>
                                        <option value="SINGLE_HOUSE">บ้านเดี่ยว</option>
                                        <option value="TOWNHOUSE">ตึกแถว/ทาวน์เฮาส์</option>
                                    </Select>
                                </FormField>
                                <FormField label="ห้องนอนอยู่ชั้นไหน">
                                    <Input placeholder="ชั้นล่าง / ชั้นบน" {...register('bedroomLocation')} className="bg-background/50 border-input" />
                                </FormField>
                                <FormField label="ผังครอบครัว (Genogram Summary)" className="md:col-span-2">
                                    <TextareaField rows={3} placeholder="อธิบายผังครอบครัวโดยสังเขป" {...register('familyGenogram')} className="bg-background/50 border-input" />
                                </FormField>
                            </CardContent>
                        </Card>

                        {/* Action Buttons inside Form */}
                        {!isReadOnly && (
                            <div className="sticky bottom-4 z-10 flex justify-end gap-4 bg-background/80 p-4 backdrop-blur-sm rounded-xl border border-border shadow-lg">
                                <Link href="/dashboard/elderly">
                                    <Button variant="outline" type="button" size="lg" className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50">
                                        ยกเลิก (Cancel)
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={isSubmitting} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[200px] shadow-lg shadow-primary/20">
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
                                            บันทึกการแก้ไข (Update)
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="appointments">
                        <AppointmentList elderlyId={id} />
                    </TabsContent>
                </Tabs>

            </form>
        </div>
    );
}
