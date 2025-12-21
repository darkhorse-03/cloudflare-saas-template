import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/use-auth'
import { signInSchema } from '@/schemas/auth'
import { useAuthDialog } from './auth-dialog'

export function SignInForm() {
  const { signIn } = useAuth()
  const { closeDialog } = useAuthDialog()
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      await signIn.mutateAsync(value)
      closeDialog()
      navigate({ to: '/dashboard' })
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
        name="email"
        validators={{
          onChange: signInSchema.shape.email,
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Email</Label>
            <Input
              autoComplete="email"
              disabled={signIn.isPending}
              id={field.name}
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
          onChange: signInSchema.shape.password,
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Password</Label>
            <Input
              autoComplete="current-password"
              disabled={signIn.isPending}
              id={field.name}
              name={field.name}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="••••••••"
              type="password"
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

      {signIn.error && <p className="text-destructive text-sm">{signIn.error.message}</p>}

      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <Button className="w-full" disabled={!canSubmit || signIn.isPending} type="submit">
            {isSubmitting || signIn.isPending ? 'Signing in...' : 'Sign In'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
