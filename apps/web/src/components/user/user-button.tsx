import { useAuthDialog } from '@/components/auth/auth-dialog'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { UserDropdown } from './user-dropdown'

export function UserButton() {
  const { isAuthenticated, isLoading } = useAuth()
  const { openDialog } = useAuthDialog()

  if (isLoading) {
    return (
      <Button disabled variant="ghost">
        Loading...
      </Button>
    )
  }

  if (isAuthenticated) {
    return <UserDropdown />
  }

  return (
    <Button onClick={openDialog} variant="ghost">
      Sign In
    </Button>
  )
}
