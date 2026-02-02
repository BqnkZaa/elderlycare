/**
 * Elderly Profile Detail Page
 * 
 * Displays complete profile information and daily logs history.
 */

// Force dynamic rendering - this page requires database connection
export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getElderlyById } from '@/actions/elderly.actions';
import { getElderlyDailyLogs } from '@/actions/daily-log.actions';
import { calculateAge, formatDate } from '@/lib/utils';
import { maskSensitiveData } from '@/lib/encryption';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    User,
    MapPin,
    Phone,
    Heart,
    AlertTriangle,
    FileText,
    Calendar,
    Activity,
    Pill,
    Plus,
    Edit,
} from 'lucide-react';

interface Props {
    params: Promise<{ id: string }>;
}

const genderLabels: Record<string, string> = {
    MALE: 'ชาย',
    FEMALE: 'หญิง',
    OTHER: 'อื่นๆ',
};

const bloodTypeLabels: Record<string, string> = {
    A_POSITIVE: 'A+',
    A_NEGATIVE: 'A-',
    B_POSITIVE: 'B+',
    B_NEGATIVE: 'B-',
    O_POSITIVE: 'O+',
    O_NEGATIVE: 'O-',
    AB_POSITIVE: 'AB+',
    AB_NEGATIVE: 'AB-',
    UNKNOWN: 'ไม่ทราบ',
};

const careLevelLabels: Record<string, { label: string; description: string }> = {
    LEVEL_1: { label: 'ระดับ 1', description: 'ต้องการความช่วยเหลือน้อย' },
    LEVEL_2: { label: 'ระดับ 2', description: 'ต้องการความช่วยเหลือปานกลาง' },
    LEVEL_3: { label: 'ระดับ 3', description: 'ต้องการการดูแลตลอดเวลา' },
    LEVEL_4: { label: 'ระดับ 4', description: 'ต้องการการดูแลอย่างใกล้ชิด' },
};

const mobilityLabels: Record<string, string> = {
    INDEPENDENT: 'เดินได้ด้วยตนเอง',
    NEEDS_ASSISTANCE: 'ต้องมีผู้ช่วยเหลือ',
    WHEELCHAIR: 'ใช้รถเข็น',
    BEDRIDDEN: 'นอนติดเตียง',
};

const moodLabels: Record<string, { label: string; emoji: string }> = {
    HAPPY: { label: 'มีความสุข', emoji: '😊' },
    CONTENT: { label: 'พอใจ', emoji: '🙂' },
    NEUTRAL: { label: 'ปกติ', emoji: '😐' },
    SAD: { label: 'เศร้า', emoji: '😢' },
    ANXIOUS: { label: 'วิตกกังวล', emoji: '😰' },
    IRRITABLE: { label: 'หงุดหงิด', emoji: '😤' },
};

export default async function ElderlyDetailPage({ params }: Props) {
    const { id } = await params;

    const [profileResult, logsResult] = await Promise.all([
        getElderlyById(id),
        getElderlyDailyLogs(id, 1, 5),
    ]);

    if (!profileResult.success || !profileResult.data) {
        notFound();
    }

    const profile = profileResult.data;
    const logs = logsResult.success ? logsResult.data : [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/elderly">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {profile.firstName} {profile.lastName}
                        </h1>
                        <p className="text-gray-500">
                            {profile.nickname && `(${profile.nickname}) • `}
                            {profile.dateOfBirth ? `อายุ ${calculateAge(profile.dateOfBirth)} ปี` : ''}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Link href={`/dashboard/elderly/${id}/log/new`}>
                        <Button variant="secondary">
                            <Plus className="w-4 h-4 mr-2" />
                            เพิ่มบันทึก
                        </Button>
                    </Link>
                    <Link href={`/dashboard/elderly/${id}/edit`}>
                        <Button>
                            <Edit className="w-4 h-4 mr-2" />
                            แก้ไข
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Profile Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5 text-indigo-600" />
                            ข้อมูลส่วนตัว
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Personal */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">
                                    ข้อมูลทั่วไป
                                </h4>
                                <InfoRow label="เลขบัตรประชาชน" value={profile.nationalId ? maskSensitiveData(profile.nationalId, 4) : '-'} />
                                <InfoRow label="เพศ" value={genderLabels[profile.gender]} />
                                <InfoRow label="วันเกิด" value={profile.dateOfBirth ? formatDate(profile.dateOfBirth) : '-'} />
                                <InfoRow label="กรุ๊ปเลือด" value={bloodTypeLabels[profile.bloodType]} />
                                {profile.phoneNumber && (
                                    <InfoRow label="โทรศัพท์" value={maskSensitiveData(profile.phoneNumber, 4)} />
                                )}
                                {profile.email && (
                                    <InfoRow label="อีเมล" value={profile.email || '-'} />
                                )}
                            </div>

                            {/* Address */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-gray-700 dark:text-gray-300 border-b pb-2 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    ที่อยู่
                                </h4>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {profile.address}<br />
                                    ต.{profile.subDistrict} อ.{profile.district}<br />
                                    จ.{profile.province} {profile.postalCode}
                                </p>
                            </div>

                            {/* Emergency Contact */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-gray-700 dark:text-gray-300 border-b pb-2 flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    ผู้ติดต่อฉุกเฉิน
                                </h4>
                                <InfoRow label="ชื่อ" value={profile.emergencyContactName || '-'} />
                                <InfoRow label="ความสัมพันธ์" value={profile.emergencyContactRelation || '-'} />
                                <InfoRow label="โทรศัพท์" value={profile.emergencyContactPhone ? maskSensitiveData(profile.emergencyContactPhone, 4) : '-'} />
                            </div>

                            {/* Registration */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-gray-700 dark:text-gray-300 border-b pb-2 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    ข้อมูลระบบ
                                </h4>
                                <InfoRow label="วันที่ลงทะเบียน" value={formatDate(profile.registrationDate)} />
                                <InfoRow label="สถานะ" value={profile.isActive ? 'ใช้งานอยู่' : 'ไม่ใช้งาน'} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Care Status */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Heart className="w-5 h-5 text-pink-600" />
                            สถานะการดูแล
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
                            <p className="text-sm text-gray-500">ระดับการดูแล</p>
                            <p className="text-xl font-bold text-indigo-600">
                                {careLevelLabels[profile.careLevel]?.label}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                {careLevelLabels[profile.careLevel]?.description}
                            </p>
                        </div>

                        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                            <p className="text-sm text-gray-500">สถานะการเคลื่อนไหว</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                                {mobilityLabels[profile.mobilityStatus]}
                            </p>
                        </div>

                        {profile.primaryCaregiverId && (
                            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                <p className="text-sm text-gray-500">ผู้ดูแลหลัก</p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {profile.primaryCaregiverId}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Health Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-emerald-600" />
                        ข้อมูลสุขภาพ
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <HealthInfoCard
                            icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
                            title="โรคประจำตัว"
                            content={profile.underlyingDiseases || 'ไม่มี'}
                        />
                        <HealthInfoCard
                            icon={<AlertTriangle className="w-5 h-5 text-orange-500" />}
                            title="อาการแพ้"
                            content={profile.allergies || 'ไม่มี'}
                        />
                        <HealthInfoCard
                            icon={<Pill className="w-5 h-5 text-blue-500" />}
                            title="ยาที่ใช้ประจำ"
                            content={profile.currentMedications || 'ไม่มี'}
                        />
                        <HealthInfoCard
                            icon={<Heart className="w-5 h-5 text-pink-500" />}
                            title="อาหารพิเศษ"
                            content={profile.specialDietaryNeeds || 'ไม่มี'}
                        />
                    </div>

                    {profile.notes && (
                        <div className="mt-6 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                            <p className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-1">
                                หมายเหตุ
                            </p>
                            <p className="text-gray-700 dark:text-gray-300">{profile.notes}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Daily Logs */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-600" />
                                บันทึกประจำวันล่าสุด
                            </CardTitle>
                            <CardDescription>ประวัติการบันทึกสุขภาพและกิจกรรม</CardDescription>
                        </div>
                        <Link href={`/dashboard/elderly/${id}/logs`}>
                            <Button variant="outline" size="sm">
                                ดูทั้งหมด
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    {!logs || logs.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>ยังไม่มีบันทึกประจำวัน</p>
                            <Link href={`/dashboard/elderly/${id}/log/new`}>
                                <Button variant="link" className="mt-2">
                                    + เพิ่มบันทึกใหม่
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {logs.map((log) => (
                                <div
                                    key={log.id}
                                    className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                                >
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-xl">
                                        {moodLabels[log.mood]?.emoji || '😐'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {formatDate(log.date)}
                                            </p>
                                            <Badge variant="secondary">
                                                {moodLabels[log.mood]?.label || log.mood}
                                            </Badge>
                                        </div>
                                        {log.activityNote && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                                {log.activityNote}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-400 mt-1">
                                            บันทึกโดย: {log.recordedByName || log.recordedBy}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">{label}</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{value}</span>
        </div>
    );
}

function HealthInfoCard({ icon, title, content }: { icon: React.ReactNode; title: string; content: string }) {
    return (
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <div className="flex items-center gap-2 mb-2">
                {icon}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {content}
            </p>
        </div>
    );
}
