import { execSync } from 'node:child_process'
import { spinner } from '@clack/prompts'
import pc from 'picocolors'

export function initGit(projectName: string): void {
  const s = spinner()
  s.start('Initializing git...')

  try {
    execSync('git init', { cwd: projectName, stdio: 'ignore' })
    execSync('git add .', { cwd: projectName, stdio: 'ignore' })
    execSync('git commit -m "Initial commit from create-underdog-app"', {
      cwd: projectName,
      stdio: 'ignore',
    })
    s.stop('Git initialized ✓')
  } catch (_error) {
    s.stop('Git initialization skipped')
    console.warn(pc.yellow('Warning: Could not initialize git'))
  }
}
