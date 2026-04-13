import { execSync } from 'node:child_process'
import degit from 'degit'

const TEMPLATE_REPO = 'https://github.com/darkhorse-03/cloudflare-saas-template'
const CLONE_TIMEOUT = 30_000

/**
 * Clone the template repository to the target directory.
 * Removes packages/cli from the output (users don't need the CLI source).
 * Does NOT remove apps/docs — that's handled by the feature system.
 */
export async function cloneTemplate(targetDir: string): Promise<void> {
  const emitter = degit(TEMPLATE_REPO, {
    cache: false,
    force: true,
  })

  const cloneWithTimeout = Promise.race([
    emitter.clone(targetDir),
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error('Clone timeout — check your internet connection')),
        CLONE_TIMEOUT,
      ),
    ),
  ])

  await cloneWithTimeout

  // Remove CLI source from cloned template (users don't need it)
  execSync(`rm -rf ${targetDir}/packages/cli`, { stdio: 'ignore' })
}
