'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, X, Users, UserCog, Clock, ShieldAlert, MoreHorizontal, Pencil, Trash, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { getAllUsers, approveUser, rejectUser, deleteUser } from '@/actions/auth.actions';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserDialog } from '@/components/users/UserDialog';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    createdAt: Date;
    isActive: boolean;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { toast } = useToast();
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        const result = await getAllUsers();
        if (result.success && result.data) {
            setUsers(result.data);
        } else {
            toast({
                title: 'เกิดข้อผิดพลาด',
                description: 'ไม่สามารถดึงข้อมูลผู้ใช้งานได้',
                variant: 'destructive',
            });
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleApprove = async (id: string) => {
        const result = await approveUser(id);
        if (result.success) {
            toast({ title: 'อนุมัติเรียบร้อย', variant: 'success' });
            fetchUsers();
        } else {
            toast({ title: 'เกิดข้อผิดพลาด', description: result.error, variant: 'destructive' });
        }
    };

    const handleReject = async (id: string) => {
        const result = await rejectUser(id);
        if (result.success) {
            toast({ title: 'ปฏิเสธเรียบร้อย', variant: 'destructive' });
            fetchUsers();
        } else {
            toast({ title: 'เกิดข้อผิดพลาด', description: result.error, variant: 'destructive' });
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        const result = await deleteUser(deleteId);
        if (result.success) {
            toast({ title: 'ลบข้อมูลเรียบร้อย', variant: 'success' });
            setDeleteId(null);
            fetchUsers();
        } else {
            toast({ title: 'เกิดข้อผิดพลาด', description: result.error, variant: 'destructive' });
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const pendingUsers = filteredUsers.filter(user => user.status === 'PENDING');
    const activeUsers = filteredUsers.filter(user => user.status !== 'PENDING');

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'APPROVED': return <Badge variant="success">อนุมัติแล้ว</Badge>;
            case 'PENDING': return <Badge variant="warning">รอตรวจสอบ</Badge>;
            case 'REJECTED': return <Badge variant="destructive">ไม่อนุมัติ</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    const UserTable = ({ data }: { data: User[] }) => (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[250px]">ผู้ใช้งาน</TableHead>
                        <TableHead>ตำแหน่ง</TableHead>
                        <TableHead>สถานะ</TableHead>
                        <TableHead>วันที่สมัคร</TableHead>
                        <TableHead className="text-right">จัดการ</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                ไม่พบข้อมูลผู้ใช้งาน
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                                            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{user.name}</span>
                                            <span className="text-xs text-muted-foreground">{user.email}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{user.role}</Badge>
                                </TableCell>
                                <TableCell>
                                    {getStatusBadge(user.status)}
                                </TableCell>
                                <TableCell>
                                    {new Date(user.createdAt).toLocaleDateString('th-TH')}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>การจัดการ</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.email)}>
                                                คัดลอกอีเมล
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            {user.status === 'PENDING' && (
                                                <>
                                                    <DropdownMenuItem onClick={() => handleApprove(user.id)} className="text-emerald-600">
                                                        <Check className="mr-2 h-4 w-4" /> อนุมัติ
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleReject(user.id)} className="text-red-600">
                                                        <X className="mr-2 h-4 w-4" /> ปฏิเสธ
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                </>
                                            )}
                                            <UserDialog
                                                user={user}
                                                trigger={
                                                    <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground w-full">
                                                        <Pencil className="mr-2 h-4 w-4" /> แก้ไขข้อมูล
                                                    </div>
                                                }
                                                onSuccess={fetchUsers}
                                            />
                                            <DropdownMenuItem onClick={() => setDeleteId(user.id)} className="text-red-600 focus:text-red-600">
                                                <Trash className="mr-2 h-4 w-4" /> ลบผู้ใช้
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">การจัดการผู้ใช้งาน</h2>
                    <p className="text-muted-foreground">
                        ดูแลจัดการบัญชีผู้ใช้งาน สิทธิ์การเข้าถึง และการอนุมัติสมาชิกใหม่
                    </p>
                </div>
                <UserDialog
                    trigger={
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> เพิ่มผู้ใช้งาน
                        </Button>
                    }
                    onSuccess={fetchUsers}
                />
            </div>

            <div className="flex items-center space-x-2">
                <Input
                    placeholder="ค้นหาชื่อ หรือ อีเมล..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="all">ทั้งหมด ({users.length})</TabsTrigger>
                    <TabsTrigger value="active">ใช้งานอยู่ ({activeUsers.length})</TabsTrigger>
                    <TabsTrigger value="pending" className="relative">
                        รอตรวจสอบ
                        {pendingUsers.length > 0 && (
                            <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                                {pendingUsers.length}
                            </span>
                        )}
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-4">
                    <UserTable data={filteredUsers} />
                </TabsContent>
                <TabsContent value="active" className="space-y-4">
                    <UserTable data={activeUsers} />
                </TabsContent>
                <TabsContent value="pending" className="space-y-4">
                    <UserTable data={pendingUsers} />
                </TabsContent>
            </Tabs>

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>ยืนยันการลบผู้ใช้งาน?</AlertDialogTitle>
                        <AlertDialogDescription>
                            การกระทำนี้ไม่สามารถยกเลิกได้ ข้อมูลบัญชีผู้ใช้นี้จะถูกลบออกจากระบบอย่างถาวร
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            ยืนยันการลบ
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
