import type { api } from '../alchemy.run'

export type WorkerEnv = typeof api.Env

declare module 'cloudflare:workers' {
  // biome-ignore lint/style/noNamespace: Required for Cloudflare module augmentation
  namespace Cloudflare {
    export interface Env extends WorkerEnv {}
  }
}
