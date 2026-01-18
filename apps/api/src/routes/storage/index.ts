import { config } from '@repo/config'
import { Hono } from 'hono'
import type { AppContext } from '@/env'
import { createStorageService } from '@/lib/storage'
import { getAuthUser, requireAuth } from '@/middleware/auth'
import { avatarRoutes } from './avatars'

export const storageRoutes = new Hono<AppContext>()
  // Avatar routes
  .route('/avatars', avatarRoutes)
  // Check if storage is enabled
  .get('/status', (c) => {
    const storage = createStorageService(c.env.R2)
    return c.json({
      enabled: storage.isEnabled(),
      maxFileSize: config.storage.maxFileSize,
      allowedTypes: config.storage.allowedMimeTypes,
    })
  })

  // Upload a file
  .post('/upload', requireAuth, async (c) => {
    const storage = createStorageService(c.env.R2)

    if (!storage.isEnabled()) {
      return c.json({ error: 'Storage is not enabled' }, 503)
    }

    const user = getAuthUser(c)
    const formData = await c.req.formData()
    const file = formData.get('file') as File | null
    const prefix = (formData.get('prefix') as string) || 'uploads'

    if (!file) {
      return c.json({ error: 'No file provided' }, 400)
    }

    // Validate file
    const validationError = storage.validateFile({
      size: file.size,
      type: file.type,
    })

    if (validationError) {
      return c.json({ error: validationError.message, code: validationError.code }, 400)
    }

    // Generate unique key
    const key = storage.generateKey(prefix, file.name, user.id)

    // Upload file
    const result = await storage.upload(key, await file.arrayBuffer(), {
      contentType: file.type,
      size: file.size,
      metadata: {
        userId: user.id,
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
      },
    })

    if ('code' in result) {
      c.get('log').error('storage.upload.failed', { code: result.code, userId: user.id })
      return c.json({ error: result.message, code: result.code }, 500)
    }

    c.get('log').info('storage.upload', { key, size: file.size, userId: user.id })
    return c.json({ file: result }, 201)
  })

  // Get file (serves the file content)
  .get('/files/:key{.+}', async (c) => {
    const storage = createStorageService(c.env.R2)

    if (!storage.isEnabled()) {
      return c.json({ error: 'Storage is not enabled' }, 503)
    }

    const key = c.req.param('key')
    const object = await storage.get(key)

    if (!object) {
      return c.json({ error: 'File not found' }, 404)
    }

    const headers = new Headers()
    headers.set('Content-Type', object.httpMetadata?.contentType || 'application/octet-stream')
    headers.set('Content-Length', String(object.size))
    headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    headers.set('ETag', object.httpEtag)

    return new Response(object.body, { headers })
  })

  // List user's files
  .get('/list', requireAuth, async (c) => {
    const storage = createStorageService(c.env.R2)

    if (!storage.isEnabled()) {
      return c.json({ error: 'Storage is not enabled' }, 503)
    }

    const user = getAuthUser(c)
    const prefix = c.req.query('prefix') || `uploads/${user.id}`
    const limit = Number(c.req.query('limit')) || 50
    const cursor = c.req.query('cursor')

    const result = await storage.list({ prefix, limit, cursor })

    return c.json(result)
  })

  // Delete a file
  .delete('/files/:key{.+}', requireAuth, async (c) => {
    const storage = createStorageService(c.env.R2)

    if (!storage.isEnabled()) {
      return c.json({ error: 'Storage is not enabled' }, 503)
    }

    const user = getAuthUser(c)
    const key = c.req.param('key')

    // Verify the file belongs to this user (key should contain user ID)
    if (!key.includes(user.id)) {
      return c.json({ error: 'Unauthorized' }, 403)
    }

    const deleted = await storage.delete(key)

    if (!deleted) {
      c.get('log').error('storage.delete.failed', { key, userId: user.id })
      return c.json({ error: 'Failed to delete file' }, 500)
    }

    c.get('log').info('storage.delete', { key, userId: user.id })
    return c.json({ success: true })
  })
