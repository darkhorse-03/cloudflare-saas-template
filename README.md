<div align="center">

# underdog

**Fullstack Cloudflare Workers template with service bindings**

[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Hono](https://img.shields.io/badge/Hono-E36002?logo=hono&logoColor=white)](https://hono.dev/)
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

[Live Demo](https://underdog.sarimahmed.net) · [Getting Started](#-getting-started) · [Stack](#-stack)

![](docs/screenshot.png)

</div>

---

```
Browser → Web Worker ⚡ Service Binding ⚡ API Worker
```

No public API URL. Zero network latency. Type-safe end-to-end.

## 🚀 Getting Started

1. Click **"Use this template"** → **"Create a new repository"**
2. Clone your new repo
3. Install dependencies and start dev server:

```bash
bun install
bun run dev
```

4. Update the project name in:
   - `package.json` → `name`
   - `apps/api/alchemy.run.ts` → app name and worker name
   - `apps/web/alchemy.run.ts` → app name, worker name, and `domains`

5. Clean up boilerplate:
   - Delete `docs/` folder (screenshot)
   - Replace demo components in `apps/web/src/components/`
   - Replace demo routes in `apps/web/src/routes/`
   - Update API routes in `apps/api/src/index.ts`

6. Deploy to Cloudflare:

```bash
bun run deploy
```

## 📦 Stack

| Tool | Purpose |
|---|---|
| **Hono** | Type-safe RPC |
| **TanStack Router** | File-based routing |
| **React Query** | Smart caching |
| **shadcn/ui** | UI components |
| **Alchemy** | One-command deploy |
| **Biome** | Fast lint & format |
| **Turborepo** | Monorepo tasks |

## 📁 Structure

```
apps/
  api/     → Hono API (Cloudflare Worker)
  web/     → React SPA (Cloudflare Pages)
```

## 🛠 Commands

```bash
bun run dev      # Start dev servers
bun run deploy   # Deploy to Cloudflare
bun run check    # Lint & format
```

## 🔜 Roadmap

- **Better Auth** - Authentication
- **Drizzle + D1** - Database
- **Resend** - Emails
