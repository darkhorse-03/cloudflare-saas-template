import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import type * as React from 'react'
import { AppProviders } from '@/components/app-providers'
import { AuthDialog } from '@/components/auth/auth-dialog'
import type { AuthContext } from '@/types/auth'
import { seo } from '@/lib/seo'
import appCss from '@/styles.css?url'
import { config } from '@repo/config'

interface MyRouterContext {
  queryClient: QueryClient
  auth: AuthContext
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#09090b' },
      ...seo(),
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'canonical', href: config.seo.url },
      { rel: 'icon', href: '/favicon.ico', type: 'image/x-icon' },
      { rel: 'manifest', href: '/manifest.json' },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <AppProviders>
        <Outlet />
        <AuthDialog />
      </AppProviders>
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Theme script prevents flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              'use strict'
              ;(() => {
                const theme =
                  localStorage.getItem('theme') ||
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark')
                }
              })()
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  )
}
