import * as React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  default: 'btn-primary',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
  secondary: 'btn-secondary',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
  link: 'text-primary underline-offset-4 hover:underline',
}

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  default: 'btn-md',
  sm: 'btn-sm',
  lg: 'btn-lg',
  icon: 'btn-icon',
}

export function Button({
  className,
  variant = 'default',
  size = 'default',
  ref,
  ...props
}: ButtonProps & { ref?: React.Ref<HTMLButtonElement> }) {
  return (
    <button
      className={cn(
        'btn',
        variantClasses[variant],
        variant !== 'link' && sizeClasses[size],
        className
      )}
      ref={ref}
      {...props}
    />
  )
}
