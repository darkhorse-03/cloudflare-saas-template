export interface User {
  id: string
  email: string
  name: string
  emailVerified: boolean
  image?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface AuthContext {
  isAuthenticated: boolean
  user: User | null
}

export interface RouteContext {
  auth: AuthContext
}
