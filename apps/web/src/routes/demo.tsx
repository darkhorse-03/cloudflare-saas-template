import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/demo')({
  component: DemoPage,
})

function DemoPage() {
  return (
    <div className="min-h-screen text-foreground">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-8 cursor-pointer">
            <ArrowLeft className="size-4 mr-2" />
            Back
          </Button>
        </Link>

        <h1 className="text-2xl font-bold mb-4">Demo Page</h1>
        <p className="text-muted-foreground">
          This page demonstrates TanStack Router's instant navigation with prefetching.
        </p>
        <p className="text-muted-foreground mt-4">
          Notice how fast the navigation was? TanStack Router prefetches routes on hover.
        </p>
      </div>
    </div>
  )
}
