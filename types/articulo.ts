// Tipos para la API de artículos
export interface ListaPrecio {
  id: number
  nombre: string
  esPrincipal: boolean
}

export interface ArticuloListaPrecio {
  id: number
  listaPrecioId: number
  articuloId: number
  precio: string
  fechaVigenciaDesde: string
  fechaVigenciaHasta: string | null
  activo: boolean
  createdAt: string
  updatedAt: string
  monedaId: number
  listaPrecio: ListaPrecio
}

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
  observaciones: string
  observacionesWeb: string
  articulosListaPrecio?: ArticuloListaPrecio[]
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

