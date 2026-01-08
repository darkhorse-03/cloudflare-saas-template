import { config } from '@repo/config'
import { Hono } from 'hono'
import type { AppContext } from '@/env'
import { createStorageService } from '@/lib/storage'
import { getAuthUser, requireAuth } from '@/middleware/auth'

export const avatarRoutes = new Hono<AppContext>()
  // Upload avatar
  .post('/', requireAuth, async (c) => {
    const storage = createStorageService(c.env.R2)

    if (!storage.isEnabled()) {
      return c.json({ error: 'Storage is not enabled' }, 503)
    }

    const user = getAuthUser(c)
    const formData = await c.req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return c.json({ error: 'No file provided' }, 400)
    }

    // Validate with avatar-specific limits
    const { maxSize, allowedTypes } = config.storage.avatars
    const validationError = storage.validateFile(
      { size: file.size, type: file.type },
      { maxSize, allowedTypes },
    )

    if (validationError) {
      return c.json({ error: validationError.message, code: validationError.code }, 400)
    }

    // Delete old avatar if exists
    const oldAvatarPrefix = `avatars/${user.id}/`
    const existingAvatars = await storage.list({ prefix: oldAvatarPrefix, limit: 10 })
    for (const obj of existingAvatars.objects) {
      await storage.delete(obj.key)
    }

    // Generate key for new avatar (use simple structure for avatars)
    const ext = file.name.split('.').pop() || 'jpg'
    const key = `avatars/${user.id}/avatar.${ext}`

    // Upload new avatar
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
      return c.json({ error: result.message, code: result.code }, 500)
    }

    return c.json({ avatar: result }, 201)
  })

  // Get current user's avatar
  .get('/me', requireAuth, async (c) => {
    const storage = createStorageService(c.env.R2)

    if (!storage.isEnabled()) {
      return c.json({ error: 'Storage is not enabled' }, 503)
    }

    const user = getAuthUser(c)
    const prefix = `avatars/${user.id}/`
    const result = await storage.list({ prefix, limit: 1 })

    if (result.objects.length === 0) {
      return c.json({ avatar: null })
    }

    const avatarKey = result.objects[0].key
    return c.json({
      avatar: {
        key: avatarKey,
        url: storage.getPublicUrl(avatarKey),
      },
    })
  })

  // Delete current user's avatar
  .delete('/me', requireAuth, async (c) => {
    const storage = createStorageService(c.env.R2)

    if (!storage.isEnabled()) {
      return c.json({ error: 'Storage is not enabled' }, 503)
    }

    const user = getAuthUser(c)
    const prefix = `avatars/${user.id}/`
    const result = await storage.list({ prefix, limit: 10 })

    for (const obj of result.objects) {
      await storage.delete(obj.key)
    }

    return c.json({ success: true })
  })

  // Get avatar by user ID (public endpoint for displaying avatars)
  .get('/:userId', async (c) => {
    const storage = createStorageService(c.env.R2)

    if (!storage.isEnabled()) {
      return c.json({ error: 'Storage is not enabled' }, 503)
    }

    const userId = c.req.param('userId')
    const prefix = `avatars/${userId}/`
    const result = await storage.list({ prefix, limit: 1 })

    if (result.objects.length === 0) {
      return c.notFound()
    }

    // Serve the avatar image directly
    const avatarKey = result.objects[0].key
    const object = await storage.get(avatarKey)

    if (!object) {
      return c.notFound()
    }

    const headers = new Headers()
    headers.set('Content-Type', object.httpMetadata?.contentType || 'image/jpeg')
    headers.set('Content-Length', String(object.size))
    headers.set('Cache-Control', 'public, max-age=3600') // 1 hour cache for avatars
    headers.set('ETag', object.httpEtag)

    return new Response(object.body, { headers })
  })
