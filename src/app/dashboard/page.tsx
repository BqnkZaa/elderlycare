/**
 * Dashboard Page
 * 
 * Main dashboard with summary statistics and today's alerts.
 */

// Force dynamic rendering - this page requires database connection
export const dynamic = 'force-dynamic';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import prisma from '@/lib/prisma';
import { isBirthdayToday, isAnniversaryToday, calculateAge, getYearsSinceRegistration } from '@/lib/utils';
import { decrypt } from '@/lib/encryption';
import { Users, FileText, Bell, Heart, Cake, Award } from 'lucide-react';
import Link from 'next/link';

async function getDashboardStats() {
    const [
        totalElderly,
        activeElderly,
        todayLogs,
        totalLogs,
    ] = await Promise.all([
        prisma.elderlyProfile.count(),
        prisma.elderlyProfile.count({ where: { isActive: true } }),
        prisma.dailyLog.count({
            where: {
                date: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                },
            },
        }),
        prisma.dailyLog.count(),
    ]);

    return { totalElderly, activeElderly, todayLogs, totalLogs };
}

async function getTodayAlerts() {
    const profiles = await prisma.elderlyProfile.findMany({
        where: { isActive: true },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            dateOfBirth: true,
            registrationDate: true,
            profilePhoto: true,
        },
    });

    const alerts: Array<{
        id: string;
        type: 'birthday' | 'anniversary';
        name: string;
        message: string;
        value: number;
    }> = [];

    for (const profile of profiles) {
        if (profile.dateOfBirth && isBirthdayToday(profile.dateOfBirth)) {
            const age = calculateAge(profile.dateOfBirth);
            alerts.push({
                id: profile.id,
                type: 'birthday',
                name: `${profile.firstName} ${profile.lastName}`,
                message: `ครบรอบวันเกิด ${age} ปี`,
                value: age,
            });
        }

        if (isAnniversaryToday(profile.registrationDate)) {
            const years = getYearsSinceRegistration(profile.registrationDate);
            alerts.push({
                id: profile.id,
                type: 'anniversary',
                name: `${profile.firstName} ${profile.lastName}`,
                message: `ครบรอบ ${years} ปี เข้าร่วมโครงการ`,
                value: years,
            });
        }
    }

    return alerts;
}

async function getRecentProfiles() {
    const profiles = await prisma.elderlyProfile.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            province: true,
            careLevel: true,
            createdAt: true,
        },
    });

    return profiles;
}

const careLevelLabels: Record<string, string> = {
    LEVEL_1: 'ระดับ 1',
    LEVEL_2: 'ระดับ 2',
    LEVEL_3: 'ระดับ 3',
    LEVEL_4: 'ระดับ 4',
};

export default async function DashboardPage() {
    const stats = await getDashboardStats();
    const alerts = await getTodayAlerts();
    const recentProfiles = await getRecentProfiles();

    const statCards = [
        {
            title: 'ผู้สูงอายุทั้งหมด',
            value: stats.totalElderly,
            subtitle: `${stats.activeElderly} คนที่ใช้งานอยู่`,
            icon: Users,
            gradient: 'from-blue-500 to-cyan-500',
        },
        {
            title: 'บันทึกวันนี้',
            value: stats.todayLogs,
            subtitle: `${stats.totalLogs} บันทึกทั้งหมด`,
            icon: FileText,
            gradient: 'from-emerald-500 to-teal-500',
        },
        {
            title: 'การแจ้งเตือนวันนี้',
            value: alerts.length,
            subtitle: 'รายการที่ต้องดำเนินการ',
            icon: Bell,
            gradient: 'from-amber-500 to-orange-500',
        },
        {
            title: 'อัตราการดูแล',
            value: stats.totalElderly > 0 ? Math.round((stats.todayLogs / stats.activeElderly) * 100) : 0,
            subtitle: '% ของผู้สูงอายุวันนี้',
            icon: Heart,
            gradient: 'from-pink-500 to-rose-500',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    แดชบอร์ด
                </h1>
                <p className="text-gray-500 mt-1">
                    ภาพรวมระบบดูแลผู้สูงอายุ
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, index) => (
                    <Card key={index} className="overflow-hidden">
                        <CardContent className="p-0">
                            <div className="flex items-center">
                                <div className={`w-16 h-full bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="p-4 flex-1">
                                    <p className="text-sm text-gray-500">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {stat.value}
                                    </p>
                                    <p className="text-xs text-gray-400">{stat.subtitle}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Today's Alerts */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="w-5 h-5 text-amber-500" />
                            การแจ้งเตือนวันนี้
                        </CardTitle>
                        <CardDescription>
                            วันเกิดและครบรอบการเข้าร่วมโครงการ
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {alerts.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>ไม่มีการแจ้งเตือนวันนี้</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {alerts.map((alert, index) => (
                                    <Link
                                        key={index}
                                        href={`/dashboard/elderly/${alert.id}`}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${alert.type === 'birthday'
                                            ? 'bg-pink-100 text-pink-600'
                                            : 'bg-blue-100 text-blue-600'
                                            }`}>
                                            {alert.type === 'birthday' ? (
                                                <Cake className="w-5 h-5" />
                                            ) : (
                                                <Award className="w-5 h-5" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {alert.name}
                                            </p>
                                            <p className="text-sm text-gray-500">{alert.message}</p>
                                        </div>
                                        <Badge variant={alert.type === 'birthday' ? 'destructive' : 'default'}>
                                            {alert.type === 'birthday' ? 'วันเกิด' : 'ครบรอบ'}
                                        </Badge>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Profiles */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-500" />
                            ลงทะเบียนล่าสุด
                        </CardTitle>
                        <CardDescription>
                            ผู้สูงอายุที่เพิ่มเข้าระบบล่าสุด
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {recentProfiles.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>ยังไม่มีข้อมูลผู้สูงอายุ</p>
                                <Link href="/dashboard/elderly/new" className="text-indigo-600 hover:underline text-sm mt-2 inline-block">
                                    + เพิ่มข้อมูลผู้สูงอายุ
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentProfiles.map((profile) => (
                                    <Link
                                        key={profile.id}
                                        href={`/dashboard/elderly/${profile.id}`}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                                            {profile.firstName.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 dark:text-white truncate">
                                                {profile.firstName} {profile.lastName}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate">{profile.province}</p>
                                        </div>
                                        <Badge variant="secondary">
                                            {careLevelLabels[profile.careLevel]}
                                        </Badge>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>การดำเนินการด่วน</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Link
                            href="/dashboard/elderly/new"
                            className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                        >
                            <Users className="w-6 h-6" />
                            <div>
                                <p className="font-semibold">เพิ่มผู้สูงอายุ</p>
                                <p className="text-xs opacity-75">ลงทะเบียนข้อมูลใหม่</p>
                            </div>
                        </Link>
                        <Link
                            href="/dashboard/logs"
                            className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl"
                        >
                            <FileText className="w-6 h-6" />
                            <div>
                                <p className="font-semibold">บันทึกประจำวัน</p>
                                <p className="text-xs opacity-75">เพิ่มบันทึกสุขภาพ</p>
                            </div>
                        </Link>
                        <Link
                            href="/dashboard/elderly"
                            className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
                        >
                            <Bell className="w-6 h-6" />
                            <div>
                                <p className="font-semibold">ดูรายชื่อ</p>
                                <p className="text-xs opacity-75">ค้นหาผู้สูงอายุ</p>
                            </div>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
