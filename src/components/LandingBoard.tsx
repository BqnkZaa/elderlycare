import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LandingBoard() {
    return (
        <div className="min-h-screen bg-background flex flex-col text-foreground">
            {/* Navbar / Header */}
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 flex justify-between items-center h-16">
                    <div className="flex items-center space-x-2">
                        {/* Using a placeholder text/icon for logo if actual svg is not used directly */}
                        <h1 className="text-2xl font-bold text-primary tracking-tighter hover:text-primary/80 transition-colors cursor-pointer">The Safe Zone</h1>
                    </div>
                    <Link href="/login">
                        <Button variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20">เข้าสู่ระบบ (Login)</Button>
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-grow container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center relative overflow-hidden">
                {/* Background Glow Effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -z-10 pointer-events-none" />

                <div className="max-w-4xl space-y-8 z-10">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground drop-shadow-sm">
                        ระบบบริหารจัดการ<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">การดูแลผู้สูงอายุ</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Elderly Care Management Platform: ยกระดับคุณภาพชีวิตและการดูแลผู้สูงอายุด้วยเทคโนโลยีที่ทันสมัย ปลอดภัย และวางใจได้
                    </p>
                    <div className="flex justify-center gap-6 pt-8">
                        <Link href="/login">
                            <Button size="lg" className="px-10 text-lg h-14 rounded-full bg-primary hover:bg-primary/90 shadow-xl shadow-primary/30 transition-all hover:scale-105">เริ่มต้นใช้งาน</Button>
                        </Link>
                    </div>
                </div>

                {/* Features / Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full max-w-6xl">
                    <Card className="bg-card/50 border-border/50 backdrop-blur-sm hover:bg-card/80 transition-all hover:-translate-y-1 duration-300">
                        <CardHeader>
                            <CardTitle className="text-2xl text-primary">การดูแลเฉพาะบุคคล</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="text-lg text-muted-foreground/90">
                                แผนการดูแลที่ออกแบบมาเพื่อผู้สูงอายุแต่ละท่านโดยเฉพาะ ครอบคลุมทั้งสุขภาพกายและใจ
                            </CardDescription>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/50 border-border/50 backdrop-blur-sm hover:bg-card/80 transition-all hover:-translate-y-1 duration-300">
                        <CardHeader>
                            <CardTitle className="text-2xl text-secondary">ติดตามสุขภาพเรียลไทม์</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="text-lg text-muted-foreground/90">
                                บันทึกและติดตามข้อมูลสุขภาพอย่างต่อเนื่อง เพื่อการรักษาและดูแลที่รวดเร็วและแม่นยำ
                            </CardDescription>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/50 border-border/50 backdrop-blur-sm hover:bg-card/80 transition-all hover:-translate-y-1 duration-300">
                        <CardHeader>
                            <CardTitle className="text-2xl text-primary">ปลอดภัย 24 ชม.</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="text-lg text-muted-foreground/90">
                                ทีมงานมืออาชีพและระบบแจ้งเตือนฉุกเฉิน มั่นใจได้ในความปลอดภัยตลอด 24 ชั่วโมง
                            </CardDescription>
                        </CardContent>
                    </Card>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-border/40 bg-background/95 backdrop-blur py-8 mt-12">
                <div className="container mx-auto px-4 text-center text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} The Safe Zone Elderly Care. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
