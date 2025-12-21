export type User = {
  id: string
  email: string
  name: string
  emailVerified: boolean
  image?: string | null
  createdAt: Date
  updatedAt: Date
}

export type AuthContext = {
  isAuthenticated: boolean
  user: User | null
}

export type RouteContext = {
  auth: AuthContext
}
