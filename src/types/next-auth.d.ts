/**
 * NextAuth Type Extensions
 * 
 * Extend NextAuth types to include custom user properties.
 */

import 'next-auth';
import { Role } from '@prisma/client';

declare module 'next-auth' {
    interface User {
        id: string;
        email: string;
        name: string;
        role: Role;
    }

    interface Session {
        user: {
            id: string;
            email: string;
            name: string;
            role: string;
        };
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        role: string;
    }
}
