import { execSync } from 'node:child_process'
import { spinner } from '@clack/prompts'
import pc from 'picocolors'

export function installDependencies(projectName: string): void {
  const s = spinner()
  s.start('Installing dependencies (this may take a minute)...')

  try {
    execSync('bun install', { cwd: projectName, stdio: 'ignore' })
    s.stop('Dependencies installed ✓')
  } catch (_error) {
    s.stop('Dependency installation skipped')
    console.warn(pc.yellow('Warning: Could not install dependencies'))
    console.log(pc.dim('You can run `bun install` manually'))
  }
}
