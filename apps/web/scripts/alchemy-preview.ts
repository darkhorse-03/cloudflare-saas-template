import { config } from '@repo/config'
import { $ } from 'bun'

await $`alchemy run --app ${config.appName}-web`
