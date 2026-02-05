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
  .name('create-zynth-app')
  .description('Create a new Zynth fullstack app')
  .version('0.0.5')
  .argument('[project-name]', 'Name of your project')
  .action(async (projectName?: string) => {
    console.clear()

    intro(pc.bgCyan(pc.black(' create-zynth-app ')))

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
        pc.dim(`  1. cd ${config.name}`) +
        '\n' +
        pc.dim(`  2. Edit ${pc.cyan('.env')} with your Cloudflare & Resend credentials`) +
        '\n' +
        pc.dim(`  3. ${config.shouldInstall ? '' : 'bun install && '}bun run dev`) +
        '\n\n' +
        pc.dim('See .env.example for required environment variables.'),
    )

    process.exit(0)
  })

program.parse()
