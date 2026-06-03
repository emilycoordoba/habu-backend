/** Respuesta de recurso único: { data: T } */
export interface ApiResponse<T> {
  data: T
}

/** Respuesta paginada: { data: T[], total, pagina, totalPaginas } */
export interface ApiListResponse<T> {
  data: T[]
  total: number
  pagina: number
  totalPaginas: number
}

/** Shape del error de la API */
export interface ApiError {
  error: {
    mensaje: string
    codigo?: string
  }
}
