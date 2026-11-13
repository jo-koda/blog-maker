import slugify from 'slugify'

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function toSlug(text: string) {
  return slugify(text, { lower: true, strict: true, trim: true })
}

// Appends -2, -3, … until `isTaken` reports a free slug, the same way
// WordPress resolves collisions.
export async function uniqueSlug(
  base: string,
  isTaken: (slug: string) => Promise<boolean>,
) {
  const root = toSlug(base) || 'untitled'
  let slug = root
  let n = 1
  while (await isTaken(slug)) {
    n += 1
    slug = `${root}-${n}`
  }
  return slug
}
