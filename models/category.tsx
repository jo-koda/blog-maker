export interface Category {
  id: string
  slug: string
  name: string
  description: string | null
  parentId: string | null
  postCount: number
}

export interface CategoryValues {
  name?: string
  slug?: string
  description?: string
  parentId?: string | null
}
