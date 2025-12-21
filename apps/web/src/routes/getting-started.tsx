import { config } from '@repo/config'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Layout } from '@/components/layout'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/getting-started')({
  component: GettingStartedPage,
})

function GettingStartedPage() {
  return (
    <Layout>
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 font-bold text-4xl">Getting Started</h1>
          <p className="text-lg text-muted-foreground">
            Create your Cloudflare Workers app in under a minute
          </p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <section className="mb-12">
            <h2 className="mb-4 font-semibold text-2xl">Quick Start</h2>
            <p className="mb-4 text-muted-foreground leading-relaxed">
              Run this command to create a new project with our interactive CLI:
            </p>
            <div className="not-prose mb-4 rounded-lg bg-muted/50 p-4 font-mono text-sm">
              bunx create-underdog-app
            </div>
            <p className="mb-4 text-muted-foreground text-sm leading-relaxed">
              Or specify a project name directly:
            </p>
            <div className="not-prose rounded-lg bg-muted/50 p-4 font-mono text-sm">
              bunx create-underdog-app my-awesome-app
            </div>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 font-semibold text-2xl">Interactive Setup</h2>
            <p className="mb-6 text-muted-foreground leading-relaxed">
              The CLI will guide you through configuring your project with a series of prompts:
            </p>
            <ul className="space-y-3 text-muted-foreground">
              <li>
                <strong className="text-foreground">Project name</strong> - Required, used
                throughout your app
              </li>
              <li>
                <strong className="text-foreground">Description</strong> - Optional, appears in meta
                tags and config
              </li>
              <li>
                <strong className="text-foreground">Tagline</strong> - Optional, shown on your
                landing page
              </li>
              <li>
                <strong className="text-foreground">Production URL</strong> - Optional, used for SEO
                and Open Graph tags
              </li>
              <li>
                <strong className="text-foreground">GitHub repository URL</strong> - Optional,
                updates footer and config links
              </li>
              <li>
                <strong className="text-foreground">Twitter/X handle</strong> - Optional, for social
                links
              </li>
              <li>
                <strong className="text-foreground">Initialize git?</strong> - Default: yes, creates
                git repository
              </li>
              <li>
                <strong className="text-foreground">Install dependencies?</strong> - Default: yes,
                runs bun install
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="mb-6 font-semibold text-2xl">What You Get</h2>
            <div className="not-prose grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Turborepo Monorepo</CardTitle>
                  <CardDescription>
                    Organized workspace with apps/api (Hono), apps/web (React), and shared packages
                    for configuration. Blazing-fast builds with caching.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Authentication Flows</CardTitle>
                  <CardDescription>
                    Pre-built sign-in and sign-up forms with TanStack Form, Zod validation, and
                    Better Auth integration. Protected routes ready to use.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Type-Safe APIs</CardTitle>
                  <CardDescription>
                    Hono RPC enables end-to-end type safety between your API and frontend. Full
                    autocomplete and compile-time error checking.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Modern UI Components</CardTitle>
                  <CardDescription>
                    Tailwind CSS with shadcn/ui components. Dark mode support, responsive design,
                    and beautiful defaults out of the box.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>File-Based Routing</CardTitle>
                  <CardDescription>
                    TanStack Router provides automatic route generation from your file structure.
                    Type-safe navigation with prefetching on hover.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Deployment Ready</CardTitle>
                  <CardDescription>
                    Pre-configured wrangler.toml for Cloudflare Workers and Pages. One command to
                    deploy to the edge globally.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 font-semibold text-2xl">Next Steps</h2>
            <ol className="space-y-4 text-muted-foreground">
              <li className="flex gap-4">
                <span className="font-semibold text-foreground">1.</span>
                <div>
                  <p className="leading-relaxed">Navigate to your project directory:</p>
                  <div className="not-prose mt-2 rounded-lg bg-muted/50 p-3 font-mono text-sm">
                    cd my-awesome-app
                  </div>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-semibold text-foreground">2.</span>
                <div>
                  <p className="leading-relaxed">Start the development servers:</p>
                  <div className="not-prose mt-2 rounded-lg bg-muted/50 p-3 font-mono text-sm">
                    bun run dev
                  </div>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-semibold text-foreground">3.</span>
                <p className="leading-relaxed">
                  Open{' '}
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
                    http://localhost:5173
                  </code>{' '}
                  in your browser
                </p>
              </li>
              <li className="flex gap-4">
                <span className="font-semibold text-foreground">4.</span>
                <p className="leading-relaxed">
                  Start building! Make changes and see them live reload instantly
                </p>
              </li>
              <li className="flex gap-4">
                <span className="font-semibold text-foreground">5.</span>
                <div>
                  <p className="leading-relaxed">When ready, deploy to Cloudflare:</p>
                  <div className="not-prose mt-2 rounded-lg bg-muted/50 p-3 font-mono text-sm">
                    bun run deploy
                  </div>
                </div>
              </li>
            </ol>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 font-semibold text-2xl">File-Based Routing with TanStack Router</h2>
            <p className="mb-4 text-muted-foreground leading-relaxed">
              {config.appName} uses TanStack Router for type-safe, file-based routing. Routes are
              automatically generated from files in <code>apps/web/src/routes/</code>.
            </p>

            <h3 className="mb-3 font-semibold text-xl">How It Works</h3>
            <p className="mb-4 text-muted-foreground leading-relaxed">
              Create a new file in the routes directory and TanStack Router automatically creates
              the route:
            </p>
            <div className="not-prose mb-6 rounded-lg bg-muted/50 p-4 font-mono text-sm">
              <div className="text-muted-foreground">// apps/web/src/routes/blog.tsx</div>
              <div className="mt-2">
                import {'{ createFileRoute }'} from '@tanstack/react-router'
              </div>
              <div className="mt-1 mb-3">import {'{ Layout }'} from '@/components/layout'</div>
              <div className="mt-1">export const Route = createFileRoute('/blog')(&#123;</div>
              <div className="ml-4">component: BlogPage,</div>
              <div>&#125;)</div>
              <div className="mt-3">function BlogPage() &#123;</div>
              <div className="ml-4">return {'<Layout>...</ Layout>'}</div>
              <div>&#125;</div>
            </div>

            <h3 className="mb-3 font-semibold text-xl">Prefetching on Hover</h3>
            <p className="mb-4 text-muted-foreground leading-relaxed">
              TanStack Router automatically prefetches routes when you hover over a link, making
              navigation feel instant. Use the <code>Link</code> component for type-safe navigation:
            </p>
            <div className="not-prose mb-6 rounded-lg bg-muted/50 p-4 font-mono text-sm">
              <div className="text-muted-foreground">
                // Autocomplete and type checking for routes
              </div>
              <div className="mt-2">{'<Link to="/blog">View Blog</Link>'}</div>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              Learn more about routing patterns in the{' '}
              <Link className="text-primary hover:underline" to="/features">
                Features
              </Link>{' '}
              page or explore the{' '}
              <Link className="text-primary hover:underline" to="/about">
                About
              </Link>{' '}
              page to understand the technology stack.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  )
}
