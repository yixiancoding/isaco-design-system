import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full font-body font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: '',
        secondary: 'border',
        tertiary: '',
      },
      sentiment: {
        admin: '',
        consumer: '',
        negative: '',
        positive: '',
        inverse: '',
      },
      size: {
        default: 'h-12 px-6 text-label',
        small: 'h-8 px-4 text-label',
      },
    },
    compoundVariants: [
      // Primary + Admin
      {
        variant: 'primary',
        sentiment: 'admin',
        className: 'bg-admin-action-admin-action-background text-admin-action-admin-action-text-inverse hover:bg-admin-action-admin-action-background-hover active:bg-admin-action-admin-action-background-pressed',
      },
      // Primary + Consumer
      {
        variant: 'primary',
        sentiment: 'consumer',
        className: 'bg-consumer-action-consumer-action-background text-white hover:bg-consumer-action-consumer-action-background-hover active:bg-consumer-action-consumer-action-background-pressed',
      },
      // Primary + Negative
      {
        variant: 'primary',
        sentiment: 'negative',
        className: 'bg-negative-negative-background text-white hover:bg-negative-negative-background-hover active:bg-negative-negative-background-pressed',
      },
      // Primary + Positive
      {
        variant: 'primary',
        sentiment: 'positive',
        className: 'bg-positive-positive-background text-white hover:bg-positive-positive-background-hover active:bg-positive-positive-background-pressed',
      },
      // Primary + Inverse
      {
        variant: 'primary',
        sentiment: 'inverse',
        className: 'bg-neutral-neutral-background text-neutral-neutral-text hover:bg-neutral-neutral-background-weak active:bg-neutral-neutral-background-medium',
      },
      // Secondary + Admin
      {
        variant: 'secondary',
        sentiment: 'admin',
        className: 'bg-neutral-neutral-background border-admin-action-admin-action-border text-admin-action-admin-action-text hover:bg-admin-action-admin-action-background-weak-hover active:bg-admin-action-admin-action-background-weak-pressed',
      },
      // Secondary + Consumer
      {
        variant: 'secondary',
        sentiment: 'consumer',
        className: 'bg-neutral-neutral-background border-consumer-action-consumer-action-border text-consumer-action-consumer-action-text hover:bg-consumer-action-consumer-action-background-weak-hover active:bg-consumer-action-consumer-action-background-weak-pressed',
      },
      // Secondary + Negative
      {
        variant: 'secondary',
        sentiment: 'negative',
        className: 'bg-neutral-neutral-background border-negative-negative-border text-negative-negative-text hover:bg-negative-negative-background-weak-hover active:bg-negative-negative-background-weak-pressed',
      },
      // Secondary + Positive
      {
        variant: 'secondary',
        sentiment: 'positive',
        className: 'bg-neutral-neutral-background border-positive-positive-border text-positive-positive-text hover:bg-positive-positive-background-weak-hover active:bg-positive-positive-background-weak-pressed',
      },
      // Secondary + Inverse
      {
        variant: 'secondary',
        sentiment: 'inverse',
        className: 'bg-transparent border-neutral-neutral-text-inverse text-neutral-neutral-text-inverse hover:bg-white/10 active:bg-white/20',
      },
      // Tertiary + Admin
      {
        variant: 'tertiary',
        sentiment: 'admin',
        className: 'bg-transparent text-admin-action-admin-action-text hover:bg-admin-action-admin-action-background-weak-hover active:bg-admin-action-admin-action-background-weak-pressed',
      },
      // Tertiary + Consumer
      {
        variant: 'tertiary',
        sentiment: 'consumer',
        className: 'bg-transparent text-consumer-action-consumer-action-text hover:bg-consumer-action-consumer-action-background-weak-hover active:bg-consumer-action-consumer-action-background-weak-pressed',
      },
      // Tertiary + Negative
      {
        variant: 'tertiary',
        sentiment: 'negative',
        className: 'bg-transparent text-negative-negative-text hover:bg-negative-negative-background-weak-hover active:bg-negative-negative-background-weak-pressed',
      },
      // Tertiary + Positive
      {
        variant: 'tertiary',
        sentiment: 'positive',
        className: 'bg-transparent text-positive-positive-text hover:bg-positive-positive-background-weak-hover active:bg-positive-positive-background-weak-pressed',
      },
      // Tertiary + Inverse
      {
        variant: 'tertiary',
        sentiment: 'inverse',
        className: 'bg-transparent text-neutral-neutral-text-inverse hover:bg-white/10 active:bg-white/20',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      sentiment: 'consumer',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, sentiment, size, asChild = false, loading = false, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, sentiment, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <span className="animate-spin">⏳</span>
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
)

Button.displayName = 'Button'
