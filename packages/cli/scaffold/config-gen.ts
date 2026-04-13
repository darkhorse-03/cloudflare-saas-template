import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'node:fs'
import { join } from 'node:path'
import type { StrippableFeature } from '../types.js'
import { stripFeatureBlocks } from './strip.js'

/**
 * Post-strip config generation:
 * 1. Update appName in packages/config/src/index.ts
 * 2. Update root package.json name
 * 3. Generate .env from stripped .env.example
 */
export function generateConfig(
  projectDir: string,
  projectName: string,
  removedFeatures: Set<StrippableFeature>,
): void {
  updateAppName(projectDir, projectName)
  updatePackageJsonName(projectDir, projectName)
  generateEnvFile(projectDir, removedFeatures)
}

function updateAppName(projectDir: string, projectName: string): void {
  const configPath = join(projectDir, 'packages/config/src/index.ts')
  if (!existsSync(configPath)) return

  let content = readFileSync(configPath, 'utf-8')
  content = content.replace(/appName: ['"][^'"]+['"]/, `appName: '${projectName}'`)
  writeFileSync(configPath, content)
}

function updatePackageJsonName(projectDir: string, projectName: string): void {
  const pkgPath = join(projectDir, 'package.json')
  if (!existsSync(pkgPath)) return

  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
  pkg.name = `${projectName}-monorepo`
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
}

function generateEnvFile(projectDir: string, removedFeatures: Set<StrippableFeature>): void {
  const examplePath = join(projectDir, '.env.example')
  const envPath = join(projectDir, '.env')
  if (!existsSync(examplePath)) return

  // Strip feature-gated sections from .env.example using # markers
  const content = readFileSync(examplePath, 'utf-8')
  const stripped = stripFeatureBlocks(content, removedFeatures)
  writeFileSync(examplePath, stripped)

  // Copy stripped .env.example to .env
  writeFileSync(envPath, stripped)
}
