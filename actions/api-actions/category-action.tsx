'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import {
  destroy,
  index,
  show,
  slugTaken,
  store,
} from '@/services/category-service'
import { NO_ACCESS_MESSAGE, canManageTerms } from '@/lib/blog/access'
import { toCategory } from '@/lib/blog/mappers'
import { toSlug } from '@/lib/blog/slug'
import { validateTermValues } from '@/lib/blog/validation'
import { Category, CategoryValues } from '@/models/category'
import { Result } from '@/models/result'

const UNAUTHENTICATED: Result<never> = {
  statusCode: 401,
  message: 'Not authenticated.',
}

const FORBIDDEN: Result<never> = {
  statusCode: 403,
  message: NO_ACCESS_MESSAGE,
}

export async function getCategories(): Promise<Result<Category[]>> {
  const session = await auth()
  if (!session) return UNAUTHENTICATED

  try {
    const categories = await index()
    return { data: categories.map(toCategory), statusCode: 200 }
  } catch {
    return { statusCode: 500, message: 'Could not load categories.' }
  }
}

export async function createCategory({
  values,
}: {
  values: CategoryValues
}): Promise<Result<Category>> {
  const session = await auth()
  if (!session) return UNAUTHENTICATED
  if (!canManageTerms(session.user.role)) return FORBIDDEN

  const name = (values.name ?? '').trim()
  const slug = toSlug((values.slug ?? '').trim() || name)
  const errors = validateTermValues({ name, slug })
  if (Object.keys(errors).length > 0) {
    return { statusCode: 422, message: Object.values(errors)[0], errors }
  }
  if (await slugTaken({ slug })) {
    return {
      statusCode: 409,
      message: 'A category with this slug already exists.',
      errors: { slug: 'A category with this slug already exists.' },
    }
  }

  const parentId = values.parentId || null
  if (parentId && !(await show({ id: parentId }))) {
    return { statusCode: 422, message: 'Parent category not found.' }
  }

  try {
    const category = await store({
      data: {
        name,
        slug,
        description: (values.description ?? '').trim() || null,
        parentId,
      },
    })
    revalidatePath('/blog', 'layout')
    return { data: toCategory(category), statusCode: 200 }
  } catch {
    return { statusCode: 500, message: 'Could not create category.' }
  }
}

export async function deleteCategory({
  id,
}: {
  id: string
}): Promise<Result<null>> {
  const session = await auth()
  if (!session) return UNAUTHENTICATED
  if (!canManageTerms(session.user.role)) return FORBIDDEN

  try {
    await destroy({ id })
    revalidatePath('/blog', 'layout')
    return { data: null, statusCode: 200 }
  } catch {
    return { statusCode: 500, message: 'Could not delete category.' }
  }
}
