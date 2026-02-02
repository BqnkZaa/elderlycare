/**
 * Authentication Server Actions
 */

'use server';

import prisma from '@/lib/prisma';
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
