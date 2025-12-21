import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { spinner } from '@clack/prompts'
import pc from 'picocolors'
import type { ProjectConfig } from './prompts.js'

export async function updateConfig(config: ProjectConfig): Promise<void> {
  const s = spinner()
  s.start('Updating configuration...')

  try {
    const configPath = join(config.name, 'packages/config/src/index.ts')
    let configContent = await readFile(configPath, 'utf-8')

    // Update app name
    configContent = configContent.replace(/appName: ['"]underdog['"]/, `appName: '${config.name}'`)

    // Update description
    if (config.description) {
      configContent = configContent.replace(
        /description: ['"].*?['"]/,
        `description: '${config.description}'`,
      )
    }

    // Update tagline
    if (config.tagline) {
      configContent = configContent.replace(/tagline: ['"].*?['"]/, `tagline: '${config.tagline}'`)
    }

    // Update SEO URL
    if (config.url) {
      configContent = configContent.replace(
        /url: ['"]https:\/\/your-domain\.com['"]/,
        `url: '${config.url}'`,
      )
      configContent = configContent.replace(
        /ogImage: ['"]https:\/\/your-domain\.com\/og-image\.png['"]/,
        `ogImage: '${config.url}/og-image.png'`,
      )
    }

    // Update GitHub URL
    if (config.githubUrl) {
      configContent = configContent.replace(
        /https:\/\/github\.com\/yourusername\/underdog/g,
        config.githubUrl,
      )
    }

    // Update Twitter handle
    if (config.twitterHandle) {
      configContent = configContent.replace(
        /twitter: ['"']['"]/,
        `twitter: '${config.twitterHandle}'`,
      )
    }

    await writeFile(configPath, configContent, 'utf-8')

    // Update root package.json
    const rootPkgPath = join(config.name, 'package.json')
    const rootPkg = JSON.parse(await readFile(rootPkgPath, 'utf-8'))
    rootPkg.name = `${config.name}-monorepo`
    await writeFile(rootPkgPath, `${JSON.stringify(rootPkg, null, 2)}\n`, 'utf-8')

    s.stop('Configuration updated ✓')
  } catch (error) {
    s.stop('Failed to update configuration')
    console.error(pc.red('Error:'), error)
    process.exit(1)
  }
}
