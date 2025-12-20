import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { spinner } from '@clack/prompts'
import pc from 'picocolors'

export async function updateConfig(projectName: string, description: string): Promise<void> {
  const s = spinner()
  s.start('Updating configuration...')

  try {
    const configPath = join(projectName, 'packages/config/src/index.ts')
    let configContent = await readFile(configPath, 'utf-8')

    configContent = configContent.replace(/appName: ['"]underdog['"]/, `appName: '${projectName}'`)

    if (description) {
      configContent = configContent.replace(
        /description: ['"].*?['"]/,
        `description: '${description}'`,
      )
    }

    configContent = configContent.replace(
      /https:\/\/github\.com\/yourusername\/underdog/g,
      `https://github.com/yourusername/${projectName}`,
    )

    await writeFile(configPath, configContent, 'utf-8')

    const rootPkgPath = join(projectName, 'package.json')
    const rootPkg = JSON.parse(await readFile(rootPkgPath, 'utf-8'))
    rootPkg.name = `${projectName}-monorepo`
    await writeFile(rootPkgPath, `${JSON.stringify(rootPkg, null, 2)}\n`, 'utf-8')

    s.stop('Configuration updated ✓')
  } catch (error) {
    s.stop('Failed to update configuration')
    console.error(pc.red('Error:'), error)
    process.exit(1)
  }
}
