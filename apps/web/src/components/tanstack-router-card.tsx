import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

export function TanStackRouterCard() {
  return (
    <div className="p-4 bg-card border rounded-xl space-y-3">
      <div className="flex items-center gap-2">
        <ArrowRight className="size-5 text-purple-500" />
        <h3 className="font-semibold">TanStack Router</h3>
      </div>
      <p className="text-sm text-muted-foreground">Type-safe routing with prefetching</p>

      <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
        Hover the button to prefetch, click to navigate instantly
      </div>

      <Link to="/demo" preload="intent">
        <button className="w-full py-2 px-3 bg-purple-500 hover:bg-purple-600 text-white text-sm rounded-lg transition-colors cursor-pointer">
          Navigate to Demo
        </button>
      </Link>
    </div>
  )
}
