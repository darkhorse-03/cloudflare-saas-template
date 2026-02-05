<div align="center">

# Zynth

**Ship your SaaS this weekend, not next quarter.**

[![npm](https://img.shields.io/npm/v/create-zynth-app?color=cb3837&label=create-zynth-app)](https://www.npmjs.com/package/create-zynth-app)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

[Quick Start](#-quick-start) · [Features](#-features) · [Stack](#-stack) · [Documentation](#-documentation)

</div>

---

## ⚡ Quick Start

```bash
bunx create-zynth-app my-app
cd my-app
bun dev
```

That's it. Auth, database, and API are ready.

---

## ✨ Features

### Core
- **Type-safe API** — Hono RPC, no manual fetch calls
- **Authentication** — Email/password, magic link, Google & GitHub OAuth
- **Database** — Drizzle ORM + Cloudflare D1 (SQLite)
- **UI Components** — shadcn/ui + Tailwind CSS

### Infrastructure
- **Edge-first** — Deploys to 300+ Cloudflare locations
- **Service bindings** — Zero-latency worker-to-worker calls
- **Background jobs** — Queues + cron triggers
- **File storage** — R2 object storage with upload API

### Optional Integrations
- **Payments** — Polar.sh subscription billing
- **Email** — Resend transactional emails
- **Bot protection** — Cloudflare Turnstile

### Developer Experience
- **One-command deploy** — `bun deploy` via Alchemy
- **Claude Code optimized** — Project context + slash commands
- **Pre-commit hooks** — Auto-format with Biome

---

## 📦 Stack

| Layer | Technology |
|-------|------------|
| **API** | [Hono](https://hono.dev) on Cloudflare Workers |
| **Frontend** | [React 19](https://react.dev) + [TanStack Router](https://tanstack.com/router) |
| **Database** | [Drizzle ORM](https://orm.drizzle.team) + [Cloudflare D1](https://developers.cloudflare.com/d1) |
| **Auth** | [Better Auth](https://better-auth.com) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) |
| **Deploy** | [Alchemy](https://alchemy.run) (infrastructure-as-code) |
| **Monorepo** | [Turborepo](https://turbo.build) + [Bun](https://bun.sh) |

---

## 📁 Project Structure

```
├── apps/
│   ├── api/          # Hono API (Cloudflare Worker)
│   │   ├── src/
│   │   │   ├── routes/       # API endpoints
│   │   │   ├── db/           # Database schema
│   │   │   ├── auth/         # Auth configuration
│   │   │   └── jobs/         # Background job handlers
│   │   └── drizzle/          # Migrations
│   └── web/          # React frontend (Cloudflare Pages)
│       └── src/
│           ├── routes/       # Pages (file-based routing)
│           ├── components/   # React components
│           └── hooks/        # React Query hooks
├── packages/
│   ├── config/       # Shared configuration
│   └── shared/       # Shared types & validation
```

---

## 🛠 Commands

```bash
bun dev              # Start dev servers
bun deploy           # Deploy to Cloudflare
bun run build        # Build for production
```

---

## ⚙️ Configuration

After scaffolding, edit `.env` with your credentials:

```bash
# Required for local dev
ALCHEMY_PASSWORD=any-string-for-dev

# Required for deployment
CLOUDFLARE_API_TOKEN=
CLOUDFLARE_ZONE_ID=

# Optional: enables email features
RESEND_API_KEY=
FROM_EMAIL=
```

Update `packages/config/src/index.ts` for your app:
- `appName` — Your app name
- `domains.web` — Your production domain (for deployment)

---

## 📖 Documentation

- [Getting Started Guide](https://github.com/darkhorse-03/cloudflare-saas-template/wiki)
- [API Routes](./apps/api/src/routes/)
- [Database Schema](./apps/api/src/db/schema/)

---

## 🚀 Deploy

```bash
# Set environment variables
export CLOUDFLARE_API_TOKEN=your-token
export CLOUDFLARE_ZONE_ID=your-zone-id
export ALCHEMY_PASSWORD=secure-password

# Deploy
bun deploy
```

Your app will be live on your configured domain.

---

## 📄 License

MIT

---

<div align="center">

**[Create your app now](https://www.npmjs.com/package/create-zynth-app)** · Built for indie hackers who ship fast

</div>
