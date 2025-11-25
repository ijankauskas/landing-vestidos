import type { ArticulosResponse, Articulo } from "@/types/articulo"

// Obtener la URL base de la API desde variables de entorno
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/"
const API_BASE_URL = "https://servicios.ecomsolver.com.ar/"
const API_KEY = "ecom_1_919f89353fb94505252c3e084fbf7c46"

/**
 * Variable de mantenimiento
 * Cambiar a true para activar la pantalla de mantenimiento
 */
export const MANTENIMIENTO_ACTIVO = false

/**
 * Función helper para manejar respuestas de la API
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`API Error: ${response.status} - ${error}`)
  }
  return response.json()
}

/**
 * Opciones de paginación y filtros para artículos
 */
export interface ArticulosOptions {
  page?: number
  limit?: number
  search?: string
  sort?: string
  order?: 'asc' | 'desc'
}

/**
 * Obtiene todos los artículos públicos con paginación y filtros
 * @param options - Opciones de paginación, búsqueda y ordenamiento
 */
export async function getArticulosPublicos(
  page: number = 1,
  limit: number = 10,
  options?: ArticulosOptions
): Promise<ArticulosResponse> {
  try {
    // Construir URL con parámetros de query
    const params = new URLSearchParams({
      apiKey: API_KEY,
      page: String(options?.page || page),
      limit: String(options?.limit || limit),
    })

    // Agregar parámetros opcionales si existen
    if (options?.search) {
      params.append('search', options.search)
    }
    if (options?.sort) {
      params.append('sort', options.sort)
    }
    if (options?.order) {
      params.append('order', options.order)
    }

    const url = `${API_BASE_URL}articulos/public/todos?${params.toString()}`
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY
      },
      // Opcional: agregar caché para mejorar performance
      next: { revalidate: 60 }, // Revalidar cada 60 segundos
    })

    return handleResponse<ArticulosResponse>(response)
  } catch (error) {
    console.error("Error fetching artículos públicos:", error)
    throw error
  }
}

/**
 * Obtiene un artículo específico por ID
 * @param id - ID del artículo
 */
export async function getArticuloById(id: number): Promise<Articulo | null> {
  try {
    const response = await getArticulosPublicos(1, 100) // Obtener varios para buscar
    const articulo = response.data.find((art) => art.id === id)
    return articulo || null
  } catch (error) {
    console.error(`Error fetching artículo ${id}:`, error)
    return null
  }
}

/**
 * Obtiene artículos destacados
 */
export async function getArticulosDestacados(): Promise<Articulo[]> {
  try {
    const response = await getArticulosPublicos(1, 100)
    return response.data.filter((art) => art.esDestacado)
  } catch (error) {
    console.error("Error fetching artículos destacados:", error)
    return []
  }
}

/**
 * Filtra artículos por categoría
 * @param categoria - Nombre de la categoría
 */
export async function getArticulosPorCategoria(
  categoria: string
): Promise<Articulo[]> {
  try {
    const response = await getArticulosPublicos(1, 100)
    if (!categoria || categoria === "Todos") {
      return response.data
    }
    return response.data.filter(
      (art) => art.categoria.toLowerCase() === categoria.toLowerCase()
    )
  } catch (error) {
    console.error(`Error fetching artículos por categoría ${categoria}:`, error)
    return []
  }
}

/**
 * Hook/función para obtener las imágenes de un artículo
 * @param articulo - El artículo del cual obtener imágenes
 * @returns Array de URLs de imágenes válidas
 */
export function getArticuloImages(articulo: Articulo): string[] {
  const images: string[] = []

  // Solo agregar imágenes que no sean null, undefined o vacías
  if (articulo.imagenPrincipal && articulo.imagenPrincipal.trim() !== '') {
    images.push(articulo.imagenPrincipal)
  }
  if (articulo.imagen2 && articulo.imagen2.trim() !== '') {
    images.push(articulo.imagen2)
  }
  if (articulo.imagen3 && articulo.imagen3.trim() !== '') {
    images.push(articulo.imagen3)
  }
  if (articulo.imagen4 && articulo.imagen4.trim() !== '') {
    images.push(articulo.imagen4)
  }
  if (articulo.imagen5 && articulo.imagen5.trim() !== '') {
    images.push(articulo.imagen5)
  }

  // Si no hay imágenes, usar placeholder
  if (images.length === 0) {
    images.push("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==")
  }

  return images
}

/**
 * Normaliza el nombre de categoría de la API al formato usado en el componente
 */
export function normalizarCategoria(categoria: string): string {
  const categoriaNormalizada = categoria.toUpperCase().trim()

  // Mapeo de categorías de la API a las del componente
  const mapeoCategories: { [key: string]: string } = {
    "VESTIDO": "Largos",
    "VESTIDOS": "Largos",
    "VESTIDO LARGO": "Largos",
    "VESTIDO CORTO": "Cortos",
    "ZAPATO": "Zapatos",
    "ZAPATOS": "Zapatos",
    "CALZADO": "Zapatos",
    "ABRIGO": "Abrigos",
    "ABRIGOS": "Abrigos",
    "ACCESORIO": "Accesorios",
    "ACCESORIOS": "Accesorios",
  }

  return mapeoCategories[categoriaNormalizada] || "Otros"
}

/**
 * Convierte un artículo de la API al formato usado en el componente
 */
export function convertirArticuloAProducto(articulo: Articulo) {
  const categoriaOriginal = articulo.categoria || "Otros"
  const categoriaNormalizada = normalizarCategoria(categoriaOriginal)

  return {
    id: articulo.id,
    name: articulo.descripcion,
    description: articulo.descripcionCorta || articulo.descripcion,
    fullDescription: articulo.descripcion,
    image: articulo.imagenPrincipal || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==",
    images: getArticuloImages(articulo),
    category: categoriaNormalizada,
    categoriaOriginal: categoriaOriginal, // Guardamos la categoría original de la API
    badges: [
      articulo.esDestacado ? "Más Popular" : null,
      "Disponible"
    ].filter(Boolean) as string[],
    rating: 4.5,
    reviews: 0,
    price: `$${parseFloat(articulo.precioVenta).toLocaleString("es-AR")}`,
    sizes: [], // Agregar lógica de tallas si es necesario
    colors: [], // Agregar lógica de colores si es necesario
    features: [
      articulo.marca ? `Marca: ${articulo.marca}` : null,
      `Categoría: ${categoriaOriginal}`,
      `Talle: ${articulo.observaciones ?? ''}`,
    ].filter(Boolean) as string[],
    occasion: [categoriaOriginal].filter(Boolean) as string[],
    observacionesWeb: articulo.observacionesWeb,
  }
}

/**
 * Interfaz para el DTO de crear lead público
 */
export interface CreateLeadPublicDto {
  nombre: string
  apellido?: string
  email: string
  telefono?: string
  dni?: string
  crearCita?: boolean
  fecha?: string // YYYY-MM-DD
  horario?: string // HH:MM
}

/**
 * Interfaz para la respuesta del lead
 */
export interface LeadResponse {
  success: boolean
  message: string
  data?: any
}

/**
 * Crea un lead público (reserva de cita)
 * @param leadData - Datos del lead/cita
 */
export async function crearLeadPublico(
  leadData: CreateLeadPublicDto
): Promise<LeadResponse> {
  try {
    const url = `${API_BASE_URL}lead/public`
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
      body: JSON.stringify(leadData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Error HTTP: ${response.status}`)
    }

    const data = await response.json()

    return {
      success: true,
      message: data.message || "Lead creado exitosamente",
      data: data,
    }
  } catch (error) {
    console.error("Error creando lead público:", error)

    return {
      success: false,
      message: error instanceof Error ? error.message : "Error al crear el lead",
    }
  }
}

/**
 * Helper para separar nombre completo en nombre y apellido
 */
export function separarNombreCompleto(nombreCompleto: string): { nombre: string; apellido?: string } {
  const partes = nombreCompleto.trim().split(/\s+/)

  if (partes.length === 1) {
    return { nombre: partes[0] }
  }

  const nombre = partes[0]
  const apellido = partes.slice(1).join(' ')

  return { nombre, apellido }
}

/**
 * Helper para formatear fecha de Date a YYYY-MM-DD
 */
export function formatearFechaAPI(fecha: Date): string {
  const year = fecha.getFullYear()
  const month = String(fecha.getMonth() + 1).padStart(2, '0')
  const day = String(fecha.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

