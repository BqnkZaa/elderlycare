/**
 * Dashboard Layout
 * 
 * Main layout for admin panel with sidebar navigation.
 */

'use client';

import { ReactNode, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Heart,
    LayoutDashboard,
    Users,
    FileText,
    Bell,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronRight,
} from 'lucide-react';

interface DashboardLayoutProps {
    children: ReactNode;
}

const navigation = [
    { name: 'แดชบอร์ด', href: '/dashboard', icon: LayoutDashboard },
    { name: 'ข้อมูลผู้สูงอายุ', href: '/dashboard/elderly', icon: Users },
    { name: 'บันทึกประจำวัน', href: '/dashboard/logs', icon: FileText },
    { name: 'จัดการผู้ใช้งาน', href: '/dashboard/users', icon: Users },
    { name: 'การแจ้งเตือน', href: '/dashboard/alerts', icon: Bell },
    { name: 'ตั้งค่า', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background text-foreground relative">


            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 w-72 bg-card/80 backdrop-blur-md border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-2xl',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <Heart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-foreground">Elderly Care</h1>
                        <p className="text-xs text-muted-foreground">Management System</p>
                    </div>
                    <button
                        className="lg:hidden ml-auto p-1 text-muted-foreground hover:text-foreground"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                                    isActive
                                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                )}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* User section */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center text-white font-semibold">
                            {session?.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                                {session?.user?.name || 'ผู้ใช้งาน'}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                                {session?.user?.email}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        className="w-full justify-start hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
                        onClick={() => signOut({ callbackUrl: '/login' })}
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        ออกจากระบบ
                    </Button>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:pl-72 transition-all duration-300 relative">
                {/* Background Image */}
                <div className="fixed lg:left-72 inset-0 z-0 overflow-hidden pointer-events-none">
                    <Image
                        src="/images/backgroud2.png"
                        alt="Dashboard Background"
                        fill
                        className="object-cover opacity-100"
                        priority
                    />
                    <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px]" />
                </div>

                <div className="relative z-10">
                    {/* Top bar */}
                    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border supports-[backdrop-filter]:bg-background/60">
                        <div className="flex items-center gap-4 px-4 py-3">
                            <button
                                className="lg:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                            <div className="flex-1" />
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground bg-accent/50 px-3 py-1 rounded-full border border-border/50">
                                    {new Date().toLocaleDateString('th-TH', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </span>
                            </div>
                        </div>
                    </header>

                    {/* Page content */}
                    <main className="p-4 lg:p-6 space-y-6">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
