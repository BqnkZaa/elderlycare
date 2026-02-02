/**
 * Badge Component
 */

import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
    {
        variants: {
            variant: {
                default: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
                secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
                success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
                warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
                destructive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
                outline: 'border border-current bg-transparent',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

export interface BadgeProps
    extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
