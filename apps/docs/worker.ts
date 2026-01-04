interface Env {
  ASSETS: Fetcher
}

const DOCS_PREFIX_REGEX = /^\/docs/

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    // Handle __tsr cache requests directly (TanStack Start basepath workaround)
    // These requests come without /docs prefix due to TanStack Start bug
    if (url.pathname.startsWith('/__tsr')) {
      return env.ASSETS.fetch(new Request(url, request))
    }

    // Strip /docs prefix from path for asset lookup
    if (url.pathname.startsWith('/docs')) {
      url.pathname = url.pathname.replace(DOCS_PREFIX_REGEX, '') || '/'
    }

    // Rewrite /api/search to /api/search.json for static file
    if (url.pathname === '/api/search') {
      url.pathname = '/api/search.json'
    }

    const response = await env.ASSETS.fetch(new Request(url, request))

    // Fix redirects to preserve /docs prefix
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location')
      if (location && !location.startsWith('/docs') && !location.startsWith('http')) {
        const newHeaders = new Headers(response.headers)
        newHeaders.set('location', `/docs${location}`)
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: newHeaders,
        })
      }
    }

    return response
  },
} satisfies ExportedHandler<Env>
