import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/dashboard/settings')({
  component: Settings,
})

function Settings() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Settings</h1>
        <p className="mt-2 text-muted-foreground">Manage your account settings</p>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Update your account preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-sm">Account settings will appear here</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-sm">Notification settings will appear here</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
