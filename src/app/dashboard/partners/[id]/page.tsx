'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { partnerCenterSchema, type PartnerCenterInput } from '@/lib/validations';
import { getPartnerCenterById, updatePartnerCenter, deletePartnerCenter } from '@/actions/partner.actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, Building2, Trash2, CheckCircle2, AlertCircle, Edit, History } from 'lucide-react';
import React from 'react';

export default function EditPartnerPage({ params }: { params: { id: string } }) {
    const { id } = React.use(params as any) as any || params; // Handle async params in newer Next.js versions if needed
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<PartnerCenterInput>({
        resolver: zodResolver(partnerCenterSchema) as any,
    });

    useEffect(() => {
        const fetchPartner = async () => {
            setIsLoading(true);
            const result = await getPartnerCenterById(id);
            if (result.success && result.data) {
                reset(result.data as any);
            } else {
                setSubmitResult({ success: false, message: result.error || 'ไม่พบข้อมูลศูนย์' });
            }
            setIsLoading(false);
        };
        fetchPartner();
    }, [id, reset]);

    const onSubmit = async (data: PartnerCenterInput) => {
        setIsSubmitting(true);
        setSubmitResult(null);

        try {
            const result = await updatePartnerCenter(id, data);

            if (result.success) {
                setSubmitResult({ success: true, message: 'อัพเดทข้อมูลศูนย์สำเร็จ!' });
                setTimeout(() => setSubmitResult(null), 3000);
            } else {
                setSubmitResult({ success: false, message: result.error || 'เกิดข้อผิดพลาดในการบันทึก' });
            }
        } catch (err) {
            console.error(err);
            setSubmitResult({ success: false, message: 'เกิดข้อผิดพลาดในการเชื่อมต่อ' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('ยืนยันการลบข้อมูลศูนย์นี้?')) return;

        setIsDeleting(true);
        try {
            const result = await deletePartnerCenter(id);
            if (result.success) {
                router.push('/dashboard/partners');
            } else {
                alert(result.error || 'เกิดข้อผิดพลาดในการลบ');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return <div className="p-10 text-center text-muted-foreground">กำลังโหลดข้อมูล (Loading...)</div>;
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/partners">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Edit className="w-6 h-6 text-primary" />
                        แก้ไขข้อมูลศูนย์ (Edit Center)
                    </h1>
                </div>
                <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    {isDeleting ? 'กำลังลบ...' : 'ลบข้อมูลศูนย์'}
                </Button>
            </div>

            {submitResult && (
                <div className={`p-4 rounded-lg border flex items-center gap-3 ${submitResult.success
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    : 'bg-destructive/10 text-destructive border-destructive/20'
                    }`}>
                    {submitResult.success ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <p className="font-semibold">{submitResult.message}</p>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-8">
                {/* 1. Basic Info */}
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="bg-accent/20 border-b border-border/50">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-primary" />
                            ข้อมูลพื้นฐานของศูนย์
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">รหัสศูนย์ (PID) *</label>
                                <Input disabled className="bg-background/20 font-mono opacity-50" {...register('pid')} />
                                <p className="text-[10px] text-muted-foreground italic">* รหัส PID ไม่สามารถแก้ไขได้</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">ชื่อศูนย์ *</label>
                                <Input placeholder="ชื่อศูนย์ดูแล..." {...register('name')} className="bg-background/50" />
                                {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">เบอร์ติดต่อ</label>
                                <Input placeholder="0xx-xxx-xxxx" {...register('contact')} className="bg-background/50" />
                            </div>
                            <div className="space-y-2 flex items-end">
                                <label className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-background/50 cursor-pointer w-full">
                                    <input type="checkbox" {...register('isActive')} className="w-4 h-4 rounded text-primary" />
                                    <span className="text-sm font-bold">สถานะเปิดใช้งาน (Active)</span>
                                </label>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-semibold">ที่อยู่</label>
                                <Input placeholder="รายละเอียดที่ตั้ง..." {...register('address')} className="bg-background/50" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Patient Type Support */}
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="bg-accent/20 border-b border-border/50">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                            ประเภทผู้ป่วยที่รองรับ (Supported Patient Types)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-8">

                        <div className="space-y-4">
                            <h3 className="font-bold text-primary border-b border-primary/20 pb-1 flex items-center gap-2">
                                <History className="w-4 h-4" /> การช่วยเหลือตัวเอง
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <label className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-background/50 hover:bg-accent/10 transition-colors cursor-pointer ring-offset-background has-[:checked]:ring-2 has-[:checked]:ring-primary has-[:checked]:border-transparent">
                                    <input type="checkbox" {...register('supportIndependentNonBedridden')} className="w-4 h-4 rounded text-primary" />
                                    <span className="text-sm">ได้ด้วยตัวเอง ไม่ติดเตียง</span>
                                </label>
                                <label className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-background/50 hover:bg-accent/10 transition-colors cursor-pointer ring-offset-background has-[:checked]:ring-2 has-[:checked]:ring-primary has-[:checked]:border-transparent">
                                    <input type="checkbox" {...register('supportIndependentBedridden')} className="w-4 h-4 rounded text-primary" />
                                    <span className="text-sm">ได้ด้วยตัวเอง ติดเตียง</span>
                                </label>
                                <label className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-background/50 hover:bg-accent/10 transition-colors cursor-pointer ring-offset-background has-[:checked]:ring-2 has-[:checked]:ring-primary has-[:checked]:border-transparent">
                                    <input type="checkbox" {...register('supportDependentBedridden')} className="w-4 h-4 rounded text-primary" />
                                    <span className="text-sm">ช่วยเหลือตนเองไม่ได้/ติดเตียง</span>
                                </label>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-bold text-primary border-b border-primary/20 pb-1">การทานอาหาร</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <label className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-background/50 hover:bg-accent/10 cursor-pointer transition-colors has-[:checked]:ring-2 has-[:checked]:ring-primary has-[:checked]:border-transparent">
                                    <input type="checkbox" {...register('supportNormalDiet')} className="w-4 h-4 rounded text-primary" />
                                    <span className="text-sm">อาหารปกติ</span>
                                </label>
                                <label className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-background/50 hover:bg-accent/10 cursor-pointer transition-colors has-[:checked]:ring-2 has-[:checked]:ring-primary has-[:checked]:border-transparent">
                                    <input type="checkbox" {...register('supportSoftDiet')} className="w-4 h-4 rounded text-primary" />
                                    <span className="text-sm">อาหารอ่อน/ต้ม</span>
                                </label>
                                <label className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-background/50 hover:bg-accent/10 cursor-pointer transition-colors has-[:checked]:ring-2 has-[:checked]:ring-primary has-[:checked]:border-transparent">
                                    <input type="checkbox" {...register('supportNeedsFeeding')} className="w-4 h-4 rounded text-primary" />
                                    <span className="text-sm">ต้องมีคนป้อน</span>
                                </label>
                                <label className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-background/50 hover:bg-accent/10 cursor-pointer transition-colors has-[:checked]:ring-2 has-[:checked]:ring-primary has-[:checked]:border-transparent">
                                    <input type="checkbox" {...register('supportTubeFeeding')} className="w-4 h-4 rounded text-primary" />
                                    <span className="text-sm">อาหารฟีด</span>
                                </label>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-bold text-primary border-b border-primary/20 pb-1">เครื่องมือ/การพยาบาลพิเศษ</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <label className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-background/50 hover:bg-accent/10 cursor-pointer transition-colors has-[:checked]:ring-2 has-[:checked]:ring-primary has-[:checked]:border-transparent">
                                    <input type="checkbox" {...register('supportTracheostomy')} className="w-4 h-4 rounded text-primary" />
                                    <span className="text-sm">เจาะคอ</span>
                                </label>
                                <label className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-background/50 hover:bg-accent/10 cursor-pointer transition-colors has-[:checked]:ring-2 has-[:checked]:ring-primary has-[:checked]:border-transparent">
                                    <input type="checkbox" {...register('supportBedsore')} className="w-4 h-4 rounded text-primary" />
                                    <span className="text-sm">แผลกดทับ</span>
                                </label>
                                <label className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-background/50 hover:bg-accent/10 cursor-pointer transition-colors has-[:checked]:ring-2 has-[:checked]:ring-primary has-[:checked]:border-transparent">
                                    <input type="checkbox" {...register('supportAirMattress')} className="w-4 h-4 rounded text-primary" />
                                    <span className="text-sm">ที่นอนลม</span>
                                </label>
                                <label className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-background/50 hover:bg-accent/10 cursor-pointer transition-colors has-[:checked]:ring-2 has-[:checked]:ring-primary has-[:checked]:border-transparent">
                                    <input type="checkbox" {...register('supportOxygen')} className="w-4 h-4 rounded text-primary" />
                                    <span className="text-sm">อ็อกซิเจน</span>
                                </label>
                                <label className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-background/50 hover:bg-accent/10 cursor-pointer transition-colors has-[:checked]:ring-2 has-[:checked]:ring-primary has-[:checked]:border-transparent">
                                    <input type="checkbox" {...register('supportVentilator')} className="w-4 h-4 rounded text-primary" />
                                    <span className="text-sm">เครื่องช่วยหายใจ</span>
                                </label>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-bold text-primary border-b border-primary/20 pb-1">จิตเวชและพฤติกรรม</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <label className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-background/50 hover:bg-accent/10 cursor-pointer transition-colors has-[:checked]:ring-2 has-[:checked]:ring-primary has-[:checked]:border-transparent">
                                    <input type="checkbox" {...register('supportPsychiatric')} className="w-4 h-4 rounded text-primary" />
                                    <span className="text-sm">จิตเวช/อัลไซเมอร์/สมองเสื่อม</span>
                                </label>
                                <label className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-background/50 hover:bg-accent/10 cursor-pointer transition-colors has-[:checked]:ring-2 has-[:checked]:ring-primary has-[:checked]:border-transparent">
                                    <input type="checkbox" {...register('supportAggressiveBehavior')} className="w-4 h-4 rounded text-primary" />
                                    <span className="text-sm">โวยวาย/ด่าทอ/เสียงดัง</span>
                                </label>
                                <label className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-background/50 hover:bg-accent/10 cursor-pointer transition-colors has-[:checked]:ring-2 has-[:checked]:ring-primary has-[:checked]:border-transparent">
                                    <input type="checkbox" {...register('supportPsychiatricMedication')} className="w-4 h-4 rounded text-primary" />
                                    <span className="text-sm">ยาคลายกังวล/ระงับอาการ/ปรับอารมณ์</span>
                                </label>
                            </div>
                        </div>

                    </CardContent>
                </Card>

                {/* Submit Buttons */}
                <div className="flex gap-4 justify-end">
                    <Link href="/dashboard/partners">
                        <Button variant="outline" type="button" size="lg">
                            ยกเลิก
                        </Button>
                    </Link>
                    <Button type="submit" size="lg" disabled={isSubmitting} className="min-w-[180px]">
                        {isSubmitting ? 'กำลังบันทึก...' : (
                            <>
                                <Save className="w-5 h-5 mr-2" />
                                บันทึกการแก้ไข
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
