import { useForm } from '@tanstack/react-form'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authClient, signIn, useSession } from '@/lib/auth-client'
import { signInSchema } from '@/schemas/auth'
import { useAuthDialog } from './auth-dialog'
import { Turnstile, type TurnstileRef, useTurnstileEnabled } from './turnstile'

interface SignInFormProps {
  onForgotPassword?: () => void
  onMagicLink?: () => void
}

export function SignInForm({ onForgotPassword, onMagicLink }: SignInFormProps) {
  const { closeDialog } = useAuthDialog()
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const turnstileRef = useRef<TurnstileRef>(null)
  const turnstileEnabled = useTurnstileEnabled()

  const navigate = useNavigate()
  const router = useRouter()
  const session = useSession()
  const lastMethod = authClient.getLastUsedLoginMethod()
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      setIsPending(true)
      setError(null)

      // Get captcha token if Turnstile is enabled
      const captchaToken = turnstileRef.current?.getToken()
      if (turnstileEnabled && !captchaToken) {
        setError('Please complete the captcha verification')
        setIsPending(false)
        return
      }

      const { data, error: signInError } = await signIn.email(
        {
          email: value.email,
          password: value.password,
        },
        captchaToken
          ? {
              headers: {
                'x-captcha-response': captchaToken,
              },
            }
          : undefined,
      )

      if (signInError) {
        setError(signInError.message || 'Failed to sign in')
        turnstileRef.current?.reset()
        setIsPending(false)
        return
      }

      if (data) {
        closeDialog()
        await session.refetch()
        await router.invalidate()
        navigate({ to: '/dashboard' })
      }

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
        name="email"
        validators={{
          onChange: signInSchema.shape.email,
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={`signin-${field.name}`}>Email</Label>
            <Input
              autoComplete="email"
              disabled={isPending}
              id={`signin-${field.name}`}
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
            <Label htmlFor={`signin-${field.name}`}>Password</Label>
            <Input
              autoComplete="current-password"
              disabled={isPending}
              id={`signin-${field.name}`}
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

      {error && <p className="text-destructive text-sm">{error}</p>}

      <Turnstile ref={turnstileRef} />

      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit]) => (
          <div className="relative">
            <Button className="w-full" disabled={!canSubmit || isPending} type="submit">
              {isPending ? 'Signing in...' : 'Sign In'}
            </Button>
            {lastMethod === 'email' && (
              <Badge className="absolute -top-2 -right-2" variant="secondary">
                Last used
              </Badge>
            )}
          </div>
        )}
      </form.Subscribe>

      <div className="flex items-center justify-between">
        {onForgotPassword && (
          <Button
            className="h-auto p-0 text-sm"
            onClick={onForgotPassword}
            type="button"
            variant="link"
          >
            Forgot password?
          </Button>
        )}
        {onMagicLink && (
          <div className="relative">
            <Button
              className="h-auto p-0 text-sm"
              onClick={onMagicLink}
              type="button"
              variant="link"
            >
              Sign in with magic link
            </Button>
            {lastMethod === 'magic-link' && (
              <Badge className="absolute -top-2 -right-12" variant="secondary">
                Last used
              </Badge>
            )}
          </div>
        )}
      </div>
    </form>
  )
}
