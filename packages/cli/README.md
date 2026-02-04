# create-zynth-app

Scaffold a production-ready fullstack SaaS app on Cloudflare Workers in seconds.

## Quick Start

```bash
bunx create-zynth-app
```

Or with a project name:

```bash
bunx create-zynth-app my-app
```

## What You Get

- **Hono API** on Cloudflare Workers with type-safe RPC
- **React + TanStack Router** frontend on Cloudflare Pages
- **Drizzle ORM + D1** (SQLite) database with migrations
- **Better Auth** with email/password, magic link, Google & GitHub OAuth
- **shadcn/ui + Tailwind CSS** component library
- **Turborepo** monorepo with Bun
- **Claude Code** optimized with commands and project context

## CLI Options

The interactive setup walks you through:

| Option | Description |
|---|---|
| Project name | Directory name for your app |
| Description | App description (updates config) |
| Tagline | Marketing tagline |
| Production URL | Your domain for SEO/OG tags |
| GitHub URL | Repository link for footer/social |
| Twitter handle | Social link |
| Magic link auth | Enable passwordless login |
| Google OAuth | Enable Google sign-in |
| GitHub OAuth | Enable GitHub sign-in |
| Init git | Initialize a git repository |
| Install deps | Run `bun install` automatically |

## After Setup

```bash
cd my-app
bun dev
```

This starts both the API and frontend dev servers.

## Requirements

- [Bun](https://bun.sh) v1.0+
- [Cloudflare account](https://dash.cloudflare.com) (for deployment)

## Links

- [GitHub](https://github.com/darkhorse-03/cloudflare-saas-template)
- [Documentation](https://github.com/darkhorse-03/cloudflare-saas-template#readme)

## License

MIT
