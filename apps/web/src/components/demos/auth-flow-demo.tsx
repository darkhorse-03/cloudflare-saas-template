import { Shield } from 'lucide-react'
import { useState } from 'react'
import { SignInForm } from '@/components/auth/sign-in-form'
import { SignUpForm } from '@/components/auth/sign-up-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function AuthFlowDemo() {
  const [showDialog, setShowDialog] = useState(false)
  const [defaultTab, setDefaultTab] = useState<'signin' | 'signup'>('signin')

  const openSignIn = () => {
    setDefaultTab('signin')
    setShowDialog(true)
  }

  const openSignUp = () => {
    setDefaultTab('signup')
    setShowDialog(true)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Shield className="size-5 text-primary" />
              <CardTitle>Authentication (Pre-Built)</CardTitle>
            </div>
            <div className="rounded-full bg-green-500/10 px-3 py-1 font-mono text-green-600 text-xs dark:text-green-400">
              Save 8 hours
            </div>
          </div>
          <CardDescription>
            Try the demo: Login and signup forms with TanStack Form + Zod validation. Better Auth
            integration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Action Buttons */}
          <div className="mb-4 flex flex-wrap gap-3">
            <Button onClick={openSignUp} variant="default">
              Try Sign Up Form
            </Button>
            <Button onClick={openSignIn} variant="outline">
              Try Sign In Form
            </Button>
          </div>

          {/* Features List */}
          <div className="rounded-lg bg-muted/50 p-4">
            <div className="mb-2 font-medium text-sm">What's included:</div>
            <ul className="grid gap-2 text-muted-foreground text-sm sm:grid-cols-2">
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>TanStack Form + Zod validation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Better Auth integration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Session management</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Protected routes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Rate limiting (10 login/min)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Email verification ready</span>
              </li>
            </ul>
          </div>

          {/* Tagline */}
          <div className="mt-4 text-center text-muted-foreground text-sm italic">
            "This alone saves 8 hours of research and setup"
          </div>
        </CardContent>
      </Card>

      {/* Auth Dialog */}
      <Dialog onOpenChange={setShowDialog} open={showDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Welcome</DialogTitle>
            <DialogDescription>Sign in to your account or create a new one</DialogDescription>
          </DialogHeader>

          <Tabs
            className="w-full"
            defaultValue={defaultTab}
            onValueChange={(v) => setDefaultTab(v as 'signin' | 'signup')}
            value={defaultTab}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent className="mt-4" value="signin">
              <SignInForm />
            </TabsContent>

            <TabsContent className="mt-4" value="signup">
              <SignUpForm />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  )
}
