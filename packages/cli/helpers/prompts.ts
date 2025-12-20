import { confirm, isCancel, outro, text } from '@clack/prompts'
import pc from 'picocolors'

export interface ProjectConfig {
  name: string
  description: string
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

  const description = await text({
    message: 'App description? (optional)',
    placeholder: 'My awesome fullstack app',
  })

  if (isCancel(description)) {
    outro(pc.red('Operation cancelled'))
    process.exit(0)
  }

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
    description: description as string,
    shouldInitGit: shouldInitGit as boolean,
    shouldInstall: shouldInstall as boolean,
  }
}
