'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { destroy, index, showBySlug, store } from '@/services/tag-service'
import { NO_ACCESS_MESSAGE, canManageTerms } from '@/lib/blog/access'
import { toTag } from '@/lib/blog/mappers'
import { toSlug } from '@/lib/blog/slug'
import { validateTermValues } from '@/lib/blog/validation'
import { Result } from '@/models/result'
import { Tag, TagValues } from '@/models/tag'

const UNAUTHENTICATED: Result<never> = {
  statusCode: 401,
  message: 'Not authenticated.',
}

const FORBIDDEN: Result<never> = {
  statusCode: 403,
  message: NO_ACCESS_MESSAGE,
}

export async function getTags(): Promise<Result<Tag[]>> {
  const session = await auth()
  if (!session) return UNAUTHENTICATED

  try {
    const tags = await index()
    return { data: tags.map(toTag), statusCode: 200 }
  } catch {
    return { statusCode: 500, message: 'Could not load tags.' }
  }
}

// Used by the editor's create-on-type tag picker: an existing tag with the
// same slug is returned instead of failing, so typing "nextjs" twice is safe.
export async function createTag({
  values,
}: {
  values: TagValues
}): Promise<Result<Tag>> {
  const session = await auth()
  if (!session) return UNAUTHENTICATED
  if (!canManageTerms(session.user.role)) return FORBIDDEN

  const name = (values.name ?? '').trim()
  const slug = toSlug((values.slug ?? '').trim() || name)
  const errors = validateTermValues({ name, slug })
  if (!slug && !errors.name) errors.name = 'Use at least one letter or number.'
  if (Object.keys(errors).length > 0) {
    return { statusCode: 422, message: Object.values(errors)[0], errors }
  }

  try {
    const existing = await showBySlug({ slug })
    if (existing) {
      const tags = await index()
      const counted = tags.find((tag) => tag.id === existing.id)!
      return { data: toTag(counted), statusCode: 200 }
    }

    const tag = await store({ data: { name, slug } })
    revalidatePath('/blog', 'layout')
    return { data: toTag(tag), statusCode: 200 }
  } catch {
    return { statusCode: 500, message: 'Could not create tag.' }
  }
}

export async function deleteTag({ id }: { id: string }): Promise<Result<null>> {
  const session = await auth()
  if (!session) return UNAUTHENTICATED
  if (!canManageTerms(session.user.role)) return FORBIDDEN

  try {
    await destroy({ id })
    revalidatePath('/blog', 'layout')
    return { data: null, statusCode: 200 }
  } catch {
    return { statusCode: 500, message: 'Could not delete tag.' }
  }
}
