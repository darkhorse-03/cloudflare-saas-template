import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { spinner } from '@clack/prompts'
import pc from 'picocolors'
import type { ProjectConfig } from './prompts.js'

// Regex patterns
const APP_NAME_REGEX = /appName: ['"]underdog['"]/
const DESCRIPTION_REGEX = /description: ['"].*?['"]/
const TAGLINE_REGEX = /tagline: ['"].*?['"]/
const URL_REGEX = /url: ['"]https:\/\/your-domain\.com['"]/
const OG_IMAGE_REGEX = /ogImage: ['"]https:\/\/your-domain\.com\/og-image\.png['"]/
const GITHUB_URL_REGEX = /https:\/\/github\.com\/yourusername\/underdog/g
const TWITTER_REGEX = /twitter: ['"']['"]/

export async function updateConfig(config: ProjectConfig): Promise<void> {
  const s = spinner()
  s.start('Updating configuration...')

  try {
    const configPath = join(config.name, 'packages/config/src/index.ts')
    let configContent = await readFile(configPath, 'utf-8')

    // Update app name
    configContent = configContent.replace(APP_NAME_REGEX, `appName: '${config.name}'`)

    // Update description
    if (config.description) {
      configContent = configContent.replace(
        DESCRIPTION_REGEX,
        `description: '${config.description}'`,
      )
    }

    // Update tagline
    if (config.tagline) {
      configContent = configContent.replace(TAGLINE_REGEX, `tagline: '${config.tagline}'`)
    }

    // Update SEO URL
    if (config.url) {
      configContent = configContent.replace(URL_REGEX, `url: '${config.url}'`)
      configContent = configContent.replace(OG_IMAGE_REGEX, `ogImage: '${config.url}/og-image.png'`)
    }

    // Update GitHub URL
    if (config.githubUrl) {
      configContent = configContent.replace(GITHUB_URL_REGEX, config.githubUrl)
    }

    // Update Twitter handle
    if (config.twitterHandle) {
      configContent = configContent.replace(TWITTER_REGEX, `twitter: '${config.twitterHandle}'`)
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
