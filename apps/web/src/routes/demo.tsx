import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/demo')({
  component: DemoPage,
})

function DemoPage() {
  return (
    <div className="min-h-screen text-foreground">
      <div className="container mx-auto max-w-3xl px-4 py-16">
        <Link to="/">
          <Button className="mb-8 cursor-pointer" size="sm" variant="ghost">
            <ArrowLeft className="mr-2 size-4" />
            Back
          </Button>
        </Link>

        <h1 className="mb-4 font-bold text-2xl">Demo Page</h1>
        <p className="text-muted-foreground">
          This page demonstrates TanStack Router's instant navigation with prefetching.
        </p>
        <p className="mt-4 text-muted-foreground">
          Notice how fast the navigation was? TanStack Router prefetches routes on hover.
        </p>
      </div>
    </div>
  )
}
