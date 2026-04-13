#!/usr/bin/env node

import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { intro, outro, spinner } from '@clack/prompts'
import { program } from 'commander'
import pc from 'picocolors'
import { cloneTemplate } from './helpers/clone.js'
import { initGit } from './helpers/git.js'
import { getManualConfig, getProjectName, selectAgent } from './helpers/prompts.js'
import { writeBootstrapContext } from './launcher/bootstrap.js'
import { detectAgents } from './launcher/detect.js'
import { launchAgent } from './launcher/launch.js'
import { scaffold } from './scaffold/engine.js'
import { ALL_FEATURES, FEATURE_CATALOG } from './scaffold/features.js'
import type { FeatureName } from './types.js'

program
  .name('create-zynth-app')
  .description('Create a new Zynth fullstack app')
  .version('1.0.0')
  .argument('[project-name]', 'Name of your project')
  .option('--scaffold', 'Scaffold mode: clone template and strip features')
  .option('--features <list>', 'Comma-separated features to include (with --scaffold)')
  .option('--name <name>', 'Project name (with --scaffold)')
  .option('--dir <path>', 'Target directory (with --scaffold, defaults to current dir)')
  .option('--manual', 'Interactive feature selection via prompts')
  .option('--manifest', 'Print feature catalog as JSON')
  .action(
    async (
      projectName?: string,
      options?: {
        scaffold?: boolean
        features?: string
        name?: string
        dir?: string
        manual?: boolean
        manifest?: boolean
      },
    ) => {
      // --manifest: dump feature catalog and exit
      if (options?.manifest) {
        console.log(JSON.stringify(FEATURE_CATALOG, null, 2))
        process.exit(0)
      }

      // --scaffold: deterministic scaffold mode (called by agents)
      if (options?.scaffold) {
        await handleScaffoldMode(options)
        process.exit(0)
      }

      // Interactive modes
      console.clear()
      intro(pc.bgCyan(pc.black(' create-zynth-app ')))

      // --manual: Clack prompts for feature selection
      if (options?.manual) {
        await handleManualMode(projectName)
        process.exit(0)
      }

      // Default: agent launcher mode
      await handleLauncherMode(projectName)
    },
  )

program.parse()

/**
 * Scaffold mode: clone + strip. Called by AI agents.
 * bunx create-zynth-app --scaffold --features storage,payments --name my-app --dir .
 */
async function handleScaffoldMode(options: {
  features?: string
  name?: string
  dir?: string
}): Promise<void> {
  if (!options.features) {
    console.error(pc.red('Error: --scaffold requires --features <list>'))
    console.error(pc.dim('Example: --scaffold --features storage,payments,email'))
    process.exit(1)
  }

  const featureList = options.features.split(',').map((f) => f.trim()) as FeatureName[]

  // Validate feature names
  for (const f of featureList) {
    if (!ALL_FEATURES.includes(f)) {
      console.error(pc.red(`Error: Unknown feature "${f}"`))
      console.error(pc.dim(`Valid features: ${ALL_FEATURES.join(', ')}`))
      process.exit(1)
    }
  }

  const projectName = options.name || 'my-app'
  const targetDir = resolve(options.dir || '.')

  // Clone template
  const s = spinner()
  s.start('Cloning template...')
  await cloneTemplate(targetDir)
  s.stop('Template cloned')

  // Run scaffold engine
  s.start('Stripping features...')
  const result = await scaffold({
    projectName,
    features: featureList,
    targetDir,
    shouldInitGit: false,
  })
  s.stop('Scaffold complete')

  // Print summary
  console.log('')
  console.log(
    pc.green(`✓ Scaffolded "${projectName}" with features: ${result.selectedFeatures.join(', ')}`),
  )

  // List required env vars
  const envVars = featureList.flatMap((f) => FEATURE_CATALOG[f].env_vars)
  if (envVars.length > 0) {
    console.log('')
    console.log(pc.bold('Environment variables needed:'))
    for (const env of envVars) {
      console.log(pc.dim(`  ${env.name} — ${env.url}`))
    }
  }

  console.log('')
  console.log(pc.bold('Next steps:'))
  console.log(pc.dim('  1. Create .env from .env.example'))
  console.log(pc.dim('  2. bun install'))
  console.log(pc.dim('  3. bun dev'))
}

/**
 * Manual mode: interactive Clack prompts for feature selection.
 */
async function handleManualMode(projectName?: string): Promise<void> {
  const config = await getManualConfig(projectName)

  const s = spinner()
  s.start('Cloning template...')
  await cloneTemplate(config.projectName)
  s.stop('Template cloned')

  s.start('Configuring project...')
  await scaffold({
    ...config,
    targetDir: config.projectName,
  })
  s.stop('Project configured')

  if (config.shouldInitGit) {
    await initGit(config.projectName)
  }

  outro(
    pc.green(`✓ ${config.projectName} created successfully!`) +
      '\n\n' +
      pc.bold('Next steps:') +
      '\n' +
      pc.dim(`  1. cd ${config.projectName}`) +
      '\n' +
      pc.dim(`  2. Edit ${pc.cyan('.env')} with your credentials`) +
      '\n' +
      pc.dim('  3. bun install && bun dev'),
  )
}

/**
 * Default launcher mode: create dir, write bootstrap context, detect/launch agent.
 */
async function handleLauncherMode(projectName?: string): Promise<void> {
  const name = await getProjectName(projectName)
  const projectDir = resolve(name)

  // Create project directory
  mkdirSync(projectDir, { recursive: true })

  // Write bootstrap context files for all agents
  writeBootstrapContext(projectDir, name)

  // Detect installed agents
  const agents = detectAgents()

  if (agents.length === 0) {
    // No agents found — fall back to manual mode
    outro(
      pc.yellow('No AI agents detected. Falling back to manual mode.') +
        '\n' +
        pc.dim('Install Claude Code, Cursor, or Codex for the AI-guided experience.'),
    )
    const config = await getManualConfig(name)
    const s = spinner()
    s.start('Cloning template...')
    await cloneTemplate(config.projectName)
    s.stop('Template cloned')
    s.start('Configuring project...')
    await scaffold({ ...config, targetDir: config.projectName })
    s.stop('Project configured')
    return
  }

  let agentToLaunch = agents[0].name

  if (agents.length > 1) {
    agentToLaunch = await selectAgent(agents)
  }

  const agentDisplay = agents.find((a) => a.name === agentToLaunch)?.displayName ?? agentToLaunch

  outro(
    pc.green(`✓ Project directory created at ${pc.bold(name)}`) +
      '\n' +
      pc.dim(`  Launching ${agentDisplay}... Tell it what you're building!`),
  )

  launchAgent(agentToLaunch, projectDir)
}
