import { Heading, Text } from '@react-email/components'
import { EmailLayout } from './components/email-layout'

interface OtpEmailProps {
  userName: string
  otp: string
  type: 'sign-in' | 'email-verification' | 'forget-password'
  expiresInMinutes?: number
}

const typeMessages = {
  'sign-in': {
    previewText: 'Your sign-in code',
    heading: 'Sign in to your account',
    description: 'Use the code below to sign in to your account:',
  },
  'email-verification': {
    previewText: 'Verify your email address',
    heading: 'Verify your email',
    description: 'Use the code below to verify your email address:',
  },
  'forget-password': {
    previewText: 'Reset your password',
    heading: 'Reset your password',
    description: 'Use the code below to reset your password:',
  },
}

export function OtpEmail({ userName, otp, type, expiresInMinutes = 5 }: OtpEmailProps) {
  const messages = typeMessages[type]

  return (
    <EmailLayout previewText={messages.previewText}>
      <Heading className="mb-4 text-2xl font-bold text-gray-900">{messages.heading}</Heading>
      <Text className="mb-4 text-base leading-6 text-gray-700">Hi {userName},</Text>
      <Text className="mb-4 text-base leading-6 text-gray-700">{messages.description}</Text>
      <div className="my-6 rounded-lg bg-gray-100 p-6 text-center">
        <Text className="m-0 font-mono text-3xl font-bold tracking-widest text-gray-900">
          {otp}
        </Text>
      </div>
      <Text className="mb-4 text-base leading-6 text-gray-700">
        This code will expire in {expiresInMinutes} minutes.
      </Text>
      <Text className="mb-4 text-base leading-6 text-gray-500">
        If you didn't request this code, you can safely ignore this email.
      </Text>
    </EmailLayout>
  )
}
