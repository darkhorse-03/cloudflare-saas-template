#!/usr/bin/env bun
/**
 * Test the scaffold engine by copying the template and stripping features.
 *
 * Usage:
 *   bun packages/cli/test-scaffold.ts                          # test with minimal features (core only)
 *   bun packages/cli/test-scaffold.ts storage,payments,email   # test with specific features
 *   bun packages/cli/test-scaffold.ts all                      # test with all features
 */

import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { scaffold } from './scaffold/engine.js'
import { ALL_FEATURES } from './scaffold/features.js'
import type { FeatureName } from './types.js'

const ROOT = resolve(import.meta.dirname, '../..')
const TEST_DIR = join('/tmp', 'zynth-test-scaffold')

// Parse features from CLI args
const arg = process.argv[2]
let features: FeatureName[]

if (arg === 'all') {
  features = [...ALL_FEATURES]
} else if (arg) {
  features = arg.split(',').map((f) => f.trim()) as FeatureName[]
} else {
  features = [] // minimal: core only
}

console.log(
  `\n🧪 Testing scaffold with features: ${features.length > 0 ? features.join(', ') : '(core only)'}\n`,
)

// Clean previous test
if (existsSync(TEST_DIR)) {
  rmSync(TEST_DIR, { recursive: true, force: true })
}

// Copy template (skip node_modules, dist, .git, .turbo)
console.log('📦 Copying template...')
cpSync(ROOT, TEST_DIR, {
  recursive: true,
  filter: (src) => {
    const rel = src.replace(ROOT, '')
    const skip = ['/node_modules', '/dist/', '/.git/', '/.git', '/.turbo', '.test-scaffold']
    return !skip.some((s) => rel.includes(s))
  },
})

// Remove CLI source from test dir (as clone.ts would)
rmSync(join(TEST_DIR, 'packages/cli'), { recursive: true, force: true })

// Run scaffold engine
console.log('✂️  Running scaffold engine...')
const result = await scaffold({
  projectName: 'test-app',
  features,
  targetDir: TEST_DIR,
  shouldInitGit: false,
})

console.log('\n✅ Scaffold complete:')
console.log(`   Selected: ${result.selectedFeatures.join(', ') || '(none)'}`)
console.log(`   Removed:  ${result.removedFeatures.join(', ')}`)
console.log(`   Files deleted: ${result.filesDeleted}`)
console.log(`   Files stripped: ${result.filesStripped}`)
console.log(`\n📁 Output at: ${TEST_DIR}`)
console.log('\nTo verify it builds:')
console.log(`   cd ${TEST_DIR} && bun install && bunx tsc --noEmit -p apps/api/tsconfig.json`)
