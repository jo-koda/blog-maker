import { Category } from '@/models/category'

// Flattens the category tree depth-first so selects and tables can show
// children under their parent with a "— " prefix per level.
export function categoryOptions(categories: Category[]) {
  const byParent = new Map<string | null, Category[]>()
  for (const category of categories) {
    const siblings = byParent.get(category.parentId) ?? []
    siblings.push(category)
    byParent.set(category.parentId, siblings)
  }

  const options: { id: string; label: string }[] = []
  function walk(parentId: string | null, depth: number) {
    for (const category of byParent.get(parentId) ?? []) {
      options.push({
        id: category.id,
        label: `${'— '.repeat(depth)}${category.name}`,
      })
      walk(category.id, depth + 1)
    }
  }
  walk(null, 0)
  return options
}
