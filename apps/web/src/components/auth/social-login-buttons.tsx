import { config } from '@repo/config'
import { siGithub, siGoogle } from 'simple-icons'
import { Activity, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { signIn } from '@/lib/auth-client'

interface SimpleIconProps {
  icon: { path: string; hex: string }
  className?: string
  useOriginalColor?: boolean
}

function SimpleIcon({ icon, className, useOriginalColor = true }: SimpleIconProps) {
  return (
    <svg
      className={className}
      fill={useOriginalColor ? `#${icon.hex}` : 'currentColor'}
      role="img"
      aria-label={icon.path}
      viewBox="0 0 24 24"
    >
      <path d={icon.path} />
    </svg>
  )
}

interface SocialLoginButtonsProps {
  mode?: 'signin' | 'signup'
}

export function SocialLoginButtons({ mode = 'signin' }: SocialLoginButtonsProps) {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isGitHubLoading, setIsGitHubLoading] = useState(false)

  const { enableGoogleOAuth, enableGitHubOAuth } = config.auth

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    try {
      await signIn.social({
        provider: 'google',
        callbackURL: '/dashboard',
      })
    } catch {
      toast.error('Google sign in failed. Provider may not be configured.')
      setIsGoogleLoading(false)
    }
  }

  const handleGitHubSignIn = async () => {
    setIsGitHubLoading(true)
    try {
      await signIn.social({
        provider: 'github',
        callbackURL: '/dashboard',
      })
    } catch {
      toast.error('GitHub sign in failed. Provider may not be configured.')
      setIsGitHubLoading(false)
    }
  }

  const actionText = mode === 'signup' ? 'Sign up' : 'Sign in'
  const isLoading = isGoogleLoading || isGitHubLoading

  return (
    <div className="space-y-2">
      <Activity mode={enableGoogleOAuth ? 'visible' : 'hidden'}>
        <Button
          className="w-full"
          disabled={isLoading}
          onClick={handleGoogleSignIn}
          type="button"
          variant="outline"
        >
          <SimpleIcon className="mr-2 h-4 w-4" icon={siGoogle} />
          {isGoogleLoading ? 'Redirecting...' : `${actionText} with Google`}
        </Button>
      </Activity>

      <Activity mode={enableGitHubOAuth ? 'visible' : 'hidden'}>
        <Button
          className="w-full"
          disabled={isLoading}
          onClick={handleGitHubSignIn}
          type="button"
          variant="outline"
        >
          <SimpleIcon className="mr-2 h-4 w-4" icon={siGithub} useOriginalColor={false} />
          {isGitHubLoading ? 'Redirecting...' : `${actionText} with GitHub`}
        </Button>
      </Activity>
    </div>
  )
}
