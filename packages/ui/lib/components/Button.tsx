import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '../utils'

export type ButtonProps = {
  theme?: 'light' | 'dark'
} & ComponentPropsWithoutRef<'button'>

export function Button({ className, children, ...props }: ButtonProps) {
  return (
    <button className={cn(className, 'btn btn-accent btn-lg')} {...props}>
      {children}
    </button>
  )
}
