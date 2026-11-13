import { Role } from '@/models/user'

export const NO_ACCESS_MESSAGE = 'You do not have access to do that.'

export function canPublish(role: Role) {
  return role === 'ADMIN' || role === 'EDITOR'
}

export function canManageTerms(role: Role) {
  return role === 'ADMIN' || role === 'EDITOR'
}

export function canEditPost(
  user: { id: string; role: Role },
  post: { authorId: string },
) {
  return canPublish(user.role) || post.authorId === user.id
}
