import { Heading, Text } from '@react-email/components'
import { EmailButton } from './components/email-button'
import { EmailLayout } from './components/email-layout'

interface GettingStartedEmailProps {
  userName: string
  dashboardUrl: string
}

export function GettingStartedEmail({ userName, dashboardUrl }: GettingStartedEmailProps) {
  return (
    <EmailLayout previewText="Tips to get started with Zynth">
      <Heading className="mb-4 text-2xl font-bold text-gray-900">
        Ready to dive in? Here are some tips
      </Heading>
      <Text className="mb-4 text-base leading-6 text-gray-700">Hi {userName},</Text>
      <Text className="mb-4 text-base leading-6 text-gray-700">
        You signed up yesterday - here are a few things you can do to get started:
      </Text>
      <Text className="mb-2 text-base leading-6 text-gray-700">
        <strong>1. Complete your profile</strong> - Add a photo and bio
      </Text>
      <Text className="mb-2 text-base leading-6 text-gray-700">
        <strong>2. Create your first item</strong> - Try out the demo features
      </Text>
      <Text className="mb-4 text-base leading-6 text-gray-700">
        <strong>3. Explore the dashboard</strong> - See analytics and settings
      </Text>
      <EmailButton href={dashboardUrl}>Open Dashboard</EmailButton>
      <Text className="mt-4 text-sm leading-6 text-gray-500">
        Questions? Just reply to this email - we're here to help.
      </Text>
    </EmailLayout>
  )
}
