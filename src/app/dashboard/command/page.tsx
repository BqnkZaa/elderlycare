'use client';

import {
    Users,
    FileText,
    Bell,
    Settings,
    Plus,
    Search,
    Download,
    Trash2,
    Shield
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CommandCenterPage() {
    const modules = [
        {
            title: "ฐานข้อมูลประชากร (Elderly)",
            description: "จัดการข้อมูลผู้สูงอายุทั้งหมดในระบบ",
            icon: Users,
            color: "text-blue-500",
            actions: [
                { label: "เพิ่มข้อมูลใหม่", href: "/dashboard/elderly/new", icon: Plus },
                { label: "ค้นหาข้อมูล", href: "/dashboard/elderly", icon: Search },
                { label: "นำเข้า/ส่งออก", href: "/dashboard/elderly?action=export", icon: Download },
            ]
        },
        {
            title: "บันทึกอาการ (Logs)",
            description: "จัดการบันทึกอาการและรายงานประจำวัน",
            icon: FileText,
            color: "text-green-500",
            actions: [
                { label: "ดูบันทึกล่าสุด", href: "/dashboard/logs", icon: FileText },
                { label: "สร้างรายงานสรุป", href: "/dashboard/logs?action=report", icon: FileText },
            ]
        },
        {
            title: "การแจ้งเตือน (Alerts)",
            description: "ตรวจสอบและจัดการประวัติการแจ้งเตือน",
            icon: Bell,
            color: "text-red-500",
            actions: [
                { label: "ดูการแจ้งเตือนทั้งหมด", href: "/dashboard/alerts", icon: Bell },
                { label: "ล้างประวัติเก่า", href: "/dashboard/alerts?action=clear", icon: Trash2 },
            ]
        },
        {
            title: "ผู้ใช้งานระบบ (Users)",
            description: "จัดการสิทธิ์และการเข้าถึงของผู้ดูแลระบบ",
            icon: Shield,
            color: "text-purple-500",
            actions: [
                { label: "เพิ่มผู้ใช้งาน", href: "/dashboard/users?action=new", icon: Plus },
                { label: "จัดการสิทธิ์", href: "/dashboard/users", icon: Settings },
            ]
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">ศูนย์สั่งการ (Command Center)</h1>
                <p className="text-muted-foreground">
                    จัดการและสั่งการทุกส่วนของระบบได้จากที่นี่
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                {modules.map((module, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow border-primary/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xl font-bold">
                                {module.title}
                            </CardTitle>
                            <module.icon className={`h-6 w-6 ${module.color}`} />
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="mb-4">
                                {module.description}
                            </CardDescription>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {module.actions.map((action, actionIndex) => (
                                    <Link key={actionIndex} href={action.href}>
                                        <Button variant="outline" className="w-full justify-start h-auto py-3">
                                            <action.icon className="mr-2 h-4 w-4" />
                                            {action.label}
                                        </Button>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border-destructive/20 bg-destructive/5">
                <CardHeader>
                    <CardTitle className="text-destructive flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        การตั้งค่าและระบบ (System)
                    </CardTitle>
                    <CardDescription>
                        การตั้งค่าขั้นสูงและการดูแลรักษาระบบ
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <Link href="/dashboard/settings">
                            <Button variant="default">การตั้งค่าทั่วไป</Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
