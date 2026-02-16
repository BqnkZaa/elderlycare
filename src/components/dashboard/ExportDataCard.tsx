'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Download, FileSpreadsheet, Loader2 } from 'lucide-react';
import { toast } from 'sonner'; // Assuming you have sonner or some toast library, if not can use basic alert or handle error differently

export default function ExportDataCard() {
    const [type, setType] = useState<string>('elderly');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const handleExport = async () => {
        setIsLoading(true);
        try {
            // Build Query Params
            const params = new URLSearchParams();
            params.append('type', type);
            if (startDate) params.append('from', startDate);
            if (endDate) params.append('to', endDate);

            // Trigger Download
            const response = await fetch(`/api/export?${params.toString()}`);

            if (!response.ok) {
                throw new Error('Export failed');
            }

            // Create Blob and Download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;

            // Get filename from header if possible, else default
            const contentDisposition = response.headers.get('Content-Disposition');
            let filename = `export-${type}.xlsx`;
            if (contentDisposition && contentDisposition.indexOf('attachment') !== -1) {
                const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
                if (matches != null && matches[1]) {
                    filename = matches[1].replace(/['"]/g, '');
                }
            }

            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

        } catch (error) {
            console.error(error);
            alert('เกิดข้อผิดพลาดในการดาวน์โหลดข้อมูล');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="border-emerald-200 shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-700">
                    <FileSpreadsheet className="w-5 h-5" />
                    ดาวน์โหลดข้อมูล (Export Data)
                </CardTitle>
                <CardDescription>
                    ดึงข้อมูลจากระบบออกมาเป็นไฟล์ Excel (.xlsx)
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>ประเภทข้อมูล</Label>
                    <Select value={type} onValueChange={setType}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="elderly">ข้อมูลผู้สูงอายุ (Profiles)</SelectItem>
                            <SelectItem value="dailylogs">บันทึกประจำวัน (Daily Logs)</SelectItem>
                            <SelectItem value="appointments">นัดหมายแพทย์ (Appointments)</SelectItem>
                            <SelectItem value="inquiries">ข้อมูลผู้ติดต่อ (Inquiries)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>ตั้งแต่วันที่ (ตัวเลือก)</Label>
                        <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>ถึงวันที่ (ตัวเลือก)</Label>
                        <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                </div>

                <Button
                    onClick={handleExport}
                    disabled={isLoading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            กำลังเตรียมไฟล์...
                        </>
                    ) : (
                        <>
                            <Download className="mr-2 h-4 w-4" />
                            ดาวน์โหลด Excel
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}
