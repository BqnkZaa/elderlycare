import { getPartnerCenters } from '@/actions/partner.actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, Building2, Phone, MapPin, Search } from 'lucide-react';
import { PartnerCenter } from '@prisma/client';

export default async function PartnersPage() {
    const result = await getPartnerCenters();
    const partners: PartnerCenter[] = result.success ? (result.data as PartnerCenter[]) : [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">จัดการข้อมูลศูนย์ (Partner Centers)</h1>
                    <p className="text-muted-foreground mt-1">บริหารจัดการข้อมูลศูนย์และประเภทผู้ป่วยที่แต่ละศูนย์รองรับ</p>
                </div>
                <Link href="/dashboard/partners/new">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                        <Plus className="w-5 h-5 mr-2" />
                        เพิ่มศูนย์ใหม่ (New Center)
                    </Button>
                </Link>
            </div>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-3 border-b border-border/50">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-primary" />
                            รายการศูนย์ทั้งหมด ({partners?.length || 0})
                        </CardTitle>
                        <div className="flex items-center bg-background/50 border border-border rounded-lg px-3 py-1.5 w-64">
                            <Search className="w-4 h-4 text-muted-foreground mr-2" />
                            <input
                                type="text"
                                placeholder="ค้นหาชื่อศูนย์..."
                                className="bg-transparent text-sm focus:outline-none w-full"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-accent/30 text-muted-foreground text-xs uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-4">รหัสศูนย์ (PID)</th>
                                    <th className="px-6 py-4">ชื่อศูนย์</th>
                                    <th className="px-6 py-4">เบอร์ติดต่อ</th>
                                    <th className="px-6 py-4">สถานะ</th>
                                    <th className="px-6 py-4 text-right">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {partners && partners.length > 0 ? (
                                    partners.map((partner: PartnerCenter) => (
                                        <tr key={partner.id} className="hover:bg-accent/10 transition-colors group">
                                            <td className="px-6 py-4 font-mono text-sm text-primary font-bold">{partner.pid}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-foreground">{partner.name}</div>
                                                <div className="text-xs text-muted-foreground flex items-center mt-0.5">
                                                    <MapPin className="w-3 h-3 mr-1" />
                                                    {partner.address || 'ไม่ระบุที่อยู่'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm flex items-center">
                                                    <Phone className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                                                    {partner.contact || '-'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${partner.isActive
                                                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                                    : 'bg-destructive/10 text-destructive border border-destructive/20'
                                                    }`}>
                                                    {partner.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link href={`/dashboard/partners/${partner.id}`}>
                                                    <Button variant="outline" size="sm" className="hover:bg-primary/10 hover:text-primary transition-colors">
                                                        ดูรายละเอียด
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-20 text-center text-muted-foreground italic">
                                            ไม่พบข้อมูลศูนย์ (No Centers Found)
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
