import { createApiClient } from '@repo/api-client'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787'

export const api = createApiClient(API_URL)
