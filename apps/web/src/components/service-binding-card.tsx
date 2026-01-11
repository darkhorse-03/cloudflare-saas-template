import { Activity, Check, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { usePing } from '@/hooks/use-ping'

export function ServiceBindingCard() {
  const { data: latency, isFetching, refetch } = usePing()

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Zap className="size-5 text-orange-500" />
            <CardTitle>Service Bindings</CardTitle>
          </div>
          <div className="rounded-full bg-emerald-500/10 px-3 py-1 font-mono text-emerald-600 text-xs dark:text-emerald-400">
            Save 2 hours
          </div>
        </div>
        <CardDescription>
          Zero-latency worker-to-worker communication. No cold starts, no network hops.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col space-y-4">
        {/* Live Ping Demo */}
        <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
          <div className="flex items-center gap-2">
            <Activity
              className={`size-4 ${isFetching ? 'animate-pulse text-yellow-500' : 'text-emerald-500'}`}
            />
            <span className="font-mono text-sm">
              {latency !== undefined ? `${latency}ms` : '---'}
            </span>
          </div>
          <span className="text-muted-foreground text-xs">round-trip</span>
        </div>

        <Button
          className="w-full"
          disabled={isFetching}
          onClick={() => refetch()}
          size="sm"
          variant="default"
        >
          {isFetching ? 'Pinging...' : 'Ping API'}
        </Button>

        {/* Features List */}
        <div className="flex-1 rounded-lg bg-muted/50 p-4">
          <div className="mb-2 font-medium text-sm">What's included:</div>
          <ul className="grid gap-2 text-muted-foreground text-sm">
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" />
              <span>Direct worker-to-worker RPC</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" />
              <span>No network overhead</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" />
              <span>Type-safe API calls</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" />
              <span>Pre-configured routing</span>
            </li>
          </ul>
        </div>

        {/* Tagline */}
        <div className="text-center text-muted-foreground text-sm italic">
          "Cloudflare's secret weapon for microservices"
        </div>
      </CardContent>
    </Card>
  )
}
