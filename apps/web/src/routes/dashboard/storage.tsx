import { createFileRoute } from '@tanstack/react-router'
import { StorageDemo } from '@/components/storage/storage-demo'

export const Route = createFileRoute('/dashboard/storage')({
  component: StoragePage,
})

function StoragePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Storage</h1>
        <p className="text-muted-foreground">Upload and manage files with Cloudflare R2</p>
      </div>
      <StorageDemo />
    </div>
  )
}
