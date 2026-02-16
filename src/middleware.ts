/**
 * Middleware for Route Protection
 * 
 * Protects dashboard routes and redirects unauthenticated users to login.
 */

import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

// Role-based access control mapping
// Note: We duplicate this from auth-utils because edge runtime sometimes has issues importing from lib
const ROLE_PERMISSIONS: Record<string, string[]> = {
    ADMIN: [
        '/dashboard',
        '/dashboard/elderly',
        '/dashboard/logs',
        '/dashboard/users',
        '/dashboard/alerts',
        '/dashboard/settings',
        '/dashboard/command',
    ],
    STAFF: [
        '/dashboard',
        '/dashboard/elderly',
        '/dashboard/logs',
        '/dashboard/alerts',
    ],
    NURSE: [
        '/dashboard',
        '/dashboard/elderly', // View only (enforced by UI/Actions)
        '/dashboard/logs',
        '/dashboard/alerts',
    ],
};

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const pathname = req.nextUrl.pathname;

        // Skip role check for forbidden page itself to avoid infinite loop
        if (pathname === '/dashboard/forbidden') {
            return NextResponse.next();
        }

        if (!token) return NextResponse.redirect(new URL('/login', req.url));

        const userRole = token.role as string;
        const allowedPaths = ROLE_PERMISSIONS[userRole] || [];

        // Check if user has access to this path
        // We check if the current path starts with any of the allowed paths
        const hasAccess = allowedPaths.some(allowedPath =>
            pathname === allowedPath || pathname.startsWith(`${allowedPath}/`)
        );

        if (!hasAccess) {
            // Rewrite to forbidden page so the URL stays the same but shows error
            return NextResponse.rewrite(new URL('/dashboard/forbidden', req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
        pages: {
            signIn: '/login',
        },
    }
);

export const config = {
    matcher: [
        '/dashboard/:path*',
    ],
};
