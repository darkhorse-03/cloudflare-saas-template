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

type FeatureValue = boolean | string

interface Feature {
  name: string
  shipfast: FeatureValue
  indiekit: FeatureValue
  zynth: FeatureValue
}

const features: Feature[] = [
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

function renderValue(value: FeatureValue, isZynth = false) {
  if (typeof value === 'boolean') {
    return value ? (
      <>
        <Check
          aria-hidden="true"
          className={`size-5 ${isZynth ? 'text-emerald-500' : 'text-emerald-500'}`}
        />
        <span className="sr-only">Yes</span>
      </>
    ) : (
      <>
        <X aria-hidden="true" className="size-5 text-destructive" />
        <span className="sr-only">No</span>
      </>
    )
  }
  return (
    <span
      className={`text-sm ${isZynth ? 'font-semibold text-emerald-500' : 'text-muted-foreground'}`}
    >
      {value}
    </span>
  )
}

function MobileComparisonCards() {
  const competitors = [
    { key: 'zynth' as const, name: 'Zynth', isHighlighted: true },
    { key: 'shipfast' as const, name: 'Shipfast', isHighlighted: false },
    { key: 'indiekit' as const, name: 'Indie Kit', isHighlighted: false },
  ]

  return (
    <div className="space-y-4 md:hidden">
      {competitors.map((competitor) => (
        <Card
          className={`overflow-hidden ${competitor.isHighlighted ? 'ring-2 ring-primary' : ''}`}
          key={competitor.key}
        >
          <div
            className={`px-4 py-3 font-semibold ${competitor.isHighlighted ? 'bg-primary/10 text-primary' : 'bg-muted/50'}`}
          >
            {competitor.name}
            {competitor.isHighlighted && (
              <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-primary-foreground text-xs">
                Recommended
              </span>
            )}
          </div>
          <div className="divide-y">
            {features.map((feature) => (
              <div className="flex items-center justify-between px-4 py-3" key={feature.name}>
                <span className="font-medium text-sm">{feature.name}</span>
                <div className="flex items-center">
                  {renderValue(feature[competitor.key], competitor.isHighlighted)}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  )
}

function DesktopComparisonTable() {
  return (
    <Card className="hidden overflow-hidden md:block">
      <Table>
        <caption className="sr-only">
          Feature comparison between Zynth, Shipfast, and Indie Kit boilerplates
        </caption>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[200px] font-bold">Feature</TableHead>
            <TableHead className="bg-primary/10 text-center font-bold text-primary">
              Zynth
            </TableHead>
            <TableHead className="text-center">Shipfast</TableHead>
            <TableHead className="text-center">Indie Kit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {features.map((feature, index) => (
            <TableRow className={index % 2 === 0 ? 'bg-muted/30' : ''} key={feature.name}>
              <TableCell className="font-medium">{feature.name}</TableCell>
              <TableCell className="bg-primary/5 text-center">
                <div className="flex items-center justify-center">
                  {renderValue(feature.zynth, true)}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center">
                  {renderValue(feature.shipfast)}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center">
                  {renderValue(feature.indiekit)}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

export function CompetitorComparison() {
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

        {/* Mobile: Card layout */}
        <MobileComparisonCards />

        {/* Desktop: Table layout */}
        <DesktopComparisonTable />

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
