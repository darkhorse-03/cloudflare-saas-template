import { config } from '@repo/config'

export function Footer() {
  return (
    <footer className="mt-auto border-border border-t">
      <div className="container mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-4 text-muted-foreground text-sm md:flex-row">
          {/* Brand */}
          <p>
            © {new Date().getFullYear()} {config.appName}. Built with Cloudflare Workers.
          </p>

          {/* Links */}
          <div className="flex items-center gap-4">
            {config.footer.links.map((link) => (
              <a
                className="transition-colors hover:text-foreground"
                href={link.href}
                key={link.href}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                target={link.href.startsWith('http') ? '_blank' : undefined}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
