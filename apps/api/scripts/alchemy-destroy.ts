import { config } from '@repo/config'
import { $ } from 'bun'

await $`alchemy destroy --app ${config.appName}-api`
