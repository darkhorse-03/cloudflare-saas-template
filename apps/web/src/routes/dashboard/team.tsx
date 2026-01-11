import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/dashboard/team')({
  component: Team,
})

function Team() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Team</h1>
        <p className="mt-2 text-muted-foreground">Manage your team members</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>View and manage team member access</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Team member list will appear here</p>
        </CardContent>
      </Card>
    </div>
  )
}
