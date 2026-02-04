import type { JobHandler } from '../types'

export const exportGenerateHandler: JobHandler<'export.generate'> = async (job, ctx) => {
  const { userId, format, rows } = job

  ctx.log.info('job.export.generate.start', { userId, format, rows })

  // Generate random data
  const data = Array.from({ length: rows }, (_, i) => ({
    id: crypto.randomUUID(),
    name: `Item ${i + 1}`,
    value: Math.floor(Math.random() * 1000),
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  }))

  let content: string
  if (format === 'csv') {
    const headers = 'id,name,value,createdAt'
    const csvRows = data.map((row) => `${row.id},${row.name},${row.value},${row.createdAt}`)
    content = [headers, ...csvRows].join('\n')
  } else {
    content = JSON.stringify(data, null, 2)
  }

  // Store in R2 if available
  if (ctx.env.R2) {
    const key = `exports/${userId}/${Date.now()}.${format}`
    await ctx.env.R2.put(key, content, {
      httpMetadata: {
        contentType: format === 'csv' ? 'text/csv' : 'application/json',
      },
    })
    ctx.log.info('job.export.generate.complete', { userId, format, rows, key })
  } else {
    ctx.log.info('job.export.generate.complete', { userId, format, rows, stored: false })
  }
}
