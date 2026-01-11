import { config } from '@repo/config'
import { ArrowRight, BookOpen, Github, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CommandCopyButton } from './command-copy-button'

export function CTASection() {
  const { cta, hero } = config.marketing

  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto max-w-6xl px-4">
        <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/5 p-8 sm:p-12">
          {/* Decorative elements */}
          <div className="absolute right-0 top-0 -mr-20 -mt-20 size-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 size-64 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative mx-auto max-w-2xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm">
              <Sparkles className="size-4 text-primary" />
              <span className="font-medium text-primary">Start building in 60 seconds</span>
            </div>

            {/* Heading */}
            <h2 className="mb-4 font-bold text-3xl tracking-tight sm:text-4xl">{cta.title}</h2>
            <p className="mb-8 text-muted-foreground">{cta.subtitle}</p>

            {/* CLI Command */}
            <div className="mb-8">
              <CommandCopyButton command={hero.cliCommand} variant="large" />
            </div>

            {/* Secondary Actions */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              {cta.secondaryActions.map((action) => (
                <Button asChild key={action.label} size="lg" variant="outline">
                  <a href={action.href} rel="noopener noreferrer" target="_blank">
                    {action.label === 'View on GitHub' && <Github className="mr-2 size-4" />}
                    {action.label === 'Read Docs' && <BookOpen className="mr-2 size-4" />}
                    {action.label}
                    <ArrowRight className="ml-2 size-4" />
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
