import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/use-auth'
import { signUpSchema } from '@/schemas/auth'
import { useAuthDialog } from './auth-dialog'

export function SignUpForm() {
  const { signUp } = useAuth()
  const { closeDialog } = useAuthDialog()
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      await signUp.mutateAsync(value)
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
        name="name"
        validators={{
          onChange: signUpSchema.shape.name,
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Name</Label>
            <Input
              autoComplete="name"
              disabled={signUp.isPending}
              id={field.name}
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
            <Label htmlFor={field.name}>Email</Label>
            <Input
              autoComplete="email"
              disabled={signUp.isPending}
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
          onChange: signUpSchema.shape.password,
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Password</Label>
            <Input
              autoComplete="new-password"
              disabled={signUp.isPending}
              id={field.name}
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

      {signUp.error && <p className="text-destructive text-sm">{signUp.error.message}</p>}

      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <Button className="w-full" disabled={!canSubmit || signUp.isPending} type="submit">
            {isSubmitting || signUp.isPending ? 'Creating account...' : 'Create Account'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
