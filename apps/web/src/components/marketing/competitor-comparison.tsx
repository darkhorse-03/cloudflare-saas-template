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
      name: 'Price',
      shipfast: '$249',
      indiekit: '$79',
      zynth: 'Free',
    },
    {
      name: 'Pre-built Auth',
      shipfast: true,
      indiekit: true,
      zynth: true,
    },
    {
      name: 'Database Setup',
      shipfast: true,
      indiekit: true,
      zynth: true,
    },
    {
      name: 'Edge Runtime',
      shipfast: false,
      indiekit: false,
      zynth: 'Included',
    },
    {
      name: 'AI-Optimized',
      shipfast: false,
      indiekit: true,
      zynth: 'Built-in',
    },
    {
      name: 'One-Command Deploy',
      shipfast: 'Manual',
      indiekit: 'Manual',
      zynth: true,
    },
    {
      name: 'Open Source',
      shipfast: false,
      indiekit: false,
      zynth: true,
    },
  ]

  const renderCell = (value: boolean | string, isZynth = false) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className={`size-5 ${isZynth ? 'text-green-500' : 'text-green-600'}`} />
      ) : (
        <X className="size-5 text-destructive" />
      )
    }
    return (
      <span
        className={`text-sm ${isZynth ? 'font-semibold text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}
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
          <h2 className="mb-4 font-bold text-4xl tracking-tight">Why Zynth?</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Free, open-source, and optimized for Claude Code. Here's how we compare to paid
            boilerplates.
          </p>
        </div>

        {/* Comparison Table */}
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[200px] font-bold">Feature</TableHead>
                <TableHead className="text-center">Shipfast</TableHead>
                <TableHead className="text-center">Indie Kit</TableHead>
                <TableHead className="bg-primary/10 text-center font-bold text-primary">
                  Zynth
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.map((feature, index) => (
                <TableRow className={index % 2 === 0 ? 'bg-muted/30' : ''} key={feature.name}>
                  <TableCell className="font-medium">{feature.name}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center">
                      {renderCell(feature.shipfast)}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center">
                      {renderCell(feature.indiekit)}
                    </div>
                  </TableCell>
                  <TableCell className="bg-primary/5 text-center">
                    <div className="flex items-center justify-center">
                      {renderCell(feature.zynth, true)}
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
            Zynth is for builders who{' '}
            <span className="font-semibold text-foreground">ship, not configure</span>.
          </p>
        </div>
      </div>
    </section>
  )
}
