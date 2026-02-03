"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface ReviewInput {
    name: string;
    rating: number;
    comment: string;
}

export async function createReview(data: ReviewInput) {
    try {
        // Validate input
        if (!data.name || data.name.trim().length === 0) {
            return { success: false, error: "กรุณากรอกชื่อ" };
        }
        if (!data.rating || data.rating < 1 || data.rating > 5) {
            return { success: false, error: "กรุณาให้คะแนนดาว 1-5" };
        }
        if (!data.comment || data.comment.trim().length === 0) {
            return { success: false, error: "กรุณากรอกความคิดเห็น" };
        }

        const review = await prisma.review.create({
            data: {
                name: data.name.trim(),
                rating: data.rating,
                comment: data.comment.trim(),
                isVisible: true,
            },
        });

        revalidatePath("/");
        return { success: true, review };
    } catch (error) {
        console.error("Error creating review:", error);
        return { success: false, error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" };
    }
}

export async function getVisibleReviews() {
    try {
        const reviews = await prisma.review.findMany({
            where: { isVisible: true },
            orderBy: { createdAt: "desc" },
            take: 20,
        });
        return { success: true, reviews };
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return { success: false, reviews: [], error: "ไม่สามารถโหลดรีวิวได้" };
    }
}
