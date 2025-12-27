import { useForm } from '@tanstack/react-form'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { emailOtp, forgetPassword } from '@/lib/auth-client'
import { forgotPasswordSchema, resetPasswordSchema } from '@/schemas/auth'

const searchSchema = z.object({
  email: z.string().optional(),
})

export const Route = createFileRoute('/reset-password')({
  validateSearch: searchSchema,
  component: ResetPasswordPage,
})

function ResetPasswordPage() {
  const { email: initialEmail } = Route.useSearch()
  const navigate = useNavigate()
  const [step, setStep] = useState<'request' | 'reset' | 'success'>(
    initialEmail ? 'reset' : 'request',
  )
  const [email, setEmail] = useState(initialEmail || '')
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [isResending, setIsResending] = useState(false)

  const requestForm = useForm({
    defaultValues: { email: '' },
    onSubmit: async ({ value }) => {
      setIsPending(true)
      setError(null)

      const { error: sendError } = await forgetPassword.emailOtp({ email: value.email })

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
      setEmail(value.email)
      setIsPending(false)
      setStep('reset')
    },
  })

  const resetForm = useForm({
    defaultValues: { otp: '', password: '', confirmPassword: '' },
    onSubmit: async ({ value }) => {
      setIsPending(true)
      setError(null)

      const { error: resetError } = await emailOtp.resetPassword({
        email,
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
      setStep('success')
    },
  })

  const handleResendCode = async () => {
    setIsResending(true)
    setError(null)

    const { error: resendError } = await forgetPassword.emailOtp({ email })

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
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        {step === 'request' && (
          <>
            <CardHeader className="text-center">
              <CardTitle>Reset your password</CardTitle>
              <CardDescription>
                Enter your email address and we'll send you a code to reset your password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault()
                  requestForm.handleSubmit()
                }}
              >
                <requestForm.Field
                  name="email"
                  validators={{ onChange: forgotPasswordSchema.shape.email }}
                >
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        autoComplete="email"
                        disabled={isPending}
                        id="email"
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="you@example.com"
                        type="email"
                        value={field.state.value}
                      />
                      {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                        <p className="text-destructive text-sm">
                          {field.state.meta.errors.map((e) => e?.message).join(', ')}
                        </p>
                      )}
                    </div>
                  )}
                </requestForm.Field>

                {error && <p className="text-destructive text-sm">{error}</p>}

                <Button className="w-full" disabled={isPending} type="submit">
                  {isPending ? 'Sending...' : 'Send Reset Code'}
                </Button>

                <div className="text-center">
                  <Link className="text-primary text-sm hover:underline" to="/">
                    Back to home
                  </Link>
                </div>
              </form>
            </CardContent>
          </>
        )}

        {step === 'reset' && (
          <>
            <CardHeader className="text-center">
              <CardTitle>Enter your new password</CardTitle>
              <CardDescription>
                Enter the 6-digit code sent to <strong>{email}</strong> and your new password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault()
                  resetForm.handleSubmit()
                }}
              >
                <resetForm.Field
                  name="otp"
                  validators={{ onChange: resetPasswordSchema.shape.otp }}
                >
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor="otp">Verification Code</Label>
                      <Input
                        autoComplete="one-time-code"
                        disabled={isPending}
                        id="otp"
                        inputMode="numeric"
                        maxLength={6}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value.replace(/\D/g, ''))}
                        placeholder="123456"
                        type="text"
                        value={field.state.value}
                      />
                      {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                        <p className="text-destructive text-sm">
                          {field.state.meta.errors.map((e) => e?.message).join(', ')}
                        </p>
                      )}
                    </div>
                  )}
                </resetForm.Field>

                <resetForm.Field
                  name="password"
                  validators={{ onChange: resetPasswordSchema.shape.password }}
                >
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor="password">New Password</Label>
                      <Input
                        autoComplete="new-password"
                        disabled={isPending}
                        id="password"
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="••••••••"
                        type="password"
                        value={field.state.value}
                      />
                      {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                        <p className="text-destructive text-sm">
                          {field.state.meta.errors.map((e) => e?.message).join(', ')}
                        </p>
                      )}
                    </div>
                  )}
                </resetForm.Field>

                <resetForm.Field
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
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        autoComplete="new-password"
                        disabled={isPending}
                        id="confirmPassword"
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="••••••••"
                        type="password"
                        value={field.state.value}
                      />
                      {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                        <p className="text-destructive text-sm">
                          {field.state.meta.errors.join(', ')}
                        </p>
                      )}
                    </div>
                  )}
                </resetForm.Field>

                {error && <p className="text-destructive text-sm">{error}</p>}

                <Button className="w-full" disabled={isPending} type="submit">
                  {isPending ? 'Resetting...' : 'Reset Password'}
                </Button>

                <div className="flex items-center justify-between">
                  <Button
                    className="h-auto p-0 text-sm"
                    disabled={isResending}
                    onClick={handleResendCode}
                    type="button"
                    variant="link"
                  >
                    {isResending ? 'Sending...' : 'Resend code'}
                  </Button>
                  <Button
                    className="h-auto p-0 text-sm"
                    onClick={() => setStep('request')}
                    type="button"
                    variant="link"
                  >
                    Use different email
                  </Button>
                </div>
              </form>
            </CardContent>
          </>
        )}

        {step === 'success' && (
          <>
            <CardHeader className="text-center">
              <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                <svg
                  className="text-primary h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  aria-label="Check your email"
                  role="img"
                >
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <CardTitle>Password reset successful</CardTitle>
              <CardDescription>
                Your password has been reset. You can now sign in with your new password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => navigate({ to: '/' })}>
                Go to Home
              </Button>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  )
}
