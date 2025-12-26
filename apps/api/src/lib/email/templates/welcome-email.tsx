import { Heading, Text } from '@react-email/components'
import { EmailButton } from './components/email-button'
import { EmailLayout } from './components/email-layout'

interface WelcomeEmailProps {
  userName: string
  dashboardUrl: string
}

export function WelcomeEmail({ userName, dashboardUrl }: WelcomeEmailProps) {
  return (
    <EmailLayout previewText="Welcome to Zynth!">
      <Heading className="mb-4 text-2xl font-bold text-gray-900">Welcome to Zynth! 🎉</Heading>
      <Text className="mb-4 text-base leading-6 text-gray-700">Hi {userName},</Text>
      <Text className="mb-4 text-base leading-6 text-gray-700">
        Thank you for verifying your email! Your account is now fully set up and ready to use.
      </Text>
      <EmailButton href={dashboardUrl}>Go to Dashboard</EmailButton>
      <Text className="mb-4 text-base leading-6 text-gray-700">
        We're excited to have you on board. If you have any questions, feel free to reach out.
      </Text>
    </EmailLayout>
  )
}
