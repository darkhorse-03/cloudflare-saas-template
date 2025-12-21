import { config } from '@repo/config'
import { Zap } from 'lucide-react'
import { CommandCopyButton } from './command-copy-button'

export function HeroSection() {
  const { hero, timeline } = config.marketing

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
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
          <div className="mb-12 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Zap className="size-4 text-primary" />
            <span>{hero.trustSignal}</span>
          </div>

          {/* Timeline Preview */}
          <div className="mx-auto max-w-2xl rounded-lg border bg-card p-6">
            <div className="mb-4 text-center font-semibold text-sm">
              From idea to deployed in 60 seconds:
            </div>
            <div className="grid gap-3 sm:grid-cols-4">
              {timeline.map((stage) => (
                <div className="text-center" key={stage.time}>
                  <div className="mb-1 font-mono text-primary text-xs">{stage.time}s</div>
                  <div className="font-medium text-sm">{stage.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
