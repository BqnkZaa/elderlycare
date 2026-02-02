/**
 * Alerts Page
 */

// Force dynamic rendering - this page requires database connection
export const dynamic = 'force-dynamic';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell } from 'lucide-react';
import prisma from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

async function getRecentAlerts() {
    const alerts = await prisma.alertLog.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
    });
    return alerts;
}

export default async function AlertsPage() {
    const alerts = await getRecentAlerts();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Bell className="w-7 h-7 text-amber-600" />
                การแจ้งเตือน
            </h1>

            <Card>
                <CardHeader>
                    <CardTitle>ประวัติการแจ้งเตือน</CardTitle>
                </CardHeader>
                <CardContent>
                    {alerts.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">ยังไม่มีประวัติการแจ้งเตือน</p>
                    ) : (
                        <div className="space-y-3">
                            {alerts.map((alert) => (
                                <div key={alert.id} className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                    <div className="flex-1">
                                        <p className="font-medium">{alert.elderlyName}</p>
                                        <p className="text-sm text-gray-500">{alert.message}</p>
                                    </div>
                                    <Badge variant={alert.status === 'SENT' ? 'success' : 'secondary'}>
                                        {alert.status}
                                    </Badge>
                                    <span className="text-sm text-gray-400">{formatDate(alert.createdAt)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
