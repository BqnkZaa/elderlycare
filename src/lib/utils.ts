/**
 * Utility Functions
 * 
 * Common utility functions used across the application.
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string, locale: string = 'th-TH'): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

/**
 * Format date for input fields (YYYY-MM-DD)
 */
export function formatDateForInput(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toISOString().split('T')[0];
}

/**
 * Calculate age from date of birth
 */
export function calculateAge(dateOfBirth: Date | string): number {
    const dob = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }

    return age;
}

/**
 * Check if today is a birthday
 */
export function isBirthdayToday(dateOfBirth: Date | string): boolean {
    const dob = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
    const today = new Date();

    return dob.getMonth() === today.getMonth() && dob.getDate() === today.getDate();
}

/**
 * Check if today is registration anniversary
 */
export function isAnniversaryToday(registrationDate: Date | string): boolean {
    const regDate = typeof registrationDate === 'string' ? new Date(registrationDate) : registrationDate;
    const today = new Date();

    // Only count if at least 1 year has passed
    const yearsDiff = today.getFullYear() - regDate.getFullYear();
    if (yearsDiff < 1) return false;

    return regDate.getMonth() === today.getMonth() && regDate.getDate() === today.getDate();
}

/**
 * Get years since registration
 */
export function getYearsSinceRegistration(registrationDate: Date | string): number {
    const regDate = typeof registrationDate === 'string' ? new Date(registrationDate) : registrationDate;
    const today = new Date();

    let years = today.getFullYear() - regDate.getFullYear();
    const monthDiff = today.getMonth() - regDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < regDate.getDate())) {
        years--;
    }

    return Math.max(0, years);
}

/**
 * Paginate array
 */
export function paginate<T>(array: T[], page: number, pageSize: number): T[] {
    const startIndex = (page - 1) * pageSize;
    return array.slice(startIndex, startIndex + pageSize);
}

/**
 * Calculate pagination metadata
 */
export function getPaginationMeta(totalItems: number, page: number, pageSize: number) {
    const totalPages = Math.ceil(totalItems / pageSize);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
        currentPage: page,
        pageSize,
        totalItems,
        totalPages,
        hasNextPage,
        hasPrevPage,
    };
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;

    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

/**
 * Sleep utility for async operations
 */
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
