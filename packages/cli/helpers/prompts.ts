import { confirm, isCancel, multiselect, outro, select, text } from '@clack/prompts'
import pc from 'picocolors'
import type { AgentInfo } from '../launcher/detect.js'
import { FEATURE_CATALOG, ALL_FEATURES } from '../scaffold/features.js'
import type { AgentName, FeatureName, ScaffoldConfig } from '../types.js'

export interface ProjectConfig {
  name: string
  shouldInitGit: boolean
  shouldInstall: boolean
}

export async function getProjectName(projectName?: string): Promise<string> {
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

  return nameInput || 'my-saas-app'
}

export async function selectFeatures(): Promise<FeatureName[]> {
  const selected = await multiselect({
    message: 'Which features do you want?',
    options: ALL_FEATURES.map((name) => ({
      value: name,
      label: FEATURE_CATALOG[name].label,
      hint: FEATURE_CATALOG[name].description,
    })),
    initialValues: ['email', 'jobs', 'marketing', 'google-oauth'] as FeatureName[],
    required: false,
  })

  if (isCancel(selected)) {
    outro(pc.red('Operation cancelled'))
    process.exit(0)
  }

  return selected as FeatureName[]
}

export async function selectAgent(agents: AgentInfo[]): Promise<AgentName> {
  const selected = await select({
    message: 'Multiple AI agents detected. Which one to use?',
    options: agents.map((a) => ({
      value: a.name,
      label: a.displayName,
    })),
  })

  if (isCancel(selected)) {
    outro(pc.red('Operation cancelled'))
    process.exit(0)
  }

  return selected as AgentName
}

export async function confirmGitInit(): Promise<boolean> {
  const result = await confirm({
    message: 'Initialize git repository?',
    initialValue: true,
  })

  if (isCancel(result)) {
    outro(pc.red('Operation cancelled'))
    process.exit(0)
  }

  return result as boolean
}

/**
 * Full manual mode: prompts for name, features, and git init.
 */
export async function getManualConfig(projectName?: string): Promise<ScaffoldConfig> {
  const name = await getProjectName(projectName)
  const features = await selectFeatures()
  const shouldInitGit = await confirmGitInit()

  return {
    projectName: name,
    features,
    targetDir: name,
    shouldInitGit,
  }
}
