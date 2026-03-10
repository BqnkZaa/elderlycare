/**
 * New Elderly Profile Page
 *
 * 2-section form for elderly admission based on new requirements.
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { elderlyProfileSchema, type ElderlyProfileInput } from '@/lib/validations';
import { createElderlyProfile } from '@/actions/elderly.actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NativeSelect as Select } from '@/components/ui/select';
import {
    ArrowLeft,
    Save,
    User,
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

function RadioGroupField({ label, name, options, register, error, watch }: any) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">{label}</label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {options.map((opt: any) => (
                    <label key={opt.value} className="flex items-center space-x-2 cursor-pointer border border-border/50 p-2 rounded-md hover:bg-accent/10">
                        <input
                            type="radio"
                            value={opt.value}
                            {...register(name)}
                            className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                        />
                        <span className="text-sm font-medium">{opt.label}</span>
                    </label>
                ))}
            </div>
            {error && <p className="text-destructive text-xs mt-1">{error}</p>}
        </div>
    );
}

export default function NewElderlyPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ElderlyProfileInput>({
        resolver: zodResolver(elderlyProfileSchema) as any,
        defaultValues: {
            isActive: true,
            admissionDate: new Date(),
            gender: 'MALE',
            maritalStatus: 'SINGLE',
            childrenCount: 'NONE',
            formerOccupation: 'OTHER',
            healthPrivilege: 'SELF_PAY',
            hasLifeInsurance: false,
            currentLocation: 'HOME',
            selfHelpStatus: 'INDEPENDENT_NON_BEDRIDDEN',
            eatingStatus: 'EAT_NORMAL',
            hasTracheostomy: false,
            bedsoreStatus: 'NONE',
            useAirMattress: false,
            oxygenSupport: 'NONE',
            useVentilator: false,
            psychiatricStatus: 'NONE',
            hasAggressiveBehavior: false,
            hasPsychiatricMedication: false,
            hasSpecialMedication: false,
        },
    });

    const onSubmit = async (data: ElderlyProfileInput) => {
        setIsSubmitting(true);
        setSubmitResult(null);

        try {
            const result = await createElderlyProfile(data);

            if (result.success) {
                setSubmitResult({ success: true, message: 'บันทึกข้อมูลสำเร็จ! (Saved Successfully)' });
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
                        ลงทะเบียนผู้สูงอายุเข้าพักใหม่
                    </h1>
                </div>
            </div>

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

                <Card className="border-border shadow-sm bg-card/50 backdrop-blur-sm">
                    <CardHeader className="bg-accent/20 border-b border-border pb-4">
                        <CardTitle className="text-lg text-foreground flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            ข้อมูลที่จำเป็นของระบบ (System Fields)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField label="รหัสผู้ป่วย (SAFE-ID) *" error={errors.safeId?.message}>
                            <Input placeholder="SIDxxx69xxx" {...register('safeId')} className="font-mono uppercase bg-background/50" />
                        </FormField>
                        <FormField label="ชื่อจริงผู้สูงอายุ *" error={errors.firstName?.message}>
                            <Input placeholder="สมชาย" {...register('firstName')} className="bg-background/50" />
                        </FormField>
                        <FormField label="นามสกุลผู้สูงอายุ *" error={errors.lastName?.message}>
                            <Input placeholder="ใจดี" {...register('lastName')} className="bg-background/50" />
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
                                <Input placeholder="ชื่อ-นามสกุล" {...register('keyCoordinatorName')} className="bg-background/50" />
                            </FormField>
                            <FormField label="2. เบอร์โทร" error={errors.keyCoordinatorPhone?.message}>
                                <Input placeholder="เบอร์โทรศัพท์" {...register('keyCoordinatorPhone')} className="bg-background/50" />
                            </FormField>
                            <FormField label="3. วัน/เดือน/ปี ที่รับเข้า" error={errors.admissionDate?.message}>
                                <Input type="date" {...register('admissionDate')} className="bg-background/50" />
                            </FormField>
                            <FormField label="เวลา" error={errors.admissionTime?.message}>
                                <Input type="time" {...register('admissionTime')} className="bg-background/50" />
                            </FormField>
                            <FormField label="4. ชื่อเล่นผู้สูงอายุ" error={errors.nickname?.message}>
                                <Input placeholder="ชื่อเล่น" {...register('nickname')} className="bg-background/50" />
                            </FormField>
                            <FormField label="5. สรรพนามที่เรียกท่านตอนอยู่ที่บ้าน" error={errors.preferredPronouns?.message}>
                                <Input placeholder="เช่น อาม่า, คุณตา" {...register('preferredPronouns')} className="bg-background/50" />
                            </FormField>
                            <FormField label="6. อายุ" error={errors.age?.message}>
                                <Input type="number" placeholder="อายุ" {...register('age')} className="bg-background/50" />
                            </FormField>
                        </div>

                        <div className="space-y-6 border-t pt-4">
                            <RadioGroupField
                                label="7. เพศ"
                                name="gender"
                                register={register}
                                options={[
                                    { label: 'ชาย', value: 'MALE' },
                                    { label: 'หญิง', value: 'FEMALE' },
                                    { label: 'เพศทางเลือก', value: 'OTHER' },
                                ]}
                            />
                            {watchGender === 'OTHER' && (
                                <FormField label="ระบุเพศทางเลือก">
                                    <Input placeholder="ระบุ..." {...register('genderOther')} className="bg-background/50" />
                                </FormField>
                            )}

                            <RadioGroupField
                                label="8. สถานภาพสมรส"
                                name="maritalStatus"
                                register={register}
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
                                options={[
                                    { label: 'ค้าขาย', value: 'COMMERCE' },
                                    { label: 'บริการ', value: 'SERVICE' },
                                    { label: 'อื่นๆ', value: 'OTHER' },
                                ]}
                            />
                            {watchFormerOccupation === 'OTHER' && (
                                <FormField label="ระบุอาชีพอื่นๆ">
                                    <Input placeholder="ระบุ..." {...register('formerOccupationOther')} className="bg-background/50" />
                                </FormField>
                            )}

                            <RadioGroupField
                                label="11. ใช้สิทธิสุขภาพเบิกจ่ายที่ไหน"
                                name="healthPrivilege"
                                register={register}
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
                                    <label className="flex items-center space-x-2">
                                        <input type="radio" value="true" {...register('hasLifeInsurance')} className="w-4 h-4 text-primary" />
                                        <span>มี</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input type="radio" value="false" {...register('hasLifeInsurance')} className="w-4 h-4 text-primary" defaultChecked />
                                        <span>ไม่มี</span>
                                    </label>
                                </div>
                            </div>

                            <FormField label="13. ต้นสังกัดโรงพยาบาล">
                                <Input placeholder="ระบุ..." {...register('hospitalAffiliation')} className="bg-background/50 max-w-md" />
                            </FormField>

                            <RadioGroupField
                                label="14. ตอนนี้ผู้ป่วยอยู่ที่ไหน"
                                name="currentLocation"
                                register={register}
                                options={[
                                    { label: 'บ้าน', value: 'HOME' },
                                    { label: 'โรงพยาบาล', value: 'HOSPITAL' },
                                    { label: 'ศูนย์ดูแลผู้สูงอายุ', value: 'CARE_CENTER' },
                                ]}
                            />

                            <FormField label="15. ภาวะ อาการ เบื้องต้นตอนนี้อย่างไรบ้าง">
                                <TextareaField placeholder="ระบุ..." rows={3} {...register('initialSymptoms')} />
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
                                <label className="flex items-center space-x-2">
                                    <input type="radio" value="true" {...register('hasTracheostomy')} className="w-4 h-4 text-primary" />
                                    <span>เจาะ</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input type="radio" value="false" {...register('hasTracheostomy')} className="w-4 h-4 text-primary" defaultChecked />
                                    <span>ไม่เจาะ</span>
                                </label>
                            </div>
                        </div>

                        <RadioGroupField
                            label="แผลกดทับ"
                            name="bedsoreStatus"
                            register={register}
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
                                <label className="flex items-center space-x-2">
                                    <input type="radio" value="true" {...register('useAirMattress')} className="w-4 h-4 text-primary" />
                                    <span>ใช้</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input type="radio" value="false" {...register('useAirMattress')} className="w-4 h-4 text-primary" defaultChecked />
                                    <span>ไม่ใช้</span>
                                </label>
                            </div>
                        </div>

                        <RadioGroupField
                            label="อ็อกซิเจน"
                            name="oxygenSupport"
                            register={register}
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
                                <label className="flex items-center space-x-2">
                                    <input type="radio" value="true" {...register('useVentilator')} className="w-4 h-4 text-primary" />
                                    <span>ใช้</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input type="radio" value="false" {...register('useVentilator')} className="w-4 h-4 text-primary" defaultChecked />
                                    <span>ไม่ใช้</span>
                                </label>
                            </div>
                        </div>

                        <RadioGroupField
                            label="จิตเวช/อัลไซเมอร์/สมองเสื่อม"
                            name="psychiatricStatus"
                            register={register}
                            options={[
                                { label: 'ไม่มี', value: 'NONE' },
                                { label: 'มีอาการใดอาการหนึ่ง (ไม่มียา)', value: 'SYMPTOMS_NO_MEDS' },
                                { label: 'มีอาการใดอาการหนึ่ง (มียา)', value: 'SYMPTOMS_WITH_MEDS' },
                            ]}
                        />

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-foreground">โวยวาย/ด่าทอ/เสียงดัง</label>
                            <div className="flex gap-4">
                                <label className="flex items-center space-x-2">
                                    <input type="radio" value="true" {...register('hasAggressiveBehavior')} className="w-4 h-4 text-primary" />
                                    <span>มี</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input type="radio" value="false" {...register('hasAggressiveBehavior')} className="w-4 h-4 text-primary" defaultChecked />
                                    <span>ไม่มี</span>
                                </label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-foreground">ยาคลายกังวล/ระงับอาการ/ปรับอารมณ์</label>
                            <div className="flex gap-4">
                                <label className="flex items-center space-x-2">
                                    <input type="radio" value="true" {...register('hasPsychiatricMedication')} className="w-4 h-4 text-primary" />
                                    <span>มี</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input type="radio" value="false" {...register('hasPsychiatricMedication')} className="w-4 h-4 text-primary" defaultChecked />
                                    <span>ไม่มี</span>
                                </label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-foreground">การให้ยาพิเศษ (เปิดเส้น/ทำหัตการพิเศษ)</label>
                            <div className="flex gap-4 mb-2">
                                <label className="flex items-center space-x-2">
                                    <input type="radio" value="false" {...register('hasSpecialMedication')} className="w-4 h-4 text-primary" defaultChecked />
                                    <span>ไม่มี</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input type="radio" value="true" {...register('hasSpecialMedication')} className="w-4 h-4 text-primary" />
                                    <span>มี</span>
                                </label>
                            </div>
                            {String(watchSpecialMed) === "true" && (
                                <FormField label="ระบุ">
                                    <Input placeholder="ระบุการให้ยา/หัตถการ..." {...register('specialMedicationDetail')} className="bg-background/50 max-w-md" />
                                </FormField>
                            )}
                        </div>

                    </CardContent>
                </Card>

                {/* Action Buttons */}
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
                                บันทึกข้อมูล (Save)
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
