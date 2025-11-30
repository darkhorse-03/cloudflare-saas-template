import { useQuery } from '@tanstack/react-query'
import { RefreshCw } from 'lucide-react'
import { api } from '@/lib/api'

export function ReactQueryCard() {
  const { data, isFetching, dataUpdatedAt, refetch } = useQuery({
    queryKey: ['random'],
    queryFn: async () => {
      const res = await api.random.$get()
      return res.json()
    },
    staleTime: 5000,
  })

  const isStale = Date.now() - dataUpdatedAt > 5000

  return (
    <div className="p-4 bg-card border rounded-xl space-y-3">
      <div className="flex items-center gap-2">
        <RefreshCw className="size-5 text-green-500" />
        <h3 className="font-semibold">React Query</h3>
      </div>
      <p className="text-sm text-muted-foreground">Smart caching with stale indicators</p>

      <div className="bg-muted/50 rounded-lg p-3 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">number:</span>
          <span className="font-mono text-sm">{data?.number ?? '---'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">status:</span>
          <span className={`text-xs ${isStale ? 'text-yellow-500' : 'text-green-500'}`}>
            {isStale ? 'stale' : 'fresh'}
          </span>
        </div>
      </div>

      <button
        onClick={() => refetch()}
        disabled={isFetching}
        className="w-full py-2 px-3 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
      >
        <RefreshCw className={`size-4 ${isFetching ? 'animate-spin' : ''}`} />
        {isFetching ? 'Fetching...' : 'Refetch'}
      </button>
    </div>
  )
}
