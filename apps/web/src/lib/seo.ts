import { config } from '@repo/config'

interface SeoOptions {
  title?: string
  description?: string
  image?: string
  noIndex?: boolean
}

export function seo({ title, description, image, noIndex }: SeoOptions = {}) {
  const fullTitle = title ? `${title} | ${config.appName}` : config.seo.title
  const desc = description ?? config.seo.description
  const ogImage = image ?? config.seo.ogImage

  const tags: Record<string, string>[] = [
    { title: fullTitle },
    { name: 'description', content: desc },
    // Open Graph
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: config.seo.url },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: desc },
    { property: 'og:image', content: ogImage },
    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:url', content: config.seo.url },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: desc },
    { name: 'twitter:image', content: ogImage },
  ]

  if (noIndex) {
    tags.push({ name: 'robots', content: 'noindex,nofollow' })
  }

  return tags
}
