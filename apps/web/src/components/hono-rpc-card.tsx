import { useState } from 'react'
import { Code } from 'lucide-react'
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
    <div className="p-4 bg-card border rounded-xl space-y-3">
      <div className="flex items-center gap-2">
        <Code className="size-5 text-blue-500" />
        <h3 className="font-semibold">Hono RPC</h3>
      </div>
      <p className="text-sm text-muted-foreground">Type-safe API calls with autocomplete</p>

      <div className="bg-muted/50 rounded-lg p-3 font-mono text-xs">
        <span className="text-muted-foreground">const</span> res <span className="text-muted-foreground">=</span>{' '}
        <span className="text-muted-foreground">await</span> api.<span className="text-blue-500">time</span>
        .$get()
      </div>

      <button
        onClick={callApi}
        disabled={isLoading}
        className="w-full py-2 px-3 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
      >
        {isLoading ? 'Calling...' : 'Call API'}
      </button>

      {response && (
        <pre className="bg-muted/50 rounded-lg p-3 text-xs overflow-auto max-h-24">{response}</pre>
      )}
    </div>
  )
}
