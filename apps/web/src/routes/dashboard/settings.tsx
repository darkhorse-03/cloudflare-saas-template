import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { usePreferences } from '@/hooks/demo/use-preferences'
import { type Theme, useTheme } from '@/hooks/use-theme'

export const Route = createFileRoute('/dashboard/settings')({
  component: Settings,
})

function Settings() {
  const { preferences, isLoading, updatePreferences } = usePreferences()
  const { theme, setTheme } = useTheme()

  const handleUpdate = (updates: Parameters<typeof updatePreferences.mutate>[0]) => {
    updatePreferences.mutate(updates, {
      onSuccess: () => {
        toast.success('Settings updated successfully')
      },
      onError: () => {
        toast.error('Failed to update settings')
      },
    })
  }

  const handleThemeChange = (value: Theme) => {
    // Apply theme immediately
    setTheme(value)
    // Also save to database for persistence across devices
    handleUpdate({ theme: value })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Settings</h1>
          <p className="mt-2 text-muted-foreground">Manage your account settings</p>
        </div>
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-4 w-56" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-52" />
                </div>
                <Skeleton className="h-6 w-11 rounded-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Settings</h1>
        <p className="mt-2 text-muted-foreground">Manage your account settings</p>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how the app looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select value={theme} onValueChange={(value) => handleThemeChange(value as Theme)}>
                <SelectTrigger id="theme">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-muted-foreground text-xs">
                Select the theme for the dashboard interface
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select
                value={preferences?.language ?? 'en'}
                onValueChange={(value) => handleUpdate({ language: value })}
              >
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-muted-foreground text-xs">
                Select your preferred language (2-letter ISO code)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Enable Notifications</Label>
                <p className="text-muted-foreground text-xs">
                  Receive notifications about updates and activity
                </p>
              </div>
              <Switch
                id="notifications"
                checked={preferences?.notifications ?? true}
                onCheckedChange={(checked) => handleUpdate({ notifications: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
            <CardDescription>Demo settings implementation</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              This is a working demo of user preferences stored in the database. Replace these
              fields with your own settings when building your app.
            </p>
            {preferences && (
              <div className="mt-4 rounded-lg bg-muted p-3">
                <p className="font-mono text-xs">
                  Last updated: {new Date(preferences.updatedAt).toLocaleString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
