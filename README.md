<div align="center">

# underdog

**Fullstack Cloudflare Workers template with service bindings**

[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Hono](https://img.shields.io/badge/Hono-E36002?logo=hono&logoColor=white)](https://hono.dev/)
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

[Live Demo](https://underdog.sarimahmed.net) · [Getting Started](#-getting-started) · [Stack](#-stack)

![](docs/screenshot.png)

```
Browser → Web Worker ⚡ Service Binding ⚡ API Worker
```

✓ No public API URL &nbsp;&nbsp; ✓ Zero network latency &nbsp;&nbsp; ✓ Type-safe end-to-end

</div>

---

## 🚀 Getting Started

```bash
# 1. Use this template on GitHub, then clone your repo

# 2. Install & run
bun install
bun run dev
```

**Configure your project:**

| File | What to change |
|------|----------------|
| `package.json` | `name` |
| `apps/api/alchemy.run.ts` | App name, worker name |
| `apps/web/alchemy.run.ts` | App name, worker name, `domains` |

**Clean up boilerplate:**

Remove `docs/`, demo components in `apps/web/src/components/`, demo routes, and sample API endpoints.

**Deploy:**

```bash
bun run deploy
```

---

## 📦 Stack

| Tool | Purpose |
|------|---------|
| [Hono](https://hono.dev) | Type-safe RPC |
| [TanStack Router](https://tanstack.com/router) | File-based routing |
| [React Query](https://tanstack.com/query) | Smart caching |
| [shadcn/ui](https://ui.shadcn.com) | UI components |
| [Alchemy](https://alchemy.run) | One-command deploy |
| [Biome](https://biomejs.dev) | Fast lint & format |
| [Turborepo](https://turbo.build) | Monorepo tasks |

---

## 📁 Structure

```
apps/
  api/   →  Hono API (Cloudflare Worker)
  web/   →  React SPA (Cloudflare Pages)
```

---

## 🛠 Commands

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev servers |
| `bun run deploy` | Deploy to Cloudflare |
| `bun run check` | Lint & format |

---

## 🔜 Roadmap

| Feature | Status |
|---------|--------|
| Better Auth | Planned |
| Drizzle + D1 | Planned |
| Resend | Planned |
