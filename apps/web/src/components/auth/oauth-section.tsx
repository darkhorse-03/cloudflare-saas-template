import { config } from '@repo/config'
import { Activity } from 'react'
import { SocialLoginButtons } from './social-login-buttons'

const hasOAuth = config.auth.enableGoogleOAuth || config.auth.enableGitHubOAuth

export function OAuthSection({ mode }: { mode: 'signin' | 'signup' }) {
  return (
    <Activity mode={hasOAuth ? 'visible' : 'hidden'}>
      <SocialLoginButtons mode={mode} />
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background text-muted-foreground px-2">Or continue with email</span>
        </div>
      </div>
    </Activity>
  )
}
