export type FeatureName =
  | 'storage'
  | 'payments'
  | 'email'
  | 'jobs'
  | 'workflows'
  | 'turnstile'
  | 'docs'
  | 'marketing'
  | 'google-oauth'
  | 'github-oauth'

// 'demo' is always stripped, never a user choice
export type StrippableFeature = FeatureName | 'demo'

export interface FeatureDefinition {
  name: FeatureName
  label: string
  description: string
  use_when: string
  recommended_with: FeatureName[]
  depends_on: FeatureName[]
  env_vars: { name: string; url: string }[]
}

export interface ScaffoldConfig {
  projectName: string
  features: FeatureName[]
  targetDir: string
  shouldInitGit: boolean
}

export type AgentName = 'claude' | 'cursor' | 'codex' | 'windsurf' | 'vscode'
