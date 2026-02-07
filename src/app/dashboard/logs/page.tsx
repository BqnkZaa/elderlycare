/**
 * Daily Logs Page
 * 
 * Displays all daily logs with filters and pagination.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getDailyLogs } from '@/actions/daily-log.actions';
import { getElderlyProfiles } from '@/actions/elderly.actions';
import { formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NativeSelect as Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
    FileText,
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    Eye,
    Calendar,
    Heart,
    Utensils,
    Moon,
    User,
    X,
    Plus,
    Edit,
} from 'lucide-react';

// Types
interface DailyLog {
    id: string;
    date: Date;
    mood: string;
    mealIntake: string;
    sleepQuality: string;
    sleepHours: number | null;
    medicationsTaken: boolean;
    vitals: {
        temperature?: number;
        bloodPressureSystolic?: number;
        bloodPressureDiastolic?: number;
        heartRate?: number;
        oxygenSaturation?: number;
    } | null;
    activityNote: string | null;
    recordedByName: string | null;
    createdAt: Date;
    elderly: {
        id: string;
        firstName: string;
        lastName: string;
    };
}

interface ElderlyOption {
    id: string;
    firstName: string;
    lastName: string;
}

interface PaginationMeta {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

// Label mappings
const moodLabels: Record<string, { label: string; color: 'default' | 'success' | 'warning' | 'destructive' }> = {
    HAPPY: { label: '😊 มีความสุข', color: 'success' },
    CONTENT: { label: '🙂 พอใจ', color: 'success' },
    NEUTRAL: { label: '😐 ปกติ', color: 'default' },
    SAD: { label: '😢 เศร้า', color: 'warning' },
    ANXIOUS: { label: '😰 วิตกกังวล', color: 'warning' },
    IRRITABLE: { label: '😤 หงุดหงิด', color: 'destructive' },
};

const mealLabels: Record<string, { label: string; color: 'default' | 'success' | 'warning' | 'destructive' }> = {
    FULL: { label: 'กินหมด', color: 'success' },
    PARTIAL: { label: 'กินบางส่วน', color: 'default' },
    MINIMAL: { label: 'กินน้อย', color: 'warning' },
    NONE: { label: 'ไม่กิน', color: 'destructive' },
};

const sleepLabels: Record<string, { label: string; color: 'default' | 'success' | 'warning' | 'destructive' }> = {
    EXCELLENT: { label: 'ดีมาก', color: 'success' },
    GOOD: { label: 'ดี', color: 'success' },
    FAIR: { label: 'พอใช้', color: 'default' },
    POOR: { label: 'ไม่ดี', color: 'warning' },
    VERY_POOR: { label: 'แย่มาก', color: 'destructive' },
};

export default function LogsPage() {
    const [logs, setLogs] = useState<DailyLog[]>([]);
    const [elderlyOptions, setElderlyOptions] = useState<ElderlyOption[]>([]);
    const [pagination, setPagination] = useState<PaginationMeta | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Filters
    const [elderlyId, setElderlyId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [page, setPage] = useState(1);

    // Fetch elderly options for dropdown
    useEffect(() => {
        async function fetchElderlyOptions() {
            const result = await getElderlyProfiles({ pageSize: 100 });
            if (result.success && result.data) {
                setElderlyOptions(result.data.map((e: { id: string; firstName: string; lastName: string }) => ({
                    id: e.id,
                    firstName: e.firstName,
                    lastName: e.lastName,
                })));
            }
        }
        fetchElderlyOptions();
    }, []);

    // Fetch logs
    const fetchLogs = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await getDailyLogs({
                elderlyId: elderlyId || undefined,
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
                page,
                pageSize: 10,
            });

            if (result.success && result.data) {
                setLogs(result.data as unknown as DailyLog[]);
                setPagination(result.pagination || null);
            }
        } catch (error) {
            console.error('Error fetching logs:', error);
        }
        setIsLoading(false);
    }, [elderlyId, startDate, endDate, page]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchLogs();
    };

    const clearFilters = () => {
        setElderlyId('');
        setStartDate('');
        setEndDate('');
        setPage(1);
    };

    const formatVitals = (vitals: DailyLog['vitals']) => {
        if (!vitals) return '-';
        const parts: string[] = [];
        if (vitals.bloodPressureSystolic && vitals.bloodPressureDiastolic) {
            parts.push(`BP: ${vitals.bloodPressureSystolic}/${vitals.bloodPressureDiastolic}`);
        }
        if (vitals.heartRate) {
            parts.push(`HR: ${vitals.heartRate}`);
        }
        if (vitals.temperature) {
            parts.push(`T: ${vitals.temperature}°C`);
        }
        if (vitals.oxygenSaturation) {
            parts.push(`O2: ${vitals.oxygenSaturation}%`);
        }
        return parts.length > 0 ? parts.join(' | ') : '-';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <FileText className="w-7 h-7 text-emerald-600" />
                        บันทึกประจำวัน
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        ดูบันทึกประจำวันของผู้สูงอายุทั้งหมดในระบบ
                    </p>
                </div>
                <Link href="/dashboard/logs/new">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                        <Plus className="w-4 h-4 mr-2" />
                        เพิ่มบันทึกใหม่
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <Card className="bg-card/50 backdrop-blur-sm border-border">
                <CardContent className="p-4">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                        {/* Elderly Select */}
                        <div className="flex-1 flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <Select
                                value={elderlyId}
                                onChange={(e) => {
                                    setElderlyId(e.target.value);
                                    setPage(1);
                                }}
                                className="bg-background/50 border-input"
                            >
                                <option value="">ผู้สูงอายุทั้งหมด</option>
                                {elderlyOptions.map((e) => (
                                    <option key={e.id} value={e.id}>
                                        {e.firstName} {e.lastName}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        {/* Date Range */}
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="bg-background/50 border-input w-40"
                                placeholder="เริ่มต้น"
                            />
                            <span className="text-muted-foreground">-</span>
                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="bg-background/50 border-input w-40"
                                placeholder="สิ้นสุด"
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" variant="secondary" className="hover:bg-secondary/80">
                                <Search className="w-4 h-4 mr-2" />
                                ค้นหา
                            </Button>
                            {(elderlyId || startDate || endDate) && (
                                <Button type="button" variant="outline" onClick={clearFilters}>
                                    <X className="w-4 h-4 mr-2" />
                                    ล้าง
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Results */}
            <Card className="bg-card/50 backdrop-blur-sm border-border">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between text-foreground">
                        <span>รายการบันทึก</span>
                        {pagination && (
                            <span className="text-sm font-normal text-muted-foreground">
                                ทั้งหมด {pagination.totalItems} รายการ
                            </span>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg">ไม่พบบันทึกประจำวัน</p>
                            <p className="text-sm mt-2">ลองเปลี่ยนเงื่อนไขการค้นหา หรือเพิ่มบันทึกใหม่</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border">
                                            <th className="py-3 px-4 text-left text-sm font-semibold text-muted-foreground">วันที่</th>
                                            <th className="py-3 px-4 text-left text-sm font-semibold text-muted-foreground">ผู้สูงอายุ</th>
                                            <th className="py-3 px-4 text-left text-sm font-semibold text-muted-foreground">อารมณ์</th>
                                            <th className="py-3 px-4 text-left text-sm font-semibold text-muted-foreground">อาหาร</th>
                                            <th className="py-3 px-4 text-left text-sm font-semibold text-muted-foreground">การนอน</th>
                                            <th className="py-3 px-4 text-left text-sm font-semibold text-muted-foreground">สัญญาณชีพ</th>
                                            <th className="py-3 px-4 text-left text-sm font-semibold text-muted-foreground">ผู้บันทึก</th>
                                            <th className="py-3 px-4 text-right text-sm font-semibold text-muted-foreground">การดำเนินการ</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {logs.map((log) => (
                                            <tr key={log.id} className="hover:bg-accent/50 transition-colors">
                                                <td className="py-3 px-4">
                                                    <span className="flex items-center gap-2 text-sm text-foreground">
                                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                                        {formatDate(log.date)}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <Link
                                                        href={`/dashboard/elderly/${log.elderly.id}`}
                                                        className="text-primary hover:underline font-medium"
                                                    >
                                                        {log.elderly.firstName} {log.elderly.lastName}
                                                    </Link>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <Badge variant={moodLabels[log.mood]?.color || 'default'}>
                                                        {moodLabels[log.mood]?.label || log.mood}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="flex items-center gap-1 text-sm">
                                                        <Utensils className="w-3 h-3 text-muted-foreground" />
                                                        <Badge variant={mealLabels[log.mealIntake]?.color || 'default'} className="bg-opacity-20">
                                                            {mealLabels[log.mealIntake]?.label || log.mealIntake}
                                                        </Badge>
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="flex items-center gap-1 text-sm">
                                                        <Moon className="w-3 h-3 text-muted-foreground" />
                                                        <Badge variant={sleepLabels[log.sleepQuality]?.color || 'default'} className="bg-opacity-20">
                                                            {sleepLabels[log.sleepQuality]?.label || log.sleepQuality}
                                                        </Badge>
                                                        {log.sleepHours && (
                                                            <span className="text-muted-foreground ml-1">({log.sleepHours} ชม.)</span>
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <Heart className="w-3 h-3" />
                                                        {formatVitals(log.vitals)}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-sm text-muted-foreground">
                                                    {log.recordedByName || '-'}
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Link href={`/dashboard/logs/${log.id}/edit`}>
                                                            <Button variant="ghost" size="sm" className="hover:bg-accent hover:text-accent-foreground">
                                                                <Edit className="w-4 h-4 mr-1" />
                                                                แก้ไข
                                                            </Button>
                                                        </Link>
                                                        <Link href={`/dashboard/elderly/${log.elderly.id}`}>
                                                            <Button variant="ghost" size="sm" className="hover:bg-accent hover:text-accent-foreground">
                                                                <Eye className="w-4 h-4 mr-1" />
                                                                ดู
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="lg:hidden space-y-3">
                                {logs.map((log) => (
                                    <Link
                                        key={log.id}
                                        href={`/dashboard/elderly/${log.elderly.id}`}
                                        className="block p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors bg-card/30"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="font-semibold text-foreground">
                                                {log.elderly.firstName} {log.elderly.lastName}
                                            </span>
                                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(log.date)}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            <Badge variant={moodLabels[log.mood]?.color || 'default'}>
                                                {moodLabels[log.mood]?.label || log.mood}
                                            </Badge>
                                            <Badge variant={mealLabels[log.mealIntake]?.color || 'default'}>
                                                <Utensils className="w-3 h-3 mr-1" />
                                                {mealLabels[log.mealIntake]?.label || log.mealIntake}
                                            </Badge>
                                            <Badge variant={sleepLabels[log.sleepQuality]?.color || 'default'}>
                                                <Moon className="w-3 h-3 mr-1" />
                                                {sleepLabels[log.sleepQuality]?.label || log.sleepQuality}
                                            </Badge>
                                        </div>
                                        {log.vitals && (
                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Heart className="w-3 h-3" />
                                                {formatVitals(log.vitals)}
                                            </p>
                                        )}
                                    </Link>
                                ))}
                            </div>

                            {/* Pagination */}
                            {pagination && pagination.totalPages > 1 && (
                                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                                    <p className="text-sm text-muted-foreground">
                                        หน้า {pagination.currentPage} จาก {pagination.totalPages}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(page - 1)}
                                            disabled={!pagination.hasPrevPage}
                                            className="hover:bg-accent hover:text-accent-foreground"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(page + 1)}
                                            disabled={!pagination.hasNextPage}
                                            className="hover:bg-accent hover:text-accent-foreground"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
