import { useForm } from '@tanstack/react-form'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signIn } from '@/lib/auth-client'
import { magicLinkSchema } from '@/schemas/auth'
import { Turnstile, type TurnstileRef, useTurnstileEnabled } from './turnstile'

interface MagicLinkFormProps {
  onBack: () => void
}

export function MagicLinkForm({ onBack }: MagicLinkFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [sentEmail, setSentEmail] = useState('')
  const turnstileRef = useRef<TurnstileRef>(null)
  const turnstileEnabled = useTurnstileEnabled()

  const form = useForm({
    defaultValues: {
      email: '',
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

      const { error: sendError } = await signIn.magicLink(
        {
          email: value.email,
          callbackURL: '/dashboard',
        },
        captchaToken
          ? {
              headers: {
                'x-captcha-response': captchaToken,
              },
            }
          : undefined,
      )

      if (sendError) {
        toast.error('Failed to send magic link', {
          description: sendError.message,
        })
        setError(sendError.message || 'Failed to send magic link')
        turnstileRef.current?.reset()
        setIsPending(false)
        return
      }

      toast.success('Magic link sent!', {
        description: `Check your email at ${value.email}`,
      })
      setIsPending(false)
      setSentEmail(value.email)
      setIsSuccess(true)
    },
  })

  if (isSuccess) {
    return (
      <div className="space-y-4 text-center">
        <div className="bg-muted mx-auto flex h-12 w-12 items-center justify-center rounded-full">
          <svg
            className="text-primary h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-label="Check your email"
            role="img"
          >
            <path
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">Check your email</h3>
          <p className="text-muted-foreground text-sm">
            We've sent a magic link to <strong>{sentEmail}</strong>. Click the link in the email to
            sign in.
          </p>
        </div>
        <Button className="w-full" onClick={onBack} variant="outline">
          Back to Sign In
        </Button>
      </div>
    )
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <div className="space-y-2 text-center">
        <p className="text-muted-foreground text-sm">
          Enter your email address and we'll send you a link to sign in.
        </p>
      </div>

      <form.Field
        name="email"
        validators={{
          onChange: magicLinkSchema.shape.email,
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={`magic-${field.name}`}>Email</Label>
            <Input
              autoComplete="email"
              disabled={isPending}
              id={`magic-${field.name}`}
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

      {error && <p className="text-destructive text-sm">{error}</p>}

      <Turnstile ref={turnstileRef} />

      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit]) => (
          <Button className="w-full" disabled={!canSubmit || isPending} type="submit">
            {isPending ? 'Sending...' : 'Send Magic Link'}
          </Button>
        )}
      </form.Subscribe>

      <Button className="w-full" onClick={onBack} type="button" variant="ghost">
        Back to Sign In
      </Button>
    </form>
  )
}
