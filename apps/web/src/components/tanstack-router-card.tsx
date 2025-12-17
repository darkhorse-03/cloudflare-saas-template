import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function TanStackRouterCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRight className="size-5 text-purple-500" />
          TanStack Router
        </CardTitle>
        <CardDescription>Type-safe routing with prefetching</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
          Hover the button to prefetch, click to navigate instantly
        </div>

        <Link to="/demo" preload="intent" className="block">
          <Button className="w-full" size="sm" variant="default">
            Navigate to Demo
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
