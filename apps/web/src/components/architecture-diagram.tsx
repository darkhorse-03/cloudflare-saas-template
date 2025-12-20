import { Activity, ArrowRight, Globe, Server, Zap } from 'lucide-react'
import { usePing } from '@/hooks/use-ping'

export function ArchitectureDiagram() {
  const { data: latency, isFetching, refetch } = usePing()

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
        {/* Browser */}
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-xl border bg-card p-3 sm:p-4">
            <Globe className="size-6 text-blue-500 sm:size-8" />
          </div>
          <span className="font-medium text-xs sm:text-sm">Browser</span>
        </div>

        <ArrowRight className="size-4 text-muted-foreground sm:size-5" />

        {/* Web Worker */}
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-xl border bg-card p-3 sm:p-4">
            <Server className="size-6 text-orange-500 sm:size-8" />
          </div>
          <span className="font-medium text-xs sm:text-sm">Web Worker</span>
        </div>

        {/* Service Binding */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg border border-orange-500/50 border-dashed bg-gradient-to-r from-orange-500/10 to-purple-500/10 px-2 py-1.5 sm:px-3 sm:py-2">
            <Zap className="size-3 text-orange-500 sm:size-4" />
            <span className="font-mono text-[10px] sm:text-xs">binding</span>
          </div>
        </div>

        <ArrowRight className="size-4 text-muted-foreground sm:size-5" />

        {/* API Worker */}
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-xl border bg-card p-3 sm:p-4">
            <Server className="size-6 text-purple-500 sm:size-8" />
          </div>
          <span className="font-medium text-xs sm:text-sm">API Worker</span>
        </div>
      </div>

      {/* Latency Indicator */}
      <div className="mt-6 flex justify-center sm:mt-8">
        <button
          className="flex cursor-pointer items-center gap-2 rounded-full border bg-card px-3 py-2 transition-colors hover:bg-accent sm:px-4"
          onClick={() => refetch()}
          type="button"
        >
          <Activity
            className={`size-4 ${isFetching ? 'animate-pulse text-yellow-500' : 'text-green-500'}`}
          />
          <span className="font-mono text-xs sm:text-sm">
            {latency !== undefined ? `${latency}ms` : '---'}
          </span>
          <span className="text-muted-foreground text-xs">round-trip</span>
        </button>
      </div>
    </div>
  )
}
