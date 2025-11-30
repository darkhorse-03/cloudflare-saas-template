interface Env {
  api: Fetcher
  ASSETS: Fetcher
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    // Proxy all /api/* requests to api via service binding
    if (url.pathname.startsWith('/api/')) {
      // Strip /api prefix before forwarding to api service
      const apiUrl = new URL(request.url)
      apiUrl.pathname = url.pathname.replace(/^\/api/, '')
      return env.api.fetch(new Request(apiUrl, request))
    }

    // Serve static assets for all other requests
    return env.ASSETS.fetch(request)
  },
} satisfies ExportedHandler<Env>
