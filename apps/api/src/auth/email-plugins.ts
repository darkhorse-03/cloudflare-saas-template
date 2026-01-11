import { config } from '@repo/config'
import { emailOTP, magicLink } from 'better-auth/plugins'
import type { EmailService } from '@/lib/email'
import { MagicLinkEmail } from '@/lib/email/templates/magic-link-email'
import { OtpEmail } from '@/lib/email/templates/otp-email'

export function getEmailPlugins(emailService: EmailService) {
  const plugins: ReturnType<typeof emailOTP | typeof magicLink>[] = [
    emailOTP({
      otpLength: 6,
      expiresIn: 300,
      async sendVerificationOTP({ email, otp, type }) {
        const subjectByType: Record<string, string> = {
          'forget-password': 'Reset your password',
          'email-verification': 'Verify your email',
        }
        await emailService.send({
          to: { email },
          subject: subjectByType[type] ?? 'Your sign-in code',
          react: OtpEmail({
            userName: email.split('@')[0],
            otp,
            type,
            expiresInMinutes: 5,
          }),
          emailType: type === 'forget-password' ? 'password_reset' : 'verification',
        })
      },
    }),
  ]

  if (config.auth.enableMagicLink) {
    plugins.push(
      magicLink({
        async sendMagicLink({ email, url }) {
          await emailService.send({
            to: { email },
            subject: 'Sign in to your account',
            react: MagicLinkEmail({
              userName: email.split('@')[0],
              magicLink: url,
              expiresInMinutes: 10,
            }),
            emailType: 'magic_link',
          })
        },
      }),
    )
  }

  return plugins
}
