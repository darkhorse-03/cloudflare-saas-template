import { Heading, Text } from '@react-email/components'
import { EmailButton } from './components/email-button'
import { EmailLayout } from './components/email-layout'

interface MagicLinkEmailProps {
  userName: string
  magicLink: string
  expiresInMinutes?: number
}

export function MagicLinkEmail({
  userName,
  magicLink,
  expiresInMinutes = 10,
}: MagicLinkEmailProps) {
  return (
    <EmailLayout previewText="Sign in to your account">
      <Heading className="mb-4 text-2xl font-bold text-gray-900">Sign in to your account</Heading>
      <Text className="mb-4 text-base leading-6 text-gray-700">Hi {userName},</Text>
      <Text className="mb-4 text-base leading-6 text-gray-700">
        Click the button below to sign in to your account:
      </Text>
      <EmailButton href={magicLink}>Sign In</EmailButton>
      <Text className="mb-4 text-base leading-6 text-gray-700">
        This link will expire in {expiresInMinutes} minutes and can only be used once.
      </Text>
      <Text className="mb-4 text-base leading-6 text-gray-500">
        If you didn't request this email, you can safely ignore it.
      </Text>
    </EmailLayout>
  )
}
