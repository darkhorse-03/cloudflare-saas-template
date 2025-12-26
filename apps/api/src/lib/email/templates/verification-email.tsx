import { Heading, Text } from '@react-email/components'
import { EmailButton } from './components/email-button'
import { EmailLayout } from './components/email-layout'

interface VerificationEmailProps {
  userName: string
  verificationUrl: string
}

export function VerificationEmail({ userName, verificationUrl }: VerificationEmailProps) {
  return (
    <EmailLayout previewText="Verify your email address">
      <Heading className="mb-4 text-2xl font-bold text-gray-900">Verify your email</Heading>
      <Text className="mb-4 text-base leading-6 text-gray-700">Hi {userName},</Text>
      <Text className="mb-4 text-base leading-6 text-gray-700">
        Thanks for signing up! Click the button below to verify your email address:
      </Text>
      <EmailButton href={verificationUrl}>Verify Email</EmailButton>
      <Text className="mb-4 text-base leading-6 text-gray-500">
        If you didn't create an account, you can safely ignore this email.
      </Text>
    </EmailLayout>
  )
}
