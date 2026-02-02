/**
 * Dashboard Overview Page
 */

import { getDashboardStats } from '@/actions/elderly.actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Activity } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
    const stats = await getDashboardStats();

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        ภาพรวมระบบ (Dashboard Overview)
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        ยินดีต้อนรับสู่ระบบจัดการข้อมูลผู้สูงอายุ
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href="/dashboard/elderly/new">
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                            ลงทะเบียนผู้สูงอายุใหม่
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-card/50 backdrop-blur-sm border-border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            ผู้สูงอายุทั้งหมด
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">
                            {stats.success ? stats.data?.totalElderly : '-'}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            คน
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            ที่ยังอยู่ในความดูแล (Active)
                        </CardTitle>
                        <Activity className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-500">
                            {stats.success ? stats.data?.activeElderly : '-'}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            คน
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-card/50 backdrop-blur-sm border-border">
                    <CardHeader>
                        <CardTitle className="text-foreground">เมนูลัด (Quick Actions)</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <Link href="/dashboard/elderly" className="block p-4 border border-border rounded-lg hover:bg-accent transition-colors text-center group">
                            <Users className="w-8 h-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
                            <span className="font-medium text-sm text-foreground">รายชื่อผู้สูงอายุ</span>
                        </Link>
                        <Link href="/dashboard/elderly/new" className="block p-4 border border-border rounded-lg hover:bg-accent transition-colors text-center group">
                            <Activity className="w-8 h-8 mx-auto mb-2 text-secondary group-hover:scale-110 transition-transform" />
                            <span className="font-medium text-sm text-foreground">เพิ่มข้อมูลใหม่</span>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
