/**
 * Select Component
 */

import { cn } from '@/lib/utils';
import { SelectHTMLAttributes, forwardRef } from 'react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    error?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, error, children, ...props }, ref) => {
        return (
            <div className="w-full">
                <select
                    className={cn(
                        'flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm',
                        'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        'dark:border-gray-600 dark:bg-gray-800 dark:text-white',
                        error && 'border-red-500 focus:ring-red-500',
                        className
                    )}
                    ref={ref}
                    {...props}
                >
                    {children}
                </select>
                {error && (
                    <p className="mt-1 text-xs text-red-500">{error}</p>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';

export { Select };
