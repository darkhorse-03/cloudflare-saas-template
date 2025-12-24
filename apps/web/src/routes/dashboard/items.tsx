import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useItems } from '@/hooks/demo/use-items'

export const Route = createFileRoute('/dashboard/items')({
  component: Items,
})

function Items() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<'work' | 'personal' | 'other'>('other')
  const { items, isLoading, createItem, deleteItem } = useItems()

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    createItem.mutate(
      { title, description, category },
      {
        onSuccess: () => {
          setTitle('')
          setDescription('')
          setCategory('other')
          toast.success('Item created successfully')
        },
        onError: () => {
          toast.error('Failed to create item')
        },
      },
    )
  }

  const handleDelete = (id: string) => {
    deleteItem.mutate(id, {
      onSuccess: () => {
        toast.success('Item deleted successfully')
      },
      onError: () => {
        toast.error('Failed to delete item')
      },
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Items</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your user-scoped items (demo protected route with database)
        </p>
      </div>

      {/* Create Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create Item</CardTitle>
          <CardDescription>Add a new item to your collection</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title"
                required
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                maxLength={500}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as typeof category)}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" disabled={createItem.isPending || !title}>
              {createItem.isPending ? 'Creating...' : 'Create Item'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Items List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Items</CardTitle>
          <CardDescription>
            All items are scoped to your user account and stored in D1
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <p className="text-muted-foreground text-sm">Loading items...</p>}
          {!isLoading && items.length === 0 && (
            <p className="text-muted-foreground text-sm">No items yet. Create one above!</p>
          )}
          {!isLoading && items.length > 0 && (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between rounded-lg border p-4"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{item.title}</h3>
                      <span className="rounded-full bg-muted px-2 py-0.5 font-medium text-xs">
                        {item.category}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-muted-foreground text-sm">{item.description}</p>
                    )}
                    <p className="text-muted-foreground text-xs">
                      Created: {new Date(item.createdAt).toLocaleDateString()} · Updated:{' '}
                      {new Date(item.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    disabled={deleteItem.isPending}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
