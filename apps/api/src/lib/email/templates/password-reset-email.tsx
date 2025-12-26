import { Heading, Text } from '@react-email/components'
import { EmailButton } from './components/email-button'
import { EmailLayout } from './components/email-layout'

interface PasswordResetEmailProps {
  userName: string
  resetUrl: string
}

export function PasswordResetEmail({ userName, resetUrl }: PasswordResetEmailProps) {
  return (
    <EmailLayout previewText="Reset your password">
      <Heading className="mb-4 text-2xl font-bold text-gray-900">Reset your password</Heading>
      <Text className="mb-4 text-base leading-6 text-gray-700">Hi {userName},</Text>
      <Text className="mb-4 text-base leading-6 text-gray-700">
        We received a request to reset your password. Click the button below to continue:
      </Text>
      <EmailButton href={resetUrl}>Reset Password</EmailButton>
      <Text className="mb-4 text-base leading-6 text-gray-500">
        If you didn't request a password reset, you can safely ignore this email.
      </Text>
    </EmailLayout>
  )
}
