/**
 * User Management Page (Admin Only)
 * 
 * Allows admin to view pending users and approve/reject them.
 */

'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getPendingUsers, approveUser, rejectUser } from '@/actions/auth.actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, X, Users, UserCog, Clock, ShieldAlert } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: Date;
}

export default function UsersPage() {
    const { data: session } = useSession();
    const router = useRouter();
    // Use a simple alert for now as toast provider might not be set up globally yet
    // or use local state for messages
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        // Redirect if not admin
        if (session?.user?.role !== 'ADMIN') {
            // router.push('/dashboard');
            // Allow render for now to debug, but in production should redirect
        }

        fetchUsers();
    }, [session]);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const result = await getPendingUsers();
            if (result.success && result.data) {
                setUsers(result.data);
            }
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async (userId: string) => {
        setActionLoading(userId);
        try {
            const result = await approveUser(userId);
            if (result.success) {
                setUsers(users.filter(u => u.id !== userId));
            }
        } catch (error) {
            console.error('Failed to approve user', error);
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (userId: string) => {
        if (!confirm('คุณแน่ใจหรือไม่ที่จะปฏิเสธการลงทะเบียนนี้?')) return;

        setActionLoading(userId);
        try {
            const result = await rejectUser(userId);
            if (result.success) {
                setUsers(users.filter(u => u.id !== userId));
            }
        } catch (error) {
            console.error('Failed to reject user', error);
        } finally {
            setActionLoading(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        จัดการผู้ใช้งาน
                    </h2>
                    <p className="text-muted-foreground">
                        ตรวจสอบและอนุมัติการลงทะเบียนสมาชิกใหม่
                    </p>
                </div>
                {/* Stats or Actions */}
            </div>

            <Card className="border-border/50 shadow-lg backdrop-blur-sm bg-card/50">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-amber-500" />
                        <CardTitle>รอการตรวจสอบ ({users.length})</CardTitle>
                    </div>
                    <CardDescription>
                        รายชื่อผู้ที่ลงทะเบียนเข้ามาใหม่และรอการอนุมัติสิทธิ์เข้าใช้งาน
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {users.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border/50 rounded-xl bg-muted/20">
                            <UserCog className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>ไม่มีรายการที่รอการตรวจสอบในขณะนี้</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {users.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex flex-col p-4 bg-background border border-border/50 rounded-xl shadow-sm hover:shadow-md transition-all hover:border-primary/20 group"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 border border-border">
                                                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h3 className="font-semibold text-sm">{user.name}</h3>
                                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200">
                                            {user.role}
                                        </Badge>
                                    </div>

                                    <div className="mt-auto pt-4 flex gap-2">
                                        <Button
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                            size="sm"
                                            onClick={() => handleApprove(user.id)}
                                            disabled={actionLoading === user.id}
                                        >
                                            {actionLoading === user.id ? (
                                                <span className="animate-spin mr-2">⏳</span>
                                            ) : (
                                                <Check className="w-4 h-4 mr-2" />
                                            )}
                                            อนุมัติ
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="flex-1 hover:bg-destructive hover:text-destructive-foreground border-destructive/30 text-destructive"
                                            size="sm"
                                            onClick={() => handleReject(user.id)}
                                            disabled={actionLoading === user.id}
                                        >
                                            <X className="w-4 h-4 mr-2" />
                                            ปฏิเสธ
                                        </Button>
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
