import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { FEATURE_CATALOG } from '../scaffold/features.js'
import type { FeatureName } from '../types.js'

/**
 * Write bootstrap context files to ALL agent formats.
 * These guide the agent through the scaffolding conversation.
 * After scaffolding, they get replaced with project-specific docs.
 */
export function writeBootstrapContext(projectDir: string, projectName: string): void {
  const prompt = generateBootstrapPrompt(projectName)

  // Claude Code
  mkdirSync(join(projectDir, '.claude'), { recursive: true })
  writeFileSync(join(projectDir, '.claude', 'CLAUDE.md'), prompt)

  // Cursor
  mkdirSync(join(projectDir, '.cursor', 'rules'), { recursive: true })
  writeFileSync(
    join(projectDir, '.cursor', 'rules', 'bootstrap.mdc'),
    `---\ndescription: Zynth project setup — guides initial scaffolding\nalwaysApply: true\n---\n\n${prompt}`,
  )

  // Codex
  writeFileSync(join(projectDir, 'AGENTS.md'), prompt)

  // Windsurf
  writeFileSync(join(projectDir, '.windsurfrules'), prompt)

  // Copilot
  mkdirSync(join(projectDir, '.github'), { recursive: true })
  writeFileSync(join(projectDir, '.github', 'copilot-instructions.md'), prompt)
}

function generateBootstrapPrompt(projectName: string): string {
  const featureList = Object.values(FEATURE_CATALOG)
    .map(
      (f) =>
        `- **${f.name}** — ${f.description}\n  _Recommend when:_ ${f.use_when}${f.env_vars.length > 0 ? `\n  _Env vars:_ ${f.env_vars.map((e) => e.name).join(', ')}` : ''}`,
    )
    .join('\n')

  const validNames = Object.keys(FEATURE_CATALOG).join(', ')

  return `# Zynth — Project Setup

You are setting up a new project called "${projectName}" in this directory.
This directory is currently empty — your job is to scaffold it.

## Your Workflow

### Step 1: Understand
Ask the user what they're building. Keep it short — one question is usually enough.

### Step 2: Recommend Features
Based on their description, recommend which features to include from the catalog below.
Be opinionated — explain WHY each feature is included or skipped (one sentence each).
Let the user adjust before proceeding.

### Step 3: Scaffold
Once agreed, run this command with the selected features:

\`\`\`bash
bunx create-zynth-app@latest --scaffold --name ${projectName} --features <comma-separated-list> --dir .
\`\`\`

Valid feature names: ${validNames}

**IMPORTANT:** Do NOT create project files manually. The scaffold command handles everything deterministically.

### Step 4: Environment Setup
After scaffolding completes:
1. Read the updated project docs (\`.claude/CLAUDE.md\` or equivalent) — they replace this file
2. Create \`.env\` from \`.env.example\` and guide the user through getting each API key
3. Run \`bun install\`
4. Run \`bun dev\` to start the dev server

### Step 5: Build
The scaffolded project has full documentation. Read it and help the user build their app.

## Feature Catalog

### Always Included (Core)
- **Authentication** — Better Auth with email/password and session management
- **Database** — Drizzle ORM + Cloudflare D1 (SQLite)
- **Type-safe API** — Hono RPC with end-to-end type safety
- **Rate Limiting** — Tiered, per-route rate limiting
- **UI** — Tailwind CSS + shadcn/ui component library
- **Dashboard** — Authenticated sidebar layout with profile/settings

### Optional Features

${featureList}

### Feature Recommendations
- If **email** is selected, recommend **jobs** too (async email delivery)
- If **payments** is selected, recommend **email** too (receipts/notifications)
- If **workflows** is selected, recommend **jobs** and **email** too
`
}
