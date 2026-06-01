import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => (
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
          'w-full px-4 py-3 bg-surface-2 border rounded-xl text-white placeholder:text-text-secondary/40 transition-all duration-200',
          'focus:outline-none focus:border-keef-500 focus:ring-1 focus:ring-keef-500/50 focus:bg-surface-3',
          error ? 'border-error/50 focus:border-error focus:ring-error/30' : 'border-border hover:border-border-light',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-error mt-1 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-error" />{error}</p>}
      {hint && !error && <p className="text-xs text-text-tertiary mt-1">{hint}</p>}
    </div>
  )
)
Input.displayName = 'Input'
