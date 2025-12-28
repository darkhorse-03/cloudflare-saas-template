import { createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { source } from '@/lib/source'
import browserCollections from 'fumadocs-mdx:collections/browser'
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import { baseOptions } from '@/lib/layout.shared'
import { staticFunctionMiddleware } from '@tanstack/start-static-server-functions'
import { useFumadocsLoader } from 'fumadocs-core/source/client'
import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { HomeLayout } from 'fumadocs-ui/layouts/home'
import { SidebarTrigger, SidebarCollapseTrigger } from 'fumadocs-ui/components/sidebar/base'

function SidebarTriggerPortal() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const mobileEl = document.getElementById('sidebar-trigger-mobile')
  const desktopEl = document.getElementById('sidebar-trigger-desktop')

  const desktopTrigger = (
    <SidebarCollapseTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring hover:bg-fd-accent hover:text-fd-accent-foreground [&_svg]:size-4.5 p-2">
      <TriggerIcon />
    </SidebarCollapseTrigger>
  )

  const mobileTrigger = (
    <SidebarTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring hover:bg-fd-accent hover:text-fd-accent-foreground [&_svg]:size-4.5 p-2">
      <TriggerIcon />
    </SidebarTrigger>
  )

  return (
    <>
      {mobileEl ? createPortal(mobileTrigger, mobileEl) : null}
      {desktopEl ? createPortal(desktopTrigger, desktopEl) : null}
    </>
  )
}

function TriggerIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <title>Toggle Sidebar</title>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
    </svg>
  )
}

export const Route = createFileRoute('/$')({
  component: Page,
  loader: async ({ params }) => {
    const slugs = params._splat?.split('/') ?? []
    const data = await loader({ data: slugs })
    await clientLoader.preload(data.path)
    return data
  },
})

const loader = createServerFn({
  method: 'GET',
})
  .inputValidator((slugs: string[]) => slugs)
  .middleware([staticFunctionMiddleware])
  .handler(async ({ data: slugs }) => {
    const page = source.getPage(slugs)
    if (!page) {
      throw notFound()
    }

    return {
      path: page.path,
      pageTree: await source.serializePageTree(source.pageTree),
    }
  })

const clientLoader = browserCollections.docs.createClientLoader({
  component({ toc, frontmatter, default: MDX }) {
    return (
      <DocsPage toc={toc}>
        <DocsTitle>{frontmatter.title}</DocsTitle>
        <DocsDescription>{frontmatter.description}</DocsDescription>
        <DocsBody>
          <MDX
            components={{
              ...defaultMdxComponents,
            }}
          />
        </DocsBody>
      </DocsPage>
    )
  },
})

function Page() {
  const data = Route.useLoaderData()
  const Content = clientLoader.getComponent(data.path)
  const { pageTree } = useFumadocsLoader(data)

  const options = baseOptions()
  const docsOptions = {
    ...options,
    links: options.links?.map((link) => ({
      ...link,
      className: 'md:hidden',
    })),
  }

  return (
    <HomeLayout
      {...options}
      links={[
        ...(options.links ?? []),
        {
          type: 'custom',
          children: <div id="sidebar-trigger-desktop" className="max-lg:hidden" />,
          secondary: true,
        },
      ]}
      nav={{
        ...options.nav,
        children: <div id="sidebar-trigger-mobile" className="lg:hidden order-last ml-2" />,
      }}
    >
      <DocsLayout
        {...docsOptions}
        tree={pageTree}
        nav={{ enabled: false }}
        sidebar={{
          enabled: true,
          collapsible: false,
        }}
      >
        <SidebarTriggerPortal />
        <Content />
      </DocsLayout>
    </HomeLayout>
  )
}
