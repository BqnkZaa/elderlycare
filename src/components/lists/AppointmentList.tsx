'use client';

import { useState, useEffect, useCallback } from 'react';
import { Appointment } from '@prisma/client';
import { deleteAppointment, getAppointments } from '@/actions/appointment.actions';
import { AppointmentForm } from '@/components/forms/AppointmentForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, User, Trash2, Edit, Plus, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AppointmentListProps {
    elderlyId: string;
}

export function AppointmentList({ elderlyId }: AppointmentListProps) {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState<Appointment | undefined>(undefined);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchAppointments = useCallback(async () => {
        try {
            const result = await getAppointments(elderlyId);
            if (result.success && result.data) {
                setAppointments(result.data);
            }
        } catch (error) {
            console.error('Failed to fetch appointments', error);
        } finally {
            setIsLoading(false);
        }
    }, [elderlyId]);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    const handleCreate = () => {
        setEditingAppointment(undefined);
        setIsFormOpen(true);
    };

    const handleEdit = (appointment: Appointment) => {
        setEditingAppointment(appointment);
        setIsFormOpen(true);
    };

    const handleDelete = async () => {
        if (!deletingId) return;

        try {
            await deleteAppointment(deletingId, elderlyId);
            setDeletingId(null);
            fetchAppointments(); // Refresh list
        } catch (error) {
            console.error('Failed to delete appointment', error);
        }
    };

    return (
        <Card className="bg-card/50 backdrop-blur-sm border-border mt-8">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-primary">
                    <Calendar className="w-5 h-5" />
                    การนัดหมายแพทย์ (Medical Appointments)
                </CardTitle>
                <Button size="sm" onClick={handleCreate} className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-1" />
                    เพิ่มนัดหมาย
                </Button>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <svg className="animate-spin h-6 w-6 text-primary" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                    </div>
                ) : appointments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg bg-accent/5">
                        <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>ยังไม่มีรายการนัดหมาย</p>
                        <Button variant="link" onClick={handleCreate}>
                            สร้างนัดหมายใหม่
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {appointments.map((apt) => (
                            <div
                                key={apt.id}
                                className={`flex flex-col md:flex-row gap-4 p-4 rounded-lg border ${new Date(apt.date) < new Date() ? 'bg-muted/30 border-border opacity-70' : 'bg-card border-l-4 border-l-primary shadow-sm'
                                    }`}
                            >
                                {/* Date Box */}
                                <div className="flex-none flex md:flex-col items-center justify-center md:w-24 bg-accent/10 rounded-md p-2 text-center border border-border min-w-[80px]">
                                    <span className="text-xs font-medium text-muted-foreground uppercase">
                                        {format(new Date(apt.date), 'MMM', { locale: th })}
                                    </span>
                                    <span className="text-2xl font-bold text-foreground">
                                        {format(new Date(apt.date), 'd')}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {format(new Date(apt.date), 'yyyy', { locale: th })}
                                    </span>
                                </div>

                                {/* Details */}
                                <div className="flex-1 space-y-2 py-1">
                                    <div className="flex flex-wrap justify-between items-start gap-2">
                                        <h4 className="font-semibold text-lg text-foreground">{apt.title}</h4>
                                        {apt.remindDaysBefore > 0 && new Date(apt.date) >= new Date() && (
                                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full flex items-center gap-1 dark:bg-yellow-900/30 dark:text-yellow-500 border border-yellow-200 dark:border-yellow-800">
                                                <AlertCircle className="w-3 h-3" />
                                                เตือนก่อน {apt.remindDaysBefore} วัน
                                            </span>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-muted-foreground">
                                        {apt.time && (
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-primary/70" />
                                                {apt.time} น.
                                            </div>
                                        )}
                                        {apt.location && (
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-primary/70" />
                                                {apt.location}
                                            </div>
                                        )}
                                        {apt.doctorName && (
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-primary/70" />
                                                {apt.doctorName}
                                            </div>
                                        )}
                                    </div>

                                    {apt.notes && (
                                        <div className="bg-muted/50 p-2 rounded text-sm text-muted-foreground mt-2 border border-border/50">
                                            <span className="font-medium mr-1 text-foreground/80">บันทึก:</span> {apt.notes}
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex md:flex-col gap-2 items-end justify-start">
                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(apt)} className="hover:text-primary hover:bg-primary/10 w-8 h-8">
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => setDeletingId(apt.id)} className="hover:text-destructive hover:bg-destructive/10 text-destructive/70 w-8 h-8">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Appointment Form Dialog */}
                {isFormOpen && (
                    <AppointmentForm
                        elderlyId={elderlyId}
                        isOpen={isFormOpen}
                        onClose={() => setIsFormOpen(false)}
                        onSuccess={() => {
                            fetchAppointments();
                        }}
                        initialData={editingAppointment}
                    />
                )}

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>ยืนยันการลบรายการ?</AlertDialogTitle>
                            <AlertDialogDescription>
                                คุณต้องการลบรายการนัดหมายนี้ใช่หรือไม่ การทำงานนี้ไม่สามารถเรียกคืนข้อมูลได้
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={handleDelete}>
                                ลบรายการ
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </CardContent>
        </Card>
    );
}
