'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { appointmentSchema, type AppointmentInput } from '@/lib/validations/appointment';
import { requireRole } from '@/lib/auth-utils';


export async function createAppointment(elderlyId: string, data: AppointmentInput) {
    try {
        await requireRole(['ADMIN', 'STAFF', 'NURSE']);
        const validatedData = appointmentSchema.parse(data);

        const appointment = await prisma.appointment.create({
            data: {
                elderlyId,
                ...validatedData,
            },
        });

        revalidatePath(`/dashboard/elderly/${elderlyId}`);
        return { success: true, data: appointment };
    } catch (error) {
        console.error('Failed to create appointment:', error);
        return { success: false, error: 'Failed to create appointment' };
    }
}

export async function getAppointments(elderlyId: string) {
    try {
        await requireRole(['ADMIN', 'STAFF', 'NURSE']);
        const appointments = await prisma.appointment.findMany({
            where: { elderlyId },
            orderBy: { date: 'asc' },
        });
        return { success: true, data: appointments };
    } catch (error) {
        console.error('Failed to fetch appointments:', error);
        return { success: false, error: 'Failed to fetch appointments' };
    }
}

export async function updateAppointment(id: string, data: Partial<AppointmentInput>) {
    try {
        await requireRole(['ADMIN', 'STAFF', 'NURSE']);
        // Validate partial data if needed, or just update directly
        // Ideally we should validate the update payload against a partial schema

        // For now we trust the input from our form which uses the schema
        const appointment = await prisma.appointment.update({
            where: { id },
            data: data,
        });

        // We need to fetch the elderlyId to revalidate the correct path
        // But since optimization is key, let's just return success and let client handle refresh or just fetch elderlyId first
        // Actually, prisma update returns the object including elderlyId

        revalidatePath(`/dashboard/elderly/${appointment.elderlyId}`);
        return { success: true, data: appointment };
    } catch (error) {
        console.error('Failed to update appointment:', error);
        return { success: false, error: 'Failed to update appointment' };
    }
}

export async function deleteAppointment(id: string, elderlyId: string) {
    try {
        await requireRole(['ADMIN', 'STAFF', 'NURSE']);
        await prisma.appointment.delete({
            where: { id },
        });

        revalidatePath(`/dashboard/elderly/${elderlyId}`);
        return { success: true };
    } catch (error) {
        console.error('Failed to delete appointment:', error);
        return { success: false, error: 'Failed to delete appointment' };
    }
}

// New action for Autocomplete
export async function getDistinctAppointmentOptions() {
    try {
        await requireRole(['ADMIN', 'STAFF', 'NURSE']);

        // Parallel fetch for distinct locations and doctor names
        const [locations, doctors] = await Promise.all([
            prisma.appointment.findMany({
                distinct: ['location'],
                select: { location: true },
                where: { location: { not: null } },
            }),
            prisma.appointment.findMany({
                distinct: ['doctorName'],
                select: { doctorName: true },
                where: { doctorName: { not: null } },
            })
        ]);

        return {
            success: true,
            data: {
                locations: locations.map(l => l.location).filter(Boolean) as string[],
                doctors: doctors.map(d => d.doctorName).filter(Boolean) as string[],
            }
        };
    } catch (error) {
        console.error('Failed to fetch options:', error);
        return { success: false, error: 'Failed to fetch options' };
    }
}
