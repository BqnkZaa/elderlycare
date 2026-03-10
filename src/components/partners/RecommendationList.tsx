'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Building2, Phone, MapPin, Star } from 'lucide-react';
import Link from 'next/link';

interface RecommendedCenter {
    id: string;
    pid: string;
    name: string;
    contact: string | null;
    address: string | null;
    matchScore: number;
    matchReasons: string[];
}

interface RecommendationListProps {
    recommendations: RecommendedCenter[];
    onClose?: () => void;
}

export function RecommendationList({ recommendations, onClose }: RecommendationListProps) {
    if (recommendations.length === 0) {
        return (
            <div className="text-center py-10 space-y-4">
                <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    <Building2 className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-bold">ไม่พบศูนย์ที่ตรงตามเงื่อนไข</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto">
                        ขออภัย ไม่พบศูนย์ที่รองรับความต้องการทางการแพทย์ที่ระบุ
                    </p>
                </div>
                {onClose && (
                    <Button onClick={onClose} variant="outline">กลับไปแก้ไขข้อมูล</Button>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                        <Star className="w-6 h-6 fill-primary" />
                        ศูนย์แนะนำสำหรับคุณ (Recommendations)
                    </h2>
                    <p className="text-muted-foreground">
                        อ้างอิงจากข้อมูลการประเมินเบื้องต้นของคุณ
                    </p>
                </div>
                {onClose && (
                    <Button onClick={onClose} variant="ghost">ปิด</Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.map((center) => (
                    <Card key={center.id} className="overflow-hidden border-primary/20 hover:border-primary/50 transition-all shadow-md hover:shadow-lg bg-card/50 backdrop-blur-sm">
                        <CardHeader className="pb-3 bg-primary/5">
                            <div className="flex justify-between items-start">
                                <Badge variant="outline" className="font-mono bg-background">
                                    {center.pid}
                                </Badge>
                                <Badge className="bg-green-500 hover:bg-green-600">
                                    ตรงกัน {Math.min(100, Math.floor(center.matchScore * 2))}%
                                </Badge>
                            </div>
                            <CardTitle className="text-lg mt-2 flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-primary" />
                                {center.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            <div className="space-y-2 text-sm text-muted-foreground">
                                {center.contact && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-primary" />
                                        {center.contact}
                                    </div>
                                )}
                                {center.address && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        <span className="line-clamp-1">{center.address}</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs font-bold text-foreground/50 uppercase">จุดเด่นที่ตรงใจ:</p>
                                <div className="flex flex-wrap gap-1">
                                    {center.matchReasons.map((reason, idx) => (
                                        <div key={idx} className="flex items-center gap-1 text-xs bg-secondary/10 text-secondary border border-secondary/20 px-2 py-0.5 rounded-full">
                                            <Check className="w-3 h-3" />
                                            {reason}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Link href={`/dashboard/partners/${center.id}`} className="block">
                                <Button className="w-full mt-2 group" variant="secondary">
                                    ดูรายละเอียดศูนย์
                                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
