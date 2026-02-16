'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema, type UserInput } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { createUserByAdmin, updateUser } from '@/actions/auth.actions';
import { useRouter } from 'next/navigation';

interface UserDialogProps {
    user?: any; // If provided, it's edit mode
    trigger?: React.ReactNode;
    onSuccess?: () => void;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function UserDialog({ user, trigger, onSuccess, open: openProp, onOpenChange: onOpenChangeProp }: UserDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false);

    // Determine if controlled or uncontrolled
    const isControlled = openProp !== undefined;
    const open = isControlled ? openProp : internalOpen;
    const setOpen = isControlled ? onOpenChangeProp! : setInternalOpen;
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<UserInput>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
            password: 'placeholder', // Handle differently for edit
            role: user?.role || 'STAFF',
            status: user?.status || 'APPROVED',
        },
    });

    useEffect(() => {
        if (user) {
            form.reset({
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                password: 'placeholder_password', // Dummy for validation, won't be sent if not changed logic handled in action
            });
        } else {
            form.reset({
                name: '',
                email: '',
                password: '',
                role: 'STAFF',
                status: 'APPROVED',
            });
        }
    }, [user, form, open]);

    async function onSubmit(data: UserInput) {
        setIsLoading(true);
        try {
            if (user) {
                // Edit Mode
                const updateData: any = {
                    name: data.name,
                    email: data.email,
                    role: data.role,
                    status: data.status,
                };

                // Only send password if it's not the placeholder
                if (data.password !== 'placeholder_password' && data.password.length > 0) {
                    updateData.password = data.password;
                }

                const result = await updateUser(user.id, updateData);
                if (result.success) {
                    toast({ title: 'สำเร็จ!', description: 'อัปเดตข้อมูลผู้ใช้เรียบร้อย', variant: 'success' });
                    setOpen(false);
                    onSuccess?.();
                    router.refresh();
                } else {
                    toast({ title: 'เกิดข้อผิดพลาด', description: result.error, variant: 'destructive' });
                }
            } else {
                // Create Mode
                const result = await createUserByAdmin(data);
                if (result.success) {
                    toast({ title: 'สำเร็จ!', description: 'สร้างผู้ใช้งานเรียบร้อย', variant: 'success' });
                    setOpen(false);
                    form.reset();
                    onSuccess?.();
                    router.refresh();
                } else {
                    toast({ title: 'เกิดข้อผิดพลาด', description: result.error, variant: 'destructive' });
                }
            }
        } catch (error) {
            console.error('Submit error:', error);
            toast({ title: 'เกิดข้อผิดพลาด', description: 'กรุณาลองใหม่อีกครั้ง', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    }

    const isEdit = !!user;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'แก้ไขข้อมูลผู้ใช้' : 'เพิ่มผู้ใช้งานใหม่'}</DialogTitle>
                    <DialogDescription>
                        {isEdit ? 'แก้ไขรายละเอียดบัญชีผู้ใช้งาน' : 'กรอกข้อมูลเพื่อสร้างบัญชีผู้ใช้งานใหม่'}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>ชื่อ-นามสกุล</FormLabel>
                                    <FormControl>
                                        <Input placeholder="เช่น สมชาย ใจดี" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>อีเมล</FormLabel>
                                    <FormControl>
                                        <Input placeholder="admin@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {isEdit ? 'รหัสผ่านใหม่ (เว้นว่างถ้าไม่เปลี่ยน)' : 'รหัสผ่าน'}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder={isEdit ? '••••••' : 'ตั้งรหัสผ่าน'}
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            value={field.value === 'placeholder_password' ? '' : field.value}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>ตำแหน่ง</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="เลือกตำแหน่ง" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="STAFF">พนักงานทั่วไป (Staff)</SelectItem>
                                                <SelectItem value="NURSE">พยาบาล (Nurse)</SelectItem>
                                                <SelectItem value="ADMIN">ผู้ดูแลระบบ (Admin)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {isEdit && (
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>สถานะ</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="เลือกสถานะ" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="APPROVED">อนุมัติ (Active)</SelectItem>
                                                    <SelectItem value="PENDING">รอตรวจสอบ</SelectItem>
                                                    <SelectItem value="REJECTED">ระงับ (Rejected)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'บันทึก...' : 'บันทึกข้อมูล'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
