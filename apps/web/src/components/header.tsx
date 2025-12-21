import { config } from '@repo/config'
import { Link } from '@tanstack/react-router'
import { Menu } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'
import { Button } from './ui/button'
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from './ui/sheet'
import { UserButton } from './user/user-button'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-6xl items-center px-4">
        <div className="flex w-full items-center justify-between">
          <Link
            className="flex items-center font-bold text-lg transition-opacity hover:opacity-80"
            to="/"
          >
            {config.appName}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {config.nav.map((item) => (
              <Link
                activeProps={{
                  className: 'text-foreground bg-accent',
                }}
                className="rounded-md px-3 py-2 font-medium text-muted-foreground text-sm transition-colors hover:bg-accent hover:text-foreground"
                key={item.href}
                to={item.href}
              >
                {item.label}
              </Link>
            ))}
            <div className="ml-2 flex items-center gap-2 border-l pl-2">
              <ThemeToggle />
              <UserButton />
            </div>
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="ghost">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="flex w-[280px] flex-col p-0" side="right">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SheetDescription className="sr-only">
                  Navigate to different pages and adjust theme settings
                </SheetDescription>
                {/* Main Navigation */}
                <div className="flex-1 overflow-y-auto">
                  <div className="px-6 py-8">
                    <nav className="flex flex-col gap-1">
                      {config.nav.map((item) => (
                        <Link
                          activeProps={{
                            className: 'text-foreground bg-accent',
                          }}
                          className="flex items-center rounded-md px-3 py-3 font-medium text-base text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                          key={item.href}
                          to={item.href}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </div>

                {/* Settings Section - Sticky Bottom */}
                <div className="space-y-3 border-t bg-muted/30 p-4">
                  <div className="flex items-center justify-center">
                    <UserButton />
                  </div>
                  <div className="flex items-center justify-between rounded-md bg-background px-3 py-2">
                    <span className="font-medium text-sm">Theme</span>
                    <ThemeToggle />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
