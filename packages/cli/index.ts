#!/usr/bin/env node

import { intro, outro } from '@clack/prompts'
import { program } from 'commander'
import pc from 'picocolors'
import { cloneTemplate } from './helpers/clone.js'
import { updateConfig } from './helpers/config.js'
import { initGit } from './helpers/git.js'
import { installDependencies } from './helpers/install.js'
import { getProjectConfig } from './helpers/prompts.js'

program
  .name('create-underdog-app')
  .description('Create a new Underdog fullstack app')
  .version('0.0.1')
  .argument('[project-name]', 'Name of your project')
  .action(async (projectName?: string) => {
    console.clear()

    intro(pc.bgCyan(pc.black(' create-underdog-app ')))

    const config = await getProjectConfig(projectName)

    await cloneTemplate(config.name)
    await updateConfig(config)

    if (config.shouldInitGit) {
      await initGit(config.name)
    }

    if (config.shouldInstall) {
      await installDependencies(config.name)
    }

    outro(
      pc.green(`✓ ${config.name} created successfully!`) +
        '\n\n' +
        pc.bold('Next steps:') +
        '\n' +
        pc.dim(`  cd ${config.name}`) +
        '\n' +
        pc.dim(`  ${config.shouldInstall ? '' : 'bun install\n  '}bun run dev`) +
        '\n\n' +
        pc.dim('Happy coding! 🚀'),
    )

    process.exit(0)
  })

program.parse()
