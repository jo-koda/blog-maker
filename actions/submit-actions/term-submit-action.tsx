'use server'

import { validateTermValues } from '@/lib/blog/validation'
import { Category } from '@/models/category'
import { Result } from '@/models/result'
import { Tag } from '@/models/tag'
import { createCategory } from '../api-actions/category-action'
import { createTag } from '../api-actions/tag-action'

export type FormResult<T> = Result<T> & {
  submittedAt?: number
}

function readTerm(formData: FormData) {
  return {
    name: String(formData.get('name') ?? ''),
    slug: String(formData.get('slug') ?? '').trim(),
  }
}

export async function submitCreateCategory(
  _prevState: FormResult<Category> | null,
  formData: FormData,
): Promise<FormResult<Category>> {
  const values = {
    ...readTerm(formData),
    description: String(formData.get('description') ?? ''),
    parentId: String(formData.get('parentId') ?? '') || null,
  }

  const errors = validateTermValues(values)
  if (Object.keys(errors).length > 0) {
    return { statusCode: 422, errors, submittedAt: Date.now() }
  }

  const result = await createCategory({ values })
  return { ...result, submittedAt: Date.now() }
}

export async function submitCreateTag(
  _prevState: FormResult<Tag> | null,
  formData: FormData,
): Promise<FormResult<Tag>> {
  const values = readTerm(formData)

  const errors = validateTermValues(values)
  if (Object.keys(errors).length > 0) {
    return { statusCode: 422, errors, submittedAt: Date.now() }
  }

  const result = await createTag({ values })
  return { ...result, submittedAt: Date.now() }
}
