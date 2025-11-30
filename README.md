# underdog

Fullstack Cloudflare Workers template with service bindings.

```
Browser → 🌐 Web Worker → ⚡ Service Binding → 🔮 API Worker
```

No public API URL. Zero network latency. Type-safe end-to-end.

## ✨ Stack

| | Tool | Purpose |
|---|---|---|
| 🔥 | **Hono** | Type-safe RPC |
| 🧭 | **TanStack Router** | File-based routing |
| 📦 | **React Query** | Smart caching |
| ☁️ | **Alchemy** | One-command deploy |
| ⚡ | **Biome** | Fast lint & format |
| 🚀 | **Turborepo** | Monorepo tasks |

## 📁 Structure

```
apps/
  api/     → Hono API (Cloudflare Worker)
  web/     → React SPA (Cloudflare Pages)
```

## 🛠️ Commands

```bash
bun install      # Install dependencies
bun run dev      # Start dev servers
bun run deploy   # Deploy to Cloudflare
bun run check    # Lint & format
```

## 🚀 Deploy

```bash
bun run deploy
```

That's it. Alchemy handles the rest.
