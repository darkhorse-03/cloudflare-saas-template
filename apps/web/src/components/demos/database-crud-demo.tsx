import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Check, Database, Loader2, Plus, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/api'

type DemoTodo = {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

export function DatabaseCRUDDemo() {
  const [newTodoText, setNewTodoText] = useState('')
  const queryClient = useQueryClient()

  // Fetch todos
  const { data, isLoading, isError } = useQuery({
    queryKey: ['demo-todos'],
    queryFn: async () => {
      const res = await api.demo.todos.$get()
      if (!res.ok) {
        throw new Error('Failed to fetch todos')
      }
      return res.json()
    },
  })

  // Create todo mutation
  const createMutation = useMutation({
    mutationFn: async (text: string) => {
      const res = await api.demo.todos.$post({
        json: { text },
      })
      if (!res.ok) {
        throw new Error('Failed to create todo')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demo-todos'] })
      setNewTodoText('')
      toast.success('Todo created!')
    },
    onError: () => {
      toast.error('Failed to create todo')
    },
  })

  // Delete todo mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.demo.todos[':id'].$delete({
        param: { id },
      })
      if (!res.ok) {
        throw new Error('Failed to delete todo')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demo-todos'] })
      toast.success('Todo deleted!')
    },
    onError: () => {
      toast.error('Failed to delete todo')
    },
  })

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodoText.trim()) {
      return
    }
    createMutation.mutate(newTodoText)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Database className="size-5 text-primary" />
            <CardTitle>Type-Safe Database (D1 + Drizzle)</CardTitle>
          </div>
          <div className="rounded-full bg-green-500/10 px-3 py-1 font-mono text-green-600 text-xs dark:text-green-400">
            Save 6 hours
          </div>
        </div>
        <CardDescription>
          Create and delete todos. All types auto-generated. Full IDE autocomplete.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Add Todo Form */}
        <form className="mb-4 flex gap-2" onSubmit={handleAddTodo}>
          <Input
            disabled={createMutation.isPending}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="Add a new todo..."
            value={newTodoText}
          />
          <Button disabled={createMutation.isPending || !newTodoText.trim()} type="submit">
            {createMutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                <Plus className="mr-2 size-4" />
                Add
              </>
            )}
          </Button>
        </form>

        {/* Todos List */}
        <div className="space-y-2">
          {isLoading && (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="mr-2 size-4 animate-spin" />
              Loading todos...
            </div>
          )}

          {isError && (
            <div className="flex items-center justify-center gap-2 py-8 text-destructive">
              <X className="size-4" />
              <span>Failed to load todos</span>
            </div>
          )}

          {data?.todos && data.todos.length === 0 && (
            <div className="py-8 text-center text-muted-foreground text-sm">
              No todos yet. Add one above!
            </div>
          )}

          {data?.todos?.map((todo: DemoTodo) => (
            <div
              className="flex items-center justify-between rounded-lg border bg-card p-3 transition-colors hover:bg-accent"
              key={todo.id}
            >
              <div className="flex items-center gap-3">
                <Check className="size-4 text-green-500" />
                <span className="text-sm">{todo.text}</span>
              </div>
              <Button
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(todo.id)}
                size="sm"
                variant="ghost"
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4 text-muted-foreground hover:text-destructive" />
                )}
              </Button>
            </div>
          ))}
        </div>

        {/* Type Safety Note */}
        <div className="mt-4 rounded-lg bg-muted/50 p-3 text-sm">
          <div className="mb-1 font-medium">🎯 Type Safety in Action:</div>
          <div className="text-muted-foreground text-xs">
            All API calls are fully typed. Your IDE knows the exact shape of requests and responses.
            Catch bugs at compile time.
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
