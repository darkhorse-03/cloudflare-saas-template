import { config } from '@repo/config'
import type { R2BucketLike, R2ObjectBodyLike, StorageError, UploadResult } from './types'

export class StorageService {
  private readonly r2: R2BucketLike | undefined

  constructor(r2: R2BucketLike | undefined) {
    this.r2 = r2
  }

  /**
   * Check if storage is available
   */
  isEnabled(): boolean {
    return config.storage.enabled && !!this.r2
  }

  /**
   * Validate file before upload
   */
  validateFile(
    file: { size: number; type: string },
    options?: { maxSize?: number; allowedTypes?: readonly string[] },
  ): StorageError | null {
    const maxSize = options?.maxSize ?? config.storage.maxFileSize
    const allowedTypes = options?.allowedTypes ?? config.storage.allowedMimeTypes

    if (file.size > maxSize) {
      return {
        code: 'FILE_TOO_LARGE',
        message: `File size exceeds maximum allowed size of ${Math.round(maxSize / 1024 / 1024)}MB`,
      }
    }

    if (!this.isTypeAllowed(file.type, allowedTypes)) {
      return {
        code: 'INVALID_TYPE',
        message: `File type '${file.type}' is not allowed. Allowed types: ${allowedTypes.join(', ')}`,
      }
    }

    return null
  }

  /**
   * Upload a file to R2
   */
  async upload(
    key: string,
    data: ArrayBuffer,
    options: {
      contentType: string
      size: number
      metadata?: Record<string, string>
    },
  ): Promise<UploadResult | StorageError> {
    if (!this.r2) {
      return { code: 'STORAGE_DISABLED', message: 'Storage is not enabled' }
    }

    try {
      await this.r2.put(key, data, {
        httpMetadata: {
          contentType: options.contentType,
        },
        customMetadata: options.metadata,
      })

      return {
        key,
        url: this.getPublicUrl(key),
        size: options.size,
        contentType: options.contentType,
      }
    } catch (error) {
      console.error('Upload failed:', error)
      return { code: 'UPLOAD_FAILED', message: 'Failed to upload file' }
    }
  }

  /**
   * Get a file from R2
   */
  get(key: string): Promise<R2ObjectBodyLike | null> {
    if (!this.r2) {
      return Promise.resolve(null)
    }
    return this.r2.get(key)
  }

  /**
   * Delete a file from R2
   */
  async delete(key: string): Promise<boolean> {
    if (!this.r2) {
      return false
    }
    try {
      await this.r2.delete(key)
      return true
    } catch {
      return false
    }
  }

  /**
   * List files with optional prefix
   */
  async list(options?: { prefix?: string; limit?: number; cursor?: string }) {
    if (!this.r2) {
      return { objects: [], truncated: false }
    }

    const result = await this.r2.list({
      prefix: options?.prefix,
      limit: options?.limit ?? 100,
      cursor: options?.cursor,
    })

    return {
      objects: result.objects.map((obj) => ({
        key: obj.key,
        size: obj.size,
        uploaded: obj.uploaded,
      })),
      truncated: result.truncated,
      cursor: result.truncated ? result.cursor : undefined,
    }
  }

  /**
   * Generate a unique key for uploads
   */
  generateKey(prefix: string, filename: string, userId?: string): string {
    const timestamp = Date.now()
    const random = crypto.randomUUID().slice(0, 8)
    const safeFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_')

    if (userId) {
      return `${prefix}/${userId}/${timestamp}-${random}-${safeFilename}`
    }
    return `${prefix}/${timestamp}-${random}-${safeFilename}`
  }

  /**
   * Get public URL for a file
   * Note: Requires R2 bucket to be configured with public access or custom domain
   */
  getPublicUrl(key: string): string {
    // This URL pattern depends on your R2 configuration
    // Option 1: R2.dev subdomain (if public access enabled)
    // Option 2: Custom domain mapped to R2
    // For now, return a relative API path that can serve the file
    // Encode each path segment but preserve slashes
    const encodedKey = key
      .split('/')
      .map((segment) => encodeURIComponent(segment))
      .join('/')
    return `/storage/files/${encodedKey}`
  }

  /**
   * Check if a mime type matches allowed patterns
   */
  private isTypeAllowed(mimeType: string, allowedTypes: readonly string[]): boolean {
    return allowedTypes.some((allowed) => {
      if (allowed.endsWith('/*')) {
        // Wildcard match (e.g., 'image/*')
        const category = allowed.slice(0, -2)
        return mimeType.startsWith(`${category}/`)
      }
      return mimeType === allowed
    })
  }
}

/**
 * Create a storage service instance
 */
// biome-ignore lint/suspicious/noExplicitAny: R2Bucket type varies between packages
export function createStorageService(r2?: any): StorageService {
  return new StorageService(r2)
}

// Re-export types
export type { R2BucketLike, R2ObjectBodyLike, StorageError, UploadResult } from './types'
