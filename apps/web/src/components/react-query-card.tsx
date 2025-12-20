import { useQuery } from '@tanstack/react-query'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="size-5 text-green-500" />
          React Query
        </CardTitle>
        <CardDescription>Smart caching with stale indicators</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
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

        <Button onClick={() => refetch()} disabled={isFetching} className="w-full" size="sm">
          <RefreshCw className={`size-4 ${isFetching ? 'animate-spin' : ''}`} />
          {isFetching ? 'Fetching...' : 'Refetch'}
        </Button>
      </CardContent>
    </Card>
  )
}
