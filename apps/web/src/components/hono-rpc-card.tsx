import { Code } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/api'

export function HonoRpcCard() {
  const [response, setResponse] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const callApi = async () => {
    setIsLoading(true)
    const res = await api.time.$get()
    const data = await res.json()
    setResponse(JSON.stringify(data, null, 2))
    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="size-5 text-blue-500" />
          Hono RPC
        </CardTitle>
        <CardDescription>Type-safe API calls with autocomplete</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-lg bg-muted/50 p-3 font-mono text-xs">
          <span className="text-muted-foreground">const</span> res{' '}
          <span className="text-muted-foreground">=</span>{' '}
          <span className="text-muted-foreground">await</span> api.
          <span className="text-blue-500">time</span>
          .$get()
        </div>

        <Button className="w-full" disabled={isLoading} onClick={callApi} size="sm">
          {isLoading ? 'Calling...' : 'Call API'}
        </Button>

        {response && (
          <pre className="max-h-24 overflow-auto rounded-lg bg-muted/50 p-3 text-xs">
            {response}
          </pre>
        )}
      </CardContent>
    </Card>
  )
}
