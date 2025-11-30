import { Activity, ArrowRight, Globe, Server, Zap } from 'lucide-react'
import { usePing } from '@/hooks/use-ping'

export function ArchitectureDiagram() {
  const { data: latency, isFetching, refetch } = usePing()

  return (
    <div className="w-full">
      <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
        {/* Browser */}
        <div className="flex flex-col items-center gap-2">
          <div className="p-3 sm:p-4 bg-card border rounded-xl">
            <Globe className="size-6 sm:size-8 text-blue-500" />
          </div>
          <span className="text-xs sm:text-sm font-medium">Browser</span>
        </div>

        <ArrowRight className="size-4 sm:size-5 text-muted-foreground" />

        {/* Web Worker */}
        <div className="flex flex-col items-center gap-2">
          <div className="p-3 sm:p-4 bg-card border rounded-xl">
            <Server className="size-6 sm:size-8 text-orange-500" />
          </div>
          <span className="text-xs sm:text-sm font-medium">Web Worker</span>
        </div>

        {/* Service Binding */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-orange-500/10 to-purple-500/10 border border-dashed border-orange-500/50 rounded-lg">
            <Zap className="size-3 sm:size-4 text-orange-500" />
            <span className="text-[10px] sm:text-xs font-mono">binding</span>
          </div>
        </div>

        <ArrowRight className="size-4 sm:size-5 text-muted-foreground" />

        {/* API Worker */}
        <div className="flex flex-col items-center gap-2">
          <div className="p-3 sm:p-4 bg-card border rounded-xl">
            <Server className="size-6 sm:size-8 text-purple-500" />
          </div>
          <span className="text-xs sm:text-sm font-medium">API Worker</span>
        </div>
      </div>

      {/* Latency Indicator */}
      <div className="mt-6 sm:mt-8 flex justify-center">
        <div
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-card border rounded-full cursor-pointer hover:bg-accent transition-colors"
          onClick={() => refetch()}
        >
          <Activity className={`size-4 ${isFetching ? 'animate-pulse text-yellow-500' : 'text-green-500'}`} />
          <span className="text-xs sm:text-sm font-mono">
            {latency !== undefined ? `${latency}ms` : '---'}
          </span>
          <span className="text-xs text-muted-foreground">round-trip</span>
        </div>
      </div>
    </div>
  )
}
