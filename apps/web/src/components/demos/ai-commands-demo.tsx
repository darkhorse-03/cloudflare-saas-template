import { Terminal } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function AICommandsDemo() {
  const commands = [
    {
      id: 'new-api',
      label: 'New API Route',
      command: '/new-api users',
      description: 'Scaffold a complete API route with type-safe endpoints',
      output: `✓ Created apps/api/src/routes/users.ts
✓ Added GET /users endpoint
✓ Added POST /users endpoint
✓ Types exported for frontend
✓ Validation schemas ready`,
      timeSaved: '20 min',
    },
    {
      id: 'new-route',
      label: 'New Page Route',
      command: '/new-route dashboard',
      description: 'Create a new page with routing, layout, and navigation',
      output: `✓ Created apps/web/src/routes/dashboard.tsx
✓ Added to TanStack Router
✓ Layout component included
✓ Navigation link added
✓ Type-safe routes updated`,
      timeSaved: '15 min',
    },
    {
      id: 'new-component',
      label: 'New Component',
      command: '/new-component user-profile',
      description: 'Generate a component with TypeScript and proper imports',
      output: `✓ Created apps/web/src/components/user-profile.tsx
✓ TypeScript interfaces added
✓ Props validated
✓ Import paths configured
✓ Ready to use`,
      timeSaved: '10 min',
    },
    {
      id: 'new-form',
      label: 'New Form',
      command: '/new-form contact-form',
      description: 'Build a form with TanStack Form + Zod validation',
      output: `✓ Created apps/web/src/components/contact-form.tsx
✓ TanStack Form configured
✓ Zod validation schema ready
✓ Error handling included
✓ Type-safe submission`,
      timeSaved: '25 min',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="size-5 text-primary" />
            <CardTitle>AI Commands (Claude Code)</CardTitle>
          </div>
          <div className="rounded-full bg-green-500/10 px-3 py-1 font-mono text-green-600 text-xs dark:text-green-400">
            Save 70+ min/day
          </div>
        </div>
        <CardDescription>
          Pre-built AI commands for instant scaffolding. Type a command, get production-ready code.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs className="w-full" defaultValue="new-api">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            {commands.map((cmd) => (
              <TabsTrigger className="text-xs" key={cmd.id} value={cmd.id}>
                {cmd.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {commands.map((cmd) => (
            <TabsContent className="mt-4" key={cmd.id} value={cmd.id}>
              <div className="space-y-3">
                {/* Command */}
                <div className="rounded-lg bg-black p-3 font-mono text-green-400 text-sm">
                  <span className="text-gray-500">$</span> {cmd.command}
                </div>

                {/* Description */}
                <p className="text-muted-foreground text-sm">{cmd.description}</p>

                {/* Output */}
                <div className="rounded-lg bg-muted p-3 font-mono text-xs">
                  <div className="whitespace-pre-line text-muted-foreground">{cmd.output}</div>
                </div>

                {/* Time Saved */}
                <div className="flex items-center justify-between rounded-lg bg-green-500/10 p-2 text-sm">
                  <span className="text-muted-foreground">Time saved vs manual setup:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    ~{cmd.timeSaved}
                  </span>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* What's Included */}
        <div className="mt-6 rounded-lg bg-muted/50 p-4">
          <div className="mb-2 font-medium text-sm">Why AI commands matter:</div>
          <ul className="grid gap-2 text-muted-foreground text-sm sm:grid-cols-2">
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Instant scaffolding (no boilerplate copy-paste)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Type-safe by default (auto-generates types)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Follows project conventions (no style conflicts)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Production-ready code (not just templates)</span>
            </li>
          </ul>
        </div>

        {/* Tagline */}
        <div className="mt-4 text-center text-muted-foreground text-sm italic">
          "Claude Code knows your codebase structure. Just ask."
        </div>
      </CardContent>
    </Card>
  )
}
