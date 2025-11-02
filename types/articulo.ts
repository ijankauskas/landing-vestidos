// Tipos para la API de artículos
export interface Articulo {
  id: number
  codigo: string
  codigoBarras: string
  descripcion: string
  descripcionCorta: string
  marca: string
  categoria: string
  unidadMedida: string
  precioVenta: string
  esServicio: boolean
  exentoIva: boolean
  imagenPrincipal: string
  imagen2: string
  imagen3: string
  imagen4: string
  imagen5: string
  esDestacado: boolean
}

export interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ArticulosResponse {
  data: Articulo[]
  pagination: Pagination
}

