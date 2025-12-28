import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'
import { config } from '@repo/config'
import { Zap } from 'lucide-react'

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <div className="flex items-center gap-2 font-semibold">
          <Zap className="size-5 fill-yellow-400 text-yellow-400" />
          {config.appName} Docs
        </div>
      ),
    },
    links: [
      {
        text: 'Dashboard',
        url: config.webUrl,
        active: 'nested-url',
      },
      {
        text: 'GitHub',
        url: 'https://github.com',
        active: 'nested-url',
      },
    ],
    themeSwitch: {
      enabled: true,
    },
  }
}
