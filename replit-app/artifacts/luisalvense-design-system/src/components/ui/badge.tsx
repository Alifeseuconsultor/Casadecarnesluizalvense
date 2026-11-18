import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-sm px-2 py-1 text-[10px] font-semibold leading-none',
  {
    variants: {
      variant: {
        active: 'bg-primary/10 text-primary',
        soldOut: 'bg-destructive/10 text-destructive',
        inactive: 'bg-muted text-muted-foreground',
        demo: 'bg-secondary text-secondary-foreground',
        accent: 'bg-accent/25 text-foreground',
        neutral: 'bg-muted text-muted-foreground',
      },
    },
    defaultVariants: {
      variant: 'active',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };
