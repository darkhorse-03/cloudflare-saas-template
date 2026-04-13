import type { StrippableFeature } from '../types.js'

/**
 * Strip feature-gated blocks from file content using marker comments.
 *
 * Markers:
 *   // @feature <name>    (for .ts, .tsx, .js, .jsx)
 *   // @end <name>
 *   # @feature <name>     (for .env, .yaml, .yml, .sh)
 *   # @end <name>
 *
 * Lines between markers for removed features are dropped.
 * Marker lines themselves are always dropped (even for kept features).
 */
export function stripFeatureBlocks(
  content: string,
  removedFeatures: Set<StrippableFeature>,
): string {
  const lines = content.split('\n')
  const result: string[] = []
  const skipStack: string[] = []

  for (const line of lines) {
    // Match both // and # comment styles
    const startMatch = line.match(/(?:\/\/|#)\s*@feature\s+([\w-]+)/)
    const endMatch = line.match(/(?:\/\/|#)\s*@end\s+([\w-]+)/)

    if (startMatch) {
      const feature = startMatch[1]
      if (removedFeatures.has(feature as StrippableFeature)) {
        skipStack.push(feature)
      }
      // Always strip marker lines (even for kept features)
      continue
    }

    if (endMatch) {
      const feature = endMatch[1]
      if (skipStack.length > 0 && skipStack[skipStack.length - 1] === feature) {
        skipStack.pop()
      }
      // Always strip marker lines
      continue
    }

    // Keep line only if not inside a removed feature block
    if (skipStack.length === 0) {
      result.push(line)
    }
  }

  if (skipStack.length > 0) {
    throw new Error(`Unclosed @feature marker(s): ${skipStack.join(', ')}. Check marker pairs.`)
  }

  // Collapse consecutive blank lines to at most one
  return collapseBlankLines(result.join('\n'))
}

function collapseBlankLines(content: string): string {
  return content.replace(/\n{3,}/g, '\n\n')
}
