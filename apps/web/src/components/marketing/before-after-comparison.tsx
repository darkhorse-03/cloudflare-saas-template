import { config } from '@repo/config'
import { Check, Clock, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function BeforeAfterComparison() {
  const { painPoints } = config.marketing

  // Calculate total time saved
  const totalHoursSaved = painPoints.reduce((sum, point) => {
    const hours = Number.parseInt(point.timeWithout.split(' ')[0], 10)
    return sum + hours
  }, 0)

  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-bold text-4xl tracking-tight">
            Skip 3 Days of Research and Setup
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Everything you need is pre-configured. No more tutorials, no more debugging setup
            issues.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-6 py-3 font-semibold text-primary">
            <Clock className="size-5" />
            <span>{totalHoursSaved}+ hours of setup eliminated</span>
          </div>
        </div>

        {/* Comparison Cards */}
        <div className="grid gap-8 md:grid-cols-2">
          {painPoints.map((point) => (
            <Card
              className="relative overflow-hidden transition-shadow hover:shadow-lg"
              key={point.id}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{point.title}</span>
                  <div className="rounded-full bg-primary/10 px-3 py-1 font-mono text-primary text-xs">
                    Save {point.timeWithout}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2">
                  {/* WITHOUT Zynth */}
                  <div className="space-y-3">
                    <div className="mb-3 flex items-center gap-2">
                      <X aria-hidden="true" className="size-5 text-destructive" />
                      <span className="font-semibold text-sm text-destructive">Without Zynth</span>
                    </div>
                    <div className="mb-2 rounded bg-destructive/10 px-3 py-1 font-mono text-destructive text-xs">
                      {point.timeWithout}
                    </div>
                    <ul className="space-y-2 text-muted-foreground text-sm">
                      {point.tasksWithout.map((task) => (
                        <li className="flex items-start gap-2" key={task}>
                          <span className="mt-0.5 text-destructive/70">•</span>
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 border-t pt-3 italic text-muted-foreground text-xs">
                      {point.quoteWithout}
                    </div>
                  </div>

                  {/* WITH Zynth */}
                  <div className="space-y-3">
                    <div className="mb-3 flex items-center gap-2">
                      <Check aria-hidden="true" className="size-5 text-emerald-500" />
                      <span className="font-semibold text-sm text-emerald-600 dark:text-emerald-400">
                        With Zynth
                      </span>
                    </div>
                    <div className="mb-2 rounded bg-emerald-500/10 px-3 py-1 font-mono text-emerald-600 text-xs dark:text-emerald-400">
                      {point.timeWith}
                    </div>
                    <ul className="space-y-2 text-sm">
                      {point.tasksWith.map((task) => (
                        <li className="flex items-start gap-2" key={task}>
                          <Check
                            aria-hidden="true"
                            className="mt-0.5 size-4 shrink-0 text-emerald-500"
                          />
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 border-t pt-3 italic text-emerald-600 text-xs dark:text-emerald-400">
                      {point.quoteWith}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
