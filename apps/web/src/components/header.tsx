import { Link } from '@tanstack/react-router'
import { config } from '@repo/config'
import { ThemeToggle } from './theme-toggle'

export function Header() {
  return (
    <header className="border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <Link to="/" className="text-xl font-bold hover:opacity-80 transition-opacity">
            {config.appName}
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            {config.nav.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-sm hover:text-foreground transition-colors text-muted-foreground"
                activeProps={{
                  className: 'text-foreground font-medium',
                }}
              >
                {item.label}
              </Link>
            ))}
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
