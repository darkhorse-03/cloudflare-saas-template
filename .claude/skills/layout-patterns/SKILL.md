# Layout & Styling Patterns

## Container Pattern

**Use consistent max-width containers across all pages:**

```tsx
// ✅ Standard container pattern
<div className="container max-w-6xl mx-auto px-4 py-12">
  {/* Page content */}
</div>

// ❌ Don't use inconsistent widths
<div className="container max-w-4xl mx-auto px-4 py-12">  // Wrong!
```

**Standard width:** `max-w-6xl` (1152px)

**Apply to:**
- Header container
- Footer container
- Page content containers

## Responsive Design

```tsx
// ✅ Mobile-first responsive classes
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

// ✅ Hide on mobile, show on desktop
<nav className="hidden md:flex items-center gap-1">

// ✅ Show on mobile, hide on desktop
<div className="md:hidden">
```

## Button Semantics

```tsx
// ✅ Use <button> for interactions (not <div>)
<button
  type="button"
  onClick={handleClick}
  className="px-4 py-2 bg-primary text-white rounded"
>
  Click Me
</button>

// ❌ Don't use divs for clickable elements
<div onClick={handleClick}>Click Me</div>
```

## Accessibility Requirements

**Screen reader only text:**
```tsx
<span className="sr-only">Hidden from visual but read by screen readers</span>
```

**Icon-only buttons:**
```tsx
<Button variant="ghost" size="icon">
  <Menu className="h-5 w-5" />
  <span className="sr-only">Open menu</span>
</Button>
```

**Dialog/Sheet titles:**
```tsx
<SheetContent>
  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
  <SheetDescription className="sr-only">
    Navigate to different pages
  </SheetDescription>
  {/* Visible content */}
</SheetContent>
```

**Images:**
```tsx
// ✅ Always provide alt text
<img src="/logo.png" alt="Company logo" />

// ❌ Never empty alt
<img src="/logo.png" alt="" />  // Unless purely decorative
```

## Spacing Conventions

**Vertical spacing:**
- Page padding: `py-12`
- Section margin bottom: `mb-16`
- Subsection margin bottom: `mb-8`
- Element margin bottom: `mb-4`

**Horizontal spacing:**
- Page padding: `px-4`
- Grid gaps: `gap-6`
- Flex gaps: `gap-4` or `gap-1` (for tight groups)

## Typography Scale

```tsx
// Headings
<h1 className="text-4xl md:text-5xl font-bold">  // Page title
<h2 className="text-2xl font-semibold">          // Section title
<h3 className="text-lg font-medium">             // Subsection

// Body text
<p className="text-muted-foreground">            // Secondary text
<p className="text-sm text-muted-foreground">    // Small secondary text
```

## Layout Structure

**Page layout:**
```tsx
function MyPage() {
  return (
    <Layout>
      <div className="container max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Title</h1>
          <p className="text-lg text-muted-foreground">Description</p>
        </section>

        {/* Content Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-center mb-6">Section</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Grid items */}
          </div>
        </section>
      </div>
    </Layout>
  )
}
```

## Card Layouts

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => (
    <Card key={item.id}>
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {item.content}
      </CardContent>
    </Card>
  ))}
</div>
```

## Mobile Navigation

**Sheet (mobile menu):**
```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon">
      <Menu className="h-5 w-5" />
      <span className="sr-only">Toggle menu</span>
    </Button>
  </SheetTrigger>
  <SheetContent side="right" className="w-[280px]">
    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
    {/* Menu content */}
  </SheetContent>
</Sheet>
```

## Common Patterns

**Never:**
- ❌ Use inconsistent container widths
- ❌ Use `<div>` with `onClick` (use `<button>`)
- ❌ Forget accessibility attributes (alt, aria-label, sr-only)
- ❌ Use HTML `<a>` tags for internal navigation

**Always:**
- ✅ Use `container max-w-6xl mx-auto px-4` for page containers
- ✅ Use TanStack Router `Link` for navigation
- ✅ Use shadcn components instead of custom UI primitives
- ✅ Provide `sr-only` labels for screen reader accessibility
- ✅ Use semantic HTML (`button`, `nav`, `header`, `footer`)
