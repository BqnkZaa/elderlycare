import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

// Helper to format date
const formatDate = (date: Date | null) => {
    if (!date) return '-';
    return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: th });
};

// Map Gender Enum to Thai
const mapGender = (gender: string | null) => {
    const map: Record<string, string> = {
        MALE: 'ชาย',
        FEMALE: 'หญิง',
        OTHER: 'อื่นๆ',
    };
    return gender ? map[gender] || gender : '-';
};

export async function GET(req: NextRequest) {
    try {
        // 1. Check Authentication (ADMIN only)
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // 2. Get Query Params
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');
        const from = searchParams.get('from');
        const to = searchParams.get('to');

        if (!type) {
            return new NextResponse('Missing specific type', { status: 400 });
        }

        let data: any[] = [];
        let filename = `export-${type}-${format(new Date(), 'yyyyMMdd-HHmmss')}.xlsx`;
        let worksheetName = 'Data';

        // 3. Date Filter Construction
        const dateFilter: any = {};
        if (from) {
            dateFilter.gte = new Date(from);
        }
        if (to) {
            const toDate = new Date(to);
            toDate.setHours(23, 59, 59, 999);
            dateFilter.lte = toDate;
        }
        const hasDateFilter = from || to;

        // 4. Fetch Data based on Type
        switch (type) {
            case 'elderly':
                worksheetName = 'Elderly Profiles';
                const profiles = await prisma.elderlyProfile.findMany({
                    where: hasDateFilter ? { createdAt: dateFilter } : undefined,
                    orderBy: { createdAt: 'desc' },
                });

                data = profiles.map(p => ({
                    'รหัส (Safe ID)': p.safeId || '-',
                    'ชื่อ': p.firstName,
                    'นามสกุล': p.lastName,
                    'ชื่อเล่น': p.nickname || '-',
                    'อายุ': p.age || '-',
                    'เพศ': mapGender(p.gender),
                    'ระดับการดูแล (Care Level)': p.careLevel,
                    'ห้องพัก': p.bedroomLocation || '-',
                    'โรคประจำตัว': p.underlyingDiseases || '-',
                    'สถานะ': p.isActive ? 'Active' : 'Inactive',
                    'วันที่ลงทะเบียน': formatDate(p.createdAt),
                }));
                break;

            case 'dailylogs':
                worksheetName = 'Daily Logs';
                const logs = await prisma.dailyLog.findMany({
                    where: hasDateFilter ? { date: dateFilter } : undefined, // Usage date not createdAt for logs
                    include: { elderly: true },
                    orderBy: { date: 'desc' },
                });

                data = logs.map(l => ({
                    'วันที่บันทึก': formatDate(l.date),
                    'ผู้สูงอายุ': `${l.elderly.firstName} ${l.elderly.lastName}`,
                    'อารมณ์': l.mood,
                    'การกินอาหาร': l.mealIntake,
                    'การนอน (ชม.)': l.sleepHours || '-',
                    'ความดัน (Systolic)': (l.vitals as any)?.bp_systolic || '-',
                    'ความดัน (Diastolic)': (l.vitals as any)?.bp_diastolic || '-',
                    'อุณหภูมิ': (l.vitals as any)?.temperature || '-',
                    'ผู้บันทึก': l.recordedByName || l.recordedBy,
                }));
                break;

            case 'appointments':
                worksheetName = 'Appointments';
                const appts = await prisma.appointment.findMany({
                    where: hasDateFilter ? { date: dateFilter } : undefined, // Use date for appt
                    include: { elderly: true },
                    orderBy: { date: 'desc' },
                });

                data = appts.map(a => ({
                    'วันที่นัด': formatDate(a.date),
                    'เวลา': a.time || '-',
                    'หัวข้อ': a.title,
                    'ผู้สูงอายุ': `${a.elderly.firstName} ${a.elderly.lastName}`,
                    'แพทย์': a.doctorName || '-',
                    'สถานที่': a.location || '-',
                    'สถานะ': a.isCompleted ? 'เรียบร้อย' : 'รอพบแพทย์',
                }));
                break;

            case 'inquiries':
                worksheetName = 'Inquiries';
                const inquiries = await prisma.inquiry.findMany({
                    where: hasDateFilter ? { createdAt: dateFilter } : undefined,
                    orderBy: { createdAt: 'desc' },
                });

                data = inquiries.map(i => ({
                    'วันที่ติดต่อ': formatDate(i.createdAt),
                    'ชื่อผู้ติดต่อ': i.name,
                    'เบอร์โทร': i.phone,
                    'Line ID': i.lineId || '-',
                    'ชื่อผู้สูงอายุ': i.firstName ? `${i.firstName} ${i.lastName || ''}` : '-',
                    'ระดับการดูแล': i.careLevel,
                    'สถานะ': i.status,
                    'ข้อความเพิ่มเติม': i.message || '-',
                }));
                break;

            default:
                return new NextResponse('Invalid type', { status: 400 });
        }

        // 5. Generate Excel
        if (data.length === 0) {
            // Create empty sheet with headers if no data
            data = [{ 'ข้อมูล': 'ไม่พบข้อมูลในช่วงเวลาที่เลือก' }];
        }

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);

        // Auto-width columns
        const maxWidth = 50;
        const colWidths = Object.keys(data[0] || {}).map(key => ({ wch: 20 }));
        worksheet['!cols'] = colWidths;

        XLSX.utils.book_append_sheet(workbook, worksheet, worksheetName);
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        // 6. Return Response
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        });

    } catch (error) {
        console.error('Export Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
