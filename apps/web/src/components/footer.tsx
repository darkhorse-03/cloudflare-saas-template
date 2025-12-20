import { config } from '@repo/config'

export function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="container max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          {/* Brand */}
          <p>
            © {new Date().getFullYear()} {config.appName}. Built with Cloudflare Workers.
          </p>

          {/* Links */}
          <div className="flex items-center gap-4">
            {config.footer.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="hover:text-foreground transition-colors"
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
