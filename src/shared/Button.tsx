import type { ComponentProps, ReactNode } from 'react'

type ButtonProps = ComponentProps<'button'> & { children: ReactNode }

export function Button({ children, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className="retro-button" {...props}>{children}</button>
}
