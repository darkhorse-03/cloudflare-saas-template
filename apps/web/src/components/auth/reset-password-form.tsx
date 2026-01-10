import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { emailOtp, forgetPassword } from '@/lib/auth-client'
import { resetPasswordSchema } from '@/schemas/auth'

interface ResetPasswordFormProps {
  email: string
  onSuccess: () => void
  onBack: () => void
}

export function ResetPasswordForm({ email, onSuccess, onBack }: ResetPasswordFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [isResending, setIsResending] = useState(false)

  const form = useForm({
    defaultValues: {
      email,
      otp: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: async ({ value }) => {
      setIsPending(true)
      setError(null)

      const { error: resetError } = await emailOtp.resetPassword({
        email: value.email,
        otp: value.otp,
        password: value.password,
      })

      if (resetError) {
        toast.error('Failed to reset password', {
          description: resetError.message,
        })
        setError(resetError.message || 'Failed to reset password')
        setIsPending(false)
        return
      }

      toast.success('Password reset successful!', {
        description: 'You can now sign in with your new password.',
      })
      setIsPending(false)
      onSuccess()
    },
  })

  const handleResendCode = async () => {
    setIsResending(true)
    setError(null)

    const { error: resendError } = await forgetPassword.emailOtp({
      email,
    })

    if (resendError) {
      toast.error('Failed to resend code', {
        description: resendError.message,
      })
      setError(resendError.message || 'Failed to resend code')
    } else {
      toast.success('Code resent!', {
        description: `Check your email at ${email}`,
      })
    }

    setIsResending(false)
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
          Enter the 6-digit code sent to <strong>{email}</strong> and your new password.
        </p>
      </div>

      <form.Field
        name="otp"
        validators={{
          onChange: resetPasswordSchema.shape.otp,
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={`reset-${field.name}`}>Verification Code</Label>
            <Input
              autoComplete="one-time-code"
              disabled={isPending}
              id={`reset-${field.name}`}
              inputMode="numeric"
              maxLength={6}
              name={field.name}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value.replace(/\D/g, ''))}
              placeholder="123456"
              type="text"
              value={field.state.value}
            />
            {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
              <p className="text-destructive text-sm" role="alert">
                {field.state.meta.errors.map((error) => String(error)).join(', ')}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="password"
        validators={{
          onChange: resetPasswordSchema.shape.password,
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={`reset-${field.name}`}>New Password</Label>
            <Input
              autoComplete="new-password"
              disabled={isPending}
              id={`reset-${field.name}`}
              name={field.name}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="••••••••"
              type="password"
              value={field.state.value}
            />
            {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
              <p className="text-destructive text-sm" role="alert">
                {field.state.meta.errors.map((error) => String(error)).join(', ')}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="confirmPassword"
        validators={{
          onChangeListenTo: ['password'],
          onChange: ({ value, fieldApi }) => {
            if (value !== fieldApi.form.getFieldValue('password')) {
              return 'Passwords do not match'
            }
            return undefined
          },
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={`reset-${field.name}`}>Confirm Password</Label>
            <Input
              autoComplete="new-password"
              disabled={isPending}
              id={`reset-${field.name}`}
              name={field.name}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="••••••••"
              type="password"
              value={field.state.value}
            />
            {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
              <p className="text-destructive text-sm" role="alert">
                {field.state.meta.errors.map((error) => String(error)).join(', ')}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit]) => (
          <Button className="w-full" disabled={!canSubmit || isPending} type="submit">
            {isPending ? 'Resetting...' : 'Reset Password'}
          </Button>
        )}
      </form.Subscribe>

      <div className="flex items-center justify-between">
        <Button
          className="text-sm"
          disabled={isResending}
          onClick={handleResendCode}
          type="button"
          variant="link"
        >
          {isResending ? 'Sending...' : 'Resend code'}
        </Button>
        <Button className="text-sm" onClick={onBack} type="button" variant="link">
          Back
        </Button>
      </div>
    </form>
  )
}
