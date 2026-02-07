"use client";


import Link from "next/link";
import Image from "next/image";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect as Select } from '@/components/ui/select';
import { createInquiry, InquiryInput } from "@/actions/inquiry";

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

export default function LandingBoard() {
    const [inquiryForm, setInquiryForm] = useState<InquiryInput>({
        name: "",
        phone: "",
        lineId: "",
        elderlyName: "",
        elderlyAge: undefined,
        elderlyGender: "",
        elderlyNeeds: "",
        message: "",
    });
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleSubmitInquiry = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        startTransition(async () => {
            const result = await createInquiry(inquiryForm);
            if (result.success) {
                setMessage({ type: "success", text: "ส่งข้อมูลเรียบร้อยแล้ว เจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุด" });
                setInquiryForm({
                    name: "",
                    phone: "",
                    lineId: "",
                    elderlyName: "",
                    elderlyAge: undefined,
                    elderlyGender: "",
                    elderlyNeeds: "",
                    message: "",
                });
            } else {
                setMessage({ type: "error", text: result.error || "เกิดข้อผิดพลาด" });
            }
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
                <section className="container mx-auto px-4 py-32">
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
                <section className="bg-muted/30 py-24">
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

                {/* Application / Inquiry Section */}
                <section className="container mx-auto px-4 py-24">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
                        สนใจใช้บริการ <span className="text-primary">สอบถามข้อมูล</span>
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Inquiry Form */}
                        <Card className="bg-card/50 border-border/50 backdrop-blur-sm lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="text-2xl text-foreground text-center">แบบฟอร์มยื่นความจำนง / สอบถามข้อมูล</CardTitle>
                                <CardDescription className="text-center">กรอกรายละเอียดเพื่อให้เจ้าหน้าที่ติดต่อกลับ</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmitInquiry} className="space-y-6 max-w-4xl mx-auto">
                                    {/* Section 1: Contact Info */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-primary border-b border-border/50 pb-2">1. ข้อมูลผู้ติดต่อ</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1">
                                                    ชื่อ-นามสกุล (ผู้ติดต่อ) <span className="text-red-500">*</span>
                                                </label>
                                                <Input
                                                    value={inquiryForm.name}
                                                    onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                                                    placeholder="กรอกชื่อ-นามสกุลของคุณ"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1">
                                                    เบอร์โทรศัพท์ <span className="text-red-500">*</span>
                                                </label>
                                                <Input
                                                    value={inquiryForm.phone}
                                                    onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                                                    placeholder="0xx-xxx-xxxx"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1">
                                                    Line ID
                                                </label>
                                                <Input
                                                    value={inquiryForm.lineId}
                                                    onChange={(e) => setInquiryForm({ ...inquiryForm, lineId: e.target.value })}
                                                    placeholder="กรอก Line ID (ถ้ามี)"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 2: Elderly Info */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-primary border-b border-border/50 pb-2">2. ข้อมูลผู้สูงอายุ</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-foreground mb-1">
                                                    ชื่อ-นามสกุล (ผู้สูงอายุ)
                                                </label>
                                                <Input
                                                    value={inquiryForm.elderlyName}
                                                    onChange={(e) => setInquiryForm({ ...inquiryForm, elderlyName: e.target.value })}
                                                    placeholder="กรอกชื่อ-นามสกุลผู้สูงอายุ"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1">
                                                    อายุ (ปี)
                                                </label>
                                                <Input
                                                    type="number"
                                                    value={inquiryForm.elderlyAge || ""}
                                                    onChange={(e) => setInquiryForm({ ...inquiryForm, elderlyAge: parseInt(e.target.value) || undefined })}
                                                    placeholder="ระบุอายุ"
                                                    min={50}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1">
                                                    เพศ
                                                </label>
                                                <Select
                                                    value={inquiryForm.elderlyGender}
                                                    onChange={(e) => setInquiryForm({ ...inquiryForm, elderlyGender: e.target.value })}
                                                >
                                                    <option value="">-- ระบุเพศ --</option>
                                                    <option value="ชาย">ชาย</option>
                                                    <option value="หญิง">หญิง</option>
                                                </Select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-1">
                                                อาการเบื้องต้น / สิ่งที่ต้องการดูแลเป็นพิเศษ
                                            </label>
                                            <Textarea
                                                value={inquiryForm.elderlyNeeds}
                                                onChange={(e) => setInquiryForm({ ...inquiryForm, elderlyNeeds: e.target.value })}
                                                placeholder="เช่น ช่วยเหลือตัวเองไม่ได้, มีแผลกดทับ, ต้องการกายภาพบำบัด..."
                                                rows={3}
                                            />
                                        </div>
                                    </div>

                                    {/* Section 3: Message */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-primary border-b border-border/50 pb-2">3. ข้อความเพิ่มเติม</h3>
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-1">
                                                ข้อความถึงเจ้าหน้าที่
                                            </label>
                                            <Textarea
                                                value={inquiryForm.message}
                                                onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                                                placeholder="สอบถามข้อมูลเพิ่มเติม..."
                                                rows={3}
                                            />
                                        </div>
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
                                        className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
                                        disabled={isPending}
                                    >
                                        {isPending ? "กำลังส่งข้อมูล..." : "ส่งข้อมูลสมัคร / สอบถาม"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
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
