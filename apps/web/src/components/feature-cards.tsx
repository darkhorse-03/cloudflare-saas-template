import { HonoRpcCard } from './hono-rpc-card'
import { ReactQueryCard } from './react-query-card'
import { ServiceBindingCard } from './service-binding-card'

export function FeatureCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <HonoRpcCard />
      <ServiceBindingCard />
      <ReactQueryCard />
    </div>
  )
}
