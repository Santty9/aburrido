import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={cn(
          'w-full px-4 py-3 bg-surface-2 border rounded-xl text-white placeholder:text-text-secondary/50 transition-all duration-200',
          'focus:outline-none focus:border-keef-500 focus:ring-1 focus:ring-keef-500/50',
          error ? 'border-error' : 'border-border',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-error mt-1">{error}</p>}
    </div>
  )
)
Input.displayName = 'Input'
