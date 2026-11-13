import { Category } from '@/models/category'

export interface CategoriesState {
  categories: Category[]
  loading: boolean
  deleteTargetId: string | null
  deleting: boolean
}
