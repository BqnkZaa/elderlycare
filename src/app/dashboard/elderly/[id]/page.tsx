/**
 * Edit Elderly Profile Page
 *
 * 2-section form for elderly admission based on new requirements.
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
import {
    ArrowLeft,
    Save,
    User,
    Eye,
    AlertCircle,
    Check,
    ClipboardList,
} from 'lucide-react';

const TextareaField = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }) => (
    <div className="space-y-1">
        <textarea
            {...props}
            className={`flex min-h-[80px] w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${props.className} ${props.error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
        />
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
            <label className="block text-sm font-medium text-foreground mb-1">
                {label}
            </label>
            {children}
            {error && <p className="text-destructive text-xs mt-1">{error}</p>}
        </div>
    );
}

function RadioGroupField({ label, name, options, register, error, disabled }: any) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">{label}</label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {options.map((opt: any) => (
                    <label key={opt.value} className={`flex items-center space-x-2 border border-border/50 p-2 rounded-md ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:bg-accent/10'}`}>
                        <input
                            type="radio"
                            value={opt.value}
                            {...register(name)}
                            disabled={disabled}
                            className="w-4 h-4 text-primary focus:ring-primary border-gray-300 disabled:opacity-50"
                        />
                        <span className="text-sm font-medium">{opt.label}</span>
                    </label>
                ))}
            </div>
            {error && <p className="text-destructive text-xs mt-1">{error}</p>}
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
                    const formattedData = {
                        ...data,
                        admissionDate: data.admissionDate ? new Date(data.admissionDate).toISOString().split('T')[0] : '', // Format for date input natively
                        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : '', // Hidden field
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

    const watchGender = watch('gender');
    const watchMaritalStatus = watch('maritalStatus');
    const watchChildrenCount = watch('childrenCount');
    const watchFormerOccupation = watch('formerOccupation');
    const watchHealthPrivilege = watch('healthPrivilege');
    const watchLifeInsurance = watch('hasLifeInsurance');
    const watchCurrentLocation = watch('currentLocation');

    // Part 2 Watches
    const watchSelfHelp = watch('selfHelpStatus');
    const watchEating = watch('eatingStatus');
    const watchTrach = watch('hasTracheostomy');
    const watchBedsore = watch('bedsoreStatus');
    const watchAirMattress = watch('useAirMattress');
    const watchOxygen = watch('oxygenSupport');
    const watchVentilator = watch('useVentilator');
    const watchPsych = watch('psychiatricStatus');
    const watchAggressive = watch('hasAggressiveBehavior');
    const watchPsychMed = watch('hasPsychiatricMedication');
    const watchSpecialMed = watch('hasSpecialMedication');

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-20">
            {/* Top Navigation */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/elderly">
                    <Button variant="ghost" size="icon">
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
                <div className="bg-destructive/10 text-destructive p-4 rounded-lg border border-destructive/20 mb-6">
                    <p className="font-bold flex items-center gap-2 text-lg">
                        <AlertCircle className="w-5 h-5" /> พบข้อผิดพลาด กรุณากรอกข้อมูลให้ครบ:
                    </p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm pl-2 mt-2">
                        {Object.entries(errors).map(([key, error]) => (
                            <li key={key} className="flex items-start gap-2">
                                <span className="text-destructive/70 mt-1.5 w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                                <span>{error?.message}</span>
                            </li>
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

                        <Card className="border-border shadow-sm bg-card/50 backdrop-blur-sm">
                            <CardHeader className="bg-accent/20 border-b border-border pb-4">
                                <CardTitle className="text-lg text-foreground flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5" />
                                    ข้อมูลที่จำเป็นของระบบ (System Fields)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormField label="รหัสผู้ป่วย (SAFE-ID) *" error={errors.safeId?.message}>
                                    <Input placeholder="SIDxxx69xxx" {...register('safeId')} disabled={isReadOnly} className="font-mono uppercase bg-background/50" />
                                </FormField>
                                <FormField label="ชื่อจริงผู้สูงอายุ *" error={errors.firstName?.message}>
                                    <Input placeholder="สมชาย" {...register('firstName')} disabled={isReadOnly} className="bg-background/50" />
                                </FormField>
                                <FormField label="นามสกุลผู้สูงอายุ *" error={errors.lastName?.message}>
                                    <Input placeholder="ใจดี" {...register('lastName')} disabled={isReadOnly} className="bg-background/50" />
                                </FormField>
                            </CardContent>
                        </Card>

                        {/* ส่วนที่ 1 ข้อมูลผู้ติดต่อ/ผู้สูงอายุ */}
                        <Card className="bg-card/50 backdrop-blur-sm border-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-primary">
                                    <User className="w-5 h-5" />
                                    ส่วนที่ 1 ข้อมูลผู้สูงอายุ / ผู้ติดต่อ
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField label="1. ชื่อผู้ติดต่อ" error={errors.keyCoordinatorName?.message}>
                                        <Input placeholder="ชื่อ-นามสกุล" {...register('keyCoordinatorName')} disabled={isReadOnly} className="bg-background/50" />
                                    </FormField>
                                    <FormField label="2. เบอร์โทร" error={errors.keyCoordinatorPhone?.message}>
                                        <Input placeholder="เบอร์โทรศัพท์" {...register('keyCoordinatorPhone')} disabled={isReadOnly} className="bg-background/50" />
                                    </FormField>
                                    <FormField label="3. วัน/เดือน/ปี ที่รับเข้า" error={errors.admissionDate?.message}>
                                        <Input type="date" {...register('admissionDate')} disabled={isReadOnly} className="bg-background/50" />
                                    </FormField>
                                    <FormField label="เวลา" error={errors.admissionTime?.message}>
                                        <Input type="time" {...register('admissionTime')} disabled={isReadOnly} className="bg-background/50" />
                                    </FormField>
                                    <FormField label="4. ชื่อเล่นผู้สูงอายุ" error={errors.nickname?.message}>
                                        <Input placeholder="ชื่อเล่น" {...register('nickname')} disabled={isReadOnly} className="bg-background/50" />
                                    </FormField>
                                    <FormField label="5. สรรพนามที่เรียกท่านตอนอยู่ที่บ้าน" error={errors.preferredPronouns?.message}>
                                        <Input placeholder="เช่น อาม่า, คุณตา" {...register('preferredPronouns')} disabled={isReadOnly} className="bg-background/50" />
                                    </FormField>
                                    <FormField label="6. อายุ" error={errors.age?.message}>
                                        <Input type="number" placeholder="อายุ" {...register('age')} disabled={isReadOnly} className="bg-background/50" />
                                    </FormField>
                                </div>

                                <div className="space-y-6 border-t pt-4">
                                    <RadioGroupField
                                        label="7. เพศ"
                                        name="gender"
                                        register={register}
                                        disabled={isReadOnly}
                                        options={[
                                            { label: 'ชาย', value: 'MALE' },
                                            { label: 'หญิง', value: 'FEMALE' },
                                            { label: 'เพศทางเลือก', value: 'OTHER' },
                                        ]}
                                    />
                                    {watchGender === 'OTHER' && (
                                        <FormField label="ระบุเพศทางเลือก">
                                            <Input placeholder="ระบุ..." {...register('genderOther')} disabled={isReadOnly} className="bg-background/50" />
                                        </FormField>
                                    )}

                                    <RadioGroupField
                                        label="8. สถานภาพสมรส"
                                        name="maritalStatus"
                                        register={register}
                                        disabled={isReadOnly}
                                        options={[
                                            { label: 'โสด', value: 'SINGLE' },
                                            { label: 'มีคู่ครอง', value: 'PARTNERED' },
                                            { label: 'สมรส', value: 'MARRIED' },
                                            { label: 'หย่าร้าง', value: 'DIVORCED_SEPARATED' },
                                        ]}
                                    />

                                    <RadioGroupField
                                        label="9. บุตร"
                                        name="childrenCount"
                                        register={register}
                                        disabled={isReadOnly}
                                        options={[
                                            { label: 'มี 1 ท่าน', value: 'ONE' },
                                            { label: 'มี 2 ท่าน', value: 'TWO' },
                                            { label: 'มี 3 ท่าน', value: 'THREE' },
                                            { label: 'มี 4 ท่าน', value: 'FOUR' },
                                            { label: 'มี 5 ท่านขึ้นไป', value: 'FIVE_OR_MORE' },
                                            { label: 'ไม่มี', value: 'NONE' },
                                        ]}
                                    />

                                    <RadioGroupField
                                        label="10. ท่านเคยประกอบอาชีพอะไร"
                                        name="formerOccupation"
                                        register={register}
                                        disabled={isReadOnly}
                                        options={[
                                            { label: 'ค้าขาย', value: 'COMMERCE' },
                                            { label: 'บริการ', value: 'SERVICE' },
                                            { label: 'อื่นๆ', value: 'OTHER' },
                                        ]}
                                    />
                                    {watchFormerOccupation === 'OTHER' && (
                                        <FormField label="ระบุอาชีพอื่นๆ">
                                            <Input placeholder="ระบุ..." {...register('formerOccupationOther')} disabled={isReadOnly} className="bg-background/50" />
                                        </FormField>
                                    )}

                                    <RadioGroupField
                                        label="11. ใช้สิทธิสุขภาพเบิกจ่ายที่ไหน"
                                        name="healthPrivilege"
                                        register={register}
                                        disabled={isReadOnly}
                                        options={[
                                            { label: '30 บาท', value: 'GOLD_CARD' },
                                            { label: 'ประกันสังคม', value: 'SOCIAL_SECURITY' },
                                            { label: 'สิทธิ์ราชการ', value: 'GOVERNMENT_OFFICER' },
                                            { label: 'จ่ายเอง', value: 'SELF_PAY' },
                                        ]}
                                    />

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-foreground">12. ประกันชีวิต</label>
                                        <div className="flex gap-4">
                                            <label className={`flex items-center space-x-2 ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}>
                                                <input type="radio" value="true" {...register('hasLifeInsurance')} disabled={isReadOnly} className="w-4 h-4 text-primary" />
                                                <span>มี</span>
                                            </label>
                                            <label className={`flex items-center space-x-2 ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}>
                                                <input type="radio" value="false" {...register('hasLifeInsurance')} disabled={isReadOnly} className="w-4 h-4 text-primary" />
                                                <span>ไม่มี</span>
                                            </label>
                                        </div>
                                    </div>

                                    <FormField label="13. ต้นสังกัดโรงพยาบาล">
                                        <Input placeholder="ระบุ..." {...register('hospitalAffiliation')} disabled={isReadOnly} className="bg-background/50 max-w-md" />
                                    </FormField>

                                    <RadioGroupField
                                        label="14. ตอนนี้ผู้ป่วยอยู่ที่ไหน"
                                        name="currentLocation"
                                        register={register}
                                        disabled={isReadOnly}
                                        options={[
                                            { label: 'บ้าน', value: 'HOME' },
                                            { label: 'โรงพยาบาล', value: 'HOSPITAL' },
                                            { label: 'ศูนย์ดูแลผู้สูงอายุ', value: 'CARE_CENTER' },
                                        ]}
                                    />

                                    <FormField label="15. ภาวะ อาการ เบื้องต้นตอนนี้อย่างไรบ้าง">
                                        <TextareaField placeholder="ระบุ..." rows={3} {...register('initialSymptoms')} disabled={isReadOnly} />
                                    </FormField>
                                </div>
                            </CardContent>
                        </Card>

                        {/* ส่วนที่ 2 ข้อมูลประเมินผู้สูงอายุและศูนย์ดูแล */}
                        <Card className="bg-card/50 backdrop-blur-sm border-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-primary">
                                    <ClipboardList className="w-5 h-5" />
                                    ส่วนที่ 2 ข้อมูลประเมินผู้สูงอายุและศูนย์ดูแล
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">

                                <RadioGroupField
                                    label="การช่วยเหลือตัวเอง"
                                    name="selfHelpStatus"
                                    register={register}
                                    disabled={isReadOnly}
                                    options={[
                                        { label: 'ได้ด้วยตัวเอง ไม่ติดเตียง', value: 'INDEPENDENT_NON_BEDRIDDEN' },
                                        { label: 'ได้ด้วยตัวเอง ติดเตียง', value: 'INDEPENDENT_BEDRIDDEN' },
                                        { label: 'ช่วยเหลือตัวเองไม่ได้และติดเตียง', value: 'DEPENDENT_BEDRIDDEN' },
                                    ]}
                                />

                                <RadioGroupField
                                    label="การทานอาหาร"
                                    name="eatingStatus"
                                    register={register}
                                    disabled={isReadOnly}
                                    options={[
                                        { label: 'ทานเองได้ อาหารปกติ', value: 'EAT_NORMAL' },
                                        { label: 'ทานเองได้ อาหารอ่อน/ต้ม', value: 'EAT_SOFT' },
                                        { label: 'ต้องมีคนป้อน', value: 'NEEDS_FEEDING' },
                                        { label: 'อาหารฟีด', value: 'TUBE_FEEDING' },
                                    ]}
                                />

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-foreground">เจาะคอ</label>
                                    <div className="flex gap-4">
                                        <label className={`flex items-center space-x-2 ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}>
                                            <input type="radio" value="true" {...register('hasTracheostomy')} disabled={isReadOnly} className="w-4 h-4 text-primary" />
                                            <span>เจาะ</span>
                                        </label>
                                        <label className={`flex items-center space-x-2 ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}>
                                            <input type="radio" value="false" {...register('hasTracheostomy')} disabled={isReadOnly} className="w-4 h-4 text-primary" />
                                            <span>ไม่เจาะ</span>
                                        </label>
                                    </div>
                                </div>

                                <RadioGroupField
                                    label="แผลกดทับ"
                                    name="bedsoreStatus"
                                    register={register}
                                    disabled={isReadOnly}
                                    options={[
                                        { label: 'ไม่มี', value: 'NONE' },
                                        { label: 'มี 1 จุด', value: 'ONE' },
                                        { label: 'มี 2 จุด', value: 'TWO' },
                                        { label: 'มีมากกว่า 3 จุด', value: 'MORE_THAN_THREE' },
                                    ]}
                                />

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-foreground">ที่นอนลม</label>
                                    <div className="flex gap-4">
                                        <label className={`flex items-center space-x-2 ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}>
                                            <input type="radio" value="true" {...register('useAirMattress')} disabled={isReadOnly} className="w-4 h-4 text-primary" />
                                            <span>ใช้</span>
                                        </label>
                                        <label className={`flex items-center space-x-2 ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}>
                                            <input type="radio" value="false" {...register('useAirMattress')} disabled={isReadOnly} className="w-4 h-4 text-primary" />
                                            <span>ไม่ใช้</span>
                                        </label>
                                    </div>
                                </div>

                                <RadioGroupField
                                    label="อ็อกซิเจน"
                                    name="oxygenSupport"
                                    register={register}
                                    disabled={isReadOnly}
                                    options={[
                                        { label: 'ไม่ใช้', value: 'NONE' },
                                        { label: 'ใช้ 5 ลิตร', value: 'LITERS_5' },
                                        { label: 'ใช้ 10 ลิตร', value: 'LITERS_10' },
                                        { label: 'ใช้ถังสำรองชั่วคราว', value: 'TEMPORARY_CYLINDER' },
                                    ]}
                                />

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-foreground">เครื่องช่วยหายใจ</label>
                                    <div className="flex gap-4">
                                        <label className={`flex items-center space-x-2 ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}>
                                            <input type="radio" value="true" {...register('useVentilator')} disabled={isReadOnly} className="w-4 h-4 text-primary" />
                                            <span>ใช้</span>
                                        </label>
                                        <label className={`flex items-center space-x-2 ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}>
                                            <input type="radio" value="false" {...register('useVentilator')} disabled={isReadOnly} className="w-4 h-4 text-primary" />
                                            <span>ไม่ใช้</span>
                                        </label>
                                    </div>
                                </div>

                                <RadioGroupField
                                    label="จิตเวช/อัลไซเมอร์/สมองเสื่อม"
                                    name="psychiatricStatus"
                                    register={register}
                                    disabled={isReadOnly}
                                    options={[
                                        { label: 'ไม่มี', value: 'NONE' },
                                        { label: 'มีอาการใดอาการหนึ่ง (ไม่มียา)', value: 'SYMPTOMS_NO_MEDS' },
                                        { label: 'มีอาการใดอาการหนึ่ง (มียา)', value: 'SYMPTOMS_WITH_MEDS' },
                                    ]}
                                />

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-foreground">โวยวาย/ด่าทอ/เสียงดัง</label>
                                    <div className="flex gap-4">
                                        <label className={`flex items-center space-x-2 ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}>
                                            <input type="radio" value="true" {...register('hasAggressiveBehavior')} disabled={isReadOnly} className="w-4 h-4 text-primary" />
                                            <span>มี</span>
                                        </label>
                                        <label className={`flex items-center space-x-2 ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}>
                                            <input type="radio" value="false" {...register('hasAggressiveBehavior')} disabled={isReadOnly} className="w-4 h-4 text-primary" />
                                            <span>ไม่มี</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-foreground">ยาคลายกังวล/ระงับอาการ/ปรับอารมณ์</label>
                                    <div className="flex gap-4">
                                        <label className={`flex items-center space-x-2 ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}>
                                            <input type="radio" value="true" {...register('hasPsychiatricMedication')} disabled={isReadOnly} className="w-4 h-4 text-primary" />
                                            <span>มี</span>
                                        </label>
                                        <label className={`flex items-center space-x-2 ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}>
                                            <input type="radio" value="false" {...register('hasPsychiatricMedication')} disabled={isReadOnly} className="w-4 h-4 text-primary" />
                                            <span>ไม่มี</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-foreground">การให้ยาพิเศษ (เปิดเส้น/ทำหัตการพิเศษ)</label>
                                    <div className="flex gap-4 mb-2">
                                        <label className={`flex items-center space-x-2 ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}>
                                            <input type="radio" value="false" {...register('hasSpecialMedication')} disabled={isReadOnly} className="w-4 h-4 text-primary" />
                                            <span>ไม่มี</span>
                                        </label>
                                        <label className={`flex items-center space-x-2 ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}>
                                            <input type="radio" value="true" {...register('hasSpecialMedication')} disabled={isReadOnly} className="w-4 h-4 text-primary" />
                                            <span>มี</span>
                                        </label>
                                    </div>
                                    {String(watchSpecialMed) === "true" && (
                                        <FormField label="ระบุ">
                                            <Input placeholder="ระบุการให้ยา/หัตถการ..." {...register('specialMedicationDetail')} disabled={isReadOnly} className="bg-background/50 max-w-md" />
                                        </FormField>
                                    )}
                                </div>

                            </CardContent>
                        </Card>

                        {/* ส่วนที่ 3 ข้อมูลสุขภาพและการประเมินความเสี่ยง */}
                        <Card className="bg-card/50 backdrop-blur-sm border-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-primary">
                                    <ClipboardList className="w-5 h-5" />
                                    ส่วนที่ 3 ข้อมูลสุขภาพและการประเมินความเสี่ยง
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                {/* 3.1 ADL */}
                                <div>
                                    <h3 className="text-xl font-bold text-primary flex items-center gap-2 mb-4">
                                        <ClipboardList className="w-5 h-5" />
                                        3.1 การประเมินความสามารถในการทำกิจวัตรประจำวัน (ADL - Barthel Index)
                                    </h3>
                                    <div className="space-y-6">
                                        <RadioGroupField
                                            label="การรับประทานอาหาร"
                                            name="adlEating"
                                            register={register}
                                            disabled={isReadOnly}
                                            options={[
                                                { label: 'ทำไม่ได้', value: 'CANNOT_EAT' },
                                                { label: 'ใส่สายยาง', value: 'TUBE_FED' },
                                                { label: 'ต้องการคนช่วยหรือป้อน', value: 'NEEDS_HELP' },
                                                { label: 'ทำได้ด้วยตนเอง', value: 'INDEPENDENT' },
                                            ]}
                                        />
                                        <RadioGroupField
                                            label="การล้างหน้า หวีผม แปรงฟัน"
                                            name="adlGrooming"
                                            register={register}
                                            disabled={isReadOnly}
                                            options={[
                                                { label: 'ต้องการความช่วยเหลือ', value: 'NEEDS_HELP' },
                                                { label: 'ทำได้ด้วยตนเอง', value: 'INDEPENDENT' },
                                            ]}
                                        />
                                        <RadioGroupField
                                            label="การอาบน้ำ"
                                            name="adlBathing"
                                            register={register}
                                            disabled={isReadOnly}
                                            options={[
                                                { label: 'ต้องการความช่วยเหลือ', value: 'NEEDS_HELP' },
                                                { label: 'ทำได้ด้วยตนเอง', value: 'INDEPENDENT' },
                                            ]}
                                        />
                                        <RadioGroupField
                                            label="การแต่งตัว"
                                            name="adlDressing"
                                            register={register}
                                            disabled={isReadOnly}
                                            options={[
                                                { label: 'ทำไม่ได้', value: 'CANNOT_DRESS' },
                                                { label: 'ต้องการคนช่วย', value: 'NEEDS_HELP' },
                                                { label: 'ทำได้ด้วยตนเอง', value: 'INDEPENDENT' },
                                            ]}
                                        />
                                        <RadioGroupField
                                            label="การกลั้นอุจจาระ (ใน 1 สัปดาห์)"
                                            name="adlBowel"
                                            register={register}
                                            disabled={isReadOnly}
                                            options={[
                                                { label: 'กลั้นไม่ได้', value: 'INCONTINENT' },
                                                { label: 'สวนอุจจาระ', value: 'ENEMA' },
                                                { label: 'กลั้นไม่ได้บางครั้ง', value: 'OCCASIONAL_INCONTINENCE' },
                                                { label: 'กลั้นได้ปกติ', value: 'CONTINENT' },
                                            ]}
                                        />
                                        <RadioGroupField
                                            label="การกลั้นปัสสาวะ (ใน 1 สัปดาห์)"
                                            name="adlBladder"
                                            register={register}
                                            disabled={isReadOnly}
                                            options={[
                                                { label: 'กลั้นไม่ได้', value: 'INCONTINENT' },
                                                { label: 'ใส่สายสวน', value: 'CATHETER' },
                                                { label: 'กลั้นไม่ได้บางครั้ง', value: 'OCCASIONAL_INCONTINENCE' },
                                                { label: 'กลั้นได้ปกติ', value: 'CONTINENT' },
                                            ]}
                                        />
                                        <RadioGroupField
                                            label="การใช้ห้องน้ำ"
                                            name="adlToilet"
                                            register={register}
                                            disabled={isReadOnly}
                                            options={[
                                                { label: 'ทำไม่ได้', value: 'CANNOT_USE' },
                                                { label: 'ต้องการคนช่วย', value: 'NEEDS_HELP' },
                                                { label: 'ทำได้ด้วยตนเอง', value: 'INDEPENDENT' },
                                            ]}
                                        />
                                        <RadioGroupField
                                            label="การเคลื่อนย้ายตัว (เตียง-รถเข็น)"
                                            name="adlTransfer"
                                            register={register}
                                            disabled={isReadOnly}
                                            options={[
                                                { label: 'ทำไม่ได้', value: 'CANNOT_TRANSFER' },
                                                { label: 'นั่งได้ต้องมีคนช่วย', value: 'NEEDS_HELP_SITTING' },
                                                { label: 'ต้องการคนช่วย', value: 'NEEDS_HELP' },
                                                { label: 'ทำได้ด้วยตนเอง', value: 'INDEPENDENT' },
                                            ]}
                                        />
                                        <RadioGroupField
                                            label="การเคลื่อนที่ (เดิน/รถเข็น)"
                                            name="adlMobility"
                                            register={register}
                                            disabled={isReadOnly}
                                            options={[
                                                { label: 'เคลื่อนที่ไม่ได้', value: 'IMMOBILE' },
                                                { label: 'ใช้รถเข็นได้เอง', value: 'WHEELCHAIR_INDEPENDENT' },
                                                { label: 'เดินได้ต้องมีคนช่วย', value: 'NEEDS_HELP_WALKING' },
                                                { label: 'เดินได้ด้วยตนเอง', value: 'INDEPENDENT' },
                                            ]}
                                        />
                                        <RadioGroupField
                                            label="การขึ้นลงบันได (1 ชั้น)"
                                            name="adlStairs"
                                            register={register}
                                            disabled={isReadOnly}
                                            options={[
                                                { label: 'ทำไม่ได้', value: 'CANNOT_CLIMB' },
                                                { label: 'ต้องการคนช่วย', value: 'NEEDS_HELP' },
                                                { label: 'ทำได้เอง', value: 'INDEPENDENT' },
                                            ]}
                                        />
                                    </div>
                                </div>

                                {/* 3.2 Medical Complexity */}
                                <div className="pt-8 border-t border-border/50">
                                    <h3 className="text-xl font-bold text-primary flex items-center gap-2 mb-4">
                                        <ClipboardList className="w-5 h-5" />
                                        3.2 ความซับซ้อนทางการแพทย์แบบเบื้องต้น (Medical Complexity)
                                    </h3>
                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <label className="block text-md font-bold text-foreground">ระบบทางเดินอาหารและขับถ่าย</label>
                                            <label className={`flex items-center space-x-2 ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}><input type="checkbox" {...register('hasNgt')} disabled={isReadOnly} className="w-4 h-4 text-primary" /><span>สายให้อาหารทางจมูก (NGT)</span></label>
                                            <label className={`flex items-center space-x-2 ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}><input type="checkbox" {...register('hasPeg')} disabled={isReadOnly} className="w-4 h-4 text-primary" /><span>สายให้อาหารทางหน้าท้อง (PEG)</span></label>
                                            <label className={`flex items-center space-x-2 ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}><input type="checkbox" {...register('hasFoleyCatheter')} disabled={isReadOnly} className="w-4 h-4 text-primary" /><span>สายสวนปัสสาวะ (Foley Catheter)</span></label>
                                            <label className={`flex items-center space-x-2 ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}><input type="checkbox" {...register('hasColostomy')} disabled={isReadOnly} className="w-4 h-4 text-primary" /><span>ทวารเทียม (Colostomy)</span></label>
                                        </div>

                                        <div className="space-y-4 pt-4 border-t">
                                            <label className="block text-md font-bold text-foreground">ระบบทางเดินหายใจ</label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField label="ให้ออกซิเจน (O2 Cannula - ระบุลิตร/นาที)">
                                                    <Input placeholder="ลิตร/นาที" {...register('oxygenCannulaLiters')} disabled={isReadOnly} className="bg-background/50" />
                                                </FormField>
                                                <FormField label="ให้ออกซิเจน (O2 Mask - ระบุลิตร/นาที)">
                                                    <Input placeholder="ลิตร/นาที" {...register('oxygenMaskLiters')} disabled={isReadOnly} className="bg-background/50" />
                                                </FormField>
                                                <FormField label="เครื่องช่วยหายใจ (Ventilator - ระบุโหมด)">
                                                    <Input placeholder="โหมด..." {...register('ventilatorMode')} disabled={isReadOnly} className="bg-background/50" />
                                                </FormField>
                                            </div>
                                            <label className={`flex items-center space-x-2 ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}><input type="checkbox" {...register('needSuction')} disabled={isReadOnly} className="w-4 h-4 text-primary" /><span>ต้องดูดเสมหะ (Suction)</span></label>
                                        </div>

                                        <div className="space-y-4 pt-4 border-t">
                                            <label className="block text-md font-bold text-foreground">แผลและผิวหนัง</label>
                                            <label className={`flex items-center space-x-2 ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}><input type="checkbox" {...register('woundsNone')} disabled={isReadOnly} className="w-4 h-4 text-primary" /><span>ไม่มีแผล</span></label>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField label="แผลกดทับ ระดับ 1 (ตำแหน่ง)">
                                                    <Input placeholder="ตำแหน่ง..." {...register('bedsoreStage1Location')} disabled={isReadOnly} className="bg-background/50" />
                                                </FormField>
                                                <FormField label="แผลกดทับ ระดับ 2 (ตำแหน่ง)">
                                                    <Input placeholder="ตำแหน่ง..." {...register('bedsoreStage2Location')} disabled={isReadOnly} className="bg-background/50" />
                                                </FormField>
                                                <FormField label="แผลกดทับ ระดับ 3 (ตำแหน่ง)">
                                                    <Input placeholder="ตำแหน่ง..." {...register('bedsoreStage3Location')} disabled={isReadOnly} className="bg-background/50" />
                                                </FormField>
                                                <FormField label="แผลกดทับ ระดับ 4 (ตำแหน่ง)">
                                                    <Input placeholder="ตำแหน่ง..." {...register('bedsoreStage4Location')} disabled={isReadOnly} className="bg-background/50" />
                                                </FormField>
                                                <FormField label="แผลเบาหวาน (ตำแหน่ง)">
                                                    <Input placeholder="ตำแหน่ง..." {...register('diabeticWoundLocation')} disabled={isReadOnly} className="bg-background/50" />
                                                </FormField>
                                                <FormField label="แผลผ่าตัด (ตำแหน่ง)">
                                                    <Input placeholder="ตำแหน่ง..." {...register('surgicalWoundLocation')} disabled={isReadOnly} className="bg-background/50" />
                                                </FormField>
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-4 border-t">
                                            <label className="block text-md font-bold text-foreground">การรักษาเฉพาะทาง</label>
                                            <label className={`flex items-center space-x-2 ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}><input type="checkbox" {...register('hasCapd')} disabled={isReadOnly} className="w-4 h-4 text-primary" /><span>ล้างไตทางหน้าท้อง (CAPD)</span></label>
                                            <label className={`flex items-center space-x-2 ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}><input type="checkbox" {...register('hasHd')} disabled={isReadOnly} className="w-4 h-4 text-primary" /><span>ฟอกเลือดด้วยเครื่อง (HD)</span></label>
                                            <label className={`flex items-center space-x-2 ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}><input type="checkbox" {...register('hasIvSupport')} disabled={isReadOnly} className="w-4 h-4 text-primary" /><span>ให้สารน้ำ/ยาทางหลอดเลือด (IV)</span></label>
                                            <label className={`flex items-center space-x-2 ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}><input type="checkbox" {...register('requireBloodSugarCheck')} disabled={isReadOnly} className="w-4 h-4 text-primary" /><span>เจาะค่าน้ำตาล/เบาหวาน</span></label>
                                        </div>
                                    </div>
                                </div>

                                {/* 3.3 Cognitive & Behavioral Status */}
                                <div className="pt-8 border-t border-border/50">
                                    <h3 className="text-xl font-bold text-primary flex items-center gap-2 mb-4">
                                        <ClipboardList className="w-5 h-5" />
                                        3.3 อารมณ์และพฤติกรรม (Cognitive & Behavioral Status)
                                    </h3>
                                    <div className="space-y-6">
                                        <RadioGroupField
                                            label="กลุ่มอาการทางสมอง"
                                            name="cognitiveStatus"
                                            register={register}
                                            disabled={isReadOnly}
                                            options={[
                                                { label: 'อัลไซเมอร์ / สมองเสื่อม (เดินได้ - เสี่ยงพลัดหลง)', value: 'ALZHEIMERS_MOBILE_WANDERING' },
                                                { label: 'อัลไซเมอร์ / สมองเสื่อม (เดินไม่ได้)', value: 'ALZHEIMERS_IMMOBILE' },
                                            ]}
                                        />
                                        <RadioGroupField
                                            label="พฤติกรรมก้าวร้าว/โวยวาย"
                                            name="aggressiveStatus"
                                            register={register}
                                            disabled={isReadOnly}
                                            options={[
                                                { label: 'โวยวาย/ก้าวร้าว (มีประวัติใช้ยาควบคุมอาการ)', value: 'AGGRESSIVE_WITH_MEDS' },
                                                { label: 'โวยวาย/ก้าวร้าว (ไม่มีประวัติใช้ยาควบคุมอาการ)', value: 'AGGRESSIVE_NO_MEDS' },
                                            ]}
                                        />
                                        <div className="space-y-4 pt-4 border-t">
                                            <label className="block text-md font-bold text-foreground">พฤติกรรมเสี่ยงอื่นๆ</label>
                                            <FormField label="อาการสับสนวุ่นวายเสียงดัง (ระบุช่วงเวลา)">
                                                <Input placeholder="เช่น ช่วงเย็น..." {...register('noisyConfusionTimeframe')} disabled={isReadOnly} className="bg-background/50 max-w-md" />
                                            </FormField>
                                            <label className={`flex items-center space-x-2 ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}><input type="checkbox" {...register('talksToSelfQuietly')} disabled={isReadOnly} className="w-4 h-4 text-primary" /><span>พูดคนเดียวเสียงไม่ดัง</span></label>
                                            <label className={`flex items-center space-x-2 ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}><input type="checkbox" {...register('psychiatricWithMeds')} disabled={isReadOnly} className="w-4 h-4 text-primary" /><span>จิตเวช (มียารับประทาน)</span></label>
                                            <label className={`flex items-center space-x-2 ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}><input type="checkbox" {...register('psychiatricNoMeds')} disabled={isReadOnly} className="w-4 h-4 text-primary" /><span>จิตเวช (ไม่มียารับประทาน)</span></label>
                                        </div>
                                    </div>
                                </div>

                                {/* 3.4 Additional Safety Risks */}
                                <div className="pt-8 border-t border-border/50">
                                    <h3 className="text-xl font-bold text-primary flex items-center gap-2 mb-4">
                                        <ClipboardList className="w-5 h-5" />
                                        3.4 ความเสี่ยงเพิ่มเติม (Additional Safety Risks)
                                    </h3>
                                    <div className="space-y-6">
                                        <RadioGroupField
                                            label="ประวัติการหกล้ม (Fall History)"
                                            name="fallHistoryLevel"
                                            register={register}
                                            disabled={isReadOnly}
                                            options={[
                                                { label: 'ไม่เคยล้มใน 6 เดือนที่ผ่านมา', value: 'NONE_IN_6_MONTHS' },
                                                { label: 'ล้ม 1-2 ครั้ง', value: 'ONCE_OR_TWICE' },
                                                { label: 'ล้มบ่อยครั้ง (เสี่ยงสูง)', value: 'FREQUENT_HIGH_RISK' },
                                            ]}
                                        />
                                        <RadioGroupField
                                            label="การประเมินแผลกดทับ (Braden Scale)"
                                            name="bradenScale"
                                            register={register}
                                            disabled={isReadOnly}
                                            options={[
                                                { label: 'คะแนน > 12 (ความเสี่ยงต่ำ-ปานกลาง)', value: 'LOW_TO_MODERATE_RISK' },
                                                { label: 'คะแนน ≤ 12 (ความเสี่ยงสูงมาก - ต้องมีที่นอนลม)', value: 'HIGH_RISK' },
                                            ]}
                                        />
                                        <div className="space-y-4 pt-4 border-t">
                                            <label className="block text-md font-bold text-foreground">ความเสี่ยงการติดเชื้อ (Infection)</label>
                                            <label className={`flex items-center space-x-2 ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}><input type="checkbox" {...register('infectionNone')} disabled={isReadOnly} className="w-4 h-4 text-primary" /><span>ไม่มีโรคติดต่อ</span></label>
                                            <FormField label="มีเชื้อดื้อยา / วัณโรค / อื่นๆ (ระบุ)">
                                                <Input placeholder="ระบุ..." {...register('infectionDetails')} disabled={isReadOnly} className="bg-background/50 max-w-md" />
                                            </FormField>
                                        </div>
                                        <RadioGroupField
                                            label="ความเปราะบาง (Frailty Score)"
                                            name="frailtyScore"
                                            register={register}
                                            disabled={isReadOnly}
                                            options={[
                                                { label: '0-1 (แข็งแรง)', value: 'ROBUST' },
                                                { label: '2-3 (เริ่มเปราะบาง)', value: 'PRE_FRAIL' },
                                                { label: '4-5 (เปราะบางสูง)', value: 'FRAIL' },
                                            ]}
                                        />
                                    </div>
                                </div>

                                {/* 3.5 Hospitalization & Medications */}
                                <div className="pt-8 border-t border-border/50">
                                    <h3 className="text-xl font-bold text-primary flex items-center gap-2 mb-4">
                                        <ClipboardList className="w-5 h-5" />
                                        3.5 การไปโรงพยาบาลล่าสุด และยาในปัจจุบัน
                                    </h3>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField label="วันที่ออกจากโรงพยาบาล (DD/MM/YYYY)">
                                                <Input placeholder="01/01/2026" {...register('recentDischargeDate')} disabled={isReadOnly} className="bg-background/50" />
                                            </FormField>
                                            <FormField label="โรงพยาบาลที่รักษา">
                                                <Input placeholder="ระบุโรงพยาบาล" {...register('recentHospital')} disabled={isReadOnly} className="bg-background/50" />
                                            </FormField>
                                            <FormField label="สาเหตุที่เข้ารับการรักษา">
                                                <Input placeholder="ระบุสาเหตุ" {...register('recentAdmissionReason')} disabled={isReadOnly} className="bg-background/50" />
                                            </FormField>
                                            <FormField label="การนัดหมายแพทย์ครั้งถัดไป (DD/MM/YYYY)">
                                                <Input placeholder="01/02/2026" {...register('nextAppointmentDate')} disabled={isReadOnly} className="bg-background/50" />
                                            </FormField>
                                        </div>

                                        <div className="space-y-4 pt-4 border-t">
                                            <label className="block text-md font-bold text-foreground">การรับประทานยาในปัจจุบัน</label>
                                            <RadioGroupField
                                                label="จำนวนยาที่ทานประจำ (Polypharmacy)"
                                                name="polypharmacy"
                                                register={register}
                                                disabled={isReadOnly}
                                                options={[
                                                    { label: 'น้อยกว่า 5 ชนิด', value: 'LESS_THAN_5' },
                                                    { label: 'มากกว่า 5 ชนิดขึ้นไป', value: 'FIVE_OR_MORE' },
                                                ]}
                                            />
                                            <label className="block text-sm font-medium text-foreground mt-4">กลุ่มยาที่มีความเสี่ยงสูง (High-alert meds)</label>
                                            <label className={`flex items-center space-x-2 ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}><input type="checkbox" {...register('highAlertAnticoagulant')} disabled={isReadOnly} className="w-4 h-4 text-primary" /><span>ยาละลายลิ่มเลือด/ต้านเกล็ดเลือด (เลือดออกง่าย)</span></label>
                                            <label className={`flex items-center space-x-2 ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}><input type="checkbox" {...register('highAlertDiabetic')} disabled={isReadOnly} className="w-4 h-4 text-primary" /><span>ยาเบาหวาน/ฉีดอินซูลิน (เสี่ยงน้ำตาลตก)</span></label>
                                            <label className={`flex items-center space-x-2 ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}><input type="checkbox" {...register('highAlertPsychiatric')} disabled={isReadOnly} className="w-4 h-4 text-primary" /><span>ยาจิตเวช/ยานอนหลับ (เสี่ยงพลัดตกหกล้ม)</span></label>
                                        </div>
                                    </div>
                                </div>
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
