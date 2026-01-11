import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/dashboard/analytics')({
  component: Analytics,
})

function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Analytics</h1>
        <p className="mt-2 text-muted-foreground">View your analytics and metrics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Page Views</CardTitle>
            <CardDescription>Total page views this month</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">Analytics data will appear here</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
            <CardDescription>Currently active users</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">User data will appear here</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Rate</CardTitle>
            <CardDescription>This month's conversion rate</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">Conversion data will appear here</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
