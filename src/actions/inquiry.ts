"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface InquiryInput {
    // Contact Info
    name: string;
    phone: string;
    lineId?: string;

    // Elderly Info
    elderlyName?: string;
    elderlyAge?: number;
    elderlyGender?: string;
    elderlyNeeds?: string;

    // New Fields
    feedingMethod?: string;
    walkingAbility?: string;
    bathingAbility?: string;
    bedVacancyDate?: Date;

    // Message
    message?: string;

}

export async function createInquiry(data: InquiryInput) {
    try {
        // Validate required fields
        if (!data.name || data.name.trim().length === 0) {
            return { success: false, error: "กรุณากรอกชื่อผู้ติดต่อ" };
        }
        if (!data.phone || data.phone.trim().length === 0) {
            return { success: false, error: "กรุณากรอกเบอร์โทรศัพท์" };
        }

        // Create inquiry
        const inquiry = await prisma.inquiry.create({
            data: {
                name: data.name.trim(),
                phone: data.phone.trim(),
                lineId: data.lineId ? data.lineId.trim() : null,
                elderlyName: data.elderlyName ? data.elderlyName.trim() : null,
                elderlyAge: data.elderlyAge,
                elderlyGender: data.elderlyGender,
                elderlyNeeds: data.elderlyNeeds ? data.elderlyNeeds.trim() : null,
                feedingMethod: data.feedingMethod ? data.feedingMethod.trim() : null,
                walkingAbility: data.walkingAbility ? data.walkingAbility.trim() : null,
                bathingAbility: data.bathingAbility ? data.bathingAbility.trim() : null,
                bedVacancyDate: data.bedVacancyDate,
                message: data.message ? data.message.trim() : null,
                status: "PENDING",
            },
        });

        // Revalidate landing page (though not strictly necessary as this doesn't show up there immediately)
        revalidatePath("/");

        return { success: true, inquiry };
    } catch (error) {
        console.error("Error creating inquiry:", error);
        return { success: false, error: "เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง" };
    }
}
