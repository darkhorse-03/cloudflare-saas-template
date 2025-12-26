import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signUp } from '@/lib/auth-client'
import { signUpSchema } from '@/schemas/auth'

export function SignUpForm() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      setIsPending(true)
      setError(null)

      const { error: signUpError } = await signUp.email({
        email: value.email,
        password: value.password,
        name: value.name,
      })

      if (signUpError) {
        setError(signUpError.message || 'Failed to sign up')
        setIsPending(false)
        return
      }

      toast.success('Account created! Please check your email to verify your account.', {
        duration: 10_000,
        description: `We sent a verification link to ${value.email}`,
        icon: '📧',
      })

      setIsPending(false)
    },
  })

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <form.Field
        name="name"
        validators={{
          onChange: signUpSchema.shape.name,
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={`signup-${field.name}`}>Name</Label>
            <Input
              autoComplete="name"
              disabled={isPending}
              id={`signup-${field.name}`}
              name={field.name}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="John Doe"
              type="text"
              value={field.state.value}
            />
            {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
              <p className="text-destructive text-sm" role="alert">
                {field.state.meta.errors.map((error) => error?.message).join(', ')}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="email"
        validators={{
          onChange: signUpSchema.shape.email,
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={`signup-${field.name}`}>Email</Label>
            <Input
              autoComplete="email"
              disabled={isPending}
              id={`signup-${field.name}`}
              name={field.name}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="you@example.com"
              type="email"
              value={field.state.value}
            />
            {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
              <p className="text-destructive text-sm" role="alert">
                {field.state.meta.errors.map((error) => error?.message).join(', ')}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="password"
        validators={{
          onChange: signUpSchema.shape.password,
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={`signup-${field.name}`}>Password</Label>
            <Input
              autoComplete="new-password"
              disabled={isPending}
              id={`signup-${field.name}`}
              name={field.name}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="••••••••"
              type="password"
              value={field.state.value}
            />
            {field.state.meta.isTouched && field.state.meta.errors.length > 0 ? (
              <p className="text-destructive text-sm" role="alert">
                {field.state.meta.errors.map((error) => error?.message).join(', ')}
              </p>
            ) : (
              <p className="text-muted-foreground text-xs">Must be at least 8 characters</p>
            )}
          </div>
        )}
      </form.Field>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit]) => (
          <Button className="w-full" disabled={!canSubmit || isPending} type="submit">
            {isPending ? 'Creating account...' : 'Create Account'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
