import { confirm, isCancel, outro, text } from '@clack/prompts'
import pc from 'picocolors'

export interface ProjectConfig {
  name: string
  description: string
  tagline: string
  url: string
  githubUrl: string
  twitterHandle: string
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

  const tagline = await text({
    message: 'App tagline? (optional)',
    placeholder: 'Fullstack Cloudflare Workers Template',
  })

  if (isCancel(tagline)) {
    outro(pc.red('Operation cancelled'))
    process.exit(0)
  }

  const url = await text({
    message: 'Production URL? (optional)',
    placeholder: 'https://your-domain.com',
  })

  if (isCancel(url)) {
    outro(pc.red('Operation cancelled'))
    process.exit(0)
  }

  const githubUrl = await text({
    message: 'GitHub repository URL? (optional)',
    placeholder: `https://github.com/yourusername/${name}`,
  })

  if (isCancel(githubUrl)) {
    outro(pc.red('Operation cancelled'))
    process.exit(0)
  }

  const twitterHandle = await text({
    message: 'Twitter/X handle? (optional)',
    placeholder: '@yourhandle',
  })

  if (isCancel(twitterHandle)) {
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
    tagline: tagline as string,
    url: url as string,
    githubUrl: githubUrl as string,
    twitterHandle: twitterHandle as string,
    shouldInitGit: shouldInitGit as boolean,
    shouldInstall: shouldInstall as boolean,
  }
}
