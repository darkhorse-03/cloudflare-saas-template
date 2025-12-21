import { config } from '@repo/config'
import { $ } from 'bun'

await $`alchemy deploy --app ${config.appName}-web`
