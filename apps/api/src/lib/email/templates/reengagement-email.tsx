import { Heading, Text } from '@react-email/components'
import { EmailButton } from './components/email-button'
import { EmailLayout } from './components/email-layout'

interface ReengagementEmailProps {
  userName: string
  dashboardUrl: string
}

export function ReengagementEmail({ userName, dashboardUrl }: ReengagementEmailProps) {
  return (
    <EmailLayout previewText="We miss you! Come back and explore">
      <Heading className="mb-4 text-2xl font-bold text-gray-900">
        We noticed you haven't been back
      </Heading>
      <Text className="mb-4 text-base leading-6 text-gray-700">Hi {userName},</Text>
      <Text className="mb-4 text-base leading-6 text-gray-700">
        It's been a week since you signed up, but we haven't seen much activity. No worries - we're
        here whenever you're ready!
      </Text>
      <Text className="mb-4 text-base leading-6 text-gray-700">
        If you ran into any issues or have questions, just reply to this email. We'd love to help
        you get started.
      </Text>
      <EmailButton href={dashboardUrl}>Come Back to Dashboard</EmailButton>
      <Text className="mt-4 text-sm leading-6 text-gray-500">
        If you're no longer interested, no hard feelings. You can unsubscribe from these emails in
        your account settings.
      </Text>
    </EmailLayout>
  )
}
