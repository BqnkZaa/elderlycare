import { z } from "zod";

export const appointmentSchema = z.object({
    title: z.string().min(1, "กรุณาระบุหัวข้อนัดหมาย"),
    date: z.date({ message: "รูปแบบวันที่ไม่ถูกต้อง" }),
    time: z.string().optional(),
    location: z.string().optional(),
    doctorName: z.string().optional(),
    notes: z.string().optional(),
    remindDaysBefore: z.number().min(0).max(30).optional().default(1),
    isCompleted: z.boolean().optional().default(false),

    // New Fields
    attachmentUrl: z.string().optional().nullable(),
    notifyCoordinator: z.boolean().optional().default(true),
    notifyGuardian: z.boolean().optional().default(true),
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;
