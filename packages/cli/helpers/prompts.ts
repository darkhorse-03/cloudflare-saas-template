import { confirm, isCancel, outro, text } from '@clack/prompts'
import pc from 'picocolors'

export interface ProjectConfig {
  name: string
  shouldInitGit: boolean
  shouldInstall: boolean
}

export async function getProjectConfig(projectName?: string): Promise<ProjectConfig> {
  const nameInput = await text({
    message: 'What is your project name?',
    placeholder: projectName || 'my-saas-app',
    initialValue: projectName,
    defaultValue: 'my-saas-app',
  })

  if (isCancel(nameInput)) {
    outro(pc.red('Operation cancelled'))
    process.exit(0)
  }

  const name = nameInput || 'my-saas-app'

  const shouldInitGit = await confirm({
    message: 'Initialize git repository?',
    initialValue: true,
  })

  if (isCancel(shouldInitGit)) {
    outro(pc.red('Operation cancelled'))
    process.exit(0)
  }

  const shouldInstall = await confirm({
    message: 'Install dependencies?',
    initialValue: true,
  })

  if (isCancel(shouldInstall)) {
    outro(pc.red('Operation cancelled'))
    process.exit(0)
  }

  return {
    name,
    shouldInitGit: shouldInitGit as boolean,
    shouldInstall: shouldInstall as boolean,
  }
}
