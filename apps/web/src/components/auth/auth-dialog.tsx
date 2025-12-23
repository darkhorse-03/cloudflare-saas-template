import { createContext, type ReactNode, useContext, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SignInForm } from './sign-in-form'
import { SignUpForm } from './sign-up-form'

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

export function AuthDialog() {
  const { isOpen, closeDialog } = useAuthDialog()

  return (
    <Dialog onOpenChange={closeDialog} open={isOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome</DialogTitle>
          <DialogDescription>Sign in to your account or create a new one</DialogDescription>
        </DialogHeader>

        <Tabs className="w-full" defaultValue="signin">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent className="mt-4" value="signin">
            <SignInForm />
          </TabsContent>

          <TabsContent className="mt-4" value="signup">
            <SignUpForm />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
