import 'server-only'

import { CategoryRecord, cuid, db } from '@/lib/mock/db'

export async function index() {
  return db.categories
    .map((category) => ({
      ...category,
      _count: {
        posts: db.posts.filter((post) => post.categoryId === category.id)
          .length,
      },
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export async function show({ id }: { id: string }) {
  return db.categories.find((category) => category.id === id) ?? null
}

export async function slugTaken({ slug }: { slug: string }) {
  return db.categories.some((category) => category.slug === slug)
}

export async function store({ data }: { data: Omit<CategoryRecord, 'id'> }) {
  const category: CategoryRecord = { ...data, id: cuid() }
  db.categories.push(category)
  return { ...category, _count: { posts: 0 } }
}

export async function destroy({ id }: { id: string }) {
  db.categories = db.categories
    .filter((category) => category.id !== id)
    .map((category) =>
      category.parentId === id ? { ...category, parentId: null } : category,
    )
  db.posts = db.posts.map((post) =>
    post.categoryId === id ? { ...post, categoryId: null } : post,
  )
}
