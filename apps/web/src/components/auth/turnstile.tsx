import { config } from '@repo/config'
import { Turnstile as TurnstileWidget, type TurnstileInstance } from '@marsidev/react-turnstile'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'

export interface TurnstileRef {
  getToken: () => string | null
  reset: () => void
}

interface TurnstileProps {
  onSuccess?: (token: string) => void
  onError?: () => void
  onExpire?: () => void
}

export const Turnstile = forwardRef<TurnstileRef, TurnstileProps>(
  ({ onSuccess, onError, onExpire }, ref) => {
    const turnstileRef = useRef<TurnstileInstance>(null)
    const [token, setToken] = useState<string | null>(null)

    useImperativeHandle(ref, () => ({
      getToken: () => token,
      reset: () => {
        turnstileRef.current?.reset()
        setToken(null)
      },
    }))

    // Don't render if Turnstile is not configured
    if (!config.auth.turnstileSiteKey) {
      return null
    }

    return (
      <div className="flex justify-center">
        <TurnstileWidget
          ref={turnstileRef}
          siteKey={config.auth.turnstileSiteKey}
          onError={() => {
            setToken(null)
            onError?.()
          }}
          onExpire={() => {
            setToken(null)
            onExpire?.()
          }}
          onSuccess={(newToken) => {
            setToken(newToken)
            onSuccess?.(newToken)
          }}
          options={{
            theme: 'auto',
            size: 'normal',
          }}
        />
      </div>
    )
  },
)

Turnstile.displayName = 'Turnstile'

// Hook to check if Turnstile is enabled
export function useTurnstileEnabled() {
  return !!config.auth.turnstileSiteKey
}
