import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ForbiddenPage() {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="max-w-md w-full border-red-200 bg-red-50/50">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-red-100 p-3 rounded-full w-fit mb-4">
                        <ShieldAlert className="w-10 h-10 text-red-600" />
                    </div>
                    <CardTitle className="text-2xl text-red-700">ไม่มีสิทธิ์เข้าถึง (Access Denied)</CardTitle>
                    <CardDescription className="text-red-600/80">
                        คุณไม่มีสิทธิ์ในการเข้าถึงหน้าหรือดำเนินการนี้
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                    <p className="text-sm text-gray-600">
                        หากคุณคิดว่านี่เป็นข้อผิดพลาด กรุณาติดต่อผู้ดูแลระบบเพื่อตรวจสอบสิทธิ์การใช้งานของคุณ
                    </p>
                    <div className="pt-4">
                        <Link href="/dashboard">
                            <Button className="w-full bg-red-600 hover:bg-red-700">
                                กลับสู่หน้าหลัก
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
