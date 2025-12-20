import { Link } from '@tanstack/react-router'
import { Menu } from 'lucide-react'
import { config } from '@repo/config'
import { ThemeToggle } from './theme-toggle'
import { Button } from './ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from './ui/sheet'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center">
        <div className="flex items-center justify-between w-full">
          <Link to="/" className="flex items-center text-lg font-bold hover:opacity-80 transition-opacity">
            {config.appName}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {config.nav.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                activeProps={{
                  className: 'text-foreground bg-accent',
                }}
              >
                {item.label}
              </Link>
            ))}
            <div className="ml-2 pl-2 border-l">
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] p-0 flex flex-col">
                {/* Main Navigation */}
                <div className="flex-1 overflow-y-auto">
                  <div className="px-6 py-8">
                    <nav className="flex flex-col gap-1">
                      {config.nav.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          className="flex items-center px-3 py-3 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                          activeProps={{
                            className: 'text-foreground bg-accent',
                          }}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </div>

                {/* Settings Section - Sticky Bottom */}
                <div className="border-t bg-muted/30 p-4">
                  <div className="flex items-center justify-between px-3 py-2 rounded-md bg-background">
                    <span className="text-sm font-medium">Theme</span>
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
