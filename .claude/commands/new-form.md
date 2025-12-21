---
description: Scaffold a new form with TanStack Form + Zod validation
arguments:
  - name: form_name
    description: Form name in kebab-case (e.g., "contact-form", "sign-up-form")
    required: true
---

Create a new form component `$ARGUMENTS.form_name` with TanStack Form and Zod validation:

1. **File location**: `apps/web/src/components/forms/$ARGUMENTS.form_name.tsx`

2. **Schema location**: `apps/web/src/schemas/$ARGUMENTS.form_name.ts`

3. **Create Zod schema first**:
```ts
// apps/web/src/schemas/$ARGUMENTS.form_name.ts
import { z } from 'zod'

export const ${ARGUMENTS.form_name}Schema = z.object({
  // Add your fields here
  // Example:
  // email: z.string().email('Invalid email address'),
  // password: z.string().min(8, 'Must be at least 8 characters'),
})

export type ${ARGUMENTS.form_name}Input = z.infer<typeof ${ARGUMENTS.form_name}Schema>
```

4. **Basic form template**:
```tsx
// apps/web/src/components/forms/$ARGUMENTS.form_name.tsx
import { useForm } from '@tanstack/react-form'
import { ${ARGUMENTS.form_name}Schema } from '@/schemas/$ARGUMENTS.form_name'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ${ARGUMENTS.form_name}Props {
  onSubmit: (data: unknown) => void | Promise<void>
}

export function ${ARGUMENTS.form_name}({ onSubmit }: ${ARGUMENTS.form_name}Props) {
  const form = useForm({
    defaultValues: {
      // Add default values matching your schema
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      {/* Add fields here - see examples below */}

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button
            className="w-full"
            disabled={!canSubmit}
            type="submit"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
```

5. **Example: Text input field with validation**:
```tsx
<form.Field
  name="email"
  validators={{
    onChange: ${ARGUMENTS.form_name}Schema.shape.email,
  }}
>
  {(field) => (
    <div className="space-y-2">
      <Label htmlFor={field.name}>Email</Label>
      <Input
        autoComplete="email"
        id={field.name}
        name={field.name}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        placeholder="you@example.com"
        type="email"
        value={field.state.value}
      />
      {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
        <p className="text-destructive text-sm" role="alert">
          {field.state.meta.errors.map((error) => error?.message).join(', ')}
        </p>
      )}
    </div>
  )}
</form.Field>
```

6. **Example: Password field with helper text**:
```tsx
<form.Field
  name="password"
  validators={{
    onChange: ${ARGUMENTS.form_name}Schema.shape.password,
  }}
>
  {(field) => (
    <div className="space-y-2">
      <Label htmlFor={field.name}>Password</Label>
      <Input
        autoComplete="new-password"
        id={field.name}
        name={field.name}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        placeholder="••••••••"
        type="password"
        value={field.state.value}
      />
      {field.state.meta.isTouched && field.state.meta.errors.length > 0 ? (
        <p className="text-destructive text-sm" role="alert">
          {field.state.meta.errors.map((error) => error?.message).join(', ')}
        </p>
      ) : (
        <p className="text-muted-foreground text-xs">Must be at least 8 characters</p>
      )}
    </div>
  )}
</form.Field>
```

7. **Example: With async validation (debounced)**:
```tsx
<form.Field
  name="username"
  asyncDebounceMs={500}
  validators={{
    onChange: ${ARGUMENTS.form_name}Schema.shape.username,
    onChangeAsync: z.string().refine(
      async (value) => {
        // Check if username is available
        const res = await fetch(`/api/check-username?username=${value}`)
        return res.ok
      },
      { message: 'Username is already taken' }
    ),
  }}
>
  {(field) => (
    <div className="space-y-2">
      <Label htmlFor={field.name}>Username</Label>
      <Input
        id={field.name}
        name={field.name}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        value={field.state.value}
      />
      {field.state.meta.isValidating && (
        <p className="text-muted-foreground text-sm">Checking availability...</p>
      )}
      {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
        <p className="text-destructive text-sm" role="alert">
          {field.state.meta.errors.map((error) => error?.message).join(', ')}
        </p>
      )}
    </div>
  )}
</form.Field>
```

8. **Example: With React Query mutation**:
```tsx
import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export function ${ARGUMENTS.form_name}() {
  const mutation = useMutation({
    mutationFn: async (data: ${ARGUMENTS.form_name}Input) => {
      const res = await apiClient.endpoint.$post({ json: data })
      if (!res.ok) throw new Error('Failed to submit')
      return res.json()
    },
    onSuccess: () => {
      // Handle success (e.g., redirect, show toast)
    },
  })

  const form = useForm({
    defaultValues: { /* ... */ },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value)
    },
  })

  return (
    <form onSubmit={(e) => { /* ... */ }}>
      {/* Fields */}

      {mutation.error && (
        <p className="text-destructive text-sm" role="alert">
          {mutation.error.message}
        </p>
      )}

      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <Button disabled={!canSubmit || mutation.isPending} type="submit">
            {isSubmitting || mutation.isPending ? 'Submitting...' : 'Submit'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
```

9. **Example: Textarea field**:
```tsx
import { Textarea } from '@/components/ui/textarea'

<form.Field
  name="message"
  validators={{
    onChange: ${ARGUMENTS.form_name}Schema.shape.message,
  }}
>
  {(field) => (
    <div className="space-y-2">
      <Label htmlFor={field.name}>Message</Label>
      <Textarea
        id={field.name}
        name={field.name}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        placeholder="Your message..."
        rows={4}
        value={field.state.value}
      />
      {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
        <p className="text-destructive text-sm" role="alert">
          {field.state.meta.errors.map((error) => error?.message).join(', ')}
        </p>
      )}
    </div>
  )}
</form.Field>
```

10. **Example: Select field**:
```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

<form.Field
  name="category"
  validators={{
    onChange: ${ARGUMENTS.form_name}Schema.shape.category,
  }}
>
  {(field) => (
    <div className="space-y-2">
      <Label htmlFor={field.name}>Category</Label>
      <Select
        name={field.name}
        onValueChange={(value) => field.handleChange(value)}
        value={field.state.value}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </Select>
      {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
        <p className="text-destructive text-sm" role="alert">
          {field.state.meta.errors.map((error) => error?.message).join(', ')}
        </p>
      )}
    </div>
  )}
</form.Field>
```

## Best Practices

- **Validation timing**: Use `onChange` for real-time feedback, `onBlur` for less intrusive validation
- **Accessibility**: Always include `<Label>`, use `role="alert"` for errors, proper `autoComplete` attributes
- **Loading states**: Use `form.Subscribe` to disable submit button during submission
- **Error display**: Show field errors immediately below the input
- **Async validation**: Use `asyncDebounceMs` to prevent excessive API calls
- **Type safety**: TanStack Form automatically infers types from your Zod schema when using Standard Schema

## Installing Dependencies

If not already installed:
```bash
bun add @tanstack/react-form zod
```

Follow patterns in `react-component-patterns` skill.
