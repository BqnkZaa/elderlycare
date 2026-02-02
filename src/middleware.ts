/**
 * Middleware for Route Protection
 * 
 * Protects dashboard routes and redirects unauthenticated users to login.
 */

import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
    function middleware(req) {
        // Allow all authenticated requests
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                // Protect dashboard routes
                if (req.nextUrl.pathname.startsWith('/dashboard')) {
                    return !!token;
                }
                // Allow other routes
                return true;
            },
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
