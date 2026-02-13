/**
 * Nurse Registration Page
 * 
 * Allows new nurses to register. Requires admin approval.
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { registerNurse } from '@/actions/auth.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

// Schema specific for registration form (includes confirm password)
const registerSchema = z.object({
    name: z.string().min(1, "กรุณาระบุชื่อ-นามสกุล"),
    email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
    password: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
    confirmPassword: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
});

type RegisterInput = z.infer<typeof registerSchema>;

export default function RegisterNursePage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterInput) => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const result = await registerNurse({
                name: data.name,
                email: data.email,
                password: data.password,
                role: 'NURSE', // Force role
            });

            if (result.success) {
                setSuccess(result.message || 'ลงทะเบียนสำเร็จ');
                // Optional: Redirect to login after a delay
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            } else {
                setError(result.error as string);
            }
        } catch {
            setError('เกิดข้อผิดพลาดในการลงทะเบียน');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-secondary/20 rounded-full blur-[100px] animate-pulse" />
            </div>

            <Card className="w-full max-w-md relative backdrop-blur-md bg-card/40 border-border/50 shadow-2xl z-10">
                <CardHeader className="space-y-4 text-center">
                    <div className="mx-auto relative w-32 h-32">
                        <Image
                            src="/images/Logo.jpg"
                            alt="The Safe Zone Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            สมัครสมาชิก (พยาบาล)
                        </CardTitle>
                        <CardDescription className="text-muted-foreground mt-2">
                            Nurse Registration
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    {success ? (
                        <div className="text-center space-y-4 py-8">
                            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold text-foreground">ลงทะเบียนสำเร็จ</h3>
                                <p className="text-muted-foreground">
                                    {success}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    กำลังนำคุณไปที่หน้าเข้าสู่ระบบ...
                                </p>
                            </div>
                            <Button
                                className="mt-4 w-full"
                                variant="outline"
                                onClick={() => router.push('/login')}
                                type="button"
                            >
                                กลับไปหน้าล็อกอิน
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {error && (
                                <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm border border-destructive/20">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    ชื่อ-นามสกุล
                                </label>
                                <Input
                                    placeholder="สมศรี ใจดี"
                                    {...register('name')}
                                    error={errors.name?.message}
                                    className="bg-background/50 border-input/50 focus:bg-background transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    อีเมล
                                </label>
                                <Input
                                    type="email"
                                    placeholder="nurse@elderlycare.com"
                                    {...register('email')}
                                    error={errors.email?.message}
                                    className="bg-background/50 border-input/50 focus:bg-background transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    รหัสผ่าน
                                </label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    {...register('password')}
                                    error={errors.password?.message}
                                    className="bg-background/50 border-input/50 focus:bg-background transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    ยืนยันรหัสผ่าน
                                </label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    {...register('confirmPassword')}
                                    error={errors.confirmPassword?.message}
                                    className="bg-background/50 border-input/50 focus:bg-background transition-all"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-[1.02]"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        กำลังลงทะเบียน...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <UserPlus className="w-4 h-4" />
                                        สมัครสมาชิก
                                    </span>
                                )}
                            </Button>

                            <p className="text-center text-sm text-muted-foreground mt-4">
                                มีบัญชีอยู่แล้ว?{' '}
                                <Link href="/login" className="text-primary hover:underline font-medium">
                                    เข้าสู่ระบบ
                                </Link>
                            </p>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
