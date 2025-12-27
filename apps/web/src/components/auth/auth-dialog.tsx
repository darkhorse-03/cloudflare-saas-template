import { Activity, createContext, type ReactNode, useContext, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ForgotPasswordForm } from './forgot-password-form'
import { MagicLinkForm } from './magic-link-form'
import { OAuthSection } from './oauth-section'
import { ResetPasswordForm } from './reset-password-form'
import { SignInForm } from './sign-in-form'
import { SignUpForm } from './sign-up-form'
import { config } from '@repo/config'

type AuthView = 'signin' | 'signup' | 'forgot-password' | 'reset-password' | 'magic-link'

interface AuthDialogContextType {
  isOpen: boolean
  openDialog: () => void
  closeDialog: () => void
}

const AuthDialogContext = createContext<AuthDialogContextType | undefined>(undefined)

export function useAuthDialog() {
  const context = useContext(AuthDialogContext)
  if (!context) {
    throw new Error('useAuthDialog must be used within AuthDialogProvider')
  }
  return context
}

export function AuthDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openDialog = () => setIsOpen(true)
  const closeDialog = () => setIsOpen(false)

  return (
    <AuthDialogContext.Provider value={{ isOpen, openDialog, closeDialog }}>
      {children}
    </AuthDialogContext.Provider>
  )
}

const viewTitles: Record<AuthView, { title: string; description: string }> = {
  signin: { title: 'Welcome', description: 'Sign in to your account or create a new one' },
  signup: { title: 'Welcome', description: 'Sign in to your account or create a new one' },
  'forgot-password': { title: 'Forgot Password', description: 'Reset your password via email' },
  'reset-password': { title: 'Reset Password', description: 'Enter your new password' },
  'magic-link': { title: 'Magic Link', description: 'Sign in without a password' },
}

export function AuthDialog() {
  const { isOpen, closeDialog } = useAuthDialog()
  const [view, setView] = useState<AuthView>('signin')
  const [resetEmail, setResetEmail] = useState('')

  // Reset to signin view when dialog closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setView('signin')
      setResetEmail('')
      closeDialog()
    }
  }

  const handleForgotPasswordSuccess = (email: string) => {
    setResetEmail(email)
    setView('reset-password')
  }

  const handleResetPasswordSuccess = () => {
    setView('signin')
    setResetEmail('')
  }

  const showTabs = view === 'signin' || view === 'signup'
  const { title, description } = viewTitles[view]

  return (
    <Dialog onOpenChange={handleOpenChange} open={isOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {showTabs ? (
          <Tabs
            className="w-full"
            defaultValue="signin"
            onValueChange={(v) => setView(v as AuthView)}
            value={view}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* Both forms are always mounted, but hidden when not active */}
            <div className="mt-4">
              <Activity mode={view === 'signin' ? 'visible' : 'hidden'}>
                <div className="space-y-4">
                  <OAuthSection mode="signin" />
                  <SignInForm
                    onForgotPassword={() => setView('forgot-password')}
                    onMagicLink={
                      config.auth.enableMagicLink ? () => setView('magic-link') : undefined
                    }
                  />
                </div>
              </Activity>

              <Activity mode={view === 'signup' ? 'visible' : 'hidden'}>
                <div className="space-y-4">
                  <OAuthSection mode="signup" />
                  <SignUpForm />
                </div>
              </Activity>
            </div>
          </Tabs>
        ) : (
          <div className="mt-4">
            {view === 'forgot-password' && (
              <ForgotPasswordForm
                onBack={() => setView('signin')}
                onSuccess={handleForgotPasswordSuccess}
              />
            )}

            {view === 'reset-password' && (
              <ResetPasswordForm
                email={resetEmail}
                onBack={() => setView('forgot-password')}
                onSuccess={handleResetPasswordSuccess}
              />
            )}

            {view === 'magic-link' && <MagicLinkForm onBack={() => setView('signin')} />}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
