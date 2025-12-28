import { loader } from 'fumadocs-core/source'
import { createElement } from 'react'
// biome-ignore lint/performance/noNamespaceImport: need all icons
import * as icons from 'lucide-react'
import { docs } from 'fumadocs-mdx:collections/server'

export const source = loader({
  source: docs.toFumadocsSource(),
  baseUrl: '/',
  icon(icon) {
    if (!icon) {
      return
    }

    if (icon in icons) {
      // biome-ignore lint/performance/noDynamicNamespaceImportAccess: access all icons dynamically
      return createElement(icons[icon as keyof typeof icons] as React.ElementType)
    }
  },
})
