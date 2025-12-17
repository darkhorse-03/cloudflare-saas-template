import { Activity, Zap } from 'lucide-react'
import { usePing } from '@/hooks/use-ping'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function ServiceBindingCard() {
  const { data: latency, isFetching, refetch } = usePing()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="size-5 text-orange-500" />
          Service Bindings
        </CardTitle>
        <CardDescription>Zero-latency worker-to-worker calls</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Activity className={`size-4 ${isFetching ? 'animate-pulse text-yellow-500' : 'text-green-500'}`} />
            <span className="font-mono text-sm">{latency !== undefined ? `${latency}ms` : '---'}</span>
          </div>
          <span className="text-xs text-muted-foreground">round-trip</span>
        </div>

        <Button onClick={() => refetch()} disabled={isFetching} className="w-full" size="sm" variant="default">
          {isFetching ? 'Pinging...' : 'Ping API'}
        </Button>
      </CardContent>
    </Card>
  )
}
