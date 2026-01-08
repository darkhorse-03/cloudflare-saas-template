export interface UploadResult {
  key: string
  url: string
  size: number
  contentType: string
}

export interface StorageError {
  code: 'STORAGE_DISABLED' | 'FILE_TOO_LARGE' | 'INVALID_TYPE' | 'UPLOAD_FAILED' | 'NOT_FOUND'
  message: string
}

// Use generic interface to avoid conflicts between different @cloudflare/workers-types versions
export interface R2BucketLike {
  put: (key: string, value: ArrayBuffer, options?: unknown) => Promise<unknown>
  get: (key: string) => Promise<R2ObjectBodyLike | null>
  delete: (key: string) => Promise<void>
  list: (options?: unknown) => Promise<{
    objects: Array<{ key: string; size: number; uploaded: Date }>
    truncated: boolean
    cursor?: string
  }>
}

export interface R2ObjectBodyLike {
  body: ReadableStream
  size: number
  httpEtag: string
  httpMetadata?: { contentType?: string }
}
