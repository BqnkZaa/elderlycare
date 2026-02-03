"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/ui/StarRating";
import { createReview, getVisibleReviews } from "@/actions/reviews";

// Course data
const courses = [
    {
        id: 1,
        title: "หลักสูตรการดูแลผู้สูงอายุเบื้องต้น",
        description: "เรียนรู้พื้นฐานการดูแลผู้สูงอายุ การวัดสัญญาณชีพ และการช่วยเหลือในกิจวัตรประจำวัน",
        duration: "40 ชั่วโมง",
        level: "เริ่มต้น",
    },
    {
        id: 2,
        title: "หลักสูตรการพยาบาลผู้ป่วยติดเตียง",
        description: "การดูแลผู้ป่วยที่ไม่สามารถเคลื่อนไหวได้ การป้องกันแผลกดทับ และเทคนิคการเคลื่อนย้าย",
        duration: "60 ชั่วโมง",
        level: "กลาง",
    },
    {
        id: 3,
        title: "หลักสูตรโภชนาการสำหรับผู้สูงอายุ",
        description: "การวางแผนอาหาร โภชนาการเฉพาะโรค และการเตรียมอาหารที่เหมาะสมกับผู้สูงอายุ",
        duration: "30 ชั่วโมง",
        level: "ทุกระดับ",
    },
    {
        id: 4,
        title: "หลักสูตรกายภาพบำบัดเบื้องต้น",
        description: "เทคนิคการออกกำลังกายสำหรับผู้สูงอายุ การฟื้นฟูสมรรถภาพ และการป้องกันการหกล้ม",
        duration: "50 ชั่วโมง",
        level: "กลาง",
    },
];

// YouTube video placeholders
const videos = [
    {
        id: 1,
        title: "แนะนำ The Safe Zone",
        embedId: "dQw4w9WgXcQ", // placeholder
    },
    {
        id: 2,
        title: "ทัวร์สถานที่ดูแลผู้สูงอายุ",
        embedId: "dQw4w9WgXcQ", // placeholder
    },
];

interface Review {
    id: string;
    name: string;
    rating: number;
    comment: string;
    createdAt: string | Date;
}

export default function LandingBoard() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewForm, setReviewForm] = useState({ name: "", rating: 0, comment: "" });
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        loadReviews();
    }, []);

    const loadReviews = async () => {
        const result = await getVisibleReviews();
        if (result.success && result.reviews) {
            setReviews(result.reviews);
        }
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        startTransition(async () => {
            const result = await createReview(reviewForm);
            if (result.success) {
                setMessage({ type: "success", text: "ขอบคุณสำหรับรีวิว!" });
                setReviewForm({ name: "", rating: 0, comment: "" });
                loadReviews();
            } else {
                setMessage({ type: "error", text: result.error || "เกิดข้อผิดพลาด" });
            }
        });
    };

    const formatDate = (date: string | Date) => {
        return new Date(date).toLocaleDateString("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="min-h-screen bg-background flex flex-col text-foreground">
            {/* Navbar */}
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 flex justify-between items-center h-16">
                    <h1 className="text-2xl font-bold text-primary tracking-tighter hover:text-primary/80 transition-colors cursor-pointer">
                        The Safe Zone
                    </h1>
                    <Link href="/login">
                        <Button variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20">
                            เข้าสู่ระบบ (Login)
                        </Button>
                    </Link>
                </div>
            </header>

            <main className="flex-grow">
                {/* Hero Section - Advertisement Image */}
                <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
                    <Image
                        src="/images/ad-banner.png"
                        alt="The Safe Zone - Premium Elderly Care"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                    <div className="absolute bottom-8 left-0 right-0 text-center px-4">
                        <h2 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg mb-4">
                            The Safe Zone
                        </h2>
                        <p className="text-lg md:text-xl text-white/90 drop-shadow-md max-w-2xl mx-auto">
                            ศูนย์ดูแลผู้สูงอายุระดับพรีเมียม ด้วยความอบอุ่น ปลอดภัย และใส่ใจ
                        </p>
                    </div>
                </section>

                {/* Details & Brochure Section */}
                <section className="container mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                                เกี่ยวกับ <span className="text-primary">The Safe Zone</span>
                            </h2>
                            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                                <p>
                                    ศูนย์ดูแลผู้สูงอายุ The Safe Zone มุ่งมั่นให้บริการดูแลผู้สูงอายุอย่างครบวงจร
                                    ด้วยทีมงานมืออาชีพที่มีประสบการณ์ และสิ่งอำนวยความสะดวกที่ทันสมัย
                                </p>
                                <p>
                                    เราเข้าใจความต้องการเฉพาะบุคคลของผู้สูงอายุแต่ละท่าน
                                    และออกแบบแผนการดูแลที่เหมาะสมเพื่อยกระดับคุณภาพชีวิต
                                </p>
                            </div>
                            <ul className="grid grid-cols-2 gap-4 text-foreground">
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-primary rounded-full" />
                                    ดูแล 24 ชั่วโมง
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-secondary rounded-full" />
                                    พยาบาลวิชาชีพ
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-primary rounded-full" />
                                    กายภาพบำบัด
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-secondary rounded-full" />
                                    อาหารตามโภชนาการ
                                </li>
                            </ul>
                        </div>

                        {/* Brochure Card */}
                        <Card className="bg-card/50 border-border/50 backdrop-blur-sm overflow-hidden group hover:bg-card/80 transition-all">
                            <div className="relative h-[300px] overflow-hidden">
                                <Image
                                    src="/images/brochure.png"
                                    alt="โบรชัวร์ The Safe Zone"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <CardContent className="p-6">
                                <h3 className="text-xl font-semibold text-foreground mb-2">
                                    ดาวน์โหลดโบรชัวร์
                                </h3>
                                <p className="text-muted-foreground mb-4">
                                    รายละเอียดบริการ แพ็คเกจ และราคา
                                </p>
                                <Button className="w-full bg-primary hover:bg-primary/90">
                                    ดูโบรชัวร์ PDF
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Videos & Courses Section */}
                <section className="bg-muted/30 py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
                            วีดิโอแนะนำ & <span className="text-secondary">หลักสูตรของเรา</span>
                        </h2>

                        {/* Videos */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                            {videos.map((video) => (
                                <Card key={video.id} className="bg-card/50 border-border/50 backdrop-blur-sm overflow-hidden">
                                    <div className="aspect-video relative bg-muted">
                                        <iframe
                                            className="absolute inset-0 w-full h-full"
                                            src={`https://www.youtube.com/embed/${video.embedId}`}
                                            title={video.title}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                    <CardContent className="p-4">
                                        <h3 className="text-lg font-semibold text-foreground">{video.title}</h3>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Courses */}
                        <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
                            หลักสูตร 4 วิชา
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {courses.map((course) => (
                                <Card
                                    key={course.id}
                                    className="bg-card/50 border-border/50 backdrop-blur-sm hover:bg-card/80 transition-all hover:-translate-y-1 duration-300"
                                >
                                    <CardHeader>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full">
                                                {course.level}
                                            </span>
                                            <span className="text-xs text-muted-foreground">{course.duration}</span>
                                        </div>
                                        <CardTitle className="text-lg text-foreground leading-tight">
                                            {course.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-muted-foreground/90">
                                            {course.description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Review Section */}
                <section className="container mx-auto px-4 py-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
                        รีวิวจาก <span className="text-primary">ผู้ใช้บริการ</span>
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Review Form */}
                        <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-xl text-foreground">เขียนรีวิว</CardTitle>
                                <CardDescription>แบ่งปันประสบการณ์ของคุณกับเรา</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmitReview} className="space-y-4">
                                    <div>
                                        <label htmlFor="review-name" className="block text-sm font-medium text-foreground mb-1">
                                            ชื่อของคุณ
                                        </label>
                                        <Input
                                            id="review-name"
                                            value={reviewForm.name}
                                            onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                                            placeholder="กรอกชื่อของคุณ"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            คะแนน
                                        </label>
                                        <StarRating
                                            value={reviewForm.rating}
                                            onChange={(rating) => setReviewForm({ ...reviewForm, rating })}
                                            size="lg"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="review-comment" className="block text-sm font-medium text-foreground mb-1">
                                            ความคิดเห็น
                                        </label>
                                        <Textarea
                                            id="review-comment"
                                            value={reviewForm.comment}
                                            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                            placeholder="เขียนความคิดเห็นของคุณ..."
                                            rows={4}
                                            required
                                        />
                                    </div>
                                    {message && (
                                        <div
                                            className={`p-3 rounded-lg text-sm ${message.type === "success"
                                                    ? "bg-green-500/20 text-green-400"
                                                    : "bg-red-500/20 text-red-400"
                                                }`}
                                        >
                                            {message.text}
                                        </div>
                                    )}
                                    <Button
                                        type="submit"
                                        className="w-full bg-primary hover:bg-primary/90"
                                        disabled={isPending || reviewForm.rating === 0}
                                    >
                                        {isPending ? "กำลังส่ง..." : "ส่งรีวิว"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Reviews List */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-foreground mb-4">
                                รีวิวล่าสุด ({reviews.length})
                            </h3>
                            {reviews.length === 0 ? (
                                <Card className="bg-card/50 border-border/50 backdrop-blur-sm p-6 text-center">
                                    <p className="text-muted-foreground">ยังไม่มีรีวิว เป็นคนแรกที่รีวิว!</p>
                                </Card>
                            ) : (
                                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                                    {reviews.map((review) => (
                                        <Card
                                            key={review.id}
                                            className="bg-card/50 border-border/50 backdrop-blur-sm hover:bg-card/80 transition-all"
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h4 className="font-semibold text-foreground">{review.name}</h4>
                                                        <p className="text-xs text-muted-foreground">
                                                            {formatDate(review.createdAt)}
                                                        </p>
                                                    </div>
                                                    <StarRating value={review.rating} readonly size="sm" />
                                                </div>
                                                <p className="text-muted-foreground text-sm leading-relaxed">
                                                    {review.comment}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-border/40 bg-background/95 backdrop-blur py-8">
                <div className="container mx-auto px-4 text-center text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} The Safe Zone Elderly Care. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
