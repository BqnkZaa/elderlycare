/**
 * New Daily Log Page
 * 
 * Standalone form for creating a new daily log entry.
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { dailyLogSchema, type DailyLogInput } from '@/lib/validations';
import { createDailyLog } from '@/actions/daily-log.actions';
import { getElderlyProfiles } from '@/actions/elderly.actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
    ArrowLeft,
    Save,
    FileText,
    User,
    Calendar,
    Heart,
    Smile,
    Utensils,
    Moon,
    Pill,
    Activity,
    AlertCircle,
} from 'lucide-react';

interface ElderlyOption {
    id: string;
    firstName: string;
    lastName: string;
}

// Form field wrapper
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
        <div className={`space-y-1 ${className}`}>
            <label className="block text-sm font-medium text-foreground">{label}</label>
            {children}
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}

export default function NewDailyLogPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [elderlyOptions, setElderlyOptions] = useState<ElderlyOption[]>([]);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm({
        resolver: zodResolver(dailyLogSchema),
        defaultValues: {
            elderlyId: '',
            date: new Date(),
            mood: 'NEUTRAL' as const,
            mealIntake: 'FULL' as const,
            sleepQuality: 'GOOD' as const,
            medicationsTaken: true,
            recordedBy: 'current-user',
            recordedByName: 'เจ้าหน้าที่',
        },
    });

    // Fetch elderly options
    useEffect(() => {
        async function fetchElderlyOptions() {
            const result = await getElderlyProfiles({ pageSize: 100 });
            if (result.success && result.data) {
                setElderlyOptions(result.data.map((e: { id: string; firstName: string; lastName: string }) => ({
                    id: e.id,
                    firstName: e.firstName,
                    lastName: e.lastName,
                })));
            }
        }
        fetchElderlyOptions();
    }, []);

    const onSubmit = async (data: unknown) => {
        const formData = data as DailyLogInput;
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const result = await createDailyLog(formData);

            if (result.success) {
                router.push('/dashboard/logs');
            } else {
                setSubmitError(result.error || 'เกิดข้อผิดพลาดในการบันทึก');
            }
        } catch (error) {
            console.error('Error creating log:', error);
            setSubmitError('เกิดข้อผิดพลาดในการบันทึก');
        }

        setIsSubmitting(false);
    };

    const medicationsTaken = watch('medicationsTaken');

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/logs">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        กลับ
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <FileText className="w-7 h-7 text-emerald-600" />
                        เพิ่มบันทึกประจำวัน
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        บันทึกข้อมูลสุขภาพและกิจกรรมประจำวัน
                    </p>
                </div>
            </div>

            {/* Error Alert */}
            {submitError && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {submitError}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Info */}
                <Card className="bg-card/50 backdrop-blur-sm border-border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <User className="w-5 h-5 text-primary" />
                            ข้อมูลพื้นฐาน
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="ผู้สูงอายุ *" error={errors.elderlyId?.message}>
                            <Select
                                {...register('elderlyId')}
                                className="bg-background/50 border-input"
                            >
                                <option value="">-- เลือกผู้สูงอายุ --</option>
                                {elderlyOptions.map((e) => (
                                    <option key={e.id} value={e.id}>
                                        {e.firstName} {e.lastName}
                                    </option>
                                ))}
                            </Select>
                        </FormField>

                        <FormField label="วันที่ *" error={errors.date?.message}>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    type="date"
                                    {...register('date')}
                                    className="pl-9 bg-background/50 border-input"
                                />
                            </div>
                        </FormField>
                    </CardContent>
                </Card>

                {/* Vitals */}
                <Card className="bg-card/50 backdrop-blur-sm border-border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Heart className="w-5 h-5 text-rose-500" />
                            สัญญาณชีพ
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <FormField label="อุณหภูมิ (°C)">
                            <Input
                                type="number"
                                step="0.1"
                                placeholder="36.5"
                                {...register('vitals.temperature')}
                                className="bg-background/50 border-input"
                            />
                        </FormField>

                        <FormField label="ความดัน Systolic">
                            <Input
                                type="number"
                                placeholder="120"
                                {...register('vitals.bloodPressureSystolic')}
                                className="bg-background/50 border-input"
                            />
                        </FormField>

                        <FormField label="ความดัน Diastolic">
                            <Input
                                type="number"
                                placeholder="80"
                                {...register('vitals.bloodPressureDiastolic')}
                                className="bg-background/50 border-input"
                            />
                        </FormField>

                        <FormField label="ชีพจร (bpm)">
                            <Input
                                type="number"
                                placeholder="72"
                                {...register('vitals.heartRate')}
                                className="bg-background/50 border-input"
                            />
                        </FormField>

                        <FormField label="อัตราหายใจ">
                            <Input
                                type="number"
                                placeholder="16"
                                {...register('vitals.respiratoryRate')}
                                className="bg-background/50 border-input"
                            />
                        </FormField>

                        <FormField label="Oxygen (%)">
                            <Input
                                type="number"
                                placeholder="98"
                                {...register('vitals.oxygenSaturation')}
                                className="bg-background/50 border-input"
                            />
                        </FormField>

                        <FormField label="น้ำหนัก (kg)">
                            <Input
                                type="number"
                                step="0.1"
                                placeholder="55"
                                {...register('vitals.weight')}
                                className="bg-background/50 border-input"
                            />
                        </FormField>
                    </CardContent>
                </Card>

                {/* Activity & Status */}
                <Card className="bg-card/50 backdrop-blur-sm border-border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Activity className="w-5 h-5 text-blue-500" />
                            กิจกรรมและสถานะ
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField label="อารมณ์" error={errors.mood?.message}>
                                <div className="relative">
                                    <Smile className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Select
                                        {...register('mood')}
                                        className="pl-9 bg-background/50 border-input"
                                    >
                                        <option value="HAPPY">😊 มีความสุข</option>
                                        <option value="CONTENT">🙂 พอใจ</option>
                                        <option value="NEUTRAL">😐 ปกติ</option>
                                        <option value="SAD">😢 เศร้า</option>
                                        <option value="ANXIOUS">😰 วิตกกังวล</option>
                                        <option value="IRRITABLE">😤 หงุดหงิด</option>
                                    </Select>
                                </div>
                            </FormField>

                            <FormField label="การรับประทานอาหาร" error={errors.mealIntake?.message}>
                                <div className="relative">
                                    <Utensils className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Select
                                        {...register('mealIntake')}
                                        className="pl-9 bg-background/50 border-input"
                                    >
                                        <option value="FULL">กินหมด</option>
                                        <option value="PARTIAL">กินบางส่วน</option>
                                        <option value="MINIMAL">กินน้อย</option>
                                        <option value="NONE">ไม่กิน</option>
                                    </Select>
                                </div>
                            </FormField>

                            <FormField label="คุณภาพการนอน" error={errors.sleepQuality?.message}>
                                <div className="relative">
                                    <Moon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Select
                                        {...register('sleepQuality')}
                                        className="pl-9 bg-background/50 border-input"
                                    >
                                        <option value="EXCELLENT">ดีมาก</option>
                                        <option value="GOOD">ดี</option>
                                        <option value="FAIR">พอใช้</option>
                                        <option value="POOR">ไม่ดี</option>
                                        <option value="VERY_POOR">แย่มาก</option>
                                    </Select>
                                </div>
                            </FormField>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField label="จำนวนชั่วโมงนอน">
                                <Input
                                    type="number"
                                    step="0.5"
                                    placeholder="8"
                                    {...register('sleepHours')}
                                    className="bg-background/50 border-input"
                                />
                            </FormField>

                            <FormField label="บันทึกกิจกรรม">
                                <Textarea
                                    placeholder="กิจกรรมที่ทำในวันนี้..."
                                    {...register('activityNote')}
                                    className="bg-background/50 border-input"
                                />
                            </FormField>
                        </div>
                    </CardContent>
                </Card>

                {/* Medication */}
                <Card className="bg-card/50 backdrop-blur-sm border-border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Pill className="w-5 h-5 text-purple-500" />
                            การทานยา
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Checkbox
                                id="medicationsTaken"
                                checked={medicationsTaken}
                                onCheckedChange={(checked) => setValue('medicationsTaken', checked === true)}
                            />
                            <label htmlFor="medicationsTaken" className="text-sm font-medium cursor-pointer">
                                ทานยาครบตามที่กำหนด
                            </label>
                        </div>

                        <FormField label="หมายเหตุเกี่ยวกับยา">
                            <Textarea
                                placeholder="รายละเอียดเพิ่มเติมเกี่ยวกับการทานยา..."
                                {...register('medicationNotes')}
                                className="bg-background/50 border-input"
                            />
                        </FormField>
                    </CardContent>
                </Card>

                {/* Observations */}
                <Card className="bg-card/50 backdrop-blur-sm border-border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <FileText className="w-5 h-5 text-amber-500" />
                            การสังเกตการณ์
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField label="สภาพร่างกาย">
                            <Textarea
                                placeholder="บันทึกสภาพร่างกายทั่วไป..."
                                {...register('physicalCondition')}
                                className="bg-background/50 border-input"
                            />
                        </FormField>

                        <FormField label="พฤติกรรม">
                            <Textarea
                                placeholder="บันทึกพฤติกรรมที่สังเกตได้..."
                                {...register('behavioralNotes')}
                                className="bg-background/50 border-input"
                            />
                        </FormField>

                        <FormField label="เหตุการณ์ผิดปกติ">
                            <Textarea
                                placeholder="หากมีเหตุการณ์ผิดปกติ กรุณาบันทึกไว้..."
                                {...register('incidentsReported')}
                                className="bg-background/50 border-input"
                            />
                        </FormField>
                    </CardContent>
                </Card>

                {/* Hidden fields */}
                <input type="hidden" {...register('recordedBy')} />
                <input type="hidden" {...register('recordedByName')} />

                {/* Submit */}
                <div className="flex justify-end gap-4">
                    <Link href="/dashboard/logs">
                        <Button type="button" variant="outline">
                            ยกเลิก
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                กำลังบันทึก...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                บันทึก
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
