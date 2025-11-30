import { hcWithType } from '@repo/api/hc'

export const api = hcWithType('/api', {
    init: {
        credentials: 'include',
    },
})
