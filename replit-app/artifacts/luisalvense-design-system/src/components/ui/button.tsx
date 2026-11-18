import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex min-h-[38px] items-center justify-center gap-2 whitespace-nowrap rounded-md border px-3.5 text-xs font-semibold transition-[transform,background-color,border-color,color] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-55',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/90 active:translate-y-px',
        outline: 'border-input bg-card text-foreground hover:border-primary/40 hover:bg-muted',
        selected: 'border-primary/25 bg-primary/10 text-primary hover:bg-primary/15',
        ghost: 'border-transparent bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground',
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90',
      },
      size: {
        default: '',
        sm: 'min-h-8 rounded-sm px-2.5 text-[11px]',
        icon: 'size-9 min-h-9 px-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = 'Button';

export { buttonVariants };
