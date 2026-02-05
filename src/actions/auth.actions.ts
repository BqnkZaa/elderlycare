/**
 * Authentication Server Actions
 */

'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { userSchema, type UserInput } from '@/lib/validations';

export async function createUser(data: UserInput) {
    try {
        const validated = userSchema.parse(data);

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: validated.email },
        });

        if (existingUser) {
            return {
                success: false,
                error: 'อีเมลนี้มีอยู่ในระบบแล้ว'
            };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(validated.password, 12);

        // Create user
        const user = await prisma.user.create({
            data: {
                ...validated,
                password: hashedPassword,
            },
        });

        return {
            success: true,
            data: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
            message: 'สร้างบัญชีผู้ใช้สำเร็จ'
        };

    } catch (error) {
        console.error('Error creating user:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการสร้างบัญชี'
        };
    }
}

export async function seedAdminUser() {
    try {
        const existingAdmin = await prisma.user.findUnique({
            where: { email: 'admin@elderlycare.com' },
        });

        if (existingAdmin) {
            return {
                success: true,
                message: 'Admin user already exists',
                data: { email: 'admin@elderlycare.com' }
            };
        }

        const hashedPassword = await bcrypt.hash('admin123', 12);

        const admin = await prisma.user.create({
            data: {
                email: 'admin@elderlycare.com',
                password: hashedPassword,
                name: 'ผู้ดูแลระบบ',
                role: 'ADMIN',
            },
        });

        return {
            success: true,
            message: 'Admin user created',
            data: { email: admin.email }
        };

    } catch (error) {
        console.error('Error seeding admin:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error seeding admin'
        };
    }
}

export async function registerNurse(data: UserInput) {
    try {
        const validated = userSchema.parse(data);

        const existingUser = await prisma.user.findUnique({
            where: { email: validated.email },
        });

        if (existingUser) {
            return {
                success: false,
                error: 'อีเมลนี้มีอยู่ในระบบแล้ว'
            };
        }

        const hashedPassword = await bcrypt.hash(validated.password, 12);

        const user = await prisma.user.create({
            data: {
                ...validated,
                role: 'NURSE',
                status: 'PENDING', // Force pending for nurses
                password: hashedPassword,
            },
        });

        return {
            success: true,
            data: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                status: user.status,
            },
            message: 'ลงทะเบียนสำเร็จ โปรดรอการอนุมัติจากผู้ดูแลระบบ'
        };

    } catch (error) {
        console.error('Error registering nurse:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการลงทะเบียน'
        };
    }
}

export async function getPendingUsers() {
    try {
        const users = await prisma.user.findMany({
            where: {
                status: 'PENDING',
            },
            orderBy: {
                createdAt: 'desc',
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            }
        });

        return { success: true, data: users };
    } catch (error) {
        console.error('Error fetching pending users:', error);
        return { success: false, error: 'Failed to fetch pending users' };
    }
}

export async function approveUser(userId: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { status: 'APPROVED' },
        });

        return { success: true, message: 'User approved successfully' };
    } catch (error) {
        console.error('Error approving user:', error);
        return { success: false, error: 'Failed to approve user' };
    }
}

export async function rejectUser(userId: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { status: 'REJECTED' },
        });

        return { success: true, message: 'User rejected successfully' };
    } catch (error) {
        console.error('Error rejecting user:', error);
        return { success: false, error: 'Failed to reject user' };
    }
}
