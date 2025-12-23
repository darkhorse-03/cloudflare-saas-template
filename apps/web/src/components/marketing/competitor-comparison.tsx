import { Check, X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function CompetitorComparison() {
  const features = [
    {
      name: 'Pre-built Auth',
      nextjs: false,
      remix: false,
      underdog: true,
    },
    {
      name: 'Database Configured',
      nextjs: false,
      remix: false,
      underdog: true,
    },
    {
      name: 'One-Command Deploy',
      nextjs: 'Complex',
      remix: 'Complex',
      underdog: true,
    },
    {
      name: 'Edge Runtime',
      nextjs: 'Paid',
      remix: 'Paid',
      underdog: 'Included',
    },
    {
      name: 'Learning Curve',
      nextjs: 'Steep',
      remix: 'Steep',
      underdog: 'Minimal',
    },
  ]

  const renderCell = (value: boolean | string, isUnderdog = false) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className={`size-5 ${isUnderdog ? 'text-green-500' : 'text-green-600'}`} />
      ) : (
        <X className="size-5 text-destructive" />
      )
    }
    return (
      <span
        className={`text-sm ${isUnderdog ? 'font-semibold text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}
      >
        {value}
      </span>
    )
  }

  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-bold text-4xl tracking-tight">Why Underdog?</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Because you ship, not configure. Here's how we compare to the usual suspects.
          </p>
        </div>

        {/* Comparison Table */}
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[200px] font-bold">Feature</TableHead>
                <TableHead className="text-center">Next.js</TableHead>
                <TableHead className="text-center">Remix</TableHead>
                <TableHead className="bg-primary/10 text-center font-bold text-primary">
                  Underdog
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.map((feature, index) => (
                <TableRow className={index % 2 === 0 ? 'bg-muted/30' : ''} key={feature.name}>
                  <TableCell className="font-medium">{feature.name}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center">
                      {renderCell(feature.nextjs)}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center">
                      {renderCell(feature.remix)}
                    </div>
                  </TableCell>
                  <TableCell className="bg-primary/5 text-center">
                    <div className="flex items-center justify-center">
                      {renderCell(feature.underdog, true)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Bottom Message */}
        <div className="mt-8 text-center">
          <p className="text-lg text-muted-foreground">
            Underdog is for builders who{' '}
            <span className="font-semibold text-foreground">ship, not configure</span>.
          </p>
        </div>
      </div>
    </section>
  )
}
