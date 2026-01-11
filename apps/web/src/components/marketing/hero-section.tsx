import { config } from '@repo/config'
import { Zap } from 'lucide-react'
import { CommandCopyButton } from './command-copy-button'

export function HeroSection() {
  const { hero } = config.marketing

  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-background to-background" />

      <div className="container mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Headline */}
          <h1 className="mb-4 font-bold text-5xl tracking-tight sm:text-6xl md:text-7xl">
            {hero.headline}
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {hero.subheadline}
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            {hero.description}
          </p>

          {/* CLI Command */}
          <div className="mb-6 flex justify-center">
            <CommandCopyButton command={hero.cliCommand} variant="large" />
          </div>

          {/* Trust Signal */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Zap className="size-4 text-primary" />
            <span>{hero.trustSignal}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
