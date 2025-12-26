import { Body, Container, Head, Html, Preview, Tailwind } from '@react-email/components'
import type * as React from 'react'

interface EmailLayoutProps {
  children: React.ReactNode
  previewText?: string
}

export function EmailLayout({ children, previewText }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      {previewText && <Preview>{previewText}</Preview>}
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto my-8 max-w-[600px] rounded-lg bg-white p-8">
            {children}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
