"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect as Select } from '@/components/ui/select';
import { Checkbox } from "@/components/ui/checkbox";
import { createInquiry } from "@/actions/inquiry";
import { publicAdmissionSchema, type PublicAdmissionInput } from "@/lib/validations";
// import { PROVINCE_NAMES_TH } from "@/lib/provinces"; // Optional if needed

import { UserPlus, LogIn, Menu } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Course data & Videos (Keep unchanged)
const courses = [
    {
        id: 1,
        title: "การเตรียมตัวผู้สูงอายุก่อนเข้าอยู่ศูนย์ดูแล",
        description: "เรียนรู้พื้นฐานการดูแลผู้สูงอายุ การวัดสัญญาณชีพ และการช่วยเหลือในกิจวัตรประจำวัน",
        level: "เริ่มต้น",
    },
    {
        id: 2,
        title: "ตัวอย่างแฟ้มประวัติที่ผู้ดูแลต้องทราบ",
        description: "การดูแลผู้ป่วยที่ไม่สามารถเคลื่อนไหวได้ การป้องกันแผลกดทับ และเทคนิคการเคลื่อนย้าย",
        level: "กลาง",
    },
    {
        id: 3,
        title: "รายละเอียดของการบริหารจัดการส่วนกลาง",
        description: "การวางแผนอาหาร โภชนาการเฉพาะโรค และการเตรียมอาหารที่เหมาะสมกับผู้สูงอายุ",
        level: "ทุกระดับ",
    },
    {
        id: 4,
        title: "หุ่นยนต์เอไอบริหารจัดการ",
        description: "เทคนิคการออกกำลังกายสำหรับผู้สูงอายุ การฟื้นฟูสมรรถภาพ และการป้องกันการหกล้ม",
        level: "กลาง",
    },
];

const videos = [
    {
        id: 1,
        title: "แนะนำ The Safe Zone",
        embedId: "UMesEytPSaE",
    },
    {
        id: 2,
        title: "ทัวร์สถานที่ดูแลผู้สูงอายุ",
        embedId: "dQw4w9WgXcQ",
    },
];

export default function LandingBoard() {
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<PublicAdmissionInput>({
        resolver: zodResolver(publicAdmissionSchema) as any,
        defaultValues: {
            name: '', // Mandatory contact name
            phone: '', // Mandatory contact phone
            gender: 'MALE',
            bloodType: 'UNKNOWN',
            mobilityStatus: 'INDEPENDENT',
            careLevel: 'LEVEL_1',
            age: 0,
            maritalStatus: 'SINGLE',
            hearingStatus: 'NORMAL',
            visionStatus: 'NORMAL',
            speechStatus: 'CLEAR',
            gaitStatus: 'INDEPENDENT',
            bladderControl: 'CONTINENT',
            bowelControl: 'NORMAL',
            diaperType: 'NONE',
            healthPrivilege: 'SELF_PAY',
            goalOfCare: 'LONG_TERM_CARE',
            // admissionDate: new Date(), // Not used in public form directly usually
        },
    });

    const onSubmit = (data: PublicAdmissionInput) => {
        setMessage(null);
        startTransition(async () => {
            const result = await createInquiry(data);
            if (result.success) {
                setMessage({ type: "success", text: "บันทึกข้อมูลสำเร็จ! เจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุด" });
                reset();
                // Optional: Scroll to message
                const formElement = document.getElementById("registration-form");
                if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
            } else {
                setMessage({ type: "error", text: result.error || "เกิดข้อผิดพลาดในการบันทึกข้อมูล" });
            }
        });
    };



    return (
        <div className="min-h-screen bg-background flex flex-col text-foreground font-sans">
            {/* Navbar */}
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm transition-all duration-300">
                <div className="container mx-auto px-4 lg:px-8 flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/" className="group">
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-widest transition-all duration-300 transform group-hover:scale-105">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-blue-600">
                                THE SAFE ZONE
                            </span>
                        </h1>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link href="#registration-form">
                            <Button
                                variant="default"
                                size="lg"
                                className="rounded-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300 border-0 px-6"
                            >
                                <UserPlus className="w-5 h-5 mr-2" />
                                ลงทะเบียนผู้สูงอายุใหม่
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button
                                variant="outline"
                                size="lg"
                                className="rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white shadow-lg shadow-primary/10 hover:shadow-primary/30 transition-all duration-300 px-6"
                            >
                                <LogIn className="w-5 h-5 mr-2" />
                                เข้าสู่ระบบ
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu */}
                    <div className="md:hidden">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                                    <Menu className="w-6 h-6 text-foreground" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl backdrop-blur-xl bg-background/95 border-primary/20">
                                <DropdownMenuItem asChild>
                                    <Link href="#registration-form" className="flex items-center gap-2 cursor-pointer p-3 text-red-600 font-medium hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg">
                                        <UserPlus className="w-4 h-4" />
                                        ลงทะเบียนผู้สูงอายุ
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/login" className="flex items-center gap-2 cursor-pointer p-3 text-primary font-medium hover:bg-primary/10 rounded-lg mt-1">
                                        <LogIn className="w-4 h-4" />
                                        เข้าสู่ระบบพันธมิตร
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            <main className="flex-grow">
                {/* Hero Section - Advertisement Image */}
                <section className="relative w-full h-[650px] md:h-[650px] overflow-hidden">
                    <Image
                        src="/images/background1.jpg"
                        alt="The Safe Zone - Premium Elderly Care"
                        width={1920}
                        height={600}
                        className="w-full h-full object-cover object-top -mt-24"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                    <div className="absolute bottom-8 left-0 right-0 text-center px-4">
                        <h2 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg mb-4">
                            รับดูแลผู้สูงอายุ 12,500 บาท / เดือน
                        </h2>
                        <p className="text-lg md:text-l text-white/90 drop-shadow-md max-w-2xl mx-auto">
                            โครงการพื้นที่ปลอดภัยเดอะเซฟโซน / พันธมิตรในเครือ 300 ศูนย์ทั่วกรุงเทพและปริมณฑล
                        </p>
                    </div>
                </section>

                {/* Network Partners Section */}
                <section className="container mx-auto px-4 py-16 md:py-24">
                    <div className="max-w-5xl mx-auto space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                            เครือข่ายศูนย์พันธมิตรในเครือฯ <span className="text-primary">300</span> กิจการทั่วกรุงเทพและปริมณฑล
                        </h2>
                        <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                            <p>
                                การบริการด้วยความเท่าเทียมคือพื้นฐานในหัวใจของผู้ดูแล คุณค่าของความทรงจำสิ่งคือสิ่งที่เราให้ความสำคัญกับผู้สูงวัย ทุกท่าน การใช้ชีวิตที่ผ่านวันเวลามาร่วม 70-80 ปี ทุกท่านได้เก็บเกี่ยวเรื่องราวเฉพาะตนเองมามากมาย วันนี้เหมือนเรามากลับเข้าสู่โรงเรียนอนุบาลวัยเกษียณอีกครั้ง......</p>
                            <p className="text-primary">“บันทึกไว้ในใจ” (ข้อมูลสำคัญที่ท่านต้องจัดเตรียม)</p>
                        </div>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-foreground text-lg">
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-primary rounded-full" />
                                ชื่อน่ารัก ชื่อตะมุตะมิ ที่เอาไว้เรียกท่าน
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-secondary rounded-full" />
                                โรคประจำตัว/ภาวะ/อาการ ในปัจจุบัน (ดูจากยาคุณหมอในปัจจุบัน)
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-primary rounded-full" />
                                ยาที่ท่านแพ้ หรือ การหยุดยา
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-secondary rounded-full" />
                                ในอดีตมีไม่ได้ไปพบคุณหมอตามนัดบ้างไหม
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-primary rounded-full" />
                                อาการสับสนหรือมึนงง
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-secondary rounded-full" />
                                กำลังในการช่วยเหลือตัวเองในตอนนี้
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-primary rounded-full" />
                                มีสิ่งใดบ้างที่ท่านโปรดมากที่สุด
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-secondary rounded-full" />
                                สิ่งใดบางที่ท่านไม่โปรดปรานเลยแม้แต่น้อย
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Brochure Section */}
                <section className="container mx-auto px-4 py-24">
                    <div className="max-w-6xl mx-auto">
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/5 via-card to-background border border-border/50 shadow-2xl p-8 md:p-12">
                            {/* Decorative background elements */}
                            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                                {/* Image Container */}
                                <div className="relative group perspective-1000">
                                    <div className="relative h-[400px] md:h-[500px] w-full transform transition-transform duration-500 group-hover:scale-[1.02] group-hover:rotate-1">
                                        <div className="absolute inset-0 bg-black/20 translate-x-4 translate-y-4 rounded-xl blur-sm" />
                                        <Image
                                            src="/images/brochure1.jpg"
                                            alt="โบรชัวร์ The Safe Zone"
                                            fill
                                            className="object-cover rounded-xl shadow-xl border border-white/10"
                                        />
                                    </div>
                                </div>

                                {/* Content Container */}
                                <div className="space-y-8 text-center md:text-left">
                                    <div className="space-y-4">
                                        <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm">
                                            แจกฟรี! ไม่มีค่าใช้จ่าย
                                        </div>
                                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                                            E-Book 10 แนวทางการเลือกศูนย์ดูแลที่คุณรัก
                                        </h3>
                                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                                            คู่มือเช็คลิสต์ที่คุณต้องมีก่อนตัดสินใจเลือกศูนย์ดูแล รวบรวมมาตรฐานที่สำคัญและข้อควรระวัง เพื่อความอุ่นใจและคุณภาพชีวิตที่ดีที่สุดของคนที่คุณรัก
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                        <a href="/brochure.pdf" download="brochure.pdf" className="w-full sm:w-auto">
                                            <Button size="lg" className="w-full sm:w-auto px-8 py-6 text-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all rounded-xl">
                                                <span className="mr-2">📥</span> ดาวน์โหลด E-Book ฟรี
                                            </Button>
                                        </a>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 pt-6 border-t border-border/50">
                                        <div>
                                            <p className="text-3xl font-bold text-primary">10+</p>
                                            <p className="text-sm text-muted-foreground">เช็คลิสต์มาตรฐาน</p>
                                        </div>
                                        <div>
                                            <p className="text-3xl font-bold text-secondary">100%</p>
                                            <p className="text-sm text-muted-foreground">อ่านเข้าใจง่าย</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Videos & Courses Section */}
                <section className="bg-muted/30 py-24">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
                            การเรียน & <span className="text-secondary">การสอน</span> (ไม่มีค่าใช้จ่าย)
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
                            คู่มือรายวิชา & แผนการเรียนการสอน (Course)
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
                                            {/* <span className="text-xs text-muted-foreground">{course.duration}</span> */}
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
                <section id="registration-form" className="container mx-auto px-4 py-24">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
                        สนใจพาผู้สูงอายุเข้า <span className="text-primary">โครงการ</span>
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Inquiry Form */}
                        <Card className="bg-card/50 border-border/50 backdrop-blur-sm lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="text-2xl text-foreground text-center">แบบฟอร์มยื่นความจำนง / สอบถามข้อมูล</CardTitle>
                                <CardDescription className="text-center">กรอกรายละเอียดเพื่อให้เจ้าหน้าที่ติดต่อกลับ</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto">
                                    {/* Section 1: Contact Info & Identification */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-primary border-b border-border/50 pb-2">1. ข้อมูลผู้ติดต่อ & ประวัติส่วนตัว</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1">
                                                    ชื่อ-นามสกุล (ผู้ติดต่อ) <span className="text-red-500">*</span>
                                                </label>
                                                <Input {...register("name")} placeholder="ชื่อผู้ติดต่อหลัก (ลูก/หลาน)" />
                                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1">
                                                    เบอร์โทรศัพท์ <span className="text-red-500">*</span>
                                                </label>
                                                <Input {...register("phone")} placeholder="0xx-xxx-xxxx" />
                                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1">Line ID</label>
                                                <Input {...register("lineId")} placeholder="Line ID (ถ้ามี)" />
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-border/20"></div>
                                        <h4 className="font-medium text-foreground">ข้อมูลผู้สูงอายุ</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1">ชื่อจริง (ผู้สูงอายุ)</label>
                                                <Input {...register("firstName")} placeholder="ชื่อจริง" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1">นามสกุล</label>
                                                <Input {...register("lastName")} placeholder="นามสกุล" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1">ชื่อเล่น</label>
                                                <Input {...register("nickname")} placeholder="ชื่อเล่น" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1">อายุ (ปี)</label>
                                                <Input type="number" {...register("age")} placeholder="ระบุอายุ" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1">เพศ</label>
                                                <Select {...register("gender")}>
                                                    <option value="MALE">ชาย</option>
                                                    <option value="FEMALE">หญิง</option>
                                                    <option value="OTHER">อื่นๆ</option>
                                                </Select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1">วันเกิด</label>
                                                <Input type="date" {...register("dateOfBirth")} className="block" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 2: Marital & Status */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-primary border-b border-border/50 pb-2">2. สถานภาพ & ผู้ดูแลหลัก</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1">สถานภาพ</label>
                                                <Select {...register("maritalStatus")}>
                                                    <option value="SINGLE">โสด</option>
                                                    <option value="MARRIED">สมรส</option>
                                                    <option value="WIDOWED">หม้าย</option>
                                                    <option value="DIVORCED_SEPARATED">หย่าร้าง/แยกกันอยู่</option>
                                                </Select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1">ผู้ประสานงานหลัก (ชื่อ-สกุล)</label>
                                                <Input {...register("keyCoordinatorName")} placeholder="ชื่อผู้ประสานงานหลัก" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1">เบอร์โทรศัพท์ผู้ประสานงาน</label>
                                                <Input {...register("keyCoordinatorPhone")} placeholder="เบอร์โทรศัพท์" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1">ความสัมพันธ์</label>
                                                <Input {...register("keyCoordinatorRelation")} placeholder="เช่น บุตร, หลาน" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 3: Sensory */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-primary border-b border-border/50 pb-2">3. การรับรู้และสื่อสาร</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1">การได้ยิน (หู)</label>
                                                <Select {...register("hearingStatus")}>
                                                    <option value="NORMAL">ปกติ</option>
                                                    <option value="HARD_OF_HEARING_LEFT">หูตึงข้างซ้าย</option>
                                                    <option value="HARD_OF_HEARING_RIGHT">หูตึงข้างขวา</option>
                                                    <option value="HARD_OF_HEARING_BOTH">หูตึงทั้ง 2 ข้าง</option>
                                                    <option value="DEAF">หูหนวก</option>
                                                    <option value="HEARING_AID">ใช้เครื่องช่วยฟัง</option>
                                                </Select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1">การมองเห็น (ตา)</label>
                                                <Select {...register("visionStatus")}>
                                                    <option value="NORMAL">ปกติ</option>
                                                    <option value="NEARSIGHTED_FARSIGHTED">สั้น/ยาว</option>
                                                    <option value="CATARACT_GLAUCOMA">ต้อกระจก/ต้อหิน</option>
                                                    <option value="GLASSES">สวมแว่นตา</option>
                                                    <option value="CONTACT_LENS">คอนแทคเลนส์</option>
                                                </Select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1">การสื่อสาร (ปาก)</label>
                                                <Select {...register("speechStatus")}>
                                                    <option value="CLEAR">ปกติ (พูดชัดเจน)</option>
                                                    <option value="DYSARTHRIA">พูดไม่ชัด</option>
                                                    <option value="APHASIA">พูดไม่ได้ (แต่ฟังรู้เรื่อง)</option>
                                                    <option value="NON_VERBAL">สื่อสารไม่ได้</option>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 4: Mobility */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-primary border-b border-border/50 pb-2">4. การเคลื่อนไหว (Mobility)</h3>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Checkbox
                                                    id="historyOfFalls"
                                                    onCheckedChange={(checked) => setValue("historyOfFalls", checked as boolean)}
                                                />
                                                <label htmlFor="historyOfFalls" className="text-sm font-medium text-foreground">
                                                    เคยมีประวัติหกล้ม (History of falls)
                                                </label>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1">ลักษณะการเดิน (Gait)</label>
                                                <Select {...register("gaitStatus")}>
                                                    <option value="INDEPENDENT">เดินเองได้ (Independent)</option>
                                                    <option value="UNSTEADY">เดินเซ (Unsteady)</option>
                                                    <option value="NEEDS_SUPPORT">ต้องพยุงเดิน (Needs support)</option>
                                                    <option value="NON_AMBULATORY_BEDRIDDEN">เดินไม่ได้ / ติดเตียง</option>
                                                </Select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1">อุปกรณ์ช่วยเดิน</label>
                                                <Input {...register("assistiveDevices")} placeholder="เช่น ไม้เท้า, Walker, Wheelchair" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 5: Elimination */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-primary border-b border-border/50 pb-2">5. การขับถ่าย (Elimination)</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1">การปัสสาวะ</label>
                                                <Select {...register("bladderControl")}>
                                                    <option value="CONTINENT">กลั้นได้ปกติ</option>
                                                    <option value="OCCASIONAL_INCONTINENCE">กลั้นไม่ได้เป็นบางครั้ง</option>
                                                    <option value="TOTAL_INCONTINENCE_FOLEY">กลั้นไม่ได้เลย / ใส่สายสวน</option>
                                                </Select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1">การอุจจาระ</label>
                                                <Select {...register("bowelControl")}>
                                                    <option value="NORMAL">ปกติ</option>
                                                    <option value="CONSTIPATION">ท้องผูก</option>
                                                    <option value="DIARRHEA">ท้องเสีย</option>
                                                    <option value="INCONTINENCE">กลั้นไม่ได้</option>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 6-7: Cognitive & Complaint */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-primary border-b border-border/50 pb-2">6. อาการสำคัญ & ภาวะสมอง</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1">อาการสำคัญที่นำมา (Chief Complaint)</label>
                                                <Textarea {...register("reasonForAdmission")} placeholder="ทำไมถึงต้องการให้ศูนย์ดูแล?" />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Checkbox
                                                    id="hasConfusion"
                                                    onCheckedChange={(checked) => setValue("hasConfusion", checked as boolean)}
                                                />
                                                <label htmlFor="hasConfusion" className="text-sm font-medium text-foreground">
                                                    มีภาวะสับสน (Confusion)
                                                </label>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1">ความจำ / พฤติกรรม</label>
                                                <Input {...register("behaviorStatus")} placeholder="เช่น หลงลืม, ก้าวร้าว, ซึมเศร้า" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 8-9: Medical & Allergies */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-primary border-b border-border/50 pb-2">7. ประวัติการแพทย์ & การแพ้</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1">โรคประจำตัว</label>
                                                <Textarea {...register("underlyingDiseases")} placeholder="ระบุโรคประจำตัวทั้งหมด" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1">ยาที่ทานปัจจุบัน</label>
                                                <Textarea {...register("currentMedications")} placeholder="ระบุยา หรือแนบรูปถ่ายภายหลัง" />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <Checkbox
                                                            id="hasDrugAllergies"
                                                            onCheckedChange={(checked) => setValue("hasDrugAllergies", checked as boolean)}
                                                        />
                                                        <label htmlFor="hasDrugAllergies" className="text-sm font-medium text-foreground">
                                                            แพ้ยา
                                                        </label>
                                                    </div>
                                                    <Input {...register("drugAllergiesDetail")} placeholder="ระบุชื่อยาที่แพ้" />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <Checkbox
                                                            id="hasFoodAllergies"
                                                            onCheckedChange={(checked) => setValue("hasFoodChemicalAllergies", checked as boolean)}
                                                        />
                                                        <label htmlFor="hasFoodAllergies" className="text-sm font-medium text-foreground">
                                                            แพ้อาหาร/สารเคมี
                                                        </label>
                                                    </div>
                                                    <Input {...register("foodChemicalAllergiesDetail")} placeholder="ระบุสิ่งที่แพ้" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 10: Physical */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-primary border-b border-border/50 pb-2">8. การดูแลทางกายภาพ & แผล</h3>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Checkbox
                                                    id="hasPressureUlcer"
                                                    onCheckedChange={(checked) => setValue("hasPressureUlcer", checked as boolean)}
                                                />
                                                <label htmlFor="hasPressureUlcer" className="text-sm font-medium text-foreground">
                                                    มีแผลกดทับ (Pressure Ulcer)
                                                </label>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <Input {...register("pressureUlcerLocation")} placeholder="ตำแหน่งแผล" />
                                                <Input {...register("pressureUlcerStage")} placeholder="ระดับแผล (Stage)" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1">อุปกรณ์การแพทย์ที่ติดตัว</label>
                                                <Input {...register("medicalDevices")} placeholder="เช่น สายสวนปัสสาวะ, สายให้อาหาร" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 12-13: Religion & Goals */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-primary border-b border-border/50 pb-2">9. ความเชื่อ & สิทธิ & เป้าหมาย</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1">ศาสนา</label>
                                                <Input {...register("religion")} placeholder="ระบุศาสนา" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1">สิทธิการรักษา</label>
                                                <Select {...register("healthPrivilege")}>
                                                    <option value="SELF_PAY">ชำระเอง (Self-pay)</option>
                                                    <option value="GOLD_CARD">บัตรทอง (Gold Card)</option>
                                                    <option value="GOVERNMENT">เบิกราชการ (Gov)</option>
                                                    <option value="INSURANCE">ประกันชีวิต (Insurance)</option>
                                                    <option value="OTHER">อื่นๆ (Other)</option>
                                                </Select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1">เป้าหมายการดูแล</label>
                                                <Select {...register("goalOfCare")}>
                                                    <option value="LONG_TERM_CARE">ดูแลระยะยาว (Long-term)</option>
                                                    <option value="REHABILITATION">ฟื้นฟูสภาพ (Rehabilitation)</option>
                                                    <option value="PALLIATIVE">ประคับประคอง (Palliative)</option>
                                                </Select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-1">ความคาดหวัง / รายละเอียดเพิ่มเติม</label>
                                            <Textarea {...register("expectationDetails")} placeholder="ความต้องการพิเศษอื่นๆ" />
                                        </div>
                                    </div>

                                    {message && (
                                        <div className={`p-4 rounded-lg text-sm flex items-center gap-2 ${message.type === "success" ? "bg-green-500/20 text-green-700" : "bg-red-500/20 text-red-700"}`}>
                                            {message.type === "success" ? "✅" : "❌"} {message.text}
                                        </div>
                                    )}

                                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-lg py-6" disabled={isPending}>
                                        {isPending ? "กำลังบันทึกข้อมูล..." : "ส่งแบบฟอร์มลงทะเบียน"}
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
        </div >
    );
}
