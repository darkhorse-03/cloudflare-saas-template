import { config } from '@repo/config'
import { $ } from 'bun'

await $`alchemy dev --app ${config.appName}-web`
