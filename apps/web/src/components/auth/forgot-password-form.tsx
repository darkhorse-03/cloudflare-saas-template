import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { forgetPassword } from '@/lib/auth-client'
import { forgotPasswordSchema } from '@/schemas/auth'

interface ForgotPasswordFormProps {
  onSuccess: (email: string) => void
  onBack: () => void
}

export function ForgotPasswordForm({ onSuccess, onBack }: ForgotPasswordFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  const form = useForm({
    defaultValues: {
      email: '',
    },
    onSubmit: async ({ value }) => {
      setIsPending(true)
      setError(null)

      const { error: sendError } = await forgetPassword.emailOtp({
        email: value.email,
      })

      if (sendError) {
        toast.error('Failed to send reset code', {
          description: sendError.message,
        })
        setError(sendError.message || 'Failed to send reset code')
        setIsPending(false)
        return
      }

      toast.success('Reset code sent!', {
        description: `Check your email at ${value.email}`,
      })
      setIsPending(false)
      onSuccess(value.email)
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
      <div className="space-y-2 text-center">
        <p className="text-muted-foreground text-sm">
          Enter your email address and we'll send you a code to reset your password.
        </p>
      </div>

      <form.Field
        name="email"
        validators={{
          onChange: forgotPasswordSchema.shape.email,
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={`forgot-${field.name}`}>Email</Label>
            <Input
              autoComplete="email"
              disabled={isPending}
              id={`forgot-${field.name}`}
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

      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit]) => (
          <Button className="w-full" disabled={!canSubmit || isPending} type="submit">
            {isPending ? 'Sending...' : 'Send Reset Code'}
          </Button>
        )}
      </form.Subscribe>

      <Button className="w-full" onClick={onBack} type="button" variant="ghost">
        Back to Sign In
      </Button>
    </form>
  )
}
