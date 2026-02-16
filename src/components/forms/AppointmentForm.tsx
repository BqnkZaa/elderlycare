'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { appointmentSchema, type AppointmentInput } from '@/lib/validations/appointment';
import { createAppointment, updateAppointment, getDistinctAppointmentOptions } from '@/actions/appointment.actions';
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
    FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
    CalendarIcon, Clock, MapPin, User, FileText, Bell,
    Link as LinkIcon, PlusCircle, Check
} from 'lucide-react';
import { format, addDays, addMonths } from 'date-fns';
import { th } from 'date-fns/locale';

interface AppointmentFormProps {
    elderlyId: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: any;
}

export function AppointmentForm({ elderlyId, isOpen, onClose, onSuccess, initialData }: AppointmentFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [suggestions, setSuggestions] = useState<{ locations: string[], doctors: string[] }>({ locations: [], doctors: [] });

    useEffect(() => {
        if (isOpen) {
            getDistinctAppointmentOptions().then(res => {
                if (res.success && res.data) {
                    setSuggestions(res.data);
                }
            });
        }
    }, [isOpen]);

    const defaultValues: Partial<AppointmentInput> = initialData
        ? {
            ...initialData,
            date: new Date(initialData.date),
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
            attachmentUrl: '',
            notifyCoordinator: true,
            notifyGuardian: true,
        };

    const form = useForm<AppointmentInput>({
        resolver: zodResolver(appointmentSchema) as any,
        defaultValues: defaultValues as any,
    });

    const setDatePreset = (days: number, months: number = 0) => {
        const currentDate = new Date();
        let newDate = addDays(currentDate, days);
        if (months > 0) newDate = addMonths(newDate, months);
        form.setValue('date', newDate);
    };

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
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
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
                                    <FormItem className="flex flex-col">
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
                                        <div className="flex gap-2 mt-1 overflow-x-auto pb-2">
                                            <Button type="button" variant="outline" size="sm" onClick={() => setDatePreset(7)} className="text-xs h-7 px-2">
                                                +1 สัปดาห์
                                            </Button>
                                            <Button type="button" variant="outline" size="sm" onClick={() => setDatePreset(14)} className="text-xs h-7 px-2">
                                                +2 สัปดาห์
                                            </Button>
                                            <Button type="button" variant="outline" size="sm" onClick={() => setDatePreset(0, 1)} className="text-xs h-7 px-2">
                                                +1 เดือน
                                            </Button>
                                            <Button type="button" variant="outline" size="sm" onClick={() => setDatePreset(0, 3)} className="text-xs h-7 px-2">
                                                +3 เดือน
                                            </Button>
                                        </div>
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>สถานที่</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input list="location-suggestions" placeholder="โรงพยาบาล/คลินิก" className="pl-9" {...field} />
                                                <datalist id="location-suggestions">
                                                    {suggestions.locations.map((loc, i) => (
                                                        <option key={i} value={loc} />
                                                    ))}
                                                </datalist>
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
                                                <Input list="doctor-suggestions" placeholder="ชื่อแพทย์ (ถ้าทราบ)" className="pl-9" {...field} />
                                                <datalist id="doctor-suggestions">
                                                    {suggestions.doctors.map((doc, i) => (
                                                        <option key={i} value={doc} />
                                                    ))}
                                                </datalist>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="attachmentUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>แนบลิงก์เอกสาร/รูปภาพ (ถ้ามี)</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="https://example.com/file.pdf"
                                                className="pl-9"
                                                {...field}
                                                value={field.value || ''}
                                                onChange={(e) => field.onChange(e.target.value)}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                        ใส่ URL ของไฟล์รูปภาพหรือเอกสารใบนัดหมาย (รองรับ Google Drive, Dropbox ฯลฯ)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="bg-muted/30 p-3 rounded-lg border border-border space-y-3">
                            <h4 className="text-sm font-medium flex items-center gap-2">
                                <Bell className="w-4 h-4" /> การแจ้งเตือน (Notifications)
                            </h4>

                            <FormField
                                control={form.control}
                                name="remindDaysBefore"
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-2 space-y-0">
                                        <FormLabel className="font-normal min-w-[100px]">เตือนล่วงหน้า:</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="30"
                                                className="w-20 h-8"
                                                {...field}
                                                onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                                            />
                                        </FormControl>
                                        <span className="text-sm text-muted-foreground">วัน</span>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex flex-col gap-2 pt-2">
                                <FormField
                                    control={form.control}
                                    name="notifyCoordinator"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel className="font-normal">
                                                    แจ้งเตือนผู้ประสานงานหลัก (Key Coordinator)
                                                </FormLabel>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="notifyGuardian"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel className="font-normal">
                                                    แจ้งเตือนผู้มีอำนาจตัดสินใจ (Guardian)
                                                </FormLabel>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

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
