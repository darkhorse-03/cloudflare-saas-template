import { copyFile, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { spinner } from '@clack/prompts'
import pc from 'picocolors'
import type { ProjectConfig } from './prompts.js'

// Regex patterns - match any appName value
const APP_NAME_REGEX = /appName: ['"][^'"]+['"]/

export async function updateConfig(config: ProjectConfig): Promise<void> {
  const s = spinner()
  s.start('Updating configuration...')

  try {
    const configPath = join(config.name, 'packages/config/src/index.ts')
    let configContent = await readFile(configPath, 'utf-8')

    // Update app name
    configContent = configContent.replace(APP_NAME_REGEX, `appName: '${config.name}'`)

    await writeFile(configPath, configContent, 'utf-8')

    // Update root package.json
    const rootPkgPath = join(config.name, 'package.json')
    const rootPkg = JSON.parse(await readFile(rootPkgPath, 'utf-8'))
    rootPkg.name = `${config.name}-monorepo`
    await writeFile(rootPkgPath, `${JSON.stringify(rootPkg, null, 2)}\n`, 'utf-8')

    // Copy .env.example to .env
    const envExamplePath = join(config.name, '.env.example')
    const envPath = join(config.name, '.env')
    await copyFile(envExamplePath, envPath)

    s.stop('Configuration updated ✓')
  } catch (error) {
    s.stop('Failed to update configuration')
    console.error(pc.red('Error:'), error)
    process.exit(1)
  }
}
