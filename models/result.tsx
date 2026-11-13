export interface Result<T> {
  data?: T
  statusCode?: number
  message?: string
  errors?: Record<string, string>
}
