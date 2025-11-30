import { Activity, Zap } from 'lucide-react'
import { usePing } from '@/hooks/use-ping'

export function ServiceBindingCard() {
  const { data: latency, isFetching, refetch } = usePing()

  return (
    <div className="p-4 bg-card border rounded-xl space-y-3">
      <div className="flex items-center gap-2">
        <Zap className="size-5 text-orange-500" />
        <h3 className="font-semibold">Service Bindings</h3>
      </div>
      <p className="text-sm text-muted-foreground">Zero-latency worker-to-worker calls</p>

      <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
        <div className="flex items-center gap-2">
          <Activity className={`size-4 ${isFetching ? 'animate-pulse text-yellow-500' : 'text-green-500'}`} />
          <span className="font-mono text-sm">{latency !== undefined ? `${latency}ms` : '---'}</span>
        </div>
        <span className="text-xs text-muted-foreground">round-trip</span>
      </div>

      <button
        onClick={() => refetch()}
        disabled={isFetching}
        className="w-full py-2 px-3 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
      >
        {isFetching ? 'Pinging...' : 'Ping API'}
      </button>
    </div>
  )
}
