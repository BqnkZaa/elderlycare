/**
 * Login Page
 * 
 * Authentication page with email/password credentials.
 */

'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, LogIn, AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginInput) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (result?.error) {
                setError(result.error);
            } else {
                router.push('/dashboard');
                router.refresh();
            }
        } catch {
            setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <Image
                    src="/images/backgroud1.PNG"
                    alt="Background"
                    fill
                    className="object-cover opacity-100 scale-170 translate-x-17"
                    priority
                />
                <div className="absolute inset-0 bg-background/10 " />
            </div>

            <Card className="w-full max-w-md relative backdrop-blur-md bg-card/40 border-border/50 shadow-2xl z-10">
                <CardHeader className="space-y-6 text-center flex flex-col items-center pb-2">
                    <div className="relative w-28 h-28 group">
                        <div className="absolute inset-0 bg-teal-500/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <Image
                            src="/images/Logo.jpg"
                            alt="E.O.S. Platform"
                            fill
                            className="object-cover rounded-[2rem] shadow-2xl border border-white/10"
                            priority
                        />
                    </div>
                    <div className="space-y-2">
                        <CardTitle className="text-3xl font-black tracking-tight bg-gradient-to-r from-teal-300 via-cyan-400 to-teal-300 bg-clip-text text-transparent drop-shadow-sm animate-gradient-x bg-[length:200%_auto]">
                            E.O.S. Platform
                        </CardTitle>
                        <CardDescription className="text-slate-400 font-medium tracking-wide">
                            Database Management System of "SAFETY"
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm border border-destructive/20">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                อีเมล
                            </label>
                            <Input
                                type="email"
                                placeholder="admin@elderlycare.com"
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
                                    I'M LOGGING...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <LogIn className="w-4 h-4" />
                                    LOGIN
                                </span>
                            )}
                        </Button>

                        <p className="text-center text-xs text-muted-foreground mt-4">
                            Buildeing... "Your Ecosystem of Safety"
                        </p>

                        <div className="text-center text-sm mt-6">
                            Don't have an account yet?{' '}
                            <Link href="/register/nurse" className="text-primary hover:underline font-medium">
                                Sign up (for nurses)
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
