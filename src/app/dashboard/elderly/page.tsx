/**
 * Elderly Profiles List Page
 * 
 * Displays all elderly profiles with province filter and search.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getElderlyProfiles } from '@/actions/elderly.actions';
import { PROVINCE_NAMES_TH } from '@/lib/provinces';
import { calculateAge, formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NativeSelect as Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
    Users,
    Plus,
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    Eye,
    MapPin,
} from 'lucide-react';

interface ElderlyProfile {
    id: string;
    firstName: string;
    lastName: string;
    nickname: string | null;
    dateOfBirth: Date;
    gender: string;
    province: string;
    careLevel: string;
    mobilityStatus: string;
    isActive: boolean;
    createdAt: Date;
    _count: { dailyLogs: number };
}

interface PaginationMeta {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

const careLevelLabels: Record<string, { label: string; color: 'default' | 'success' | 'warning' | 'destructive' }> = {
    LEVEL_1: { label: 'ระดับ 1', color: 'success' },
    LEVEL_2: { label: 'ระดับ 2', color: 'default' },
    LEVEL_3: { label: 'ระดับ 3', color: 'warning' },
    LEVEL_4: { label: 'ระดับ 4', color: 'destructive' },
};

const mobilityLabels: Record<string, string> = {
    INDEPENDENT: 'เดินได้เอง',
    NEEDS_ASSISTANCE: 'ต้องมีคนช่วย',
    WHEELCHAIR: 'นั่งรถเข็น',
    BEDRIDDEN: 'นอนติดเตียง',
};

export default function ElderlyListPage() {
    const [profiles, setProfiles] = useState<ElderlyProfile[]>([]);
    const [pagination, setPagination] = useState<PaginationMeta | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [province, setProvince] = useState('');
    const [page, setPage] = useState(1);

    const fetchProfiles = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await getElderlyProfiles({
                search: search || undefined,
                province: province || undefined,
                page,
                pageSize: 10,
            });

            if (result.success && result.data) {
                setProfiles(result.data as unknown as ElderlyProfile[]);
                setPagination(result.pagination || null);
            }
        } catch (error) {
            console.error('Error fetching profiles:', error);
        }
        setIsLoading(false);
    }, [search, province, page]);

    useEffect(() => {
        fetchProfiles();
    }, [fetchProfiles]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchProfiles();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Users className="w-7 h-7 text-primary" />
                        ข้อมูลผู้สูงอายุ
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        จัดการข้อมูลผู้สูงอายุทั้งหมดในระบบ
                    </p>
                </div>
                <Link href="/dashboard/elderly/new">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                        <Plus className="w-4 h-4 mr-2" />
                        เพิ่มผู้สูงอายุ
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <Card className="bg-card/50 backdrop-blur-sm border-border">
                <CardContent className="p-4">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="ค้นหาชื่อ-นามสกุล..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 bg-background/50 border-input"
                            />
                        </div>
                        <div className="w-full md:w-64 flex items-center gap-2">
                            <Filter className="w-4 h-4 text-muted-foreground" />
                            <Select
                                value={province}
                                onChange={(e) => {
                                    setProvince(e.target.value);
                                    setPage(1);
                                }}
                                className="bg-background/50 border-input"
                            >
                                <option value="">ทุกจังหวัด (77)</option>
                                {PROVINCE_NAMES_TH.map((p) => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </Select>
                        </div>
                        <Button type="submit" variant="secondary" className="hover:bg-secondary/80">
                            <Search className="w-4 h-4 mr-2" />
                            ค้นหา
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Results */}
            <Card className="bg-card/50 backdrop-blur-sm border-border">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between text-foreground">
                        <span>รายการผู้สูงอายุ</span>
                        {pagination && (
                            <span className="text-sm font-normal text-muted-foreground">
                                ทั้งหมด {pagination.totalItems} คน
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
                    ) : profiles.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg">ไม่พบข้อมูลผู้สูงอายุ</p>
                            <p className="text-sm mt-2">ลองเปลี่ยนเงื่อนไขการค้นหา หรือเพิ่มข้อมูลใหม่</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border">
                                            <th className="py-3 px-4 text-left text-sm font-semibold text-muted-foreground">ชื่อ-นามสกุล</th>
                                            <th className="py-3 px-4 text-left text-sm font-semibold text-muted-foreground">อายุ</th>
                                            <th className="py-3 px-4 text-left text-sm font-semibold text-muted-foreground">จังหวัด</th>
                                            <th className="py-3 px-4 text-left text-sm font-semibold text-muted-foreground">ระดับการดูแล</th>
                                            <th className="py-3 px-4 text-left text-sm font-semibold text-muted-foreground">สถานะ</th>
                                            <th className="py-3 px-4 text-left text-sm font-semibold text-muted-foreground">บันทึก</th>
                                            <th className="py-3 px-4 text-right text-sm font-semibold text-muted-foreground">การดำเนินการ</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {profiles.map((profile) => (
                                            <tr key={profile.id} className="hover:bg-accent/50 transition-colors">
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold shadow-md shadow-primary/20">
                                                            {profile.firstName.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-foreground">
                                                                {profile.firstName} {profile.lastName}
                                                            </p>
                                                            {profile.nickname && (
                                                                <p className="text-sm text-muted-foreground">({profile.nickname})</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-sm text-muted-foreground">
                                                    {calculateAge(profile.dateOfBirth)} ปี
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                                        <MapPin className="w-3 h-3" />
                                                        {profile.province}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <Badge variant={careLevelLabels[profile.careLevel]?.color || 'default'} className="bg-opacity-20">
                                                        {careLevelLabels[profile.careLevel]?.label || profile.careLevel}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <Badge variant={profile.isActive ? 'success' : 'secondary'} className="bg-opacity-20">
                                                        {profile.isActive ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 px-4 text-sm text-muted-foreground">
                                                    {profile._count.dailyLogs} รายการ
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <Link href={`/dashboard/elderly/${profile.id}`}>
                                                        <Button variant="ghost" size="sm" className="hover:bg-accent hover:text-accent-foreground">
                                                            <Eye className="w-4 h-4 mr-1" />
                                                            ดูรายละเอียด
                                                        </Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="md:hidden space-y-3">
                                {profiles.map((profile) => (
                                    <Link
                                        key={profile.id}
                                        href={`/dashboard/elderly/${profile.id}`}
                                        className="block p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors bg-card/30"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold text-lg shadow-md shadow-primary/20">
                                                {profile.firstName.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-foreground">
                                                    {profile.firstName} {profile.lastName}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {calculateAge(profile.dateOfBirth)} ปี • {profile.province}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant={careLevelLabels[profile.careLevel]?.color || 'default'} className="bg-opacity-20">
                                                {careLevelLabels[profile.careLevel]?.label || profile.careLevel}
                                            </Badge>
                                            <Badge variant="secondary" className="bg-opacity-20">
                                                {mobilityLabels[profile.mobilityStatus]}
                                            </Badge>
                                        </div>
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
