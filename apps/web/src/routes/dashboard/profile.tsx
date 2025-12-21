import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'

export const Route = createFileRoute('/dashboard/profile')({
  component: Profile,
})

function Profile() {
  const { user } = useAuth()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Profile</h1>
        <p className="mt-2 text-muted-foreground">Manage your profile information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your personal details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="font-medium text-sm">Name</p>
              <p className="text-gray-500 text-sm">{user?.name}</p>
            </div>
            <div>
              <p className="font-medium text-sm">Email</p>
              <p className="text-gray-500 text-sm">{user?.email}</p>
            </div>
            <div>
              <p className="font-medium text-sm">Email Verified</p>
              <p className="text-gray-500 text-sm">{user?.emailVerified ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
