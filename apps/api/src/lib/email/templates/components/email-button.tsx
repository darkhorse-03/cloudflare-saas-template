import { Button } from '@react-email/components'
import type * as React from 'react'

interface EmailButtonProps {
  href: string
  children: React.ReactNode
}

export function EmailButton({ href, children }: EmailButtonProps) {
  return (
    <Button
      href={href}
      className="my-4 block w-full rounded bg-black px-5 py-3 text-center text-base font-semibold text-white"
    >
      {children}
    </Button>
  )
}
