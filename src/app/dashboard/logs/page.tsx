/**
 * Daily Logs Page
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function LogsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="w-7 h-7 text-emerald-600" />
                บันทึกประจำวัน
            </h1>

            <Card>
                <CardHeader>
                    <CardTitle>รายการบันทึก</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-500">ดูบันทึกประจำวันทั้งหมดได้ที่หน้ารายละเอียดผู้สูงอายุแต่ละคน</p>
                </CardContent>
            </Card>
        </div>
    );
}
