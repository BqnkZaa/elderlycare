'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { appointmentSchema, type AppointmentInput } from '@/lib/validations/appointment';
import { createAppointment, updateAppointment } from '@/actions/appointment.actions';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
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
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, Clock, MapPin, User, FileText, Bell } from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

interface AppointmentFormProps {
    elderlyId: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: any; // Should be stricter type if possible
}

export function AppointmentForm({ elderlyId, isOpen, onClose, onSuccess, initialData }: AppointmentFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // If initialData exists, format date for input
    const defaultValues: Partial<AppointmentInput> = initialData
        ? {
            ...initialData,
            date: new Date(initialData.date), // Ensure it's a Date object
        }
        : {
            title: '',
            date: new Date(),
            time: '',
            location: '',
            doctorName: '',
            notes: '',
            remindDaysBefore: 1,
            isCompleted: false,
        };

    const form = useForm<AppointmentInput>({
        resolver: zodResolver(appointmentSchema) as any,
        defaultValues: defaultValues as any,
    });

    const onSubmit: any = async (data: AppointmentInput) => {
        setIsSubmitting(true);
        try {
            let result;
            if (initialData?.id) {
                result = await updateAppointment(initialData.id, data);
            } else {
                result = await createAppointment(elderlyId, data);
            }

            if (result.success) {
                form.reset();
                onSuccess();
                onClose();
            } else {
                console.error(result.error);
                // Handle error (could add toast notification here)
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? 'แก้ไขนัดหมาย' : 'เพิ่มการนัดหมาย'}</DialogTitle>
                    <DialogDescription>
                        {initialData ? 'แก้ไขรายละเอียดการนัดหมายแพทย์' : 'ลงบันทึกนัดหมายแพทย์ใหม่สำหรับผู้สูงอายุ'}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>หัวข้อนัดหมาย *</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <FileText className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input placeholder="เช่น นัดตรวจเบาหวาน, รับยาความดัน" className="pl-9" {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>วันที่ *</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    type="date"
                                                    className="pl-9"
                                                    value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                                                    onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="time"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>เวลา</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input type="time" className="pl-9" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>สถานที่</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input placeholder="โรงพยาบาล/คลินิก" className="pl-9" {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="doctorName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>แพทย์ผู้ตรวจ</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input placeholder="ชื่อแพทย์ (ถ้าทราบ)" className="pl-9" {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="remindDaysBefore"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>เตือนล่วงหน้า (วัน)</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Bell className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="number"
                                                min="0"
                                                max="30"
                                                className="pl-9"
                                                {...field}
                                                onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>บันทึกเพิ่มเติม</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="รายละเอียดอื่นๆ, สิ่งที่ต้องเตรียมไป" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose}>
                                ยกเลิก
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'กำลังบันทึก...' : (initialData ? 'บันทึกการแก้ไข' : 'สร้างนัดหมาย')}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
