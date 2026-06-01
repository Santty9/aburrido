import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const variantStyles = {
  default: 'bg-surface-2 border border-border',
  glass: 'glass-card',
  elevated: 'bg-surface-2 border border-border shadow-lg shadow-black/20',
  outline: 'bg-transparent border border-border',
}

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variantStyles
}

export function Card({ className, variant = 'default', ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl p-6 transition-all duration-300 hover:border-keef-500/20',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('space-y-1.5 mb-4', className)} {...props} />
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-lg font-semibold tracking-tight', className)} {...props} />
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-text-secondary leading-relaxed', className)} {...props} />
}
