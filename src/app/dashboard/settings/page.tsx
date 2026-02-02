/**
 * Settings Page
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Shield, Bell, Database } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Settings className="w-7 h-7 text-muted-foreground" />
                ตั้งค่าระบบ
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-indigo-600" />
                            ความปลอดภัย
                        </CardTitle>
                        <CardDescription>การตั้งค่าความปลอดภัยและ PDPA</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            ข้อมูลส่วนบุคคลถูกเข้ารหัสด้วย AES-256
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="w-5 h-5 text-amber-600" />
                            การแจ้งเตือน
                        </CardTitle>
                        <CardDescription>ตั้งค่าช่องทางการแจ้งเตือน</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            ปัจจุบัน: Console Log (รอเชื่อมต่อ SMS/LINE API)
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database className="w-5 h-5 text-emerald-600" />
                            ฐานข้อมูล
                        </CardTitle>
                        <CardDescription>สถานะการเชื่อมต่อ</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            MySQL Database - เชื่อมต่อสำเร็จ
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
