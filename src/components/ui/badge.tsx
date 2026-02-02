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
                default: 'bg-primary/20 text-primary hover:bg-primary/30',
                secondary: 'bg-secondary/20 text-secondary hover:bg-secondary/30',
                success: 'bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30',
                warning: 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30',
                destructive: 'bg-destructive/20 text-destructive hover:bg-destructive/30',
                outline: 'border border-border text-foreground',
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
