import { PostStatus, PostValues } from '@/models/post'
import { SLUG_PATTERN } from './slug'

function isUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function isImageSrc(value: string) {
  return isUrl(value) || /^\/media\/[\w./-]+$/.test(value)
}

export function validatePostValues(values: PostValues, status: PostStatus) {
  const errors: Record<string, string> = {}
  const publishing = status === 'PUBLISHED' || status === 'SCHEDULED'

  if (publishing && !values.title.trim()) {
    errors.title = 'Add a title before publishing.'
  }
  if (values.title.length > 200) {
    errors.title = 'Keep the title under 200 characters.'
  }
  if (values.slug && !SLUG_PATTERN.test(values.slug)) {
    errors.slug = 'Use lowercase letters, numbers, and single dashes.'
  }
  if (values.excerpt.length > 500) {
    errors.excerpt = 'Keep the excerpt under 500 characters.'
  }
  if (values.coverImageUrl && !isImageSrc(values.coverImageUrl)) {
    errors.coverImageUrl = 'Upload an image or enter a full http(s) URL.'
  }
  if (values.coverImageUrl && !values.coverImageAlt.trim()) {
    errors.coverImageAlt = 'Describe the cover image for screen readers.'
  }
  if (values.canonicalUrl && !isUrl(values.canonicalUrl)) {
    errors.canonicalUrl = 'Enter a full http(s) URL.'
  }
  if (values.seoTitle.length > 70) {
    errors.seoTitle = 'Keep the SEO title under 70 characters.'
  }
  if (values.seoDescription.length > 160) {
    errors.seoDescription = 'Keep the description under 160 characters.'
  }
  if (status === 'SCHEDULED') {
    if (!values.scheduledAt) {
      errors.scheduledAt = 'Pick a date to schedule this post.'
    } else if (new Date(values.scheduledAt).getTime() <= Date.now()) {
      errors.scheduledAt = 'The schedule date must be in the future.'
    }
  }

  return errors
}

export function validateTermValues({
  name,
  slug,
}: {
  name: string
  slug: string
}) {
  const errors: Record<string, string> = {}
  if (!name.trim()) errors.name = 'Name is required.'
  if (name.length > 60) errors.name = 'Keep the name under 60 characters.'
  if (slug && !SLUG_PATTERN.test(slug)) {
    errors.slug = 'Use lowercase letters, numbers, and single dashes.'
  }
  return errors
}
