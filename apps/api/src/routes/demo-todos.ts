import type { DemoTodo } from '@repo/shared'
import { Hono } from 'hono'
import type { AppContext } from '../env'

// In-memory demo todos storage
const demoTodos: DemoTodo[] = [
  { id: '1', text: 'Try the auth demo above', completed: false, createdAt: Date.now() - 3_600_000 },
  { id: '2', text: 'Create a new todo', completed: false, createdAt: Date.now() - 1_800_000 },
]

export const demoTodosRoutes = new Hono<AppContext>()
  .get('/', (c) => c.json({ todos: demoTodos }))
  .post('/', async (c) => {
    const body = await c.req.json<{ text: string }>()
    const newTodo: DemoTodo = {
      id: crypto.randomUUID(),
      text: body.text,
      completed: false,
      createdAt: Date.now(),
    }
    demoTodos.push(newTodo)
    return c.json({ todo: newTodo }, 201)
  })
  .delete('/:id', (c) => {
    const id = c.req.param('id')
    const index = demoTodos.findIndex((todo) => todo.id === id)
    if (index === -1) {
      return c.json({ error: 'Todo not found' }, 404)
    }
    demoTodos.splice(index, 1)
    return c.json({ success: true })
  })
