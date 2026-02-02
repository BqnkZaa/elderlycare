/**
 * New Elderly Profile Page
 * 
 * Form to create a new elderly profile with all fields.
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { elderlyProfileSchema, type ElderlyProfileInput } from '@/lib/validations';
import { createElderlyProfile } from '@/actions/elderly.actions';
import { PROVINCE_NAMES_TH } from '@/lib/provinces';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import {
    ArrowLeft,
    Save,
    User,
    MapPin,
    Phone,
    Heart,
    AlertCircle,
    Check,
} from 'lucide-react';

export default function NewElderlyPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ElderlyProfileInput>({
        resolver: zodResolver(elderlyProfileSchema),
        defaultValues: {
            gender: 'MALE',
            bloodType: 'UNKNOWN',
            mobilityStatus: 'INDEPENDENT',
            careLevel: 'LEVEL_1',
            isActive: true,
        },
    });

    const onSubmit = async (data: ElderlyProfileInput) => {
        setIsSubmitting(true);
        setSubmitResult(null);

        try {
            const result = await createElderlyProfile(data);

            if (result.success) {
                setSubmitResult({ success: true, message: 'สร้างข้อมูลสำเร็จ!' });
                setTimeout(() => {
                    router.push('/dashboard/elderly');
                }, 1500);
            } else {
                setSubmitResult({ success: false, message: result.error || 'เกิดข้อผิดพลาด' });
            }
        } catch {
            setSubmitResult({ success: false, message: 'เกิดข้อผิดพลาดในการบันทึก' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/elderly">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        เพิ่มข้อมูลผู้สูงอายุ
                    </h1>
                    <p className="text-gray-500">กรอกข้อมูลทั้งหมดให้ครบถ้วน</p>
                </div>
            </div>

            {/* Alert Messages */}
            {submitResult && (
                <div className={`flex items-center gap-2 p-4 rounded-lg ${submitResult.success
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                    : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                    {submitResult.success ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    {submitResult.message}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5 text-indigo-600" />
                            ข้อมูลส่วนตัว
                        </CardTitle>
                        <CardDescription>ข้อมูลพื้นฐานของผู้สูงอายุ</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField label="เลขบัตรประชาชน *" error={errors.nationalId?.message}>
                                <Input
                                    placeholder="1234567890123"
                                    maxLength={13}
                                    {...register('nationalId')}
                                    error={errors.nationalId?.message}
                                />
                            </FormField>

                            <FormField label="เพศ *" error={errors.gender?.message}>
                                <Select {...register('gender')} error={errors.gender?.message}>
                                    <option value="MALE">ชาย</option>
                                    <option value="FEMALE">หญิง</option>
                                    <option value="OTHER">อื่นๆ</option>
                                </Select>
                            </FormField>

                            <FormField label="ชื่อ *" error={errors.firstName?.message}>
                                <Input
                                    placeholder="สมชาย"
                                    {...register('firstName')}
                                    error={errors.firstName?.message}
                                />
                            </FormField>

                            <FormField label="นามสกุล *" error={errors.lastName?.message}>
                                <Input
                                    placeholder="ใจดี"
                                    {...register('lastName')}
                                    error={errors.lastName?.message}
                                />
                            </FormField>

                            <FormField label="ชื่อเล่น">
                                <Input
                                    placeholder="ลุงชาย"
                                    {...register('nickname')}
                                />
                            </FormField>

                            <FormField label="วันเกิด *" error={errors.dateOfBirth?.message}>
                                <Input
                                    type="date"
                                    {...register('dateOfBirth')}
                                    error={errors.dateOfBirth?.message}
                                />
                            </FormField>

                            <FormField label="กรุ๊ปเลือด">
                                <Select {...register('bloodType')}>
                                    <option value="UNKNOWN">ไม่ทราบ</option>
                                    <option value="A_POSITIVE">A+</option>
                                    <option value="A_NEGATIVE">A-</option>
                                    <option value="B_POSITIVE">B+</option>
                                    <option value="B_NEGATIVE">B-</option>
                                    <option value="O_POSITIVE">O+</option>
                                    <option value="O_NEGATIVE">O-</option>
                                    <option value="AB_POSITIVE">AB+</option>
                                    <option value="AB_NEGATIVE">AB-</option>
                                </Select>
                            </FormField>

                            <FormField label="โทรศัพท์">
                                <Input
                                    placeholder="0812345678"
                                    {...register('phoneNumber')}
                                />
                            </FormField>

                            <FormField label="อีเมล">
                                <Input
                                    type="email"
                                    placeholder="email@example.com"
                                    {...register('email')}
                                />
                            </FormField>
                        </div>
                    </CardContent>
                </Card>

                {/* Address */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-emerald-600" />
                            ที่อยู่
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField label="ที่อยู่ *" error={errors.address?.message} className="md:col-span-2">
                                <Input
                                    placeholder="123 หมู่ 4"
                                    {...register('address')}
                                    error={errors.address?.message}
                                />
                            </FormField>

                            <FormField label="ตำบล/แขวง *" error={errors.subDistrict?.message}>
                                <Input
                                    placeholder="บางขุนเทียน"
                                    {...register('subDistrict')}
                                    error={errors.subDistrict?.message}
                                />
                            </FormField>

                            <FormField label="อำเภอ/เขต *" error={errors.district?.message}>
                                <Input
                                    placeholder="บางขุนเทียน"
                                    {...register('district')}
                                    error={errors.district?.message}
                                />
                            </FormField>

                            <FormField label="จังหวัด *" error={errors.province?.message}>
                                <Select {...register('province')} error={errors.province?.message}>
                                    <option value="">เลือกจังหวัด</option>
                                    {PROVINCE_NAMES_TH.map((p) => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </Select>
                            </FormField>

                            <FormField label="รหัสไปรษณีย์ *" error={errors.postalCode?.message}>
                                <Input
                                    placeholder="10150"
                                    maxLength={5}
                                    {...register('postalCode')}
                                    error={errors.postalCode?.message}
                                />
                            </FormField>
                        </div>
                    </CardContent>
                </Card>

                {/* Emergency Contact */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Phone className="w-5 h-5 text-red-600" />
                            ผู้ติดต่อฉุกเฉิน
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField label="ชื่อผู้ติดต่อ *" error={errors.emergencyContactName?.message}>
                                <Input
                                    placeholder="นางสมใจ ใจดี"
                                    {...register('emergencyContactName')}
                                    error={errors.emergencyContactName?.message}
                                />
                            </FormField>

                            <FormField label="เบอร์โทรศัพท์ *" error={errors.emergencyContactPhone?.message}>
                                <Input
                                    placeholder="0899876543"
                                    {...register('emergencyContactPhone')}
                                    error={errors.emergencyContactPhone?.message}
                                />
                            </FormField>

                            <FormField label="ความสัมพันธ์ *" error={errors.emergencyContactRelation?.message}>
                                <Input
                                    placeholder="ลูกสาว"
                                    {...register('emergencyContactRelation')}
                                    error={errors.emergencyContactRelation?.message}
                                />
                            </FormField>
                        </div>
                    </CardContent>
                </Card>

                {/* Health Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Heart className="w-5 h-5 text-pink-600" />
                            ข้อมูลสุขภาพและการดูแล
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField label="โรคประจำตัว">
                                <Input
                                    placeholder="เบาหวาน, ความดันโลหิตสูง"
                                    {...register('chronicDiseases')}
                                />
                            </FormField>

                            <FormField label="อาการแพ้">
                                <Input
                                    placeholder="แพ้ยาเพนนิซิลิน"
                                    {...register('allergies')}
                                />
                            </FormField>

                            <FormField label="ยาที่ใช้ประจำ">
                                <Input
                                    placeholder="Metformin, Amlodipine"
                                    {...register('currentMedications')}
                                />
                            </FormField>

                            <FormField label="อาหารพิเศษ">
                                <Input
                                    placeholder="งดอาหารเค็ม"
                                    {...register('specialDietaryNeeds')}
                                />
                            </FormField>

                            <FormField label="สถานะการเคลื่อนไหว">
                                <Select {...register('mobilityStatus')}>
                                    <option value="INDEPENDENT">เดินได้ด้วยตนเอง</option>
                                    <option value="NEEDS_ASSISTANCE">ต้องมีผู้ช่วยเหลือ</option>
                                    <option value="WHEELCHAIR">ใช้รถเข็น</option>
                                    <option value="BEDRIDDEN">นอนติดเตียง</option>
                                </Select>
                            </FormField>

                            <FormField label="ระดับการดูแล">
                                <Select {...register('careLevel')}>
                                    <option value="LEVEL_1">ระดับ 1 - ต้องการความช่วยเหลือน้อย</option>
                                    <option value="LEVEL_2">ระดับ 2 - ต้องการความช่วยเหลือปานกลาง</option>
                                    <option value="LEVEL_3">ระดับ 3 - ต้องการการดูแลตลอดเวลา</option>
                                    <option value="LEVEL_4">ระดับ 4 - ต้องการการดูแลอย่างใกล้ชิด</option>
                                </Select>
                            </FormField>

                            <FormField label="หมายเหตุ" className="md:col-span-2">
                                <Input
                                    placeholder="หมายเหตุเพิ่มเติม..."
                                    {...register('notes')}
                                />
                            </FormField>
                        </div>
                    </CardContent>
                </Card>

                {/* Submit */}
                <div className="flex justify-end gap-4">
                    <Link href="/dashboard/elderly">
                        <Button variant="outline" type="button">
                            ยกเลิก
                        </Button>
                    </Link>
                    <Button type="submit" disabled={isSubmitting}>
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
                                บันทึกข้อมูล
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
        </div>
    );
}
