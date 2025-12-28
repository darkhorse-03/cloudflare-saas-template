import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import type * as React from 'react'
import appCss from '@/styles/app.css?url'
import { RootProvider } from 'fumadocs-ui/provider/tanstack'
import SearchDialog from '@/components/search'
import { config } from '@repo/config'

const docsUrl = `${config.webUrl}/docs`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: `${config.appName} Docs` },
      {
        name: 'description',
        content: `Documentation for ${config.appName} - ${config.description}`,
      },
      { name: 'theme-color', content: '#000000' },
      // Open Graph
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: `${config.appName} Docs` },
      { property: 'og:url', content: docsUrl },
      { property: 'og:title', content: `${config.appName} Docs` },
      {
        property: 'og:description',
        content: `Documentation for ${config.appName} - ${config.description}`,
      },
      // Twitter
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: `${config.appName} Docs` },
      {
        name: 'twitter:description',
        content: `Documentation for ${config.appName} - ${config.description}`,
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'canonical', href: docsUrl },
      { rel: 'icon', href: '/docs/favicon.ico', type: 'image/x-icon' },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="flex flex-col min-h-screen">
        <RootProvider search={{ SearchDialog }}>{children}</RootProvider>
        <Scripts />
      </body>
    </html>
  )
}
