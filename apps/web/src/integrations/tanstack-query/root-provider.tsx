import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Prevent refetching when switching tabs (better UX, less API calls)
        refetchOnWindowFocus: false,
        // Prevent refetching when component remounts
        refetchOnMount: false,
        // Prevent refetching on network reconnect (can be annoying during dev)
        refetchOnReconnect: false,
        // Keep data fresh for 5 minutes
        staleTime: 300_000, // 5 * 60 * 1000
        // Cache data for 10 minutes (longer than staleTime)
        gcTime: 600_000, // 10 * 60 * 1000
        // Retry failed requests once (good for transient errors)
        retry: 1,
      },
    },
  })
  return {
    queryClient,
  }
}

export function Provider({
  children,
  queryClient,
}: {
  children: React.ReactNode
  queryClient: QueryClient
}) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
