import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';

export type AllowedRole = Role;

// Centralized permission mapping
export const ROLE_PERMISSIONS: Record<Role, string[]> = {
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

/**
 * Get the current authenticated user session
 */
export async function getCurrentUser() {
    const session = await getServerSession(authOptions);
    return session?.user;
}

/**
 * Require specific roles for a server action or page
 * Redirects to /login if not authenticated
 * Throws error if authenticated but unauthorized
 */
export async function requireRole(allowedRoles: AllowedRole[]) {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/login');
    }

    if (!allowedRoles.includes(user.role as Role)) {
        throw new Error('Unauthorized: You do not have permission to perform this action.');
    }

    return user;
}

/**
 * Check if a role has access to a specific page path
 */
export function hasPageAccess(role: Role, path: string): boolean {
    const allowedPaths = ROLE_PERMISSIONS[role] || [];

    // Check exact match or sub-path match
    // e.g. /dashboard/elderly matches /dashboard/elderly/new
    return allowedPaths.some(allowedPath =>
        path === allowedPath || path.startsWith(`${allowedPath}/`)
    );
}

/**
 * Check if the current user represents a "privileged" role (ADMIN or STAFF)
 * Useful for simple checks where NURSE is the restricted role
 */
export function isPrivileged(role: Role): boolean {
    return role === 'ADMIN' || role === 'STAFF';
}
