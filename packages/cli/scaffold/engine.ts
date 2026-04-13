import { existsSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { join, extname } from 'node:path'
import type { FeatureName, ScaffoldConfig, StrippableFeature } from '../types.js'
import { generateContextFiles } from './claude-md.js'
import { generateConfig } from './config-gen.js'
import { FEATURE_DEPENDENCIES } from './dependencies.js'
import { FEATURE_OWNED_PATHS } from './directories.js'
import { ALL_FEATURES } from './features.js'
import { FILE_REPLACEMENTS } from './replacements.js'
import { stripFeatureBlocks } from './strip.js'

/** File extensions that may contain feature markers */
const STRIPPABLE_EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.env',
  '.yaml',
  '.yml',
  '.sh',
])

/** Directories to skip when walking the file tree */
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', '.turbo'])

/**
 * Main scaffold orchestrator.
 * Clones the full template, then strips unselected features.
 */
export async function scaffold(config: ScaffoldConfig): Promise<ScaffoldResult> {
  const { projectName, features, targetDir } = config
  const selectedFeatures = new Set<FeatureName>(features)

  // Compute which features to remove (all unselected + demo always removed)
  const removedFeatures = new Set<StrippableFeature>()
  for (const feature of ALL_FEATURES) {
    if (!selectedFeatures.has(feature)) {
      removedFeatures.add(feature)
    }
  }
  removedFeatures.add('demo') // always strip demo content

  let filesDeleted = 0
  let filesStripped = 0

  // Step 1: Apply file replacements (before stripping, since these overwrite entire files)
  for (const replacement of FILE_REPLACEMENTS) {
    if (replacement.condition(removedFeatures)) {
      const filePath = join(targetDir, replacement.path)
      if (existsSync(filePath)) {
        writeFileSync(filePath, replacement.content)
      }
    }
  }

  // Step 2: Delete feature-owned directories and files
  for (const feature of removedFeatures) {
    const paths = FEATURE_OWNED_PATHS[feature] || []
    for (const relativePath of paths) {
      const fullPath = join(targetDir, relativePath)
      if (existsSync(fullPath)) {
        rmSync(fullPath, { recursive: true, force: true })
        filesDeleted++
      }
    }
  }

  // Step 3: Walk all remaining files and strip feature markers
  filesStripped = walkAndStrip(targetDir, removedFeatures)

  // Step 4: Remove unused dependencies from package.json files
  removeDependencies(targetDir, removedFeatures)

  // Step 5: Generate tailored config (appName, .env)
  generateConfig(targetDir, projectName, removedFeatures)

  // Step 6: Generate CLAUDE.md and other agent context files
  generateContextFiles(targetDir, projectName, selectedFeatures)

  // Step 7: Clean up empty directories
  cleanEmptyDirs(targetDir)

  return {
    selectedFeatures: [...selectedFeatures],
    removedFeatures: [...removedFeatures],
    filesDeleted,
    filesStripped,
  }
}

export interface ScaffoldResult {
  selectedFeatures: FeatureName[]
  removedFeatures: StrippableFeature[]
  filesDeleted: number
  filesStripped: number
}

/**
 * Recursively walk the project directory, stripping feature markers from all
 * applicable files. Returns the count of files that were modified.
 */
function walkAndStrip(dir: string, removedFeatures: Set<StrippableFeature>): number {
  let count = 0

  const entries = readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = join(dir, entry.name)

    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) {
        continue
      }
      count += walkAndStrip(fullPath, removedFeatures)
    } else if (entry.isFile()) {
      count += stripFileIfNeeded(fullPath, entry.name, removedFeatures)
    }
  }

  return count
}

function stripFileIfNeeded(
  fullPath: string,
  fileName: string,
  removedFeatures: Set<StrippableFeature>,
): number {
  const ext = extname(fileName)
  const isStrippable = STRIPPABLE_EXTENSIONS.has(ext) || fileName.startsWith('.env')
  if (!isStrippable) {
    return 0
  }

  const original = readFileSync(fullPath, 'utf-8')
  const stripped = stripFeatureBlocks(original, removedFeatures)
  if (stripped !== original) {
    writeFileSync(fullPath, stripped)
    return 1
  }
  return 0
}

/**
 * Remove feature-specific npm packages from package.json files.
 */
function removeDependencies(projectDir: string, removedFeatures: Set<StrippableFeature>): void {
  const removals = collectRemovals(removedFeatures)
  applyRemovals(projectDir, removals)
}

function collectRemovals(removedFeatures: Set<StrippableFeature>): Map<string, Set<string>> {
  const removals = new Map<string, Set<string>>()

  for (const feature of removedFeatures) {
    const deps = FEATURE_DEPENDENCIES[feature]
    if (!deps || deps.packages.length === 0) {
      continue
    }

    for (const location of deps.locations) {
      const existing = removals.get(location) ?? new Set<string>()
      for (const pkg of deps.packages) {
        existing.add(pkg)
      }
      removals.set(location, existing)
    }
  }

  return removals
}

function applyRemovals(projectDir: string, removals: Map<string, Set<string>>): void {
  for (const [location, packages] of removals) {
    const pkgPath = join(projectDir, location, 'package.json')
    if (!existsSync(pkgPath)) {
      continue
    }

    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
    let modified = false

    for (const pkgName of packages) {
      if (pkg.dependencies?.[pkgName]) {
        delete pkg.dependencies[pkgName]
        modified = true
      }
      if (pkg.devDependencies?.[pkgName]) {
        delete pkg.devDependencies[pkgName]
        modified = true
      }
    }

    if (modified) {
      writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
    }
  }
}

/**
 * Remove empty directories left after file deletions.
 * Walks bottom-up so nested empty dirs are cleaned properly.
 */
function cleanEmptyDirs(dir: string): void {
  if (!(existsSync(dir) && statSync(dir).isDirectory())) return

  const entries = readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    if (entry.isDirectory() && !SKIP_DIRS.has(entry.name)) {
      cleanEmptyDirs(join(dir, entry.name))
    }
  }

  // Re-read after recursive cleanup
  const remaining = readdirSync(dir)
  if (remaining.length === 0) {
    rmSync(dir, { recursive: true })
  }
}
