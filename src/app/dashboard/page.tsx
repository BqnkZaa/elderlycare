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
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        ภาพรวมระบบ (Dashboard Overview)
                    </h1>
                    <p className="text-gray-500 mt-1">
                        ยินดีต้อนรับสู่ระบบจัดการข้อมูลผู้สูงอายุ
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href="/dashboard/elderly/new">
                        <Button>
                            ลงทะเบียนผู้สูงอายุใหม่
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                            ผู้สูงอายุทั้งหมด
                        </CardTitle>
                        <Users className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.success ? stats.data?.totalElderly : '-'}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            คน
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                            ที่ยังอยู่ในความดูแล (Active)
                        </CardTitle>
                        <Activity className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-600">
                            {stats.success ? stats.data?.activeElderly : '-'}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            คน
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>เมนูลัด (Quick Actions)</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <Link href="/dashboard/elderly" className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors text-center">
                            <Users className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
                            <span className="font-medium text-sm">รายชื่อผู้สูงอายุ</span>
                        </Link>
                        <Link href="/dashboard/elderly/new" className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors text-center">
                            <Activity className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                            <span className="font-medium text-sm">เพิ่มข้อมูลใหม่</span>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
