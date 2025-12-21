import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/use-auth'
import { useAuthDialog } from './auth-dialog'

export function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signIn } = useAuth()
  const { closeDialog } = useAuthDialog()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    signIn.mutate(
      { email, password },
      {
        onSuccess: () => {
          closeDialog()
        },
      },
    )
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          disabled={signIn.isPending}
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          type="email"
          value={email}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          disabled={signIn.isPending}
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          type="password"
          value={password}
        />
      </div>

      {signIn.error && <p className="text-red-600 text-sm">{signIn.error.message}</p>}

      <Button className="w-full" disabled={signIn.isPending} type="submit">
        {signIn.isPending ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  )
}
