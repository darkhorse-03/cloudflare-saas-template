import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/use-auth'
import { useAuthDialog } from './auth-dialog'

export function SignUpForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signUp } = useAuth()
  const { closeDialog } = useAuthDialog()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    signUp.mutate(
      { email, password, name },
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
        <Label htmlFor="name">Name</Label>
        <Input
          autoComplete="name"
          disabled={signUp.isPending}
          id="name"
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          required
          type="text"
          value={name}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          autoComplete="email"
          disabled={signUp.isPending}
          id="signup-email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          type="email"
          value={email}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <Input
          autoComplete="new-password"
          disabled={signUp.isPending}
          id="signup-password"
          minLength={8}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          type="password"
          value={password}
        />
        <p className="text-gray-500 text-xs">Must be at least 8 characters</p>
      </div>

      {signUp.error && <p className="text-red-600 text-sm">{signUp.error.message}</p>}

      <Button className="w-full" disabled={signUp.isPending} type="submit">
        {signUp.isPending ? 'Creating account...' : 'Create Account'}
      </Button>
    </form>
  )
}
