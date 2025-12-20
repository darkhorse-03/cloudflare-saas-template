import { execSync } from 'node:child_process'
import { spinner } from '@clack/prompts'
import degit from 'degit'
import pc from 'picocolors'

const TEMPLATE_REPO = 'https://github.com/sarim2000/underdog-template'
const CLONE_TIMEOUT = 30000

export async function cloneTemplate(projectName: string): Promise<void> {
  const s = spinner()
  s.start('Cloning template...')

  try {
    const emitter = degit(TEMPLATE_REPO, {
      cache: false,
      force: true,
    })

    const cloneWithTimeout = Promise.race([
      emitter.clone(projectName),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error('Clone timeout - please check your internet connection')),
          CLONE_TIMEOUT,
        ),
      ),
    ])

    await cloneWithTimeout

    // Remove CLI from cloned template (users don't need it)
    execSync(`rm -rf ${projectName}/packages/cli`, { stdio: 'ignore' })

    s.stop('Template cloned ✓')
  } catch (error) {
    s.stop('Failed to clone template')
    console.error(pc.red('Error:'), error instanceof Error ? error.message : error)
    process.exit(1)
  }
}
