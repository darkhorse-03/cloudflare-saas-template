import type { JobHandler } from '../types'

const MAX_ATTEMPTS = 3

export const webhookDeliverHandler: JobHandler<'webhook.deliver'> = async (job, ctx) => {
  const { url, payload, attempt = 1 } = job

  ctx.log.info('job.webhook.deliver.start', { url, attempt })

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    ctx.log.info('job.webhook.deliver.complete', { url, status: response.status })
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err)
    ctx.log.error('job.webhook.deliver.failed', { url, attempt, error })

    if (attempt < MAX_ATTEMPTS) {
      throw new Error(`Webhook delivery failed (attempt ${attempt}/${MAX_ATTEMPTS}): ${error}`)
    }

    ctx.log.error('job.webhook.deliver.abandoned', { url, attempts: attempt })
  }
}
