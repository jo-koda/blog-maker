export type Role = 'ADMIN' | 'EDITOR' | 'AUTHOR'

export interface User {
  id: string
  email: string
  name: string
  slug: string
  role: Role
  bio: string | null
  avatarUrl: string | null
}

export interface SessionUser {
  id: string
  email: string
  name: string
  role: Role
}
